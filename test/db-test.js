const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const fs = require('fs');
const rimraf = require('rimraf');
const rimrafPromise = promisify(rimraf);
const readdirPromise = promisify(fs.readdir);

const Store = require('../lib/make-store');
const Db = require('../lib/make-db');

const rootDir = path.join(__dirname, 'test-dir');
const db = new Db(rootDir);

describe('make-db.js', () => {

    beforeEach( () => {
        return rimrafPromise(rootDir);
    });

    it('calling getStore returns an instance of the Store class with correct rootDir property', () => {
        return db.getStore('dog')
            .then( store => {
                assert.ok(store instanceof Store);
                assert.equal(store.rootDir, path.join(rootDir, 'dog'));
            });
    });

    it('create two files in a database and verify that they exist', () => {
        let savedArray = null;
        let store = null;
        return db.getStore('dog')
            .then( (gotStore) => {
                store = gotStore;
                return Promise.all([
                    store.save({dog:'awsome'}),
                    store.save({cat: 'is evil'})
                ]);
            })
            .then( (saved) => {
                savedArray = saved.sort((a,b) => a._id > b._id ? -1 : 1);
                return store.getAll();
            })
            .then( (readFiles) => {
                readFiles.sort((a,b) => a._id > b._id ? -1 : 1);
                assert.deepEqual(readFiles, savedArray);
            });
    });

    it('create two store instances, verify that they exist', () => {
        return db.getStore('rat')
            .then( () => db.getStore('bat') )
            .then( () => readdirPromise(rootDir) )
            .then( (names) => assert.deepEqual(names, ['bat', 'rat']) );
    });

});