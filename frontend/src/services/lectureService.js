import api from './api';

export const lectureService = {
  addLecture: async (courseId, lecture) => {
    const res = await api.post(`/lectures/${courseId}`, lecture);
    return res.data.lecture;
  },

  getLectures: async (courseId) => {
    const res = await api.get(`/lectures/${courseId}`);
    return res.data.lectures || [];
  },

  deleteLecture: async (lectureId) => {
    const res = await api.delete(`/lectures/${lectureId}`);
    return res.data;
  },
};

export default lectureService;
