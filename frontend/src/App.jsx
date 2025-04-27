// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
// import {}

function App() {
	const [newTodo, setNewTodo] = useState("");
	const [todos, setTodos] = useState([]);
	const [editingTodo, setEditingTodo] = useState(null);
	const [editedText, setEditedText] = useState("");

	//Add Todos
	const addTodo = async (event) => {
		event.preventDefault();
		if (!newTodo.trim()) return;
		try {
			const response = await axios.post("/api/todos", { text: newTodo });
			setTodos([...todos, response.data]);
			setNewTodo("");
		} catch (error) {
			console.log("Error adding todos");
			console.log("Error:", error.message);
		}
	};

	//Fetch Todos
	const fetchTodos = async () => {
		try {
			const response = await axios.get("/api/todos");
			setTodos(response.data);
			console.log(response.data);
		} catch (error) {
			console.log("Error fetching todos: ", error);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	//Editing Todo
	const startEditing = (todo) => {
		setEditingTodo(todo._id);
		setEditedText(todo.text);
	};

	//Save Edited Todo
	const saveEdit = async (id) => {
		try {
			const response = await axios.patch(`/api/todos/${id}`, {
				text: editedText,
			});
			setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
			setEditingTodo(null);
		} catch (error) {
			console.log("Error updating todo: ", error);
		}
	};

	//Delete a Todo
	const deleteTodo = async (id) => {
		try {
			await axios.delete(`/api/todos/${id}`);
			setTodos(todos.filter((todo) => todo._id !== id));
		} catch (error) {
			console.log("Error Deleting todo: ", error);
		}
	};

	//Toggle Todo Status
	const toggleTodo = async (id) => {
		try {
			const todo = todos.find((t) => t._id === id);
			const response = await axios.patch(`/api/todos/${id}`, {
				completed: !todo.completed,
			});
			setTodos(todos.map((t) => (t._id === id ? response.data : t)));
		} catch (error) {
			console.log("Error toggling todo: ", error);
		}
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Task Manager</h1>
				<form
					onSubmit={addTodo}
					className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg"
				>
					<input
						type="text"
						className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
						placeholder="What needs to be done?"
						required
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
					>
						Add Task
					</button>
				</form>

				{/* Display Todos */}

				<div className="mt-4">
					{todos.length === 0 ? (
						<div></div>
					) : (
						<div className="flex flex-col gap-4">
							{todos.map((todo) => (
								<div key={todo._id}>
									{editingTodo === todo._id ? (
										<div className="flex items-center gap-x-3">
											<input
												className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-violet-500 text-gray-700 shadow-inner"
												type="text"
												value={editedText}
												onChange={(event) => setEditedText(event.target.value)}
											/>
											<div className="flex gap-x-2">
												<button
													onClick={() => saveEdit(todo._id)}
													className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
												>
													<MdOutlineDone />
												</button>
												<button
													className="px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-400 cursor-pointer"
													onClick={() => setEditingTodo(null)}
												>
													<IoClose />
												</button>
											</div>
										</div>
									) : (
										<div>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-x-4 overflow-hidden">
													<button
														onClick={() => toggleTodo(todo._id)}
														className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
															todo.completed
																? "bg-green-500 border-green-500"
																: "border-gray-300 hover:border-blue-400"
														}`}
													>
														{todo.completed && <MdOutlineDone />}
													</button>
													<span
														className={`truncate text-gray-800 font-medium ${
															todo.completed ? "line-through" : ""
														}`}
													>
														{todo.text}
													</span>
												</div>
												<div className="flex gap-x-2">
													<button
														className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
														onClick={() => startEditing(todo)}
													>
														<MdModeEditOutline />
													</button>
													<button
														className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
														onClick={() => deleteTodo(todo._id)}
													>
														<FaTrash />
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
