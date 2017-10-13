const assert = require('assert');
const promisify =require('util').promisify;
const path = require('path');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const readDir = promisify(fs.readdir);


const Store = require('../lib/make-store');
const Db = require('../lib/make-db');

const rootDir = path.join(__dirname, 'test-dir');
const db = new Db(rootDir);

describe('make-db.js', () => {

    beforeEach( () => rimraf(rootDir) );

    it('calling getStore returns an instance of the Store class with correct rootDir property', () => {
        return db.getStore('dog')
            .then ( (store) =>{
                assert.equal(store.rootDir, path.join(rootDir, 'dog'));
                assert.ok(store instanceof Store);
            });
    });


    it('create two files in a database and verify that they exist', () => {
        let savedArray = null;
        let store = null;
        return db.getStore('dog')
            .then ( (gotStore)=> { 
                store = gotStore;
                return Promise.all([
                    store.save({dog:'awsome'}),
                    store.save({cat: 'is evil'})
                ]);
            })
            .then((saved) => {
                savedArray = saved;
                return store.getAll();
            })
            .then((readFiles) => {
                readFiles.sort( (a, b) => a._id > b._id ? -1 : 1);
                savedArray.sort( (a, b) => a._id > b._id ? -1 : 1);
                assert.deepEqual(readFiles, savedArray);
            });
    });

    it('create two store instances, verify that they exist', () => {
        return db.getStore('rat')
            .then( () => {
                return db.getStore('bat');
            })
            .then (()=> {
                return readDir(rootDir, 'utf8');
            })
            .then((names) => {
                assert.deepEqual(names, ['bat', 'rat']); 
            });          
    });
});