const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/olx-clone")
    .then(async () => {
        console.log("Connected to DB");

        const products = await Product.find();
        let fixedCount = 0;

        for (const product of products) {
            if (product.seller && product.seller.startsWith('"') && product.seller.endsWith('"')) {
                try {
                    const cleanedSeller = JSON.parse(product.seller);
                    console.log(`Fixing seller for product "${product.title}": ${product.seller} -> ${cleanedSeller}`);
                    product.seller = cleanedSeller;
                    await product.save();
                    fixedCount++;
                } catch (e) {
                    // If parse fails, it might just have literal quotes
                    const cleanedSeller = product.seller.slice(1, -1);
                     console.log(`Fixing seller (slice) for product "${product.title}": ${product.seller} -> ${cleanedSeller}`);
                    product.seller = cleanedSeller;
                    await product.save();
                    fixedCount++;
                }
            }
        }

        console.log(`\nDONE. Fixed ${fixedCount} products.`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
