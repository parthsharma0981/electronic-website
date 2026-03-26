import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  if (!wishlist || wishlist.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Your wishlist is empty.</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem' }}>Save your favorite hardware here.</p>
        <Link to="/products" className="hero-button" style={{ textDecoration: 'none' }}>Discover Products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '3rem', letterSpacing: '-0.02em' }}>Saved Items.</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {wishlist.map((product: any, idx: number) => {
          const imageUrl = product.images?.[0]?.url || product.image;
          return (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{product.name}</h3>
                </Link>
                <p style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '0.75rem' }}>${product.price}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => addToCart(product, 1)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                  <button onClick={() => toggleWishlist(product)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
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
