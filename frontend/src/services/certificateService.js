import api from './api';

export const certificateService = {
  generateCertificate: async (courseId) => {
    const res = await api.post('/certificates/certificate/generate', { courseId });
    return res.data.certificate || res.data;
  },

  getCertificate: async (courseId) => {
    const res = await api.get(`/certificates/certificate/${courseId}`);
    return res.data.certificate || res.data;
  },
};

export default certificateService;
