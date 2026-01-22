import crypto from "crypto";
import { createOrder } from "../../Admin/Order/createOrder.js";

export const varifyRazorpaymet = (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      paymentMethod,
    } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.TEST_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Use paymentMethod from frontend (must be one of: COD, NETBANKING, UPI, CARD)
    if (paymentMethod) {
      req.body.paymentMethod = paymentMethod;
    }

    req.body.paymnetId = razorpay_payment_id;

    return createOrder(req, res);
  } catch (error) {
    console.error("Payment verification failed", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
