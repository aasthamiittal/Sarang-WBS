/**
 * Permission modules and actions. Aligns with frontend Role Permission Matrix.
 * Report-style: view, download. Entity-style: read, write.
 */
const MODULES = {
  dashboard: { actions: ['view'], label: 'Dashboard' },
  inventory_report: { actions: ['view', 'download'], label: 'Inventory Report' },
  stock_report: { actions: ['view', 'download'], label: 'Stock Report' },
  order_report: { actions: ['view', 'download'], label: 'Order & Dispatch Report' },
  returns_report: { actions: ['view', 'download'], label: 'Returns & RTO Report' },
  users: { actions: ['read', 'write'], label: 'Users' },
  roles: { actions: ['read', 'write'], label: 'Roles' },
  activity_logs: { actions: ['read'], label: 'Activity Logs' },
  products: { actions: ['read', 'write'], label: 'Products' },
  inventory: { actions: ['read', 'write'], label: 'Inventory' },
  orders: { actions: ['read', 'write'], label: 'Orders' },
  warehouses: { actions: ['read', 'write'], label: 'Warehouses' },
  returns: { actions: ['read', 'write'], label: 'Returns' },
  purchases: { actions: ['read', 'write'], label: 'Purchases' },
  shipping: { actions: ['read', 'write'], label: 'Shipping' },
  suppliers: { actions: ['read', 'write'], label: 'Suppliers' },
  integrations: { actions: ['read', 'write'], label: 'Integrations' },
};

/** Default permissions: view/read only (safe); download/write false. */
function getDefaultPermissions() {
  const perms = {};
  Object.keys(MODULES).forEach((module) => {
    perms[module] = {};
    MODULES[module].actions.forEach((action) => {
      perms[module][action] = action === 'view' || action === 'read';
    });
  });
  return perms;
}

/** Full access: all true (Admin). */
function getFullPermissions() {
  const perms = {};
  Object.keys(MODULES).forEach((module) => {
    perms[module] = {};
    MODULES[module].actions.forEach((action) => {
      perms[module][action] = true;
    });
  });
  return perms;
}

/**
 * Normalize role.permissions to structured object.
 * Accepts: (1) new format { module: { action: bool } }, (2) old format [string], (3) missing → default view/read only.
 */
function normalizeRolePermissions(role) {
  if (!role) return getDefaultPermissions();
  const perms = role.permissions;
  if (perms && typeof perms === 'object' && !Array.isArray(perms)) {
    const merged = getDefaultPermissions();
    Object.keys(merged).forEach((module) => {
      if (perms[module] && typeof perms[module] === 'object') {
        MODULES[module].actions.forEach((action) => {
          if (typeof perms[module][action] === 'boolean') {
            merged[module][action] = perms[module][action];
          }
        });
      }
    });
    return merged;
  }
  if (role.name === 'Admin') return getFullPermissions();
  return getDefaultPermissions();
}

function hasPermission(permissions, module, action) {
  return permissions?.[module]?.[action] === true;
}

module.exports = {
  MODULES,
  getDefaultPermissions,
  getFullPermissions,
  normalizeRolePermissions,
  hasPermission,
};
