const mongoose = require('mongoose');
const User = require('./User');
const Job = require('./Job');
 const CompanySchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
         ref:'User'
    } 
    ,
     companyHeadName: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     companyName: {
         type: String,
         required: true
     },
     establishmentDate:{
         type:String,
         required: true
     },
     companyUrl:{
         type:String,
         required:true
     },
     date: {
         type: Date,
         default: Date.now
     },
     companyDescription:
     {
           type:String,
          required:true
     },
     contactNo:{
         type:Number,
         required:true
     },
     companyLocation:{
         type:String,
         required:true
     },
     companyCity:{
        type:String,
        required:true
    },
    companyState:{
        type:String,
        required:true
    },
    companyCountry:{
        type:String,
        required:true
    },
    postedJobs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"

        }       
    ],
    postedUpdates:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
     companyIcon:{
        type: String,
     },
     companyDisplay:{
        type: String,
     },
     subscribers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Developer"
        }       
    ]
 });

 
 //schema for posts made by company
 const PostSchema = new mongoose.Schema({
    postedBy:
    {   
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Company"  
    },
    Date:
    {
        type: Date,
        default:Date.now
    },
    title:
    {
        type:String
    },
    description:
    {
        type:String
    },
    image:
    {
        type:String
    }

 });



const Company = mongoose.model("Company", CompanySchema);
const Post = mongoose.model("Post",PostSchema);
module.exports ={Company,Post};