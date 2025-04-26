import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

// Get Todos
router.get("/", async (request, response) => {
	try {
		const todos = await Todo.find();
		response.json(todos);
	} catch (error) {
		response.status(500).json({ message: error.message });
	}
});

// Add a new Todo
router.post("/", async (request, response) => {
	const todo = new Todo({
		text: request.body.text,
	});
	try {
		const newTodo = await todo.save();
		response.status(201).json(newTodo);
	} catch (error) {
		response.status(400).json({ message: error.message });
	}
});

//Update a Todo
router.patch("/:id", async (request, response) => {
	try {
		const todo = await Todo.findById(request.params.id);
		if (!todo) return response.status(404).json({ message: "Todo not found" });

		if (request.body.text !== undefined) {
			todo.text = request.body.text;
		}
		if (request.body.completed !== undefined) {
			todo.completed = request.body.completed;
		}

		const updatedTodo = await todo.save();
		response.json(updatedTodo);
	} catch (error) {
		response.status(400).json({ message: error.message });
	}
});

// Delete Todo
router.delete("/:id", async (request, response) => {
	try {
		await Todo.findByIdAndDelete(request.params.id);
		response.json({ message: "Todo deleted" });
	} catch (error) {
		response.status(500).json({ message: error.message });
	}
});

export default router;
