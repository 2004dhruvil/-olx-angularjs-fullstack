# OLX Clone - Full-Stack Web Application

A full-stack, real-time classified advertisements web application inspired by OLX. This project allows users to buy and sell products, communicate in real-time, and manage their orders through a responsive and dynamic interface.

## 🚀 Features

- **User Authentication**: Secure login and registration for standard users, sellers, and administrators.
- **Product Management**: 
  - Sellers can easily add, edit, and delete product listings.
  - Users can browse products, view details, and place orders.
  - Image uploading supported for product showcases.
- **Real-Time Chat**: Integrated chat system allowing buyers and sellers to communicate instantly.
- **Order Management**: Users can track their orders, while sellers and admins manage the overall order lifecycle.
- **PDF Generation**: Automatically generates downloadable PDF receipts/invoices for orders.
- **Notifications & Emails**: Real-time app notifications and email alerts (order updates, registration confirmations).
- **Security**: Built-in bot protection using CAPTCHA (SVG Captcha & Google reCAPTCHA).

## 🛠️ Tech Stack

**Frontend:**
- [AngularJS](https://angularjs.org/) (v1.8.x) - Frontend framework
- [Bootstrap 5](https://getbootstrap.com/) - UI & Responsive styling
- [Socket.io Client](https://socket.io/) - Real-time client communication
- FontAwesome & Google Fonts

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Server environment and web framework
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - NoSQL Database and ODM
- [Socket.io](https://socket.io/) - Real-time server communication
- [Multer](https://github.com/expressjs/multer) - Handling file/image uploads
- [Nodemailer](https://nodemailer.com/) - Email sending
- [PDFKit](https://pdfkit.org/) - PDF document generation

## 📁 Project Structure

```text
olx-angularjs-fullstack/
├── backend/               # Node.js Express server
│   ├── config/            # Database and environment configurations
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/            # API endpoints (auth, product, chat, order, etc.)
│   ├── utils/             # Utility functions (email, pdf generation)
│   └── server.js          # Entry point for the backend
├── frontend/              # AngularJS application
│   ├── controllers/       # Angular controllers for views
│   ├── directives/        # Custom Angular directives
│   ├── services/          # API integration services
│   ├── views/             # HTML templates and UI views
│   ├── app.js             # Angular module initialization
│   ├── routes.js          # Angular frontend routing
│   └── index.html         # Main entry point for the frontend
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally or a MongoDB Atlas URI.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/olx-angularjs-fullstack.git
cd olx-angularjs-fullstack
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
*Create a `.env` file in the `backend` directory and configure your environment variables (e.g., MongoDB URI, JWT Secret, Email credentials, Port).*
```bash
npm start
```
*The backend server will start running (default is usually port 3000 or 5000).*

### 3. Setup the Frontend
Since it's an AngularJS application, it can be served using a simple static server like `http-server` or VS Code Live Server. If the backend is set up to serve static files from the frontend folder, simply navigating to your server's root URL will work.

Alternatively, you can run a simple server inside the `frontend` folder:
```bash
cd frontend
npx http-server
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](../../issues).

## 📝 License

This project is licensed under the ISC License.
