// backend/controllers/product.Controller.js
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Fetch all products (events)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new product (event)
export const createProduct = async (req, res) => {
    const product = req.body; // User will send this data

    // if (!product.name_of_the_event || !product.time || !product.date || !product.description || !product.image) {
    //     return res.status(400).json({ success: false, message: "Please provide all the required details." });
    // }

    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creating product: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete a product (event)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(201).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.log("Error in deleting product: ", error.message);
        res.status(404).json({ success: false, message: "Product not found" });
    }
};

// Update a product (event)
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const product = req.body;
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.log("Error in updating product: ", error.message);
        res.status(500).json({ success: false, message: "Server error, error updating product" });
    }
};
