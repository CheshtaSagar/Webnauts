const User = require('./Developer');
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({

skills:[String],

education:[
    {
      Degree: String,
      University :String,
      gradYear :String,
      Branch: String,
    },
],

githubLink:
{
    type:String,
    required:true
},
pastExperience:
[
    {
      Institute:String,
      Title:String,
      StartDate:Date,
      EndDate:Date,
      Description:String   
     }
],
resumeUpload :  //for resume less than 16MB
 { data: Buffer, 
  contentType: String
 }


});

const Resume = mongoose.model('Resume', ResumeSchema);
module.exports=Resume;