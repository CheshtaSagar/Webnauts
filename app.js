//entry point of the project
var express= require('express');
var path= require('path');
var mongoose= require('mongoose');
var config= require('./config/database');
var bodyParser= require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var expressMessages = require('express-messages');

//connect to dbs
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongoDb..');
});

var app=express();

//setting up template engine
app.set('view engine','ejs');

//for using static files
app.use(express.static('/public'));

var pages = require('./routes/pages.js');//taking to pages.js in routes
app.use('/', pages);

app.listen(3000);
console.log('server is running at port 3000');