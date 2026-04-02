import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, ShieldCheck, Users } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password, phone, street, city, state, pincode });
      toast.success('Registration OTP sent to email!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
    }
  };

  const inputStyle = { width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.1)', color: 'var(--foreground)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.3s, box-shadow 0.3s' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left — Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem 4rem', background: 'var(--bg-deep)', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: '420px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)' }}>
              <Zap size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>E-Core</span>
          </div>

          <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Essential shipping details required.</p>

          <form onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" autoComplete="name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" required pattern="[6-9][0-9]{9}" title="Valid 10-digit phone number starting with 6-9" 
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210" autoComplete="tel" style={inputStyle} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" style={inputStyle} />
            </div>

            {/* Address */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Street Address</label>
              <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Galaxy Apartment" autoComplete="street-address" style={inputStyle} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai" style={{ ...inputStyle, padding: '0.9rem 0.5rem' }} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" required value={state} onChange={(e) => setState(e.target.value)}
                  placeholder="MH" style={{ ...inputStyle, padding: '0.9rem 0.5rem' }} />
              </div>
              <div>
                <label style={labelStyle}>Pincode</label>
                <input type="text" required pattern="\d{6}" title="Valid 6-digit Pincode" 
                  value={pincode} onChange={(e) => setPincode(e.target.value)}
                  placeholder="400001" style={{ ...inputStyle, padding: '0.9rem 0.5rem' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 chars)" minLength={6} autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="btn-glow hover:opacity-90 active:scale-[0.98]"
              style={{
                width: '100%', padding: '1rem', borderRadius: '0.75rem',
                marginTop: '1.5rem', fontSize: '1rem',
                opacity: name && email && password && phone && street && city && state && pincode ? 1 : 0.5,
                transition: 'all 0.3s',
              }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right — Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-deep) 0%, #12102a 50%, var(--bg-deep) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%)', top: '20%', right: '10%' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ textAlign: 'center', zIndex: 1, padding: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem',
            background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            Join 12K+ users.<br />Premium electronics<br />await you.
          </h2>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', justifyContent: 'center' }}>
            {[{ icon: <Users size={18} />, n: '12,540', l: 'Users' }, { icon: <ShieldCheck size={18} />, n: '4.9★', l: 'Rating' }, { icon: <Zap size={18} />, n: '500+', l: 'Products' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '0.35rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <p className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.1rem' }}>{s.n}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.l}</p>
              </div>
            ))}
          </div>

          <motion.div animate={{ rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ width: 120, height: 120, margin: '3rem auto 0', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem', opacity: 0.3 }}>⚡</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
