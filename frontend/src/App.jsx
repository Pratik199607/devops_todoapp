"use client";

import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone, MdOutlineCheck, MdAdd } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

// Simple Toast Component
function Toast({ message, type, onClose }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	// Different colors for different actions
	const getBgColor = () => {
		switch (type) {
			case "add":
				return "bg-gradient-to-r from-emerald-500 to-teal-500";
			case "update":
				return "bg-gradient-to-r from-amber-500 to-orange-500";
			case "delete":
				return "bg-gradient-to-r from-rose-500 to-pink-500";
			case "error":
				return "bg-gradient-to-r from-red-500 to-rose-600";
			default:
				return "bg-gradient-to-r from-gray-700 to-gray-800";
		}
	};

	return (
		<div
			className={`px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white mb-3 animate-slide-in ${getBgColor()}`}
			style={{ maxWidth: "calc(100vw - 2rem)" }}
		>
			{type === "add" && <MdOutlineCheck className="text-xl flex-shrink-0" />}
			{type === "update" && <MdOutlineDone className="text-xl flex-shrink-0" />}
			{type === "delete" && <FaTrash className="text-xl flex-shrink-0" />}
			{type === "error" && <IoClose className="text-xl flex-shrink-0" />}
			<span className="line-clamp-2 font-medium">{message}</span>
		</div>
	);
}

// Confirmation Dialog Component
function ConfirmDialog({ message, onConfirm, onCancel }) {
	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
			<div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
				<h3 className="text-lg font-medium mb-4 text-gray-800">{message}</h3>
				<div className="flex flex-col sm:flex-row justify-end gap-3">
					<button
						onClick={onCancel}
						className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors order-2 sm:order-1"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg order-1 sm:order-2"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}

