const express= require("express");
const { userAuth } = require("../middleWare/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

const userRouter= express.Router();
userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try{
     const loggedInUser= req.user;
     const{_id}=loggedInUser;
     const userId= _id.toString();
      const connectionrequests=await ConnectionRequest.find(
        {toUserId:userId,status:"interested"}).populate("fromUserId",["firstName","lastName"]); 
         //this populate fn is getting firstName and lastName from User collection using fromUserId(the one who sent request to current loggedin user)
      console.log(connectionrequests);
     res.send("got connection requests successfully: "+connectionrequests);
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})


module.exports= userRouter;