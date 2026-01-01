# ⚙️ Bero Tasker - Backend API

This is the robust backend service for **Bero Tasker**, a full-stack productivity application. Built with **Node.js** and **Express**, it provides a secure and scalable RESTful API to manage user data, tasks, and personal notes.

---

## 🚀 Features

* **User Authentication:** Secured using **Clerk** (Middleware integration).
* **Task Management:** Full CRUD operations for creating, reading, updating, and deleting tasks.
* **Notes Management:** Dedicated endpoints for organizing personal notes.
* **Advanced Logic:** Custom server-side sorting for tasks based on priority and due dates.
* **Data Integrity:** Validated schemas using **Mongoose** for MongoDB.

---

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas
* **ORM:** Mongoose
* **Security:** Clerk Express SDK, CORS
* **Development:** Nodemon, Dotenv

---

## 📂 Project Structure

```text
├── src/
│   ├── models/      # Mongoose Schemas (Task, Note)
│   ├── routes/      # API Endpoints
│   ├── middleware/  # Auth & Error handling
│   └── app.js       # Entry point
└── .env             # Environment variables
```

## 🚦 Getting Started
**1. Prerequisites**
* Node.js installed.
* MongoDB connection string (Atlas or Local).

**2. Installation**
* Clone the repository and install dependencies:

```
git clone https://github.com/ibrahimdayoub/tasker-backend.git
cd tasker-backend
npm install
```

**3. Environment Variables**
* Create a .env file in the root directory and add:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```

**4. Run the Server**

```
# For development
npm run dev

# For production
npm start
```

## 🔗 Related Project
This API powers the [Bero Tasker Mobile App](https://github.com/ibrahimdayoub/tasker-frontend)
