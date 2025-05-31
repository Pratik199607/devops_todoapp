// Validation utilities
export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email) return "Email is required";
	if (!emailRegex.test(email)) return "Please enter a valid email address";
	return null;
};

export const validateUsername = (username) => {
	if (!username) return "Username is required";
	if (username.length < 3) return "Username must be at least 3 characters long";
	if (username.length > 20) return "Username must be less than 20 characters";
	if (!/^[a-zA-Z0-9_]+$/.test(username))
		return "Username can only contain letters, numbers, and underscores";
	return null;
};

export const validatePassword = (password) => {
	if (!password) return "Password is required";
	if (password.length < 6) return "Password must be at least 6 characters long";
	if (password.length > 50) return "Password must be less than 50 characters";
	return null;
};

export const validateTodoText = (text) => {
	if (!text || !text.trim()) return "Task text is required";
	if (text.trim().length < 1) return "Task text cannot be empty";
	if (text.length > 500) return "Task text must be less than 500 characters";
	return null;
};

export const validateSearchQuery = (query) => {
	if (query && query.length > 100) return "Search query must be less than 100 characters";
	return null;
};
