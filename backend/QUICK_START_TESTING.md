# QUICK START TESTING GUIDE

## Prerequisites
- Node.js installed
- MongoDB running (local or Atlas connection)
- VS Code with "REST Client" extension installed
- Postman (optional alternative)

## Installation Steps

1. **Navigate to Backend Directory**
```bash
cd e:\Team-project-mern\backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
- Copy `.env.example` to `.env`
- Edit `.env` with your MongoDB URI and JWT secret

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or update MONGODB_URI in .env with Atlas connection
```

5. **Start Server**
```bash
npm run dev
```

Expected output:
```
MongoDB Connected Successfully
Server running on port 5000
Socket.io listening on port 5000
```

## Testing Workflow

### Method 1: Using REST Client in VS Code (Recommended)

1. Open `req.http` file
2. Run tests in order (top to bottom):

**Step 1: Authentication**
- Run 1.1 - Register Student
- Run 1.2 - Register Instructor  
- Run 1.3 - Register Admin
- Run 1.5 - Login Student → Copy token to @studentToken
- Run 1.6 - Login Instructor → Copy token to @instructorToken
- Run 1.7 - Login Admin → Copy token to @adminToken

**Step 2: Create Course & Lectures**
- Run 3.1 - Create Course → Copy courseId to @courseId
- Run 4.1 - Add Lecture → Copy lectureId to @lectureId
- Run 4.2 - Add Second Lecture

**Step 3: Setup Quiz**
- Run 5.1 - Create Quiz
- Run 5.2 - Get Quiz

**Step 4: Student Learning**
- Run 3.5 - Enroll in Course
- Run 9.1 - Update Progress
- Run 9.4 - Get Progress Percentage

**Step 5: Assessment**
- Run 5.3 - Attempt Quiz (Passing)
- Run 5.4 - Attempt Quiz (Failing)

**Step 6: Reviews & Certificates**
- Run 7.1 - Add Review
- Run 8.1 - Generate Certificate
- Run 8.2 - Get Certificate

**Step 7: User Stats**
- Run 2.2 - Get My Stats

### Method 2: Using Postman

1. Open Postman
2. Create new collection
3. Import endpoints manually or from `req.http`
4. Set base URL: `http://localhost:5000/api`
5. Follow same workflow as REST Client

### Method 3: Using cURL

```bash
# Register Student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# Get Current User (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## API Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | ✗ | Register new user |
| POST | `/auth/login` | ✗ | Login & get token |
| GET | `/auth/me` | ✓ | Get current user |
| POST | `/auth/logout` | ✓ | Logout |
| POST | `/courses` | ✓(I) | Create course |
| GET | `/courses/:id` | ✗ | Get course details |
| POST | `/courses/:id/enroll` | ✓(S) | Enroll in course |
| POST | `/lectures/:courseId` | ✓(I) | Add lecture |
| GET | `/lectures/:courseId` | ✓ | Get lectures |
| POST | `/quizzes/quiz/:courseId` | ✓(A) | Create quiz |
| GET | `/quizzes/quiz/:courseId` | ✓ | Get quiz |
| POST | `/quizzes/quiz/attempt/:courseId` | ✓(S) | Attempt quiz |
| POST | `/reviews` | ✓ | Add review |
| GET | `/reviews/course/:id` | ✗ | Get reviews |
| POST | `/certificates/certificate/generate` | ✓ | Generate cert |
| POST | `/progress/update` | ✓ | Update progress |
| GET | `/progress/:courseId` | ✓ | Get progress |

Legend: ✓ = Auth Required, ✗ = Public, (I) = Instructor, (S) = Student, (A) = Admin

## Expected Test Results

✅ All authentication endpoints should return tokens
✅ Courses should be created and retrievable
✅ Students can enroll in courses
✅ Quizzes can be created and attempted
✅ Scores are calculated correctly
✅ Progress is tracked
✅ Certificates are generated
✅ Reviews are recorded
✅ Role-based access works (403 for unauthorized roles)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env is correct
- Verify connection string format

### Token Expired
- Re-login to get a fresh token
- Tokens expire after 7 days

### 401 Unauthorized
- Check if token is in Authorization header
- Format: `Bearer {token}`

### 403 Forbidden
- Check user role matches endpoint requirements
- Student cannot access instructor-only endpoints

### 404 Not Found
- Verify IDs (courseId, lectureId) are correct
- Check MongoDB for created resources

## Performance Notes

- Quiz scoring is instant (calculated in memory)
- Progress updates are real-time
- Certificates generated on-demand
- Chat uses Socket.io for real-time messaging

## Security Notes

- Passwords are hashed with bcryptjs
- JWTs expire after 7 days
- CORS enabled for development
- Role-based access control enforced
- Input validation on all endpoints

## Next Steps

1. Test all endpoints in req.http
2. Verify database has created documents
3. Check browser console for any errors
4. Monitor server logs for issues
5. Test error scenarios (10.1-10.10 in req.http)

## Support

For detailed API documentation, see `COMPLETE_API_DOCUMENTATION.md`

---

Happy Testing! 🚀
