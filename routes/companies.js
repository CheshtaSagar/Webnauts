const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const { forwardAuthenticated1 } = require('../config/auth');//for authentication
const Company = require('../models/Company');//company Model

//login page
router.get('/companyLogin',forwardAuthenticated1 , function(req,res)
{
res.render('companyLogin');
});

//register
router.get('/companyRegister', function(req,res)
{
res.render('companyRegister');
});

//Register post Handling
router.post('/companyRegister', (req, res) => {
    const { name, email,companyName, password, password2 } = req.body;
    let errors = [];
  
    //Validations for registration form
    if (!name || !email || !companyName || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('companyRegister', {
        errors,
        name,         //    if entries are not according to validation render filled fields
        email,
        companyName,
        password,
        password2
      });
    } else {
     //if Validations passed
     Company.findOne({email: email})
     .then(company =>{
        if(company){

            errors.push('Email is already Exists');
            res.render('companyRegister', {
                errors,
                name,         
                email,            //if email already exists render the fields
                companyName,            
                password,
                password2
              });
        }
        else{
            const newCompany = new Company({
                name,
                email,       ///if all validation passed store a new Developer indb
                companyName,       ///if all validation passed store a new Developer indb
                password
            });
            
            //to save password in hash format(pass the plain password and hash will be the encyrpted password)
            bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newCompany.password, salt, (err, hash)=>{
                if(err) throw err;
                //set password to hash
                newCompany.password=hash;
                //save the developer
                newCompany.save()
                .then(company => {
                    req.flash('success_msg', 'Company Registered Successfully and can log in ');
                    res.redirect('/companies/companyLogin'); 
                })
                .catch(err => console.log(err));
            }))
        }
     });
    }
  });

  //login handling(if login is successful,redirect company to its profile)
   router.post('/companyLogin', (req, res, next) => {
     passport.authenticate('local', {
       successRedirect: '/companyProfile',
       failureRedirect: '/companyLogin',
       failureFlash: true
     })(req, res, next);
   });

  /*router.post('/companyLogin', (req, res) => {
   res.redirect('/companyProfile')
    });
  */

  
  // Logout handling
  router.get('/logout', (req, res) => {
    req.logout();//passport middleware function
    req.flash('success_msg', 'You are logged out');
    res.redirect('/companies/companyLogin');
  });

module.exports = router;