const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const odRoutes = require('./routes/od.routes');
const notificationRoutes = require('./routes/notification.routes');
const userDetailsRoutes = require('./routes/userDetails.routes');
const courseRoutes = require('./routes/course.routes');
const adminRoutes = require('./routes/admin.routes');

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration for allowed origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['https://srecodsite.onrender.com', 'http://localhost:5173'];

console.log('Configured allowed origins:', allowedOrigins);

// Middleware for CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

// Debugging CORS endpoint
app.get('/api/debug-cors', (req, res) => {
  res.json({
    message: 'CORS is working',
    allowedOrigins: allowedOrigins
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/od', odRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user-details', userDetailsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
