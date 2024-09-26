// backend/models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name_of_the_event: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    resource_person: {
        type: String,
        required: false
    },
    qrcode: {
        type: String,
        required: true
    }
}, {
    timestamps: true // createdAt, updatedAt
});

const Product = mongoose.model('Product', productSchema);
export default Product;
