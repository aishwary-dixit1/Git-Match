import express from "express";
import { User } from "../models/user.model.js";
import { validateSignupData, validateLoginData } from "../utils/validation.js";
import bcrypt from "bcryptjs";


export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {

        validateSignupData(req);

        const { firstname, lastname, emailId, password, skills, gender, age, photoUrl } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            emailId,
            password: hash,
            skills,
            gender,
            age, 
            photoUrl
        });

        await newUser.save();

        const user = await User.findOne({emailId: emailId});

        const token = await user.getJWT();

        res.cookie("token", token);

        res.status(200).send(newUser);
    } catch (error) {
        console.log("Error", error.message);
        res.status(400).send("Error something went wrong");
    }
});

authRouter.post("/login", async (req, res) => {

    try {
        validateLoginData(req);

        const { emailId, password } = req.body;

        const user = await User.findOne({emailId: emailId});

        if(!user) {
            throw new Error("Invalid credentials.");
        }

        const hashedPassword = user.password;

        const isPasswordCorrect = await user.validatePassword(password);

        if(!isPasswordCorrect) {
            throw new Error("Invalid credentials.")
        }

        const token = await user.getJWT();

        res.cookie("token", token);

        res.status(200).json({
            message: "Login successful.",
            data: user
        });

    } catch (error) {
        console.log("Error in post/login", error.message);
        res.status(400).send("Error : " + error.message);
    }
    
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.status(200).send("Logout successfull.")
    } catch (error) {
        console.log("Error in authRouter/logout", error.message);
        res.status(400).send("ERROR : " + error.message);
    }
});
