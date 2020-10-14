const mongoose = require('mongoose');
const {Company,Address}=require('./Company');

//schema for jobs that are being posted by company
const JobSchema = new mongoose.Schema({
    jobTitle:[String],
    jobDescription : [String],
    jobLocation:
    {
        type: mongoose.Schema.Type.ObjectId,
        ref:"Address"
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
        type:Date.now,
        required:true
    },
    postedBy:      //information of company that has posted the job
    {
        type: mongoose.Schema.Type.ObjectId,
        ref:"Company"
    },
    appliedBy: [    //array containing information of developers who have applied
    {
        type:mongoose.Schema.Type.ObjectId,
        ref:"Developer"
    }]
});
const Job = mongoose.model('Job', JobSchema);
module.exports=Job;