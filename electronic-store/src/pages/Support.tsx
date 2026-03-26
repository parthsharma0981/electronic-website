import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../data/demoData';
import { ChevronDown, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const glass = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem' };

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.75rem' }}>How can we help?</h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Find answers or reach out to our team.</p>
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { icon: <MessageCircle size={24} />, label: 'Live Chat', desc: 'Available 24/7', color: '#22c55e' },
            { icon: <Mail size={24} />, label: 'Email Us', desc: 'support@ecore.com', color: '#60a5fa' },
            { icon: <Phone size={24} />, label: 'Call Us', desc: '+1 (800) 123-4567', color: '#a78bfa' },
          ].map(c => (
            <motion.div key={c.label} whileHover={{ y: -4 }} style={{ ...glass, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ color: c.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{c.label}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
          {FAQ_DATA.map((faq, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', borderRadius: '1rem', overflow: 'hidden', background: openFaq === i ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', textAlign: 'left' }}>
                {faq.q}
                <ChevronDown size={18} style={{ transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: '1rem', color: '#6b7280' }} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p style={{ padding: '0 1.5rem 1.25rem', color: '#9ca3af', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={glass}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send us a Message</h2>
          {['name', 'email'].map(field => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{field}</label>
              <input value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                placeholder={field === 'email' ? 'you@example.com' : 'Your name'} />
            </div>
          ))}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af', marginBottom: '0.5rem' }}>Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              placeholder="How can we help?" />
          </div>
          <button onClick={() => { toast.success('Message sent! We\'ll respond within 24 hours.'); setForm({ name: '', email: '', message: '' }); }}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#fff', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Send size={16} /> Send Message
          </button>
        </div>
      </motion.div>
    </div>
  );
}
