import rateLimit from "express-rate-limit";
import cors from "cors";

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 100,
	message: "Too many requests from this IP, please try again later.",
	headers: true,
});

export const configureCors = (allowedDomains) =>
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true); // allow Postman, curl
			if (allowedDomains.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	});
