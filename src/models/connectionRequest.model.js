import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is incorrect status type."
        }, 
        require: true
    }
}, {
    timestamps: true,
});

connectionRequestSchema.pre("save", async function () {
    const connectionRequest = this;

    // Check whether fromUserId and toUserId are same ot not
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself.")
    }

});

// Increasing the searching efficiency by indexing
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});

export const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

