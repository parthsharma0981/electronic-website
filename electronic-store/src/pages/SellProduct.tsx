import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/demoData';
import { useProducts } from '../context/ProductContext';
import { Upload, DollarSign, Package, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const glass = { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(40px)', borderRadius: '1.5rem', padding: '2rem' };

export function SellProduct() {
  const { addProduct } = useProducts();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Computing', stock: '', images: [] as string[] });

  const handleSubmit = async () => { 
    try {
      await addProduct({
        ...form,
        images: form.images.length > 0 ? form.images.map(url => ({ url })) : undefined,
        imageUrl: form.images.length > 0 ? form.images[0] : undefined,
      });
      toast.success('Product listed successfully! 🎉'); 
      setStep(1); 
      setForm({ name: '', description: '', price: '', category: 'Computing', stock: '', images: [] }); 
    } catch (err) {
      toast.error('Failed to list product');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Become a Seller</p>
        <h1 className="text-white" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>List Your Product</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Reach thousands of customers on E-Core.</p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? 'var(--primary)' : 'var(--glass-border)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {step === 1 && (
            <div style={glass}>
              <h2 className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={20} /> Product Details</h2>
              {[{ label: 'Product Name', field: 'name', placeholder: 'e.g. ProBook Ultra 16"' }, { label: 'Description', field: 'description', placeholder: 'Describe your product...', textarea: true }].map(f => (
                <div key={f.field} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{f.label}</label>
                  {f.textarea ? (
                    <textarea value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} rows={4}
                      style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', fontSize: '1rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      placeholder={f.placeholder} />
                  ) : (
                    <input value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })}
                      style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                      placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <button onClick={() => setStep(2)} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: 'var(--foreground)', color: 'var(--background)', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Next: Pricing <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={glass}>
              <h2 className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DollarSign size={20} /> Pricing & Category</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Price ($)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} placeholder="999" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--glass-border)', color: 'var(--foreground)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} placeholder="50" />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {CATEGORIES.map(c => (
                    <div key={c.id} onClick={() => setForm({ ...form, category: c.name })}
                      style={{ padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, background: form.category === c.name ? 'var(--primary-glow)' : 'var(--glass-bg)', border: `1px solid ${form.category === c.name ? 'var(--primary)' : 'var(--glass-border)'}`, color: form.category === c.name ? 'var(--primary)' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                      {c.icon} {c.name}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: 'var(--foreground)', color: 'var(--background)', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Next: Images <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div style={glass}>
              <h2 className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={20} /> Upload Images</h2>
              <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <Upload size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <p className="text-white" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Drag & drop images here</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>or click to browse (PNG, JPG up to 10MB)</p>
              </div>
              <div style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 className="text-white" style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Preview</h3>
                <p className="text-white" style={{ margin: 0 }}><strong>{form.name || 'Product Name'}</strong> · ${form.price || '0'} · {form.category} · {form.stock || '0'} in stock</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>{form.description || 'No description'}</p>
              </div>
              <button onClick={handleSubmit} style={{ width: '100%', padding: '1.25rem', borderRadius: '0.75rem', background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}>
                🚀 List Product
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
