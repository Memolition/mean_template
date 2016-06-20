var express = require('express');
var router = express.Router();
var app = module.export=express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

var routes = require(__dirname + '/routes/index.js');
var User = require(__dirname + '/private/users.js');
var Blog = require(__dirname + '/private/blog.js');

mongoose.connect('mongodb://localhost/node_template', function(err) {       //Connect MongoDB 
    if(err) {
        console.log('db connection error', err);                            //Log any db connection error
    } else {
        console.log('db connection successful');
    }
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, '/public/client')));
app.set('views', path.join(__dirname, '/public/views'));  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'pug');
app.use(router);
app.use(express.static(path.join(__dirname, '/public/res')));   // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());                                 // start passport authentication
app.use(passport.session());                                    // start passport session

app.use('/', routes);

app.listen('3200');                                             //Start app and listen
console.log('Succesfully got application up and running on port 3200!');