import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Truck, Shield, RotateCcw, ChevronRight, ArrowUpRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const product = getProduct(id || '');
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Scroll to top when navigating between products
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) return <div style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center', color: '#6b7280', fontSize: '1.5rem' }}>Product not found</div>;

  const handleBuy = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added!`); navigate('/checkout'); };
  const handleAddToCart = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added to cart!`); };

  // Related products (same category, exclude current) — show 3–4
  const related = products.filter((p: any) => p.category === product.category && p._id !== product._id).slice(0, 4);
  // If not enough in same category, fill from all products
  const moreProducts = related.length < 3
    ? [...related, ...products.filter((p: any) => p._id !== product._id && !related.find((r: any) => r._id === p._id)).slice(0, 4 - related.length)]
    : related;

  return (
    <div style={{ minHeight: '100vh', background: '#080810' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6.5rem 2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#4b5563', textDecoration: 'none' }}>Shop</Link>
          <ChevronRight size={10} />
          <Link to="/products" style={{ color: '#4b5563', textDecoration: 'none' }}>{product.category}</Link>
          <ChevronRight size={10} />
          <span style={{ color: '#9ca3af' }}>{product.name}</span>
        </div>
      </div>

      {/* Main: Image Left + Info Right */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

        {/* Product Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: '#111118', aspectRatio: '1' }}>
          <img src={product.images?.[0]?.url} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.badge && (
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 0.85rem', borderRadius: '0.4rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
              {product.badge}
            </div>
          )}
          <button onClick={() => toggleWishlist(product)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} fill={isWishlisted(product._id) ? '#ef4444' : 'none'} color={isWishlisted(product._id) ? '#ef4444' : '#fff'} />
          </button>
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 400, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
            {product.originalPrice && (
              <span style={{ fontSize: '1.1rem', color: '#4b5563', textDecoration: 'line-through' }}>${product.originalPrice.toLocaleString()}</span>
            )}
            <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.15rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? '#f59e0b' : 'none'} color={i < Math.round(product.rating || 0) ? '#f59e0b' : '#374151'} />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{product.rating} · {product.numReviews || 0} reviews</span>
          </div>

          {/* Specs */}
          {product.specs && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.75rem' }}>Specifications</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(product.specs).map(([k, v]: any) => (
                  <span key={k} style={{ padding: '0.5rem 0.85rem', borderRadius: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#d1d5db' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{k}:</span> {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
              {(product.stock || 0) > 0 ? (
                <>
                  <button onClick={handleAddToCart}
                    style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Add to Bag
                  </button>
                  <button onClick={handleBuy}
                    style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fff', border: 'none', color: '#000', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Buy Now
                  </button>
                </>
              ) : (
                <button disabled
                  style={{ gridColumn: '1 / -1', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#6b7280', fontSize: '1rem', fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Out of Stock
                </button>
              )}
            </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#9ca3af', marginBottom: '1.25rem', fontWeight: 300 }}>{product.description}</p>

          <Link to="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
            MORE INFORMATION <ArrowUpRight size={12} />
          </Link>

          {/* Promises */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { icon: <Truck size={15} />, label: 'Free Shipping', sub: 'On $200+' },
              { icon: <Shield size={15} />, label: '1 Year Warranty', sub: 'Full coverage' },
              { icon: <RotateCcw size={15} />, label: '30-Day Returns', sub: 'No questions' },
            ].map(p => (
              <div key={p.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color: '#4b5563', marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{p.icon}</div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d1d5db', margin: '0 0 0.1rem' }}>{p.label}</p>
                <p style={{ fontSize: '0.55rem', color: '#4b5563', margin: 0 }}>{p.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: (product.stock || 0) > 10 ? '#22c55e' : '#ef4444' }}>
              {(product.stock || 0) > 10 ? '✓ In Stock' : `⚡ Only ${product.stock} left — order soon`}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Below: 3–4 Product Cards in a Row ── */}
      {moreProducts.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 4rem' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.5rem' }}>You may also like</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Try Our Collection
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(moreProducts.length, 4)}, 1fr)`, gap: '1.25rem' }}>
              {moreProducts.map((p: any, i: number) => (
                <Link to={`/products/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                    style={{ cursor: 'pointer', borderRadius: '0.75rem', overflow: 'hidden', background: '#0f0f18', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>

                    {/* Image */}
                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img src={p.images?.[0]?.url} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                      {p.badge && (
                        <span style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                          {p.badge}
                        </span>
                      )}
                      <span style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>${p.price.toLocaleString()}</span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0.85rem 1rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0 0 0.3rem', fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={11} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{p.rating || 'New'}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6366f1' }}>View →</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* View All */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
