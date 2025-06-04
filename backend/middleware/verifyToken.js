const jwt = require('jsonwebtoken');

function verifyToken(roleRequired) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(403).json({ message: 'Access token missing' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== roleRequired) {
        return res.status(403).json({ message: 'Forbidden: Invalid role' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

module.exports = verifyToken;
