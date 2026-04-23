const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

async function generatePDFBuffer(order, productDetails) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Draw PDF
            doc.fontSize(20).text("Order Confirmation Receipt", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Order ID: ${order._id}`);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
            doc.moveDown();
            
            doc.fontSize(14).text("Customer Details", { underline: true });
            // Extracting username from buyer field
            doc.fontSize(12).text(`User Name: ${order.buyer || order.shippingAddress.name || 'N/A'}`);
            doc.text(`Email: ${order.shippingAddress.email || 'N/A'}`);
            doc.text(`Address: ${order.shippingAddress.address || 'N/A'}`);
            doc.moveDown();

            doc.fontSize(14).text("Order Details", { underline: true });
            if (productDetails && productDetails.title) {
                doc.fontSize(12).text(`Product Name: ${productDetails.title}`);
            } else if (productDetails && productDetails.name) {
                doc.fontSize(12).text(`Product Name: ${productDetails.name}`);
            } else {
                doc.fontSize(12).text(`Product ID: ${order.product}`);
            }
            doc.text(`Price: ${order.price}`);
            doc.text(`Payment Method: ${order.paymentMethod}`);
            
            doc.moveDown(2);
            doc.fontSize(10).text("Thank you for shopping with us! Please keep this receipt for your records.", { align: "center" });
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

async function sendOrderConfirmationEmail(order, productDetails) {
    try {
        if (!order.shippingAddress || !order.shippingAddress.email) {
            console.log("No email provided in order, skipping email confirmation.");
            return;
        }

        const pdfBuffer = await generatePDFBuffer(order, productDetails);

        // 🚨 UPDATE WITH YOUR GMAIL CREDENTIALS
        // You cannot use your normal password, you MUST generate an "App Password" from your Google Account.
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'djdesai207@gmail.com',
                pass: 'asdyeigdqwyvvuvt' 
            },
        });

        const toEmail = order.shippingAddress.email;

        let info = await transporter.sendMail({
            from: '"OLX Shop" <noreply@olxshop.test>', // sender address
            to: toEmail, // list of receivers
            subject: "Your Order Confirmation - " + order._id, // Subject line
            text: "Hello! Thank you for your order. Please find your PDF confirmation attached.", // plain text body
            html: "<b>Hello!</b><br><br>Thank you for your order at OLX Shop. Please find your PDF confirmation attached.<br><br>Have a great day!", // html body
            attachments: [
                {
                    filename: 'receipt_' + order._id + '.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        console.log("Confirmation Email sent: %s", info.messageId);
        console.log("Preview Confirmation PDF URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        console.error("Failed to send email confirmation:", error);
    }
}

module.exports = { sendOrderConfirmationEmail };
