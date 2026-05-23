# Frontend Structure Documentation

## Folder Organization

### src/
- **components/**: Reusable UI components
  - **common/**: Shared components (Navbar, Footer, etc.)
  - **auth/**: Authentication components (LoginForm, RegisterForm)
  - **courses/**: Course-related components
  - **lectures/**: Lecture playback components
  - **quizzes/**: Quiz interface components
  - **reviews/**: Review/rating components
  - **chat/**: Real-time chat components
  - **dashboard/**: Dashboard components for different roles

- **pages/**: Full page components
  - Home, Login, Register, Dashboard, etc.

- **context/**: React Context for state management
  - AuthContext, CourseContext, UserContext, NotificationContext

- **hooks/**: Custom React hooks
  - useAuth, useCourse, useFetch, useLocalStorage

- **services/**: API service functions
  - api.js (API configuration)
  - authService, courseService, userService, etc.

- **utils/**: Utility functions
  - validators, formatters, helpers, tokenManager

- **constants/**: Application constants and configuration

- **styles/**: Global styles and Tailwind CSS configuration

- **assets/**: Images, icons, and other static files

## Technology Stack
- React (JavaScript)
- React Router (Routing)
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- Socket.io Client (Real-time Communication)
- React Icons (Icon Library)
- React Toastify (Notifications)

## Getting Started
1. Install dependencies: `npm install`
2. Create `.env` file with backend URL
3. Run development server: `npm start`
4. Build for production: `npm run build`
