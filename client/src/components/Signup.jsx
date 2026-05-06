import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { isNotEmpty, isValidEmail } from "../utils/validations";

export default function Signup() {
  const { user, signUp, sendEmailVerification } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if(user) {
    navigate('/view');
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if(!isNotEmpty(email) || !isValidEmail(email)) {
      setError('Please enter a valid email')
      return;
    }
    if(!isNotEmpty(password)) {
      setError('Please enter a password')
      return;
    }
    if(password.length < 6) {
      setError('Password must be at least 6 characters long')
      return;
    }
    if(password !== confirmPassword) {
      setError('Passwords do not match')
      return;
    }
    const success = await sendEmailVerification(email, password, confirmPassword);
    if(success) {
      setStep(2);
      setError('');
    } else {
      setError('Failed to send OTP');
    }
  }

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    if(!isNotEmpty(otp)) {
      setError('Please enter OTP')
      return;
    }
    const result = await signUp(email, otp);
    if(result.success) {
      navigate('/view')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="panel login-panel">
      <h2>Sign Up</h2>
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="content-form">
          <div className="form-group">
            <label htmlFor="signup-email">Email:</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password:</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password:</label>
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Send OTP
          </button>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailOTP} className="content-form">
          <div className="form-group">
            <label htmlFor="signup-otp">OTP:</label>
            <input
              id="signup-otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Verify OTP
          </button>
          <p>
            <button type="button" onClick={() => setStep(1)}>Back</button>
          </p>
        </form>
      )}
    </div>
  )
}
