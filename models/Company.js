const mongoose = require('mongoose');
const User = require('./User');
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
         type:Date,
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
    }
   /*  companyIcon:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Icon'
     }*/
 });

 /* const IconSchema = new mongoose.Schema(
    { img: 
        { data: Buffer, contentType: String }
    }
  ); */

 

//const Icon=mongoose.model("Icon",IconSchema);
const Company = mongoose.model("Company", CompanySchema);
module.exports =Company;