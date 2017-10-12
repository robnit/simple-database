const assert = require('assert');

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/make-store');
const rootDir = path.join(__dirname, 'test-dir');

const store = new Store(rootDir);

const promisify = require('util').promisify;
const rimrafPromise = promisify(rimraf);
const mkdirpPromise = promisify(mkdirp);

describe('make-store.js', () => {

    beforeEach( () => {
        return rimrafPromise(rootDir)
            .then( () => {
                return mkdirpPromise(rootDir);  
            });
    });

    it('should save an object and get it based on ._id', () => {
        const myObject = { data : 'i like it :)' };
        let objectSaved = null;
        store.save(myObject)
            .then(saved => {
                objectSaved = saved;
                assert.ok(objectSaved._id);
                assert.equal(objectSaved.data, myObject.data);
                return store.get(objectSaved._id);
            })
            .then (objectGot => {
                assert.deepEqual(objectSaved, objectGot);
            });
    });



    it('call callback with null if id is bad', () => {
        store.get('bad id')
            .then( (objectGot) => assert.deepEqual(objectGot, null) );
    });


    it('remove should call the callback with {remove:true} if something was removed', () => {
        const myObject = { data : 'i like it removed please' };
        return store.save(myObject)
            .then( (objectSaved) => {
                console.log('objectSaved is', objectSaved);
                return store.remove(objectSaved._id);
            })
            .then( (objectRemoved) => {
                console.log('objectRemoved is', objectRemoved);
                assert.deepEqual(objectRemoved, {removed: true});
            });
    });


    it.only('remove should call the callback with {remove:false} if path did not exist', (done) => {
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
                store.getAll( (err, objectArray) => {
                    if (err) return done(err);
                    expectedArray.sort(function(a, b){
                        if(a._id < b._id) return -1;
                        if(a._id > b._id) return 1;
                    });
                    assert.deepEqual( objectArray, expectedArray);
                    done();
                });
            });
        });
    });

    it('getAll() returns empty array if no files exist in directory', (done) => {
        store.getAll( (err, objectArray) => {
            if (err) return done(err);
            assert.deepEqual( objectArray, [] );
            done();
        });
    });

});