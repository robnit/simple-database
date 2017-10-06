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
    
    it('should save an object and get it based on ._id', () => {
        const myObject = { body : 'i like it :)' };
        

        const retrievedFile = store.get( writtenFile._id,  );
        const writtenFile = store.save( myObject, retrievedFile );
        
        assert.deepEqual( writtenFile, retrievedFile );
    });


});