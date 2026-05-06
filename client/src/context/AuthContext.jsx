import { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AuthProvider({children}) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Clear any existing user data to prevent auto-login
		localStorage.removeItem('user');
		setUser(null);
		// Check if user is logged in (from localStorage or token)
		// For now, always start logged out
	}, []);

	const sendOTP = async (email) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/send-email-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				return true;
			} else {
				console.error('Failed to send OTP:', data.message);
				return false;
			}
		} catch (error) {
			console.error('Error sending OTP:', error);
			return false;
		} finally {
			setLoading(false);
		}
	}

	const sendEmailVerification = async (email, password, confirmPassword) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/send-email-otp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, confirmPassword }),
			});

			const data = await response.json();

			if (response.ok) {
				return true;
			} else {
				console.error('Failed to send email OTP:', data.message);
				return false;
			}
		} catch (error) {
			console.error('Error sending email OTP:', error);
			return false;
		} finally {
			setLoading(false);
		}
	}

	const signUp = async (email, otp) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, otp }),
			});

			const data = await response.json();

			if (response.ok) {
				const userData = { email, userId: data.userId };
				setUser(userData);
				localStorage.setItem('user', JSON.stringify(userData));
				return { success: true, userId: data.userId };
			} else {
				return { success: false, message: data.message };
			}
		} catch (error) {
			console.error('Error in signup:', error);
			return { success: false, message: 'Signup failed' };
		} finally {
			setLoading(false);
		}
	}

	const logIn = async (email, password) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				setUser(data.user);
				localStorage.setItem('user', JSON.stringify(data.user));
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Error in login:', error);
			return false;
		} finally {
			setLoading(false);
		}
	}

	const verifyEmailOTP = async (email, otp) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, otp }),
			});

			const data = await response.json();

			if (response.ok) {
				// Update user verification status
				const updatedUser = { ...user, emailVerified: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));
				return { success: true };
			} else {
				return { success: false };
			}
		} catch (error) {
			console.error('Error verifying email:', error);
			return { success: false };
		} finally {
			setLoading(false);
		}
	}

	const resetPassword = async (email, otp, newPassword) => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, otp, newPassword }),
			});

			const data = await response.json();

			if (response.ok) {
				return true;
			} else {
				console.error('Failed to reset password:', data.message);
				return false;
			}
		} catch (error) {
			console.error('Error resetting password:', error);
			return false;
		} finally {
			setLoading(false);
		}
	}

	const logOut = () => {
		setUser(null);
		localStorage.removeItem('user');
	}

	return (
		<AuthContext.Provider value={{
			user,
			loading,
			logIn,
			signUp,
			logOut,
			sendOTP,
			sendEmailVerification,
			verifyEmailOTP,
			resetPassword,
		}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext);
