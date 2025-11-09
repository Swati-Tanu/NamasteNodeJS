const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
userRouter.use(userAuth);

//? Get all the pending connection request for the loggedIn user, i.e., Connection Request List
userRouter.get("/user/requests/received", async (req, res) => {
  try {
    const loggedInUser = req.user;

    //? Show only the requests where status is interested, i.e., still left to be accepted/rejected.
    //? Using populate() after creatimg referance in schema. Also by giving second parameters  ["firstName", "lastName"] we are explicitly defining what fields we exactly need so that we don't overfetch unnecessary data.
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ]);

    //? We can use string instead of array as well.
    // .populate("fromUserId", "firstName lastName photoUrl about skills");

    res.status(200).send({
      message: "All connection requests!",
      requests: connectionRequest,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching requests", ERROR: error.message });
  }
});

//? Fetches the list of all connections of loggedIn user.
userRouter.get("/user/connections", async (req, res) => {
  try {
    const loggedInUser = req.user;

    //? 1.Status should be "accepted"
    //? 2.The request can be either send by/to the loggedIn user.
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
      ]);

    const data = connectionRequest.map((el) => {
      //? Using toString() as comparing two ObjectIds
      if (el.fromUserId._id.toString() === loggedInUser._id) {
        return el.toUserId;
      }
      return el.fromUserId;
    });

    res.status(200).send({
      message: "All connection list!",
      myConnections: data,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error connections list", ERROR: error.message });
  }
});

module.exports = userRouter;
