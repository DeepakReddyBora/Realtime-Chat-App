import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

import { createServer } from "http";

import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// store online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  // store connected user
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // send online users to everyone
  io.emit(
    "getOnlineUsers",
    Object.keys(userSocketMap)
  );

  // realtime messages
  socket.on("sendMessage", (message) => {
    const receiverSocketId =
      userSocketMap[message.receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newMessage",
        message
      );
    }
  });

  // typing indicator
  socket.on(
    "typing",
    ({ receiverId, username }) => {
      const receiverSocketId =
        userSocketMap[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "typing",
          username
        );
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    delete userSocketMap[userId];

    // update online users
    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );
  });
});

connectDB();

// middleware
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});