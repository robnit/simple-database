const fs = require('fs');
const shortid = require('shortid');

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave, callback){
        this._id = shortid.generate();
        this.body = objectToSave.body;

        fs.writeFile(this._id, this.body);
        callback();
    }

}


module.exports = Store;