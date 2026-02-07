import React, { useState } from 'react';
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

const SIDEBAR_WIDTH = 260;

const menuItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  {
    label: 'Inventory',
    icon: <Inventory2 />,
    children: [
      { path: '/inventory/products', label: 'Product / SKU Master' },
      { path: '/inventory/stock-inward', label: 'Stock Purchase (Inward)' },
      { path: '/inventory/current-stock', label: 'Current Stock' },
      { path: '/inventory/stock-movement', label: 'Stock Movement' },
      { path: '/inventory/stock-adjustment', label: 'Stock Adjustment' },
      { path: '/inventory/low-stock', label: 'Low Stock Alerts' },
    ],
  },
  {
    label: 'Orders',
    icon: <ShoppingCart />,
    children: [
      { path: '/orders/list', label: 'All Orders' },
      { path: '/orders/backorders', label: 'Backorders' },
      { path: '/orders/cancelled', label: 'Cancelled Orders' },
    ],
  },
  {
    label: 'Warehouse',
    icon: <Warehouse />,
    children: [
      { path: '/warehouse/picking', label: 'Picking List' },
      { path: '/warehouse/packing', label: 'Packing' },
      { path: '/warehouse/dispatch', label: 'Dispatch' },
      { path: '/warehouse/bins', label: 'Bin / Location Management' },
      { path: '/warehouse/transfer', label: 'Stock Transfer' },
      { path: '/warehouse/warehouses', label: 'Warehouses' },
    ],
  },
  {
    label: 'Returns',
    icon: <AssignmentReturn />,
    children: [
      { path: '/returns/list', label: 'Customer Returns' },
      { path: '/returns/rto', label: 'RTO Tracking' },
    ],
  },
  {
    label: 'Purchase & Planning',
    icon: <ShoppingBag />,
    children: [
      { path: '/purchase/orders', label: 'Purchase Orders' },
      { path: '/purchase/suppliers', label: 'Suppliers' },
      { path: '/purchase/forecast', label: 'Forecasted Demand' },
      { path: '/purchase/reorder-levels', label: 'Reorder Levels' },
    ],
  },
  {
    label: 'Shipping',
    icon: <LocalShipping />,
    children: [
      { path: '/shipping/tracking', label: 'Shipment Tracking' },
      { path: '/shipping/delivery-status', label: 'Delivery Status' },
    ],
  },
  {
    label: 'Reports',
    icon: <Assessment />,
    children: [
      { path: '/reports/inventory', label: 'Inventory Report' },
      { path: '/reports/orders', label: 'Order & Dispatch Report' },
      { path: '/reports/returns', label: 'Returns & RTO Report' },
    ],
  },
  {
    label: 'Integrations',
    icon: <IntegrationInstructions />,
    children: [{ path: '/integrations', label: 'Integrations' }],
  },
  {
    label: 'Users & Settings',
    icon: <Settings />,
    children: [
      { path: '/users', label: 'User Management' },
      { path: '/users/roles', label: 'Roles & Permissions' },
      { path: '/users/activity-logs', label: 'Activity Logs' },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState({});

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
        {menuItems.map((item) => {
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
