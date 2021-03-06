const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { check, validationResult } = require('express-validator');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const async = require('async');
const User = require("../models/User");
const {Company,Post} = require("../models/Company");
const Developer = require("../models/Developer");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const crypto = require("crypto"); //to generate file names
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { storage, upload } = require("../config/grid");
var auth = require('../config/auth');
var isDeveloper = auth.isDeveloper;
var isCompany = auth.isCompany;
var isUser = auth.isUser;


Grid.mongo = mongoose.mongo;

//rendering home page
router.get("/", (req, res) => {
  res.render("index");
});

//login
router.get("/login", function (req, res) {
  res.render("login");
});

//register
router.get("/register", function (req, res) {
  res.render("register");
});

//forget password route
router.get('/forgetPassword',function(req,res){
  res.render('forgetPassword',{
    user:req.user
  });
});

//Update password route
router.get('/updatePassword',function(req,res){
  res.render('updatePassword',{
    user:req.user
  });
});


//Register post Handling
router.post("/register", (req, res) => {
  const { email, userType, password, password2 } = req.body;
  let errors = [];
//validation for email
  function isLowerCase(str) {
    return str === str.toLowerCase();
}


  //Validations for registration form
  if (!email || !userType || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if(!isLowerCase(email))
  {
    errors.push({ msg: "Email cannot be in upper case" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 5) {
    errors.push({ msg: "Password must be at least 5 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors, //    if entries are not according to validation render filled fields
      email,
      userType,
      password,
      password2,
    });
  } else {
    //if Validations passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("Email is already Exists");
        res.render("register", {
          errors,
          email,
          userType, //if email already exists render the fields
          password,
          password2,
        });
      } else {
        const newUser = new User({
          email,
          userType, ///if all validation passed store a new User indb
          password,
        });

        //to save password in hash format(pass the plain password and hash will be the encyrpted password)
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save the developer
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "Registered Successfully and can log in "
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//login handling
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});



//for forget password token generation and sending mail on the required email id
router.post('/forgetPassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {      //will generate random string which will act as a token
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email:req.body.email}, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgetPassword');
        }

        user.resetToken = token;
        user.tokenExpires = Date.now() + 7200000; // valid for 2 hours

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
    
      async function main() {
      
        let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "infinityjobs3@gmail.com", 
            pass: "*****", // clear this field 
          },
        });
      

       
        // send mail with defined transport object
          let info =await transporter.sendMail({
          from:'"Infinity Jobs"<infinityjobs3@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Password Reset" , // Subject line
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        });
      
      
        if(info.messageId)
        {
        console.log('Mail sent');
        req.flash('success_msg', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
        res.redirect('/forgetPassword');
        }
      console.log("Message sent: %s", info.messageId);
      }
      
      main().catch(console.error);
     
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgetPassword');
  });
});



//once the user clicks on the link given in email,he will be redirected here
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetToken: req.params.token, tokenExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      res.redirect('/forgetPassword');
    }
    res.render('resetPassword',{  'user': req.user });
     
      //redirecting user to setting new password page
  });
  });



//to set new password 
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetToken: req.params.token, tokenExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');//to check token is valid or not
          return res.redirect('back');
        }

        const {password,password2}=req.body;

        user.resetToken = undefined;  //once token has been used,initialize it to undefined again
        user.tokenExpires = undefined;

        if (!password || !password2) {
          errors.push({ msg: "Please enter all fields" });
        }
      
        if (password != password2) {
          errors.push({ msg: "Passwords do not match" });
        }
      
        if (password.length < 5) {
          errors.push({ msg: "Password must be at least 5 characters" });
        }
      

        bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          //set password to hash
          user.password = hash;
      
          user
            .save()
            .then((user) => {
              console.log('password updated');
              res.redirect("/login");
            })
        })
        );
      });
    }
    ], function(err) {
    res.redirect('/');
  }
  
  );
});


