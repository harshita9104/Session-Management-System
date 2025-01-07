require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB!");
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    // Close the connection after testing
    await mongoose.connection.close();
  }
}

testConnection();
