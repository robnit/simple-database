const fs = require('fs');
const promisify= require('util').promisify;
const readFile= promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readDir = promisify(fs.readdir);

const path = require ('path');
const shortid = require('shortid');

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave){
        const obj = Object.assign ({}, objectToSave);
        obj._id = shortid.generate();
        const filePath = path.join(this.rootDir, `${obj._id}.json`);
        return writeFile(filePath, JSON.stringify(obj) )
            .then( ()=>{
                return obj;
            });
    }

    get(objectId){
        const filePath = path.join(this.rootDir, `${objectId}.json`);
        return readFile(filePath, 'utf8')
            .then( objectRetrieved=> {
                return JSON.parse(objectRetrieved);
            }, 
            err => {
                if (err.code === 'ENOENT') return null;
            });
    }

    remove(objectId){
        const filePath = path.join (this.rootDir, `${objectId}.json`);
        return unlink(filePath)
            .then(() => {
                return {removed: true};
            })
            . catch (() =>{
                return { removed:false};
            });
    }

    getAll(){
        return readDir( this.rootDir)
            .then((fileNameArray) => {
                const promiseArray = fileNameArray.map( (fileName) => {
                    return this.get(path.basename(fileName, '.json'));   
                });
                return Promise.all(promiseArray);
            });
    }
}

module.exports = Store;
