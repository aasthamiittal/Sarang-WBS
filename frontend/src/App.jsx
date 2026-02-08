import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import ProductList from './pages/inventory/ProductList';
import StockInward from './pages/inventory/StockInward';
import CurrentStock from './pages/inventory/CurrentStock';
import StockMovement from './pages/inventory/StockMovement';
import StockAdjustment from './pages/inventory/StockAdjustment';
import LowStock from './pages/inventory/LowStock';

import OrderList from './pages/orders/OrderList';
import Backorders from './pages/orders/Backorders';
import CancelledOrders from './pages/orders/CancelledOrders';

import PickingList from './pages/warehouse/PickingList';
import Packing from './pages/warehouse/Packing';
import Dispatch from './pages/warehouse/Dispatch';
import BinManagement from './pages/warehouse/BinManagement';
import StockTransfer from './pages/warehouse/StockTransfer';
import WarehouseList from './pages/warehouse/WarehouseList';

import ReturnsList from './pages/returns/ReturnsList';
import RtoTracking from './pages/returns/RtoTracking';

import PurchaseOrders from './pages/purchase/PurchaseOrders';
import Suppliers from './pages/purchase/Suppliers';
import Forecast from './pages/purchase/Forecast';
import ReorderLevels from './pages/purchase/ReorderLevels';

import ShipmentTracking from './pages/shipping/ShipmentTracking';
import DeliveryStatus from './pages/shipping/DeliveryStatus';

import ReportInventory from './pages/reports/ReportInventory';
import ReportOrders from './pages/reports/ReportOrders';
import ReportReturns from './pages/reports/ReportReturns';

import Integrations from './pages/integrations/Integrations';

import UserManagement from './pages/users/UserManagement';
import Roles from './pages/users/Roles';
import RolePermissions from './pages/users/RolePermissions';
import ActivityLogs from './pages/users/ActivityLogs';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute module="dashboard" action="view"><Dashboard /></ProtectedRoute>} />
      {/* Inventory */}
      <Route path="/inventory/products" element={<ProtectedRoute module="products" action="read"><ProductList /></ProtectedRoute>} />
      <Route path="/inventory/stock-inward" element={<ProtectedRoute module="inventory" action="read"><StockInward /></ProtectedRoute>} />
      <Route path="/inventory/current-stock" element={<ProtectedRoute module="inventory" action="read"><CurrentStock /></ProtectedRoute>} />
      <Route path="/inventory/stock-movement" element={<ProtectedRoute module="inventory" action="read"><StockMovement /></ProtectedRoute>} />
      <Route path="/inventory/stock-adjustment" element={<ProtectedRoute module="inventory" action="read"><StockAdjustment /></ProtectedRoute>} />
      <Route path="/inventory/low-stock" element={<ProtectedRoute module="inventory" action="read"><LowStock /></ProtectedRoute>} />
      {/* Orders */}
      <Route path="/orders/list" element={<ProtectedRoute module="orders" action="read"><OrderList /></ProtectedRoute>} />
      <Route path="/orders/backorders" element={<ProtectedRoute module="orders" action="read"><Backorders /></ProtectedRoute>} />
      <Route path="/orders/cancelled" element={<ProtectedRoute module="orders" action="read"><CancelledOrders /></ProtectedRoute>} />
      {/* Warehouse */}
      <Route path="/warehouse/picking" element={<ProtectedRoute module="warehouses" action="read"><PickingList /></ProtectedRoute>} />
      <Route path="/warehouse/packing" element={<ProtectedRoute module="warehouses" action="read"><Packing /></ProtectedRoute>} />
      <Route path="/warehouse/dispatch" element={<ProtectedRoute module="warehouses" action="read"><Dispatch /></ProtectedRoute>} />
      <Route path="/warehouse/bins" element={<ProtectedRoute module="warehouses" action="read"><BinManagement /></ProtectedRoute>} />
      <Route path="/warehouse/transfer" element={<ProtectedRoute module="warehouses" action="read"><StockTransfer /></ProtectedRoute>} />
      <Route path="/warehouse/warehouses" element={<ProtectedRoute module="warehouses" action="read"><WarehouseList /></ProtectedRoute>} />
      {/* Returns */}
      <Route path="/returns/list" element={<ProtectedRoute module="returns" action="read"><ReturnsList /></ProtectedRoute>} />
      <Route path="/returns/rto" element={<ProtectedRoute module="returns" action="read"><RtoTracking /></ProtectedRoute>} />
      {/* Purchase */}
      <Route path="/purchase/orders" element={<ProtectedRoute module="purchases" action="read"><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/purchase/suppliers" element={<ProtectedRoute module="purchases" action="read"><Suppliers /></ProtectedRoute>} />
      <Route path="/purchase/forecast" element={<ProtectedRoute module="purchases" action="read"><Forecast /></ProtectedRoute>} />
      <Route path="/purchase/reorder-levels" element={<ProtectedRoute module="purchases" action="read"><ReorderLevels /></ProtectedRoute>} />
      {/* Shipping */}
      <Route path="/shipping/tracking" element={<ProtectedRoute module="shipping" action="read"><ShipmentTracking /></ProtectedRoute>} />
      <Route path="/shipping/delivery-status" element={<ProtectedRoute module="shipping" action="read"><DeliveryStatus /></ProtectedRoute>} />
      {/* Reports */}
      <Route path="/reports/inventory" element={<ProtectedRoute module="inventory_report" action="view"><ReportInventory /></ProtectedRoute>} />
      <Route path="/reports/orders" element={<ProtectedRoute module="order_report" action="view"><ReportOrders /></ProtectedRoute>} />
      <Route path="/reports/returns" element={<ProtectedRoute module="returns_report" action="view"><ReportReturns /></ProtectedRoute>} />
      {/* Integrations */}
      <Route path="/integrations" element={<ProtectedRoute module="integrations" action="read"><Integrations /></ProtectedRoute>} />
      {/* Users */}
      <Route path="/users" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
      <Route path="/users/roles" element={<ProtectedRoute adminOnly><Roles /></ProtectedRoute>} />
      <Route path="/users/role-permissions" element={<ProtectedRoute adminOnly><RolePermissions /></ProtectedRoute>} />
      <Route path="/users/activity-logs" element={<ProtectedRoute adminOnly><ActivityLogs /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
