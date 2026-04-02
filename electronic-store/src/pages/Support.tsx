import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../data/demoData';
import { ChevronDown, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem',
    background: 'rgba(var(--primary-rgb), 0.03)',
    border: '1px solid rgba(var(--primary-rgb), 0.1)',
    color: 'var(--foreground)', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box' as const, transition: 'border-color 0.3s, box-shadow 0.3s',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '10%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Help Center</p>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: '"Outfit", sans-serif' }}>
            How can we <span className="gradient-text">help?</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Find answers or reach out to our team.</p>
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { icon: <MessageCircle size={24} />, label: 'Live Chat', desc: 'Available 24/7', color: '#34d399' },
            { icon: <Mail size={24} />, label: 'Email Us', desc: 'support@ecore.com', color: 'var(--primary)' },
            { icon: <Phone size={24} />, label: 'Call Us', desc: '+1 (800) 123-4567', color: 'var(--accent)' },
          ].map(c => (
            <motion.div key={c.label} whileHover={{ y: -4 }} style={{
              background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)',
              backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem',
              textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.2)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ color: c.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--foreground)' }}>{c.label}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          {FAQ_DATA.map((faq, i) => (
            <div key={i} style={{
              marginBottom: '0.5rem', borderRadius: '1rem', overflow: 'hidden',
              background: openFaq === i ? 'rgba(var(--primary-rgb), 0.04)' : 'var(--bg-card)',
              border: `1px solid ${openFaq === i ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(var(--primary-rgb), 0.06)'}`,
              transition: 'all 0.3s',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', textAlign: 'left' }}>
                {faq.q}
                <ChevronDown size={18} style={{ transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: '1rem', color: openFaq === i ? 'var(--primary)' : 'var(--text-muted)' }} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.1)',
          backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: '"Outfit", sans-serif', color: 'var(--foreground)' }}>
            Send us a <span className="gradient-text">Message</span>
          </h2>
          {['name', 'email'].map(field => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'capitalize', letterSpacing: '0.05em' }}>{field}</label>
              <input value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={inputStyle}
                placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                onFocus={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.4)'; e.target.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.06)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="How can we help?"
              onFocus={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.4)'; e.target.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.06)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(var(--primary-rgb), 0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button onClick={() => { toast.success('Message sent! We\'ll respond within 24 hours.'); setForm({ name: '', email: '', message: '' }); }}
            className="btn-glow"
            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Send size={16} /> Send Message
          </button>
        </div>
      </motion.div>
    </div>
  );
}
