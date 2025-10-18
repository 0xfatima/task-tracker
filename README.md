<!-- # Task Tracker App

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
This will start the backend server on http://localhost:8000.

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
ADMIN_INVITE_TOKEN=optional_or_remove -->


# Task Manager App

A full-stack **Task Manager** application built with **MERN stack** to track tasks efficiently. It allows users to create, manage, and visualize tasks with AI-generated suggestions, reminders, and detailed dashboards.

---

## 🌟 Features

- **Task Dashboard**: Visualize completed, in-progress, and incomplete tasks with a pie chart.
- **Task Management**: 
  - Create descriptive tasks
  - Break tasks into subtasks / To-Do lists
  - Check off subtasks to automatically update task status
  - Edit tasks, add/remove items, and update descriptions
- **Task Statuses**: Complete, In Progress, Incomplete
- **Task Priorities**: High, Medium, Low
- **AI Assistance**: Generate suggestions for To-Do lists using **Llama-3.1-8b-Instant** via **Groq AI**.
- **Notifications**: Email reminders for tasks due within 1 day using **NodeMailer**.
- **User Authentication**: Secure login/signup with JWT tokens
- **Inspirational Quotes**: Fetches daily motivational quotes on login and signup pages to keep users inspired.


## 📁 Repository Structure

### Frontend (React + Vite)

frontend/Task-Manager
├── src/pages/auth/
│ ├── login.jsx
│ └── signup.jsx
├── src/pages/user/
│ ├── createtasks.jsx
│ ├── dashboard.jsx
│ ├── managetasks.jsx
│ ├── mytasks.jsx
│ └── viewtaskdetails.jsx
├── src/routes/
├── src/utils/
├── src/context/
├── src/hooks/
├── src/components/
└── src/assets/


### Backend (Node.js + Express + MongoDB)

backend/
├── config/
├── controllers/
│ ├── authcontroller.js
│ ├── LLMcontroller.js
│ └── taskcontroller.js
├── emailService/
│ ├── emailservice.js
│ └── taskschedular.js
├── middlewares/
│ ├── authmiddleware.js
│ └── uploadmiddleware.js
├── models/
│ └── task.js
├── routes/
│ ├── authroutes.js
│ └── taskroutes.js
└── server.js

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```
### 2. Backend Setup

```bash
cd backend
cp .env.example .env  # Provide your own MongoDB URI and JWT secret
npm install
npm run dev
``` 
Backend server will run at: http://localhost:8000

### 2. Frontend Setup
```bash
cd frontend/Task-Manager
npm install
npm run dev
```

Frontend server will run at: http://localhost:5173

# .env Example

PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret

## Tech Stack

### Frontend: React, Vite, TailwindCSS (optional)

### Backend: Node.js, Express

### Database: MongoDB

### Authentication: JWT

### AI Integration: Llama 3.1 via Groq AI

### Email Notifications: NodeMailer

### Task Scheduling: Node Cron