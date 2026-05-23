import api from './api';

export const quizService = {
  createQuiz: async (courseId, questions) => {
    const res = await api.post(`/quizzes/quiz/${courseId}`, { questions });
    return res.data.quiz;
  },

  getQuiz: async (courseId) => {
    const res = await api.get(`/quizzes/quiz/${courseId}`);
    return res.data.quiz;
  },

  attemptQuiz: async (courseId, answers) => {
    const res = await api.post(`/quizzes/quiz/attempt/${courseId}`, { answers });
    return res.data;
  },
};

export default quizService;
