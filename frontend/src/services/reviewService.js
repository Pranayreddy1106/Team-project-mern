import api from './api';

export const reviewService = {
  addReview: async ({ courseId, rating, comment }) => {
    const res = await api.post('/reviews', { courseId, rating, comment });
    return res.data.review || res.data;
  },

  getCourseReviews: async (courseId) => {
    const res = await api.get(`/reviews/course/${courseId}`);
    return res.data.reviews || res.data || [];
  },
};

export default reviewService;
