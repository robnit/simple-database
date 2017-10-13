const fs = require('fs');
const path = require ('path');
const shortid = require('shortid');

const promisify = require('util').promisify;
const writefilePromise = promisify(fs.writeFile);
const readfilePromise = promisify(fs.readFile);
const unlinkPromise = promisify(fs.unlink);
const readdirPromise = promisify(fs.readdir);

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave){
        objectToSave._id = shortid.generate();
        const filePath = path.join(this.rootDir, `${objectToSave._id}.json`);

        return writefilePromise(filePath, JSON.stringify(objectToSave))
            .then( () =>  objectToSave );
    }

    get(objectId) {
        const filePath = path.join(this.rootDir, `${objectId}.json`);
        return readfilePromise(filePath, 'utf8')
            .then( (objectRetrieved) => {
                return JSON.parse(objectRetrieved);
            })
            .catch( () => { return null; } );
    }

    remove(objectId) {
        const filePath = path.join (this.rootDir, `${objectId}.json`);
        return unlinkPromise(filePath)
            .then( () => { return {removed: true}; }, () => {return { removed: false};} );
    }

    getAll(){
        // const allFiles = [];
        console.log('this.rootDir is', this.rootDir);
        return readdirPromise(this.rootDir)
            .then( (fileArray) => {
                console.log('file array is', fileArray); 
            });
    }

    // getAll(callback){
    //     const allFiles = [];
    //     fs.readdir( this.rootDir, (err, fileNameArray) =>{
    //         if (fileNameArray.length === 0) return callback(null, []);
            
    //         for (let i = 0; i < fileNameArray.length; i++){
    //             this.get(fileNameArray[i].split('.')[0], (err, objectRetrieved) =>{
    //                 if (err) return callback(err);
    //                 allFiles.push(objectRetrieved);
    //                 if (allFiles.length === fileNameArray.length){ 
    //                     allFiles.sort((a, b) =>{
    //                         if(a._id < b._id) return -1;
    //                         if(a._id > b._id) return 1;
    //                     }); 
    //                     return callback(null, allFiles);
    //                 }
    //             });                
    //         }// end of for-loop
    //     });//end of fs.readdir
    // }

}



module.exports = Store;
