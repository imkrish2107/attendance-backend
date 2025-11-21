const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header) return res.status(401).json({ error: 'No token' });

      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // role-based access
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Not allowed' });
      }

      req.user = decoded; // attach user info
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
