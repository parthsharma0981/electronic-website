import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/demoData';
import { useProducts } from '../context/ProductContext';
import { ProductCard3D } from '../components/ProductGrid';
import { ProductSkeleton } from '../components/Skeleton';
import { SlidersHorizontal } from 'lucide-react';

export function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const { products, loading } = useProducts();

  const categories = ['all', ...CATEGORIES.map(c => c.id)];

  // Price range state
  const prices = products.map((p: any) => p.price || 0);
  const globalMin = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const globalMax = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 10000;
  const [priceRange, setPriceRange] = useState<[number, number]>([globalMin, globalMax]);

  // Reset price when products load
  useMemo(() => {
    if (prices.length > 0) {
      setPriceRange([globalMin, globalMax]);
    }
  }, [globalMin, globalMax]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter((p: any) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    // Price filter
    result = result.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortOrder === 'lowToHigh') result.sort((a: any, b: any) => a.price - b.price);
    else if (sortOrder === 'highToLow') result.sort((a: any, b: any) => b.price - a.price);
    return result;
  }, [sortOrder, selectedCategory, products, priceRange]);

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

            {/* Price Range Filter */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={14} /> Price Range
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)' }}>${priceRange[0].toLocaleString()}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)' }}>${priceRange[1].toLocaleString()}</span>
              </div>

              {/* Dual Range Slider */}
              <div style={{ position: 'relative', height: '40px', marginBottom: '0.5rem' }}>
                {/* Track background */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: 0, right: 0, height: 6, borderRadius: 3,
                  background: 'rgba(var(--primary-rgb), 0.08)',
                }} />
                {/* Active track */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: `${((priceRange[0] - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                  right: `${100 - ((priceRange[1] - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                  height: 6, borderRadius: 3,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.3)',
                }} />
                {/* Min slider */}
                <input
                  type="range"
                  min={globalMin}
                  max={globalMax}
                  value={priceRange[0]}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
                  }}
                  className="range-slider"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    appearance: 'none', WebkitAppearance: 'none', background: 'transparent',
                    pointerEvents: 'none', zIndex: 3, margin: 0, padding: 0,
                  }}
                />
                {/* Max slider */}
                <input
                  type="range"
                  min={globalMin}
                  max={globalMax}
                  value={priceRange[1]}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
                  }}
                  className="range-slider"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    appearance: 'none', WebkitAppearance: 'none', background: 'transparent',
                    pointerEvents: 'none', zIndex: 4, margin: 0, padding: 0,
                  }}
                />
              </div>

              {/* Result count */}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{filteredAndSortedProducts.length}</span> products found
              </p>
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
          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, i) => <ProductSkeleton key={`skel-${i}`} />)}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.25rem' }}>No products found matching these filters.</div>
          ) : (
            <div className="product-grid">
              {filteredAndSortedProducts.map((product: any, idx: number) => (
                <ProductCard3D key={product._id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
