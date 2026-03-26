import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Plus, Minus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

export function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8"
        >
          <ShoppingBag size={40} className="text-text-muted" />
        </motion.div>
        <h2 className="text-5xl font-black font-outfit mb-4 uppercase">Your bag is empty</h2>
        <p className="text-text-muted tracking-[0.2em] uppercase text-xs mb-12">Free delivery and returns on all core products.</p>
        <Link to="/products" className="btn-premium px-12 py-5">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 200 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container section-padding min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-7xl font-black font-outfit mb-16 uppercase tracking-tight">
          Shopping <span className="text-primary italic">Bag</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:grid grid-cols-12 pb-6 border-bottom border-white/10 text-[10px] font-black tracking-widest uppercase text-text-muted">
              <span className="col-span-6">Product</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Total</span>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item: { product: Product, quantity: number }, idx: number) => {
                  const product = item.product;
                  const imageUrl = product.images?.[0]?.url || (product as any).image;

                  return (
                    <motion.div 
                      layout
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-white/5"
                    >
                      <div className="col-span-1 md:col-span-6 flex gap-8 items-center">
                        <div className="w-32 aspect-[3/4] bg-bg-surface overflow-hidden glass-card">
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-outfit uppercase truncate">{product.name}</h3>
                          <p className="text-xs text-text-muted uppercase tracking-widest mt-1 mb-4">{product.category}</p>
                          <p className="text-lg font-medium">${product.price.toLocaleString()}</p>
                          
                          <button 
                            onClick={() => removeFromCart(product._id)} 
                            className="flex items-center gap-2 mt-6 text-[10px] font-black uppercase text-text-muted hover:text-red-400 transition-colors"
                          >
                            <X size={12} strokeWidth={3} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-3 flex justify-center">
                        <div className="flex items-center gap-4 rounded-full border border-white/10 px-4 py-2">
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity - 1)} 
                            className="text-text-secondary hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity + 1)} 
                            className="text-text-secondary hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-3 text-right text-2xl font-black font-outfit">
                        ${(product.price * item.quantity).toLocaleString()}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="glass-card p-10 bg-bg-surface/50 border-white/5">
              <h2 className="text-sm font-black tracking-widest uppercase mb-10 font-outfit border-b border-white/10 pb-4">
                Summary
              </h2>

              <div className="space-y-6 text-sm text-text-secondary mb-10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-white font-bold">${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/10 mb-10">
                <span className="text-xs font-black uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black font-outfit">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              <Link to="/checkout" className="btn-premium w-full py-5 justify-center gap-3 text-lg bg-white text-black hover:bg-white/90">
                Checkout <ArrowRight size={20} />
              </Link>

              <p className="mt-8 text-[10px] text-text-muted leading-relaxed uppercase tracking-widest text-center">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
