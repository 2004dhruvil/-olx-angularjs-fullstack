const express = require("express");
const multer = require("multer");
const router = express.Router();
const Product = require("../models/Product");

const upload = multer({ dest: "uploads/" });

// CREATE PRODUCT
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    console.log("BACKEND RECEIVED:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageFilenames = req.files.map(file => file.filename);

    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      images: imageFilenames,
      category: req.body.category,
      seller: req.body.seller,
      status: "available",
      createdAt: Date.now()
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// UPDATE PRODUCT
router.put("/:id", upload.array("images", 3), async (req, res) => {
  try {
    console.log("UPDATE REQUEST RECEIVED for ID:", req.params.id);

    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedImages = existingProduct.images;
    if (req.files && req.files.length > 0) {
      updatedImages = req.files.map(file => file.filename);
    }

    // Construct update data
    const updateData = {
      title: req.body.title || existingProduct.title,
      price: req.body.price || existingProduct.price,
      description: req.body.description || existingProduct.description,
      category: req.body.category || existingProduct.category,
      images: updatedImages
    };

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    console.log("Product updated successfully:", updatedProduct);
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
