import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../components/ThemeProvider";
import { validateUsername, validatePassword } from "../utils/validation";
import { LuEye, LuEyeOff, LuArrowLeft, LuCircleAlert, LuListTodo } from "react-icons/lu";
import { toast, Bounce } from "react-toastify";

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const { theme } = useTheme();

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [mounted, setMounted] = useState(false);

	const { login, clearError } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		setMounted(true);
		return () => clearError();
	}, [clearError]);

	const validateForm = () => {
		const newErrors = {};

		const usernameError = validateUsername(formData.username);
		if (usernameError) newErrors.username = usernameError;

		const passwordError = validatePassword(formData.password);
		if (passwordError) newErrors.password = passwordError;

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			clearError();
			toast.error(`Please fix the form errors `, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: theme == "system" ? "light" : theme,
				transition: Bounce,
			});
			return;
		}

		setLoading(true);
		clearError();

		try {
			const result = await login(formData);
			if (result.success) {
				toast.success("Login successful! Welcome back.", {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: theme == "system" ? "light" : theme,
					transition: Bounce,
				});
				navigate("/todos");
			} else {
				toast.error(result.error, {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: theme == "system" ? "light" : theme,
					transition: Bounce,
				});
			}
		} catch (error) {
			toast.error(`An unexpected error occurred. Please try again. ${error}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: theme == "system" ? "light" : theme,
				transition: Bounce,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Clear specific field error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;

		// Validate field on blur
		let error = "";
		if (name === "username") {
			error = validateUsername(value);
		} else if (name === "password") {
			error = validatePassword(value);
		}

		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
			<div className="absolute top-4 left-4 right-4 flex justify-between items-center">
				<Link
					to="/"
					className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
					aria-label="Back to home"
				>
					<LuArrowLeft className="h-4 w-4" />
					<span className="hidden sm:inline">Back to Home</span>
					<span className="sm:hidden">Back</span>
				</Link>
				<ThemeToggle />
			</div>

			<div className="flex items-center gap-2 mb-6 sm:mb-8">
				<LuListTodo className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
					TaskMaster
				</h1>
			</div>

			<div className="rounded-lg text-card-foreground shadow-sm w-full max-w-md shadow-neomorphic dark:shadow-neomorphic-dark border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
				<div className="p-6">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						Login
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Enter your credentials to access your account
					</p>

					<form onSubmit={handleSubmit} className="space-y-4" noValidate>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
							>
								Username *
							</label>
							<input
								id="username"
								name="username"
								type="text"
								required
								autoComplete="username"
								value={formData.username}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={loading}
								className={`
                  w-full px-3 py-2 border rounded-lg transition-colors
                  ${
										errors.username
											? "border-red-500 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
									}
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:ring-2 focus:outline-none
									shadow-inner-neomorphic dark:shadow-inner-neomorphic
                `}
								placeholder="Enter your username"
								aria-describedby={errors.username ? "username-error" : undefined}
								aria-invalid={!!errors.username}
							/>
							{errors.username && (
								<p
									id="username-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
									role="alert"
								>
									{errors.username}
								</p>
							)}
						</div>

						<div>
							<div className="flex justify-between mb-1">
								<label
									htmlFor="password"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
								>
									Password *
								</label>
								<Link
									to="/forgot-password"
									className="text-sm text-primary hover:underline"
									tabIndex={loading ? -1 : 0}
								>
									Forgot password?
								</Link>
							</div>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									autoComplete="current-password"
									value={formData.password}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={loading}
									className={`
                    w-full px-3 py-2 pr-10 border rounded-lg transition-colors
                    ${
											errors.password
												? "border-red-500 focus:ring-red-500 focus:border-red-500"
												: "border-gray-200 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
										}
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:ring-2 focus:outline-none
										shadow-inner-neomorphic dark:shadow-inner-neomorphic
                  `}
									placeholder="Enter your password"
									aria-describedby={errors.password ? "password-error" : undefined}
									aria-invalid={!!errors.password}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									disabled={loading}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
								</button>
							</div>
							{errors.password && (
								<p
									id="password-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
									role="alert"
								>
									{errors.password}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={loading || Object.keys(errors).some((key) => errors[key])}
							className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Logging in...
								</span>
							) : (
								"Login"
							)}
						</button>
					</form>
				</div>

				<div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
							tabIndex={loading ? -1 : 0}
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
