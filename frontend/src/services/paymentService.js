import api from './api';

export const paymentService = {
  createPayment: async (courseId) => {
    const res = await api.post('/payments/create', { courseId });
    return res.data;
  },
};

export default paymentService;
