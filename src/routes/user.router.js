import express from "express";
import { User } from "../models/user.model.js";
import { userAuth } from "../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
		const user = await User.find({});

		res.status(200).send(user);
	} catch (error) {
		console.log("Error in get/user/feed", error.message);
		res.status(400).send("Error : " + error.message);
	}
});