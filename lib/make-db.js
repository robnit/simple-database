const mkdirp = require('mkdirp');
const path = require('path');
const promisify = require('util').promisify;

const Store = require('../lib/make-store');
const mkdirpPromise = promisify(mkdirp);

class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name){
        const storePath = path.join(this.rootDir, name);
        return mkdirpPromise(storePath)
            .then( () => {
                const store = new Store(storePath);
                return store;
            });
    }
    
}

module.exports = Db;