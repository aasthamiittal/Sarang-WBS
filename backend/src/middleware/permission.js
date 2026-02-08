const { hasPermission } = require('../config/permissions');

/**
 * Middleware: require permission for module + action.
 * Use after auth. req.user.permissions must be set (from JWT).
 */
function checkPermission(module, action) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (hasPermission(req.user.permissions, module, action)) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
  };
}

module.exports = { checkPermission };
