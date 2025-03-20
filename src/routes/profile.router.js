import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { User } from "../models/user.model.js";
import { validateEditProfileData } from "../utils/validation.js";

export const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);

    } catch (error) {
        console.log("Error in get/profile ", error.message);
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
		
        validateEditProfileData(req);

        const newData = req.body;

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

		res.status(200).send(`${loggedInUser.firstname} Data updated successfully`);
	} catch (error) {
		console.log("Error in patch/profile/edit ", error.message);
		res.status(400).send("Something went Wrong" + error.message);
	}
});