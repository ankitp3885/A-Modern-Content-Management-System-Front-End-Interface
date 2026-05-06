const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/send-email-otp", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Password and confirm password are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        password: hashedPassword,
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
      });
    } else {
      user.password = hashedPassword;
      user.emailOtp = otp;
      user.emailOtpExpiry = otpExpiry;
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {

    console.log("EMAIL ERROR:", error);

    res.status(500).json({
      message: "Error sending email OTP",
    });
  }
});

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        userId: user._id,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Login failed",
    });

  }
});

router.post("/signup", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.emailOtp !== otp || user.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    res.json({
      message: "Signup successful",
      user: {
        email: user.email,
        userId: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  try {
    const user = await User.findOne({ email });
    if (!user || user.emailOtp !== otp || user.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired email OTP" });
    }

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.emailOtp !== otp || user.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      message: "Password reset failed",
    });

  }
});

module.exports = router;