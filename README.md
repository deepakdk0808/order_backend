# High-Level Design: Order Management System (OMS)

## 1. Overview

The Order Management System (OMS) allows users to browse products, place orders, and track order status in real-time. Admin users can manage products, view all orders, update order statuses, and handle cancellations. The system uses a **MERN stack** (MongoDB, Express.js, React.js) with **Socket.IO** for real-time updates.

---

## 2. Architecture Diagram

```
Frontend (React + MUI + Socket.IO Client)
        |
        v
Backend (Express.js + Socket.IO + REST API)
        |
        v
Database (MongoDB Atlas)
```

---

## 3. Modules

### A. Authentication & Authorization

* **Signup/Login** for Customers and Admins
* JWT-based auth middleware to protect routes
* Role-based access control (`customer`, `admin`)

### B. Inventory Module

* CRUD operations for products (Admin only)
* Fields: `productId`, `name`, `category`, `price`, `description`, `imageUrl`, `isAvailable`

### C. Order Module

* Customers can create orders by selecting items and quantity
* Admins can:

  * View all orders
  * Update status (`PENDING` → `PAID` → `FULFILLED`)
  * Cancel orders within 60 seconds
* Order data includes: `items`, `paymentCollected`, `status`, `timestamps`

### D. Real-time Updates

* **Socket.IO** integration for order status tracking
* Server emits updates after 60 seconds to clients
* Clients listen and update UI in real time

### E. Error Handling & Logging

* Standardized error responses (status, message)
* Basic logging for requests and error events

### F. Health Check

* `/healthz` route to verify server uptime

---

## 4. Deployment

### Backend

* Hosted on **Render**
* Exposes REST APIs + WebSocket endpoint
* CORS configured for Vercel and localhost

### Frontend

* Hosted on **Vercel**
* Uses Axios and Socket.IO client to interact with backend

---

## 5. Future Enhancements

* Payment gateway integration
* Admin dashboard analytics
* Multi-role user support
* Notification system

---

## 6. Technologies Used

* **Frontend:** React.js, MUI, Axios, Socket.IO-client
* **Backend:**  Express.js, MongoDB, Socket.IO, JWT
* **Database:** MongoDB Atlas
* **Hosting:** Vercel (Frontend), Render (Backend)

---

## 7. Repositories

* **Frontend:** [order-frontend](https://github.com/deepakdk0808/order-frontend)
* **Backend:** [order-backend](https://github.com/deepakdk0808/order_backend)
