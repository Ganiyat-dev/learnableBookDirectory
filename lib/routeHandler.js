const fileUtil = require('./fileUtil');
const routeHandler = {};
const helper = require('./helper');

routeHandler.Books = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._books[data.method](data, callback);
    } else {
        callback(405);
    }
}

// router for user
routeHandler.Users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._users[data.method](data, callback);
    } else {
        callback(405);
    }
}
// router for rent books
routeHandler.rentBooks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._rentbooks[data.method](data, callback);
    } else {
        callback(405);
    }
}
// roputer fot returned books
routeHandler.returnBooks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._returnbooks[data.method](data, callback);
    } else {
        callback(405);
    }
}


routeHandler._books = {};

routeHandler._users = {};

routeHandler._rentbooks = {};

routeHandler._returnbooks = {};

// book requests
routeHandler._books.post = (data, callback) => {
    // validate that all fields are filled out
    var title = typeof (data.payload.title) === 'string' && data.payload.title.trim().length > 0 ? data.payload.title : false;
    var author = typeof (data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var price = typeof(data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    var copies = typeof(data.payload.copies) === 'string' && !isNaN(parseInt(data.payload.copies)) ? data.payload.copies : false;
    if (title && author && price && copies) {
        const bookId =  helper.generateRandomString(10)
        fileUtil.create('books', bookId, data.payload, (err) => {
            if (!err) {
                callback(200, {message: 'Book added successfully', data: null});
            } else {
                callback(400, {err: err, message: 'could not add book'});
            }
        });
    } else {
        callback(400, {message: 'missing required fields'});
    }
};

routeHandler._books.get = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.read('books', data.queryObj.name, (err, data) => {
            if (!err && data) {
                callback(200, {data: data});
            } else {
                callback(404, {err: err, data: null, message: 'could not get books'});
            }
        });

    } else {
        callback(404, {message: 'book not found', data: null});
    }
};

routeHandler._books.put = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.update('books', data.queryObj.name, data.payload, (err) => {
            if (!err) {
                callback(201, {message: 'Book updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update book'});
            }
        });
    } else {
        callback(404, {message: 'book not found'});
    }
};

routeHandler._books.delete = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.delete('books', data.queryObj.name, (err) => {
            if (!err) {
                callback(200, {message: 'Book deleted successfully'});
            } else {
                callback(400, {err: err, message: 'could not delete book'});
            }
        });
    } else {
        callback(404, {message: 'book not found'});
    }
};

// user requests
routeHandler._users.post = (data, callback) => {
    // validate that all fields are filled out
    var firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
    var lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
    var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;

    if (firstName && lastName && password) {
        const userId = helper.generateUserId(6)
        fileUtil.create('users', userId, data.payload,  (err) => {
            if (!err) {
                callback(200, {message: 'User added successfully', data: null});
            } else {
                callback(400, {err: err, message: 'could not add user'});
            }
        });
    }
};

routeHandler._users.get = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.read('users', data.queryObj.name, (err, data) => {
            if (!err && data) {
                callback(200, {data: data});
            } else {
                callback(404, {err: err, data: null, message: 'could not get users'});
            }
        });

    } else {
        callback(404, {message: 'user not found', data: null});
    }
};

routeHandler._users.put = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.update('users', data.queryObj.name, data.payload, (err) => {
            if (!err) {
                callback(201, {message: 'User updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update user'});
            }
        });
    } else {
        callback(404, {message: 'user not found'});
    }
};

routeHandler._users.delete = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.delete('users', data.queryObj.name, (err) => {
            if (!err) {
                callback(200, {message: 'User deleted successfully'});
            } else {
                callback(400, {err: err, message: 'could not delete user'});
            }
        });
    } else {
        callback(404, {message: 'user not found'});
    }
};

// rentbooks requests
routeHandler._rentbooks.post = (data, callback) => {
    // validate that all fields are filled out
    var userId = typeof (data.payload.userId) === 'string' && data.payload.userId.trim().length > 0 ? data.payload.userId : false;
    var bookId = typeof (data.payload.bookId) === 'string' && data.payload.bookId.trim().length > 0 ? data.payload.bookId : false;
    var dateRented = typeof (data.payload.dateRented) === 'string' && data.payload.dateRented.trim().length > 0 ? data.payload.dateRented : false;
    var returnDate = typeof (data.payload.returnDate) === 'string' && data.payload.returnDate.trim().length > 0 ? data.payload.returnDate : false;

    if (userId && bookId && dateRented && returnDate) {
        fileUtil.read('users', userId, (err, user) => {
            if (!err && user) {
                fileUtil.read('books', bookId, (err, book) => {
                    if (!err && book) {
                        if (book.copies > 0) {
                            fileUtil.update('books', bookId, {copies: book.copies - 1}, (err) => {
                                if (!err) {
                                    fileUtil.create('rentbooks', userId + bookId, data.payload, (err) => {
                                        if (!err) {
                                            callback(200, {message: 'Book rented successfully'});
                                        } else {
                                            callback(400, {err: err, message: 'could not rent book'});
                                        }
                                    });
                                } else {
                                    callback(400, {err: err, message: 'could not update book'});
                                }
                            });
                        } else {
                            callback(400, {message: 'Book out of stock'});
                        }
                    } else {
                        callback(404, {err: err, message: 'could not get book'});
                    }
                });
            } else {
                callback(404, {err: err, message: 'could not get user'});
            }
        });
    } else {
        callback(400, {message: 'missing required fields'});
    }
};

