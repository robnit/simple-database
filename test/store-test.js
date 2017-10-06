const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const store = require('../lib/make-store');


describe('make-store.js', () => {
    //TODO: before hook
    it('should save an object and get it based on ._id', () => {
        const myObject = { body : 'i like it :)' };
        const destination = './test-dir';

        const retrievedFile = store.get( writtenFile._id,  );
        const writtenFile = store.save( myObject, retrievedFile );
        
        assert.deepEqual( writtenFile, retrievedFile );
    });


});