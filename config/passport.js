const LocalStrategy = require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

// Load developer model
const Developer = require('../models/Developer');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match developer with email
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
    })
  );

  passport.serializeUser(function(developer, done) {
    done(null, developer.id);
  });

  passport.deserializeUser(function(id, done) {
    Developer.findById(id, function(err, developer) {
      done(err, developer);
    });
  });
};
