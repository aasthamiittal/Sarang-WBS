# Industrial WMS Upgrade – Implementation Status

## Completed

### 1. Multi-tenancy (hard requirement)
- **Backend**
  - `enforceTenant` middleware added to **all** API routes (dashboard, inventory, orders, warehouse, returns, purchase, shipping, supplier, report, integration, product, user, role, activity log).
  - Every controller scopes by `req.tenantId` (customerId): all reads use `customerId: req.tenantId`, all creates set `customerId: req.tenantId`.
  - Soft deletes used where applicable: Product, Warehouse, User, Supplier, Order (filter `deletedAt: null`; delete = set `deletedAt`).
  - Single-document operations use `findOne` / `findOneAndUpdate` / `findOneAndDelete` with `_id` + `customerId` to avoid cross-tenant access.
- **Frontend**: No manual `customerId`; tenant comes from JWT only (AuthContext).

### 2. Auth & role / permission system
- JWT includes `userId`, `customerId`, `role`, `permissions` (capability-based).
- Backend: `verifyToken` (auth), `enforceTenant`, `checkPermission(module, action)`, `requireAdmin` for governance (users, roles, matrix, activity logs).
- Frontend: `hasPermission(capability, action)`, `isAdmin`; sidebar and routes gated by permission / admin.

### 3. Business logic hardening
- **Inventory**
  - No negative stock: adjustments rejected if result &lt; 0; inward quantity must be positive.
  - All inventory operations tenant-scoped; movements store `customerId`.
- **Orders**
  - Order state machine enforced in `updateOrderStatus`: valid transitions only (e.g. created→pending→confirmed→allocated→picking→picked→packing→packed→dispatched→delivered; cancelled/backorder as specified).
  - Invalid transition returns 400 with allowed next statuses.
- **Warehouse / Returns / Purchase / Shipping / Supplier**
  - All tenant-scoped; creates set `customerId`; updates/deletes restrict by `customerId`.
  - Warehouse/Supplier use soft delete.

### 4. Security & ops
- **Health check** (`GET /health`): Returns 200 when MongoDB is connected, 503 otherwise; includes `timestamp`, `mongodb` status.
- **Rate limiting**: `express-rate-limit` on `/api` (200 req/min per IP).
- **Helmet**: Secure headers (CSP disabled for easier frontend integration).
- **Dependencies**: `express-rate-limit`, `helmet` added to `package.json`. Run `npm install` in `backend` if not already done.

### 5. Audit & activity log
- Central audit logger in place; ActivityLog filtered by `customerId`; list endpoint tenant-scoped.

### 6. Reporting
- All report endpoints tenant-scoped; data filtered by `customerId`.

### 7. Integrations
- Integration CRUD fully tenant-scoped; **retry** endpoint (`POST /integrations/retry-integration/:id`) clears lastError and increments retryCount; **SkuMapping** model (externalSku ↔ product per integration).

### 8. Reporting engine
- **ReportJob** model: reportType, status (pending/running/completed/failed), progress, result, filePath, requestedBy, filters.
- **Async report flow**: `POST /reports/request-job` (body: reportType, filters) creates job and runs report in background; `GET /reports/jobs` (paginated list); `GET /reports/job/:id` (status); `GET /reports/job/:id/download` (requires corresponding report **download** permission; returns result).
- **Pagination** enforced on all report list APIs (inventory, stock purchase/sales, order dispatch, returns RTO) with page, limit, total, totalPages.
- View vs download: download endpoint checks per-report module (e.g. inventory_report.download, stock_report.download).

### 9. Inventory ledger
- **InventoryLedger** model (immutable): customerId, product, warehouse, quantityDelta, type (inward, outward, adjustment, transfer_in, transfer_out), referenceNo, reason, createdBy.
- Every stock change (inward, adjustment, transfer) writes to both **StockMovement** and **InventoryLedger**; **Inventory** remains the derived snapshot (updated in same flow).

### 10. Frontend confirmations
- **Dispatch**: Confirm dialog before marking order as dispatched.
- **Stock Adjustment**: Confirm dialog before applying adjustment.

---

## Remaining (for full Helm-level)

- **Inventory**
  - Adjustment approvals; basic valuation (FIFO/weighted avg).
- **Orders**
  - Partial fulfillment, split shipments, backorder handling in UI and APIs.
- **Warehouse**
  - Pick waves/batches, short-pick handling, putaway after inward; bin ownership checks.
- **Returns**
  - Explicit lifecycle; link to original shipment; QC gate before restock.
- **Integrations**
  - Retry queue / dead-letter worker; idempotent handlers; integration health dashboard in UI (manual retry button can call existing retry API).
- **Security**
  - Refresh tokens; token invalidation on role change; IP/device logging.
- **Config**
  - System configuration (units, status labels, feature toggles, plan-based limits).
- **Observability**
  - Error tracking hooks, slow query logging, integration SLA metrics.
- **Frontend**
  - Confirmations for dispatch and adjustments; concurrent-edit handling; report job status and download gating by permission.

---

## How to run

1. **Backend**
   - `cd backend && npm install` (installs helmet, express-rate-limit).
   - `npm run dev` or `npm start`.
   - Health: `GET http://localhost:5000/health`.
2. **Seed**
   - `npm run seed` (creates default customer, admin role, admin user with hashed password).
3. **Frontend**
   - No `customerId` in requests; JWT and AuthContext provide tenant context.

All APIs that require auth now use: **auth → enforceTenant → permission (or requireAdmin)**. Every MongoDB query in these controllers includes tenant scope (`customerId` / `req.tenantId`).
