const mongoose = require('mongoose');

// A database problem must not crash the server: the generator keeps working,
// history is simply unavailable until MongoDB connects.
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codeforge';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed (history disabled):', err.message);
  }
};

const isDbReady = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isDbReady };
