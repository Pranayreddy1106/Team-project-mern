import api from './api';

export const authService = {
  register: async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  login: async (payload) => {
    const res = await api.post('/auth/login', payload);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};

export default authService;
