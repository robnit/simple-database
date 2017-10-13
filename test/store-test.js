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


    it('remove should call the callback with {remove:false} if path did not exist', () => {
        return store.remove('rubbish')
            .then( (objectRemoved)=> {
                assert.deepEqual(objectRemoved, {removed: false});
            });
    });

    it.only('get an array of objects from getAll method', () => {
        const toSaveArray = [ 
            { data: 'cat' },
            { data: 'dog' }
        ];
        let saved = null;
        return Promise.all([ 
            toSaveArray.map(element => {
                return store.save(element);
            })
        ])
            .then( (promiseArray) => {  
                saved = promiseArray;
                return promiseArray.sort(function(a, b){
                    if(a._id < b._id) return -1;
                    if(a._id > b._id) return 1;
                });
            })
            .then( (sortedPromiseArray) => {
                console.log('get all is', store.getAll());                
                assert.deepEqual(saved, sortedPromiseArray);
            });
    });

    it('getAll() returns empty array if no files exist in directory', () => {
        return store.getAll()
            .then( (objectArray) => { 
                assert.deepEqual( objectArray, [] ); });
    });

});