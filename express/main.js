var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash =  require ('connect-flash');
var db = require('./lib/db');

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/')));
app.use(compression());
app.use(helmet());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));
app.use(flash());
var passport = require('./lib/passport')(app);

app.get('*', function(request, response, next){
  request.list = db.get('topics').value();
  next();
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter); 

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