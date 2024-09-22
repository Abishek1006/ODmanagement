
import express from "express";
import dotenv from "dotenv";  // Correct import for dotenv
import { connectDB } from "./config/db.js";
import ProductRoutes from "./routes/product.route.js";

dotenv.config();  // Load the .env file

const port = process.env.PORT || 5000;
const app = express();  // Initialize express app

app.use(express.json());  // Use express.json() middleware for parsing JSON

// Basic route
// Log the MongoDB URI from environment variables
console.log(process.env.MONGO_URI);

app.use("/api/products", ProductRoutes);  // Correct route path

// Start the server
app.listen(port, () => {
    connectDB();  // Ensure the database is connected
    console.log(`Server is listening on port ${port}`);
});
