const express = require("express");
const { userAuth } = require("../middleWare/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const profileRouter = express.Router();
const {ValidatePutApi} = require("../helpers/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user= req.user;
  res.send("fetched profile successfully..." + user);
});

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
      // const cookiee= req.cookies;
      // const{token}= cookiee;
      // const decodedMessage = jwt.verify(token, "Harsh@123$123");
      // const{_id}= decodedMessage;
      const user= req.user;
      const {_id}= user;
      const updates = req.body;
        //we are validating user upadate req and their fields using validateputApi();
          const filter = { _id:_id};
          const options = { new: true, runValidators: ValidatePutApi(req) }; // Ensures validation rules are checked
          const updatedUser = await User.findOneAndUpdate(filter, updates, options);
      
          if (updatedUser) {
            res.send("User updated successfully"+updatedUser);
          } else {
            throw new Error("user was not updated");
          }

    }
    catch(err){
      res.status(400).send("can't update user at this time!!!"+err);

    }

})
module.exports = profileRouter;
