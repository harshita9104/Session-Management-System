const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI); // Add this line to debug
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
