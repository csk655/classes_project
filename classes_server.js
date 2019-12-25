var express=require('express');
var bodyParser=require('body-parser');
var http=require('http');

var app=express();
app.use(bodyParser.json()); // Accept JSON params
app.use(bodyParser({limit:'50mb'}));// for sending large payload size
app.use(bodyParser({extended: true}));
app.use(bodyParser.urlencoded({extended:true}))// Accept URL Encoded params


// for accessing image folder globally.
app.use(express.static('public'));
//Serves all the request which includes /upload in the url from Images folder
app.use('/upload', express.static(__dirname + '/profile_upload'));
app.use('/upload', express.static(__dirname + '/doc_upload'));


var server=http.createServer( function(req,res){
    res.setHeader('Content-Type', 'application/json');
    //res.writable(sat)

});

 server = app.listen(6000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server app listening at http://%s:%s", host, port)
 });




 
 // handling routes
 // just for example
  var user_login=require('./routes/login');

  app.post('/login',user_login.login);
  


