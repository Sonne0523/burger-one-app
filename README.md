# 🍔 Fastfood App

A fast-food ordering system with a **customer ordering page** and a real-time **staff kitchen dashboard**.

---

## 📁 Project Structure

```
fastfood-app/
├── frontend/                  # Static HTML/CSS/JS — no build needed
│   ├── index.html             # Customer ordering page
│   ├── dashboard.html         # Staff kitchen & counter dashboard
│   ├── css/
│   │   ├── style.css          # Customer page styles
│   │   └── dashboard.css      # Dashboard styles
│   └── js/
│       ├── app.js             # Customer page logic
│       └── dashboard.js       # Dashboard logic
│
└── backend/                   # Node.js + Express REST API
    ├── server.js              # Entry point
    ├── app.js                 # Express app setup
    ├── .env                   # Environment variables
    ├── package.json
    └── src/
        ├── controllers/
        │   └── orderController.js   # Business logic
        ├── routes/
        │   └── orderRoutes.js       # Route definitions
        └── middleware/
            └── errorHandler.js      # Global error & 404 handler
```

---

## 🚀 Getting Started

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

Server runs at **http://localhost:3000**

### 3. Open the Frontend

Open the HTML files directly in your browser:

| Page | File |
|---|---|
| 🛒 Customer Ordering | `frontend/index.html` |
| 👨‍🍳 Staff Dashboard | `frontend/dashboard.html` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/place` | Place a new order |
| `GET` | `/api/orders/all` | Get all orders (newest first) |
| `GET` | `/api/orders/stats` | Get summary stats |
| `PATCH` | `/api/orders/pay/:id` | Mark order as paid |

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
