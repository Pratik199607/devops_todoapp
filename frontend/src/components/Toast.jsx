// Toast.js
import { toast, Bounce } from "react-toastify";

const defaultOptions = (theme) => ({
	position: "bottom-right",
	autoClose: 5000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: theme === "system" ? "light" : theme,
	transition: Bounce,
});

const Toast = {
	success: (message, theme) => {
		toast.success(message, defaultOptions(theme));
	},

	error: (message, theme) => {
		toast.error(message, defaultOptions(theme));
	},

	info: (message, theme) => {
		toast.info(message, defaultOptions(theme));
	},

	warn: (message, theme) => {
		toast.warn(message, defaultOptions(theme));
	},
};

export default Toast;
