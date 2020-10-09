const Company = require("../models/Company");
const Developer = require("../models/Developer");

//add this if we want to protect our dashboard or profile
module.exports = {
    //fot developer
    ensureAuthenticated: function(req, res, next) {
      {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/developers/login');
    }
    
}   
    ,
    //for developer
    forwardAuthenticated: function(req, res, next) {
      
      {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/developerProfile');      
    }
  }

  ,
    //for company
    ensureAuthenticated1: function(req, res, next) {
      {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/companies/companyLogin');
    }
    
}   
    ,
    //for company
    forwardAuthenticated1: function(req, res, next) {
      
      {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/companyProfile');      
    }
  }

  };