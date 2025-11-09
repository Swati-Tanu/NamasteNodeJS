const express = require("express")
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const userRouter = express.Router()
userRouter.use(userAuth)

userRouter.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res
      .status(200)
      .send({ message: "All users details fetched successfully!", data: data });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching users", ERROR: error.message });
  }
});

userRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });

    if (user.length === 0) {
      res.status(404).send({ message: "User not found!" });
    } else {
      res
        .status(200)
        .send({ message: "User deatils fetched successfully!", user: user });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching users", ERROR: error.message });
  }
});

userRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });

    if (user.length === 0) {
      res.status(404).send({ message: "User not found!" });
    } else {
      res
        .status(200)
        .send({ message: "User deleted successfully!", user: user });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting users", ERROR: error.message });
  }
});

userRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error(
        `Update not allowed! Allowed fields to be updated: ["photoUrl", "about", "gender", "age"] `
      );
    }

    if (data?.skills?.length) {
      throw new Error("Skills cannot be more than 10!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("User after updating:", user);

    res.status(200).send({ message: "User updated successfully!", data: data });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating users", ERROR: error.message });
  }
});

module.exports = userRouter;