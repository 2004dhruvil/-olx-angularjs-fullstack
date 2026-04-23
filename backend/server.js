const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");


const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/Chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join a specific room (usually the username)
  socket.on("join", (username) => {
    socket.join(username);
    console.log(`User ${username} joined room ${username}`);
  });

  // Send Message
  socket.on("sendMessage", async (data) => {
    const { sender, recipient, message } = data;

    // 1. Emit to Recipient (Real-time)
    io.to(recipient).emit("receiveMessage", data);

    // 2. Save to Database
    try {
      // Find chat between these two
      let chat = await Chat.findOne({
        participants: { $all: [sender, recipient] }
      });

      if (!chat) {
        chat = new Chat({
          participants: [sender, recipient],
          messages: []
        });
      }

      chat.messages.push({ sender, text: message });
      chat.lastMessage = message;
      chat.updatedAt = Date.now();
      await chat.save();

    } catch (err) {
      console.error("Error saving chat:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", require("./routes/chat"));
app.use("/api/captcha", require("./routes/captcha"));

// images
app.use("/uploads", express.static("uploads"));

server.listen(5000, () => {
  console.log("Server running on 5000");
});
