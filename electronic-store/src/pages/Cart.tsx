import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Plus, Minus, X, ArrowRight, ShoppingBag, Shield, Truck, RotateCcw } from 'lucide-react';

export function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 4rem', position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}
        >
          <ShoppingBag size={40} style={{ color: 'var(--primary)' }} />
        </motion.div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--foreground)' }}>
          Your bag is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '3rem' }}>
          Free delivery and returns on all core products.
        </p>
        <Link to="/products" className="btn-glow" style={{ padding: '1.15rem 3rem', textDecoration: 'none', borderRadius: '9999px' }}>
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 200 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      {/* Ambient glow background decoration */}
      <div style={{ position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '10%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.03) 0%, transparent 70%)', bottom: '20%', left: '-5%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            Your Collection
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, fontFamily: '"Outfit", sans-serif', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '-0.025em', color: 'var(--foreground)', lineHeight: 1.1 }}>
            Shopping <span className="gradient-text" style={{ fontStyle: 'italic' }}>Bag</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem' }}>
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your bag
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start' }}>

          {/* Cart Items */}
          <div>
            {/* Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(var(--primary-rgb), 0.08)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <span>Product</span>
              <span style={{ textAlign: 'center' }}>Quantity</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {/* Items */}
            <AnimatePresence mode="popLayout">
              {cart.items.map((item: any, idx: number) => {
                const product = item.product || {};
                const imageUrl = product?.images?.[0]?.url || product?.image || '';

                return (
                  <motion.div
                    layout
                    key={product?._id || idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      alignItems: 'center',
                      padding: '1.75rem 0',
                      borderBottom: '1px solid var(--glass-border)',
                    }}
                  >
                    {/* Product Info */}
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                          width: 100, height: 120, borderRadius: '1rem', overflow: 'hidden',
                          background: 'var(--bg-card)', flexShrink: 0,
                          border: '1px solid rgba(var(--primary-rgb), 0.08)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        }}>
                        {imageUrl && (
                          <img src={imageUrl} alt={product?.name || 'Item'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </motion.div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', marginBottom: '0.2rem', color: 'var(--foreground)', letterSpacing: '0.02em' }}>
                          {product?.name || 'Unavailable Item'}
                        </h3>
                        <p style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', fontWeight: 600 }}>
                          {product?.category || 'Unknown'}
                        </p>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          ${(product?.price || 0).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(product?._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                            color: 'var(--text-muted)', background: 'none', border: 'none',
                            cursor: 'pointer', padding: 0, letterSpacing: '0.1em',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <X size={12} strokeWidth={3} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        borderRadius: '9999px', border: '1px solid rgba(var(--primary-rgb), 0.12)',
                        padding: '0.4rem 0.75rem', background: 'rgba(var(--primary-rgb), 0.04)',
                      }}>
                        <button
                          onClick={() => updateQuantity(product?._id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ width: '2rem', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)', fontFamily: '"Outfit", sans-serif' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product?._id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
                        ${((product?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping link */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
              <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', transition: 'opacity 0.2s' }}>
                ← Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ position: 'sticky', top: '7rem' }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(var(--primary-rgb), 0.1)',
              backdropFilter: 'blur(40px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2), 0 0 60px rgba(var(--primary-rgb), 0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative gradient accent on top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)' }} />
              
              <h2 style={{
                fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: '1.75rem', fontFamily: '"Outfit", sans-serif',
                paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--foreground)',
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Truck size={14} style={{ color: 'var(--primary)' }} /> Shipping
                  </span>
                  <span style={{ color: shipping === 0 ? '#34d399' : 'var(--foreground)', fontWeight: 700 }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Tax</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)', marginBottom: '1.75rem',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>Total</span>
                <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link to="/checkout" className="btn-glow" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                width: '100%', padding: '1.15rem', borderRadius: '0.75rem',
                textDecoration: 'none', fontSize: '1rem',
              }}>
                Checkout <ArrowRight size={20} />
              </Link>

              {/* Trust badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
                {[
                  { icon: <Shield size={13} />, label: 'Secure' },
                  { icon: <Truck size={13} />, label: 'Fast Ship' },
                  { icon: <RotateCcw size={13} />, label: '30-Day Return' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <span style={{ color: 'var(--primary)' }}>{b.icon}</span> {b.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
