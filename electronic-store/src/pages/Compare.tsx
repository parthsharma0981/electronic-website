import { motion } from 'framer-motion';
import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, ArrowRight, GitCompareArrows } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GitCompareArrows size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>No Products to Compare</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add products to comparison from the product cards.</p>
        <Link to="/products" className="btn-glow" style={{ padding: '1rem 2rem', borderRadius: '9999px', textDecoration: 'none' }}>
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  // Collect all spec keys from all products
  const allSpecKeys = [...new Set(compareItems.flatMap(p => Object.keys(p.specs || {})))];

  const rows = [
    { label: 'Image', render: (p: any) => (
      <img src={p.images?.[0]?.url} alt={p.name} style={{ width: '100%', maxWidth: 200, aspectRatio: '1', objectFit: 'cover', borderRadius: '1rem', border: '1px solid rgba(var(--primary-rgb), 0.1)' }} />
    )},
    { label: 'Name', render: (p: any) => (
      <Link to={`/products/${p._id}`} style={{ color: 'var(--foreground)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', fontFamily: '"Outfit", sans-serif' }}>{p.name}</Link>
    )},
    { label: 'Price', render: (p: any) => (
      <div>
        <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>${p.price?.toLocaleString()}</span>
        {p.originalPrice && (
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginTop: '0.25rem' }}>${p.originalPrice?.toLocaleString()}</span>
        )}
      </div>
    )},
    { label: 'Category', render: (p: any) => (
      <span style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(var(--primary-rgb), 0.06)', border: '1px solid rgba(var(--primary-rgb), 0.12)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>{p.category}</span>
    )},
    { label: 'Rating', render: (p: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < Math.round(p.rating || 0) ? '#fbbf24' : 'none'} color={i < Math.round(p.rating || 0) ? '#fbbf24' : '#374151'} />
          ))}
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.rating || 'N/A'}</span>
      </div>
    )},
    { label: 'Reviews', render: (p: any) => (
      <span style={{ color: 'var(--text-secondary)' }}>{p.numReviews || 0} reviews</span>
    )},
    { label: 'Stock', render: (p: any) => (
      <span style={{ fontWeight: 600, color: (p.stock || 0) > 10 ? '#34d399' : '#f87171' }}>
        {(p.stock || 0) > 10 ? `✓ In Stock (${p.stock})` : (p.stock || 0) > 0 ? `⚡ Only ${p.stock} left` : '✗ Out of Stock'}
      </span>
    )},
    ...allSpecKeys.map(key => ({
      label: key,
      render: (p: any) => (
        <span style={{ color: p.specs?.[key] ? 'var(--foreground)' : 'var(--text-muted)' }}>
          {p.specs?.[key] || '—'}
        </span>
      )
    })),
    { label: 'Action', render: (p: any) => (
      <button onClick={() => addToCart(p, 1)} className="btn-glow" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <ShoppingBag size={16} /> Add to Cart
      </button>
    )},
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '10%', left: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Side by Side</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
              Compare <span className="gradient-text">Products</span>
            </h1>
          </div>
          <button onClick={clearCompare} className="btn-premium" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
            Clear All
          </button>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
          backdropFilter: 'blur(40px)', borderRadius: '1.5rem', overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ width: '140px', padding: '1.5rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
                    Feature
                  </th>
                  {compareItems.map(p => (
                    <th key={p._id} style={{ padding: '1.5rem 1rem', textAlign: 'center', borderBottom: '1px solid rgba(var(--primary-rgb), 0.1)', position: 'relative', minWidth: '200px' }}>
                      <button onClick={() => removeFromCompare(p._id)} style={{
                        position: 'absolute', top: '0.75rem', right: '0.75rem', width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <X size={14} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(var(--primary-rgb), 0.02)' }}>
                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid rgba(var(--primary-rgb), 0.05)', whiteSpace: 'nowrap' }}>
                      {row.label}
                    </td>
                    {compareItems.map(p => (
                      <td key={p._id} style={{ padding: '1.25rem 1rem', textAlign: 'center', borderBottom: '1px solid rgba(var(--primary-rgb), 0.05)', verticalAlign: 'middle' }}>
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
