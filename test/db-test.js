const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

const Store = require('../lib/make-store');
const Db = require('../lib/make-db');

const rootDir = path.join(__dirname, 'test-dir');
const db = new Db(rootDir);

describe.only('make-db.js', () => {

    beforeEach( done => {
        rimraf(rootDir, err => {
            if (err) return done(err);
            done();
        });
    });

    it('calling getStore returns an instance of the Store class with correct rootDir property', (done) => {

        db.getStore('dog', (err, store)=>{
            if (err) return done(err);
            assert.ok(store instanceof Store);
            assert.equal(store.rootDir, path.join(rootDir, 'dog'));
            done();
        });
    });

    it('create two files in a database and verify that they exist', (done) => {
        db.getStore('dog', (err, store)=>{
            const savedArray =[];
            if (err) return done(err);
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

    it('creates two store instances, verify that they exist', (done) => {
        db.getStore('rat', (err) => {
            if (err) return done(err);
            db.getStore('bat', (err) => {
                if (err) return done(err);
                fs.readdir(rootDir, 'utf8', (err, names) => {
                    assert.deepEqual(names, ['bat', 'rat']);
                    done();
                });
            });
        });
    });



});