const fs = require('fs');
const path = require ('path');
const shortid = require('shortid');

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave, callback){
        objectToSave._id= shortid.generate();
        const filePath = path.join(this.rootDir + '/' + `${objectToSave._id}.json`);
        fs.writeFile(filePath, JSON.stringify(objectToSave), err => {
            if (err) return callback(err);
            callback(null, objectToSave);
        });

    }

}


module.exports = Store;