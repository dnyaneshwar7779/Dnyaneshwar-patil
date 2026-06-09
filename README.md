# NanuGujar — Premium Clothing E-Commerce Store (MERN Stack)

NanuGujar is a modern, responsive, and secure full-stack MERN (MongoDB, Express, React, Node) e-commerce website specializing in online T-shirts and Pants sales.

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Home Showcase:** sliding hero banner, visual category blocks (T-shirts & Pants), and hot/new arrivals.
- **Product Catalog:** quick search, category filtering (T-Shirts vs Pants), price range sliders, and multi-option sorting (Newest, Price Ascending/Descending, Ratings).
- **Product Details:** size selector (S, M, L, XL), stock check indicator, reviews timeline, and write-review submissions.
- **Shopping Cart:** animated sliding drawer, quantity adjusts, item deletion, and free shipping incentive warning tracker.
- **Checkout Process:** shipping address verification, COD / UPI selections, order pricing summary invoices, and successful checkout feedback screen.
- **User Center:** user profile updates and detailed order history tracker.

### 🛡️ Admin Controls
- **Secured Dashboard:** statistical metrics (total sales revenue, orders processed, clothes catalog count, users registered), custom daily sales bar-chart diagrams, and category sales breakdowns.
- **Product CRUD:** create, edit, or delete clothing items with pricing, discounts, stock count, and images.
- **Order Management:** fulfillment controls (process, ship, or deliver orders) and automatic payment logging.
- **Users Management:** toggle admin privileges and delete accounts.

---

## 📁 Project Structure

```text
nanugujar/
├── server/                    # Node.js + Express API
│   ├── config/                # Database connection configuration
│   ├── controllers/           # Auth, product, order, category, review, and cart controllers
│   ├── middleware/            # JWT validation, error routing, and admin control middleware
│   ├── models/                # User, Product, Category, Review, and Order schemas
│   ├── routes/                # REST api route maps
│   ├── utils/                 # Token generator and database seeder
│   ├── .env                   # Configuration file (MongoDB URI, JWT secret, ports)
│   └── package.json
│
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Layout elements (Header, Footer, ProtectedRoute)
│   │   ├── context/           # Global states (AuthContext, CartContext)
│   │   ├── pages/             # Home, catalog, checkout, profile, admin and contact pages
│   │   ├── services/          # REST fetch API wrapper client
│   │   ├── App.jsx            # Routing configurations
│   │   ├── index.css          # Tailwind CSS v4 imports + custom brand theme
│   │   └── main.jsx           # Vite renderer entry
│   ├── index.html             # SEO tags & Outfit/Inter Google fonts imports
│   └── package.json
```

---

## 🛠️ Installation & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI link.

### 2. Database Seeding
Open a terminal in the project directory and run the database seeder to configure default categories, accounts, and sample clothing products:
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Run the DB seeder script
npm run seed
```

### 3. Server Startup
Start the Node.js development server:
```bash
# Run server in watch mode
npm run dev
```
The server API will start on **http://localhost:5000**.

### 4. Client Startup
Open a separate terminal in the project directory and start the Vite React development server:
```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
The storefront will launch on **http://localhost:5173**. Open this URL in your web browser.

---

## 🔑 Default Login Credentials

After running the seeder script, the following profiles will be initialized:

| Account Type | Login Email / ID | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `nanugujar` (or `nanugujar@nanugujar.com`) | `nanu@123` | Access Admin Dashboard, CRUD, and Sales reports |
| **Customer** | `customer@customer.com` | `customer123` | Browse shop, add reviews, and place checkout orders |

---

## 🔒 Security Configuration
- **Password Hashing:** uses `bcryptjs` for encryption.
- **Token Protection:** uses `jsonwebtoken` (JWT) for secure REST authorization headers.
- **Express Security:** mounts `helmet` headers, `cors` cross-origin permissions, and `express-rate-limit` to prevent denial-of-service spamming.
