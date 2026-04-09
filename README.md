# Inventory Management System

A full-stack inventory management application built with **Next.js** (TypeScript) and **Go** (Gin). Manage products, warehouses, orders, sales, and permission-based B2B purchasing.

**Live:** https://inventory-management-sooty-zeta.vercel.app

## Tech Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Frontend  | Next.js 15 (App Router), React 19, TailwindCSS |
| Backend   | Go 1.23, Gin, GORM                             |
| Database  | PostgreSQL (Neon)                               |
| Auth      | NextAuth v4 (JWT + Credentials)                 |
| Deploy    | Vercel (frontend), GCP Cloud Run (backend)      |
| CI/CD     | GitHub Actions                                  |

## Features

- **Authentication** — Email/password login with JWT, session cookie-based auth
- **Product Management** — CRUD with auto-generated SKU, warehouse assignment
- **Warehouse Management** — Create, update, delete warehouses with inventory tracking
- **B2B Purchasing** — Permission request system, product ordering, cart
- **Order Workflow** — Pending → Processing → Delivered → Completed with role-based actions
- **Sales Dashboard** — Track orders, accept/complete sales
- **Cost Management** — Revenue and spending analytics
- **Company Settings** — Profile management, password changes

## Project Structure

```
├── backend/
│   ├── main.go              # Entry point
│   ├── config/              # DB and env config
│   ├── handlers/            # Route handlers (auth, products, orders, etc.)
│   ├── middleware/           # Auth and CORS middleware
│   ├── models/              # GORM models
│   ├── routes/              # Route definitions
│   ├── utils/               # SKU generation
│   └── Dockerfile
├── frontend/
│   ├── src/app/             # Next.js App Router pages
│   │   ├── components/      # Shared components (Header, Footer, Tabs)
│   │   ├── context/         # React context (MenuContext)
│   │   ├── dashboard/       # Cost management dashboard
│   │   ├── products/        # Product CRUD pages
│   │   ├── warehouse/       # Warehouse CRUD pages
│   │   ├── purchase/        # Purchase and cart pages
│   │   ├── sales/           # Sales management
│   │   ├── requests/        # Permission request pages
│   │   └── settings/        # Company settings
│   └── public/              # Static assets, favicon, ads.txt
├── .github/workflows/       # CI/CD pipelines
└── SPECIFICATION.md          # Technical specification
```

## Getting Started

### Prerequisites

- Go 1.23+
- Node.js 20+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET, etc.
go mod download
go run main.go
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local  # Configure NEXT_PUBLIC_BACKEND_URL, NEXTAUTH_SECRET
npm install
npm run dev
```

### Environment Variables

#### Backend

| Variable          | Description                          |
| ----------------- | ------------------------------------ |
| `DATABASE_URL`    | PostgreSQL connection string         |
| `JWT_SECRET`      | Secret for signing JWT tokens        |
| `ALLOWED_ORIGIN`  | Frontend URL for CORS                |
| `ENV`             | `production` or omit for development |
| `PORT`            | Server port (default: 8080)          |
| `TRUSTED_PROXIES` | Comma-separated proxy IPs            |

#### Frontend

| Variable                    | Description               |
| --------------------------- | ------------------------- |
| `NEXT_PUBLIC_BACKEND_URL`   | Backend API URL            |
| `NEXTAUTH_SECRET`           | NextAuth signing secret    |
| `NEXTAUTH_URL`              | Frontend canonical URL     |

## API Endpoints

| Method | Endpoint                     | Auth | Description              |
| ------ | ---------------------------- | ---- | ------------------------ |
| POST   | `/api/login/`                | No   | Login                    |
| POST   | `/api/register/`             | No   | Register company         |
| GET    | `/api/products/`             | Yes  | List own products        |
| POST   | `/api/products/register/`    | Yes  | Register product         |
| PUT    | `/api/products/:id/`         | Yes  | Update product           |
| DELETE | `/api/products/:id/`         | Yes  | Delete product           |
| GET    | `/api/warehouses/`           | Yes  | List warehouses          |
| POST   | `/api/warehouses/`           | Yes  | Create warehouse         |
| PUT    | `/api/warehouses/:id/`       | Yes  | Update warehouse         |
| DELETE | `/api/warehouses/:id/`       | Yes  | Delete warehouse         |
| GET    | `/api/purchase-products/`    | Yes  | List purchasable products|
| POST   | `/api/orders/`               | Yes  | Create order             |
| GET    | `/api/orders/`               | Yes  | List orders              |
| PUT    | `/api/orders/:id/accept/`    | Yes  | Accept order (seller)    |
| PUT    | `/api/orders/:id/deliver/`   | Yes  | Mark delivered (buyer)   |
| PUT    | `/api/orders/:id/complete/`  | Yes  | Complete order (seller)  |
| GET    | `/api/sales/`                | Yes  | List sales               |
| POST   | `/api/requests/`             | Yes  | Send permission request  |
| GET    | `/api/requests/search/`      | Yes  | Search requests          |
| PUT    | `/api/requests/:requestId/`  | Yes  | Update request status    |
| GET    | `/api/settings/`             | Yes  | Get company settings     |
| PUT    | `/api/settings/update/`      | Yes  | Update profile           |
| PUT    | `/api/settings/password/`    | Yes  | Change password          |
| GET    | `/api/cost/`                 | Yes  | Get cost analytics       |

## License

This project is proprietary.