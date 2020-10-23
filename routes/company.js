const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');//for storing encrypted password
const passport = require('passport');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');

router.get('/postedJobs', (req, res) => {
    Company.findOne({ "creator": req.user._id }, function (err, company) {
        if (err) {
            console.log(err)
        }
        else {
            Job.find({ "postedBy": company._id }).exec(function (err, jobs) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.render('postedJobs', {
                        jobs: jobs,
                        companyIcon:company.companyIcon
                    })
                }
            });
        }
    });
});


router.get('/edit_postedJobs/:id', function (req, res) {//:id for getting arbitratry value which id related things to be edited

    Job.findById(req.params.id, function (err, job) {
        if (err) {
            return console.log(err);
        }
        else {
            res.render('edit_postedjobs', {
                job: job
            });
        }
    });

});

router.get('/appliedBy/:id', function (req, res) {//:id for getting arbitratry value which id related things to be edited

    Job.findById(req.params.id).populate('appliedBy').exec(function (err, job) {
        if (err) {
            return console.log(err);
        }
        else {
            // res.render('edit_postedjobs', {
            //     job: job
            // });
            console.log(job);
            res.redirect('/company/postedJobs')
        }
    });

});


router.post('/edit_postedjobs/:id', function (req, res) {

    const id=req.params.id;
    
    const job =({
        jobTitle: req.body.jobTitle, 
        jobType:req.body.jobType,
        min_exp:req.body.min_exp,
        min_salary:req.body.min_salary,
        max_salary:req.body.max_salary,
        jobDescription:req.body.jobDescription,
        LastDate:req.body.LastDate,
        jobSkills:req.body.jobSkills,
        jobQualification:req.body.jobQualification,
        jobLocation:req.body.jobLocation,
        jobCity:req.body.jobCity,
        jobState:req.body.jobState,
        jobCountry:req.body.jobCountry

    });

    let errors = [];

    //Validations for registration form
    if (!job.jobTitle || !job.jobType || !job.min_exp || !job.min_salary || !job.max_salary || !job.jobDescription || !job.jobSkills || !job.jobQualification || !job.jobLocation || !job.jobCity || !job.jobState || !job.jobCountry || !job.LastDate) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('edit_postedJobs', {
            job: job,
            id: id
        });
    } else {
        Job.findOneAndUpdate({ _id: id }, { $set: job }, function (err) {
            if (err)
                console.log(err);
            else {
                console.log(job);
                req.flash('success_msg', 'job updated');
                res.redirect('/company/postedjobs');
            }
        }
        )
    }

});

router.get('/delete_postedJob/:id', function (req, res) {
    Job.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash('error_msg', 'Error while deleting');
            console.log(err);
        }
        else {
            // console.log('deleted');
            req.flash('success_msg', 'Job deleted!');
            res.redirect('/company/postedJobs');
        }

    });
});

router.get('/companyDetails/:id', function (req, res) {
    Company.findById(req.params.id).exec (function (err, company) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(company);
            res.render('companyDetails', {
                company: company
            });
        }
    });
});


module.exports = router;