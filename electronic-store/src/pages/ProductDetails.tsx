import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService.js';
import { Heart, Truck, Shield, RotateCcw, ChevronRight, ArrowUpRight, Star, ShoppingBag, Zap, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductDetailSkeleton } from '../components/Skeleton';

function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    reviewService.getByProduct(productId)
      .then((res: any) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async () => {
    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await reviewService.add(productId, { rating, title, comment });
      setReviews([res.data, ...reviews]);
      setShowForm(false);
      setTitle('');
      setComment('');
      setRating(5);
      toast.success('Review submitted! ✨');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>Customer Feedback</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
          Reviews & Ratings
        </h2>
      </div>

      {/* Rating Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'center',
        padding: '2rem', borderRadius: '1.25rem', background: 'var(--bg-card)',
        border: '1px solid rgba(var(--primary-rgb), 0.08)', marginBottom: '2rem',
      }}>
        {/* Left: Big score */}
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <p className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', lineHeight: 1 }}>{avgRating}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.15rem', margin: '0.5rem 0' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill={i < Math.round(Number(avgRating)) ? '#fbbf24' : 'none'} color={i < Math.round(Number(avgRating)) ? '#fbbf24' : '#374151'} />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Right: Distribution bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ratingCounts.map(({ star, count, pct }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '2rem', textAlign: 'right' }}>{star}★</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(var(--primary-rgb), 0.06)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                  style={{ height: '100%', borderRadius: 4, background: star >= 4 ? 'linear-gradient(to right, #fbbf24, #f59e0b)' : star >= 3 ? '#60a5fa' : '#ef4444' }}
                />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '2rem' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button / Form */}
      {user && !showForm && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-premium"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', fontSize: '0.85rem' }}
        >
          <MessageSquare size={16} /> Write a Review
        </motion.button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
          >
            <div style={{
              padding: '2rem', borderRadius: '1.25rem', background: 'var(--bg-card)',
              border: '1px solid rgba(var(--primary-rgb), 0.1)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: '"Outfit", sans-serif' }}>
                Your <span className="gradient-text">Review</span>
              </h3>

              {/* Star Picker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Rating</p>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.2s' }}
                    >
                      <Star size={28} fill={s <= (hoverRating || rating) ? '#fbbf24' : 'none'} color={s <= (hoverRating || rating) ? '#fbbf24' : '#374151'} style={{ transition: 'all 0.2s' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Title</p>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience"
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
                    color: 'var(--foreground)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.3)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'}
                />
              </div>

              {/* Comment */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Review</p>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share details of your experience with this product..."
                  rows={4}
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
                    color: 'var(--foreground)', fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.3)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSubmit} disabled={submitting} className="btn-glow" style={{ padding: '0.85rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.6 : 1 }}>
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-premium" style={{ padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.9rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review: any, i: number) => (
            <motion.div key={review._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-card)',
                border: '1px solid rgba(var(--primary-rgb), 0.06)', transition: 'border-color 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {(review.name || 'A')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem', color: 'var(--foreground)' }}>{review.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < review.rating ? '#fbbf24' : 'none'} color={i < review.rating ? '#fbbf24' : '#374151'} />
                  ))}
                </div>
              </div>
              <h4 style={{ fontWeight: 700, margin: '0 0 0.35rem', fontSize: '1rem', color: 'var(--foreground)' }}>{review.title}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, loading } = useProducts();
  const product = getProduct(id || '');
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product?._id]);

  if (loading && !product) {
    return <ProductDetailSkeleton />;
  }
  
  if (!product) return <div style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.5rem' }}>Product not found</div>;

  const handleBuy = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added!`); navigate('/checkout'); };
  const handleAddToCart = () => { addToCart({ ...product, quantity: 1 }); toast.success(`${product.name} added to cart!`); };

  // Enhanced Recommendations Logic
  // Weighting: Same Category (+5) > Similar Price ±20% (+3) > Outstanding Rating >= 4.5 (+2)
  const recommendations = [...products]
    .filter((p: any) => p._id !== product._id)
    .map((p: any) => {
      let score = 0;
      if (p.category === product.category) score += 5;
      if (p.price >= product.price * 0.8 && p.price <= product.price * 1.2) score += 3;
      if (p.rating >= 4.5) score += 2;
      return { ...p, recScore: score };
    })
    .sort((a, b) => b.recScore - a.recScore)
    .slice(0, 4);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)', aspectRatio: '1', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={product.images?.[activeImage]?.url || product.images?.[0]?.url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>
            {product.badge && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'var(--gradient-primary)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)', zIndex: 10 }}>
                {product.badge}
              </div>
            )}
            <button onClick={() => toggleWishlist(product)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', width: 44, height: 44, borderRadius: '50%', background: isWishlisted(product._id) ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: isWishlisted(product._id) ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', zIndex: 10 }}>
              <Heart size={18} fill={isWishlisted(product._id) ? '#ef4444' : 'none'} color={isWishlisted(product._id) ? '#ef4444' : '#fff'} />
            </button>
          </motion.div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img: any, idx: number) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  style={{
                    width: '5rem', height: '5rem', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0,
                    border: activeImage === idx ? '2px solid var(--primary)' : '2px solid transparent',
                    background: 'var(--bg-card)', cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                    opacity: activeImage === idx ? 1 : 0.6
                  }}
                >
                  <img src={img.url} alt={`${product.name} thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

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

      {/* ── Reviews Section ── */}
      <div className="container" style={{ padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <ReviewSection productId={product._id} />
      </div>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <div className="container" style={{ padding: '4rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ borderTop: '1px solid rgba(var(--primary-rgb), 0.06)', paddingTop: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>You may also like</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
                Recommended For You
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(recommendations.length, 4)}, 1fr)`, gap: '1.25rem' }}>
              {recommendations.map((p: any, i: number) => (
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
