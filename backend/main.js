// backend/main.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

