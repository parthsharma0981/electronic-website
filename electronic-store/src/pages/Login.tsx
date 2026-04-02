import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShieldCheck, Zap, Users } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await login({ email, password });
      if (loggedInUser?.role === 'admin') {
        toast.success('Welcome, Admin!');
        navigate('/admin');
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left — Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 4rem', background: 'var(--bg-deep)' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)' }}>
              <Zap size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>E-Core</span>
          </div>

          <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Log in to E-Core to continue shopping.</p>

          <form onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email or Username</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email or username"
                autoComplete="username"
                style={{
                  width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem',
                  background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
                  color: 'var(--foreground)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.4)'; e.target.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.06)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>Password</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '0.9rem 3rem 0.9rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
                    color: 'var(--foreground)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.4)'; e.target.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-glow"
              style={{
                width: '100%', padding: '1rem', borderRadius: '0.75rem',
                marginTop: '1.5rem', fontSize: '1rem',
                opacity: email && password ? 1 : 0.5,
                transition: 'opacity 0.3s',
              }}>
              Log in
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Sign up</Link>
          </p>

          {/* Admin hint */}
          <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(var(--primary-rgb), 0.04)', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>🔒 Admin Access</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Username: <strong style={{ color: 'var(--primary)' }}>parth</strong> · Password: <strong style={{ color: 'var(--primary)' }}>parth123</strong></p>
          </div>
        </motion.div>
      </div>

      {/* Right — Hero / Promo */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-deep) 0%, #12102a 50%, var(--bg-deep) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%)', top: '20%', right: '10%' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ textAlign: 'center', zIndex: 1, padding: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem',
            background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            12K+ users. 500+<br />premium electronics.
          </h2>

          <Link to="/register" className="btn-premium" style={{
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            textDecoration: 'none', fontSize: '0.85rem',
          }}>
            Join Now
          </Link>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', justifyContent: 'center' }}>
            {[{ icon: <Users size={18} />, n: '12,540', l: 'Users' }, { icon: <ShieldCheck size={18} />, n: '4.9★', l: 'Rating' }, { icon: <Zap size={18} />, n: '500+', l: 'Products' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <p className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.1rem' }}>{s.n}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* 3D floating cube decoration */}
          <motion.div animate={{ rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ width: 120, height: 120, margin: '3rem auto 0', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem', opacity: 0.3 }}>⚡</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
