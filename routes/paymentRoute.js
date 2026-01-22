import express from "express";
import { createRazorpayPayment } from "../controllers/User/payment/razorpayController.js";
import { varifyRazorpaymet } from "../controllers/User/payment/varifyPayment.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayPayment);
router.post("/varify", verifyToken, varifyRazorpaymet);

export default router;
