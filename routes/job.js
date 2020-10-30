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
          });
        }
      });
    });
});

router.get("/SearchByTitle", (req, res) => {
  const searchFields = req.query.byTitle;
  //if one of the field matches
  Job.find({ $or: [{ jobTitle: { $regex: searchFields, $options: "$i" } }] })
    .populate("postedBy")
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
          });
        }
      });
    });
});


router.get("/SearchByLastDate", (req, res) => {
  const searchFields = req.query.byLastDate;
  //if one of the field matches
  Job.find({ LastDate: { $regex: searchFields, $options: "$i" } })
    .populate("postedBy")
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
          });
        }
      });
    });
});



router.get("/SearchByPostedDate", (req, res) => {
  const searchFields = req.query.byPostDate;
  //if one of the field matches
  Job.find({ postedOn: { $regex: searchFields, $options: "$i" } })
    .populate("postedBy")
    .exec(function (err, jobs) {
      Company.find({}).exec(function (err, companies) {
        if (err) {
          console.log(err);
        } else {
          res.render("allJobs", {
            jobs: jobs,
            companies: companies,
          });
        }
      });
    });
});

 //router.get('/SearchByCompany',(req, res)=>{

//   const searchFields=req.query.byCompany;
//   //if one of the field matches
//   Job.find().populate({
//     path:'postedBy',
//     match:{
//       companyName:{$regex:searchFields,$options:'$i'}
//     }}).exec(function(err, jobs) {
//       res.render('allJobs', {
//         jobs: jobs
//            });

//   });
// });

module.exports = router;
