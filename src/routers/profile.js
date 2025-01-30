const express = require("express");
const { userAuth } = require("../middleWare/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  const cookiee = req.cookies;
  const { token } = cookiee;
  // console.log(token);  //read the cookie using cookie parser here
  //validating the token here !!! by passing the token and the private key
  const decodedMessage = jwt.verify(token, "Harsh@123$123");
  const { _id } = decodedMessage;
  const user = await User.findById({ _id });
  console.log(user);
  res.send("fetched profile successfully..." + user);
});
module.exports = profileRouter;
