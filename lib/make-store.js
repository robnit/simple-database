const fs = require('fs');
const path = require ('path');
const shortid = require('shortid');

const promisify = require('util').promisify;
const writefilePromise = promisify(fs.writeFile);
const readfilePromise = promisify(fs.readFile);
const unlinkPromise = promisify(fs.unlink);
const readdirPromise = promisify(fs.readdir);

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave){
        objectToSave._id = shortid.generate();
        const filePath = path.join(this.rootDir, `${objectToSave._id}.json`);

        return writefilePromise(filePath, JSON.stringify(objectToSave))
            .then( () =>  objectToSave );
    }

    get(objectId) {
        const filePath = path.join(this.rootDir, `${objectId}.json`);
        return readfilePromise(filePath, 'utf8')
            .then( (objectRetrieved) => {
                return JSON.parse(objectRetrieved);
            })
            .catch( err => {
                if (err.code === 'ENOENT') return null;
                throw (err);
            });
    }

    remove(objectId) {
        const filePath = path.join (this.rootDir, `${objectId}.json`);
        return unlinkPromise(filePath)
            .then( () =>  ({removed: true}) )
            .catch( (err) => {
                if (err.code === 'ENOENT') return ({removed: false});
                throw (err);
            });
    }

    getAll() {
        return readdirPromise(this.rootDir)
            .then( (fileArray) => {
                return fileArray.map(a => a.split('.')[0]); 
            })
            .then(ids => {
                return Promise.all(ids
                    .map(id => this.get(id))
                    .sort((a,b) => a._id > b._id ? -1 : 1)
                );
            });
    }

}



module.exports = Store;