router.post('/updatePassword',isUser, function(req, res) {
  const { oldPassword, password, password2 } = req.body;
  let errors = [];

  if ( !oldPassword || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 5) {
    errors.push({ msg: "Password must be at least 5 characters" });
  }


  if (errors.length > 0) {
    console.log(errors.length);
    res.render("updatePassword", {
      user:req.user,
      errors:errors //    if entries are not according to validation render filled fields
      
    });
  }



  User.findOne({_id: req.user._id},function(err, user) {

    // Match password
    bcrypt.compare(oldPassword, user.password, (err, isMatch) => { 
      if (err) throw err;

      else if (!isMatch) {
        console.log("Don't match");
        errors.push("Old password is wrong");
        console.log(errors);
        res.render('updatePassword',{user :req.user,
        errors:errors});
      }
      else {
        console.log("match");
          //if Validations passed
    bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      else{
        User.findOneAndUpdate({ _id: req.user._id}, { $set: {password:hash} }, function (err,user) {
          if (err) console.log(err);
          else {
            console.log(user);
            req.flash("success_msg", "Passsword updated successfully");
            if(req.user.userType=="developer")
            res.redirect("/developer");
            else{
              res.redirect("/companyProfile");
            }
          }
        });
      }
    })
    );
      
      }
    });
  });
  });





//developer profile
router.get("/profile", (req, res) => {
  if (req.user.userType === "developer") {
    res.redirect("/developer");
  } else {
    res.redirect("/companyProfile");
  }
});

//to redirect user to developer main profile
router.get("/developer", isDeveloper, function (req, res) {
  Developer.findOne({ userDetails: req.user._id }, function (err, docs) {
    if (err) {
      console.log(err);
    }
    if (!docs)
      //if user logs in for the first time,redirect him to edit profile section
      res.redirect("developerProfile");
    else {
      //condition to give resume button if it exists
      var exist;
      
      Resume.findOne({ creator: docs._id }, function (err, resume) {
        if (err) {
          console.log(err);
        } else if (!resume) {
          exist = 0;
          res.render("developer", {
            title: "developer",
            user: req.user,
            developer: docs,
            exist: exist,
          });
        } else {
          exist = 1;
          res.render("developer", {
            title: "developer",
            user: req.user,
            developer: docs,
            exist: exist,
          });
        }
      });
    }
  });
});

//for portfolio page
router.get("/developerPortfolio", function (req, res) {
  res.render("developerPortfolio");
});

// redirect to developer edit Profile page
router.get("/developerProfile",isDeveloper, function (req, res) {
  var count;
  Developer.findOne({ userDetails: req.user._id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else if (!docs) {
      count = 0;
      res.render("developerProfile", {
        user: req.user,
        count: count,
      });
    } else {
      count = 1;
      res.render("developerProfile", {
        user: req.user,
        count: count,
        developer: docs,
      });
    }
  });
});

//company main profile
router.get("/companyProfile",isCompany, (req, res) => {
  Company.findOne({ creator: req.user._id }).populate({path: 'postedUpdates', options: { sort:{Date:-1}}}).exec(function (err, docs) {
    if (err) {
      console.log(err);
    }
    if (!docs)
      //if user logs in for the first time,redirect him to edit profile section
      res.redirect("company");
    else
      res.render("companyProfile", {
        user: req.user,
        company: docs,
        posts:docs.postedUpdates
      });
  });
});

//company edit profile page
router.get("/company",isCompany, (req, res) => {
  var count;

  Company.findOne({ creator: req.user._id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else if (!docs) {
      count = 0;
      res.render("company", {
        user: req.user,
        count: count,
      });
    } else {
      count = 1;
      res.render("company", {
        user: req.user,
        count: count,
        company: docs,
      });
    }
  });
});

