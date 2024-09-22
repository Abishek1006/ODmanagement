import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import './CreatePage.css';

function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name_of_the_event: "",
    price: "",
    image: "",
    description: "",
    time: "",
    date: "",
    venue: "",
    resource_person: "",
    qrcode: ""
  });
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      alert("Error: " + message);
    } else {
      alert("Product created successfully");
    }
    setNewProduct({
      name_of_the_event: "",
      price: "",
      image: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      resource_person: "",
      qrcode: ""
    });
  };

  return (
    <div className="create-page-container">
      <h1 className="title">Create New Event</h1>
      <div className="form-container">
        <form className="event-form">
          <input 
            type="text" 
            name="name_of_the_event" 
            placeholder="Event Name" 
            value={newProduct.name_of_the_event}
            className="input-field"
            required 
            onChange={(e) => setNewProduct({ ...newProduct, name_of_the_event: e.target.value })}
          />

          <input 
            type="text" 
            name="price" 
            placeholder="Price" 
            value={newProduct.price}
            className="input-field"
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />

          <input 
            type="text" 
            name="image" 
            placeholder="Image URL" 
            value={newProduct.image}
            className="input-field"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />

          <input 
            type="text" 
            name="time" 
            placeholder="Time" 
            value={newProduct.time}
            className="input-field"
            onChange={(e) => setNewProduct({ ...newProduct, time: e.target.value })}
          />

          <input 
            type="text" 
            name="date" 
            placeholder="Date" 
            value={newProduct.date}
            className="input-field"
            onChange={(e) => setNewProduct({ ...newProduct, date: e.target.value })}
          />

          <input 
            type="text" 
            name="venue" 
            placeholder="Venue" 
            value={newProduct.venue}
            className="input-field"
            required
            onChange={(e) => setNewProduct({ ...newProduct, venue: e.target.value })}
          />

          <input 
            type="text" 
            name="resource_person" 
            placeholder="Resource Person (Optional)" 
            value={newProduct.resource_person}
            className="input-field"
            onChange={(e) => setNewProduct({ ...newProduct, resource_person: e.target.value })}
          />

          <input 
            type="text" 
            name="qrcode" 
            placeholder="QR Code URL" 
            value={newProduct.qrcode}
            className="input-field"
            required
            onChange={(e) => setNewProduct({ ...newProduct, qrcode: e.target.value })}
          />
          
          <input 
            type="text" 
            name="description" 
            placeholder="QR Code URL" 
            value={newProduct.description}
            className="input-field"
            required
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />


          <button className="submit-btn" type="button" onClick={handleAddProduct}>
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
