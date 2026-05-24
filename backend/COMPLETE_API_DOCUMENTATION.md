# MERN Course Platform - Complete Backend API

A full-featured online learning platform built with Node.js, Express, MongoDB, and Socket.io. This backend supports multiple user roles (Student, Instructor, Admin), course management, quizzes, payments, reviews, certificates, and real-time chat.

##  Features Implemented

###  Authentication & Authorization
- User registration with role selection (student/instructor/admin)
- JWT-based authentication (7-day expiry)
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Secure token verification middleware

###  User Management
- User profile management (view, update)
- User statistics (courses enrolled, certificates, quiz scores)
- Admin user management (view all users, filter by role)
- Public profile viewing

###  Course Management
- Create courses (instructor only)
- View course details with instructor & lecture info
- Student enrollment (free and paid)
- Get enrolled courses
- Check enrollment status

###  Lecture Management
- Add lectures to courses (instructor only)
- Video URL storage with metadata
- Lecture resources (PDFs, code files, etc.)
- Preview lectures for non-enrolled students
- Delete lectures (instructor only)

###  Quiz & Assessment
- Create quizzes with multiple-choice questions (instructor for own courses, admin for any course)
- Get quiz details
- Attempt quizzes with answer tracking
- Auto-scoring with pass/fail determination (75% threshold)
- Quiz attempt history

###  Payments
- Process payments and auto-enroll students (demo mode)
- Payment status tracking (pending/paid/failed)
- Transaction ID generation
- Duplicate payment prevention

###  Reviews & Ratings
- Student reviews (1-5 star ratings)
- Comments and feedback
- One review per student per course
- View all course reviews

###  Certificates
- Certificate generation after course completion
- Unique certificate IDs
- Issue date tracking
- Certificate retrieval

###  Progress Tracking
- Track lecture completion
- Store watch timestamps
- Calculate progress percentage
- View overall progress

###  Real-time Chat
- Socket.io integration
- Room-based conversations
- Message history
- User presence notifications

##  Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: bcryptjs, CORS
- **Utilities**: Dotenv, Multer (configured), Cloudinary (configured)

##  Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone and Setup**
```bash
cd Team-project-mern/backend
npm install
```

2. **Environment Variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

4. **Run Server**
```bash
# Development with nodemon
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

##  API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // student, instructor, admin
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user: { id, name, email, role } }
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

### User Endpoints

#### Get My Profile
```http
GET /users/me/profile
Authorization: Bearer {token}
```

#### Update My Profile
```http
PUT /users/me/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get My Stats
```http
GET /users/me/stats
Authorization: Bearer {token}

Response: { totalCoursesEnrolled, totalCertificates, averageQuizScore, ... }
```

#### Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer {adminToken}
```

### Course Endpoints

#### Create Course (Instructor Only)
```http
POST /courses
Authorization: Bearer {instructorToken}
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course description",
  "category": "Web Development",
  "thumbnail": "https://example.com/thumb.jpg",
  "price": 49.99
}
```

#### Get Course Details
```http
GET /courses/{courseId}
```

#### Get My Enrolled Courses
```http
GET /courses/my
Authorization: Bearer {studentToken}
```

#### Enroll in Course (Free)
```http
POST /courses/{courseId}/enroll
Authorization: Bearer {studentToken}
```

### Lecture Endpoints

#### Add Lecture (Instructor Only)
```http
POST /lectures/{courseId}
Authorization: Bearer {instructorToken}
Content-Type: application/json

{
  "title": "Lecture Title",
  "videoUrl": "https://youtu.be/dQw4w9WgXcQ",
  "description": "Lecture description",
  "duration": 1800,  // in seconds
  "isPreview": true,
  "resources": [
    { "title": "PDF", "url": "https://example.com/pdf.pdf" }
  ]
}
```

#### Get Lectures
```http
GET /lectures/{courseId}
Authorization: Bearer {token}
```

#### Delete Lecture (Instructor Only)
```http
DELETE /lectures/{lectureId}
Authorization: Bearer {instructorToken}
```

### Quiz Endpoints

#### Create Quiz (Instructor/Admin)
```http
POST /quizzes/quiz/{courseId}
Authorization: Bearer {instructorToken}
Content-Type: application/json

{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0  // index 0-3
    }
  ]
}
```

#### Get Quiz
```http
GET /quizzes/quiz/{courseId}
Authorization: Bearer {token}
```

#### Attempt Quiz
```http
POST /quizzes/quiz/attempt/{courseId}
Authorization: Bearer {studentToken}
Content-Type: application/json

{
  "answers": [0, 1, 2, 3]  // indices of selected options
}

Response: { score, passed, attempt: {...} }
```

### Payment Endpoints

#### Create Payment
```http
POST /payments/create
Authorization: Bearer {studentToken}
Content-Type: application/json

{
  "courseId": "{courseId}"
}
```

### Review Endpoints

#### Add Review
```http
POST /reviews
Authorization: Bearer {studentToken}
Content-Type: application/json

