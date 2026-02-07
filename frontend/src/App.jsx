import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';

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
import ActivityLogs from './pages/users/ActivityLogs';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      {/* Inventory */}
      <Route path="/inventory/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
      <Route path="/inventory/stock-inward" element={<PrivateRoute><StockInward /></PrivateRoute>} />
      <Route path="/inventory/current-stock" element={<PrivateRoute><CurrentStock /></PrivateRoute>} />
      <Route path="/inventory/stock-movement" element={<PrivateRoute><StockMovement /></PrivateRoute>} />
      <Route path="/inventory/stock-adjustment" element={<PrivateRoute><StockAdjustment /></PrivateRoute>} />
      <Route path="/inventory/low-stock" element={<PrivateRoute><LowStock /></PrivateRoute>} />
      {/* Orders */}
      <Route path="/orders/list" element={<PrivateRoute><OrderList /></PrivateRoute>} />
      <Route path="/orders/backorders" element={<PrivateRoute><Backorders /></PrivateRoute>} />
      <Route path="/orders/cancelled" element={<PrivateRoute><CancelledOrders /></PrivateRoute>} />
      {/* Warehouse */}
      <Route path="/warehouse/picking" element={<PrivateRoute><PickingList /></PrivateRoute>} />
      <Route path="/warehouse/packing" element={<PrivateRoute><Packing /></PrivateRoute>} />
      <Route path="/warehouse/dispatch" element={<PrivateRoute><Dispatch /></PrivateRoute>} />
      <Route path="/warehouse/bins" element={<PrivateRoute><BinManagement /></PrivateRoute>} />
      <Route path="/warehouse/transfer" element={<PrivateRoute><StockTransfer /></PrivateRoute>} />
      <Route path="/warehouse/warehouses" element={<PrivateRoute><WarehouseList /></PrivateRoute>} />
      {/* Returns */}
      <Route path="/returns/list" element={<PrivateRoute><ReturnsList /></PrivateRoute>} />
      <Route path="/returns/rto" element={<PrivateRoute><RtoTracking /></PrivateRoute>} />
      {/* Purchase */}
      <Route path="/purchase/orders" element={<PrivateRoute><PurchaseOrders /></PrivateRoute>} />
      <Route path="/purchase/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
      <Route path="/purchase/forecast" element={<PrivateRoute><Forecast /></PrivateRoute>} />
      <Route path="/purchase/reorder-levels" element={<PrivateRoute><ReorderLevels /></PrivateRoute>} />
      {/* Shipping */}
      <Route path="/shipping/tracking" element={<PrivateRoute><ShipmentTracking /></PrivateRoute>} />
      <Route path="/shipping/delivery-status" element={<PrivateRoute><DeliveryStatus /></PrivateRoute>} />
      {/* Reports */}
      <Route path="/reports/inventory" element={<PrivateRoute><ReportInventory /></PrivateRoute>} />
      <Route path="/reports/orders" element={<PrivateRoute><ReportOrders /></PrivateRoute>} />
      <Route path="/reports/returns" element={<PrivateRoute><ReportReturns /></PrivateRoute>} />
      {/* Integrations */}
      <Route path="/integrations" element={<PrivateRoute><Integrations /></PrivateRoute>} />
      {/* Users */}
      <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
      <Route path="/users/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
      <Route path="/users/activity-logs" element={<PrivateRoute><ActivityLogs /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
