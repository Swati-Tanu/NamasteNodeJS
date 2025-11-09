const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      return res.status(401).send("Please login first!");
    }
    const decodedToken = await jwt.verify(token, "Super@Secret", {
      expiresIn: "1d",
    });

    const { _id } = decodedToken;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in authenticating user", ERROR: error.message });
  }
};

module.exports = {
  userAuth,
};
