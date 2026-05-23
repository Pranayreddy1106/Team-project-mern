# MERN Course Platform - Frontend

A modern, responsive React frontend for a comprehensive online learning platform built with React, Tailwind CSS, and Socket.io.

## 🎯 Features

### Student Features
- User authentication (Register/Login)
- Browse and enroll in courses (free & paid)
- Watch video lectures
- Take quizzes and get instant scoring
- Track learning progress
- Download certificates
- Leave course reviews and ratings
- Real-time chat with instructors

### Instructor Features
- Create and manage courses
- Upload video lectures
- Create quizzes with questions
- Track student progress
- Manage course content
- View course reviews

### Admin Features
- User management
- Course moderation
- Quiz management
- Platform analytics
- User role management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies** (Already done)
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - `.env` file is already created with default values
   - Update if needed for your backend configuration

4. **Start development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Navbar, Footer, Modal, Loading, etc.
│   ├── auth/               # LoginForm, RegisterForm, ForgotPassword
│   ├── courses/            # CourseCard, CourseGrid, CourseFilter, etc.
│   ├── lectures/           # LectureVideo, LecturePlayer, LectureList, etc.
│   ├── quizzes/            # QuizCard, QuizQuestion, QuizResult, etc.
│   ├── reviews/            # ReviewCard, ReviewForm, ReviewList
│   ├── chat/               # ChatWindow, ChatBox, MessageList, RoomList
│   └── dashboard/          # StudentDashboard, InstructorDashboard, AdminDashboard, Stats
├── pages/                   # Full page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── AllCourses.jsx
│   ├── CourseDetails.jsx
│   ├── LectureView.jsx
│   ├── QuizPage.jsx
│   ├── ProfilePage.jsx
│   ├── CertificatesPage.jsx
│   ├── ChatPage.jsx
│   ├── PaymentPage.jsx
│   ├── InstructorDashboard.jsx
│   ├── AdminPanel.jsx
│   └── NotFound.jsx
├── context/                # React Context (State management)
│   ├── AuthContext.jsx
│   ├── CourseContext.jsx
│   ├── UserContext.jsx
│   └── NotificationContext.jsx
├── hooks/                  # Custom React hooks
│   ├── useAuth.js
│   ├── useCourse.js
│   ├── useFetch.js
│   └── useLocalStorage.js
├── services/               # API service functions
│   ├── api.js             # Axios configuration
│   ├── authService.js
│   ├── courseService.js
│   ├── userService.js
│   ├── lectureService.js
│   ├── quizService.js
│   ├── reviewService.js
│   ├── paymentService.js
│   ├── certificateService.js
│   ├── progressService.js
│   └── chatService.js
├── utils/                  # Utility functions
│   ├── validators.js
│   ├── formatters.js
│   ├── helpers.js
│   ├── tokenManager.js
│   └── debounce.js
├── constants/              # Application constants
│   └── index.js
├── styles/                 # Global styles
│   └── index.css
├── assets/                 # Images and icons
│   ├── images/
│   └── icons/
└── App.jsx                 # Main App component
```

## 📦 Dependencies (Already Installed)

### Core
- **react**: ^18.x - UI library
- **react-dom**: ^18.x - React DOM renderer
- **react-router-dom**: ^6.x - Routing

### Styling
- **tailwindcss**: ^3.x - Utility-first CSS framework
- **postcss**: ^8.x - CSS processing
- **autoprefixer**: ^10.x - Vendor prefixes

### API & State
- **axios**: ^1.x - HTTP client
- **socket.io-client**: ^4.x - Real-time communication

### UI
- **react-icons**: ^4.x - Icon library
- **react-toastify**: ^9.x - Toast notifications

## 🎨 Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

### Custom Colors
- `primary`: #2563eb (Blue)
- `secondary`: #64748b (Slate)
- `success`: #10b981 (Green)
- `danger`: #ef4444 (Red)
- `warning`: #f59e0b (Amber)

## 📝 Available Scripts

```bash
# Start development server (runs on port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (one-way operation)
npm run eject
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Token is automatically attached to API requests via Axios interceptor.

### Token Storage
- Token is stored in `localStorage` with key `token`
- User info is stored in `localStorage` with key `user`

## 🌐 API Integration

All API calls go through the centralized `services/api.js` with:
- Automatic token injection
- Error handling
- Request/response interceptors

## 🗨️ Real-time Chat

Uses Socket.io for real-time messaging:
- Room-based conversations
- Message history
- User presence notifications
- Automatic reconnection

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

This creates an optimized build in the `build/` folder.

## 🔧 Configuration

### Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Backend Requirements
- Backend must be running on `http://localhost:5000`
- Ensure CORS is properly configured for frontend URL
- Socket.io server must be running on the same port

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
Ensure backend is running on `http://localhost:5000` and has CORS configured for your frontend.

### Socket.io Connection Issues
Verify `REACT_APP_SOCKET_URL` matches your backend socket server URL.

## 🤝 Next Steps

1. Create component implementations in each component file
2. Set up Redux or Context API for state management
3. Implement API service calls
4. Add routing in App.jsx
5. Build individual page components
6. Connect frontend to backend

## 📄 Project Status

✅ **Folder Structure**: Complete
✅ **Dependencies**: Installed
✅ **Configuration**: Ready
⏳ **Components**: Ready for implementation
⏳ **Pages**: Ready for implementation
⏳ **API Integration**: Ready for implementation

## 📧 Support

For issues and questions, refer to the backend documentation or create an issue in the repository.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
