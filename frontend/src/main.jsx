import React from 'react'; 
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add basename for GitHub Pages
const basename = process.env.NODE_ENV === 'production' ? '/e-od-system' : '/';
