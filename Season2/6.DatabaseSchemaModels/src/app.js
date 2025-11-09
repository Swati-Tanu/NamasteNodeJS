const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const User = require("./models/user");

const app = express();

app.use(cors());

app.get("/home", (req, res) => {
  res.send("Welcome to DevTinder!");
});

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Sherlock",
    lastName: "Holmes",
    emailId: "john@watson.com",
    password: "IreneAdler",
  };

  //? Creating a new instance of User model
  const user = new User(userObj);

  //? Saving the data in the db
  //! Using async-await as most of the mongoose methods returns Promises.
  try {
    const data = await user.save();
    res.status(201).send({ message: "User added successfully!", data: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error saving the user details", error: error.message });
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
//   firstName: "Tony",
//   lastName: "Stark",
//   emailId: "ironman@starkindustries.com",
//   password: "Jarvis123"
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
