/*
 * Module dependencies
 */
var express = require('express'),
    logger = require('morgan'),
    stylus = require('stylus'),
    nib = require('nib'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongodb = require('mongodb');

// MongoDB - Atlas
db_client = mongodb.MongoClient;
ADM_PASS = 'fhx8aut3Q4DAuSx'
DB_URI = 'mongodb+srv://admin:'+ADM_PASS+'@cluster-med-img-4tn3x.mongodb.net/test'

// Initialize express instance
var app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '50mb' }));

// Init stylus
function compile(str, path) {
	return stylus(str)
    .set('filename', path)
    .use(nib())
}
// Define Views path and engines
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(logger('dev'))

// Define Session
app.use(cookieParser());
app.use(session({
    secret: 'application_secret',
    resave: false,
    saveUninitialized: false
}));

// Define public directory
app.use(stylus.middleware({ 
    src: __dirname + '/public',
    compile: compile
}))
app.use(express.static(__dirname + '/public'))
// Image uploaded directory
app.use(stylus.middleware({
    src: __dirname + '/images',
    compile: compile
}))
app.use(express.static(__dirname + '/images'))

// Create External Routes

// Index
var index = require('./routes/index');
app.use(index);
// Users
var userpage = require('./routes/user');
app.use(userpage);
// Annotations 
var pilot = require('./routes/annot');
app.use(pilot);
// Gallery
var gallery = require('./routes/gallery');
app.use(gallery);
// Manager
var manager = require('./routes/manager');
app.use(manager);

// Define a global variable for user session
global.sess_user = undefined;

// Deploy
app.listen(3000)