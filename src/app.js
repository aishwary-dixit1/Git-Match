import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.model.js";
import { validateSignupData, validateLoginData } from "./utils/validation.js";
import bcrypt from "bcryptjs";

dotenv.config(); 

const PORT = process.env.PORT; 

const app = express(); 

app.use(express.json());

app.post("/signup", async (req, res) => {
	try {

		validateSignupData(req);

		const { firstname, lastname, emailId, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstname,
			lastname,
			emailId,
			password: hash
		});

		console.log(newUser);

		await newUser.save();

		res.status(200).send(newUser);
	} catch (error) {
		console.log("Error", error.message);
		res.status(400).send("Error something went wrong");
	}
});

app.post("/login", async (req, res) => {

	try {
		validateLoginData(req);

		const { emailId, password } = req.body;

		const user = await User.findOne({emailId: emailId});

		if(!user) {
			throw new Error("User does not exist");
		}

		const hashedPassword = user.password;

		const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

		if(!isPasswordCorrect) {
			throw new Error("Password is wrong.")
		}

		res.status(200).send("Login Succesfull.");
		
	} catch (error) {
		console.log("Error in post/login", error.message);
		res.status(400).send("Error : " + error.message);
	}
	
});

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

app.get("/feed", async (req, res) => {
	try {
		const user = await User.find({});

		res.status(200).send(user);
	} catch (error) {
		console.log("Error in get/feed", error.message);
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

app.patch("/update/:emailId", async (req, res) => {
	try {
		const userEmail = req.params?.emailId;

		const newData = req.body;

		const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "skills"];

		const isUpdateAllowed = Object.keys(newData).every((k) => ALLOWED_UPDATES.includes(k));
		
		if(!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}
		await User.findOneAndUpdate({emailId: userEmail}, newData, {
			returnDocument: "after",
			runValidators: true
		});

		res.status(200).send(`Data updated successfully` + newData);
	} catch (error) {
		console.log("Error in patch/update", error.message);
		res.status(400).send("Something went Wrong" + error.message);
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



