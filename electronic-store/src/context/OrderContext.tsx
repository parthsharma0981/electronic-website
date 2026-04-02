import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { orderService } from '../services/orderService.js';

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's orders on login
  useEffect(() => {
    if (!user?.token) {
      setOrders([]);
      setAllOrders([]);
      return;
    }
    setLoading(true);
    orderService.getMyOrders()
      .then((res: any) => {
        const data = res.data;
        const apiOrders = Array.isArray(data) ? data : (data.orders || []);
        setOrders(apiOrders);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      })
      .finally(() => setLoading(false));

    // Also fetch ALL orders for admin/seller dashboards
    // Backend will return 403 for regular users, which we handle gracefully
    orderService.getAll()
      .then((res: any) => {
        const data = res.data;
        const all = data.orders || (Array.isArray(data) ? data : []);
        setAllOrders(all);
      })
      .catch(() => {
        // Silently fail for non-admin/non-seller users
        setAllOrders([]);
      });
  }, [user?._id, user?.token, isAdmin]);

  const createOrder = useCallback(async (cartItems: any[], shippingAddress: any, paymentMethod: string, totalPrice: number) => {
    // Build order items for the API
    const orderItems = cartItems.map((item: any) => ({
      product: item._id,
      name: item.name,
      image: item.images?.[0]?.url || item.image || '',
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const { data } = await orderService.placeOrderDirect({
        orderItems,
        shippingAddress: {
          street: shippingAddress.address || shippingAddress.street || 'N/A',
          city: shippingAddress.city || 'N/A',
          state: shippingAddress.state || 'N/A',
          pincode: shippingAddress.zip || shippingAddress.pincode || '000000',
          phone: shippingAddress.phone || '0000000000',
        },
        totalAmount: totalPrice,
        paymentMethod: paymentMethod || 'cod',
      });

      setOrders((prev: any[]) => [data, ...prev]);
      setAllOrders((prev: any[]) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
    }
  }, [user]);

  const getOrder = useCallback((orderId: string) => {
    return orders.find((o: any) => o._id === orderId);
  }, [orders]);

  // Computed values for dashboards
  const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || o.totalPrice || 0), 0);

  return (
    <OrderContext.Provider value={{ orders, allOrders, loading, createOrder, getOrder, totalRevenue }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): any => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be inside OrderProvider');
  return ctx;
};
