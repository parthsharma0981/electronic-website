import api from './api.js';

export const couponService = {
  validate: (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal }),
  getAll:   ()                => api.get('/coupons'),
  create:   (data)            => api.post('/coupons', data),
  delete:   (id)              => api.delete(`/coupons/${id}`),
  toggle:   (id)              => api.patch(`/coupons/${id}/toggle`),
};
