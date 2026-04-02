import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  if (!wishlist || wishlist.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', paddingTop: '8rem', position: 'relative' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.06) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}
        >
          <Heart size={40} style={{ color: 'var(--primary)' }} />
        </motion.div>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--foreground)' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '3rem' }}>Secure your favorite hardware benchmarks here.</p>
        <Link to="/products" className="btn-glow" style={{ padding: '1.15rem 3rem', textDecoration: 'none', borderRadius: '9999px' }}>Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '10%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Your Collection</p>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '3rem', letterSpacing: '-0.02em', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
          Saved <span className="gradient-text">Items.</span>
        </h1>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
        {wishlist.map((product: any, idx: number) => {
          const imageUrl = product.images?.[0]?.url || product.image;
          return (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                borderRadius: '1.5rem', background: 'var(--bg-card)',
                border: '1px solid rgba(var(--primary-rgb), 0.08)',
                backdropFilter: 'blur(20px)', transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(var(--primary-rgb), 0.08)' }}>
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--foreground)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--foreground)'}
                  >{product.name}</h3>
                </Link>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>${product.price ? product.price.toLocaleString() : '0'}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => addToCart(product, 1)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity 0.2s' }}>
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                  <button onClick={() => toggleWishlist(product)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity 0.2s' }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
