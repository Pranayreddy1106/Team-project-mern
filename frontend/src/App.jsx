import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllCourses from './pages/AllCourses';
import CourseDetails from './pages/CourseDetails';
import LectureView from './pages/LectureView';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import CertificatesPage from './pages/CertificatesPage';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import ChatPage from './pages/ChatPage';
import PublicProfile from './pages/PublicProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path='/courses' element={<AllCourses />} />
      <Route path='/courses/:id' element={<CourseDetails />} />
      <Route path='/courses/:courseId/lectures/:id' element={<LectureView />} />
      <Route path='/lecture/:id' element={<LectureView />} />
      <Route
        path='/quiz/:id'
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path='/profile/:id' element={<PublicProfile />} />
      <Route
        path='/certificates'
        element={
          <ProtectedRoute>
            <CertificatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/payment/:courseId'
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/admin'
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path='/chat'
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/chat/:courseId'
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
