# 📝 Task Manager API

A RESTful Task Management API built using **Express**, **TypeScript**, and **MongoDB**, secured via **OAuth 2.0 authentication** with Google using `passport.js`. This project focuses on clean architectural separation and real-world authentication flows with persistent session storage in MongoDB.

---

## 🚀 Features

- 🔐 OAuth 2.0 Login with Google
- 🗂️ CRUD operations for personal task tracking
- 🧑‍💼 Session-based authentication using `express-session` + `connect-mongo`
- 🔄 Persistent login sessions stored in MongoDB
- ⚙️ Modular structure using TypeScript

---

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Session Store**: connect-mongo
- **Environment Management**: dotenv

---

## 📚 REST API Endpoints

> All endpoints require authentication via Google OAuth.

### 🔐 Auth

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | `/auth/google` | Initiate Google OAuth |
| GET    | `/auth/callback` | OAuth redirect handler |
| GET    | `/auth/logout` | Logout user          |
| GET    | `/user`        | Get current user info |

---

### ✅ Tasks

| Method | Endpoint       | Description            | Request Body                                     |
|--------|----------------|------------------------|--------------------------------------------------|
| GET    | `/tasks`       | Get all tasks of user  | —                                                |
| POST   | `/tasks`       | Create a new task      | `{ title, description, dueDate }`               |
| PUT    | `/tasks/:id`   | Update a specific task | `{ title?, description?, dueDate?, status? }`   |
| DELETE | `/tasks/:id`   | Delete a task          | —                                                |

---

## 🧠 Task Model (Schema)

| Field       | Type      | Description                                   |
|-------------|-----------|-----------------------------------------------|
| `title`     | String    | Required short name of the task               |
| `description`| String   | Optional detailed description                 |
| `createdBy` | ObjectId  | Reference to the User model                   |
| `timestamps`| Date      | Auto-managed `createdAt`, `updatedAt`         |

---

## 🛡️ Session Storage (via MongoDB)

Sessions are stored in MongoDB using `connect-mongo`. This ensures login persistence across server restarts.

```ts
ttl: 60 * 60 * 24 * 7      // Sessions expire in 7 days
autoRemove: "native"       // Expired sessions are cleaned automatically
