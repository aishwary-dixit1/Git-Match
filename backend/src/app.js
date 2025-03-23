import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.model.js";
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth.js";

import { authRouter } from "./routes/auth.router.js";
import { profileRouter } from "./routes/profile.router.js";
import { userRouter } from "./routes/user.router.js";
import { requestRouter } from "./routes/connectionRequest.router.js";
import cors from "cors";

dotenv.config(); 

const PORT = process.env.PORT; 

const app = express(); 

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", userRouter);

app.use("/", requestRouter);

app.get("/user", async (req, res) => {
	try {
		const userEmail = req.body.emailId;

		const user = await User.find({emailId : userEmail});

		res.status(200).send(user);
	} catch (error) {
		console.log("Error in get/user", error.message);
		res.status(400).send("Error");
	}
});

app.delete("/delete", async (req, res) => {
	try {
		const emailId = req.body.emailId;

		await User.deleteOne({emailId : emailId});

		res.status(200).send("User Deleted Succesfully.");
	} catch (error) {
		console.log("Error in delete/delete", error.message);
		res.status(400).send("Something went Wrong");
	}
});


// Connect to DB first, then start the server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();



