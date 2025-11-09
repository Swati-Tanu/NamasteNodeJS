const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();
requestRouter.use(userAuth);

//? Left swipe -- Right swipe (status: ignored or interested)
requestRouter.post("/request/send/:status/:toUserId", async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    //? 1.Only right swipe and left swipe should be handled here.
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status", allowedStatus });
    }

    //? 2.Check if user whom request is send even exists.
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //? 3.User should not be able to send a connection request to themselves: Handling this in schema using methods - pre().
    // if (fromUserId.toString() === toUserId) {
    //   throw new Error("You cannot send connection request to yourself!");
    // }

    //? 4.Check if there is already a connection request exists -- Pending (Either from fromUser or from toUser)
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).send("Connection Request Already Exists!");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message: "Connection request as " + status + " for " + toUser.firstName,
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error sending connection request",
      ERROR: error.message,
    });
  }
});

module.exports = requestRouter;
