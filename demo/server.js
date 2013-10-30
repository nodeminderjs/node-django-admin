/**
 * node-django-admin
 * server.js
 */

var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    pkg = require('./package.json'),
    env = process.env.NODE_ENV || 'development';

var admin = require('node-django-admin');

// Bootstrap db connection
mongoose.connect('mongodb://localhost/node-django-admin');

// Bootstrap models
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js'))
    require(models_path + '/' + file);
});

// Express settings
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(__dirname + '/public'));
if (env !== 'test') {
  app.use(express.logger('dev'));
}
app.use(function(req, res, next) {  // expose package.json to views
  res.locals.pkg = pkg;
  next();
});
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'SECRET' }));
app.use(app.router);

// Bootstrap routes

// Bootstrap admin site
admin.config(app, mongoose, '/admin');

// Run server
var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

