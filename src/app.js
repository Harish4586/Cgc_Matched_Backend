const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("./config/database");
const dbConnect = require("./config/database");
const User = require("./models/user");
const Joi= require("joi");

app.use(express.json()); // Middleware to parse incoming JSON requests

// Route to create a new user
app.post("/user", async (req, res) => {
   // Define the validation schema for the user
   const schema = Joi.object({
    firstName: Joi.string().min(2).max(40).required().trim(),
    lastName: Joi.string().optional().trim(),
    emailId: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().min(6).required().trim(),
    age: Joi.number().min(18).max(100).optional(),
    gender: Joi.string().valid("male", "female", "others").required(),
  });
  const {error,value}= schema.validate(req.body);//validate req.body according to defined schema
  if(error){return res.status(400).send({error:"error while signing up"})}
  try {
    // Create a new user instance using the validated data
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
  const schema = Joi.object({
    emailId: Joi.string().email().required(),
    lastName: Joi.string().optional(),
    gender: Joi.string().valid("male", "female", "others").optional(),
    age: Joi.number().min(18).max(100).optional(),
    password: Joi.string().optional(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { emailId, ...updates } = value;

  try {
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
