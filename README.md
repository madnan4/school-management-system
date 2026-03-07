# School Management System

A full-stack School Management System with dedicated portals for Admins, Teachers, and Students. Built with Node.js/Express, MySQL, React 19, and Tailwind CSS.

---

## Features

- JWT authentication with role-based access control (Admin / Teacher / Student)
- Multi-school support — all data is scoped to a school
- Admin portal: manage schools, users, classes, subjects, teacher assignments, and student enrollments
- Teacher portal: record attendance and grades per class
- Student portal: view own attendance and grades (auto-scoped on the backend)
- Auto-initializes the database schema on server startup

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite 7, Tailwind CSS v4, React Router v7, Axios |
| Backend    | Node.js, Express 5, JWT, bcrypt                 |
| Database   | MySQL                                           |

---

## Project Structure

```
school-management-system/
├── client/                  # React frontend
│   └── src/
│       ├── api/axios.js         # Axios instance (baseURL=/api, auto JWT header)
│       ├── context/
│       │   ├── AuthContext.jsx  # Global auth state (login/logout)
│       │   └── ToastContext.jsx # Toast notifications
│       ├── components/
│       │   ├── Layout.jsx       # Sidebar with role-based navigation
│       │   └── ProtectedRoute.jsx # Role-based route guard
│       └── pages/
│           ├── Login.jsx
│           ├── Profile.jsx
│           ├── admin/           # Schools, Users, Classes, Subjects, Assignments, Enrollments
│           ├── teacher/         # Attendance, Grades
│           └── student/         # MyAttendance, MyGrades
│
└── server/                  # Express backend
    ├── server.js            # Entry point (port 3600)
    ├── schema.sql           # Database schema (source of truth)
    ├── models/
    │   ├── db.js            # MySQL connection pool
    │   └── initDB.js        # Runs schema.sql on startup
    ├── middleware/
    │   └── auth.js          # authenticate + authorize middleware
    ├── controllers/         # Business logic per resource
    ├── routes/              # Express routers per resource
    └── http/                # .http files for manual API testing
```

---

## Database Schema

| Table            | Description                                              |
|------------------|----------------------------------------------------------|
| `schools`        | School records (name, director, email, address)          |
| `users`          | All users with roles: `admin`, `teacher`, `student`      |
| `classes`        | Classes per school (e.g. "Grade 10A")                    |
| `subjects`       | Subjects per school (e.g. "Mathematics")                 |
| `class_subjects` | Assigns a teacher to a subject within a class            |
| `student_classes`| Enrolls a student into a class                           |
| `attendance`     | Daily attendance per student/class (present/absent/late) |
| `grades`         | Grade per student/subject/class/term                     |

All foreign keys use `ON DELETE CASCADE`.

---

## API Endpoints

| Method | Endpoint                   | Access              | Description                        |
|--------|----------------------------|---------------------|------------------------------------|
| POST   | `/api/auth/login`          | Public              | Login, returns JWT                 |
| GET    | `/api/schools`             | Admin               | List all schools                   |
| POST   | `/api/schools`             | Admin               | Create a school                    |
| PATCH  | `/api/schools/:id`         | Admin               | Update a school                    |
| DELETE | `/api/schools/:id`         | Admin               | Delete a school                    |
| GET    | `/api/users`               | Admin               | List users                         |
| POST   | `/api/users`               | Admin               | Create a user                      |
| PATCH  | `/api/users/:id`           | Admin               | Update a user                      |
| DELETE | `/api/users/:id`           | Admin               | Delete a user                      |
| GET    | `/api/classes`             | Admin, Teacher      | List classes                       |
| POST   | `/api/classes`             | Admin               | Create a class                     |
| PATCH  | `/api/classes/:id`         | Admin               | Update a class                     |
| DELETE | `/api/classes/:id`         | Admin               | Delete a class                     |
| GET    | `/api/subjects`            | Admin, Teacher      | List subjects                       |
| POST   | `/api/subjects`            | Admin               | Create a subject                   |
| PATCH  | `/api/subjects/:id`        | Admin               | Update a subject                   |
| DELETE | `/api/subjects/:id`        | Admin               | Delete a subject                   |
| GET    | `/api/class-subjects`      | Admin, Teacher      | List teacher assignments           |
| POST   | `/api/class-subjects`      | Admin               | Assign teacher to class/subject    |
| DELETE | `/api/class-subjects/:id`  | Admin               | Remove assignment                  |
| GET    | `/api/enrollments`         | Admin               | List student enrollments           |
| POST   | `/api/enrollments`         | Admin               | Enroll a student in a class        |
| DELETE | `/api/enrollments/:id`     | Admin               | Remove enrollment                  |
| GET    | `/api/attendance`          | All roles           | Get attendance (students see own)  |
| POST   | `/api/attendance`          | Teacher             | Record attendance                  |
| PATCH  | `/api/attendance/:id`      | Teacher             | Update attendance record           |
| GET    | `/api/grades`              | All roles           | Get grades (students see own)      |
| POST   | `/api/grades`              | Teacher             | Record a grade                     |
| PATCH  | `/api/grades/:id`          | Teacher             | Update a grade                     |

---

## Setup & Running

### Prerequisites

- Node.js 18+
- MySQL running locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/school-management-system.git
cd school-management-system
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env   # or create .env manually
```

`.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
JWT_SECRET=your_jwt_secret
```

```bash
npm install
npm run dev   # starts on http://localhost:3600
```

The database and all tables are created automatically on first run.

### 3. Run the frontend

```bash
cd client
npm install
npm run dev   # starts on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:3600`, so no CORS configuration is needed.

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

The token is returned from `POST /api/auth/login` and stored in `localStorage` by the frontend. The Axios instance in `client/src/api/axios.js` attaches it automatically to every request.

---

## Role Permissions Summary

| Feature               | Admin | Teacher | Student |
|-----------------------|-------|---------|---------|
| Manage schools        | Yes   | No      | No      |
| Manage users          | Yes   | No      | No      |
| Manage classes        | Yes   | No      | No      |
| Manage subjects       | Yes   | No      | No      |
| Assign teachers       | Yes   | No      | No      |
| Enroll students       | Yes   | No      | No      |
| Record attendance     | No    | Yes     | No      |
| Record grades         | No    | Yes     | No      |
| View attendance       | Yes   | Yes     | Own only|
| View grades           | Yes   | Yes     | Own only|