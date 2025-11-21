// backend_node/middleware/requireManager.js

module.exports = function requireManager(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== "manager" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Manager token required" });
    }

    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
