const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/', forwardAuthenticated, (req, res) =>
{
res.render('index');
});

//developer profile
router.get('/developerProfile', ensureAuthenticated, (req, res) =>{
  res.render('developerProfile',{
    'user':req.user
  })
});
//company profile
router.get('/companyProfile', ensureAuthenticated, (req, res) =>{
  res.render('companyProfile',{
    'user':req.user
  })
});



module.exports = router;