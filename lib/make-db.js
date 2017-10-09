const mkdirp = require('mkdirp');
const Store = require('../lib/make-store');
const path = require('path');


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