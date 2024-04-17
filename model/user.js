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

  donatorType: {
    type: String,
  },

  myFood: [
    {
      type: String,
      required: true,
    },
  ],

  resetToken: {
    type: String,
  },

  resetTokenExpiration: {
    type: Date,
  },

  businessName: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
