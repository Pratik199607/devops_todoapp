import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";

import { apiLimiter, configureCors } from "./middlewares/security.middleware.js";

dotenv.config();

const app = express();
connectToDB();

app.use(express.json());

const allowedDomains = process.env.CORS_ALLOWED_DOMAINS
	? process.env.CORS_ALLOWED_DOMAINS.split(",")
	: ["http://localhost:3000"];

app.use(configureCors(allowedDomains));
app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
