const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middleWare/auth");

const chatRouter = express.Router();

// Get Chat Messages
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user?._id; // Ensure user authentication worked

  try {
    // console.log("🔍 Fetching chat for:", { userId, targetUserId });

    if (!userId) {
      // console.error("❌ User authentication failed!");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } })
    .populate("messages.senderId", "firstName lastName"); 

    if (!chat) {
      // console.log("⚠️ Chat not found, creating a new one...");
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    } else {
      // console.log("✅ Chat found:", chat);
    }

    res.json(chat);
  } catch (err) {
    // console.error("❌ Error fetching chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a Message
chatRouter.post("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user?._id;
  const { text } = req.body;

  try {
    // console.log("📩 Sending message:", { userId, targetUserId, text });

    if (!text) {
      // console.error("❌ Message text is missing!");
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

    if (!chat) {
      // console.log("⚠️ No chat found, creating a new chat...");
      chat = new Chat({ participants: [userId, targetUserId], messages: [] });
    }

    const newMessage = { senderId: userId, text };
    chat.messages.push(newMessage);
    await chat.save();

    // console.log("✅ Message saved successfully!");
    res.json({ message: "Message sent successfully", chat });
  } catch (err) {
    // console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = chatRouter;
