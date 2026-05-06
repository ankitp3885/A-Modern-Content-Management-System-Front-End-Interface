import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { isNotEmpty, isValidEmail } from "../utils/validations";

export default function ForgotPassword() {
  const { sendOTP, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    if(!isNotEmpty(email) || !isValidEmail(email)) {
      setError('Please enter a valid email address')
      return;
    }
    const success = await sendOTP(email);
    if(success) {
      setStep(2);
      setError('');
    } else {
      setError('Failed to send reset OTP');
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if(!isNotEmpty(otp)) {
      setError('Please enter OTP')
      return;
    }
    if(!isNotEmpty(newPassword)) {
      setError('Please enter new password')
      return;
    }
    if(newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return;
    }
    if(newPassword !== confirmNewPassword) {
      setError('Passwords do not match')
      return;
    }
    const success = await resetPassword(email, otp, newPassword);
    if(success) {
      setError('');
      alert('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } else {
      setError('Failed to reset password');
    }
  }

  return (
    <div className="panel login-panel">
      <h2>Forgot Password</h2>
      {step === 1 ? (
        <form onSubmit={handleSendResetOTP} className="content-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email:</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Send Reset OTP
          </button>
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="content-form">
          <div className="form-group">
            <label htmlFor="reset-otp">OTP:</label>
            <input
              id="reset-otp"
              type="text"
              placeholder="Enter reset OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-new-password">Confirm New Password:</label>
            <input
              id="confirm-new-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Reset Password
          </button>
          <p>
            <button type="button" onClick={() => setStep(1)}>Back</button>
          </p>
        </form>
      )}
    </div>
  )
}