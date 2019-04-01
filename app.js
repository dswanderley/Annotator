/*
 * Module dependencies
 */
var express = require('express'),
    logger = require('morgan'),
    stylus = require('stylus'),
    nib = require('nib');

// Initialize express instance
var app = express();
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
// Annotations 
var pilot = require('./routes/annot');
app.use(pilot);
// Gallery
app.use('/gallery', pilot);

// Deploy
app.listen(3000)