const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Developer = require('../models/Developer');
const Resume = require('../models/Resume');


//to let user apply for an opening
router.get('/apply/:id', function (req, res) {


    //finding developer with same logged in user id
    Developer.findOneAndUpdate({ "userDetails": req.user.id }, { $push: { "AppliedJobs": req.params.id } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
            throw err;
        }
        else {
            console.log(docs);//shows reqd developer
            console.log(req.params.id);
            //finding job having same id as current job
            Job.findOneAndUpdate({ _id: req.params.id }, { $push: { "appliedBy": docs._id } }, { new: true }, function (err, job) {
                if (err)
                    console.log(err);
                else {
                    console.log(job);
                    console.log('Successfully applied for the job');
                    req.flash('success_msg', 'Successfully applied for the job');
                    res.redirect('/developer/allAppliedJobs');//CHANGE THIS LATER
                }
            });
        }

    });

});




///
///////
////////
//to render the page containg info about all the applied jobs
router.get('/allAppliedJobs', (req, res) => {
    (Developer.findOne({ "userDetails": req.user._id }).populate('AppliedJobs')).exec(function (err, developer) {
        if (err) {
            console.log(err)
        }

        else {
            Job.find({ '_id': developer.AppliedJobs }).populate('postedBy').exec(function (err, jobs) {
                if (err)
                    console.log(err)
                // res.send('appliedjobs');
                //         console.log(job);
                res.render('allAppliedJobs', {
                    title:'All Applied Jobs',
                    jobs: jobs//gives array of job ids for which developer has applied
                })

            })
        }
    });

});

router.get('/subscribe/:id', function (req, res) {
    Developer.findOne({"userDetails":req.user._id, 'following': req.params.id }, function (err, developer) {
        if (err) {
            console.log(err)
            throw err;
        }
        if (developer) {
            req.flash('success_msg', 'Already Subscribed for the Company');
            res.redirect('/allCompanies');
        }
        if (!developer) {

            //finding developer with same logged in user id
            Developer.findOneAndUpdate({ "userDetails": req.user.id }, { $push: { "following": req.params.id } }, { new: true }, function (err, docs) {
                if (err) {
                    console.log(err)
                    throw err;
                }
                else {
                    //console.log(docs);//shows reqd developer
                    //console.log(req.params.id);
                    Company.findOneAndUpdate({ _id: req.params.id }, { $push: { "subscribers": docs._id } }, { new: true }, function (err, company) {
                        if (err)
                            console.log(err);
                        else {
                            //console.log(company);
                            console.log('Successfully Subscribed for the Company');
                            req.flash('success_msg', 'Successfully Subscribed for the Company');
                            res.redirect('/developer/followings');//CHANGE THIS LATER
                            //res.send('subscribed');
                        }
                    });
                }

            });
        }
    })
});
//to render the page containg info about all the applied jobs
router.get('/followings', (req, res) => {
    (Developer.findOne({ "userDetails": req.user._id }).populate('following')).exec(function (err, developer) {
        if (err) {
            console.log(err)
        }
        else {

            //console.log(developer);
            console.log("followings");
            res.render('followingCompanies', {
               companies: developer.following//gives array of job ids for which developer has applied
            })
        }
    });

});


router.get('/unsubscribe/:id', function (req, res) {

            //finding developer with same logged in user id
            Developer.findOneAndUpdate({ "userDetails": req.user.id }, { $pull: { "following": req.params.id } }, { new: true }, function (err, docs) {
                if (err) {
                    console.log(err)
                    throw err;
                }
                else {
                    //console.log(docs);//shows reqd developer
                    //console.log(req.params.id);
                    Company.findOneAndUpdate({ _id: req.params.id }, { $pull: { "subscribers": docs._id } }, { new: true }, function (err, company) {
                        if (err)
                            console.log(err);
                        else {
                            //console.log(company);
                            console.log('Unsubscribed from the Company');
                            req.flash('success_msg', 'You Unsubscribed from the Company');
                            res.redirect('/developer/followings');//CHANGE THIS LATER
                            //res.send('subscribed');
                        }
                    });
                }

            });
});

//to let user access resume designed
router.get('/portfolio/:id',(req,res)=>
{
    Developer.findOne({_id: req.params.id }, function (err, developer) {
        if (err) {
          console.log(err)
        }
        else {
        Resume.findOne({ "creator": developer._id }, function (err, resume){
            if(err)
            {
                console.log(err);
            }
            else if(!resume)
            res.send('OOps!!No resume exists');
            else
            {

              res.render('portfolio',{
                  resume:resume,
                  developer:developer
              });

            }

            
        });
    }
});

});


//to set status of job application of developer as accepted
router.get('/accept/:devId/:jobId',(req,res)=>{
   
Developer .findOneAndUpdate({ _id: req.params.devId },
         { $set: { "Status":{"current":"Accepted","Job":req.params.jobId} }}, 
         { new: true }, function (err, developer) {
           if(err)
           console.log(err);
           else
           {
            req.flash('success_msg', developer.name +'has been selected');
               console.log(developer.name +'has been selected');
               //redirect HERE
               res.redirect('/company/postedJobs');
             }

         });


});
//to set status of job application of developer as rejected
router.get('/reject/:devId/:jobId',(req,res)=>{
   
    Developer .findOneAndUpdate({ _id: req.params.devId },
             { $set: { "Status":{"current":"Rejected","Job":req.params.jobId} }}, 
             { new: true }, function (err, developer) {
               if(err)
               console.log(err);
               else
               {
                req.flash('success_msg', developer.name +'has been rejected');
                   console.log(developer.name +'has been rejected');
                   res.redirect('/company/postedJobs');
                 }
    
             });
    
    
    });


 //to  show accepted or rejected jobs   
router.get('/allStats/:string',(req,res)=>{
    Developer.findOne({ "userDetails": req.user._id }).populate('Status.Job').exec(function (err, developer) {
        if (err) {
            console.log(err)
        }
        else 
        {
        console.log(developer.Status);
        if(req.params.string==='Accepted')
        res.render('allStats',{
            Status:developer.Status,
            title:'Accepted Applications'
        });
        if(req.params.string==='Rejected')
        res.render('allStats',{
            Status:developer.Status,
            title:'Rejected Applications'
        });
     
    }
    
});
});
module.exports = router;