const express= require('express');
const router= express.Router();
const Job=require('../models/Job');


router.post('/postJob', async(req, res) => {
   
      


    const job = new Job({
        jobTitle: req.body.jobTitle, 
        jobType:req.body.jobType,
        min_exp:req.body.min_exp,
        min_salary:req.body.min_salary,
        max_salary:req.body.max_salary,
        jobDescription:req.body.jobDescription,
        jobSkills:req.body.jobSkills,
        jobQualification:req.body.jobQualification,
        jobLocation:req.body.jobLocation,
        jobCity:req.body.jobCity,
        jobState:req.body.jobState,
        jobCountry:req.body.jobCountry,
        postedBy:req.user._id//storing id of current company(user here) in this field

      });
    
      job.save()
    .then(user => {
        req.flash('success_msg', 'job posted ');
        console.log('job successfully posted'); //do anything here(TO BE DECIDED)
    })
    .catch(err => console.log(err));
  
    });
   

module.exports = router;