function App() {
	const [newTodo, setNewTodo] = useState("");
	const [todos, setTodos] = useState([]);
	const [editingTodo, setEditingTodo] = useState(null);
	const [editedText, setEditedText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [toasts, setToasts] = useState([]);
	const [confirmDialog, setConfirmDialog] = useState(null);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

	// Check for mobile view
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Toast management
	const addToast = (message, type = "success") => {
		const id = Date.now();
		setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
	};

	const removeToast = (id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	};

	// Confirmation dialog management
	const showConfirmation = (message, onConfirm) => {
		setConfirmDialog({
			message,
			onConfirm: () => {
				onConfirm();
				setConfirmDialog(null);
			},
			onCancel: () => setConfirmDialog(null),
		});
	};

	// Add Todos
	const addTodo = async (event) => {
		event.preventDefault();
		if (!newTodo.trim()) return;

		showConfirmation("Add this task?", async () => {
			try {
				const response = await axios.post("/api/todos", { text: newTodo });
				setTodos([...todos, response.data]);
				setNewTodo("");
				addToast("Task added successfully!", "add");
			} catch (error) {
				console.log("Error adding todos:", error.message);
				addToast("Failed to add task", "error");
			}
		});
	};

	// Fetch Todos
	const fetchTodos = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/todos");
			setTodos(response.data);
			setIsLoading(false);
		} catch (error) {
			console.log("Error fetching todos: ", error);
			addToast("Failed to load tasks", "error");
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	// Editing Todo
	const startEditing = (todo) => {
		setEditingTodo(todo._id);
		setEditedText(todo.text);
	};

	// Save Edited Todo
	const saveEdit = async (id) => {
		if (!editedText.trim()) {
			addToast("Task cannot be empty", "error");
			return;
		}

		showConfirmation("Save changes to this task?", async () => {
			try {
				const response = await axios.patch(`/api/todos/${id}`, {
					text: editedText,
				});
				setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
				setEditingTodo(null);
				addToast("Task updated successfully!", "update");
			} catch (error) {
				console.log("Error updating todo: ", error);
				addToast("Failed to update task", "error");
			}
		});
	};

	// Delete a Todo
	const deleteTodo = async (id) => {
		showConfirmation("Are you sure you want to delete this task?", async () => {
			try {
				await axios.delete(`/api/todos/${id}`);
				setTodos(todos.filter((todo) => todo._id !== id));
				addToast("Task deleted successfully!", "delete");
			} catch (error) {
				console.log("Error Deleting todo: ", error);
				addToast("Failed to delete task", "error");
			}
		});
	};

	// Toggle Todo Status
	const toggleTodo = async (id) => {
		const todo = todos.find((t) => t._id === id);

		try {
			const response = await axios.patch(`/api/todos/${id}`, {
				completed: !todo.completed,
			});
			setTodos(todos.map((t) => (t._id === id ? response.data : t)));
			addToast(
				todo.completed ? "Task marked as incomplete" : "Task completed!",
				todo.completed ? "update" : "add"
			);
		} catch (error) {
			console.log("Error toggling todo: ", error);
			addToast("Failed to update task status", "error");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50 flex items-center justify-center p-4">
			{/* Toast Container */}
			<div className="fixed top-4 right-4 z-40 flex flex-col">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>

			{/* Confirmation Dialog */}
			{confirmDialog && (
				<ConfirmDialog
					message={confirmDialog.message}
					onConfirm={confirmDialog.onConfirm}
					onCancel={confirmDialog.onCancel}
				/>
			)}

			<div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 transition-all duration-300 border border-gray-100">
				<h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-8 text-center">
					Task Manager
				</h1>

				{/* Responsive Add Todo Form */}
				<form onSubmit={addTodo} className="mb-8">
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-grow">
							<input
								type="text"
								className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 text-gray-700 placeholder-gray-400 transition-all shadow-sm"
								value={newTodo}
								onChange={(e) => setNewTodo(e.target.value)}
								placeholder="What needs to be done?"
								required
							/>
						</div>
						<button
							type="submit"
							className={`${
								isMobile ? "w-full" : "w-auto"
							} bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-5 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:translate-y-[-1px] active:translate-y-[1px]`}
						>
							<MdAdd className="text-xl" />
							<span>Add Task</span>
						</button>
					</div>
				</form>

				{/* Display Todos */}
				<div>
					{isLoading ? (
						<div className="flex justify-center items-center py-16">
							<div className="loader">
								<div className="spinner"></div>
							</div>
						</div>
					) : todos.length === 0 ? (
						<div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
							<div className="empty-state-icon mx-auto mb-4"></div>
							<p className="text-lg font-medium text-gray-700">No tasks yet</p>
							<p className="text-sm mt-1 text-gray-500">Add a new task to get started</p>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{todos.map((todo) => (
								<div
									key={todo._id}
									className={`border rounded-xl p-4 transition-all duration-200 ${
										todo.completed
											? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100"
											: "bg-white border-gray-100 hover:border-violet-200 hover:shadow-md"
									}`}
								>
									{editingTodo === todo._id ? (
										<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
											<input
												className="flex-1 w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-gray-700 shadow-sm"
												type="text"
												value={editedText}
												onChange={(event) => setEditedText(event.target.value)}
												autoFocus
											/>
											<div className="flex gap-2 w-full sm:w-auto">
												<button
													onClick={() => saveEdit(todo._id)}
													className="flex-1 sm:flex-initial p-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
													title="Save"
												>
													<MdOutlineDone />
													<span>Save</span>
												</button>
												<button
													className="flex-1 sm:flex-initial p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all flex items-center justify-center gap-1"
													onClick={() => setEditingTodo(null)}
													title="Cancel"
												>
													<IoClose />
													<span>Cancel</span>
												</button>
											</div>
										</div>
									) : (
										<div className="flex items-center justify-between">
											<div className="flex items-start sm:items-center gap-3 overflow-hidden">
												<button
													onClick={() => toggleTodo(todo._id)}
													className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center transition-all duration-200 mt-0.5 sm:mt-0 ${
														todo.completed
															? "bg-gradient-to-r from-emerald-400 to-teal-500 border-emerald-500 text-white shadow-sm"
															: "border-gray-300 hover:border-violet-400"
													}`}
													title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
												>
													{todo.completed && <MdOutlineCheck className="text-sm" />}
												</button>
												<span
													className={`truncate text-gray-800 ${
														todo.completed ? "line-through text-gray-500" : "font-medium"
													}`}
												>
													{todo.text}
												</span>
											</div>
											<div className="flex gap-1 ml-2">
												{!todo.completed && (
													<button
														className="p-2 text-amber-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
														onClick={() => startEditing(todo)}
														title="Edit"
													>
														<MdModeEditOutline className="text-lg" />
													</button>
												)}
												<button
													className="p-2 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
													onClick={() => deleteTodo(todo._id)}
													title="Delete"
												>
													<FaTrash className="text-lg" />
												</button>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{todos.length > 0 && (
					<div className="mt-6 text-sm font-medium text-gray-500 text-center">
						<span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
							{todos.filter((t) => t.completed).length} of {todos.length} tasks completed
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
