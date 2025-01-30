const express = require("express");
const { userAuth } = require("../middleWare/auth");
const connectionRouter = express.Router();

connectionRouter.post("/sendConnection", userAuth, (req, res) => {
  res.send("connection req sent by : " + req.user.firstName);
});

module.exports = connectionRouter;
