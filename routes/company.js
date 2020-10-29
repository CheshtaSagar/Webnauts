const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const User = require("../models/User");
const {Company,Post} = require("../models/Company");
const Job = require("../models/Job");
const Grid = require("gridfs-stream");
const { storage, upload } = require("../config/grid");

Grid.mongo = mongoose.mongo;

var auth = require('../config/auth');
const Developer = require("../models/Developer");
const { find } = require("../models/User");
var isDeveloper = auth.isDeveloper;
var isCompany = auth.isCompany;

router.get("/postedJobs", isCompany,(req, res) => {
  Company.findOne({ creator: req.user._id }, function (err, company) {
    if (err) {
      console.log(err);
    } else {
      Job.find({ postedBy: company._id }).exec(function (err, jobs) {
        if (err) {
          console.log(err);
        } else {
          res.render("postedJobs", {
            jobs: jobs,
            companyIcon: company.companyIcon,
          });
        }
      });
    }
  });

});

router.get("/edit_postedJobs/:id", isCompany,function (req, res) {
  //:id for getting arbitratry value which id related things to be edited

  Job.findById(req.params.id, function (err, job) {
    if (err) {
      return console.log(err);
    } else {
      res.render("edit_postedjobs", {
        job: job,
      });
    }
  });
});

//see applicants of a particular job
router.get("/appliedBy/:id",isCompany, function (req, res) {
  Job.findById(req.params.id)
    .populate("appliedBy")
    .exec(function (err, job) {
      if (err) {
        return console.log(err);
      } else {
        res.render("appliedBy", {
          developers: job.appliedBy,
          jobId: req.params.id,
          title:"All Applicants"
        });
      }
    });
});

router.get("/allStats/:id/:string", isCompany,(req, res) => {
  
        if (req.params.string === "Accepted")
        {
          Developer.find({"Status":{_id:req.params.id, current:"Accepted"}}).exec(function(err,developers){
            if (err) {
              console.log(err);
            } else { 
          res.render("applicantsStats", {
            developers: developers,
            jobId: req.params.id,
            title: "Accepted Applicants",
          });
        }
        })
        }
        if (req.params.string === "Rejected")
        {
          Developer.find({"Status":{_id:req.params.id, current:"Rejected"}}).exec(function(err,developers){
            if (err) {
              console.log(err);
            } else { 
          res.render("applicantsStats", {
            developers: developers,
            jobId: req.params.id,
            title: "Rejected Applicants",
          });
        }
        })
        }
        if (req.params.string === "Pending")
        {
          console.log("hii");
          Developer.find({"Status":{_id:req.params.id, current:"Pending"}}).exec(function(err,developers){
            if (err) {
              console.log(err);
            } else { 
              console.log(developers)
          res.render("applicantsStats", {
            developers: developers,
            jobId: req.params.id,
            title: "Pending Applications",
          });
        }
        })
        }
});

router.post("/edit_postedjobs/:id",isCompany, function (req, res) {
  const id = req.params.id;

  const job = {
    jobTitle: req.body.jobTitle,
    jobType: req.body.jobType,
    min_exp: req.body.min_exp,
    min_salary: req.body.min_salary,
    max_salary: req.body.max_salary,
    jobDescription: req.body.jobDescription,
    LastDate: req.body.LastDate,
    jobSkills: req.body.jobSkills,
    jobQualification: req.body.jobQualification,
    jobLocation: req.body.jobLocation,
    jobCity: req.body.jobCity,
    jobState: req.body.jobState,
    jobCountry: req.body.jobCountry,
  };

  let errors = [];

  //Validations for registration form
  if (
    !job.jobTitle ||
    !job.jobType ||
    !job.min_exp ||
    !job.min_salary ||
    !job.max_salary ||
    !job.jobDescription ||
    !job.jobSkills ||
    !job.jobQualification ||
    !job.jobLocation ||
    !job.jobCity ||
    !job.jobState ||
    !job.jobCountry ||
    !job.LastDate
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("edit_postedJobs", {
      job: job,
      id: id,
    });
  } else {
    Job.findOneAndUpdate({ _id: id }, { $set: job }, function (err) {
      if (err) console.log(err);
      else {
        console.log(job);
        req.flash("success_msg", "job updated");
        res.redirect("/company/postedjobs");
      }
    });
  }
});

