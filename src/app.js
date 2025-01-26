const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("./config/database");
const dbConnect = require("./config/database");
const User = require("./models/user");
const Joi= require("joi");
const {ValidateSignUp,ValidatePutApi,ValidataLogin}=require("./helpers/validation");
const cookieParser= require("cookie-parser");
const jwt= require("jsonwebtoken");

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser());

// Route to create a new user
app.post("/user", async (req, res) => {
   // Define the validation schema for the user
  
  try {
    const value= await ValidateSignUp(req);//the validate fn will always return promise and we have to use await to resolve
    // Create a new user instance using the validated data
    // console.log(",getting value",value);
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
  //login api
app.post("/login", async (req, res) => {
    try {
      // Validate login data
      const userData = await ValidataLogin(req);
      if(!userData){throw new Error("user not found")}

      //creating a token for every user by passing id of user and a private key
      //using jsonwebtoken library
       const token= jwt.sign({_id:userData.userId},"Harsh@123$123");

       //sending cookie to browser
       res.cookie("token",token);
      // Send success response
      res.status(200).send({
        success: true,
        message: "User logged in successfully",
        data: userData,
      });
    } catch (err) {
      // Send error response
      res.status(400).send({
        success: false,
        message: "Unable to login",
        error: err.message,
      });
    }
  });

app.get("/profile", async(req,res)=>{

    const cookiee=req.cookies;
    const {token}= cookiee;
    // console.log(token);  //read the cookie using cookie parser here
    //validating the token here !!! by passing the token and the private key 
    const decodedMessage= jwt.verify(token,"Harsh@123$123"); 
    const {_id}=decodedMessage;
    const user= await User.findById({_id});
    // console.log(user);
    res.send("fetched profile successfully..."+user);
  })
  

// Database connection and server start
dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(1000, () => console.log("Server is running on port 1000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
