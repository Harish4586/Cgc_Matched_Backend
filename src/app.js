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
const { userAuth, adminAuth } = require("./middleWare/auth");

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser());

// api to create a new user
app.post("/signup", async (req, res) => {
   // Define the validation schema for the user
  
  try {
    const value= await ValidateSignUp(req);//the validate fn will always return promise and we have to use await to resolve
    // Create a new user instance using the validated data
    // console.log(",getting value",value);
    const user = new User(value);
    const {emailId}=value;
    

    // Save the user to the database
    await user.save();
     const newUser= await User.findOne({emailId});
     const {_id}= newUser;
    const token = jwt.sign({_id},"Harsh@123$123",{expiresIn:"10d"});
    res.cookie("token",token,{ maxAge: 3600000*24*10 });

    res.status(201).send("User data saved successfully");
  } catch (err) {
    res.status(400).send({ error: "Error saving user data", details: err.message });
  }

  }
);

  //login api
app.post("/login", async (req, res) => {
    try {
      // Validate login data
      const userData = await ValidataLogin(req); //we can login any user with email and password here through req body
      // const userData= req.user; //we can only validate the user with cookie here!!
      if(!userData){throw new Error("user not found")}

      //creating a token for every user by passing id of user and a private key
      //using jsonwebtoken library
       const token= jwt.sign({_id:userData.userId},"Harsh@123$123",{expiresIn:"10d"});

       //sending cookie to browser
       res.cookie("token",token,{ maxAge: 3600000*24*10 });
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

app.get("/profile", userAuth, async(req,res)=>{

    const cookiee=req.cookies;
    const {token}= cookiee;
    // console.log(token);  //read the cookie using cookie parser here
    //validating the token here !!! by passing the token and the private key 
    const decodedMessage= jwt.verify(token,"Harsh@123$123"); 
    const {_id}=decodedMessage;
    const user= await User.findById({_id});
    console.log(user);
    res.send("fetched profile successfully..."+user);
    
  });

  app.post("/sendConnection",userAuth,(req,res)=>{

    res.send("connection req sent by : "+req.user.firstName);
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
