const express = require("express");
const { userAuth } = require("../middleWare/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { _id } = loggedInUser;
    const userId = _id.toString();
    const connectionrequests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    //this populate fn is getting firstName and lastName from User collection using fromUserId(the one who sent request to current loggedin user)
    // console.log(connectionrequests);
    res.json({data:connectionrequests});
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
});
//error resolved

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: userId, status: "accept" },
        { fromUserId: userId, status: "accept" },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender photoUrl about skills") // ✅ Include all necessary fields
      .populate("toUserId", "firstName lastName");

    console.log("Connection Requests Response:", connectionRequests); // 🛑 Debug response
    res.json({ data: connectionRequests });
  } catch (err) {
    console.error("ERROR fetching connections:", err); // 🛑 Log errors
    return res.status(400).send("ERROR: " + err.message);
  }
});




userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { _id } = loggedInUser;
    const userId = _id.toString();

    //the feed api should not include these cards->
    //his own card
    // his connection's card
    // all users who are interested or ignored the logged in user
    const connectionrequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });
    const hideUsersFromFeed = new Set();
    //we use set() to prevent adding duplicate values
    connectionrequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    // console.log(hideUsersFromFeed)

    //now we have to show all users from User collection except these hideUsersFromFeed
    //using comparision query
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: userId } },
      ],
    });
    //$and=> it will serach both queries together
    //used reverse query- nin(not present in),$ne(not equals to)

    res.json(users);
  } catch (err) {
    return res.status(400).send("ERROR: " + err);
  }
});

module.exports = userRouter;
