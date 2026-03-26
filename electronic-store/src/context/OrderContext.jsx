import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const OrderContext = createContext(null);

const orderKey = (userId) => userId ? `ecore_orders_${userId}` : 'ecore_orders_guest';

const loadOrders = (userId) => {
  const key = orderKey(userId);
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
};

const saveOrders = (userId, orders) => {
  localStorage.setItem(orderKey(userId), JSON.stringify(orders));
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(loadOrders(user?._id));
  }, [user?._id]);

  const createOrder = useCallback((cartItems, shippingAddress, paymentMethod, totalPrice) => {
    const now = new Date();
    const newOrder = {
      _id: 'ord_' + Date.now(),
      createdAt: now.toISOString(),
      totalPrice,
      isPaid: true,
      isDelivered: false,
      status: 'processing',
      shippingAddress,
      paymentMethod,
      trackingSteps: [
        { label: 'Order Placed', date: now.toLocaleString(), done: true },
        { label: 'Payment Confirmed', date: now.toLocaleString(), done: true },
        { label: 'Processing', date: 'In progress', done: true },
        { label: 'Shipped', date: 'Pending', done: false },
        { label: 'Out for Delivery', date: 'Pending', done: false },
        { label: 'Delivered', date: '', done: false },
      ],
      orderItems: cartItems.map(item => ({
        _id: 'oi_' + Date.now() + '_' + item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0]?.url || item.image || '',
      })),
    };

    const updated = [newOrder, ...loadOrders(user?._id)];
    saveOrders(user?._id, updated);
    setOrders(updated);
    return newOrder;
  }, [user]);

  const getOrder = useCallback((orderId) => {
    return orders.find(o => o._id === orderId);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be inside OrderProvider');
  return ctx;
};
