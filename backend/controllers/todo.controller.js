import Todo from "../models/todo.model.js";

export const getTodos = async (req, res) => {
	try {
		const { page = 1, search = "" } = req.query;
		const limit = 4;
		const skip = (page - 1) * limit;

		const query = {
			user: req.user._id,
			text: { $regex: search, $options: "i" },
		};

		const todos = await Todo.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

		const total = await Todo.countDocuments(query);

		res.json({
			todos,
			total,
			page: Number(page),
			pages: Math.ceil(total / limit),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const addTodo = async (req, res) => {
	try {
		const { text } = req.body;
		if (!text) return res.status(400).json({ message: "Text is required" });

		const todo = new Todo({ user: req.user._id, text });
		const newTodo = await todo.save();

		res.status(201).json(newTodo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateTodo = async (req, res) => {
	try {
		const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
		if (!todo) return res.status(404).json({ message: "Todo not found" });

		if (req.body.text !== undefined) todo.text = req.body.text;
		if (req.body.completed !== undefined) todo.completed = req.body.completed;

		const updatedTodo = await todo.save();
		res.json(updatedTodo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteTodo = async (req, res) => {
	try {
		const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
		if (!todo) return res.status(404).json({ message: "Todo not found" });

		res.json({ message: "Todo deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
