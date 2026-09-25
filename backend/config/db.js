// MongoDB Database Connection Configuration for CASEVAULT
// Strictly configured via process.env.MONGO_URI - NO HARDCODED VALUES

const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = (process.env.MONGO_URI || "").trim();
  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing in backend/.env. Please configure MONGO_URI.");
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    return null;
  }
};

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isMongoConnected
};
