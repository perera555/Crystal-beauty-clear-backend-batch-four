import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRouter.js";
import verifyJWT from "./middleware/auth.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to Database"))
  .catch(() => console.log("❌ DB Connection Failed"));

// ✅ PUBLIC ROUTES
app.use("/api/users", userRouter);

// ✅ PROTECTED ROUTES
app.use("/api/product", verifyJWT, productRouter);
app.use("/api/order", verifyJWT, orderRouter);
app.use("/api/reviews", verifyJWT, reviewRouter);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});