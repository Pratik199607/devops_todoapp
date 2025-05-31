import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Todos from "./pages/Todos";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ToastContainer } from "react-toastify";

const PrivateRoutes = ({ children }) => {
	const token = localStorage.getItem("token");
	const { loading } = useAuth();
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}
	return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = ({ children }) => {
	const token = localStorage.getItem("token");
	const { loading } = useAuth();
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}
	return token ? <Navigate to="/todos" replace /> : <Outlet />;
};
const App = () => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Router>
					<ToastContainer />
					<Routes>
						<Route path="/" element={<Home />} />
						{/* Protected Routes */}
						<Route element={<PrivateRoutes />}>
							<Route path="/todos" element={<Todos />} />
						</Route>

						{/* Public Route */}
						<Route element={<PublicRoutes />}>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
						</Route>
					</Routes>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;
