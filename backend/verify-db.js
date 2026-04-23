const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

// Output nicely formatted JSON
const printData = (label, data) => {
    console.log(`\n=== ${label} (${data.length}) ===`);
    if (data.length > 0) {
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log("No data found.");
    }
};

const verify = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/olx-clone");
        console.log(`Connected: ${conn.connection.host}`);

        const users = await User.find().select("-password");
        printData("USERS", users);

        const products = await Product.find();
        printData("PRODUCTS", products);

        const orders = await Order.find();
        printData("ORDERS", orders);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

verify();
