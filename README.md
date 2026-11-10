# ShopLite — Simple E-commerce Store

A complete full-stack e-commerce web application: product catalogue with search and category filtering, product details, a client-side shopping cart, secure checkout with order processing, and user accounts with order history.

> Built for the **CodeAlpha Full Stack Development Internship — Task 1: Simple E-commerce Store**.
> Repository naming follows the CodeAlpha convention: `CodeAlpha_EcommerceStore`.

## Features

- **Product listings** — responsive product grid with live search and a category filter
- **Product details** — dedicated page per product (`product.html?id=...`) with stock, rating and quantity picker
- **Shopping cart** — add / remove items, change quantities, live totals; the cart is stored client-side in `localStorage`
- **Order processing** — checkout requires login; orders are posted to the API, totals are recomputed on the server from database prices, and orders are stored in MongoDB
- **My Orders** — logged-in users see their own order history with items, totals and status
- **User registration & login** — passwords hashed with bcrypt, sessions via JSON Web Tokens (JWT), protected routes via auth middleware

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Backend  | Node.js, Express 4                           |
| Database | MongoDB with Mongoose (Product, User, Order) |
| Auth     | bcryptjs (password hashing), jsonwebtoken    |
| Frontend | Vanilla HTML, CSS and JavaScript (no build step) |
| Config   | dotenv (`.env`)                              |

## Project Structure

```
CodeAlpha_EcommerceStore/
├── server.js              # Express app: API routes + static frontend
├── config/db.js           # MongoDB connection (fails soft — server still starts)
├── models/
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── routes/
│   ├── products.js        # list / search / categories / details
│   ├── auth.js            # register / login / me
│   └── orders.js          # place order / my orders
├── middleware/auth.js     # JWT verification middleware
├── seed.js                # seeds 15 products + a demo user
└── public/
    ├── index.html         # product listings, search, category filter
    ├── product.html       # product details
    ├── cart.html          # cart + checkout
    ├── login.html / register.html
    ├── orders.html        # "My Orders"
    ├── css/style.css
    └── js/                # common.js + one script per page
```

## Getting Started

### Prerequisites

- **Node.js** 18 or newer
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017`), or a MongoDB Atlas connection string

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
#    then edit .env if needed (PORT, MONGO_URI, JWT_SECRET)

# 3. Seed the database with sample products and a demo user
npm run seed

# 4. Start the server
npm start
#    or, with auto-restart on changes:
npm run dev
```

Open **http://localhost:5000** in your browser.

**Demo account** (created by the seed script): `demo@shop.com` / `demo1234`

> Note: if MongoDB is not running, the server still starts and serves the shop pages; the product/order APIs will return a clear “Database unavailable” error until MongoDB is available.

## API Endpoints

| Method | Endpoint                    | Auth | Description                                        |
|--------|-----------------------------|------|----------------------------------------------------|
| GET    | `/api/products`             | No   | List products; supports `?search=` and `?category=` |
| GET    | `/api/products/categories`  | No   | Distinct category names                            |
| GET    | `/api/products/:id`         | No   | One product's details                              |
| POST   | `/api/auth/register`        | No   | Register `{name, email, password}` → returns JWT   |
| POST   | `/api/auth/login`           | No   | Login `{email, password}` → returns JWT            |
| GET    | `/api/auth/me`              | Yes  | Current logged-in user                             |
| POST   | `/api/orders`               | Yes  | Place an order `{items, shippingAddress, phone, paymentMethod}` |
| GET    | `/api/orders/my`            | Yes  | Orders belonging to the logged-in user             |

Authenticated requests send the token as `Authorization: Bearer <token>`.

## How It Fulfils Task 1

| Task requirement                  | Where it lives                                        |
|-----------------------------------|-------------------------------------------------------|
| Product listings                  | `public/index.html` + `GET /api/products`             |
| Shopping cart                     | `public/cart.html` + cart helpers in `js/common.js`   |
| Product details page              | `public/product.html` + `GET /api/products/:id`       |
| Order processing                  | `POST /api/orders` + checkout form on `cart.html`     |
| User registration / login         | `routes/auth.js`, bcrypt + JWT, `middleware/auth.js`  |
| Database for products/users/orders| MongoDB collections via `models/Product.js`, `User.js`, `Order.js` |

---

*CodeAlpha Full Stack Development Internship — Task 1 (Simple E-commerce Store). Author: Sharmake Hassan Said.*
