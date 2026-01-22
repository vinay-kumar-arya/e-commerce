import Razorpay from "razorpay";
const razorayInstance = new Razorpay({
  key_id: process.env.TEST_API_KEY,
  key_secret: process.env.TEST_KEY_SECRET,
});

export default razorayInstance;
