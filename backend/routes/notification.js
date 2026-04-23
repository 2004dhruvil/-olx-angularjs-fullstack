const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET Notifications for a user
router.get("/:username", async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.params.username })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Notification (Send Message)
router.post("/", async (req, res) => {
    const { recipient, sender, message, productId, productName, type } = req.body;
    try {
        const newNotification = new Notification({
            recipient,
            sender,
            message,
            productId,
            productName,
            type
        });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// MARK AS READ
router.put("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// MARK AS REPLIED
router.put("/:id/reply", async (req, res) => {
    const { replyMessage } = req.body;
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.replied = true;
            notification.replyMessage = replyMessage;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE Notification
router.delete("/:id", async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
