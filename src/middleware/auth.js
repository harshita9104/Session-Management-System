const auth = (req, res, next) => {
  // Simplified auth middleware
  req.user = req.session.user || null;
  next();
};

module.exports = auth;
