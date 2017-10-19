const assert = require('assert');

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/make-store');

const promisify = require('util').promisify;
const rimrafPromise = promisify(rimraf);
const mkdirpPromise = promisify(mkdirp);

describe('make-store.js', () => {
    const rootDir = path.join(__dirname, 'test-dir');
    const store = new Store(rootDir);
    
    beforeEach( () => {
        return rimrafPromise(rootDir)
            .then( () => {
                return mkdirpPromise(rootDir);  
            });
    });

    it('should save an object and get it based on ._id', () => {
        const myObject = { data : 'i like it :)' };
        let objectSaved = null;
        return store.save(myObject)
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
        return store.get('bad id')
            .then( (objectGot) => assert.deepEqual(objectGot, null) );
    });


    it('remove should call the callback with {remove:true} if something was removed', () => {
        const myObject = { data : 'i like it removed please' };
        return store.save(myObject)
            .then( (objectSaved) => {
                return store.remove(objectSaved._id);
            })
            .then( (objectRemoved) => {
                assert.deepEqual(objectRemoved, {removed: true});
            });
    });


    it('remove should call the callback with {remove:false} if path did not exist', () => {
        return store.remove('rubbish')
            .then( (objectRemoved)=> {
                assert.deepEqual(objectRemoved, {removed: false});
            });
    });

    it('get an array of objects from getAll method', () => {
        const toSaveArray = [ 
            { data: 'cat' },
            { data: 'dog' },
            { data: 'sdf'},
            { data: '3' }
        ];
        let saved = null;

        return Promise.all(
            toSaveArray.map(a => store.save(a) )
        )
            .then( savedArray => {
                saved = savedArray.sort((a,b) => a._id > b._id ? -1 : 1);
                return store.getAll();
            })
            .then( result => {
                assert.deepEqual(saved, result);
            });
    });

    it('getAll() returns empty array if no files exist in directory', () => {
        return store.getAll()
            .then( (objectArray) => { 
                assert.deepEqual( objectArray, [] ); });
    });

});