import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useProductStore } from '../store/product';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [updatedProduct, setUpdateProduct] = useState(product);
    const { deleteProduct, updateProduct } = useProductStore();
    const [isEditing, setIsEditing] = useState(false);

    // Function to handle update product
    const handleUpdateProduct = async (productId, updatedData) => {
        const response = await updateProduct(productId, updatedData); // Call the update function from zustand store
        if (response.success) {
            // If update is successful, close the edit form
            setIsEditing(false);
        } else {
            alert("Failed to update product: " + response.message);
        }
    };

    return (
        <div className="product-card">
            <h2 className="product-title">{product.name_of_the_event}</h2>
            <div>
                <img src={product.image} alt={product.name_of_the_event} className="product-image" />
            </div>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-date">Date: {product.date}</p>
            <p className="product-time">Time: {product.time}</p>
            <p className="product-venue">Venue: {product.venue}</p>
            {product.resource_person && <p className="product-resource-person">Resource Person: {product.resource_person}</p>}
            <div>
                <img src={product.qrcode} alt="QR Code" className="qr-code" />
            </div>

            <div className="icon-container">
                {/* Delete button with direct deleteProduct call */}
                <MdDelete onClick={() => deleteProduct(product._id)} className="delete-icon" size={24} />
                <CiEdit onClick={() => setIsEditing(!isEditing)} className="edit-icon" size={24} />
            </div>

            {isEditing && (
                <div className="edit-container">
                    {/* Form to edit product */}
                    <input
                        type="text"
                        name='name_of_the_event'
                        placeholder='Name of the event'
                        value={updatedProduct.name_of_the_event}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, name_of_the_event: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder='Price of the event'
                        name='price'
                        value={updatedProduct.price}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, price: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name='image'
                        placeholder='Event Image URL'
                        value={updatedProduct.image}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, image: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name='qrcode'
                        placeholder='QR Code Image URL'
                        value={updatedProduct.qrcode}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, qrcode: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name='time'
                        placeholder='Time'
                        value={updatedProduct.time}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, time: e.target.value })}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder='Date'
                        name='date'
                        value={updatedProduct.date}
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, date: e.target.value })}
                        className="input-field"
                    />
                    <textarea
                        placeholder='Description of the event'
                        value={updatedProduct.description}
                        name='description'
                        onChange={(e) => setUpdateProduct({ ...updatedProduct, description: e.target.value })}
                        className="input-field"
                    />
                    <div className="button-container">
                        {/* Use handleUpdateProduct function */}
                        <button onClick={() => handleUpdateProduct(product._id, updatedProduct)} className="update-button">
                            Update
                        </button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
