const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 45000
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  

module.exports = { connectDB };