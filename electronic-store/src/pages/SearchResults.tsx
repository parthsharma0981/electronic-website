import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, ArrowRight, Star, Heart } from 'lucide-react';
import { Product } from '../types';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p: Product) => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  return (
    <div className="container section-padding min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Search Header */}
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-muted mb-4">Discovery Engine</p>
          <h2 className="text-6xl font-black font-outfit mb-8">Search Results.</h2>
          
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              autoFocus
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-lg font-medium text-white"
              placeholder="What are you looking for?" 
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-sm text-text-secondary">
            Showing <span className="text-white font-bold">{results.length}</span> results 
            {query && <> for "<span className="text-primary font-bold">{query}</span>"</>}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {results.map((p: Product, i: number) => (
              <motion.div
                layout
                key={p._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/products/${p._id}`} className="no-underline group">
                  <div className="glass-card overflow-hidden h-full flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <motion.img 
                        src={p.images[0].url} 
                        alt={p.name} 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-deep to-transparent opacity-60" />
                      
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: isWishlisted(p._id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(12px)',
                            border: isWishlisted(p._id) ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            zIndex: 10,
                          }}
                          aria-label={isWishlisted(p._id) ? 'Remove from saved' : 'Save product'}
                        >
                          <Heart
                            size={14}
                            fill={isWishlisted(p._id) ? '#ef4444' : 'none'}
                            color={isWishlisted(p._id) ? '#ef4444' : '#fff'}
                          />
                        </motion.button>
                        <div className="flex items-center gap-1 bg-glass-bg backdrop-blur-md px-2 py-1 rounded-lg border border-glass-border">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-white">{p.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-1">{p.category}</p>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-white">${p.price}</span>
                          {p.originalPrice && (
                            <span className="text-sm text-text-muted line-through ml-2">${p.originalPrice}</span>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowRight size={18} className="text-white group-hover:text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card bg-white/[0.02]"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-text-muted" />
            </div>
            <h3 className="text-3xl font-bold mb-2">No matches found</h3>
            <p className="text-text-muted max-w-md mx-auto">
              We couldn't find any products matching your search. Try different keywords or browse our categories.
            </p>
            <Link to="/products" className="btn-premium mt-8">Browse All Products</Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
