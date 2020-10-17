const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const User = require('../models/User');
const Company=require('../models/Company');
const Job=require('../models/Job');

router.get('/postedJobs',  (req, res) =>{
    Company.findOne({"creator":req.user._id}, function (err, company) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
            Job.find({"postedBy":company._id}).exec(function(err, jobs){
                if (err){ 
                    console.log(err) 
                } 
                else{   
                    res.render('postedJobs',{
                        jobs:jobs
                    })
                }
            });   
        }
  });
  });


  router.get('/edit_postedJobs/:id', function (req, res) {//:id for getting arbitratry value which id related things to be edited

    Job.findById(req.params.id, function (err, job) {
        if (err){
            return console.log(err);
        }
        else{
        res.render('edit_postedjobs', {
            job:job
        });
    }
    });

});



module.exports = router;