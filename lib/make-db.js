const mkdirp = require('mkdirp');
const path = require('path');

const Store = require('../lib/make-store');

class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name, callback){
        const storePath = path.join(this.rootDir, name);
        mkdirp(storePath, (err) => {
            if (err) callback(err);
            const store = new Store(storePath);
            callback(null, store);
        });
    }
    
}

module.exports = Db;