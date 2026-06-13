<div align="center">
  <img src="https://via.placeholder.com/150/8B5CF6/FFFFFF?text=TaskManager" alt="Task Manager Logo" width="120" height="120" style="border-radius: 20px;" />
  <br />
  <br />
  <h1>🚀 TaskManager Pro</h1>
  <p>
    <strong>A highly premium, role-based Task Management application built with the modern MERN+T stack.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Default Seed Data](#-default-seed-data)
- [License](#-license)

---

## 🌟 About the Project

**TaskManager Pro** is a beautifully designed, full-stack web application developed to help teams manage their workflow seamlessly. Featuring a stunning dark-mode UI with glassmorphism elements, the application offers an incredibly premium aesthetic right out of the box. 

Beyond its looks, it is engineered with a robust Role-Based Access Control (RBAC) system, ensuring that Administrators, Managers, and Users all have tailored dashboards and permissions.

---

## ✨ Key Features

- **🎨 Premium UI/UX:** Built with Tailwind CSS, utilizing modern design trends like glassmorphism, smooth micro-animations, and a highly polished dark mode.
- **🔐 Secure Authentication:** JSON Web Tokens (JWT) are used for secure state management, alongside bcrypt for robust password hashing.
- **👥 Advanced User Management:** Dedicated dashboard for Admins to create, edit, and assign roles to new users.
- **🎯 Smart Task Assignment:** Admins and Managers can assign tasks to specific users from a dynamically populated list.
- **📊 Contextual Dashboards:** 
  - **Admins & Managers:** Enjoy a split-view dashboard showcasing "My Assigned Tasks" alongside an "All Tasks" overview.
  - **Users:** Enjoy a focused dashboard that strictly displays their assigned tasks to prevent clutter and overwhelm.
- **🌱 Auto-Seeding Database:** The application automatically bootstraps default users on startup, allowing you to jump straight into testing.

---

## 🛠 Architecture & Tech Stack

The application is split into two perfectly decoupled applications communicating via REST APIs.

### Frontend (`/client`)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Language:** TypeScript
- **State/API:** React Context API + Axios (with auto-injected Auth Interceptors)

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Language:** TypeScript
- **Security:** bcryptjs, jsonwebtoken, cors

---

## 🛡 Role-Based Access Control (RBAC)

TaskManager Pro strictly enforces permissions at both the UI and API levels:

| Feature | Admin | Manager | User |
| :--- | :---: | :---: | :---: |
| **View Own Tasks** | ✅ | ✅ | ✅ |
| **View All Tasks** | ✅ | ✅ | ❌ |
| **Edit Task Info & Assignment**| ✅ | ✅ | ❌ |
| **Create New Tasks** | ✅ | ❌ | ❌ |
| **Delete Tasks** | ✅ | ❌ | ❌ |
| **View Manage Users Page** | ✅ | ❌ | ❌ |
| **Add / Edit Users** | ✅ | ❌ | ❌ |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

---

## 🚀 Installation Guide

Follow these steps to get your development environment up and running.

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Task Manager"
```

### 2. Setup the Backend Server
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```

Start the backend development server:
```bash
npm run dev
```
*The server will start on `http://localhost:5001`. On the first run, it will automatically connect to MongoDB and seed the default users!*

### 3. Setup the Frontend Client
Open a **new** terminal window and navigate to the `client` directory:
```bash
cd client
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
*The client will start on `http://localhost:3000`. Open this URL in your browser.*

---

## 🔐 Environment Variables

The application relies on default fallbacks for convenience during development, but you can override them by creating `.env` files.

**Backend (`server/.env`):**
```env
# Optional: Defaults to 5001
PORT=5001 

# Optional: Defaults to mongodb://localhost:27017/task-manager
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager 

# Optional: Defaults to "secret"
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## 📂 Project Structure

```text
Task Manager/
├── client/                     # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   │   ├── dashboard/      # Protected Dashboard & User Management pages
│   │   │   ├── login/          # Authentication page
│   │   ├── components/         # Reusable UI Components (TaskCard, TaskModal, etc.)
│   │   ├── context/            # React Context (AuthContext for global auth state)
│   ├── tailwind.config.ts      # Tailwind styling configuration
│   └── package.json            
│
└── server/                     # Node.js + Express Backend Application
    ├── src/
    │   ├── config/             # Database connection logic
    │   ├── middleware/         # Auth protection & RBAC authorization
    │   ├── models/             # Mongoose schemas (Task, User)
    │   ├── routes/             # Express API routes (auth.routes.ts, task.routes.ts)
    │   └── index.ts            # Entry point & Auto-seeding logic
    └── package.json            
```

---

## 🔑 Default Seed Data

To make testing incredibly easy, the backend **automatically** seeds three initial accounts the first time you start the server. 

You can immediately log in with any of these credentials at `http://localhost:3000/login`:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@taskmanager.com` | `Pass@123` |
| **Manager** | `manage@taskmanager.com` | `Pass@123` |
| **User** | `user@taskmanager.com` | `Pass@123` |

*(Note: Ensure your MongoDB server is running before starting the Node backend so the seeding can complete successfully).*

---

<div align="center">
  <p>Built with ❤️ using the MERN Stack and Next.js</p>
</div>
