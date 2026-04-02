import api from './api.js';

export const authService = {
  login:    (creds) => api.post('/auth/login', creds),
  register: (data) => api.post('/auth/register-direct', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateCart: (cart) => api.put('/auth/cart', { cart }),
  updateWishlist: (wishlist) => api.put('/auth/wishlist', { wishlist }),
};
