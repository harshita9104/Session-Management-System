const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  preferences: {
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "English" },
  },
});

module.exports = mongoose.model("User", userSchema);
