// src/routes/session.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

router.post("/", async (req, res) => {
  try {
    const session = new Session({
      startTime: new Date(),
      pageVisits: [],
    });

    await session.save();
    req.session.sessionId = session._id;
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/page", async (req, res) => {
  try {
    if (!req.session.sessionId) {
      return res.status(400).json({ error: "No active session" });
    }

    const { page } = req.body;
    const session = await Session.findById(req.session.sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    session.pageVisits.push({ page, timestamp: new Date() });
    await session.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.session.sessionId) {
      return res.status(400).json({ error: "No active session" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const session = await Session.findById(req.session.sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const totalPages = Math.ceil(session.pageVisits.length / limit);
    const paginatedVisits = session.pageVisits.slice(skip, skip + limit);

    res.json({
      startTime: session.startTime,
      duration: new Date() - session.startTime,
      pageVisits: paginatedVisits,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
