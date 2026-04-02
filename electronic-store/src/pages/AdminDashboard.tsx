import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_STATS, CATEGORIES } from '../data/demoData';
import { Users, DollarSign, ShoppingBag, Package, BarChart3, Plus, Trash2, TrendingUp, Award, AlertTriangle, X } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '1.5rem' };

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, deleteProduct, totalProducts, bestSellers, lowStock, categoryBreakdown } = useProducts();
  const { orders, allOrders } = useOrders();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Computing', description: '', stock: '50', imageUrl: '' });
  const [formSpecs, setFormSpecs] = useState([{ key: '', value: '' }]);

  // Redirect non-admin users
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Use allOrders for admin dashboard stats
  const dashboardOrders = allOrders.length > 0 ? allOrders : orders;
  const s = ADMIN_STATS;
  const recentOrders = dashboardOrders.slice(0, 5);
  const totalRevenue = dashboardOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || o.totalPrice || 0), 0) || s.totalRevenue;

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Name and price are required');
      return;
    }

    const specsObj: any = {};
    formSpecs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    addProduct({ ...newProduct, specs: specsObj });
    toast.success(`${newProduct.name} added to store! 🎉`);
    setNewProduct({ name: '', price: '', category: 'Computing', description: '', stock: '50', imageUrl: '' });
    setFormSpecs([{ key: '', value: '' }]);
    setShowAddForm(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'products', label: 'Products', icon: <Package size={16} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} /> },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '0.5rem' }}>🔒 ADMIN PANEL</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Welcome, {user.name}</h1>
          </div>
          <button onClick={() => setShowAddForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#22c55e', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '0.5rem 0.5rem 0 0', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards — always visible */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: <Users size={20} />, label: 'Total Users', value: s.totalUsers.toLocaleString(), color: '#60a5fa', change: '+12.5%' },
            { icon: <DollarSign size={20} />, label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, color: '#22c55e', change: '+8.2%' },
            { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: (dashboardOrders.length || s.totalOrders).toLocaleString(), color: '#a78bfa', change: '+15.3%' },
            { icon: <Package size={20} />, label: 'Total Products', value: totalProducts, color: '#f59e0b', change: '+3' },
            { icon: <Award size={20} />, label: 'Best Rating', value: '4.9⭐', color: '#ec4899', change: 'Quantum Phone' },
            { icon: <AlertTriangle size={20} />, label: 'Low Stock', value: lowStock.length, color: lowStock.length > 3 ? '#ef4444' : '#22c55e', change: lowStock.length > 3 ? 'Needs attention' : 'Healthy' },
          ].map(st => (
            <motion.div key={st.label} whileHover={{ y: -4 }} style={glass}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: `${st.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: st.color }}>{st.icon}</div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{st.label}</span>
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{st.value}</p>
              <p style={{ fontSize: '0.7rem', color: st.color, fontWeight: 600, margin: 0 }}>{st.change}</p>
            </motion.div>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Best Sellers */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={16} color="#f59e0b" /> Best Sellers</h2>
              {bestSellers.map((p: any, i: number) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < bestSellers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ width: 24, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: i < 3 ? '#f59e0b' : '#6b7280' }}>#{i + 1}</span>
                  <img src={p.images?.[0]?.url} alt="" style={{ width: 36, height: 36, borderRadius: '0.5rem', objectFit: 'cover' }} />
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{p.numReviews} sold</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>${p.price}</span>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Products by Category</h2>
              {Object.entries(categoryBreakdown).map(([cat, count]: any) => {
                const pct = (count / totalProducts) * 100;
                return (
                  <div key={cat} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cat}</span>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{count} products</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right, #f59e0b, #ef4444)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue by Category */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Revenue by Category</h2>
              {s.revenueByCategory.map((c: any) => {
                const pct = (c.revenue / Math.max(...s.revenueByCategory.map((x: any) => x.revenue))) * 100;
                return (
                  <div key={c.category} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.category}</span>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>${(c.revenue / 1000).toFixed(0)}K</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right, #60a5fa, #a78bfa)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Growth */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart3 size={16} /> User Growth (12 months)</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: 120 }}>
                {s.userGrowth.map((v: number, i: number) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / Math.max(...s.userGrowth)) * 100}%` }}
                    transition={{ delay: i * 0.05 }} style={{ flex: 1, background: 'linear-gradient(to top, rgba(96,165,250,0.3), rgba(96,165,250,0.7))', borderRadius: '0.2rem 0.2rem 0 0', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.55rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{(v / 1000).toFixed(1)}K</span>
                  </motion.div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
                  <span key={i} style={{ fontSize: '0.6rem', color: '#4b5563', flex: 1, textAlign: 'center' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div style={glass}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>All Products ({totalProducts})</h2>
              <button onClick={() => setShowAddForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
                <Plus size={14} /> Add New
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Reviews', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.images?.[0]?.url} alt="" style={{ width: 36, height: 36, borderRadius: '0.5rem', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#9ca3af', fontSize: '0.85rem' }}>{p.category}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>${p.price}</td>
                      <td style={{ padding: '0.75rem', color: (p.stock || 0) < 15 ? '#ef4444' : '#9ca3af' }}>{p.stock || 0}</td>
                      <td style={{ padding: '0.75rem' }}>⭐ {p.rating || 'New'}</td>
                      <td style={{ padding: '0.75rem', color: '#6b7280' }}>{p.numReviews || 0}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button onClick={() => { deleteProduct(p._id); toast.success('Product deleted'); }}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: '0.5rem', padding: '0.35rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={glass}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No orders yet</p>
            ) : (
              recentOrders.map((order: any, i: number) => (
                <div key={order._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 }}>
                    {order.orderItems?.[0]?.name?.charAt(0) || '#'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Order #{order._id}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>{order.orderItems?.map((i: any) => i.name).join(', ')}</p>
                  </div>
                  <span style={{ padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                    background: order.status === 'delivered' ? 'rgba(34,197,94,0.15)' : order.status === 'shipped' ? 'rgba(96,165,250,0.15)' : 'rgba(245,158,11,0.15)',
                    color: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#60a5fa' : '#f59e0b'
                  }}>{order.status}</span>
                  <span style={{ fontWeight: 700 }}>${order.totalAmount || order.totalPrice}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Low Stock Alerts */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#ef4444" /> Low Stock Alerts
              </h2>
              {lowStock.length === 0 ? (
                <p style={{ color: '#22c55e', fontWeight: 600 }}>✅ All products are well stocked</p>
              ) : (
                lowStock.map((p: any) => (
                  <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <img src={p.images?.[0]?.url} alt="" style={{ width: 32, height: 32, borderRadius: '0.4rem', objectFit: 'cover' }} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>{p.stock} left</span>
                  </div>
                ))
              )}
            </div>

            {/* Top Rated */}
            <div style={glass}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Rated Products</h2>
              {[...products].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0)).slice(0, 5).map((p: any, i: number) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ width: 20, fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>⭐ {p.rating || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAddForm(false);
                  setFormSpecs([{ key: '', value: '' }]);
                }
              }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ width: '100%', maxWidth: '550px', ...glass, padding: '2rem', position: 'relative' }}>
                <button onClick={() => { setShowAddForm(false); setFormSpecs([{ key: '', value: '' }]); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Product</h2>
                
                <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                {[
                  { key: 'name', label: 'Product Name', placeholder: 'e.g. ProBook Ultra 16"' },
                  { key: 'price', label: 'Price ($)', placeholder: '999', type: 'number' },
                  { key: 'stock', label: 'Stock Quantity', placeholder: '50', type: 'number' },
                  { key: 'description', label: 'Description', placeholder: 'Describe the product...' },
                  { key: 'imageUrl', label: 'Image URL', placeholder: 'https://images.unsplash.com/...' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                    <input value={(newProduct as any)[f.key]} onChange={e => setNewProduct({ ...newProduct, [f.key]: e.target.value })}
                      type={f.type || 'text'} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}

                {/* Specifications Builder */}
                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specifications (Optional)</label>
                  {formSpecs.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input value={spec.key} onChange={(e) => {
                          const newSpecs = [...formSpecs];
                          newSpecs[i].key = e.target.value;
                          setFormSpecs(newSpecs);
                        }}
                        type="text" placeholder="Key (e.g. RAM)"
                        style={{ flex: 1, padding: '0.6rem', borderRadius: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                      <input value={spec.value} onChange={(e) => {
                          const newSpecs = [...formSpecs];
                          newSpecs[i].value = e.target.value;
                          setFormSpecs(newSpecs);
                        }}
                        type="text" placeholder="Value (e.g. 16GB)"
                        style={{ flex: 1, padding: '0.6rem', borderRadius: '0.4rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                      <button onClick={() => {
                          if (formSpecs.length > 1) {
                            setFormSpecs(formSpecs.filter((_, idx) => idx !== i));
                          } else {
                            setFormSpecs([{ key: '', value: '' }]); // clear if last
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setFormSpecs([...formSpecs, { key: '', value: '' }])}
                    style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px dashed rgba(96,165,250,0.3)', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Plus size={14} /> Add Spec Row
                  </button>
                </div>

                {/* Category Select */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                </div>

                <button onClick={handleAddProduct}
                  style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
                  Add Product to Store
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
