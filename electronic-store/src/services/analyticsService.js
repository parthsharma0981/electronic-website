import api from './api.js';

export const analyticsService = {
  getAnalytics: () => api.get('/analytics'),
};
