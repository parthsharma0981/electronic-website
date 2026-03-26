import api from './api.js';

export const authService = {
  login:    (creds) => api.post('/auth/login', creds),
  register: (data) => api.post('/auth/register', data),
  logout:   () => api.post('/auth/logout'),
};
