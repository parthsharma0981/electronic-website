import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard3D } from '../components/ProductGrid';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Sparkles, Star, Clock } from 'lucide-react';

const CATEGORIES = [
  { id: 'Computing', name: 'Computing', label: 'Laptops & Desktops', icon: '💻' },
  { id: 'Mobile', name: 'Mobile', label: 'Smartphones & Tablets', icon: '📱' },
  { id: 'Audio', name: 'Audio', label: 'Headphones & Speakers', icon: '🎧' },
  { id: 'Wearable', name: 'Wearable', label: 'Smartwatches & Bands', icon: '⌚' },
  { id: 'Gaming', name: 'Gaming', label: 'Consoles & Accessories', icon: '🎮' },
  { id: 'Accessories', name: 'Accessories', label: 'Cables, Cases & More', icon: '🔌' },
];

export function Home() {
  const { products } = useProducts();
  const { recentlyViewed } = useRecentlyViewed();
  const { t } = useLanguage();
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
        {/* Ambient glow orbs */}
        <motion.div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%)', filter: 'blur(60px)', y: shapesY1, zIndex: 0 }} />
        <motion.div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%)', filter: 'blur(60px)', y: shapesY2, zIndex: 0 }} />
        <motion.div style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.06) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(-50%, -50%)', zIndex: 0 }} />

        <div className="container relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.5rem 1.25rem', borderRadius: '9999px',
              background: 'rgba(var(--primary-rgb), 0.06)',
              border: '1px solid rgba(var(--primary-rgb), 0.12)',
              marginBottom: '2.5rem',
            }}
          >
            <Sparkles size={12} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)' }}>Innovation Unveiled 2026</span>
          </motion.div>

          <motion.h1 style={{ y: heroY, opacity: heroOpacity }} className="hero-title font-outfit leading-tight">
            <span className="text-gradient">Future Built</span><br />
            <span className="text-gradient">For Your </span>
            <span className="gradient-text" style={{ fontStyle: 'italic' }}>Life</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="hero-subtitle mb-12">
            Experience the pinnacle of electronic engineering. Premium hardware, editorial design, and seamless performance.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-4 flex-wrap justify-center">
            <Link to="/products" className="btn-glow" style={{ padding: '1.25rem 2.5rem', borderRadius: '9999px', fontSize: '1.1rem' }}>
              Explore Now <ArrowRight size={20} />
            </Link>
            <Link to="/sell" className="btn-premium px-10 py-5 text-lg">
              Start Selling
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg-surface)', position: 'relative' }}>
        {/* Subtle gradient line */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.15), transparent)' }} />
        <div className="container">
          <div className="text-center mb-16">
            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1rem' }}>Curated Selections</p>
            <h2 className="text-5xl font-extrabold font-outfit">Shop by <span className="gradient-text">Category</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass-card aspect-square flex flex-col items-center justify-center group"
                  style={{ textAlign: 'center' }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: '1rem', transition: 'transform 0.3s ease' }} className="group-hover:scale-110">{cat.icon}</span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat.label}</p>
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
            <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1rem' }}>{t('home.trending')}</p>
            <h2 className="text-6xl font-black font-outfit">{t('home.topsellers')}</h2>
          </div>
          <Link to="/products" className="nav-link flex items-center gap-2">{t('home.viewall')} <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topSellers.map((p: any, i: number) => (
            <ProductCard3D key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>

      {/* ══ RECENTLY VIEWED ══ */}
      {recentlyViewed.length > 0 && (
        <section style={{ padding: '4rem 1.5rem 5rem', background: 'var(--bg-surface)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.15), transparent)' }} />
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Clock size={14} style={{ color: 'var(--primary)' }} />
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>{t('home.continuebrowsing')}</p>
              </div>
              <h2 className="text-4xl font-bold font-outfit">{t('home.recentlyviewed')}</h2>
            </div>

            {/* Horizontal scroll container */}
            <div style={{
              display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem',
              scrollBehavior: 'smooth', scrollbarWidth: 'none',
            }}>
              {recentlyViewed.map((p: any, i: number) => (
                <Link to={`/products/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, width: '260px' }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -6 }}
                    style={{
                      cursor: 'pointer', borderRadius: '1rem', overflow: 'hidden',
                      background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.06)',
                      transition: 'border-color 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
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
                      <span style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>${p.price?.toLocaleString()}</span>
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
          </div>
        </section>
      )}

      {/* ══ VALUE PROPS ══ */}
      <section style={{ padding: '6rem 1.5rem', background: 'var(--bg-elevated)', borderTop: '1px solid rgba(var(--primary-rgb), 0.06)', borderBottom: '1px solid rgba(var(--primary-rgb), 0.06)', position: 'relative' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Truck size={24} />, title: 'Pioneer Delivery', desc: 'Complimentary shipping globally' },
              { icon: <Shield size={24} />, title: 'Core Shield', desc: 'Secure encrypted transactions' },
              { icon: <RotateCcw size={24} />, title: 'Circle Returns', desc: 'Hassle-free 30-day window' },
              { icon: <Headphones size={24} />, title: 'Expert Access', desc: '24/7 dedicated support' },
            ].map(p => (
              <motion.div
                key={p.title}
                whileHover={{ y: -4 }}
                className="glass-card"
                style={{ textAlign: 'center', padding: '2rem' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>{p.icon}</div>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{p.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
