const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');//for storing encrypted password
const passport = require('passport');


//developer Model
const Developer = require('../models/Developer');
const { forwardAuthenticated } = require('../config/auth');

//login page
router.get('/login', forwardAuthenticated, function(req,res)
{
res.render('login');
});

//register
router.get('/register', forwardAuthenticated, function(req,res)
{
res.render('register');
});

//Register post Handling
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    //Validations for registration form
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,         //    if entries are not according to validation render filled fields
        email,
        password,
        password2
      });
    } else {
     //if Validations passed
     Developer.findOne({email: email})
     .then(developer =>{
        if(developer){

            errors.push('Email is already Exists');
            res.render('register', {
                errors,
                name,         
                email,            //if email already exists render the fields
                password,
                password2
              });
        }
        else{
            const newDeveloper = new Developer({
                name,
                email,       ///if all validation passed store a new Developer indb
                password
            });
            
            //to save password in hash format(pass the plain password and hash will be the encyrpted password)
            bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newDeveloper.password, salt, (err, hash)=>{
                if(err) throw err;
                //set password to hash
                newDeveloper.password=hash;
                //save the developer
                newDeveloper.save()
                .then(developer => {
                    req.flash('success_msg', 'Registered Successfully and can log in ');
                    res.redirect('/developers/login'); 
                })
                .catch(err => console.log(err));
            }))
        }
     });
    }
  });

  //login handling
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/developerProfile',
      failureRedirect: '/developers/login',
      failureFlash: true
    })(req, res, next);
  });


  
  // Logout handling
  router.get('/logout', (req, res) => {
    req.logout();//passport middleware function
    req.flash('success_msg', 'You are logged out');
    res.redirect('/developers/login');
  });

module.exports = router;