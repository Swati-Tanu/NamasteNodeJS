const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/home", (req, res) => {
  res.send("Welcome to DevTinder!");
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const data = await user.save();
    res
      .status(201)
      .send({ message: "User registered successfully!", data: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error registering the user", ERROR: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If defining the above bcrypt logic in User Model. Prefered way!
    // const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //? 1.Create a JWT token
      const token = await jwt.sign({ _id: user._id }, "Super@Secret", {
        expiresIn: "1d",
      });

      // If defining the above jwt logic in User Model. Prefered way!
      // const token = await user.getJWT()

      //? 2.Add the token to cookies and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send("User logged in successfully!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error logging in the user", ERROR: error.message });
  }
});

//! First way of using adding authentication in an endpoint
app.get("/profile", async (req, res) => {
  try {
    //? 4.Extract the token from the cookies
    const cookies = req.cookies;
    const { token } = cookies;
    // console.log("Cookies:", cookies);

    if (!token) {
      throw new Error("Invalid Token!");
    }

    //? 5.Validate the token
    decodedToken = jwt.verify(token, "Super@Secret");
    // console.log("decodedToken", decodedToken);

    //? 6.Info about the logged in user
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    // console.log("Logged In user is ", user);

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

//! Second way of using adding authentication in an endpoint
app.get("/feed", userAuth, async (req, res) => {
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

//! Third way of using adding authentication for all endpoints mentioned after this line.
app.use(userAuth);

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const data = await User.find({ emailId: userEmail });

    if (data.length === 0) {
      res.status(404).send({ message: "User not found!" });
    } else {
      res
        .status(200)
        .send({ message: "User deatils fetched successfully!", data: data });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching users", ERROR: error.message });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = await User.findByIdAndDelete({ _id: userId });

    if (data.length === 0) {
      res.status(404).send({ message: "User not found!" });
    } else {
      res
        .status(200)
        .send({ message: "User deleted successfully!", data: data });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting users", ERROR: error.message });
  }
});

app.patch("/user/:userId", async (req, res) => {
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

app.post("/sendConnectionRequest", async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user.firstName + " sent the connection request!");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating users", ERROR: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established!");
    app.listen(3000, () => {
      console.log("Server listening to port 3000");
    });
  })
  .catch(() => {
    console.log("DB cannot be connected!");
  });
