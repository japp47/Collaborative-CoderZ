var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('./passport'); 
var config = require('./config');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');

mongoose.connect(config.dbConnstring, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function() {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error:', err);
});

global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res, next) {
  if(req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', taskRouter);


app.use(function(req, res, next) {
  res.status(404).render('error', {
      message: '404 Not Found',
      error: {}
  });
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
