const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');

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
            store.save({dog:'awsome'});
            assert.ok(store instanceof Store);
            assert.equal(store.rootDir, path.join(rootDir, 'dog'));
            done();
        });
    });
});