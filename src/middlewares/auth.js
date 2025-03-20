import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        const { token } = cookies;

        if(!token) {
            throw new Error("Your are not logged in.");
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken) {
            throw new Error("Your are not authorized.");
        }

        const { _id } = decodedToken;

        const user = await User.findById({ _id });

        if(!user){
            throw new Error("User not found");
        }
        
        req.user = user;
        next();

    } catch (error) {
        console.log("Error : ", error.message);
        res.status(400).send("ERROR : " + error.message);
    }
};