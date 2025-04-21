# 💸 Build a Basic Version of PayTM

A simplified clone of PayTM featuring **transaction sessions using MongoDB**, **user authentication with JWT**, and **bulk search queries**. Built with a **React.js frontend** and an **Express.js backend**.

[🔗 Live Demo](https://transaction-session-mongodb.vercel.app/signup)

---

## 🚀 Tech Stack

### 🔧 Backend (Express.js)
- **Node.js** + **Express.js**
- **MongoDB** with **transaction sessions**
- **Mongoose** ODM
- **JWT Token** based authentication
- **Express Router** for clean route structure
- MongoDB `$regex` for **LIKE queries** on `/bulk` route

### 🎨 Frontend (React.js)
- React.js with hooks
- Axios for HTTP requests
- LocalStorage for persisting JWT tokens

---

## 📦 Features

- ✅ Signup & Login with JWT
- ✅ Store JWT in localStorage for session management
- ✅ Send money between users using **MongoDB transaction sessions**
- ✅ Secure routing using middleware
- ✅ Search users using **LIKE-style queries** via `$regex`
- ✅ Modular code using **Express Router**

---

