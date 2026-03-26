import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem' };

export function Account() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || 'Alex Johnson', email: user?.email || 'alex@ecore.com', phone: '555-0123', address: '123 Tech Avenue, Silicon Valley, CA 94025' });

  const handleSave = () => { updateUser?.(form); setEditing(false); toast.success('Profile updated!'); };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2.5rem' }}>My Account</h1>

        {/* Avatar */}
        <div style={{ ...glass, display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
            {(form.name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{form.name}</h2>
            <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>{user?.role === 'admin' ? '🛡️ Administrator' : user?.role === 'seller' ? '🏪 Seller' : '👤 Buyer'}</p>
          </div>
          <button onClick={() => editing ? handleSave() : setEditing(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', background: editing ? '#22c55e' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>

        {/* Info Fields */}
        <div style={glass}>
          {[{ icon: <User size={18} />, label: 'Full Name', field: 'name' }, { icon: <Mail size={18} />, label: 'Email', field: 'email' }, { icon: <MapPin size={18} />, label: 'Address', field: 'address' }].map(f => (
            <div key={f.field} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#60a5fa' }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{f.label}</p>
                {editing ? (
                  <input value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                ) : (
                  <p style={{ fontWeight: 500, margin: 0 }}>{(form as any)[f.field]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