{
  "courseId": "{courseId}",
  "rating": 5,  // 1-5
  "comment": "Great course!"
}
```

#### Get Course Reviews
```http
GET /reviews/course/{courseId}
```

### Certificate Endpoints

#### Generate Certificate
```http
POST /certificates/certificate/generate
Authorization: Bearer {studentToken}
Content-Type: application/json

{
  "courseId": "{courseId}"
}
```

#### Get Certificate
```http
GET /certificates/certificate/{courseId}
Authorization: Bearer {studentToken}
```

### Progress Endpoints

#### Update Progress
```http
POST /progress/update
Authorization: Bearer {studentToken}
Content-Type: application/json

{
  "courseId": "{courseId}",
  "lectureId": "{lectureId}",
  "timestamp": 300  // in seconds
}
```

#### Get Course Progress
```http
GET /progress/{courseId}
Authorization: Bearer {studentToken}
```

#### Get Progress Percentage
```http
GET /progress/{courseId}/percentage
Authorization: Bearer {studentToken}

Response: { percentage, completed, total }
```

#### Get All Progress
```http
GET /progress
Authorization: Bearer {studentToken}
```

## 🔐 Authentication

### Token Format
```
Authorization: Bearer {jwt_token}
```

### Token Claims
```json
{
  "id": "user_id",
  "role": "student|instructor|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Expiry
- 7 days from creation

## 🎯 Role-Based Access Control

| Endpoint | Student | Instructor | Admin |
|----------|---------|------------|-------|
| Create Course | ✗ | ✓ | ✓ |
| Create Quiz | ✗ | ✓ | ✓ |
| Attempt Quiz | ✓ | ✗ | ✗ |
| Manage Users | ✗ | ✗ | ✓ |
| Enroll Course | ✓ | ✗ | ✗ |
| Add Review | ✓ | ✓ | ✓ |
| Create Certificate | ✓ | ✗ | ✗ |

##  Socket.io Chat

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Events

#### Join Room
```javascript
socket.emit('join_room', {
  token: 'jwt_token',
  roomId: 'course_id'
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'course_id',
  token: 'jwt_token',
  message: 'Hello everyone!'
});

// Listen for messages
socket.on('receive_message', (data) => {
  console.log(data.message);
});
```

#### Leave Room
```javascript
socket.emit('leave_room', {
  roomId: 'course_id',
  token: 'jwt_token'
});
```

##  Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|instructor|admin),
  bio: String,
  avatar: String,
  currentToken: String,
  timestamps: true
}
```

### Course
```javascript
{
  title: String (required),
  description: String,
  category: String,
  thumbnail: String,
  instructor: ObjectId (User),
  price: Number,
  lectures: [ObjectId] (Lecture),
  students: [ObjectId] (User),
  averageRating: Number,
  timestamps: true
}
```

### Lecture
```javascript
{
  title: String (required),
  videoUrl: String (required),
  description: String,
  duration: Number,
  isPreview: Boolean,
  resources: [{title, url}],
  courseId: ObjectId (Course),
  timestamps: true
}
```

### Quiz
```javascript
{
  courseId: ObjectId (Course),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  timestamps: true
}
```

### Progress
```javascript
{
  userId: ObjectId (User),
  courseId: ObjectId (Course),
  completedLectures: [ObjectId] (Lecture),
  lastWatched: {
    lectureId: ObjectId,
    timestamp: Number
  },
  timestamps: true
}
```

### Certificate
```javascript
{
  userId: ObjectId (User),
  courseId: ObjectId (Course),
  certificateId: String (unique),
  issuedAt: Date,
  timestamps: true
}
```

## 🧪 Testing

Use the provided `req.http` file with REST Client extension:

1. Install "REST Client" extension in VS Code
2. Open `req.http` file
3. Click "Send Request" on any endpoint
4. Copy tokens from login responses to test authenticated endpoints

## ⚠️ Bug Fixes Applied

✅ Fixed MongoDB ID references (req.user._id instead of req.user.id)
✅ Fixed Review model typo (insturctorId → instructorId)
✅ Fixed User schema currentToken field placement
✅ Fixed Quiz GET route from POST method

## 🔧 Configuration

### Environment Variables (.env)

```env
# Required
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/Team-project-mern
JWT_SECRET=supersecret123

# Optional
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_USER=
SMTP_PASS=
```

## 🚨 Error Handling

All endpoints return proper HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## 📝 Future Enhancements

- [ ] Email notifications (nodemailer configured)
- [ ] File uploads (multer & cloudinary configured)
- [ ] Advanced search and filtering
- [ ] Course categories and tags
- [ ] Student-Instructor messaging
- [ ] Discussion forums
- [ ] Assignment submissions
- [ ] Video streaming optimization
- [ ] Analytics dashboard
- [ ] Course recommendations

## 📄 License

ISC

## 👨‍💻 Author

Created as a complete MERN course platform backend

---

**Happy Learning! 🎓**
