const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleWare/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUser = req.params.toUserId;
      const isUserExists = await User.findById(toUser);
      if (!isUserExists) {
        throw new Error("this user haven't registered in our application");
      }
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validation1: a user can't send request to himself
      if(fromUserId== toUserId){throw new Error("you can't send request to yourself!!!!")};
      //basic validation to check that the logged in user can only send two api req,it
      //can be interstd or ignored

      //validation 2: status can't be other than ignore or interested;
      const allowedStatusType = ["ignore", "interested"];
      const isAllowedStatusType = allowedStatusType.includes(status);
      if (!isAllowedStatusType) {
        throw new Error("not a valid status type: " + status);
      }
      //here's when a new database is created using (name of model -  ConnectionRequest) =>connectionrequests
      const ConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      //validation 3: we check corner case if there exist already a connection request that
      //is sent by any fromUSerID or toUserID or vice versa then we cant save the new request in database;
      const existingRequest = await ConnectionRequestModel.findOne({
        //note: $ or is a mongoDb thing that helps us to write conditions
        //it means that it is checking if there exists a old request
        //that is between two users,if yes then the existingRequest will contain the info about old request
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        throw new Error("request already exists");
      }

      const data = await ConnectionRequest.save();
      res.json({
        message: req.user.firstName+" is "+status+" in "+isUserExists.firstName,
        data,
      });
    } catch (err) {
      res.status(400).json({
        message: "ERROR: " + err.message,
      });
    }
  }
);

//user1->user2
// loggedInUser===user2
//status=intersted(this one->/request/send/:status/:toUserId)
// requestId should be valid

connectionRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
  try{
    const loggedInUser= req.user;
    const {status,requestId}= req.params;
    //validation 1: check for allowed staus type
    const allowedStatus= ["accept","reject"];
    if(!allowedStatus.includes(status)){
      res.status(400).json({message:"invalid status type!!"});
    }
    //validation 2: check if the requested user is present in db or not
    const isUserExists=  await User.findById(requestId);
    // console.log(isUserExists);
    if(!isUserExists){throw new Error("user not found in database")};
    //validation 3: check if we have the interested request (from : user of requestId,touser:current logged in user) present or not
    const requestedConnection= await ConnectionRequestModel.findOne({
      fromUserId:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    });
    // console.log(requestedUser);
    if(!requestedConnection){
      throw new Error(" can't found any request to accept!! ");
    }

    requestedConnection.status=status;
    const result=await requestedConnection.save();
    res.send(status+" successfully"+" and the accepted request is "+result);

  }
  catch(err){
   res.status(400).send("ERROR: "+err.message);
  }
})


module.exports = connectionRouter;
