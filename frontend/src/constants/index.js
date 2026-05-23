export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.port === '3000' ? 'http://localhost:5000/api' : `${window.location.origin}/api`);
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 
  (window.location.port === '3000' ? 'http://localhost:5000' : window.location.origin);

export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

export const QUIZ_PASS_PERCENTAGE = 75;

export const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:id',
  LECTURE_VIEW: '/lecture/:lectureId',
  QUIZ: '/quiz/:courseId',
  PROFILE: '/profile',
  CERTIFICATES: '/certificates',
  CHAT: '/chat',
  PAYMENT: '/payment/:courseId',
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  ADMIN_PANEL: '/admin',
  NOT_FOUND: '*'
};
