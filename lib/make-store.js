const fs = require('fs');
const path = require ('path');
const shortid = require('shortid');

class Store {

    constructor(rootDir){
        this.rootDir = rootDir;
    }

    save(objectToSave, callback){
        objectToSave._id = shortid.generate();
        const filePath = path.join(this.rootDir, `${objectToSave._id}.json`);
        fs.writeFile(filePath, JSON.stringify(objectToSave), err => {
            if (err) return callback(err);
            callback(null, objectToSave);
        });
    }

    get(objectId, callback) {
        const filePath = path.join(this.rootDir, `${objectId}.json`);
        fs.readFile(filePath, 'utf8', (err, objectRetrieved) => {
            if (!objectRetrieved) return callback(null, null);
            if (err) return callback(err);
            callback(null, JSON.parse(objectRetrieved));
        });
    }

    remove(objectId, callback) {
        const filePath = path.join (this.rootDir, `${objectId}.json`);
        fs.unlink(filePath, (err) =>{
            if (err) return callback(null,{removed: false});
            callback(null,{removed: true});
        });
    }

    getAll(callback){
        const allFiles = [];
        fs.readdir( this.rootDir, (err, fileNameArray) =>{
            if (fileNameArray.length === 0) return callback(null, []);
            
            for (let i = 0; i < fileNameArray.length; i++){
                this.get(fileNameArray[i].split('.')[0], (err, objectRetrieved) =>{
                    if (err) return callback(err);
                    allFiles.push(objectRetrieved);
                    if (allFiles.length === fileNameArray.length){ 
                        const sortedFiles = allFiles.sort((a, b) =>{
                            if(a._id < b._id) return -1;
                            if(a._id > b._id) return 1;
                        }); 
                        return callback(null, sortedFiles);
                    }
                });                
            }// end of for-loop
        });//end of fs.readdir
    }

}


module.exports = Store;
