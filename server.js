import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import uploadsRouter from "./routes/carouselRoutes.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import graphRouter from "./routes/graphRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", uploadsRouter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/category", categoryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/graph", graphRouter);
app.use("/api/payment", paymentRoute);

const port = process.env.PORT || 3000;
connectDB();
app.listen(port, () => {
  console.log(`Server Starts at ${port}`);
});
