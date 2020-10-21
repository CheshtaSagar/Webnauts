const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const User = require('../models/User');
const Company=require('../models/Company');
const Job=require('../models/Job');
const Developer=require('../models/Developer');


//to let user apply for an opening
router.get('/apply/:id',function(req,res){


    //finding developer with same logged in user id
    Developer.findOneAndUpdate({ "userDetails": req.user.id }, {$push:{"AppliedJobs":req.params.id}},{new:true},function (err, docs) {
        if (err) {
            console.log(err)
            throw err;
        }
        else {
          console.log(docs);//shows reqd developer
          console.log(req.params.id);
          //finding job having same id as current job
         Job.findOneAndUpdate({_id:req.params.id},{$push:{"appliedBy":docs._id}},{new:true},function(err,job){
         if(err)
         console.log(err);
         else
         {
         console.log(job);
         console.log('Successfully applied for the job');
         req.flash('success_msg','Successfully applied for the job');
         res.redirect('/allApliedJobs');//CHANGE THIS LATER
         }
         });
    }
    
});

});




///
///////
////////
//to render the page containg info about all the applied jobs
router.get('/allAppliedJobs',  (req, res) =>{
    Developer.findOne({"userDetails":req.user._id}, function (err, developer) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
                       ///problem here***********************************
                        res.render('allAppliedJobs',{
                           
                        jobs:developer.AppliedJobs//gives array of job ids for which developer has applied
                    })
                
                    console.log(developer.AppliedJobs);
                
                } 
            });   
        
  });



module.exports = router;