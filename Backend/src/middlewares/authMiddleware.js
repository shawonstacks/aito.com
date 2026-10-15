// src/middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt');

// টোকেন ভেরিফাই করার মিডলওয়্যার
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, email }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

// নির্দিষ্ট রোল চেক করার মিডলওয়্যার (যেমন: শুধু VENDOR বা ADMIN)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };