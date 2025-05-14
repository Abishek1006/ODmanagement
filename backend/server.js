const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
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
connectDB();

const app = express();

// Middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

// / Allow all origins by not using CORS middleware
// Allow all origins by not using CORS middleware
app.use((req, res, next) => {
  // Handle undefined origin
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  
  // Only set credentials to true if we have a specific origin (not '*')
  if (origin !== '*') {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
