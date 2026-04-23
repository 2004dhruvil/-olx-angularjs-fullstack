const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// GET Conversations for a user (List of people they talked to)
router.get("/conversations/:username", async (req, res) => {
    try {
        const username = req.params.username;
        // Find chats where user is a participant
        const chats = await Chat.find({ participants: username })
            .sort({ updatedAt: -1 });

        // Transform to return list of "other" users
        const conversations = chats.map(chat => {
            const otherUser = chat.participants.find(p => p !== username);
            return {
                chatId: chat._id,
                otherUser: otherUser,
                lastMessage: chat.messages[chat.messages.length - 1] // Get actual last message obj
            };
        });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Messages between two users
router.get("/messages/:user1/:user2", async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const chat = await Chat.findOne({
            participants: { $all: [user1, user2] }
        });

        if (chat) {
            res.json(chat.messages);
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE Chat (Clear Conversation)
router.delete("/messages/:user1/:user2", async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const result = await Chat.findOneAndDelete({
            participants: { $all: [user1, user2] }
        });

        if (result) {
            res.json({ message: "Conversation deleted successfully" });
        } else {
            res.status(404).json({ message: "Conversation not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
