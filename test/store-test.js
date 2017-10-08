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
            if (err) return done(err);
            mkdirp(rootDir, err =>{
                if (err) return done(err);
                done();
            });
        });
    });

    it('should save an object and get it based on ._id', (done) => {
        const myObject = { data : 'i like it :)' };
        

        store.save(myObject, (err, objectSaved) => {
            if (err) return done(err);

            assert.ok(objectSaved._id);
            assert.equal(objectSaved.data, myObject.data);

            store.get(objectSaved._id, (err, objectGot) => {
                if (err) return done(err);

                assert.deepEqual(objectSaved, objectGot);
                done();

            });
        });

    });

    it('call callback with null if id is bad', (done) => {
        store.get('bad id', (err, objectGot) => {
            if (err) return done(err);
            assert.deepEqual(objectGot, null);
            done();
        });
      

    
    });

    it('remove should call the callback with {remove:true} if something was removed', (done) => {
        const myObject = { data : 'i like it removed please' };
        store.save(myObject, (err, objectSaved) => {
            if (err) return done(err);

            store.remove(objectSaved._id, (err, objectRemoved) => {
                if (err) return done(err);
                assert.deepEqual(objectRemoved, {removed: true});
                done();
            });
        });
    });

    it('remove should call the callback with {remove:false} if path did not exist', (done) => {
        store.remove('rubbish', (err, objectRemoved) => {
            if (err) return done(err);
            assert.deepEqual(objectRemoved, {removed: false});
            done();
        });
    });
});