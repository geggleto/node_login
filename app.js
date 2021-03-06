var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var uuid = require('node-uuid');

var RedisStore = require('connect-redis')(session);
var client = require('./deps/redis.js');

var routes = require('./controllers/home');
var users = require('./controllers/users');
var auth = require("./controllers/auth");
var expressValidator = require('express-validator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    genid: function(req) {
        return uuid.v4();
    },
    secret: 'zAc2Y6Y7g3+7M28fJ573f_5Ku~.%4G2f%897w4tH~T~9DZAz7+.54G_|=.-kX3NE',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        client : client
    })
}));
app.use(function (req, res, next) {
    req.redis = client;
    next();
});
app.use(function (req, res, next) {
    req.checkAndSanitize = function (param) {
        req.checkBody(param, 'Invalid ' + param).notEmpty();
        req.sanitize(param).escape();
        req.sanitize(param).trim();
    };
    next();
});

app.use(function (req, res, next) {
    if (!req.session) {
        res.status(500).json({"error" : "Redis Cluster Unavailable"});
    } else {
        next(); // otherwise continue
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
