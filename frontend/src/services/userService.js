import api from './api';

export const userService = {
  getMyProfile: async () => {
    const res = await api.get('/users/me/profile');
    return res.data.user || res.data;
  },

  getMyStats: async () => {
    const res = await api.get('/users/me/stats');
    return res.data;
  },

  getInstructorStats: async () => {
    const res = await api.get('/users/me/instructor-stats');
    return res.data;
  },

  updateMyProfile: async (profile) => {
    const res = await api.put('/users/me/profile', profile);
    return res.data.user;
  },

  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data.users || [];
  },

  getUsersByRole: async (role) => {
    const res = await api.get(`/users/role/${role}`);
    return res.data.users || [];
  },

  getPublicProfile: async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },
};

export default userService;
