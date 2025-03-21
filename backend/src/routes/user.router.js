import express from "express";
import { User } from "../models/user.model.js";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.model.js";

export const userRouter = express.Router();

const USER_SAFE_DATA = "firstname lastname age gender photoUrl skills about";

userRouter.get("/user/feed/", userAuth, async (req, res) => {
    try {

		const page = parseInt(req.query.page) || 1;

		const limit = parseInt(req.query.limit) || 10;

		const skip = ( page - 1 ) * limit;

		const loggedInUser = req.user;

		const loggedInUserId = loggedInUser._id;

		const userRequests = await ConnectionRequest.find({
			$or: [
				{
					fromUserId: loggedInUserId
				}, 
				{
					toUserId: loggedInUserId
				}
			]
		}).select("fromUserId toUserId");

		const hideUserFromFeed = new Set();

		userRequests.forEach((request) => {
			hideUserFromFeed.add(request.fromUserId.toString());
			hideUserFromFeed.add(request.toUserId.toString());
		});

		const userFeedData = await User.find({
			_id: { $nin: Array.from(hideUserFromFeed)}
		}).select(USER_SAFE_DATA).skip(skip).limit(limit);

		res.status(200).json({
			message: "User Feed",
			data: userFeedData
		});
	} catch (error) {
		console.log("Error in user.Router get/user/feed", error.message);
		res.status(400).send("ERROR : " + error.message);
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const loggedInUserId = loggedInUser._id;

		const userConnections = await ConnectionRequest.find({
			$or: [
				{
					toUserId: loggedInUserId,
					status: "accepted"
				},
				{
					fromUserId: loggedInUserId,
					status: "accepted"
				}
			]
		}).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

		if(userConnections.length == 0) {
			return (res.status(200).send("No connections found."));
		}

		const connectionData = userConnections.map((row) => {
			if(row.fromUserId.equals(loggedInUserId)) {
				return row.toUserId;
			} else {
				return row.fromUserId;
			}
		});

		res.status(200).json({
			message:`${loggedInUser.firstname}  connections`,
			data: connectionData
	});
	} catch (error) {
		console.log("Error in userRouter get/user/connections ", error.message);
		res.status(400).send("ERROR : " + error.message);
	}
});

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const loggedInUserId = loggedInUser._id;

		const userRequests = await ConnectionRequest.find({
			toUserId: loggedInUserId,
			status: "interested"
		}).populate("fromUserId", USER_SAFE_DATA);

		if(userRequests.length == 0) {
			return res.status(200).send("No request found.");
		}

		res.status(200).json({
			message: `${loggedInUser.firstname} received requests`,
			data: userRequests
		});
	} catch (error) {
		console.log("Error in userRouter get/user/connections", error.message);
		res.status(400).send("ERROR : " + error.message);
	}
	
});