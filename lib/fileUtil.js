const fs = require('fs');
const path = require('path');
const helper = require('./helper')

var lib = {
    baseDir: path.join(__dirname, '../.data/'),
};

// creating
lib.create = (dir, filename, data, callback) => {
    // open file for writing
    const filePath = lib.baseDir + dir + "\\" + filename + '.json';
    fs.open(filePath, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);
            // write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// reading
lib.read = (dir, filename, callback) => {
    const filePath = lib.baseDir + dir + "\\" + filename + '.json';
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            callback(false, JSON.parse(data));
        }
        else {
            callback(err, data);
        }
    });
};                

// updating
lib.update = (dir, filename, data, callback) => {
    const filePath = lib.baseDir + dir + "\\" + filename + '.json';
 
    // open the file
    fs.open(filePath, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            fs.readFile(fileDescriptor, 'utf-8', (err, bookToUpdate) => {
                if (!err && bookToUpdate) {
                    let updatedBook = helper.formatObject(JSON.parse(bookToUpdate), data);
                    updatedBook = data; //this resolves the put request not updating
                    var updatedData = JSON.stringify(updatedBook);
                    console.log({"updatedBook": updatedBook})
                    fs.ftruncate(fileDescriptor, (err) => {
                        if (!err) {
                            // console.log(updatedBook, {updatedData})
                            fs.writeFile(filePath, updatedData, (err) => {
                                if (!err) {
                                    fs.close(fileDescriptor, (err) => {
                                        if (!err) {
                                            callback(false);
                                        } else {
                                            callback('Error closing existing file');
                                        }
                                    });
                                } else {
                                    callback('Error writing to existing file');
                                }
                            });
                        }
                    });
                } else {
                    callback(err)
                }
            });

        } else {
            callback('could not open file for updating, maybe it does not exist')
        }
    });
};

// delete file
lib.delete = (dir, filename, callback) => {
    const filePath = lib.baseDir + dir + "\\" + filename + '.json';
    fs.unlink(filePath, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(err);
        }
    });
};


module.exports = lib;