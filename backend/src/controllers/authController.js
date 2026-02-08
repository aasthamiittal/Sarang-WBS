const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { normalizeRolePermissions, getDefaultPermissions } = require('../config/permissions');

const JWT_SECRET = process.env.JWT_SECRET || 'wbs-sarang-secret';

function buildTokenPayload(user) {
  const roleName = user.role?.name || 'User';
  const permissions = normalizeRolePermissions(user.role);
  return {
    userId: user._id.toString(),
    customerId: user.customerId?.toString() || null,
    role: roleName,
    permissions,
  };
}

function generateToken(user) {
  const payload = buildTokenPayload(user);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }
    const user = await User.findOne({ email, deletedAt: null }).select('+password').populate('role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const passwordValid = await user.comparePassword(password);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is disabled.' });
    }
    if (!user.customerId) {
      return res.status(403).json({ success: false, message: 'User has no tenant. Contact admin to assign customer.' });
    }
    let permissions;
    try {
      permissions = normalizeRolePermissions(user.role);
    } catch (e) {
      permissions = getDefaultPermissions();
    }
    const token = generateToken(user);
    try {
      await ActivityLog.create({ user: user._id, action: 'login', module: 'auth' });
    } catch (e) {
      // don't fail login if activity log fails
    }
    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        customerId: user.customerId.toString(),
        role: user.role ? { _id: user.role._id.toString(), name: user.role.name } : null,
        permissions,
      },
    });
  } catch (err) {
    next(err);
  }
};
