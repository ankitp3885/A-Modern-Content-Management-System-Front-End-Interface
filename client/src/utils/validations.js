export  const isNotEmpty = (str) => Boolean(str && str.trim().length);

export const isValidMobile = (mobile) => {
	const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
	return mobileRegex.test(mobile);
}

export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
