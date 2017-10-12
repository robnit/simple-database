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
        db.getStore('dog')
            .then ( (store) => assert.ok(store instanceof Store))
            .then ( (store) =>assert.equal(store.rootDir, path.join(rootDir, 'dog')));
    });


    it('create two files in a database and verify that they exist', (done) => {
        db.getStore('dog')
            .then ( (store)=> { 
                const savedArray =[];
                store.save({dog:'awsome'}, (err, savedObject1)=>{
                    if (err) return done(err);
                    savedArray.push(savedObject1._id+'.json');
                    store.save({cat: 'is evil'}, (err, savedObject2)=>{
                        if (err) return done(err);
                        savedArray.push(savedObject2._id +'.json');
                        const storePath = path.join(rootDir, 'dog');
                        fs.readdir(storePath, 'utf8', (err, readFiles) => {
                            readFiles.sort( (a, b) => {
                                if(a._id < b._id) return -1;
                                if(a._id > b._id) return 1;
                            });
                            savedArray.sort( (a, b) => {
                                if(a < b) return -1;
                                if(a > b) return 1;
                            });
                            assert.deepEqual(readFiles, savedArray);
                            done();
                        });
                    });
                });
            });
    });

    it('create two store instances, verify that they exist', () => {
        db.getStore('rat')
            .then( () => {
                db.getStore('bat')
                    .then (()=> {
                        readDir(rootDir, 'utf8')
                            .then((names) => {
                                assert.deepEqual(names, ['bat', 'rat']); 
                            });
                    });
            });
    });
});