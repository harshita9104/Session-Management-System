const Session = require("../models/Session");

const sessionMiddleware = async (req, res, next) => {
  if (req.session.sessionId) {
    const session = await Session.findById(req.session.sessionId);
    if (session) {
      session.lastActivity = new Date();
      await session.save();
      req.squidSession = session;
    }
  }
  next();
};

module.exports = sessionMiddleware;
