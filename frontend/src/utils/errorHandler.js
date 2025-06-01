// Error handling utilities
export const getErrorMessage = (error) => {
	if (error.response) {
		// Server responded with error status
		const { status, data } = error.response;

		switch (status) {
			case 400:
				return data?.message || "Invalid request. Please check your input.";
			case 401:
				return data?.message || "Authentication failed. Please login again.";
			case 403:
				return data?.message || "You do not have permission to perform this action.";
			case 404:
				return data?.message || "The requested resource was not found.";
			case 409:
				return data?.message || "This resource already exists.";
			case 422:
				return data?.message || "Validation failed. Please check your input.";
			case 429:
				return data?.message || "Too many requests. Please try again later.";
			case 500:
				return data?.message || "Server error. Please try again later.";
			case 503:
				return data?.message || "Service temporarily unavailable. Please try again later.";
			default:
				return data?.message || `An error occurred (${status}). Please try again.`;
		}
	} else if (error.request) {
		// Network error
		return error?.message || "Network error. Please check your internet connection and try again.";
	} else {
		// Other error
		return error.message || "An unexpected error occurred. Please try again.";
	}
};

export const handleApiError = (error, fallbackMessage = "An error occurred") => {
	console.error("API Error:", error);
	return getErrorMessage(error) || fallbackMessage;
};

export const isNetworkError = (error) => {
	return !error.response && error.request;
};

export const isServerError = (error) => {
	return error.response && error.response.status >= 500;
};
