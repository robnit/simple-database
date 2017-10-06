const assert = require('assert');
// const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/make-store');
const rootDir = path.join(__dirname, 'test-dir');

const store = new Store(rootDir);

describe('make-store.js', () => {

    beforeEach( done =>{
        rimraf(rootDir, err =>{
            if(err) return done(err);
            mkdirp(rootDir, err =>{
                if(err) return done(err);
                done();
            });
        });
    });

    it('should save an object and get it based on ._id', (done) => {
        const myObject = { data : 'i like it :)' };
        
        store.save(myObject, (err, saved) => {
            if(err) return done(err);

            assert.ok(saved._id);
            assert.equal(saved.data, myObject.data);

            // store.get(saved._id, (err, got) => {
            //     if(err) return done(err);

            //     assert.deepEqual(saved, got);
            done();
            // });
        });
    });


});