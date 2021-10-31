const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routeHandler = require('./lib/routeHandler');

const httpServer = http.createServer((req, res) => {
// parse incoming url
const parsedurl = url.parse(req.url, true);
// get the path name
const pathname = parsedurl.pathname;
const trimedPath = pathname.replace(/^\/+|\/+$/g, '');
// get the Http method
const method = req.method.toLowerCase(); //http method
// get the query string
const queryStringObj = parsedurl.query; // getting queries from request
// get the request headers
const headers = req.headers;

const decoder = new StringDecoder('utf-8')
var buffer = '';
req.on('data', (data) => {
    buffer += decoder.write(data);
});

req.on('end', () => {
    buffer += decoder.end();
    // console.log("decoded result", buffer);
    // const parsedPayload = JSON.parse(buffer)
    const parsedPayload = buffer !== "" ? JSON.parse(buffer) : {};
    // console.log({buffer}

    const data = {
        trimedPath : trimedPath,
        queryObj : queryStringObj,
        method : method,
        headers : headers,
        payload : parsedPayload
    }

    const chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : router.notFound;
    // const chosenHandler = router[trimedPath] || router.notFound;
    // use chosenHandler to handle request
    chosenHandler(data, (statusCode, result) => {
        // use the status code to send response
        statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
        result = typeof(res) === 'object' ? result : {};

        const responseObj = JSON.stringify(result);
        
        res.setHeader('Content-type', "application/json");
        res.writeHead(statusCode);
        res.write(responseObj);
        // res.write(JSON.stringify({response: "request got to the server", payload: parsedPayload}));
        res.end()
        console.log(`the url visited was, ${trimedPath} and the method is ${method}`)

    });
})

});


// start listening on port
httpServer.listen(3000, () => {
    console.log('server is listening on port 3000')
});

const router = {
    ping : routeHandler.ping,
    books : routeHandler.Books,
    notFound : routeHandler.notFound,
    users : routeHandler.Users
}
