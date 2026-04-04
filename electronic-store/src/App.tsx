import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { IntroSequence } from './components/IntroSequence';
import { ChatBot } from './components/ChatBot';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Orders } from './pages/Orders';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { TrackOrder } from './pages/TrackOrder';
import { Account } from './pages/Account';
import { SellProduct } from './pages/SellProduct';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Support } from './pages/Support';
import { SearchResults } from './pages/SearchResults';
import { Compare } from './pages/Compare';
import { ShoppingBag, Search, User, Store, Sun, Moon, GitCompareArrows, X, ArrowRight } from 'lucide-react';
import { useCompare } from './context/CompareContext';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import './index.css';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const navigate = useNavigate();
  const cartItemsCount = cart?.totalItems || 0;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-between navbar glass-nav"
      style={{ bottom: 'auto' }}
    >
      <Link to={isAdmin ? "/admin" : "/"} className="flex items-center no-underline" style={{ gap: '0.75rem' }}>
        <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)' }}>
          <div className="nav-logo-dot" />
        </div>
        <span className="nav-title text-white">E-Core</span>
      </Link>

      <div className="nav-links">
        {isAdmin ? (
          <span className="nav-link" style={{ cursor: 'default', color: '#fff', fontWeight: 700 }}>{t('nav.admin')} Panel</span>
        ) : (
          <div className="flex gap-10">
            <Link to="/" className="nav-link">{t('nav.discover')}</Link>
            <Link to="/products" className="nav-link">{t('nav.products')}</Link>
            <Link to="/sell" className="nav-link">{t('nav.sell')}</Link>
            <Link to="/support" className="nav-link">Support</Link>
          </div>
        )}
      </div>

      <div className="nav-icons text-white flex items-center gap-6">
        <button 
          onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')} 
          className="nav-icon flex items-center justify-center cursor-pointer bg-transparent border-none outline-none text-inherit hover:scale-110 active:scale-95 transition-all text-sm font-black"
          aria-label="Toggle language"
        >
          {locale === 'en' ? 'HI' : 'EN'}
        </button>
        <button 
          onClick={toggleTheme} 
          className="nav-icon flex items-center justify-center cursor-pointer bg-transparent border-none outline-none text-inherit hover:scale-110 active:scale-95 transition-all w-8 h-8 rounded-full"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {!isAdmin && <Search size={20} className="nav-icon" onClick={() => navigate('/search')} />}
        {user ? (
          <div className="flex items-center gap-6">
            {!isAdmin && (
              <>
                <Link to="/orders" className="nav-link text-xs no-underline">{t('nav.orders')}</Link>
                <Link to="/wishlist" className="nav-link text-xs no-underline">{t('nav.saved')}</Link>
                <Link to="/seller" className="nav-link"><Store size={20} /></Link>
                <Link to="/cart" className="relative text-inherit">
                  <ShoppingBag size={20} className="nav-icon" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link to="/account" className="text-inherit"><User size={20} className="nav-icon" /></Link>
              </>
            )}
            <button onClick={() => { logout(); navigate('/'); }} className="btn-premium h-9 px-4 text-[10px] uppercase tracking-widest">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-premium py-2 px-6 flex items-center gap-2 no-underline">
            <User size={16} />
            <span className="text-xs font-bold">{t('nav.signIn')}</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function FloatingCompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareItems.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 1000, display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.75rem 1.25rem', borderRadius: '9999px',
        background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(var(--primary-rgb), 0.2)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(var(--primary-rgb), 0.08)',
      }}
    >
      <GitCompareArrows size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {compareItems.map(p => (
          <div key={p._id} style={{ position: 'relative' }}>
            <img src={p.images?.[0]?.url} alt={p.name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(var(--primary-rgb), 0.3)' }} />
            <button onClick={() => removeFromCompare(p._id)} style={{
              position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
              background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.5rem', fontWeight: 900, lineHeight: 1,
            }}>
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {compareItems.length}/3
      </span>
      <button onClick={() => navigate('/compare')} className="btn-glow"
        style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        Compare <ArrowRight size={14} />
      </button>
      <button onClick={clearCompare}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
        <X size={16} />
      </button>
    </motion.div>
  );
}

function App() {
  const [introDone, setIntroDone] = useState(false);
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-bg-deep text-white selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {!introDone && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] pointer-events-auto bg-black"
          >
            <IntroSequence onComplete={() => setIntroDone(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {introDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          <div className="noise-overlay" />
          <Navbar />

          <main className="flex-1 flex flex-col pt-20">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
                <Route path="/products/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
                <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
                <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
                <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                <Route path="/track/:id" element={<PageWrapper><TrackOrder /></PageWrapper>} />
                <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
                <Route path="/sell" element={<PageWrapper><SellProduct /></PageWrapper>} />
                <Route path="/seller" element={<PageWrapper><SellerDashboard /></PageWrapper>} />
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
                <Route path="/search" element={<PageWrapper><SearchResults /></PageWrapper>} />
                <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
                <Route path="*" element={<PageWrapper><div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted uppercase tracking-widest font-black text-xs">Resource Not Found</div></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </main>

          <FloatingCompareBar />
          <ChatBot />

          <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid rgba(var(--primary-rgb), 0.06)', padding: '6rem 0' }}>
            <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-left w-full mb-16">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white">Collections</h4>
                <div className="flex flex-col gap-4">
                  <Link to="/products" className="nav-link text-xs no-underline">All Artifacts</Link>
                  <Link to="/products?category=computing" className="nav-link text-xs no-underline">Computing</Link>
                  <Link to="/products?category=mobile" className="nav-link text-xs no-underline">Intelligence</Link>
                  <Link to="/products?category=audio" className="nav-link text-xs no-underline">Acoustics</Link>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white">Identity</h4>
                <div className="flex flex-col gap-4">
                  <Link to="/account" className="nav-link text-xs no-underline">Profile</Link>
                  <Link to="/orders" className="nav-link text-xs no-underline">History</Link>
                  <Link to="/wishlist" className="nav-link text-xs no-underline">Vault</Link>
                  <Link to="/cart" className="nav-link text-xs no-underline">Bag</Link>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white">Ecosystem</h4>
                <div className="flex flex-col gap-4">
                  <Link to="/sell" className="nav-link text-xs no-underline">Vending</Link>
                  <Link to="/seller" className="nav-link text-xs no-underline">Analytics</Link>
                  <Link to="/admin" className="nav-link text-xs no-underline">Control</Link>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white">Support</h4>
                <div className="flex flex-col gap-4">
                  <Link to="/support" className="nav-link text-xs no-underline">Concierge</Link>
                  <span className="nav-link text-xs no-underline cursor-pointer">Privacy Core</span>
                  <span className="nav-link text-xs no-underline cursor-pointer">Agreement</span>
                </div>
              </div>
            </div>
            
            <div className="container flex flex-col md:flex-row justify-between items-center gap-8 pt-12 text-[9px] font-bold tracking-[0.3em] uppercase text-text-muted" style={{ borderTop: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
              <p>© {new Date().getFullYear()} E-Core Global. Beyond Standards.</p>
              <div className="flex gap-8">
                <span className="hover:text-white cursor-pointer transition-colors">Digital Privacy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Legal Framework</span>
                <span className="hover:text-white cursor-pointer transition-colors">Node Status</span>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

export default App;
