const mongoose = require('mongoose');
// Set strictQuery to false to avoid deprecation warnings
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 100,  // Maximum number of sockets
      minPoolSize: 10,   // Minimum number of sockets
      socketTimeoutMS: 45000,  // Time before a socket is considered idle
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Full error details:', error);
    // Retry connection logic (optional)
    console.log('Retrying MongoDB connection...');
    setTimeout(connectDB, 5000);  // Retry after 5 seconds
    // Exit the process if the connection fails
    process.exit(1);
  }
};

module.exports = { connectDB };
