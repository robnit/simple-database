Simple Database
===

Build a simple object database that stores and retrieves from the file system.

Standard repository/dev stuff: `README.md`, `package.json`, `.gitignore`, `.eslintrc`, `.travis.yml`, tests, meaningful commits, named npm scripts, etc.

**Pair on this assignment**

## Doc/Resources
* [Node fs docs](https://nodejs.org/api/fs.html) - specifically the methods `readdir`, `readFile`, `writeFile`, and `unlink`
* [Node path docs](https://nodejs.org/api/path.html) - specifically the methods `join` and possibly `resolve`
* JSON [stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
and [parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* Checkout `mkdirp` and `rimraf` on npm

## Description:

You library will have two parts:

1. A `Store` class that stores and retrieves objects by writing and reading them to files in the directory.
2. A `Db` class that creates `Store` instances and assigns them a directory based on a supplied "name" of the type of object to be stored.

Here is an example of how your module would be imported (required) and used:

```js

const Db = require('../lib/make-db');
const rootDirectory = path.join(__dirname, 'data');
const db = new Db(rootDirectory);

db.getStore('animals', (err, animals) => {
  
  animals.save({ name: 'garfield' }, (err, cat) => {

    animals.get(cat._id, (err, cat) => {
      console.log('got cat', cat);
      // { name: 'garfield' }
    } 

  });
});
```

Here is an example of how the directories and files would be structured:

```
---+ data
    |
    +--+ animals
      |
      +---* 34fdr5.json
      |
      +---* 65rej5.json
      |
      +---* 93odb2.json
    |
    +--+ buildings
      |
      +---* 3tlf4.json
      |
      +---* 23dew3.json
```

## Process

Use TDD to drive the implementation. 

The setup for the tests will require that you **start with a "clean" file directory**. This is where `rimraf` and `mkdirp` will come in handy in your [Mocha's before/after hooks](https://mochajs.org/#hooks). 

Your tests will need to handle asynchronous calls.  You will need to read about [Mocha and async support](https://mochajs.org/#asynchronous-code).

**Follow the order below when creating the modules**

### `Store`

A Class with a constructor that takes the root directory it should save and read files to and from. The directory should already exist. It has the following methods:

1. `.save(<objectToSave>, callback)`
    * Creates a `_id` property for the object (You can use third-party npm module)
    * Saves the object to a file, where the filename is the `_id`. For example, if the id is 3k4e66, the file will be `3k4e66.json`
    * The callback will be called with the saved object that has the added `_id` property
1. `.get(<id>, callback)`
    * The callback will be called with the deserialized (JSON.parse) object that has that id
    * If an object with that id does not exists, call the callback with `null`
1. `.remove(<id>, callback)`
    * The store should removes the file of the object with that id.
    * Call the callback with `{ removed: true }`, or `{ removed: false }` if the id did not exist
1. `.getAll(callback)`
    * Call the callback with array of all objects in the directory. (hint: can you use the store's `get(id)` method as part of this?) 
    * Call the callback with an empty array `[]` when no objects.

TDD the above methods on the `Store` class. Test that the objects are handled correctly by using the API methods, but do **not** test that the files were written to the directory

Tests:

* For the setup, make sure the directory to pass to the store has been removed and then
recreated

1. Pass an object to the `.save` method and assert that the saved object has an _id property. Use that _id to `.get` the object and test that "got" object is semantically the same as original object.
2. Pass a bad id to `.get` and assert that `null` is returned for the callback.
3. Save an object, then pass its _id to `.remove` and check that `{ removed: true }` is returned
for the callback. Pass the _id to `.get` and assert that `null` is returned.
4. Pass a bad id to `.remove` and assert that `{ removed: false }` is returned
for the callback.
5. For a newly create store, test that `.getAll` returns an empty array `[]` for the callback.
6. Save a few objects, then test that `.getAll` returns an array of those objects.

### `Db`

A Class with a constructor that takes the root directory that it will use to create and assign directories to requested `store` instances. It has the following method:


1. `getStore(name, callback)`
    * Ensures the the directory "name" exists as a directory in Db's root directory. (hint: use `mkdirp`)
    * Calls the callback with a new store instance that was passed the path to the directory from the prior step.
   
TDD the above method on the `Db` class. Because the responsibility of the Db class is to ensure that the directory exists, you **should** test that the directories created for the `Store` instances exists.

Tests:

* For the setup, make sure the target root directory has been removed (don't recreate in the setup because the db instance should do that when getting a store).

1. Test that calling `getStore` returns via the callback an instance of the `Store` class. (See `instanceOf` on mdn). Also test that the `store.root` property (or whatever you called the store's root directory property) is the correct filepath.
1. Create two store instances, test that the contents of the root directory are the two names of the stores create. (`fs.readdir` _will_ return directory names)

## Rubric:

* Tests: 6pts
* Async Coding: 6pts
* Functional Correct Behavior: 4pts
* Project (Module) Organization: 4pts
