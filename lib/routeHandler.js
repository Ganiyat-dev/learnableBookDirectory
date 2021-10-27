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
// main book route object
routeHandler._books = {};

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



routeHandler.ping = (data, callback) => {
    callback(200, {response: "server is live"})
}
routeHandler.notFound = (data, callback) => {
    callback(404, {response: "not found"})
}

module.exports = routeHandler;