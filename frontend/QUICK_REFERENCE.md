# 🚀 Frontend Quick Reference Guide

## Project Status: ✅ READY FOR DEVELOPMENT

---

## 📂 Folder Quick Access

### To Add Features:
```
Components → src/components/[feature]/[ComponentName].jsx
Pages → src/pages/[PageName].jsx
State → src/context/[ContextName].jsx
Hooks → src/hooks/use[HookName].js
API → src/services/[ServiceName].js
Styles → Tailwind CSS (inline classes)
Utils → src/utils/[utilName].js
```

---

## 🎯 Quick Component Map

| Feature | Components | Services |
|---------|-----------|----------|
| **Auth** | LoginForm, RegisterForm, ForgotPassword | authService |
| **Courses** | CourseCard, CourseGrid, CourseFilter | courseService |
| **Lectures** | LecturePlayer, LectureList, LectureVideo | lectureService |
| **Quizzes** | QuizCard, QuizQuestion, QuizResult | quizService |
| **Reviews** | ReviewCard, ReviewForm, ReviewList | reviewService |
| **Chat** | ChatWindow, ChatBox, MessageList | chatService |
| **Payment** | PaymentPage | paymentService |
| **Certificates** | CertificatesPage | certificateService |
| **Progress** | (Dashboard widgets) | progressService |
| **Users** | ProfilePage | userService |

---

## 🔧 Common Tasks

### Start Development Server
```bash
cd frontend
npm start
```
Opens on `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Creates optimized build in `build/` folder

### Install New Package
```bash
npm install package-name
```

### Run Tests
```bash
npm test
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.jsx`)
- **Pages**: PascalCase (e.g., `Dashboard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFetch.js`)
- **Services**: camelCase + Service (e.g., `authService.js`)
- **Utils**: camelCase (e.g., `validators.js`)
- **Folders**: lowercase (e.g., `components`, `services`)

---

## 🎨 Tailwind CSS Quick Tips

### Common Classes
```jsx
// Flexbox
<div className="flex items-center justify-between">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">

// Spacing
<div className="p-4 m-2 gap-3">

// Colors
<div className="bg-primary text-white hover:bg-blue-700">

// Borders
<div className="border border-gray-200 rounded-lg shadow-lg">
```

### Custom Colors Available
- `bg-primary`, `text-primary` → #2563eb
- `bg-secondary`, `text-secondary` → #64748b
- `bg-success`, `text-success` → #10b981
- `bg-danger`, `text-danger` → #ef4444
- `bg-warning`, `text-warning` → #f59e0b

---

## 🔐 Authentication Flow

```
1. User fills LoginForm → authService.login()
2. Backend returns token + user
3. Token stored in localStorage
4. axios interceptor adds token to requests
5. ProtectedRoute checks token
6. If invalid → redirect to Login
```

---

## 🌐 API Service Pattern

```javascript
// Create in services/exampleService.js
import api from './api';

export const exampleService = {
  getAll: () => api.get('/endpoint'),
  getById: (id) => api.get(`/endpoint/${id}`),
  create: (data) => api.post('/endpoint', data),
  update: (id, data) => api.put(`/endpoint/${id}`, data),
  delete: (id) => api.delete(`/endpoint/${id}`)
};

// Use in components
import { exampleService } from '../services';

const data = await exampleService.getAll();
```

---

## 🎣 Custom Hooks Pattern

```javascript
// Create in hooks/useExample.js
import { useState, useEffect } from 'react';

export const useExample = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, []);
  
  return { state };
};

// Use in components
import { useExample } from '../hooks';

const MyComponent = () => {
  const { state } = useExample();
  return <div>{state}</div>;
};
```

---

## 🗄️ Context Pattern

```javascript
// Create in context/ExampleContext.jsx
import { createContext, useState } from 'react';

export const ExampleContext = createContext();

export const ExampleProvider = ({ children }) => {
  const [value, setValue] = useState(null);
  
  return (
    <ExampleContext.Provider value={{ value, setValue }}>
      {children}
    </ExampleContext.Provider>
  );
};

// Use in App.jsx
<ExampleProvider>
  <YourApp />
</ExampleProvider>

