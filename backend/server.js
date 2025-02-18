//backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const odRoutes = require('./routes/od.routes');
const notificationRoutes = require('./routes/notification.routes');
const userDetailsRoutes = require('./routes/userDetails.routes');
const courseRoutes = require('./routes/course.routes'); // Add this line

const adminRoutes = require('./routes/admin.routes');


dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/od', odRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user-details', userDetailsRoutes);
app.use('/api/courses', courseRoutes); 

const path = require('path');

// Add this line with your other route declarations
app.use('/api/admin', adminRoutes);
// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);
// Add this before your routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Add this after all your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




