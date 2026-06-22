import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { askQuestion, requireAiAccess } from "./ai.controller.js";

const router = express.Router();

router.post(
  "/ask/:repository_id",
  authenticate,
  requireAiAccess,
  askQuestion
);

export default router;
