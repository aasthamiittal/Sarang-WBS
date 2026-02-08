import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory2,
  ShoppingCart,
  Warehouse,
  AssignmentReturn,
  ShoppingBag,
  LocalShipping,
  Assessment,
  IntegrationInstructions,
  Settings,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const SIDEBAR_WIDTH = 260;

const menuItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon />, permission: { module: 'dashboard', action: 'view' } },
  {
    label: 'Inventory',
    icon: <Inventory2 />,
    children: [
      { path: '/inventory/products', label: 'Product / SKU Master', permission: { module: 'products', action: 'read' } },
      { path: '/inventory/stock-inward', label: 'Stock Purchase (Inward)', permission: { module: 'inventory', action: 'read' } },
      { path: '/inventory/current-stock', label: 'Current Stock', permission: { module: 'inventory', action: 'read' } },
      { path: '/inventory/stock-movement', label: 'Stock Movement', permission: { module: 'inventory', action: 'read' } },
      { path: '/inventory/stock-adjustment', label: 'Stock Adjustment', permission: { module: 'inventory', action: 'read' } },
      { path: '/inventory/low-stock', label: 'Low Stock Alerts', permission: { module: 'inventory', action: 'read' } },
    ],
  },
  {
    label: 'Orders',
    icon: <ShoppingCart />,
    children: [
      { path: '/orders/list', label: 'All Orders', permission: { module: 'orders', action: 'read' } },
      { path: '/orders/backorders', label: 'Backorders', permission: { module: 'orders', action: 'read' } },
      { path: '/orders/cancelled', label: 'Cancelled Orders', permission: { module: 'orders', action: 'read' } },
    ],
  },
  {
    label: 'Warehouse',
    icon: <Warehouse />,
    children: [
      { path: '/warehouse/picking', label: 'Picking List', permission: { module: 'warehouses', action: 'read' } },
      { path: '/warehouse/packing', label: 'Packing', permission: { module: 'warehouses', action: 'read' } },
      { path: '/warehouse/dispatch', label: 'Dispatch', permission: { module: 'warehouses', action: 'read' } },
      { path: '/warehouse/bins', label: 'Bin / Location Management', permission: { module: 'warehouses', action: 'read' } },
      { path: '/warehouse/transfer', label: 'Stock Transfer', permission: { module: 'warehouses', action: 'read' } },
      { path: '/warehouse/warehouses', label: 'Warehouses', permission: { module: 'warehouses', action: 'read' } },
    ],
  },
  {
    label: 'Returns',
    icon: <AssignmentReturn />,
    children: [
      { path: '/returns/list', label: 'Customer Returns', permission: { module: 'returns', action: 'read' } },
      { path: '/returns/rto', label: 'RTO Tracking', permission: { module: 'returns', action: 'read' } },
    ],
  },
  {
    label: 'Purchase & Planning',
    icon: <ShoppingBag />,
    children: [
      { path: '/purchase/orders', label: 'Purchase Orders', permission: { module: 'purchases', action: 'read' } },
      { path: '/purchase/suppliers', label: 'Suppliers', permission: { module: 'purchases', action: 'read' } },
      { path: '/purchase/forecast', label: 'Forecasted Demand', permission: { module: 'purchases', action: 'read' } },
      { path: '/purchase/reorder-levels', label: 'Reorder Levels', permission: { module: 'purchases', action: 'read' } },
    ],
  },
  {
    label: 'Shipping',
    icon: <LocalShipping />,
    children: [
      { path: '/shipping/tracking', label: 'Shipment Tracking', permission: { module: 'shipping', action: 'read' } },
      { path: '/shipping/delivery-status', label: 'Delivery Status', permission: { module: 'shipping', action: 'read' } },
    ],
  },
  {
    label: 'Reports',
    icon: <Assessment />,
    children: [
      { path: '/reports/inventory', label: 'Inventory Report', permission: { module: 'inventory_report', action: 'view' } },
      { path: '/reports/orders', label: 'Order & Dispatch Report', permission: { module: 'order_report', action: 'view' } },
      { path: '/reports/returns', label: 'Returns & RTO Report', permission: { module: 'returns_report', action: 'view' } },
    ],
  },
  {
    label: 'Integrations',
    icon: <IntegrationInstructions />,
    children: [{ path: '/integrations', label: 'Integrations', permission: { module: 'integrations', action: 'read' } }],
  },
  {
    label: 'Users & Settings',
    icon: <Settings />,
    adminOnly: true,
    children: [
      { path: '/users', label: 'User Management', permission: { module: 'users', action: 'read' }, adminOnly: true },
      { path: '/users/roles', label: 'Roles & Permissions', permission: { module: 'roles', action: 'read' }, adminOnly: true },
      { path: '/users/role-permissions', label: 'Role Permission Matrix', permission: { module: 'roles', action: 'write' }, adminOnly: true },
      { path: '/users/activity-logs', label: 'Activity Logs', permission: { module: 'activity_logs', action: 'read' }, adminOnly: true },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState({});
  const { hasPermission, isAdmin } = useAuth();

  const visibleMenuItems = useMemo(() => {
    return menuItems
      .map((item) => {
        if (item.children) {
          const visibleChildren = item.children.filter((c) => {
            if (c.adminOnly && !isAdmin) return false;
            return c.permission && hasPermission(c.permission.module, c.permission.action);
          });
          if (visibleChildren.length === 0) return null;
          if (item.adminOnly && !isAdmin) return null;
          return { ...item, children: visibleChildren };
        }
        if (item.adminOnly && !isAdmin) return null;
        if (item.permission && !hasPermission(item.permission.module, item.permission.action)) return null;
        return item;
      })
      .filter(Boolean);
  }, [hasPermission, isAdmin]);

  const toggleExpand = (label) => {
    setExpanded((p) => ({ ...p, [label]: !p[label] }));
  };

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const scrollbarHiddenSx = {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  };

  const drawer = (
    <Box sx={{ width: SIDEBAR_WIDTH, pt: 2, pb: 2, height: '100%', ...scrollbarHiddenSx }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, color: 'primary.main', fontWeight: 700 }}>
        WBS-Sarang
      </Typography>
      <List disablePadding>
        {visibleMenuItems.map((item) => {
          if (item.children) {
            const isOpen = expanded[item.label] ?? item.children.some((c) => isActive(c.path));
            return (
              <React.Fragment key={item.label}>
                <ListItemButton onClick={() => toggleExpand(item.label)}>
                  <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        sx={{ pl: 4 }}
                        selected={isActive(child.path)}
                        onClick={() => handleNav(child.path)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          return (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => handleNav(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  );
}

export { SIDEBAR_WIDTH };
