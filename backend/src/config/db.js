const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WBS-Sarang', {
      // useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
    });
    console.log(`MongoDB connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
