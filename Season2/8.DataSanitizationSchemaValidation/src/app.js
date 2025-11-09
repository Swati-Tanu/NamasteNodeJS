const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const User = require("./models/user");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/home", (req, res) => {
  res.send("Welcome to DevTinder!");
});

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  const user = new User(userObj);

  try {
    const data = await user.save();
    res.status(201).send({ message: "User added successfully!", data: data });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error saving the user details", error: error.message });
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
    //? Restrict updating/modifying/changing some fields like, emailId

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error(
        `Update not allowed! Allowed fields to be updated: ["photoUrl", "about", "gender", "age"] `
      );
    }

    if(data?.skills?.length){
      throw new Error(
        "Skills cannot be more than 10!"
      )
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
