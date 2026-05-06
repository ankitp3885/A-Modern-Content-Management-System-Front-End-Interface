require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendMail() {

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

try {

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "Test Email",
  text: "Email is working"
});

console.log("✅ Email sent successfully");

} catch (error) {

console.error("❌ Email error:", error);

}

}

sendMail();