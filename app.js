//entry point of the project
const express= require('express');
const nodemailer = require("nodemailer");
const path= require('path');
const mongoose= require('mongoose');
const config= require('./config/database');
const bodyParser= require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const async = require('async');
const passport = require('passport');
const crypto=require('crypto'); //to generate file names
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');



// Passport Config
require('./config/passport')(passport);


// DB Config
const db = require('./config/database').mongoURI;
mongoose.set('useUnifiedTopology', true);
// Connect to MongoDB atlas server
mongoose
  .connect(
    db,
    { useUnifiedTopology:true, useNewUrlParser: true , useFindAndModify: false, useCreateIndex: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

 

    
  

const app=express();

//setting up template engine
//app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express body parser
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.use(methodOverride('_method'));

let gfs;
mongoose.connection.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });
});


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
  res.locals.user = req.user || null;
  next();
});

//for using static files
app.use(express.static('public'));


app.get("/image/:filename", (req, res) => {
  // console.log('id', req.params.id)
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

//setting routes
app.use('/', require('./routes/index'));
app.use('/developer', require('./routes/developer'));
app.use('/company', require('./routes/company'));
app.use('/job',require('./routes/job'));
//app.use('/postJob', require('./routes/postJob'));

app.listen(3000);
console.log('server is running at port 3000');