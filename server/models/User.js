const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  otp: String,
  otpExpiry: Date,

  emailOtp: String,
  emailOtpExpiry: Date,

  isVerified: {
    type: Boolean,
    default: false,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);