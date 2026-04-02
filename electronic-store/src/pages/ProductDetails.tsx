import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Truck, Shield, RotateCcw, ChevronRight, ArrowUpRight, Star, ShoppingBag, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products } = useProducts();
  const product = getProduct(id || '');
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) return <div style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.5rem' }}>Product not found</div>;

  const handleBuy = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added!`); navigate('/checkout'); };
  const handleAddToCart = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added to cart!`); };

  const related = products.filter((p: any) => p.category === product.category && p._id !== product._id).slice(0, 4);
  const moreProducts = related.length < 3
    ? [...related, ...products.filter((p: any) => p._id !== product._id && !related.find((r: any) => r._id === p._id)).slice(0, 4 - related.length)]
    : related;

  return (
    <div className="bg-bg-deep min-h-screen" style={{ position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '10%', right: '-5%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.03) 0%, transparent 70%)', bottom: '20%', left: '-5%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Breadcrumb */}
      <div className="container" style={{ padding: '5rem 2rem 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Shop</Link>
          <ChevronRight size={10} />
          <Link to="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>{product.category}</Link>
          <ChevronRight size={10} />
          <span style={{ color: 'var(--text-muted)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main: Image Left + Info Right */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', position: 'relative', zIndex: 1 }}>

        {/* Product Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)', aspectRatio: '1', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
          <img src={product.images?.[0]?.url} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.badge && (
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'var(--gradient-primary)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)' }}>
              {product.badge}
            </div>
          )}
          <button onClick={() => toggleWishlist(product)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', width: 44, height: 44, borderRadius: '50%', background: isWishlisted(product._id) ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: isWishlisted(product._id) ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
            <Heart size={18} fill={isWishlisted(product._id) ? '#ef4444' : 'none'} color={isWishlisted(product._id) ? '#ef4444' : '#fff'} />
          </button>
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>{product.category}</p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
            {product.originalPrice && (
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.originalPrice.toLocaleString()}</span>
            )}
            <span className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 700 }}>${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px', background: 'rgba(34,197,94,0.1)', color: '#34d399', border: '1px solid rgba(34,197,94,0.2)' }}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', gap: '0.15rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? '#fbbf24' : 'none'} color={i < Math.round(product.rating || 0) ? '#fbbf24' : '#374151'} />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.rating} · {product.numReviews || 0} reviews</span>
          </div>

          {/* Specs */}
          {product.specs && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(product.specs).map(([k, v]: any) => (
                  <span key={k} style={{ padding: '0.5rem 0.85rem', borderRadius: '0.5rem', background: 'rgba(var(--primary-rgb), 0.04)', border: '1px solid rgba(var(--primary-rgb), 0.1)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--primary)', textTransform: 'capitalize', fontWeight: 600 }}>{k}:</span> {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            {(product.stock || 0) > 0 ? (
              <>
                <button onClick={handleAddToCart}
                  className="btn-premium"
                  style={{ padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={18} /> Add to Bag
                </button>
                <button onClick={handleBuy}
                  className="btn-glow"
                  style={{ padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Zap size={18} /> Buy Now
                </button>
              </>
            ) : (
              <button disabled
                style={{ gridColumn: '1 / -1', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Out of Stock
              </button>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '2rem', marginBottom: '1.25rem', fontWeight: 300 }}>{product.description}</p>

          <Link to="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(var(--primary-rgb), 0.2)', paddingBottom: '0.25rem', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'; }}>
            MORE INFORMATION <ArrowUpRight size={12} />
          </Link>

          {/* Promises */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            {[
              { icon: <Truck size={15} />, label: 'Free Shipping', sub: 'On $200+' },
              { icon: <Shield size={15} />, label: '1 Year Warranty', sub: 'Full coverage' },
              { icon: <RotateCcw size={15} />, label: '30-Day Returns', sub: 'No questions' },
            ].map(p => (
              <div key={p.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{p.icon}</div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 0.1rem' }}>{p.label}</p>
                <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', margin: 0 }}>{p.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: (product.stock || 0) > 10 ? '#34d399' : '#f87171' }}>
              {(product.stock || 0) > 10 ? '✓ In Stock' : `⚡ Only ${product.stock} left — order soon`}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Related Products ── */}
      {moreProducts.length > 0 && (
        <div className="container" style={{ padding: '4rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: '1px solid rgba(var(--primary-rgb), 0.06)', paddingTop: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>You may also like</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
                Try Our Collection
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(moreProducts.length, 4)}, 1fr)`, gap: '1.25rem' }}>
              {moreProducts.map((p: any, i: number) => (
                <Link to={`/products/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                    style={{ cursor: 'pointer', borderRadius: '0.75rem', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.06)', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>

                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img src={p.images?.[0]?.url} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 50%)' }} />
                      {p.badge && (
                        <span style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'var(--gradient-primary)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                          {p.badge}
                        </span>
                      )}
                      <span style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>${p.price.toLocaleString()}</span>
                    </div>

                    <div style={{ padding: '0.85rem 1rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0 0 0.3rem', fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>{p.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={11} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.rating || 'New'}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary)' }}>View →</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/products"
                className="btn-premium"
                style={{ padding: '0.85rem 2rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
