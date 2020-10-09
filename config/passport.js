const LocalStrategy = require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

// Load developer model
const Developer = require('../models/Developer');
const Company=require('../models/Company');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match developer with email
      if(Developer)
     {
      Developer.findOne({
        email: email
      }).then(developer => {
        if (!developer) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, developer.password, (err, isMatch) => {     ////developer.passworg is hashed one stored in db
          if (err) throw err;
          if (isMatch) {
            return done(null, developer);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    }
      ///if this is a request for company ,then match company with email
    else
    {
      Company.findOne({
        email: email
      }).then(company => {
        if (!company) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password,company.password, (err, isMatch) => {     ////company.password is hashed one stored in db
          if (err) throw err;
          if (isMatch) {
            return done(null, company);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    }
    })
  );
  
  if(Developer)
  {
  passport.serializeUser(function(developer, done) {
    done(null, developer.id);
  });
  }
  if(Company)
  {
    passport.serializeUser(function(company, done) {
      done(null, company.id);
    });
  }

  if(Developer)
  {
  passport.deserializeUser(function(id, done) {
    Developer.findById(id, function(err, developer) {
      done(err, developer);
    });
  });
}
if(Company)
{
    passport.deserializeUser(function(id, done) {
    Company.findById(id, function(err, company) {
    done(err, company);
    });
  });
}
};
