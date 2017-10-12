const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;

const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));

const Store = require('../lib/make-store');
const rootDir = path.join(__dirname, 'test-dir');

const store = new Store(rootDir);

describe.only('make-store.js', () => {

    beforeEach( () =>{
        return rimraf(rootDir)
            .then ( () => {
                return mkdirp(rootDir);
            });
    });

    it('should save an object and get it based on ._id', () => {
        const myObject = { data : 'i like it :)' };
        
        store.save(myObject)
            .then ((data)=>{
                assert.ok(data._id);
                assert.equal(data.data, myObject.data);
                store.get(data._id)
                    .then((objectGot)=> {
                        assert.deepEqual(data, objectGot);
                    });

            });

    });


    it('call callback with null if id is bad', () => {
        store.get('bad id')
            .then( (objectGot) =>{
                assert.deepEqual(objectGot, null);
            });
    });


    it('remove should call the callback with {remove:true} if something was removed', () => {
        const myObject = { data : 'i like it removed please' };
        store.save(myObject)
            .then ( (objectSaved) => {
                store.remove(objectSaved._id)
                    .then( (objectRemoved) => {
                        assert.deepEqual(objectRemoved, {removed: true});
                    });
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
        const expectedArray = [];
        
        store.save( objectOne ) 
            .then( (savedObjectOne) => {
                expectedArray.push(savedObjectOne);
            })

            .then ( () =>{
                store.save( objectTwo )
                    .then( (savedObjectTwo) => {
                        expectedArray.push(savedObjectTwo);
                    });
            })

            .then ( () => {
                store.getAll()
                    .then ( (objectArray)=> {
                        expectedArray.sort(function(a, b){
                            if(a._id < b._id) return -1;
                            if(a._id > b._id) return 1;
                        });
                        assert.deepEqual( objectArray, expectedArray);
                    });
            });
    });

    it('getAll() returns empty array if no files exist in directory', () => {
        store.getAll()
            .then ( (objectArray) => {
                assert.deepEqual( objectArray, [] );
            });
    });

});