import razorpay from "../../../utils/razorPay.js";
import Cart from "../../../models/Cart.js";

export const createRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user?._id || req.user;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const amount = Math.round(cart.grandTotalPrice * 100); //convert rupees to paise
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.TEST_API_KEY,
    });
  } catch (error) {
    console.error("Razorpay order error", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
