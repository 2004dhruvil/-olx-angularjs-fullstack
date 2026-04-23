const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

const axios = require("axios");

// CREATE ORDER
router.post("/", async (req, res) => {
    try {
        const { productId, buyer, seller, price, shippingAddress, captchaToken, textCaptchaInput, expectedCaptchaText, paymentMethod } = req.body;

        // 1. Verify reCAPTCHA
        if (!captchaToken) {
            return res.status(400).json({ message: "reCAPTCHA token is missing" });
        }

        const secretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Public test secret key
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

        const response = await axios.post(verifyUrl);
        if (!response.data.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed" });
        }

        // 2. Verify Text CAPTCHA (Letters)
        if (!textCaptchaInput || !expectedCaptchaText) {
            return res.status(400).json({ message: "Character CAPTCHA is missing" });
        }

        if (textCaptchaInput.toLowerCase() !== expectedCaptchaText.toLowerCase()) {
            return res.status(400).json({ message: "Incorrect letters entered" });
        }

        const newOrder = new Order({
            product: productId,
            buyer,
            seller,
            price,
            shippingAddress,
            paymentMethod: paymentMethod || "COD",
            status: "confirmed"
        });

        await newOrder.save();

        // Mark product as sold
        const updatedProduct = await Product.findByIdAndUpdate(productId, { status: "sold" }, { new: true });

        // Generate and send PDF confirmation email
        const { sendOrderConfirmationEmail } = require('../utils/emailService');
        // Do not `await` to avoid blocking the client response. It will log to backend console.
        sendOrderConfirmationEmail(newOrder, updatedProduct).catch(console.error);

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: "Error placing order", error: err.message });
    }
});

// GET ORDERS (For a specific user - buyer)
router.get("/my-orders", async (req, res) => {
    try {
        const username = req.query.user;
        const orders = await Order.find({ buyer: username }).populate("product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
});

// GET ALL ORDERS (For Admin)
router.get("/", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // Ensure endDate includes the entire day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const orders = await Order.find(query).populate("product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order && order.product) {
            // Restore product status to available so others can buy it
            await Product.findByIdAndUpdate(order.product, { status: "available" });
        }
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting order", error: err.message });
    }
});

module.exports = router;
