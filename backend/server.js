import express from "express";

const app = express();
const port = 5000;

app.get("/", (request, response) => {
	response.send("Server ready");
});
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
