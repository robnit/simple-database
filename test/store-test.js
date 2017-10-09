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

    it('get an array of objects from getAll method', (done) => {
        const objectOne = { data: 'cat' };
        const objectTwo = { data: 'dog' };
        const expectedArray = [];
        
        
        store.save( objectOne, (err, savedObjectOne) => {
            if (err) return done(err); 
            expectedArray.push(savedObjectOne);
            store.save( objectTwo, (err, savedObjectTwo) => {
                if (err) return done(err);
                expectedArray.push(savedObjectTwo);
                store.getAll( (err, objectArray) =>{
                    if (err) return done(err);
                    console.log('actual',objectArray);
                    const sortedExpected = expectedArray.sort(function(a, b){
                        if(a._id < b._id) return -1;
                        if(a._id > b._id) return 1;
                    });
                    console.log('in getAll test! Sorted Expected',sortedExpected);
                    assert.deepEqual( objectArray, sortedExpected);
                    done();
                });
            });
        });
    });

    it('getAll() returns empty array if no files exist in directory', (done) => {
        store.getAll( (err, objectArray) => {
            if (err) return done(err);
            console.log('object array is', objectArray);
            assert.deepEqual( objectArray, [] );
            done();
        });
    });

});