const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateForgotPassword,
} = require("../utils/validation");

const profileRouter = express.Router();
profileRouter.use(userAuth);

profileRouter.get("/profile/view", async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).send({ "Profile of the logged in user": user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user details", ERROR: error.message });
  }
});

profileRouter.patch("/profile/edit", async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    const user = req.user;

    //? To edit we need to replace the existing value with value in req.body, to do this we can either do one by one for each key but better option in to run a loop on the Object.
    // user.firstName = req.body.firstName
    // user.lastName = req.body.lastName.... and so on

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();

    res.status(200).json({
      message: `${user.firstName}, your profile details updated successfully!`,
      updatedDetails: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error updating profile details",
      ERROR: error.message,
    });
  }
});

profileRouter.patch("/profile/forgotpassword", async (req, res) => {
  try {
    validateForgotPassword(req);

    const { emailId, newPassword } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    res.status(500).send({
      message: "Error changing the password",
      ERROR: error.message,
    });
  }
});

module.exports = profileRouter;
