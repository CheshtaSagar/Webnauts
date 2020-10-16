 /* const express= require('express');
 const router= express.Router();
const Company=require('../models/Company');
const User=require('../models/User');

router.post('/company',(req, res) => {
console.log(req.user._id);
  var company = new Company({
  creator : req.user._id,
  email:req.user.email,
  companyLocation:req.body.location,
  companyCity:req.body.city,
  companyState:req.body.state,
  companyCountry:req.body.country,
  companyName:req.body.companyName,
  companyHeadName:req.body.companyHeadName,
  establishmentDate: req.body.establishmentDate,
  companyUrl:req.body.companyUrl,
  companyDescription:req.body.companyDescription,
  contactNo:req.body.contactNo,
  
  });
  company.save(function (err) {
    if (err) return handleError(err);
    console.log('posted');
  });

});
  
module.exports = router; */