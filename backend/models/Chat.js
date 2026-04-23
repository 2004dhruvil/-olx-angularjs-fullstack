const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    participants: [{
        type: String, // Usernames
        required: true
    }],
    messages: [{
        sender: String,
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    lastMessage: {
        type: String,
        default: ""
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Chat", chatSchema);
