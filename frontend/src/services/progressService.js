import api from './api';

export const progressService = {
  updateProgress: async ({ courseId, lectureId, timestamp = 0 }) => {
    const res = await api.post('/progress/update', {
      courseId,
      lectureId,
      timestamp,
    });
    return res.data;
  },

  getCourseProgress: async (courseId) => {
    const res = await api.get(`/progress/${courseId}`);
    return res.data.progress;
  },

  getAllProgress: async () => {
    const res = await api.get('/progress');
    return res.data.progress || [];
  },

  getProgressPercentage: async (courseId) => {
    const res = await api.get(`/progress/${courseId}/percentage`);
    return res.data;
  },
};

export default progressService;
