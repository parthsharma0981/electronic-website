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
    <div style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>All Products.</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Filter and find the perfect match.</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '3rem' }}>
        {/* Sidebar Filters */}
        <div style={{ width: '260px', flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '8rem', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1.5rem' }}>Sort By</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[{ id: 'newest', label: 'Newest First' }, { id: 'lowToHigh', label: 'Price: Low → High' }, { id: 'highToLow', label: 'Price: High → Low' }].map(opt => (
                  <label key={opt.id} onClick={() => setSortOrder(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sortOrder === opt.id ? '#fff' : '#4b5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      {sortOrder === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: sortOrder === opt.id ? '#fff' : '#9ca3af', transition: 'color 0.3s' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '2.5rem' }} />

            <div>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1.5rem' }}>Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categories.map(cat => (
                  <label key={cat} onClick={() => setSelectedCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedCategory === cat ? '#fff' : '#4b5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      {selectedCategory === cat && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize', color: selectedCategory === cat ? '#fff' : '#9ca3af', transition: 'color 0.3s' }}>
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
            <div style={{ padding: '6rem 0', textAlign: 'center', color: '#6b7280', fontSize: '1.25rem' }}>No products found matching these filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
