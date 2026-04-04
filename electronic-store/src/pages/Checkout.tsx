import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { couponService } from '../services/couponService.js';
import { CreditCard, MapPin, Check, ArrowRight, ShoppingBag, Tag, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { decreaseStock } = useProducts();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ 
    name: user?.name || '', 
    address: user?.address?.street || typeof user?.address === 'string' ? user?.address : '', 
    city: user?.address?.city || '', 
    zip: user?.address?.pincode || '', 
    phone: user?.phone || '' 
  });
  const [payment, setPayment] = useState('card');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const discount = appliedCoupon?.discount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await couponService.validate(couponCode.trim(), totalPrice);
      setAppliedCoupon(res.data);
      toast.success(`Coupon applied! You save $${res.data.discount.toFixed(2)} 🎉`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid coupon code';
      setCouponError(msg);
      setAppliedCoupon(null);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder(cartItems, shipping, payment, finalPrice);
      decreaseStock(cartItems);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/track/${order._id}`);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: '1px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <ShoppingBag size={32} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add items to your bag before checkout.</p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem',
    background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
    color: 'var(--foreground)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.3s, box-shadow 0.3s',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '15%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        {[{ n: 1, label: 'Shipping', icon: <MapPin size={16} /> }, { n: 2, label: 'Payment', icon: <CreditCard size={16} /> }, { n: 3, label: 'Review', icon: <Check size={16} /> }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div onClick={() => s.n < step && setStep(s.n)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem', borderRadius: '9999px',
              cursor: s.n <= step ? 'pointer' : 'default',
              background: step >= s.n ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${step >= s.n ? 'rgba(var(--primary-rgb), 0.25)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s',
              color: step >= s.n ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.8rem',
              boxShadow: step >= s.n ? '0 0 20px rgba(var(--primary-rgb), 0.05)' : 'none',
            }}>
              {s.icon} {s.label}
            </div>
            {i < 2 && <div style={{ width: '2rem', height: '1px', background: step > s.n ? 'rgba(var(--primary-rgb), 0.3)' : 'rgba(255,255,255,0.06)' }} />}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={step} style={{ position: 'relative', zIndex: 1 }}>
        {step === 1 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
            backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', fontFamily: '"Outfit", sans-serif' }}>
              Shipping <span className="gradient-text">Address</span>
            </h2>
            {['name', 'address', 'city', 'zip', 'phone'].map(field => (
              <div key={field} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'capitalize', letterSpacing: '0.05em' }}>{field}</label>
                <input value={(shipping as any)[field]} onChange={e => setShipping({ ...shipping, [field]: e.target.value })}
                  style={inputStyle}
                  placeholder={`Enter your ${field}`}
                  onFocus={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.4)'; e.target.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
            <button onClick={() => setStep(2)} className="btn-glow" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}>
              Continue to Payment <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
            backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', fontFamily: '"Outfit", sans-serif' }}>
              Payment <span className="gradient-text">Method</span>
            </h2>
            {[{ id: 'card', label: 'Credit / Debit Card', icon: '💳' }, { id: 'upi', label: 'UPI / Net Banking', icon: '🏦' }, { id: 'cod', label: 'Cash on Delivery', icon: '💵' }].map(pm => (
              <div key={pm.id} onClick={() => setPayment(pm.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1.25rem', borderRadius: '1rem', cursor: 'pointer', marginBottom: '0.75rem',
                  background: payment === pm.id ? 'rgba(var(--primary-rgb), 0.06)' : 'transparent',
                  border: `1px solid ${payment === pm.id ? 'rgba(var(--primary-rgb), 0.25)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.3s',
                  boxShadow: payment === pm.id ? '0 0 20px rgba(var(--primary-rgb), 0.03)' : 'none',
                }}>
                <span style={{ fontSize: '1.5rem' }}>{pm.icon}</span>
                <span style={{ fontWeight: 600, flex: 1, color: payment === pm.id ? 'var(--foreground)' : 'var(--text-secondary)' }}>{pm.label}</span>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payment === pm.id ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {payment === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(3)} className="btn-glow" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}>
              Review Order <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
            backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', fontFamily: '"Outfit", sans-serif' }}>
              Order <span className="gradient-text">Summary</span>
            </h2>
            {cartItems.map((item: any) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
                <img src={item.images?.[0]?.url || item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid rgba(var(--primary-rgb), 0.08)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            {/* Shipping Summary */}
            {shipping.name && (
              <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>Shipping To</p>
                <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>{shipping.name}, {shipping.address}, {shipping.city} - {shipping.zip}</p>
              </div>
            )}

            {/* ═══ Coupon Code Section ═══ */}
            <div style={{
              padding: '1.25rem', borderRadius: '1rem',
              background: appliedCoupon ? 'rgba(34, 197, 94, 0.04)' : 'rgba(var(--primary-rgb), 0.02)',
              border: `1px solid ${appliedCoupon ? 'rgba(34, 197, 94, 0.15)' : 'rgba(var(--primary-rgb), 0.08)'}`,
              marginBottom: '1rem', transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Tag size={16} style={{ color: appliedCoupon ? '#34d399' : 'var(--primary)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: appliedCoupon ? '#34d399' : 'var(--primary)' }}>
                  {appliedCoupon ? 'Coupon Applied' : 'Have a Promo Code?'}
                </span>
              </div>

              {appliedCoupon ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.4rem 0.85rem', borderRadius: '9999px',
                        background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
                        fontSize: '0.85rem', fontWeight: 700, color: '#34d399',
                      }}>
                        🎟️ {appliedCoupon.code}
                      </span>
                      <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: '#34d399' }}>
                        -${appliedCoupon.discount.toFixed(2)} OFF
                      </span>
                      {appliedCoupon.description && (
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appliedCoupon.description}</p>
                      )}
                    </div>
                    <button onClick={removeCoupon} style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0,
                    }}>
                      <X size={14} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    placeholder="Enter code"
                    style={{
                      ...inputStyle, flex: 1, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600,
                      borderColor: couponError ? 'rgba(239,68,68,0.3)' : 'rgba(var(--primary-rgb), 0.1)',
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    onFocus={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.3)'}
                    onBlur={e => e.target.style.borderColor = couponError ? 'rgba(239,68,68,0.3)' : 'rgba(var(--primary-rgb), 0.1)'}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                    className="btn-premium"
                    style={{
                      padding: '0 1.5rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap',
                      opacity: couponLoading || !couponCode.trim() ? 0.5 : 1,
                    }}>
                    {couponLoading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>
                  {couponError}
                </motion.p>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(var(--primary-rgb), 0.1)', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 500 }}>Discount ({appliedCoupon?.code})</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>-${discount.toFixed(2)}</span>
                </motion.div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total</span>
                <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>${finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="btn-glow" style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
              Place Order 🎉
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
