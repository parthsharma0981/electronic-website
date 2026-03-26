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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 4rem', background: '#0a0a0f' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>E-Core</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome!</h1>
          <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Log in to E-Core to continue shopping.</p>

          <form onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Email or Username</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email or username"
                autoComplete="username"
                style={{
                  width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db' }}>Password</label>
                <span style={{ fontSize: '0.75rem', color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
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
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit"
              style={{
                width: '100%', padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                fontWeight: 700, fontSize: '1rem', marginTop: '1.5rem',
                transition: 'opacity 0.3s', opacity: email && password ? 1 : 0.5,
              }}>
              Log in
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            Don't have an account? <Link to="/register" style={{ color: '#a78bfa', textDecoration: 'underline', fontWeight: 600 }}>Sign up</Link>
          </p>

          {/* Admin hint */}
          <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>🔒 Admin Access</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Username: <strong style={{ color: '#d1d5db' }}>parth</strong> · Password: <strong style={{ color: '#d1d5db' }}>parth123</strong></p>
          </div>
        </motion.div>
      </div>

      {/* Right — Hero / Promo */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1030 50%, #0f0f1a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: '20%', right: '10%' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ textAlign: 'center', zIndex: 1, padding: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #a78bfa, #6366f1, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            12K+ users. 500+<br />premium electronics.
          </h2>

          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.1)',
            color: '#a78bfa', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
            transition: 'all 0.3s',
          }}>
            Join Now
          </Link>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', justifyContent: 'center' }}>
            {[{ icon: <Users size={18} />, n: '12,540', l: 'Users' }, { icon: <ShieldCheck size={18} />, n: '4.9★', l: 'Rating' }, { icon: <Zap size={18} />, n: '500+', l: 'Products' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#6366f1', marginBottom: '0.35rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.1rem' }}>{s.n}</p>
                <p style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.l}</p>
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
