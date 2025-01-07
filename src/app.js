require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const auth = require("./middleware/auth");
const sessionMiddleware = require("./middleware/session");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
connectDB();

// MongoDB connection logging
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "uljT0tpaNL",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 30 * 60, // 30 minutes
      autoRemove: "native",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 minutes
      sameSite: "lax",
    },
  })
);

// Session logging middleware
app.use((req, res, next) => {
  console.log("Session ID:", req.session.id);
  next();
});

app.use(auth);
app.use(sessionMiddleware);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", mongodb: mongoose.connection.readyState === 1 });
});

// Routes
app.use("/preferences", require("./routes/preferences"));
app.use("/session", require("./routes/session"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for testing
