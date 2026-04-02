import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/demoData';
import { useProducts } from '../context/ProductContext';
import { ProductCard3D } from '../components/ProductGrid';

export function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const { products } = useProducts();

  const categories = ['all', ...CATEGORIES.map(c => c.id)];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter((p: any) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (sortOrder === 'lowToHigh') result.sort((a: any, b: any) => a.price - b.price);
    else if (sortOrder === 'highToLow') result.sort((a: any, b: any) => b.price - a.price);
    return result;
  }, [sortOrder, selectedCategory, products]);

  return (
    <div style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.04) 0%, transparent 70%)', top: '5%', right: '-10%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>Browse Collection</p>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem', fontFamily: '"Outfit", sans-serif' }}>
          All <span className="gradient-text">Products.</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Filter and find the perfect match.</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '3rem', position: 'relative', zIndex: 1 }}>
        {/* Sidebar Filters */}
        <div style={{ width: '260px', flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '7rem', padding: '2rem', borderRadius: '1.5rem', background: 'var(--bg-card)', border: '1px solid rgba(var(--primary-rgb), 0.08)', backdropFilter: 'blur(40px)' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem' }}>Sort By</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[{ id: 'newest', label: 'Newest First' }, { id: 'lowToHigh', label: 'Price: Low → High' }, { id: 'highToLow', label: 'Price: High → Low' }].map(opt => (
                  <label key={opt.id} onClick={() => setSortOrder(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sortOrder === opt.id ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      {sortOrder === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.4)' }} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: sortOrder === opt.id ? 'var(--foreground)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', height: 1, background: 'rgba(var(--primary-rgb), 0.06)', marginBottom: '2.5rem' }} />

            <div>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem' }}>Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categories.map(cat => (
                  <label key={cat} onClick={() => setSelectedCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedCategory === cat ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      {selectedCategory === cat && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.4)' }} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize', color: selectedCategory === cat ? 'var(--foreground)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                      {cat === 'all' ? 'All Categories' : CATEGORIES.find(c => c.id === cat)?.name || cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          <div className="product-grid">
            {filteredAndSortedProducts.map((product, idx) => (
              <ProductCard3D key={product._id} product={product} index={idx} />
            ))}
          </div>
          {filteredAndSortedProducts.length === 0 && (
            <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.25rem' }}>No products found matching these filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
