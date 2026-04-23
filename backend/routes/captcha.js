const express = require("express");
const router = express.Router();
const svgCaptcha = require("svg-captcha");

// Generate CAPTCHA
router.get("/generate", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6, // 6 characters
    noise: 3, // some noise lines
    color: true,
    background: "#f1f5f9"
  });

  // In a real app, you'd save this to a session or database
  // For this demo, we'll send a simple hash/encrypted version or just the text
  // NOTE: Sending the text directly is NOT secure, but for this demo we'll use a simple "key" approach
  
  res.json({
    data: captcha.data, // SVG string
    text: captcha.text  // In production, this should BE HASHED or stored in session
  });
});

module.exports = router;
