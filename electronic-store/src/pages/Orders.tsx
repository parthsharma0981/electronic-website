import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { DEMO_ORDERS } from '../data/demoData';
import { Eye, ChevronRight, Package } from 'lucide-react';

export function Orders() {
  const { orders: userOrders } = useOrders();
  const allOrders = userOrders.length > 0 ? userOrders : DEMO_ORDERS;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '15%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Order History</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: '"Outfit", sans-serif' }}>
          My <span className="gradient-text">Orders</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>{allOrders.length} order{allOrders.length !== 1 ? 's' : ''}</p>

        {allOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Package size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-glow" style={{ padding: '1rem 2rem', borderRadius: '9999px', textDecoration: 'none' }}>Shop Now</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allOrders.map((order: any, i: number) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{
                borderRadius: '1.5rem', overflow: 'hidden',
                background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)',
                backdropFilter: 'blur(40px)', transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.08)'}
            >
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Order #{order._id}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span style={{ padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: order.status === 'delivered' ? 'rgba(34,197,94,0.1)' : order.status === 'shipped' ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(245,158,11,0.1)',
                  color: order.status === 'delivered' ? '#34d399' : order.status === 'shipped' ? 'var(--primary)' : '#fbbf24',
                  border: `1px solid ${order.status === 'delivered' ? 'rgba(34,197,94,0.2)' : order.status === 'shipped' ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(245,158,11,0.2)'}`,
                }}>{order.status}</span>
              </div>

              {order.orderItems.map((item: any) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(var(--primary-rgb), 0.04)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: '0.75rem', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{item.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontWeight: 700 }}>${item.price}</span>
                </div>
              ))}

              <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total: <span className="gradient-text">${order.totalPrice}</span></span>
                <Link to={`/track/${order._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', transition: 'opacity 0.2s' }}>
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
