import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
	const { email, username, password } = req.body;

	if (!email || !username || !password)
		return res.status(400).json({ message: "All fields are required" });

	const userExists = await User.findOne({ $or: [{ email }, { username }] });
	if (userExists) return res.status(400).json({ message: "Email or Username already exists" });

	const user = await User.create({ email, username, password });

	if (user) {
		const token = generateToken(user._id);
		res.status(201).json({
			_id: user._id,
			email: user.email,
			username: user.username,
			token,
		});
	} else {
		res.status(400).json({ message: "Invalid user data" });
	}
};

export const loginUser = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password)
		return res.status(400).json({ message: "Username and password required" });

	const user = await User.findOne({ username });

	if (user && (await user.matchPassword(password))) {
		const token = generateToken(user._id);
		res.json({
			_id: user._id,
			email: user.email,
			username: user.username,
			token,
		});
	} else {
		res.status(401).json({ message: "Invalid username or password" });
	}
};

export const forgotPassword = async (req, res) => {
	const { username, newPassword } = req.body;

	if (!username || !newPassword)
		return res.status(400).json({ message: "Username and new password required" });

	const user = await User.findOne({ username });

	if (!user) return res.status(404).json({ message: "User not found" });

	// Compare new password with existing hashed password
	const isSamePassword = await bcrypt.compare(newPassword, user.password);
	if (isSamePassword) {
		return res
			.status(400)
			.json({ message: "New password must be different from the current password" });
	}

	user.password = newPassword; // This will be hashed by pre-save middleware
	await user.save();

	res.json({ message: "Password reset successful" });
};
