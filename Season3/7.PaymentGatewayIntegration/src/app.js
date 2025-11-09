require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

require("./utils/cronJob");

app.use(
  cors({
    // White listing our frontend domain
    origin: "http://localhost:5173",
    credentials: true, // If you're sending cookies or auth headers.
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/paymentRouter");

app.get("/home", (req, res) => {
  res.send("Welcome to DevTinder!");
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

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
