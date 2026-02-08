/**
 * Multi-tenant isolation: enforce customerId from JWT.
 * Must run after auth. Sets req.tenantId for use in all queries.
 * Backend is source of truth; every API must pass this for business routes.
 */
function enforceTenant(req, res, next) {
  const customerId = req.user?.customerId;
  if (!customerId) {
    return res.status(403).json({
      success: false,
      message: 'Tenant context required. No customerId in token.',
    });
  }
  req.tenantId = customerId;
  next();
}

module.exports = enforceTenant;
