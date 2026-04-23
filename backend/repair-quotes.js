const mongoose = require("mongoose");
const Notification = require("./models/Notification");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/olx-clone")
    .then(async () => {
        console.log("Connected to DB for Repair");

        // 1. Repair Products
        const products = await Product.find();
        let pCount = 0;
        for (const p of products) {
            let changed = false;
            // Check and clean seller
            if (p.seller && p.seller.startsWith('"') && p.seller.endsWith('"')) {
                p.seller = p.seller.slice(1, -1);
                changed = true;
            }
            if (changed) {
                await p.save();
                pCount++;
            }
        }
        console.log(`Repaired ${pCount} Products`);

        // 2. Repair Notifications
        const notifications = await Notification.find();
        let nCount = 0;
        for (const n of notifications) {
            let changed = false;
            // Clean recipient
            if (n.recipient && n.recipient.startsWith('"') && n.recipient.endsWith('"')) {
                n.recipient = n.recipient.slice(1, -1);
                changed = true;
            }
            // Clean sender
            if (n.sender && n.sender.startsWith('"') && n.sender.endsWith('"')) {
                n.sender = n.sender.slice(1, -1);
                changed = true;
            }

            if (changed) {
                await n.save();
                nCount++;
            }
        }
        console.log(`Repaired ${nCount} Notifications`);

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
