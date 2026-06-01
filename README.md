# 🅿 ParkChennai — Smart Parking Booking App

A fullstack parking booking system for Chennai with JWT authentication
and MySQL row-level locking to prevent double bookings.

---

## 📁 Project Structure

```
parking-app/
├── backend/
│   ├── server.js                  # Express entry point
│   ├── db.js                      # MySQL2 connection pool
│   ├── schema.sql                 # DB schema + 10 Chennai locations seed
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   └── routes/
│       ├── authRoutes.js          # POST /api/auth/signup & /login
│       ├── locationRoutes.js      # GET /api/locations & /api/locations/:id
│       └── bookingRoutes.js       # POST /api/bookings, GET /api/bookings/history
├── frontend/
│   ├── index.html                 # Login page
│   ├── signup.html                # Signup page
│   ├── dashboard.html             # All parking location cards
│   ├── location.html              # Slot map + booking form
│   ├── history.html               # Booking history
│   ├── css/
│   │   └── style.css              # Shared styles (white & orange theme)
│   └── js/
│       └── utils.js               # API helper, Auth, Toast notifications
├── .env                           # Environment variables (edit before running)
└── package.json
```

---

## ⚙️ Prerequisites

Make sure these are installed on your machine:

| Tool       | Version   | Download |
|------------|-----------|----------|
| Node.js    | v18+      | https://nodejs.org |
| npm        | v9+       | (comes with Node) |
| MySQL      | v8.0+     | https://dev.mysql.com/downloads/ |

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone / Extract the project

```bash
unzip parking-app.zip
cd parking-app
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up MySQL database

Open MySQL CLI or MySQL Workbench and run:

```bash
mysql -u root -p < backend/schema.sql
```

This will:
- Create the `parking_db` database
- Create all 4 tables (`users`, `locations`, `slots`, `bookings`)
- Insert 10 real Chennai parking locations
- Insert all individual slots for each location

### Step 4 — Configure environment variables

Edit the `.env` file in the root of the project:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD   ← change this
DB_NAME=parking_db
JWT_SECRET=change_this_to_a_long_random_string  ← change this
PORT=3000
```

> ⚠️ Never commit your `.env` to version control in production.

### Step 5 — Start the server

```bash
npm start
```

You should see:

```
🚀 Parking App server running at http://localhost:3000
   Frontend: http://localhost:3000/index.html
   API:      http://localhost:3000/api
```

### Step 6 — Open in browser

Visit: **http://localhost:3000**

---

## 📍 10 Chennai Parking Locations (Pre-seeded)

| # | Location | Slots | Price/hr |
|---|----------|-------|----------|
| 1 | Express Avenue Mall | 20 | ₹40 |
| 2 | Chennai Central Railway | 15 | ₹30 |
| 3 | Phoenix MarketCity | 25 | ₹50 |
| 4 | Marina Beach | 10 | ₹20 |
| 5 | T. Nagar Bus Stand | 12 | ₹35 |
| 6 | Vadapalani Metro | 18 | ₹25 |
| 7 | Chennai Airport | 30 | ₹60 |
| 8 | Besant Nagar Beach | 8 | ₹20 |
| 9 | Nungambakkam High Road | 14 | ₹45 |
| 10 | Sholinganallur IT Park | 22 | ₹35 |

---

## 🔐 JWT Authentication Flow

```
Signup → bcrypt hash password → store user → return JWT token
Login  → verify password → sign JWT (1h expiry) → return token
Frontend → store token in localStorage
API Requests → Authorization: Bearer <token> header
Backend → verify token → attach user to req → proceed
```

---

## 🔒 Race Condition Prevention (Slot Locking)

When two users try to book the same last slot simultaneously:

```
WITHOUT lock: Both users read slot as free → both book → double booking ❌

WITH SELECT...FOR UPDATE:
  User A: BEGIN → locks row → checks free → books → COMMIT ✅
  User B: BEGIN → WAITS for lock → lock released → slot is occupied → 409 Error ✅
```

The locking is in `backend/routes/bookingRoutes.js` using a dedicated
MySQL connection per booking transaction.

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/locations` | ✅ JWT | All locations with slot counts |
| GET | `/api/locations/:id` | ✅ JWT | Single location with all slots |
| POST | `/api/bookings` | ✅ JWT | Book a slot (with lock) |
| GET | `/api/bookings/history` | ✅ JWT | Current user's booking history |

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0 with InnoDB (row-level locking)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **DB Driver**: `mysql2/promise` with connection pool

---

## 🐛 Troubleshooting

**"Cannot connect to MySQL"**
→ Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
→ Make sure MySQL service is running: `sudo service mysql start`

**"Access denied for user"**
→ Verify your MySQL credentials
→ Grant privileges: `GRANT ALL ON parking_db.* TO 'root'@'localhost';`

**Port 3000 already in use**
→ Change PORT in `.env` to another value like `3001`

**JWT errors on API calls**
→ Clear localStorage in browser and log in again
