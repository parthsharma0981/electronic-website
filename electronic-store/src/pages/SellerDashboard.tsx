import { motion } from 'framer-motion';
import { SELLER_STATS } from '../data/demoData';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { DollarSign, ShoppingBag, Package, Star, TrendingUp } from 'lucide-react';

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '1.5rem' };

export function SellerDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  
  // Calculate dynamic stats
  const totalSales = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0) || SELLER_STATS.totalSales;
  const totalOrders = orders.length || SELLER_STATS.totalOrders;
  const totalProducts = products.length || SELLER_STATS.totalProducts;
  
  const myProducts = products.slice(0, 4);
  const recentOrders = orders.length > 0 ? orders.slice(0, 5) : SELLER_STATS.recentOrders;
  const stats = SELLER_STATS; // For monthly sales graph and avg rating

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2.5rem' }}>Seller Dashboard</h1>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <DollarSign size={20} />, label: 'Total Sales', value: `$${totalSales.toLocaleString()}`, color: '#22c55e' },
            { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: totalOrders, color: '#60a5fa' },
            { icon: <Package size={20} />, label: 'Products Listed', value: totalProducts, color: '#a78bfa' },
            { icon: <Star size={20} />, label: 'Avg Rating', value: stats.avgRating, color: '#f59e0b' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -4 }} style={glass}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Sales Chart (simple bar) */}
        <div style={{ ...glass, marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Monthly Sales</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 150 }}>
            {stats.monthlySales.map((v, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / Math.max(...stats.monthlySales)) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                style={{ flex: 1, background: `linear-gradient(to top, rgba(96,165,250,0.3), rgba(96,165,250,0.8))`, borderRadius: '0.25rem 0.25rem 0 0', minWidth: 0 }}
                title={`$${v}`} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map(m => (
              <span key={m} style={{ fontSize: '0.65rem', color: '#4b5563', flex: 1, textAlign: 'center' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ ...glass, marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Orders</h2>
          {recentOrders.map((o: any) => (
            <div key={o.id || o._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{o.product || (o.orderItems?.[0]?.name) || 'Order'}</p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>by {o.customer || o.shippingAddress?.name || 'Customer'} · {o.date || new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span style={{ fontWeight: 700 }}>${o.amount || o.totalPrice?.toFixed(2)}</span>
              <span style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                background: (o.status || 'processing') === 'delivered' ? 'rgba(34,197,94,0.15)' : (o.status || 'processing') === 'shipped' ? 'rgba(96,165,250,0.15)' : 'rgba(245,158,11,0.15)',
                color: (o.status || 'processing') === 'delivered' ? '#22c55e' : (o.status || 'processing') === 'shipped' ? '#60a5fa' : '#f59e0b'
              }}>{o.status}</span>
            </div>
          ))}
        </div>

        {/* My Products */}
        <div style={glass}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {myProducts.map((p: any) => (
              <div key={p._id} style={{ borderRadius: '1rem', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={p.images?.[0]?.url || p.image} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{p.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>${p.price} · {p.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
