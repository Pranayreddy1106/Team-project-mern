# MERN Course Platform Backend

This is the backend of an online learning platform built using Node.js, Express.js, MongoDB, and Socket.io. The backend handles authentication, course management, lectures, quizzes, payments, reviews, certificates, progress tracking, and real-time chat functionality.
## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io
* bcryptjs
* dotenv
* CORS

---

# Backend Folder Structure

```bash
backend/
│
├── config/
│   ├── db.js
│   └── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── course.controller.js
│   ├── lecture.controller.js
│   ├── quiz.controller.js
│   ├── progress.controller.js
│   ├── payment.controller.js
│   ├── review.controller.js
│   └── certificate.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
│
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Lecture.js
│   ├── Quiz.js
│   ├── QuizAttempt.js
│   ├── Progress.js
│   ├── Payment.js
│   ├── Review.js
│   └── Certificate.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── course.routes.js
│   ├── lecture.routes.js
│   ├── quiz.routes.js
│   ├── progress.routes.js
│   ├── payment.routes.js
│   ├── review.routes.js
│   └── certificate.routes.js
│
├── sockets/
│   └── chat.socket.js
│
├── utils/
│
├── .env
├── app.js
├── server.js
├── package.json
└── req.http
```

---

# What the Backend Does

## Authentication System

The backend provides JWT-based authentication for three types of users:

* Student
* Instructor
* Admin

Features:

* User registration
* User login
* Password hashing using bcryptjs
* Token verification
* Role-based access control

---

## User Management

Users can:

* View their profile
* Update profile information
* View learning statistics

Admins can:

* View all users
* Filter users by role
* Delete users

---

## Course Management

Instructors can:

* Create courses
* Add course details
* Manage course content

Students can:

* View course details
* Enroll in free or paid courses
* Access enrolled courses

---

## Lecture Management

Instructors can:

* Add lectures to courses
* Upload video URLs
* Add lecture resources
* Delete lectures

Students can:

* Watch lectures
* Access preview lectures before enrollment

---

## Quiz System

The platform supports:

* Multiple choice quizzes
* Automatic score calculation
* Pass/fail evaluation
* Quiz attempt tracking

Students can attempt quizzes after enrolling in a course.

---

## Progress Tracking

The backend tracks:

* Completed lectures
* Last watched timestamp
* Overall course progress percentage

Students can continue learning from where they stopped.

---

## Certificate Generation

After completing a course, students can:

* Generate certificates
* View certificate details
* Download completion proof

Each certificate contains a unique certificate ID.

---

## Reviews and Ratings

Students can:

* Give ratings from 1 to 5
* Write course reviews

The backend prevents duplicate reviews from the same student for the same course.

---

## Payment System

The backend supports:

* Paid course enrollment
* Payment status tracking
* Automatic enrollment after successful payment

---

## Real-Time Chat

Socket.io is used for:

* Course-based chat rooms
* Sending messages instantly
* User join/leave notifications
* Real-time communication between users

---

# API Base URL

```bash
http://localhost:5000/api
```

---

# Main API Modules

| Module          | Purpose                        |
| --------------- | ------------------------------ |
| Auth API        | Login and registration         |
| User API        | Profile and user management    |
| Course API      | Course creation and enrollment |
| Lecture API     | Lecture management             |
| Quiz API        | Quiz creation and attempts     |
| Progress API    | Learning progress tracking     |
| Payment API     | Paid enrollments               |
| Review API      | Ratings and feedback           |
| Certificate API | Certificate generation         |

---

# Installation

## Clone Project

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-course
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Start Server

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# Important Backend Features

* JWT Authentication
* Role-Based Authorization
* MongoDB Database Integration
* REST API Architecture
* Real-Time Chat using Socket.io
* Error Handling Middleware
* Secure Password Hashing
* Course Progress Tracking
* Quiz Evaluation System
* Certificate Generation

---

# Testing

API testing can be done using:

* Postman
* REST Client Extension
* cURL

Example:

```bash
POST /api/auth/register
POST /api/auth/login
GET /api/courses/:id
POST /api/courses/:id/enroll
```

---

# Project Status

The backend is fully functional and includes:

* Authentication
* Course management
* Quiz system
* Progress tracking
* Certificates
* Reviews
* Payments
* Real-time chat
* Role-based access control

The project is ready for further frontend integration and deployment.

