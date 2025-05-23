import mongoose from "mongoose";

export const connectToDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);

		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error: ", error);
		process.exit(1);
	}
};