// Use in components
import { useContext } from 'react';
import { ExampleContext } from '../context';

const MyComponent = () => {
  const { value } = useContext(ExampleContext);
  return <div>{value}</div>;
};
```

---

## 🔌 Socket.io Pattern

```javascript
// In chatService.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

export const chatService = {
  connect: () => socket.connect(),
  disconnect: () => socket.disconnect(),
  join: (room) => socket.emit('join', room),
  sendMessage: (msg) => socket.emit('message', msg),
  onMessage: (callback) => socket.on('message', callback)
};

// Use in components
useEffect(() => {
  chatService.join(courseId);
  chatService.onMessage((msg) => {
    setMessages([...messages, msg]);
  });
}, []);
```

---

## 📱 Responsive Design

```jsx
// Mobile-first approach
<div className="
  w-full        // Mobile: full width
  md:w-2/3      // Tablet: 2/3 width
  lg:w-1/2      // Desktop: 1/2 width
  p-4           // Mobile: 1rem padding
  md:p-6        // Tablet: 1.5rem padding
  lg:p-8        // Desktop: 2rem padding
">
```

---

## 🎯 Component Import Tips

### Import with Index Files (Preferred)
```javascript
import { LoginForm, RegisterForm } from '../components/auth';
import { CourseCard, CourseGrid } from '../components/courses';
```

### Direct Import
```javascript
import LoginForm from '../components/auth/LoginForm';
```

---

## 🛠️ Debugging Tips

### Check Network Requests
```javascript
// In browser DevTools → Network tab
// Look for API calls to backend
```

### Check State
```javascript
// Add console logs
console.log('Current state:', state);

// Use React DevTools Extension
// Browser → Extensions → React DevTools
```

### Check Socket Connection
```javascript
// In browser console
socket.connected // true/false
socket.id        // Socket ID
```

---

## 📚 Backend API URL Reference

```
Base: http://localhost:5000/api

Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout

Users:
  GET    /users/me/profile
  PUT    /users/me/profile
  GET    /users/me/stats
  GET    /users/:id

Courses:
  GET    /courses
  GET    /courses/:id
  POST   /courses
  POST   /courses/:id/enroll

Lectures:
  GET    /lectures/:courseId
  POST   /lectures/:courseId
  DELETE /lectures/:id

Quizzes:
  GET    /quizzes/quiz/:courseId
  POST   /quizzes/quiz/:courseId
  POST   /quizzes/quiz/attempt/:courseId

Reviews:
  GET    /reviews/:courseId
  POST   /reviews/:courseId

Payments:
  POST   /payments/create

Certificates:
  GET    /certificates/user
  GET    /certificates/:id

Progress:
  POST   /progress/update
  GET    /progress/:courseId
```

---

## 🚀 Development Workflow

1. **Start Server**: `npm start`
2. **Edit Component**: Make changes in `src/components/`
3. **Hot Reload**: Changes auto-refresh in browser
4. **Test**: Use browser DevTools to debug
5. **Build**: `npm run build` for production

---

## 📋 Pre-flight Checklist

Before starting development:

- [ ] `npm install` completed
- [ ] `.env` file created with backend URL
- [ ] Backend running on `http://localhost:5000`
- [ ] `npm start` works and opens `http://localhost:3000`
- [ ] Browser DevTools open (F12)
- [ ] React DevTools extension installed

---

## ❓ FAQ

**Q: Should I modify existing files?**
A: Yes! All files are empty and ready for your code.

**Q: Where do I put images?**
A: In `src/assets/images/`

**Q: How do I add new pages?**
A: Create file in `src/pages/[PageName].jsx` and add route in `App.jsx`

**Q: How do I add new components?**
A: Create folder in `src/components/[feature]/` and create `.jsx` file

**Q: How do I handle errors?**
A: Use ErrorBoundary component or try-catch in services

---

## 🎓 Learning Resources

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- Socket.io: https://socket.io

---

## 🆘 Getting Help

1. Check the README.md for detailed docs
2. Review SETUP_COMPLETE.md for structure details
3. Check backend API documentation
4. Use browser DevTools for debugging

---

**Happy Coding! 🚀**
