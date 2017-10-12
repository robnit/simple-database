const Store = require('../lib/make-store');
const path = require('path');
const promisify =require('util').promisify;
const mkdirp = promisify(require('mkdirp'));

class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name){
        const storePath = path.join(this.rootDir, name);
        return mkdirp(storePath)
            .then(()=>{
                return new Store(storePath);
            });
    }
}

module.exports = Db;