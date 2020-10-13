//entry point of the project
const express= require('express');
const path= require('path');
const mongoose= require('mongoose');
const config= require('./config/database');
const bodyParser= require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// const expressLayouts = require('express-ejs-layouts');
// const expressValidator = require('express-validator');
// const expressMessages = require('express-messages');

// Passport Config
require('./config/passport')(passport);
//const passport1=require('./config/passport');

//connect to db compass
// mongoose.connect(config.database);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connected to mongoDb..');
// });

// DB Config
const db = require('./config/database').mongoURI;

// Connect to MongoDB atlas server
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app=express();

//setting up template engine
//app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

//Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Express middleware to connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//for using static files
app.use(express.static('public'));


//setting routes
app.use('/', require('./routes/index'));
//app.use('/developers', require('./routes/developers'));
//app.use('/companies', require('./routes/companies'));


app.listen(3000);
console.log('server is running at port 3000');