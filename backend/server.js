import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();
const app = express();
const port = 5000;

app.use(express.json());

app.use("/api/todos/", todoRoutes);
app.listen(port, () => {
	connectToDB();
	console.log(`Server started at http://localhost:${port}`);
});
