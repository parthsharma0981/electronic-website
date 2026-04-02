import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Edit3, Save, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export function Account() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: typeof user?.address === 'string' ? user.address : 
             (user?.address ? [user.address.street, user.address.city, user.address.state, user.address.pincode].filter(Boolean).join(', ') : '')
  });

  const handleSave = async () => {
    try {
      await updateUser?.(form);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%)', top: '15%', right: '-5%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Your Profile</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2.5rem', fontFamily: '"Outfit", sans-serif' }}>
          My <span className="gradient-text">Account</span>
        </h1>

        {/* Avatar */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
          backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-primary)' }} />
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff', boxShadow: '0 4px 20px rgba(var(--primary-rgb), 0.3)', flexShrink: 0 }}>
            {(form.name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>{form.name}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{user?.role === 'admin' ? '🛡️ Administrator' : user?.role === 'seller' ? '🏪 Seller' : '👤 Buyer'}</p>
          </div>
          <button onClick={() => editing ? handleSave() : setEditing(true)} style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
            background: editing ? 'rgba(34,197,94,0.1)' : 'rgba(var(--primary-rgb), 0.06)',
            border: `1px solid ${editing ? 'rgba(34,197,94,0.25)' : 'rgba(var(--primary-rgb), 0.15)'}`,
            color: editing ? '#34d399' : 'var(--primary)',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s',
          }}>
            {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>

        {/* Info Fields */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
          backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem',
        }}>
          {[
            { icon: <User size={18} />, label: 'Full Name', field: 'name' },
            { icon: <Mail size={18} />, label: 'Email', field: 'email' },
            { icon: <Phone size={18} />, label: 'Phone', field: 'phone' },
            { icon: <MapPin size={18} />, label: 'Address', field: 'address' },
          ].map(f => (
            <div key={f.field} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(var(--primary-rgb), 0.06)' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{f.label}</p>
                {editing ? (
                  <input value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(var(--primary-rgb), 0.03)',
                      border: '1px solid rgba(var(--primary-rgb), 0.1)', borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem', color: 'var(--foreground)', fontSize: '1rem',
                      outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'}
                  />
                ) : (
                  <p style={{ fontWeight: 500, margin: 0, color: 'var(--foreground)' }}>{(form as any)[f.field] || '—'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
