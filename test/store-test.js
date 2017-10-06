const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const store = require('../lib/make-store');
const destination = './test-dir';
describe('make-store.js', () => {

    beforeEach( done =>{
        rimraf(destination, err =>{
            if(err) return done(err);
            mkdirp(destination, err =>{
                if(err) return done(err);
                done();
            });
        });
    });

    it('should save an object and get it based on ._id', (done) => {
        const myObject = { body : 'i like it :)' };
        
        store.save( myObject, (err,saved) => {
            if(err) return done(err);

            assert.ok(saved._id);
            assert.equal(saved.body,myObject.body);

            store.get(saved._id, (err, got) => {
                if(err) return done(err);
                
                assert.deepEqual(saved,got);
                done();
            });
        });
    });


});