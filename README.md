# WBS-Sarang – Warehouse Backend System

Full-stack Warehouse Management System: **React (Strict Mode)** frontend and **Node.js + Express + MongoDB** backend. Database name: **WBS-Sarang**.

## Tech Stack

- **Frontend:** React 18 (StrictMode), React Router, Axios, Material UI, Context API
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Theme:** Primary `#6BAED6`, Secondary `#FFFFFF`

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit if needed (default: MongoDB localhost, port 5000)
npm run dev
```

Seed initial admin user (run once, when DB is empty):

```bash
node src/seed.js
```

Login: **admin@wbs-sarang.com** / **admin123**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The app proxies `/api` to the backend (port 5000).

### 3. MongoDB

Ensure MongoDB is running locally, or set `MONGODB_URI` in `backend/.env` to your connection string. Database name must be **WBS-Sarang** (or set in `MONGODB_URI`).

## API Naming Convention

- Create: `POST /api/*/add-*`
- Read: `GET /api/*/get-*` or `GET /api/*/get-*/:id`
- Update: `PUT /api/*/update-*/:id`
- Delete: `DELETE /api/*/delete-*/:id`

All protected routes expect header: `Authorization: Bearer <token>` (from login).

## Project Structure

```
WMS-Sarang/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── middleware/   # auth, errorHandler
│   │   ├── models/       # Mongoose schemas
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # axios instance
│   │   ├── components/   # layout + common (Table, Pagination, FormModal, ConfirmDialog)
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # module pages
│   │   ├── theme.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Modules (UI + API)

- **Dashboard** – Daily summary, stock snapshot, alerts
- **Inventory** – Products, stock inward, current stock, movements, adjustment, low stock
- **Orders** – List, status, backorders, cancelled
- **Warehouse** – Picking, packing, dispatch, bins, stock transfer, warehouses
- **Returns** – Customer returns, RTO tracking
- **Purchase & Planning** – Purchase orders, suppliers, forecast, reorder levels
- **Shipping** – Tracking, delivery status
- **Reports** – Inventory, order/dispatch, returns
- **Integrations** – List and manage integrations
- **Users & Settings** – Users, roles, activity logs

## Reusable Components

- `Sidebar`, `Topbar`, `MainLayout`
- `DataTable`, `Pagination`, `FormModal`, `ConfirmDialog`, `PageHeader`

Code is structured for readability and scalability; ready for enhancements (e.g. Amazon integration).
