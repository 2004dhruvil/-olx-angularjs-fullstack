const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // Username of the receiver (Seller or Buyer)
        required: true,
    },
    sender: {
        type: String, // Username of the sender
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        default: null,
    },
    productName: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "message", // 'message' or 'reply'
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    replied: {
        type: Boolean,
        default: false,
    },
    replyMessage: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