//post request for edit company profile
router.post(
  "/company",isCompany,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "display", maxCount: 1 },
  ]),
  (req, res) => {
    

    let errors=[];

    //console.log(req.user._id);//for debugging
    //console.log(req.body);   //for debugging
    const id = req.user._id;
    const company = {
      email: req.user.email,
      companyLocation: req.body.location,
      companyCity: req.body.city,
      companyState: req.body.state,
      companyCountry: req.body.country,
      companyName: req.body.companyName,
      companyHeadName: req.body.companyHeadName,
      establishmentDate: req.body.establishmentDate,
      companyUrl: req.body.companyUrl,
      companyDescription: req.body.companyDescription,
      contactNo: req.body.contactNo,
      companyIcon: req.files["logo"][0].filename,
      companyDisplay: req.files["display"][0].filename,
    };


 if(!company.companyCity||!company.companyLocation||!company.companyCountry||!company.companyName||!company.companyHeadName||!company.companyUrl
  ||!company.establishmentDate||!company.companyState||!company.contactNo||!company.companyDisplay)
  {
    errors.push({ msg: "Please enter all fields" });
     }

  if (errors.length > 0) {
    res.render("company", {
      company: company,
      id: req.user.id,
      count:0,
      errors:errors
    });
  }
else{

    Company.findOneAndUpdate(
      { creator: req.user._id },
      { $set: company },
      function (err, docs) {
        if (err) {
          throw err;
        }
        if (docs) {
          //console.log(company);
          console.log("updated");
          //console.log(company);
          req.flash("success_msg", "Profile Updated");
          res.redirect("companyProfile");
        } else {
          var company = new Company({
            creator: req.user._id,
            email: req.user.email,
            companyLocation: req.body.location,
            companyCity: req.body.city,
            companyState: req.body.state,
            companyCountry: req.body.country,
            companyName: req.body.companyName,
            companyHeadName: req.body.companyHeadName,
            establishmentDate: req.body.establishmentDate,
            companyUrl: req.body.companyUrl,
            companyDescription: req.body.companyDescription,
            contactNo: req.body.contactNo,
            companyIcon: req.files["logo"][0].filename,
            companyDisplay: req.files["display"][0].filename,
          });

          //validations to be added here

          //saving content on database
          company
            .save()
            .then((user) => {
              req.flash("success_msg", "profile posted ");
              res.redirect("/companyProfile"); //do anything here(TO BE DECIDED)
            })
            .catch((err) => console.log(err));
        }
      }
    );
  }
}
);

//post request for edit developer profile
router.post("/developerProfile",isDeveloper,upload.single("file"), (req, res) => {
  console.log(req.user._id); //for debugging
  console.log(req.body); //for debugging


  var developer = {
    email: req.user.email,
    developerLocation: req.body.developerLocation,
    developerCity: req.body.developerCity,
    developerState: req.body.developerState,
    developerCountry: req.body.developerCountry,
    name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    linkedIn: req.body.linkedIn,
    description: req.body.description,
    contactNo: req.body.contactNo,
    Qualification: req.body.Qualification,
    developerIcon: req.file.filename,
  };
  Developer.findOneAndUpdate(
    { userDetails: req.user._id },
    { $set: developer },
    function (err, docs) {
      if (err) {
        throw err;
      }
      if (docs) {
        //console.log(company);
        console.log("updated");
        //console.log(company);
        req.flash("success_msg", "Profile Updated");
        res.redirect("developer");
      } else {
        var developer = new Developer({
          userDetails: req.user._id,
          email: req.user.email,
          developerLocation: req.body.developerLocation,
          developerCity: req.body.developerCity,
          developerState: req.body.developerState,
          developerCountry: req.body.developerCountry,
          name: req.body.name,
          gender: req.body.gender,
          dob: req.body.dob,
          linkedIn: req.body.linkedIn,
          description: req.body.description,
          contactNo: req.body.contactNo,
          Qualification: req.body.Qualification,
          developerIcon: req.file.filename,
        });

        //validations to be added here

        //saving content on database
        developer
          .save()
          .then((user) => {
            req.flash("success_msg", "profile posted and updated");
            res.redirect("/developer"); //do anything here(TO BE DECIDED)
          })
          .catch((err) => console.log(err));
      }
    }
  );
  
});

//rendering postJob page
router.get("/postJob", isCompany,(req, res) => {
  res.render("postJob", {
    user: req.user,
  });
});




