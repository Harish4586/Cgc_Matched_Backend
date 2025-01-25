const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("./config/database");
const dbConnect = require("./config/database");
const User = require("./models/user");
const Joi= require("joi");
const {ValidateSignUp,ValidatePutApi}=require("./helpers/validation");

app.use(express.json()); // Middleware to parse incoming JSON requests

// Route to create a new user
app.post("/user", async (req, res) => {
   // Define the validation schema for the user
  
  try {
    const value= await ValidateSignUp(req);
    // Create a new user instance using the validated data
    console.log(",getting value",value);
    const user = new User(value);

    // Save the user to the database
    await user.save();

    res.status(201).send("User data saved successfully");
  } catch (err) {
    res.status(400).send({ error: "Error saving user data", details: err.message });
  }

  }
);

// API to get a user by email or _id
app.get("/user", async (req, res) => {
  const { emailId, _id } = req.body;

  if (emailId) {
    try {
      const users = await User.find({ emailId });
      if (users.length !== 0) {
        res.send(users);
      } else {
        res.status(404).send("User not found.");
      }
    } catch (err) {
      res.status(400).send({ error: "Error finding user", details: err.message });
    }
  } else if (_id) {
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).send("Invalid ID format.");
    }
    try {
      const user = await User.findById(_id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("User not found.");
      }
    } catch (err) {
      res.status(400).send({ error: "Error finding user by ID", details: err.message });
    }
  } else {
    res.status(400).send("Please provide emailId or _id to search for a user.");
  }
});

// API to get all users (Feed API)
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send({ error: "Error fetching users", details: err.message });
  }
});

// API to delete a user
app.delete("/user", async (req, res) => {
  const { _id } = req.body;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send("Invalid ID format.");
  }

  try {
    const result = await User.findByIdAndDelete(_id);
    if (result) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(400).send({ error: "Error deleting user", details: err.message });
  }
});

// API to update user details
app.patch("/user", async (req, res) => {
  //putting update validations that  user can update what fields of the data
  const updates = req.body;
  const allowedUpdates = ["age", "gender","lastName","password","userId"];
  const isUpdateAllowed = Object.keys(updates).every((key) => allowedUpdates.includes(key));

  if (!isUpdateAllowed) {
    return res.status(400).send("Some update fields are not allowed.");
  }

  try {
    const filter = { _id: req.body.userId};
    const options = { new: true, runValidators: true }; // Ensures validation rules are checked
    const updatedUser = await User.findOneAndUpdate(filter, updates, options);

    if (updatedUser) {
      res.send("User updated successfully");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(400).send({ error: "Error updating user", details: err.message });
  }
});

app.put("/user", async (req, res) => {
    
  try {
    const value= ValidatePutApi(req);
    const { emailId, ...updates } = value;
    const options = { new: true, runValidators: true };
    const updatedUser = await User.findOneAndUpdate({ emailId }, updates, options);
    if (!updatedUser) {
      return res.status(404).send("User not updated.");
    }
    res.send({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).send({ error: "Failed to update user", details: err.message });
  }
});

// Database connection and server start
dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(1000, () => console.log("Server is running on port 1000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
