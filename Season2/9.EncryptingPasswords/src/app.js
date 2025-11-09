const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/home", (req, res) => {
  res.send("Welcome to DevTinder!");
});

app.post("/signup", async (req, res) => {
  try {
    //? 1.Validating the data
    validateSignUpData(req);

    //? Extracting fields from req body
    const { firstName, lastName, emailId, password } = req.body;

    //? 2.Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //? 3.Creating new instance of schema
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    //? 4.Saving data in db
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
      //? Don't give explicit error messages like email not found for security purposes.
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
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

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res
      .status(200)
      .send({ message: "All users details fetched successfully!", data: data });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching users", error: error.message });
  }
});

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
      .send({ message: "Error fetching users", error: error.message });
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
      .send({ message: "Error deleting users", error: error.message });
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
      .send({ message: "Error updating users", error: error.message });
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
