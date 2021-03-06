//User Schema

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
  },
  tokenExpires: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
