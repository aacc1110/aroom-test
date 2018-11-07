var express = require('express');
var app = express();
var fs = require('fs');
var path = require("path");
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});
//add the manifest
app.use("./manifest.json", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/cache-manifest");
  console.log(path.join(__dirname,"manifest.json"));
  //send the manifest file
  //to be parsed bt express
  res.sendFile(path.join(__dirname,"manifest.json"));
});

//add the service worker
app.use("./sw.js", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/javascript");  
  res.sendFile(path.join(__dirname,"sw.js"));
});

app.use("./loader.js", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/javascript");  
  res.sendFile(path.join(__dirname,"loader.js"));
});

app.use('/', indexRouter);
app.use('/topic', topicRouter); 

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
 
app.listen(3000, ()=>{
  console.log("server running @ localhost:3000");
});