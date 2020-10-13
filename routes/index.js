const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const User = require('../models/User');
//const { ensureAuthenticated } = require('../config/auth');
//const { ensureAuthenticated1 } = require('../config/companyauth');



router.get('/',  (req, res) =>
{
res.render('index');
});

//login
router.get('/login',  function(req,res)
{
res.render('login');
});

//register
router.get('/register',  function(req,res)
{
res.render('register');
});

//Register post Handling
router.post('/register', (req, res) => {
  const { email, userType, password, password2 } = req.body;
  let errors = [];

  //Validations for registration form
  if (!email || !userType || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 5) {
    errors.push({ msg: 'Password must be at least 5 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,         //    if entries are not according to validation render filled fields
      email,
      userType,
      password,
      password2
    });
  } else {
   //if Validations passed
   User.findOne({email: email})
   .then(user =>{
      if(user){

          errors.push('Email is already Exists');
          res.render('register', {
              errors,         
              email, 
              userType,           //if email already exists render the fields
              password,
              password2
            });
      }
      else{
          const newUser = new User({
              email,
              userType,       ///if all validation passed store a new User indb
              password
          });
          
          //to save password in hash format(pass the plain password and hash will be the encyrpted password)
          bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newUser.password, salt, (err, hash)=>{
              if(err) throw err;
              //set password to hash
              newUser.password=hash;
              //save the developer
              newUser.save()
              .then(user => {
                  req.flash('success_msg', 'Registered Successfully and can log in ');
                  res.redirect('/login'); 
              })
              .catch(err => console.log(err));
          }))
      }
   });
  }
});



//login handling
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', function(err, user) {
//     if(err)
//     res.redirect('/login');
//     else{
//     if (user.userType==='developer')
//       res.redirect('/developerProfile');
//       else
//         res.redirect('/companyProfile') ;
//     }// failureRedirect: '/login'
//     // failureFlash: true
//   })(req, res, next);
// });

//login handling
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });


//developer profile
router.get('/profile', (req, res) =>{
  if(req.user.userType==='developer'){
  res.redirect('/developerProfile')}
  else
  {
    res.redirect('/companyProfile')
  }
});
// router.get('/profile', (req, res) =>{
//   if(req.user.userType==='developer'){
//   res.render('developerProfile',{
//     'user':req.user
//   })}
//   else
//   {
//     res.render('companyProfile',{
//       'user':req.user
//     })
//   }
// });


//for portfolio page
router.get('/developerPortfolio', function(req,res)
{
res.render('developerPortfolio');
});
//developerProfile
router.get('/developerProfile', function(req,res)
{
res.render('developerProfile',{
  'user': req.user
}
);
});


//company profile
router.get('/companyProfile',  (req, res) =>{
  res.render('companyProfile',{
    'user': req.user
  })
});

// Logout handling
  router.get('/logout', (req, res) => {
    req.logout();//passport middleware function
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });



module.exports = router;