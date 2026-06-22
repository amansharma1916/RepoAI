import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createOrder, getPlan, verifyPayment } from "./billing.controller.js";

const router = express.Router();

router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.get("/plan", authenticate, getPlan);

export default router;
