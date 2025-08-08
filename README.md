# Task Tracker App

A full-stack task tracking application with user authentication, task management, overdue tracking, and image upload functionality.

---

## 📁 Repository Structure

/frontend
└── Task-Manager # Frontend React app (Vite)

├── components # Reusable UI components

├── context # Global state (auth, etc.)

├── hooks # Custom React hooks

├── pages # Auth, dashboard, etc.

├── routes # App routes

├── utils # Helper functions

└── ... # Vite standard structure

/backend
├── config/db.js # MongoDB connection

├── controllers/ # Business logic

│ ├── authController.js

│ └── taskController.js

├── middlewares/ # Custom Express middlewares

│ ├── authMiddleware.js

│ └── uploadMiddleware.js

├── models/ # Mongoose schemas

│ ├── User.js

│ └── Task.js

├── routes/ # Express routes

│ ├── authRoutes.js

│ └── taskRoutes.js

├── uploads/ # Stored image files

└── server.js # Express server entry


---

## ⚙️ Setup Instructions

### 1. Clone the Repository


git clone https://github.com/yourusername/task-tracker.git
cd task-tracker


2. Backend Setup
cd backend
cp .env.example .env  # Provide your own MongoDB URI and JWT secret

npm install
npm run dev
This will start the backend server on http://localhost:5000.

3. Frontend Setup
cd frontend/Task-Manager
npm install
npm run dev
This will start the frontend dev server on http://localhost:5173.

📄 .env Example
Create a .env file in /backend using the following structure:

PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=optional_or_remove
