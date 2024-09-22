import React, { useEffect } from 'react';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="homepage-container">
            <h2 className="title">List of All Events</h2>
            <div className="grid-container">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="no-events">
                        <p>No events at the moment</p>
                        <Link to="/create" className="create-link">
                            Create an event
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;