// src/routes/preferences.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { theme, notifications, language } = req.body;

    // Validate input
    if (!theme || !["light", "dark"].includes(theme)) {
      return res.status(400).json({ error: "Invalid theme" });
    }

    const preferences = { theme, notifications, language };

    // Save in cookie
    res.cookie("preferences", JSON.stringify(preferences), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", (req, res) => {
  try {
    // Get preferences from cookie
    const preferences = req.cookies.preferences
      ? JSON.parse(req.cookies.preferences)
      : { theme: "light", notifications: true, language: "English" };

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
