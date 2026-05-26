import express from "express";

import protectRoute from "../middleware/protectRoute.js";

import {
  getUsers,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;