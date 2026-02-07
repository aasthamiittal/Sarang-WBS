# WBS-Sarang

**Warehouse Backend System** — a full-stack warehouse management application built with React and Node.js. The system uses MongoDB (database name: **WBS-Sarang**) and provides inventory, orders, warehouse operations, returns, purchasing, shipping, and reporting.

## Overview

- **Frontend:** React 18 (Strict Mode), React Router, Material UI, Context API. Theme: primary `#6BAED6`, secondary `#FFFFFF`.
- **Backend:** Node.js, Express, Mongoose, JWT-based authentication.
- **Database:** MongoDB; collections include users, roles, products, inventory, stock_movements, orders, warehouses, bins, returns, purchases, suppliers, shipments, integrations, and activity_logs.

## Getting Started

MongoDB must be running. Copy `backend/.env.example` to `backend/.env` and adjust `MONGODB_URI` and `JWT_SECRET` if needed. Install dependencies and run the backend and frontend (e.g. from the `backend` and `frontend` directories). Run the seed script once to create the initial admin user. The frontend runs on port 3000 and proxies API requests to the backend (port 5000).

## Architecture

- **API:** REST-style; create/read/update/delete follow `add-*`, `get-*`, `update-*`, `delete-*` naming. Protected routes use `Authorization: Bearer <token>`.
- **Frontend:** Reusable layout (Sidebar, Topbar, MainLayout) and shared components (DataTable, Pagination, FormModal, ConfirmDialog, PageHeader).

## Modules

| Area | Capabilities |
|------|--------------|
| **Dashboard** | Daily summary, stock snapshot, low-stock alerts |
| **Inventory** | Product/SKU master, stock inward, current stock, movements, adjustment, low-stock alerts |
| **Orders** | Order list, status updates, backorders, cancelled orders |
| **Warehouse** | Picking, packing, dispatch, bin/location management, stock transfer, warehouse master |
| **Returns** | Customer returns, RTO tracking |
| **Purchase & Planning** | Purchase orders, suppliers, demand forecast, reorder levels |
| **Shipping** | Shipment tracking, delivery status |
| **Reports** | Inventory, order/dispatch, returns & RTO |
| **Integrations** | Integration configuration (e.g. Amazon, ecommerce, courier, API) |
| **Users & Settings** | User management, roles & permissions, activity logs |

The codebase is structured for maintainability and extension (e.g. additional integrations).
