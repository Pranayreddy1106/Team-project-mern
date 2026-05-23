import api from './api';

const courseService = {
  // Fetch all courses
  getAllCourses: async (params = {}) => {
    const res = await api.get('/courses', { params });
    return res.data.courses || res.data || [];
  },

  // Fetch a single course by ID
  getCourseById: async (courseId) => {
    const res = await api.get(`/courses/${courseId}`);
    return res.data.course || res.data;
  },

  // Fetch courses owned by the logged‑in instructor
  getMyCourses: async () => {
    const res = await api.get('/courses/my');
    return res.data.courses || [];
  },

  // Check if a student is enrolled in a course
  checkEnrollment: async (courseId) => {
    const res = await api.get(`/courses/${courseId}/is-enrolled`);
    return Boolean(res.data.enrolled);
  },

  // Enroll the current student in a course
  enrollCourse: async (courseId) => {
    const res = await api.post(`/courses/${courseId}/enroll`);
    return res.data;
  },

  // Create a new course (instructor only)
  createCourse: async (course) => {
    const res = await api.post('/courses', course);
    return res.data.course;
  },

  // Fetch distinct categories for filtering UI
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data.categories || [];
  },

  // Fetch distinct levels for filtering UI
  getLevels: async () => {
    const res = await api.get('/courses/levels');
    return res.data.levels || [];
  },
};

export default courseService;
