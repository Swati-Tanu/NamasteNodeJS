const express = require("express");

const app = express();

//localhost:3000/user?userId=101&isAdmin=false
app.get("/user", (req, res) => {
  console.log("Query: ", req.query);
  res.send({ Name: "Sherlock Holmes", Place: "221B Baker Street" });
});

//localhost:3000/user/101/false
app.get("/user/:userId/:isAdmin", (req, res) => {
  console.log("Param: ", req.params);
  res.send({ Name: "Sherlock Holmes", Place: "221B Baker Street" });
});

// app.get("/ab+c", (req, res) => {
//   res.send("Route matched");
// });

// app.get("/ab?c", (req, res) => {
//   res.send("Route matched: /ab?c");
// });

// app.get("/a*cd", (req, res) => {
//   res.send("Route matched: /a*cd");
// });

// app.get(/a/, (req, res) => {
//   res.send('Route matched any path containing "a"');
// });

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

//! If we handle any route using use(), it will overwrite all get, post, put, patch, delete as use is a route handler that handles all cases.

