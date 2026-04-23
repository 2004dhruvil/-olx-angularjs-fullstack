const mongoose = require("mongoose");
const Notification = require("./models/Notification");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/olx-clone")
    .then(async () => {
        console.log("Connected to DB");

        console.log("\n--- INFO ---");
        const notifications = await Notification.find();
        console.log("TOTAL NOTIFICATIONS:", notifications.length);
        console.log(JSON.stringify(notifications, null, 2));

        const products = await Product.find({}, 'title seller');
        console.log("\n--- PRODUCTS ---");
        console.log(JSON.stringify(products, null, 2));

        const usersConnection = mongoose.connection.collection("users");
        const users = await usersConnection.find().toArray();
        console.log("\n--- USERS ---");
        console.log(JSON.stringify(users, null, 2));

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
