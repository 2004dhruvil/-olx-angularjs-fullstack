const { sendOrderConfirmationEmail } = require('./utils/emailService');

const mockOrder = {
    _id: "test-order-12345",
    product: "64a2b3c4d5e6f7a8b9c0d1e2",
    price: 99.99,
    paymentMethod: "Online",
    createdAt: new Date(),
    shippingAddress: {
        name: "Test User",
        email: "djdesai207@gmail.com",
        phone: "123-456-7890",
        address: "123 Test St, Test City, 12345"
    }
};

const mockProduct = { title: "Test Awesome Product" };

console.log("Starting email test...");
sendOrderConfirmationEmail(mockOrder, mockProduct)
    .then(() => {
        console.log("Email test script execution completed. Waiting for async promises...");
    })
    .catch((err) => {
        console.error("Email test script failed:", err);
        process.exit(1);
    });
