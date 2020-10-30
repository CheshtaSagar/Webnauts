//to search jobs
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const {Company,Post} = require("../models/Company");
const Developer = require("../models/Developer");
const Job = require("../models/Job");
var auth = require('../config/auth');
var isDeveloper = auth.isDeveloper;
var isCompany = auth.isCompany;

//to search jobs by location
router.get("/SearchByLocation", (req, res) => {
  const searchFields = req.query.byLocation;
  const loggedIn = req.isAuthenticated() ? true : false;
  //if one of the field matches
  Job.find({
    $or: [
      { jobCity: { $regex: searchFields, $options: "$i" } },
      { jobLocation: { $regex: searchFields, $options: "$i" } },
      { jobCountry: { $regex: searchFields, $options: "$i" } },
      { jobState: { $regex: searchFields, $options: "$i" } },
    ],
  })
    .populate("postedBy")
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn:loggedIn
          });
        }
      });
    });
});

router.get("/SearchByTitle", (req, res) => {
  const searchFields = req.query.byTitle;
  const loggedIn = req.isAuthenticated() ? true : false;
  //if one of the field matches
  Job.find({ $or: [{ jobTitle: { $regex: searchFields, $options: "$i" } },
  {jobSkills: { $regex: searchFields, $options: "$i" }}] })
    .populate("postedBy")
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn:loggedIn
          });
        }
      });
    });
});

//to sort jobs according to date of posting
router.get("/sortByPostDate/:type", (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;
  if(req.params.type==='Ascending'){
  //if one of the field matches
  Job.find({})
    .populate("postedBy").sort({postedOn:1})
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn:loggedIn
          });
        }
      });
    });
  }

  else{

    Job.find({})
    .populate("postedBy").sort({postedOn:-1})
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn:loggedIn
          });
        }
      });
    });

  }
});


//to sort jobs according to last date of application
router.get("/sortByLastDate/:type", (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;
  if(req.params.type==='Ascending'){
  //if one of the field matches
  Job.find({})
    .populate("postedBy").sort({postedOn:1})
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn : loggedIn
          });
        }
      });
    });
  }

  else{

    Job.find({})
    .populate("postedBy").sort({postedOn:-1})
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
            loggedIn : loggedIn
          });
        }
      });
    });

  }
});






module.exports = router;
