// authMiddleware.js
// Authentication middleware for dashboard routes
// Extracts JWT token from Authorization header and verifies it

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Extract token from Authorization header
  // Format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // [0] = "Bearer", [1] = token

  if (!token) {
    return res.status(401).json({ 
      error: 'Access Denied',
      message: 'No authentication token provided. Please log in again.' 
    });
  }

  // Verify token using JWT_SECRET from environment or default 'secret'
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Access Denied',
        message: 'Invalid or expired token. Please log in again.' 
      });
    }
    
    // Token is valid, attach user info to request
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
