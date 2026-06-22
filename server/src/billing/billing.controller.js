import pool from "../database/db.js";
import { getProAmountPaise } from "./plans.config.js";
import {
  createRazorpayOrder,
  isRazorpayAuthError,
  verifyRazorpaySignature,
} from "./razorpay.service.js";
import {
  getPlanStatus,
  upgradeUserToPro,
} from "./subscription.service.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    let amount;

    try {
      amount = getProAmountPaise();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 100 paise",
      });
    }

    const receipt = `pro_${userId}_${Date.now()}`;

    let order;
    try {
      order = await createRazorpayOrder({
        amount,
        currency: "INR",
        receipt,
      });
    } catch (error) {
      console.error(error);

      if (isRazorpayAuthError(error)) {
        return res.status(401).json({
          success: false,
          message: "Razorpay authentication failed",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create payment order",
      });
    }

    await pool.query(
      `
      INSERT INTO payments (
        user_id,
        razorpay_order_id,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, $4, 'created')
      `,
      [userId, order.id, order.amount, order.currency]
    );

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
    } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const paymentResult = await pool.query(
      `
      SELECT *
      FROM payments
      WHERE razorpay_order_id = $1 AND user_id = $2
      `,
      [orderId, userId]
    );

    const payment = paymentResult.rows[0];

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment order not found",
      });
    }

    if (payment.status === "paid") {
      const planStatus = await getPlanStatus(userId);
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        plan: planStatus,
      });
    }

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    await pool.query(
      `
      UPDATE payments
      SET
        razorpay_payment_id = $1,
        status = 'paid',
        verified_at = NOW()
      WHERE id = $2
      `,
      [paymentId, payment.id]
    );

    await upgradeUserToPro(userId);

    const planStatus = await getPlanStatus(userId);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      plan: planStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

export const getPlan = async (req, res) => {
  try {
    const planStatus = await getPlanStatus(req.user.userId);

    return res.status(200).json({
      success: true,
      ...planStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan status",
    });
  }
};
