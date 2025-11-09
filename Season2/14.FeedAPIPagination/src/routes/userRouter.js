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
      "age",
      "gender",
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
        "age",
        "gender",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "about",
        "skills",
        "age",
        "gender",
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

//? Fetch all profile that the loggedIn user is going to see on their feed.
//? 1.The user should not see their own profile in the feed
//? 2.If user has already send connection request i.e., status as "interested" or "ignored", those profile should not appear in the feed.
//? 3.If user is already a connection i.e., status as "accepted", those profile should not appear in the feed.
userRouter.get("/user/feed", async (req, res) => {
  try {
    const loggedInUser = req.user;

    //? Pagination
    // Convert to number as it will be in string bydefault. Also set default value for both if user is visiting the first page without any explicit value for both.
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    //Sanitizing/Restricting limit
    limit = limit > 50 ? 50 : limit;
    // Calculating skip
    const skip = (page - 1) * limit;

    // Find all connection requests (sent + received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId, toUserId");
    //? Set() data structure is kind of array that contains unique values onlt.
    const hideUserFromFeed = new Set();

    connectionRequest.forEach((el) => {
      if (el.fromUserId) hideUserFromFeed.add(el.fromUserId.toString());
      if (el.toUserId) hideUserFromFeed.add(el.toUserId.toString());
    });

    //? Excluding the users in hideUserFromFeed as well as once own profile
    const users = await User.find({
      $and: [
        // Converting the Set() to Array --> Array.from(hideUserFromFeed)
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(["firstName", "lastName", "photoUrl", "about", "skills", "age", "gender"])
      .skip(skip)
      .limit(limit);

    res.status(200).send({ message: "All users fetched successfully!", users });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching users", ERROR: error.message });
  }
});

module.exports = userRouter;
