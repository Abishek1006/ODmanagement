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
const courseRoutes = require('./routes/course.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/od', odRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user-details', userDetailsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});