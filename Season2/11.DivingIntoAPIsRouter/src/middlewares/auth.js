const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //? 1.Read the token from the req cookies
    //! Note: It will always be cookies with an "s" at when using req and cookie without "s" ehan using res.
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Invalid Token!");
    }

    //? 2.Validate the token
    const decodedToken = await jwt.verify(token, "Super@Secret", {
      expiresIn: "1d",
    });

    //? 3.Find the user
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
