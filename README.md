# 🥗 NutriTrack — Patient Diet & Calorie Tracking System

A full-stack MERN application for tracking patient diet, calories, water intake, BMI, and health progress — with doctor-managed diet plans and an admin panel.

---

## 🚀 Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React.js 18 + Vite, Tailwind CSS, Framer Motion    |
| State      | Redux Toolkit                                       |
| Charts     | Recharts                                            |
| Backend    | Node.js, Express.js                                 |
| Database   | MongoDB + Mongoose                                  |
| Auth       | JWT (JSON Web Tokens)                               |
| HTTP       | Axios                                               |
| Icons      | Lucide React                                        |

---

## 📁 Project Structure

```
diet-tracker/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Business logic
│   ├── middleware/       # Auth & error handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Demo data seeder
│   ├── server.js        # Entry point
│   └── .env.example     # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/  # Shared UI components
    │   │   └── shared/  # Layout, Sidebar, Topbar
    │   ├── pages/
    │   │   ├── public/  # Home, Login, Register
    │   │   ├── patient/ # Dashboard, Meals, Water, BMI, etc.
    │   │   ├── doctor/  # Dashboard, Patients, Diet Plans
    │   │   └── admin/   # Dashboard, User Management
    │   ├── store/       # Redux slices
    │   └── utils/       # API helper, utilities
    └── index.html
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local) or MongoDB Atlas URI
- npm

---

### 1. Clone & Install

```bash
# Backend
cd diet-tracker/backend
npm install

# Frontend
cd diet-tracker/frontend
npm install
```

---

### 2. Environment Variables

```bash
cd diet-tracker/backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/diet-tracker
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

### 3. Seed Demo Data

```bash
cd diet-tracker/backend
node seed.js
```

This creates:
- 4 demo users (admin, doctor, 2 patients)
- 28 sample meals (7 days history)
- BMI records, water logs, diet plan, notifications

**Demo Credentials:**
| Role    | Email               | Password  |
|---------|---------------------|-----------|
| Patient | patient@demo.com    | demo1234  |
| Doctor  | doctor@demo.com     | demo1234  |
| Admin   | admin@demo.com      | demo1234  |

---

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
cd diet-tracker/backend
npm run dev        # with nodemon (auto-restart)
# or
npm start          # production
```

**Terminal 2 — Frontend:**
```bash
cd diet-tracker/frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🎯 Features by Role

### 👤 Patient
- **Dashboard** — Calorie ring, macro breakdown, water tracker widget, weekly charts
- **Meal Tracker** — Log breakfast/lunch/dinner/snacks with food database search
- **Diet Plans** — View doctor-assigned plans, mark meals as completed
- **Water Tracker** — Quick-add buttons, animated glass visual, weekly chart
- **BMI Calculator** — Calculate & save BMI, visual gauge, weight history charts
- **Reports** — Monthly calorie/macro analytics, meal type distribution
- **Profile** — Update health metrics, goals, activity level, change password

### 🩺 Doctor / Nutritionist
- **Dashboard** — Patient count, plan stats, quick actions
- **Patient Management** — View all patients, expand for BMI/calorie/meal details
- **Create Diet Plan** — Multi-meal scheduler with food items, nutritional advice, restrictions
- **Reports** — Plan creation trends, patient goal distribution

### 🔧 Admin
- **Dashboard** — System-wide stats (users, meals, calories today), user growth chart
- **User Management** — Search/filter users, toggle active/inactive, change roles, delete

---

## 🌐 API Reference

### Auth
```
POST   /api/auth/register     — Create account
POST   /api/auth/login        — Sign in (returns JWT)
GET    /api/auth/me           — Get current user
PUT    /api/auth/profile      — Update profile
PUT    /api/auth/change-password
```

### Meals
```
GET    /api/meals             — Get meals (filter by date, type)
GET    /api/meals/today-summary
GET    /api/meals/weekly
POST   /api/meals             — Add meal
PUT    /api/meals/:id
DELETE /api/meals/:id
PATCH  /api/meals/:id/favorite
```

### Food Database
```
GET    /api/food/search?q=apple
GET    /api/food/categories
GET    /api/food/:id
```

### Water
```
GET    /api/water/today
GET    /api/water/weekly
POST   /api/water             — Add intake { amount, unit }
DELETE /api/water/reset
```

### BMI
```
GET    /api/bmi/latest
GET    /api/bmi/history
POST   /api/bmi              — { weight, height, notes }
```

### Diet Plans
```
GET    /api/diet-plans
GET    /api/diet-plans/:id
POST   /api/diet-plans       — Doctor/Admin only
PUT    /api/diet-plans/:id
DELETE /api/diet-plans/:id
PATCH  /api/diet-plans/:id/meals/:mealId/complete
```

### Users (Doctor/Admin)
```
GET    /api/users/patients
GET    /api/users/doctors
GET    /api/users/patients/:id
POST   /api/users/assign-doctor
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/user-growth
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
```

### Reports
```
GET    /api/reports/monthly?year=2025&month=4
```

---

## 🎨 UI Design

- **Glassmorphism** cards with backdrop blur
- **Gradient** stat cards and buttons
- **Dark mode** support (toggle in topbar)
- **Framer Motion** page and element animations
- **Recharts** — Area, Bar, Pie, Line charts
- **Custom progress bars** with gradient fills
- **Responsive** sidebar (hamburger on mobile)
- **DM Sans** + **Syne** typography

---

## 🗄️ MongoDB Collections

| Collection    | Purpose                          |
|---------------|----------------------------------|
| users         | All users (patients, doctors, admin) |
| meals         | Individual meal logs             |
| dietplans     | Doctor-created nutrition plans   |
| waters        | Daily water intake records       |
| bmis          | BMI measurement history          |
| notifications | User notifications               |

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT** tokens with expiry (7 days default)
- **Role-based** route guards (patient / doctor / admin)
- Request validation and sanitization
- CORS configured for frontend origin only

---

## 📦 Build for Production

```bash
# Build frontend
cd frontend && npm run build

# Serve frontend from backend (optional — add to server.js)
# app.use(express.static(path.join(__dirname, '../frontend/dist')))

# Start backend
cd backend && npm start
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Made with ❤️ for healthcare professionals and patients.
