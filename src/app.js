const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // ✅ This allows cookies
  })
);



// Refactoring done here using middlewares for better readability
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const connectionRouter = require("./routers/connection");
const userRouter = require("./routers/userRouter"); 
const chatRouter = require("./routers/chat");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// Step 3: Create an HTTP server
const server = http.createServer(app);

// Step 5: Initialize Socket.IO
initializeSocket(server);

// Step 4: Change the name from app to server
// Database connection and server start
dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(1000, () => console.log("Server is running on port 1000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });