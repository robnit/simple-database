const assert = require('assert');
const fs = require('fs');

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/make-store');
const Db = require('../lib/make-db');
const rootDir = path.join(__dirname, 'test-dir');

const db = new Db();


describe('make-db.js', () => {

    beforeEach( done => {
        rimraf(rootDir, err => {
            if (err) return done(err);
            done();
        });
    });

    it('calling getStore returns an instance of the Store class with correct rootDir property', (done) => {

        db.getStore('dog', (err, data)=>{
            if (err) return done(err);
            // assert.ok()
        });

        //TODO: test that the store.rootDir property is the correct filepath
    });
});