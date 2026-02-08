/**
 * Frontend permission module/action list. Keep in sync with backend config.
 * Used for Sidebar visibility and ProtectedRoute.
 */
export const MODULES = {
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

export function hasPermission(permissions, module, action) {
  return permissions?.[module]?.[action] === true;
}
