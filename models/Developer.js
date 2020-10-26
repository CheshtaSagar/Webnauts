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
         ref:'Job'
        }
    ],
    Status: //stores those jobs that have been accepted or rejected
    [{
      current:{
          type:String,
          default:'pending'
      },
      Job:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Job' 
      }
    }
    ],
    developerIcon:{
        type: String,
     },
     resumeUpload:
     {
       type: String
     }, 
     following:[     ///stores all developers that are following 
        {
         type: mongoose.Schema.Types.ObjectId,
         ref:'Company'
        }
    ]
   
     
});

const Developer = mongoose.model('Developer', DeveloperSchema);

module.exports = Developer;
