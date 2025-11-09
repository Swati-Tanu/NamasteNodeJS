const express = require("express");

const app = express();

//? We can have multiple route handler.
app.use(
  "/user",
  (req, res) => {
    console.log("First handler");
    res.send("First handler");
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Second handler");
  }
);

app.get(
  "/next",
  (req, res, next) => {
    console.log("First handler");
    next(); // Passes control to the next handler
    // res.send("First handler");
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Second handler");
  }
);

//? Error Handling: The sequesnce of parameters matters here. Also using try-catch in every route is the best practice.
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

//? Fun fact: next() is just a placeholder we can use any keyword we want.
