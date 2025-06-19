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
      const toUserId = req.params.toUserId;
      const isUserExists = await User.findById(toUserId);
      if (!isUserExists) {
        throw new Error("this user haven't registered in our application");
      }
      const fromUserId = req.user._id;
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

connectionRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    // Validation: Allowed status types
    const allowedStatus = ["accept", "reject"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type!!" });
    }

    // Find the request by ID (not fromUserId)
    const requestedConnection = await ConnectionRequestModel.findById(requestId);
    
    if (!requestedConnection) {
      return res.status(404).json({ message: "Connection request not found!" });
    }

    // Update the status
    requestedConnection.status = status;
    await requestedConnection.save();

    res.json({ message: `Request ${status} successfully`, requestId });

  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});



module.exports = connectionRouter;
