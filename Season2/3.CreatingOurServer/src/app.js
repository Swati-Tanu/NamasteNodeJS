const express = require("express");

const app = express();

app.use("/main", (req, res) => {
  res.send("Hello from the server");
});

app.use("/test", (req, res) => {
  res.send("Testing");
});

//! The sequence of routes here matters.
//? If line 15 was on line 5, it would overwrite all the address as all of them starts with "/".
app.use("/", (req, res) => {
  res.send("Welcome to the Project!");
});

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});
