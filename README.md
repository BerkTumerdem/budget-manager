# Budget Manager

Full-stack personal budget app — Bachelor's thesis project at Ovidius University of Constanța (Computer Science, 2025).

**Live demo:** [https://budget-manager-livid-three.vercel.app](https://budget-manager-livid-three.vercel.app)  
**API:** [https://budget-manager-u6l5.onrender.com](https://budget-manager-u6l5.onrender.com)  
**Demo login:** `demo@example.com` / `demo123`

> Free Render tier: first API request after idle can take ~30–60 seconds.

Track income and expenses by category, review totals on a dashboard, filter interactive charts, browse a transaction calendar, set a monthly savings goal, and export CSV/PDF — with English/Romanian UI and dark/light themes.

## Screenshots

| Dashboard | Reports & Charts |
|-----------|------------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Reports](docs/screenshots/report.png) |

| Transactions | Calendar |
|--------------|----------|
| ![Transactions](docs/screenshots/expenses.png) | ![Calendar](docs/screenshots/calendar.png) |

## Features

- **Authentication** — register/login with JWT and bcrypt, protected routes, session cleanup on 401
- **Transactions** — create, edit, delete income/expenses; categories, search, type filter, sort, time ranges
- **Categories** — per-user CRUD with color and duplicate checks
- **Dashboard** — balance, income, expenses, savings progress, category count
- **Reports & charts** — pie/bar charts (Recharts) with date and category filters
- **Calendar** — day-by-day transaction view
- **Savings goal** — set in Settings, shown on Dashboard
- **Export** — CSV (with summary) and PDF reports using the same filters/totals
- **i18n** — EN/RO UI and API messages via `Accept-Language`
- **Theming** — dark/light mode, responsive layout (mobile drawer + desktop sidebar)

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 18, React Router 6, TailwindCSS, Recharts, Framer Motion, Axios |
| Backend  | Node.js, Express, JWT, bcryptjs, PDFKit, json2csv |
| Database | MongoDB (Mongoose) — Atlas, local MongoDB, or in-memory fallback for local demos |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB optional locally (in-memory DB starts if `MONGO_URI` is empty; **required in production**)

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env   # then edit .env if you want a persistent database
npm start
```

API: `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

App: `http://localhost:3000`.

### 3. Demo data (optional)

With both servers running:

```bash
npm install   # project root
node populate-demo-data.js
```

Login: `demo@example.com` / `demo123`. See [DEMO_DATA_README.md](DEMO_DATA_README.md).

## Project Structure

```
├── backend/
│   ├── config/        # DB connection, env config, constants
│   ├── controllers/   # Auth, expenses, categories, reports, export, PDF, settings
│   ├── middleware/    # JWT auth
│   ├── models/        # User, Expense, Category
│   ├── routes/        # /api/...
│   ├── utils/         # CSV/PDF helpers, i18n messages, expense query/totals
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/     # Theme, Language, Currency
│       ├── pages/
│       └── utils/       # Axios + date helpers
└── populate-demo-data.js
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |
| GET/POST/PUT/DELETE | `/api/expenses` | Transaction CRUD |
| GET/POST/PUT/DELETE | `/api/categories` | Category CRUD |
| GET | `/api/reports` | Balance, income, expenses, per-category summary (`start`/`end`/`category`) |
| GET | `/api/export/expenses` | CSV export (same filters) |
| GET | `/api/pdf/report` | PDF report (same filters) |
| GET/POST | `/api/settings/savings-goal` | Read / set savings goal |

Authenticated routes need `Authorization: Bearer <token>`. Use `Accept-Language: ro` for Romanian API messages.

## Author

**Aydin Berk Tumerdem** — [LinkedIn](https://www.linkedin.com/in/aydin-berk-tumerdem-95a572286/) · [GitHub](https://github.com/BerkTumerdem)

## Free deployment (overview)

| Part | Free host |
|------|-----------|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (M0) |
| Backend | [Render](https://render.com) (Web Service) |
| Frontend | [Vercel](https://vercel.com) (`frontend/` root) |

1. Atlas cluster + `MONGO_URI`, network access `0.0.0.0/0`.
2. Render: deploy `backend` with `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (Vercel URL or `*`).
3. Vercel: root `frontend`, `REACT_APP_API_URL=https://<render-service>.onrender.com/api`.
