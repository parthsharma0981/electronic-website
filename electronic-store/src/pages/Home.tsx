import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { ProductCard3D } from '../components/ProductGrid';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const CATEGORIES = [
  { id: 'smartphones', name: 'Mobiles', label: 'Next-gen devices', icon: '📱' },
  { id: 'laptops', name: 'Laptops', label: 'Pro performance', icon: '💻' },
  { id: 'tablets', name: 'Tablets', label: 'Versatile screens', icon: '📱' },
  { id: 'audio', name: 'Audio', label: 'Immersive sound', icon: '🎧' },
  { id: 'wearables', name: 'Wearables', label: 'Fit and focused', icon: '⌚' },
  { id: 'accessories', name: 'Extras', label: 'Complete setup', icon: '🔌' },
];

export function Home() {
  const { products } = useProducts();
  const topSellers = products.filter((p: any) => p.badge).slice(0, 3);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 200, damping: 50, restDelta: 0.001 });
  
  const heroY = useTransform(smoothScrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(smoothScrollY, [0, 500], [1, 0]);
  const shapesY1 = useTransform(smoothScrollY, [0, 1000], [0, -200]);
  const shapesY2 = useTransform(smoothScrollY, [0, 1000], [0, 400]);

  return (
    <div className="bg-bg-deep">
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden section-padding flex flex-col items-center justify-center text-center min-h-screen">
        <motion.div style={{ position: 'absolute', top: '15%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', filter: 'blur(40px)', y: shapesY1, zIndex: 0 }} />
        <motion.div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)', filter: 'blur(40px)', y: shapesY2, zIndex: 0 }} />

        <div className="container relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-secondary">Innovation Unveiled 2026</span>
          </motion.div>

          <motion.h1 style={{ y: heroY, opacity: heroOpacity }} className="hero-title text-gradient font-outfit leading-tight">
            Future Built<br />For Your <span className="text-primary italic">Life</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="hero-subtitle mb-12">
            Experience the pinnacle of electronic engineering. Premium hardware, editorial design, and seamless performance.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-4 flex-wrap justify-center">
            <Link to="/products" className="btn-premium px-10 py-5 text-lg">
              Explore Now <ArrowRight size={20} />
            </Link>
            <Link to="/sell" className="btn-premium px-10 py-5 text-lg border-white/5 bg-white/5 hover:bg-white/10">
              Start Selling
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="section-padding bg-bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-muted mb-4">Curated Selections</p>
            <h2 className="text-5xl font-extrabold font-outfit">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass-card aspect-square flex flex-col items-center justify-center group"
                >
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="text-sm font-bold tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">{cat.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <div className="container section-padding">
        <div className="flex justify-between items-end mb-16 px-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-muted mb-4">Global Trending</p>
            <h2 className="text-6xl font-black font-outfit">Top Sellers</h2>
          </div>
          <Link to="/products" className="nav-link flex items-center gap-2">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topSellers.map((p: any, i: number) => (
            <ProductCard3D key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>

      {/* ══ VALUE PROPS ══ */}
      <section className="section-padding bg-bg-elevated border-y border-white/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Truck size={24} />, title: 'Pioneer Delivery', desc: 'Complimentary shipping globally' },
              { icon: <Shield size={24} />, title: 'Core Shield', desc: 'Secure encrypted transactions' },
              { icon: <RotateCcw size={24} />, title: 'Circle Returns', desc: 'Hassle-free 30-day window' },
              { icon: <Headphones size={24} />, title: 'Expert Access', desc: '24/7 dedicated support' },
            ].map(p => (
              <div key={p.title} className="p-8 glass-card border-white/5 text-center">
                <div className="text-primary mb-6 flex justify-center">{p.icon}</div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2">{p.title}</h4>
                <p className="text-xs text-text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
