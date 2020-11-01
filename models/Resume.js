const User = require("./Developer");
const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  //information of developer whose resume is this
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
  },
  skills: [
    {
      type: String,
    },
  ],

  education: {
    Degree: [
      {
        type: String,
      },
    ],
    University: [
      {
        type: String,
      },
    ],
    gradYear: [
      {
        type: String,
      },
    ],
    Branch: [
      {
        type: String,
      },
    ],
  },

  githubLink: {
    type: String,
    required: true,
  },
  pastExperience: {
    Institute: [
      {
        type: String,
      },
    ],
    Title: [
      {
        type: String,
      },
    ],
    StartDate: [
      {
        type: String,
      },
    ],
    EndDate: [
      {
        type: String,
      },
    ],
    Description: [
      {
        type: String,
      },
    ],
  },
});

const Resume = mongoose.model("Resume", ResumeSchema);
module.exports = Resume;
