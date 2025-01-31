const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");



app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser());

//refactoring done here using middlewares for better readability
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const connectionRouter = require("./routers/connection");
const userRouter = require("./routers/userRouter");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);

// Database connection and server start
dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(1000, () => console.log("Server is running on port 1000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
