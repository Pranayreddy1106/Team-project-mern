# API QUICK REFERENCE GUIDE

## 🚀 Getting Started

### Start Server
```bash
npm run dev  # Development with auto-reload
npm start    # Production
```

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication

### Register
```http
POST /auth/register
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "student"  // student, instructor, admin
}
```

### Login
```http
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
Response: { token, user }
```

### Use Token
```http
Authorization: Bearer {token}
```

---

## 👤 User Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| GET | `/users/me/profile` | Any | Get my profile |
| PUT | `/users/me/profile` | Any | Update profile |
| GET | `/users/me/stats` | Any | Get my stats |
| GET | `/users/:id` | Any | Get user profile |
| GET | `/users` | Admin | All users |

---

## 📚 Course Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/courses` | Instructor | Create |
| GET | `/courses/:id` | Any | Get details |
| GET | `/courses/my` | Student | My courses |
| POST | `/courses/:id/enroll` | Student | Enroll free |

---

## 🎥 Lecture Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/lectures/:courseId` | Instructor | Add |
| GET | `/lectures/:courseId` | Auth | Get all |
| DELETE | `/lectures/:id` | Instructor | Delete |

---

## ❓ Quiz Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/quizzes/quiz/:courseId` | Instructor/Admin | Create |
| GET | `/quizzes/quiz/:courseId` | Auth | Get |
| POST | `/quizzes/quiz/attempt/:courseId` | Student | Attempt |

---

## 💰 Payment Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/payments/create` | Student | Enroll paid |

---

## ⭐ Review Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/reviews` | Auth | Add |
| GET | `/reviews/course/:id` | Any | Get all |

---

## 🎓 Certificate Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/certificates/certificate/generate` | Auth | Generate |
| GET | `/certificates/certificate/:courseId` | Auth | Get |

---

## 📊 Progress Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/progress/update` | Auth | Update |
| GET | `/progress/:courseId` | Auth | Get |
| GET | `/progress` | Auth | All |

---

## 🌐 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

---

## 🔄 Common Workflows

### Register & Login
```
1. POST /auth/register
2. POST /auth/login → Copy token
3. Use token in all requests
```

### Create Course & Teach
```
1. POST /courses → Copy courseId
2. POST /lectures/:courseId
3. POST /quizzes/quiz/:courseId
```

### Enroll & Learn
```
1. POST /courses/:id/enroll
2. POST /progress/update
3. POST /quizzes/quiz/attempt/:courseId
4. POST /reviews
5. POST /certificates/certificate/generate
```

---

## 🧪 Quick Test with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@test.com","password":"pass","role":"student"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 Example Requests (JSON)

### Create Course
```json
{
  "title": "Web Dev",
  "description": "Learn web development",
  "category": "Programming",
  "thumbnail": "https://example.com/img.jpg",
  "price": 49.99
}
```

### Add Lecture
```json
{
  "title": "HTML Basics",
  "videoUrl": "https://youtu.be/xyz",
  "description": "Learn HTML",
  "duration": 1800,
  "isPreview": true,
  "resources": [
    {"title": "PDF", "url": "https://example.com/pdf"}
  ]
}
```

### Create Quiz
```json
{
  "questions": [
    {
      "question": "2+2=?",
      "options": ["1","2","3","4"],
      "correctAnswer": 3
    }
  ]
}
```

### Add Review
```json
{
  "courseId": "123abc",
  "rating": 5,
  "comment": "Great course!"
}
```

---

## 🔗 Socket.io Chat

### Connect
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

### Join Room
```javascript
socket.emit('join_room', {
  token: 'YOUR_TOKEN',
  roomId: 'course_id'
});
```

### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'course_id',
  token: 'YOUR_TOKEN',
  message: 'Hello!'
});
```

### Listen Messages
```javascript
socket.on('receive_message', (data) => {
  console.log(data.message);
});
```

---

## ⚙️ Configuration

### .env File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-course
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## 📋 Error Handling

All errors return JSON:
```json
{
  "message": "Error description"
}
```

Common errors:
- 401: No/invalid token
- 403: Insufficient permissions
- 404: Resource not found
- 400: Invalid input

---

## 🛠️ Development Tools

### Required
- Node.js
- MongoDB
- Postman (optional)
- REST Client extension (optional)

### Useful Commands
```bash
npm install        # Install packages
npm run dev        # Start dev server
npm start          # Start production
npm test           # Run tests
```

---

## 📞 Support

Detailed documentation: `COMPLETE_API_DOCUMENTATION.md`
Testing guide: `QUICK_START_TESTING.md`
Test requests: `req.http`

---

## ⚡ Pro Tips

1. Save tokens after login for testing
2. Use environment variables for IDs
3. Test role-based access with different tokens
4. Check MongoDB for created documents
5. Use Postman collections for easier testing
6. Socket.io connections stay open - join rooms after connecting

---

**Happy Coding! 🚀**
