var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var flash =  require ('connect-flash');
var logger = require('morgan');
var db = require('./lib/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var operatorRouter = require('./routes/operator')(passport);
var providerRouter = require('./routes/provider');
var entryRouter = require('./routes/entry');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/')));
// app.use('/provider', express.static(path.join(__dirname, '/uploads')));
app.use(compression());
app.use(helmet.hsts({
  maxAge: 10886400000,
  includeSubdomains: true
}));
app.use(session({
  key: 'session_cookie_name',
  secret: '4215DIELS.@ASD3221!@#asd',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '111111',
    database: 'aroom'
  })
}));
app.use(flash());
var passport = require('./lib/passport')(app);

app.use('/', indexRouter);
app.use('/operator', operatorRouter);
app.use('/provider', providerRouter);
app.use('/entry', entryRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, () => console.log('Example app listening on port 3000!'))
// module.exports = app;
