//Developer Schema
const User = require('./User');
const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    gender:
    {
        type:String,
        required:true
    },
    dob:
    {
        type:String,
        required:true
    }
    ,
    description:
    {
        type:String,
        required:true
    },
    userDetails:
    {
        type: mongoose.Schema.Types.ObjectId,
         ref:'User'
    },
    contactNo:{
        type:Number,
        required:true
    },
    developerLocation:{
        type:String,
        required:true
    },
    developerCity:{
       type:String,
       required:true
   },
   developerState:{
       type:String,
       required:true
   },
   developerCountry:{
       type:String,
       required:true
   },
    date: {
        type: Date,
        default: Date.now
    },
    Qualification:
    {
      type:String,
      required:true
    },
    linkedIn:{
        type:String,
        required:true
    }
    ,
    AppliedJobs:[     ///stores all those applied jobs 
        {
         type: mongoose.Schema.Types.ObjectId,
         ref:'Jobs'
        }
    ]
    //profileImg:String,
   
});

const Developer = mongoose.model('Developer', DeveloperSchema);

module.exports = Developer;
