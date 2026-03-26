import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem' };

export function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { decreaseStock } = useProducts();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', phone: '' });
  const [payment, setPayment] = useState('card');

  const handlePlaceOrder = () => {
    const order = createOrder(cartItems, shipping, payment, totalPrice);
    decreaseStock(cartItems);
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate(`/track/${order._id}`);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '8rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Your bag is empty</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Add items to your bag before checkout.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        {[{ n: 1, label: 'Shipping', icon: <MapPin size={16} /> }, { n: 2, label: 'Payment', icon: <CreditCard size={16} /> }, { n: 3, label: 'Review', icon: <Check size={16} /> }].map(s => (
          <div key={s.n} onClick={() => s.n < step && setStep(s.n)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', cursor: s.n <= step ? 'pointer' : 'default', background: step >= s.n ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${step >= s.n ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.3s', color: step >= s.n ? '#fff' : '#6b7280', fontWeight: 600, fontSize: '0.85rem' }}>
            {s.icon} {s.label}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={step}>
        {step === 1 && (
          <div style={glass}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Shipping Address</h2>
            {['name', 'address', 'city', 'zip', 'phone'].map(field => (
              <div key={field} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{field}</label>
                <input value={(shipping as any)[field]} onChange={e => setShipping({ ...shipping, [field]: e.target.value })}
                  style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  placeholder={`Enter your ${field}`} />
              </div>
            ))}
            <button onClick={() => setStep(2)} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#fff', color: '#000', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={glass}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Payment Method</h2>
            {[{ id: 'card', label: 'Credit / Debit Card', icon: '💳' }, { id: 'upi', label: 'UPI / Net Banking', icon: '🏦' }, { id: 'cod', label: 'Cash on Delivery', icon: '💵' }].map(pm => (
              <div key={pm.id} onClick={() => setPayment(pm.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '1rem', cursor: 'pointer', marginBottom: '0.75rem', background: payment === pm.id ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${payment === pm.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.3s' }}>
                <span style={{ fontSize: '1.5rem' }}>{pm.icon}</span>
                <span style={{ fontWeight: 600, flex: 1 }}>{pm.label}</span>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payment === pm.id ? '#fff' : '#4b5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {payment === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#fff', color: '#000', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
              Review Order
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={glass}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Order Summary</h2>
            {cartItems.map((item: any) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={item.images?.[0]?.url || item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: '0.75rem', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            {/* Shipping Summary */}
            {shipping.name && (
              <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem' }}>Shipping To</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{shipping.name}, {shipping.address}, {shipping.city} - {shipping.zip}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '2rem', fontWeight: 700 }}>${totalPrice.toFixed(2)}</span>
            </div>
            <button onClick={handlePlaceOrder} style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}>
              Place Order 🎉
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
