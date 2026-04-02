import api from './api.js';

export const productService = {
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getTopSellers:(limit)  => api.get('/products/top-sellers', { params: { limit } }),
  create:       (data)   => api.post('/products', data),
  update:       (id, data) => api.put(`/products/${id}`, data),
  delete:       (id)     => api.delete(`/products/${id}`),
  deleteImage:  (id, publicId) => api.delete(`/products/${id}/image/${encodeURIComponent(publicId)}`),
};
