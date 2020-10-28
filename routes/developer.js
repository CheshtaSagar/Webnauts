const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Developer = require("../models/Developer");
const Resume = require("../models/Resume");
var auth = require('../config/auth');
var isDeveloper = auth.isDeveloper;
var isCompany = auth.isCompany;

//to let user apply for an opening
router.get("/apply/:id",isDeveloper, function (req, res) {
  Developer.findOne(
    { userDetails: req.user._id, AppliedJobs: req.params.id },
    function (err, developer) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (developer) {
       // console.log("80");
        //console.log(developer);
        req.flash("success_msg", "Already applied for the job");
        res.redirect("/allJobs");
      }
      if (!developer) {
  //finding developer with same logged in user id
  Developer.findOneAndUpdate(
    { userDetails: req.user.id },
    {
      $push: {
        AppliedJobs: req.params.id,
        Status: { _id: req.params.id, current: "Pending" },
      },
    },
    { new: true },
    function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log(docs); //shows reqd developer
        console.log(req.params.id);
        //finding job having same id as current job
        Job.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { appliedBy: docs._id } },
          { new: true },
          function (err, job) {
            if (err) console.log(err);
            else {
              console.log(job);
              console.log("Successfully applied for the job");
              req.flash("success_msg", "Successfully applied for the job");
              res.redirect("/developer/allAppliedJobs"); //CHANGE THIS LATER
            }
          }
        );
      }
    }
  );
  }
}) 
});

///
///////
////////
//to render the page containing info about all the applied jobs
router.get("/allAppliedJobs",isDeveloper, (req, res) => {
  Developer.findOne({ userDetails: req.user._id })
    .populate("AppliedJobs")
    .exec(function (err, developer) {
      if (err) {
        console.log(err);
      } else {
        Job.find({ _id: developer.AppliedJobs })
          .populate("postedBy")
          .exec(function (err, jobs) {
            if (err) console.log(err);
            // res.send('appliedjobs');
            //         console.log(job);
            res.render("allAppliedJobs", {
              title: "All Applied Jobs",
              jobs: jobs, //gives array of job ids for which developer has applied
            });
          });
      }
    });
});

router.get("/subscribe/:id",isDeveloper, function (req, res) {
  Developer.findOne(
    { userDetails: req.user._id, following: req.params.id },
    function (err, developer) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (developer) {
        console.log("80");
        //console.log(developer);
        req.flash("success_msg", "Already Subscribed for the Company");
        res.redirect("/allCompanies");
      }
      if (!developer) {
        //finding developer with same logged in user id
        Developer.findOneAndUpdate(
          { userDetails: req.user.id },
          { $push: { following: req.params.id } },
          { new: true },
          function (err, docs) {
            if (err) {
              console.log(err);
              throw err;
            } else {
              //console.log(docs);//shows reqd developer
              //console.log(req.params.id);
              Company.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { subscribers: docs._id } },
                { new: true },
                function (err, company) {
                  if (err) console.log(err);
                  else {
                    //console.log(company);
                    console.log("Successfully Subscribed for the Company");
                    req.flash(
                      "success_msg",
                      "Successfully Subscribed for the Company"
                    );
                    res.redirect("/developer/followings"); //CHANGE THIS LATER
                    //res.send('subscribed');
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});


//to render the page containg info about all the applied jobs
router.get("/followings",isDeveloper, (req, res) => {
  Developer.findOne({ userDetails: req.user._id })
    .populate("following")
    .exec(function (err, developer) {
      if (err) {
        console.log(err);
      } else {
        //console.log(developer);
        console.log("followings");
        res.render("followingCompanies", {
          companies: developer.following, //gives array of job ids for which developer has applied
        });
      }
    });
});

router.get("/unsubscribe/:id",isDeveloper, function (req, res) {
  //finding developer with same logged in user id
  Developer.findOneAndUpdate(
    { userDetails: req.user.id },
    { $pull: { following: req.params.id } },
    { new: true },
    function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        //console.log(docs);//shows reqd developer
        //console.log(req.params.id);
        Company.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { subscribers: docs._id } },
          { new: true },
          function (err, company) {
            if (err) console.log(err);
            else {
              //console.log(company);
              console.log("Unsubscribed from the Company");
              req.flash("success_msg", "You Unsubscribed from the Company");
              res.redirect("/developer/followings"); //CHANGE THIS LATER
              //res.send('subscribed');
            }
          }
        );
      }
    }
  );
});

//to let user access resume designed
router.get("/portfolio/:id", (req, res) => {
  Developer.findOne({ _id: req.params.id }, function (err, developer) {
    if (err) {
      console.log(err);
    } else {
      Resume.findOne({ creator: developer._id }, function (err, resume) {
        if (err) {
          console.log(err);
        } else if (!resume) res.send("OOps!!No resume exists");
        else {
          res.render("portfolio", {
            resume: resume,
            developer: developer,
          });
        }
      });
    }
  });
});







//to set status of job application of developer as accepted
router.get("/accept/:devId/:jobId", isCompany,(req, res) => {

  Developer.findOneAndUpdate(
    { _id: req.params.devId, "Status._id": req.params.jobId },
    { $set: { "Status.$.current": "Accepted" } },
    { new: true },
    function (err, developer) {
      if (err) console.log(err);
      else {

      ////////////////////

   async function main() {
  
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "infinityjobs3@gmail.com",
      pass: "***", //clear this field before pushing the code
    },
  });

  // send mail with defined transport object
    let info = await transporter.sendMail({
    from:'"Infinity Jobs"<infinityjobs3@gmail.com>', // sender address
    to: developer.email, // list of receivers
    subject: "Hello "+ developer.name, // Subject line
    html: "Congratulations</br><h6>Your application has been approved and you have been selected!!!You will receive an email from the company in few days.Kindly visit www.infinityJobs.com for more details</h6></br>Regards,InfinityJobs", // html body
  });


  if(info.messageId)
  console.log('Mail sent');


  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

main().catch(console.error);
//////////////////////////


        req.flash("success_msg", developer.name + " has been selected");
        console.log(developer.name + "has been selected");
        //redirect HERE
        res.redirect("/company/postedJobs");
      }
    }
  );
});







router.get("/reject/:devId/:jobId",isCompany, (req, res) => {
  Developer.findOneAndUpdate(
    { _id: req.params.devId, "Status._id": req.params.jobId },
    { $set: { "Status.$.current": "Rejected" } },
    { new: true },
    function (err, developer) {
      if (err) console.log(err);
      else {
        req.flash("success_msg", developer.name + " has been rejected");
        console.log(developer.name + "has been rejected");
        //redirect HERE
        res.redirect("/company/postedJobs");
      }
    }
  );
});


//to  show accepted or rejected jobs
router.get("/allStats/:string", isDeveloper,(req, res) => {
  Developer.findOne({ userDetails: req.user._id })
    .populate("Status._id")
    .exec(function (err, developer) {
      if (err) {
        console.log(err);
      } else {
        console.log(developer.Status);
        if (req.params.string === "Accepted")
          res.render("allStats", {
            Status: developer.Status,
            title: "Accepted Applications",
          });
        if (req.params.string === "Rejected")
          res.render("allStats", {
            Status: developer.Status,
            title: "Rejected Applications",
          });
      }
    });
});
module.exports = router;
