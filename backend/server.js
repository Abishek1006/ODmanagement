const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errormiddleware');
const odRoutes = require('./routes/od.routes');

dotenv.config();

// Connect to MongoDB
connectDB();




// Import Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');



// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Other route imports...
app.use('/api/od', odRoutes);
// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