//for posting job
router.post("/postJob",isCompany,(req, res) => {
  console.log(req.user._id); //user id(not the company id)

  //to get company id by comparing creator and userId
  Company.findOne({ creator: req.user._id }).populate('subscribers').exec(function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log(docs); //company details get printed
      const job = new Job({
        jobTitle: req.body.jobTitle,
        jobType: req.body.jobType,
        min_exp: req.body.min_exp,
        min_salary: req.body.min_salary,
        max_salary: req.body.max_salary,
        LastDate: req.body.LastDate,
        jobDescription: req.body.jobDescription,
        jobSkills: req.body.jobSkills,
        jobQualification: req.body.jobQualification,
        jobLocation: req.body.jobLocation,
        jobCity: req.body.jobCity,
        jobState: req.body.jobState,
        jobCountry: req.body.jobCountry,
        postedBy: docs._id, //storing id of current company in this field
      });
      
      job.save().then((user) => {
        req.flash("success_msg", "job posted ");
        res.redirect("/company/postedJobs"); //include msg.ejs wherever you want to see this msg
        console.log("job successfully posted");

        Company.findOneAndUpdate(
          { _id: docs._id },
          { $push: { postedJobs: job._id } },
          { new: true },
          function (err, company) {
            if (err) console.log(err);
            else {
              console.log(company);
            }
          }
        );

        });
        ///////////////////SENDING MAIL TO ALL SUBSCRIBERS
         docs.subscribers.forEach(function(subscriber)
            {
           async function main() {
      
          let testAccount = await nodemailer.createTestAccount();
        
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "infinityjobs3@gmail.com", 
              pass: "webnauts", // clear this field 
            },
          });
        

         
          // send mail with defined transport object
            let info =await transporter.sendMail({
            from:'"Infinity Jobs"<infinityjobs3@gmail.com>', // sender address
            to: subscriber.email, // list of receivers
            subject: "New job posted on"+ docs.companyName , // Subject line
            text:'Hello '+subscriber.name+'\n'+'Hope you are doing well!!!A new job of '+job.jobTitle +' has been posted by '+docs.companyName +'.Kindly visit www.infinityJobs.com for more details.\n\n'+'Regards InfinityJobs'
          });
        
        
          if(info.messageId)
          console.log('Mail sent');
        
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
        
        main().catch(console.error);
        //////////////////////////
      });
    }
  
});
});








//to post developer portfolio
router.post("/developerPortfolio", isDeveloper,async (req, res) => {
  console.log(req.user._id); //user id(not the company id)

  //to get developer id by comparing userDetails and userId
  Developer.findOne({ userDetails: req.user._id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log(docs); //company details get printed
      const resume = new Resume();

      resume.creator = docs.id; //developer id
      resume.githubLink = req.body.githubLink;
      console.log(resume.skills);
      console.log(req.body.skills);

      resume.skills.push(
        req.body.skills[0],
        req.body.skills[1],
        req.body.skills[2],
        req.body.skills[3]
      );
      console.log(resume.skills);

      console.log(resume.education.Degree);
      console.log(req.body.Degree);

      for (var i = 0; i < req.body.Degree.length; i++) {
        resume.education.Degree.push(req.body.Degree[i]);
        resume.education.University.push(req.body.University[i]);
        resume.education.gradYear.push(req.body.gradYear[i]);
        resume.education.Branch.push(req.body.Branch[i]);
      }

      for (var i = 0; i < req.body.Title.length; i++) {
        resume.pastExperience.Title.push(req.body.Title[i]);
        resume.pastExperience.StartDate.push(req.body.StartDate[i]);
        resume.pastExperience.EndDate.push(req.body.EndDate[i]);
        resume.pastExperience.Institute.push(req.body.Institute[i]);
        resume.pastExperience.Description.push(req.body.Description[i]);
      }

      console.log(resume.pastExperience.Title);
      resume
        .save()
        .then((user) => {
          req.flash("success_msg", "resume posted ");
          res.redirect("developer/portfolio/"+ docs._id); //include msg.ejs wherever you want to see this msg
          console.log("resume successfully posted");
        })
        .catch((err) => console.log(err));
    }
  });
});

//for rendering all jobs
router.get("/allJobs", function (req, res) {
  const loggedIn = req.isAuthenticated() ? true : false;
  Job.find({})
    .populate("postedBy").sort({postedOn:-1}).exec(function (err, jobs) {
      if (err) {
        console.log(err);
      } else {
        //console.log("hii");
        //console.log(jobs);
        //console.log(companies);
        res.render("allJobs", {
          jobs: jobs,
          loggedIn: loggedIn
        });
      }
    });
});

router.get("/allCompanies", function (req, res) {
  const loggedIn = req.isAuthenticated() ? true : false;
  Company.find({})
    .populate("postedJobs").populate("postedUpdates")
    .exec(function (err, companies) {
      if (err) {
        console.log(err);
      } else {
        res.render("allCompanies", {
          companies: companies,
          loggedIn: loggedIn,
        });
      }
    });
});

router.get("/allDevelopers", function (req, res) {
  Developer.find({}).exec(function (err, developers) {
    if (err) {
      console.log(err);
    } else {
      res.render("allDevelopers", {
        developers: developers,
      });
    }
  });
});

// Logout handling
router.get("/logout", (req, res) => {
  req.logout(); //passport middleware function
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
