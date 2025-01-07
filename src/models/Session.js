const mongoose = require("mongoose");

const pageVisitSchema = new mongoose.Schema({
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  pageVisits: [pageVisitSchema],
});

module.exports = mongoose.model("Session", sessionSchema);
