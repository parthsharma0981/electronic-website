import api from './api.js';

export const orderService = {
  getMyOrders: () => api.get('/orders/myorders'),
  getAll: () => api.get('/orders'),
  placeOrderDirect: (data) => api.post('/orders', data),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
  getAllOrders: (params) => api.get('/orders/all', { params }), // keep for backwards compatibility if needed
};
