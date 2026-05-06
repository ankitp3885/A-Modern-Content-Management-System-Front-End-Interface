import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { isNotEmpty, isValidEmail } from "../utils/validations";

export default function Login() {
  const {user, logIn} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if(user) {
    navigate('/view');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!isNotEmpty(email) || !isValidEmail(email)) {
      setError('Please enter a valid email address')
      return;
    }
    if(!isNotEmpty(password)) {
      setError('Please enter password');
      return;
    }
    const success = await logIn(email, password);
    if(success) {
      navigate('/view');
    } else {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="panel login-panel">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="content-form">
        <div className="form-group">
          <label htmlFor="login-email">Email:</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password:</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">
          Login
        </button>
        <p>
          <Link to="/signup">Sign up here</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  )
}
