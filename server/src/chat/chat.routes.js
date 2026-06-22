import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getChatMessages,
  requireChatAccess,
} from "./chat.controller.js";

const router = express.Router();

router.get(
  "/:repository_id/messages",
  authenticate,
  requireChatAccess,
  getChatMessages
);

export default router;
