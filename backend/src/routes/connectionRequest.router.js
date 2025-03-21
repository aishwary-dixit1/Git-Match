import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { User } from "../models/user.model.js";

export const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;

        const toUserId = req.params.toUserId;

        // Check if the above two user ids exist or not.
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const status = req.params.status;

        // CHeck for valid status
        const ALLOWED_STATUS = ["interested", "ignored"];

        if(!ALLOWED_STATUS.includes(status)){
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }

        // Check if the request is already made or not (fromUserId -> toUserId or toUserId -> fromUserId)
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: fromUserId,
                    toUserId: toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if(existingConnectionRequest){
            return res.status(200).json({
                message: "Connection is already sent"
            });
        }


        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const requestData = await newConnectionRequest.save();

        res.status(200).json({
            message: "Connection request sent successfully.",
            requestData,
        });
    } catch (error) {
        console.log("Error in requestRouter/send/interested ", error.message);
        res.status(400).send("ERROR : " + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const loggedInUserId = loggedInUser._id;

        const statusResponse = req.params.status;

        const requestId = req.params.requestId;

        const STATUS_ALLOWED = ["accepted", "rejected"];

        // Checking for status validity
        if(!STATUS_ALLOWED.includes(statusResponse)) {
            return res.status(400).json({
                message: "Invalid Status"
            });
        }

        const connectionRequestData = await ConnectionRequest.findById({
            _id: requestId,
            toUserId: loggedInUserId,
            status: "interested"
        });

        // Checking for valid connection request Id
        if(!connectionRequestData) {
            return res.status(400).json({
                message: "Connection request not found."
            });
        }

        connectionRequestData.status = statusResponse;

        connectionRequestData.save();

        res.status(200).json({
            message: `Connection request ${statusResponse}`,
            connectionRequestData
        });

    } catch (error) {
        console.log("Error in connectionRequest.router post/request/review/:status/:requestId  ", error.message);

        res.status(400).send("ERROR : " + error.message);
    }
    
});