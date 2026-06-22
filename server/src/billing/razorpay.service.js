import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayClient = null;

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayClient;
}

export async function createRazorpayOrder({ amount, currency = "INR", receipt }) {
  const client = getRazorpayClient();

  return client.orders.create({
    amount,
    currency,
    receipt,
  });
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

export function isRazorpayAuthError(error) {
  return error?.statusCode === 401 || error?.error?.code === "BAD_REQUEST_ERROR";
}
