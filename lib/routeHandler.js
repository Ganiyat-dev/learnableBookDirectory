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
// routeHandler.Rent = (data, callback) => {
//     const acceptableMethods = ['post', 'get', 'put', 'delete'];
//     if (acceptableMethods.indexOf(data.method) > -1) {
//         routeHandler._rent[data.method](data, callback);
//     } else {
//         callback(405);
//     }
// }

routeHandler._books = {};

routeHandler._users = {};

// routeHandler._rentbook = {};

// post route -- for creating a book
routeHandler._books.post = (data, callback) => {
    // validate that all fields are filled out
    var name = typeof (data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    var author = typeof (data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var isbn = typeof(data.payload.isbn) === 'string' && data.payload.isbn.trim().length > 0 ? data.payload.isbn : false;
    var price = typeof(data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
     
    if (name && author && isbn && price && publisher) {
        const fileName =  helper.generateRandomString(30)
        fileUtil.create('books', fileName, data.payload, (err) => {
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

// get route -- for getting all books
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

// put route -- for updating a book
routeHandler._books.put = (data, callback) => {
    if (data.queryObj.name) {
        fileUtil.update('books', data.queryObj.name, data.payload, (err) => {
            if (!err) {
                callback(200, {message: 'Book updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update book'});
            }
        });
    } else {
        callback(404, {message: 'book not found'});
    }
};

// delete route -- for deleting a book
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

// post method using userId from helper.js
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
                callback(200, {message: 'User updated successfully'});
            } else {
                callback(400, {err: err, data: null, message: 'could not update user'});
            }
        });
    } else {
        callback(404, {message: 'user not found'});
    }
};


// delete user
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






    





routeHandler.ping = (data, callback) => {
    callback(200, {response: "server is live"})
}
routeHandler.notFound = (data, callback) => {
    callback(404, {response: "not found"})
}

module.exports = routeHandler;