const express = require("express");
const { userAuth } = require("../middleWare/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const profileRouter = express.Router();
const { ValidatePutApi } = require("../helpers/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ data: user });
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
    
    let validatedData;
    try {
      validatedData = ValidatePutApi(req);
      console.log("Validated Data:", validatedData);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      validatedData, // Use validated data
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found or update failed" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = profileRouter;
