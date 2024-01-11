const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
  },

  username: {
    type: String,
  },

  mobileno: {
    type: Number,
  },

  userType: {
    type: String,
  },

  resetToken: {
    type: String,
  },

  resetTokenExpiration: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
