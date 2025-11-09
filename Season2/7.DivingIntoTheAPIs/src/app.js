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
      .status(400)
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    //? In findByIdAndUpdate, 3rd parameter "option", returnDocument here will either retrun old/new document depending on it's value
    const userBefore = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
    });
    console.log("User before updating:", userBefore);

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
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

//   {
//   firstName: "Sherlock",
//   lastName: "Holmes",
//   emailId: "sherlock@bakerstreet.com",
//   password: "IreneAdler"
// },
// {
//   firstName: "John",
//   lastName: "Watson",
//   emailId: "john@watson.com",
//   password: "221bBaker"
// },
// {
//   "firstName": "Tony",
//   "lastName": "Stark",
//   "emailId": "ironman@starkindustries.com",
//   "password": "Jarvis123"
// },
// {
//   firstName: "Bruce",
//   lastName: "Wayne",
//   emailId: "batman@wayneenterprises.com",
//   password: "IamBatman"
// },
// {
//   firstName: "Diana",
//   lastName: "Prince",
//   emailId: "wonder@amazon.com",
//   password: "LassoOfTruth"
// }
