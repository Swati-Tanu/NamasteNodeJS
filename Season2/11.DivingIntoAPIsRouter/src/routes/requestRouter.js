const express = require("express")
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router()
requestRouter.use(userAuth);

requestRouter.post("/sendConnectionRequest", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }
    res.status(200).send(user.firstName + " sent the connection request!");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating users", ERROR: error.message });
  }
});

module.exports = requestRouter