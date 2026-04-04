import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../context/OrderContext';
import { DEMO_ORDERS } from '../data/demoData';
import { Check, Truck, MapPin, CreditCard, Home, Package } from 'lucide-react';

const STEP_ICONS = [<CreditCard size={18} />, <Check size={18} />, <Package size={18} />, <Truck size={18} />, <MapPin size={18} />, <Home size={18} />];

export function TrackOrder() {
  const { id } = useParams();
  const { getOrder } = useOrders();

  // Try real order first, then fallback to demo
  const order = getOrder(id || '') || DEMO_ORDERS.find(o => o._id === id) || DEMO_ORDERS[0];

  if (!order) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Order not found</div>;
  }

  const statusLower = (order.status || 'pending').toLowerCase();
  const isRejected = statusLower === 'rejected';
  
  const trackingSteps = [
    { label: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), done: true },
    { label: 'Payment Confirmed', date: order.payment?.isPaid || order.isPaid ? new Date(order.payment?.paidAt || order.paidAt || order.createdAt).toLocaleDateString() : 'Pending', done: !!(order.payment?.isPaid || order.isPaid) },
    { label: isRejected ? 'Rejected' : 'Order Accepted', date: isRejected ? 'Order Cancelled' : ['accepted', 'shipped', 'delivered'].includes(statusLower) ? 'Confirmed' : 'Pending', done: isRejected || ['accepted', 'shipped', 'delivered'].includes(statusLower), isError: isRejected },
    { label: 'Shipped', date: ['shipped', 'delivered'].includes(statusLower) ? 'Completed' : 'Pending', done: ['shipped', 'delivered'].includes(statusLower) },
    { label: 'Out for Delivery', date: statusLower === 'delivered' ? 'Completed' : 'Pending', done: statusLower === 'delivered' },
    { label: 'Delivered', date: statusLower === 'delivered' ? new Date().toLocaleDateString() : 'Pending', done: statusLower === 'delivered' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.75rem' }}>Order Tracking</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Track Your Order</h1>
        <p style={{ color: '#6b7280', marginBottom: '3rem' }}>Order #{order._id} · {new Date(order.createdAt).toLocaleDateString()}</p>

        {/* Timeline */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem', backdropFilter: 'blur(40px)' }}>
          {trackingSteps.map((step: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.isError ? 'rgba(239,68,68,0.2)' : step.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${step.isError ? '#ef4444' : step.done ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                    color: step.isError ? '#ef4444' : step.done ? '#22c55e' : '#4b5563',
                  }}>
                  {STEP_ICONS[i] || <Check size={18} />}
                </motion.div>
                {i < trackingSteps.length - 1 && (
                  <div style={{ width: 2, height: 50, background: step.done ? '#22c55e' : 'rgba(255,255,255,0.06)' }} />
                )}
              </div>
              <div style={{ paddingTop: '0.5rem', paddingBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', color: step.done ? '#fff' : '#6b7280' }}>{step.label}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{step.date || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Items */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2.5rem 0 1.5rem' }}>Items in this Order</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.orderItems.map((item: any) => (
            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: '0.75rem', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>Qty: {item.quantity}</p>
              </div>
              <span style={{ fontWeight: 700 }}>${item.price}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'right', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Total: ${order.totalPrice}</div>
      </motion.div>
    </div>
  );
}
