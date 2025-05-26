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


{ "_id": "6833f93299030f0d63cc5b1d", "email": "user@example.com", "username": "user1", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzNmOTMyOTkwMzBmMGQ2M2NjNWIxZCIsImlhdCI6MTc0ODIzNjU5NCwiZXhwIjoxNzQ4MjQwMTk0fQ.f_lTQM9guBQ05TMyUsfhQ_rmLV4p5b8L-MZJQ-O3XCc" }
	
curl -X DELETE http://localhost:5000/api/todos/6833f9a599030f0d63cc5b20 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzNmOTMyOTkwMzBmMGQ2M2NjNWIxZCIsImlhdCI6MTc0ODIzNjU5NCwiZXhwIjoxNzQ4MjQwMTk0fQ.f_lTQM9guBQ05TMyUsfhQ_rmLV4p5b8L-MZJQ-O3XCc" 


