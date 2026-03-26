import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { DEMO_ORDERS } from '../data/demoData';
import { Eye, ChevronRight } from 'lucide-react';

export function Orders() {
  const { orders: userOrders } = useOrders();

  // Merge user-created orders with demo orders (demo orders fill in if user has none)
  const allOrders = userOrders.length > 0 ? userOrders : DEMO_ORDERS;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>My Orders</h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem' }}>{allOrders.length} order{allOrders.length !== 1 ? 's' : ''}</p>

        {allOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</p>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Start shopping to see your orders here.</p>
            <Link to="/products" style={{ padding: '1rem 2rem', borderRadius: '0.75rem', background: '#fff', color: '#000', fontWeight: 700, textDecoration: 'none' }}>Shop Now</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allOrders.map((order: any, i: number) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ borderRadius: '1.5rem', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)' }}>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 0.25rem' }}>Order #{order._id}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span style={{ padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: order.status === 'delivered' ? 'rgba(34,197,94,0.15)' : order.status === 'shipped' ? 'rgba(96,165,250,0.15)' : 'rgba(245,158,11,0.15)',
                  color: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#60a5fa' : '#f59e0b'
                }}>{order.status}</span>
              </div>

              {order.orderItems.map((item: any) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: '0.75rem', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{item.name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 700 }}>${item.price}</span>
                </div>
              ))}

              <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: ${order.totalPrice}</span>
                <Link to={`/track/${order._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                  <Eye size={14} /> Track Order <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
