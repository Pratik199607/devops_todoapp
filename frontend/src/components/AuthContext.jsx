import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { handleApiError, isAuthError } from "../utils/errorHandler";
import { validateEmail, validateUsername, validatePassword } from "../utils/validation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const initializeAuth = () => {
			try {
				if (token) {
					axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

					// Validate token by making a test request
					const storedUser = localStorage.getItem("user");
					if (storedUser) {
						setUser(JSON.parse(storedUser));
					} else {
						// No user info stored, clear auth state
						clearAuth();
					}
				}
			} catch (error) {
				console.error("Auth initialization error:", error);
				setError("Failed to initialize authentication");
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();
	}, [token]);

	const clearAuth = () => {
		setToken(null);
		setUser(null);
		setError(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		delete axios.defaults.headers.common["Authorization"];
	};

	const login = async (credentials) => {
		try {
			setLoading(true);
			setError(null);

			// Validate input
			const usernameError = validateUsername(credentials.username);
			const passwordError = validatePassword(credentials.password);

			if (usernameError || passwordError) {
				return {
					success: false,
					error: usernameError || passwordError,
				};
			}

			const response = await axios.post("/api/auth/login", {
				username: credentials.username.trim(),
				password: credentials.password,
			});

			const { token: newToken, username: userData } = response.data;
			console.log("Response: ", response.data);

			if (!newToken || !userData) {
				throw new Error("Invalid response from server");
			}

			setToken(newToken);
			setUser(userData);
			localStorage.setItem("token", newToken);
			localStorage.setItem("user", JSON.stringify(userData));
			axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

			return { success: true };
		} catch (error) {
			const errorMessage = handleApiError(error, "Login failed");
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData) => {
		try {
			setLoading(true);
			setError(null);

			// Validate input
			const emailError = validateEmail(userData.email);
			const usernameError = validateUsername(userData.username);
			const passwordError = validatePassword(userData.password);

			if (emailError || usernameError || passwordError) {
				return {
					success: false,
					error: emailError || usernameError || passwordError,
				};
			}

			if (userData.password !== userData.confirmPassword) {
				return {
					success: false,
					error: "Passwords do not match",
				};
			}

			const response = await axios.post("/api/auth/register", {
				email: userData.email.trim().toLowerCase(),
				username: userData.username.trim(),
				password: userData.password,
			});

			const { token: newToken, user: newUser } = response.data;

			if (!newToken || !newUser) {
				throw new Error("Invalid response from server");
			}

			setToken(newToken);
			setUser(newUser);
			localStorage.setItem("token", newToken);
			localStorage.setItem("user", JSON.stringify(newUser));
			axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

			return { success: true };
		} catch (error) {
			const errorMessage = handleApiError(error, "Registration failed");
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		try {
			clearAuth();
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const forgotPassword = async (userData) => {
		try {
			setLoading(true);
			setError(null);

			// Validate input
			const usernameError = validateUsername(userData.username);
			const passwordError = validatePassword(userData.newPassword);

			if (usernameError || passwordError) {
				return {
					success: false,
					error: usernameError || passwordError,
				};
			}

			if (userData.newPassword !== userData.confirmPassword) {
				return {
					success: false,
					error: "Passwords do not match",
				};
			}

			await axios.post("/api/auth/forgot-password", {
				username: userData.username.trim(),
				newPassword: userData.newPassword,
			});

			return { success: true };
		} catch (error) {
			const errorMessage = handleApiError(error, "Password reset failed");
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => setError(null);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				error,
				login,
				register,
				logout,
				forgotPassword,
				clearError,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
