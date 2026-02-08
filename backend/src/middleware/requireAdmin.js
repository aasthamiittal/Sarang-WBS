/**
 * Restrict access to Admin role only. Use after auth middleware.
 * req.user.role must be the role name string (e.g. 'Admin').
 */
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required.' });
}

module.exports = requireAdmin;
