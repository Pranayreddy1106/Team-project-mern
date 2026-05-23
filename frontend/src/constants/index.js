export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

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