routeHandler._rentbooks.get = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.read('rentbooks', data.queryObj.name, (err, data) => {
            console.log(data)
            if (!err && data) {
                callback(200, {data: data});
            } else {
                callback(404, {err: err, data: null, message: 'could not get rentbooks'});
            }
        });

    } else {
        callback(404, {message: 'rentbook not found', data: null});
    }
};

routeHandler._rentbooks.put = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.update('rentbooks', data.queryObj.name, data.payload, (err) => {
            if (!err) {
                callback(201, {message: 'Rentbook updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update rentbook'});
            }
        });
    } else {
        callback(404, {message: 'rentbook not found'});
    }
};

routeHandler._rentbooks.delete = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.delete('rentbooks', data.queryObj.name, (err) => {
            if (!err) {
                callback(200, {message: 'Rented book deleted successfully'});
            } else {
                callback(400, {err: err, message: 'could not delete rented book'});
            }
        });
    } else {
        callback(404, {message: 'rented book not found'});
    }
}


routeHandler._returnbooks.post = (data, callback) => {
    // validate that all fields are filled out
    var userId = typeof (data.payload.userId) === 'string' && data.payload.userId.trim().length > 0 ? data.payload.userId : false;
    var bookId = typeof (data.payload.bookId) === 'string' && data.payload.bookId.trim().length > 0 ? data.payload.bookId : false;
    var dateRented = typeof (data.payload.dateRented) === 'string' && data.payload.dateRented.trim().length > 0 ? data.payload.dateRented : false;
    var returnDate = typeof (data.payload.returnDate) === 'string' && data.payload.returnDate.trim().length > 0 ? data.payload.returnDate : false;

    if (userId && bookId && dateRented && returnDate) {
        fileUtil.read('users', userId, (err, user) => {
            if (!err && user) {
                fileUtil.read('books', bookId, (err, book) => {
                    if (!err && book) {
                        fileUtil.update('books', bookId, {copies: book.copies + 1}, (err) => {
                            if (!err) {
                                fileUtil.create('returnedbooks', userId + bookId, data.payload, (err) => {
                                    if (!err) {
                                        callback(200, {message: 'Book returned successfully'});
                                    } else {
                                        callback(400, {err: err, message: 'could not return book'});
                                    }
                                });
                            } else {
                                callback(400, {err: err, message: 'could not update book'});
                            }
                        });
                    } else {
                        callback(404, {err: err, message: 'could not get book'});
                    }
                });
            } else {
                callback(404, {err: err, message: 'could not get user'});
            }
        });
    } else {
        callback(400, {message: 'missing required fields'});
    }
};

// return book requests
routeHandler._returnbooks.get = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.read('returnedbooks', data.queryObj.name, (err, data) => {
            if (!err && data) {
                callback(200, {data: data});
            } else {
                callback(404, {err: err, data: null, message: 'could not get returnedbooks'});
            }
        
        });
    } else {
        callback(404, {message: 'returnedbook not found', data: null});
    }
};


routeHandler._returnbooks.put = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.update('returnedbooks', data.queryObj.name, data.payload, (err) => {
            if (!err) {
                callback(201, {message: 'Returnedbook updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update returnedbook'});
            }
        });
    } else {
        callback(404, {message: 'returnedbook not found'});
    }
};

routeHandler._returnbooks.delete = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.delete('returnedbooks', data.queryObj.name, (err) => {
            if (!err) {
                callback(200, {message: 'Returned book deleted successfully'});
            } else {
                callback(400, {err: err, message: 'could not delete returned book'});
            }
        });
    } else {
        callback(404, {message: 'returned book not found'});
    }
}





routeHandler.ping = (data, callback) => {
    callback(200, {response: "server is live"})
}
routeHandler.notFound = (data, callback) => {
    callback(404, {response: "not found"})
}

module.exports = routeHandler;