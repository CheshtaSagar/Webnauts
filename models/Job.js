const mongoose = require('mongoose');
const {Company,Address}=require('./Company');

//schema for jobs that are being posted by company
const JobSchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobDescription :{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        required:true
    },
    jobCity:{
       type:String,
       required:true
   },
   jobState:{
       type:String,
       required:true
   },
   jobCountry:{
       type:String,
       required:true
   },
    min_exp:
    {
        type:Number,
        required:true
    },
    min_salary:
    {
        type:Number,
        required:true
    },
    max_salary:
    {
        type:Number,
        required:true
    },
    
    jobType://full time or intern
    {
        type:String,
        required:true
    },  
    jobQualification:
    {
        type:String,
        required:true
    },
    jobSkills:
    {
        type:String,
        required:true
    },//skills required to apply for job
    postedOn:{
        type: Date,
        default: Date.now
    },
    postedBy:      //information of company that has posted the job
    {   
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Company"  
    },
    
    appliedBy: [    //array containing information of developers who have applied
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Developer"
    }]
    ,
  /*  jobCount:
    {
        type:Number,
        default:0
    }*/
});
const Job = mongoose.model('Job', JobSchema);
module.exports=Job;