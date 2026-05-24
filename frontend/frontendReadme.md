# Online Learning Platform [udemy clone] Frontend

This is the frontend of an online learning platform built using React.js, Tailwind CSS, React Router, Axios, and Socket.io Client.
The frontend provides a modern user interface for students, instructors, and admins to access courses, lectures, quizzes, certificates, reviews, payments, and real-time chat features.

## Technologies Used

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* Socket.io Client
* React Icons
* React Toastify
* Context API
* Custom Hooks

---

# Frontend Folder Structure

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   │
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── Stats.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── courses/
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseGrid.jsx
│   │   │   ├── CourseFilter.jsx
│   │   │   ├── CourseDetailView.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── lectures/
│   │   │   ├── LectureList.jsx
│   │   │   ├── LectureNote.jsx
│   │   │   ├── LecturePlayer.jsx
│   │   │   └── LectureVideo.jsx
│   │   │
│   │   ├── quizzes/
│   │   │   ├── QuizCard.jsx
│   │   │   ├── QuizForm.jsx
│   │   │   ├── QuizQuestion.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── reviews/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── RoomList.jsx
│   │   │
│   │   └── payment/
│   │       └── FakePaymentButton.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CourseContext.jsx
│   │   ├── NotificationContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCourse.js
│   │   ├── useFetch.js
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AllCourses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── LectureView.jsx
│   │   ├── QuizPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PublicProfile.jsx
│   │   ├── CertificatesPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── AdminPanel.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── certificateService.js
│   │   ├── chatService.js
│   │   ├── courseService.js
│   │   ├── lectureService.js
│   │   ├── paymentService.js
│   │   ├── progressService.js
│   │   ├── quizService.js
│   │   ├── reviewService.js
│   │   └── userService.js
│   │
│   ├── utils/
│   │   ├── debounce.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   ├── tokenManager.js
│   │   ├── validators.js
│   │   └── video.js
│   │
│   ├── constants/
│   │   ├── index.js
│   │   └── mockCourses.js
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

# What the Frontend Does

## Authentication System

The frontend provides authentication interfaces for:

* Student
* Instructor
* Admin

Features:

* Login page
* Registration page
* JWT token handling
* Protected routes
* Persistent login using localStorage

Currently:

* Admin functionality is available through login-based access only.

---

## User Dashboard

Students can:

* View enrolled courses
* Track progress
* Access certificates
* Continue lectures
* Attempt quizzes

Instructors can:

* Manage their courses
* Add lectures
* Create quizzes
* Monitor student activity
* View reviews and ratings

Admins can:

* Access admin dashboard
* Manage users and courses
* Remove courses
* Access chat moderation controls
* Monitor platform activities

---

## Course System

Students can:

* Browse courses
* View course details
* Enroll in courses
* Watch preview lectures

Instructors can:

* Create courses
* Edit course content
* Upload lecture materials

---

## Lecture System

Features:

* Video lecture player
* Lecture lists
* Notes section
* Continue watching support
* Lecture progress updates

---

## Quiz System

Students can:

* Attempt quizzes
* View results instantly
* Check scores and pass/fail status

Instructors can:

* Create quizzes
* Add questions and answers
* Manage quiz content

---

## Progress Tracking

The frontend tracks:

* Completed lectures
* Course completion percentage
* Quiz attempts
* Recently watched lectures

---

## Certificate System

Students can:

* View earned certificates
* Download certificates
* Access completion proof

---

## Reviews and Ratings

Students can:

* Submit ratings
* Write reviews
* View other student feedback

---

## Payment System

The frontend currently uses a temporary payment flow.

Features:

* Fake payment button
* Automatic enrollment after clicking payment
* Simulated payment success

Currently:

* Real payment gateway integration is not implemented yet.

---

## Real-Time Chat

Socket.io Client is used for:

* Course-based chat rooms
* Real-time messaging
* Live communication
* User join/leave updates

Admins can:

* Access chat system
* Monitor conversations
* Remove inappropriate chats if needed

---

# Frontend Routing

The frontend uses React Router for page navigation.

Example routes:

```bash
/                   → Home Page
/login              → Login Page
/register           → Register Page
/dashboard          → User Dashboard
/courses            → All Courses
/course/:id         → Course Details
/lecture/:id        → Lecture View
/quiz/:id           → Quiz Page
/profile            → User Profile
/chat               → Chat Page
/admin              → Admin Panel
```

---

# API Connection

## Backend Base URL

```bash
http://localhost:5000/api
```

Frontend communicates with backend using Axios.

---

# Main Frontend Modules

| Module            | Purpose                          |
| ----------------- | -------------------------------- |
| Auth Pages        | Login and registration           |
| Dashboard         | User overview and analytics      |
| Courses           | Course browsing and enrollment   |
| Lectures          | Video playback system            |
| Quizzes           | Quiz attempt interface           |
| Reviews           | Ratings and feedback             |
| Certificates      | Certificate viewing              |
| Chat              | Real-time communication          |
| Admin Panel       | Platform management              |
| Payment Interface | Fake enrollment payment handling |

---

# Installation

## Install Dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

# Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Important Frontend Features

* Modern Responsive UI
* JWT Authentication
* Protected Routes
* Context API State Management
* Real-Time Chat
* Course Progress Tracking
* Quiz System
* Certificate Access
* Fake Payment Enrollment
* Role-Based Dashboards
* Admin Chat and Course Access
* Dark Mode Support
* Tailwind CSS Styling

---

# UI Features

The frontend includes:

* Responsive layouts
* Mobile-friendly navigation
* Dashboard cards
* Toast notifications
* Dark/light theme support
* Loading states
* Modal components
* Reusable UI components
* Glassmorphism effects
* Gradient UI styling

---

# Testing

Frontend testing can be done using:

* Browser DevTools
* React Developer Tools
* Network Tab
* Console debugging

---

# Project Status

Frontend currently includes:

* Authentication UI
* Course pages
* Lecture player
* Quiz system
* Progress tracking
* Certificates
* Reviews and ratings
* Fake payment enrollment
* Real-time chat
* Admin dashboard
* Protected routing
* Responsive design

The frontend is fully connected and ready for backend integration improvements and future deployment.
