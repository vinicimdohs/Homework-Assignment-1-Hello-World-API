// Please create a simple "Hello World" API. Meaning:

// 1. It should be a RESTful JSON API that listens on a port of your choice.

// 2. When someone sends an HTTP request to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want.

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

const port = 3500;
var httpServer = http.createServer(function(req,res){

    var parsedUrl = url.parse(req.url,true)//ATENÇÃO

    //Get the path
    var path = parsedUrl.pathname;
    var trimedPath = path.replace(/^\/+|\/+$/g,'');

    //Get the query string as an object
    var queryStringObject = parsedUrl.query;

    //Get the HTTP Method
    var method = req.method.toLowerCase();

    //Get the Headers as an object
    var headers = req.headers;

    //Get the payload,if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();

        //Choose the handler this request should go to
        var chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : handlers.notFound;
        
        //Construct the data object to end to the handler
        var data = {
            'trimedPath':trimedPath,
            'queryStringObject':queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        };

        //Route the Request to the handler
        chosenHandler(data,function(statusCode,payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            //convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
                //Send the Response
                res.end(payloadString);

            //Log the request path
            console.log('Returning this response: ',statusCode,payloadString)
        });
    })
});

httpServer.listen(port,function(){
    console.log(`The server is listening on port ${port}`)
})

var handlers = {};

handlers.hello = function(data,calback){
     calback(406,{'message':'Welcome to my Restful JSON API'});
}

var router = {
    'hello' : handlers.hello,
}