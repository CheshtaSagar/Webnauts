const mongoose = require('mongoose');
const User = require('./User');
 const CompanySchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Type.ObjectId,
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
     },
     contactNo:{
         type:String
     },
     companyAddress:{
         type: mongoose.Schema.Type.ObjectId,
         ref:'Address'
     }
     ,
     companyIcon:{
        type: mongoose.Schema.Type.ObjectId,
        ref:'Icon'
     }
 });

 const IconSchema = new mongoose.Schema(
    { img: 
        { data: Buffer, contentType: String }
    }
  );

 const addressSchema = new mongoose.Schema({
    location: String,
    city: String,
    state: String,
    country:String
});

const Address=mongoose.model("Address",addressSchema )
const Icon=mongoose.model("Icon",IconSchema);
const Company = mongoose.model("Company", CompanySchema);
module.exports ={Company,Address,Icon};