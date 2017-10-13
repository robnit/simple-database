const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;

const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

const Store = require('../lib/make-store');
const rootDir = path.join(__dirname, 'test-dir');

const store = new Store(rootDir);

describe('make-store.js', () => {

    beforeEach( () =>{
        return rimraf(rootDir)
            .then ( () => {
                return mkdirp(rootDir);
            });
    });

    it('should save an object and get it based on ._id', () => {
        const myObject = { data : 'i like it :)' };
        let saved = null;
        
        return store.save(myObject)
            .then ((data)=>{
                saved = data;
                assert.ok(data._id);
                assert.equal(data.data, myObject.data);
                return store.get(data._id);
            })
            .then((objectGot)=> {
                assert.deepEqual(saved, objectGot);
            });
    });


    it('call callback with null if id is bad', () => {
        return store.get('bad id')
            .then( (objectGot) =>{
                console.log('objectGot:',objectGot);
                assert.deepEqual(objectGot, null);
            });
    });


    it('remove should call the callback with {remove:true} if something was removed', () => {
        const myObject = { data : 'i like it removed please' };
        return store.save(myObject)
            .then ( (objectSaved) => {
                return store.remove(objectSaved._id);
            })
            .then( (objectRemoved) => {
                assert.deepEqual(objectRemoved, {removed: true});
            });
    });


    it('remove should call the callback with {remove:false} if path did not exist', () => {
        store.remove('rubbish')
            .then( (objectRemoved) => {
                assert.deepEqual(objectRemoved, {removed: false});
            });
    });

    it('get an array of objects from getAll method', () => {
        const objectOne = { data: 'cat' };
        const objectTwo = { data: 'dog' };
        let saved = [];
        

        return Promise.all ([
            store.save( objectOne ),
            store.save( objectTwo )
        ])
            .then ( (data) => {
                saved = data;
                return store.getAll();
            })
            .then ( (objectArray)=> {
                saved.sort(function(a, b){
                    if(a._id < b._id) return -1;
                    if(a._id > b._id) return 1;
                });
                assert.deepEqual( objectArray, saved);
            });
    });

    it('getAll() returns empty array if no files exist in directory', () => {
        store.getAll()
            .then ( (objectArray) => {
                assert.deepEqual( objectArray, [] );
            });
    });

});