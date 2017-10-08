const fs = require('fs');
const path = require ('path');
const shortid = require('shortid');

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave, callback){
        objectToSave._id = shortid.generate();
        const filePath = path.join(this.rootDir, `${objectToSave._id}.json`);
        fs.writeFile(filePath, JSON.stringify(objectToSave), err => {
            if (err) return callback(err);
            callback(null, objectToSave);
        });
    }

    get(objectId, callback) {
        const filePath = path.join(this.rootDir, `${objectId}.json`);
        fs.readFile(filePath, 'utf8', (err, objectToRetrieve) => {
            if (!objectToRetrieve) return callback(null, null);
            if (err) return callback(err);
            callback(null, JSON.parse(objectToRetrieve));
        });
    }

    remove(objectId, callback) {
        const filePath = path.join (this.rootDir, `${objectId}.json`);
        fs.unlink(filePath, (err) =>{
            if (err) return callback(null,{removed: false});
            console.log('past the error');
            callback(null,{removed: true});
        });
    }

}


module.exports = Store;
