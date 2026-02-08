const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { normalizeRolePermissions } = require('../config/permissions');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wbs-sarang-secret');
    if (decoded.permissions != null) {
      req.user = {
        userId: decoded.userId,
        customerId: decoded.customerId,
        role: decoded.role,
        permissions: decoded.permissions,
      };
      return next();
    }
    const userId = decoded.userId || decoded.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Invalid token.' });
    const user = await User.findById(userId).populate('role');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User not found or inactive.' });
    req.user = {
      userId: user._id.toString(),
      customerId: user.customerId?.toString() || null,
      role: user.role?.name || 'User',
      permissions: normalizeRolePermissions(user.role),
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = auth;