router.get("/delete_postedJob/:id",isCompany, function (req, res) {
  Job.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Error while deleting");
      console.log(err);
    } else {
      Company.findOneAndUpdate(
        { "creator": req.user.id },
        { $pull: { postedJobs: req.params.id } },
        { new: true },
        function (err, company) {
          if (err) console.log(err);
          else
     { req.flash("success_msg", "Job deleted!");
      res.redirect("/company/postedJobs");}
    });
  }
  });
});

router.get("/companyDetails/:id", function (req, res) {
  var loggedIn = req.isAuthenticated() ? true : false;
  Company.findById(req.params.id).exec(function (err, company) {
    if (err) {
      console.log(err);
    } else {Job.find({ postedBy: company._id }).exec(function (err, jobs) {
      if (err) {
        console.log(err);
      } else {

        Post.find({ postedBy: company._id }).exec(function (err, posts) {
          if (err) {
            console.log(err);
          } else {
            console.log(company);
        res.render("companyDetails", {
        company: company,
        jobs:jobs,
        posts:posts,
        loggedIn:loggedIn
      });
    }
  });
  }
});
  }
})
});



//to search jobs by location
router.get("/SearchByLocation", (req, res) => {
  const searchFields = req.query.byLocation;
  //if one of the field matches
  Company.find({
    $or: [
      { companyCity: { $regex: searchFields, $options: "$i" } },
      { companyLocation: { $regex: searchFields, $options: "$i" } },
      { companyCountry: { $regex: searchFields, $options: "$i" } },
      { companyState: { $regex: searchFields, $options: "$i" } },
    ],
  }).exec(function (err, companies) {
    if (err) {
      console.log(err);
    } else {
      res.render("allCompanies", {
        companies: companies,
      });
    }
  });
});

router.get("/SearchByName", (req, res) => {
  const searchFields = req.query.byName;
  //if one of the field matches
  Company.find({
    $or: [
      { companyName: { $regex: searchFields, $options: "$i" } },
      { companyHeadName: { $regex: searchFields, $options: "$i" } },
    ],
  }).exec(function (err, companies) {
    if (err) {
      console.log(err);
    } else if (!companies) console.log("No company found");
    else {
      res.render("allCompanies", {
        companies: companies,
      });
    }
  });
});

//////////////////////not of any use right now
router.get("/updates",function(req,res){
  res.render("updates", {
    user: req.user,
  });
});
/////////////////



//to post updates or info regarding company
router.post("/postUpdate", upload.single("file"), (req, res) => {
  Company.findOne({'creator':req.user._id},(err,company)=>{
    
    if(err)
    console.log(err);

    else
    {
      const post=new Post({
        title:req.body.title,
        description:req.body.updates,
        image:req.file.filename,
        postedBy:company._id
      });
      post.save().then((user) => {
        req.flash("success_msg", "Posted successfully ");
        console.log("Successfully posted");
        res.redirect("/companyProfile");
      });
      Company.findOneAndUpdate(
        { _id: company._id },
        { $push: { postedUpdates: post._id } },
        { new: true },
        function (err, company) {
          if (err) console.log(err);
          else {
            console.log(company._id);
          }
        }
      );

    }
  });
});


//to delete post
router.get("/delete_postedUpdate/:id", function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Error while deleting");
      console.log(err);
    } else {
      // console.log('deleted');
      Company.findOneAndUpdate(
        { "creator": req.user.id },
        { $pull: { postedUpdates: req.params.id } },
        { new: true },
        function (err, company) {
          if (err) console.log(err);
          else {
      req.flash("success_msg", "Post deleted!");
      res.redirect("/companyProfile");
    }
  });
  }
});
});



module.exports = router;
