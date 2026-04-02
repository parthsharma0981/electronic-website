import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS as DEMO_PRODUCTS } from '../data/demoData';
import { Product } from '../types';
import { ProductSkeleton } from './Skeleton';
import { Heart, ShoppingBag } from 'lucide-react';

const FALLBACK_PRODUCTS = DEMO_PRODUCTS.slice(0, 4);

export function ProductCard3D({ product, index }: { product: Product, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : (product as any).image;
  const wishlisted = isWishlisted(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card relative overflow-hidden group cursor-pointer h-[500px] flex flex-col justify-end p-8"
      onClick={() => navigate(`/products/${product._id}`)}
      style={{ borderColor: isHovered ? 'rgba(var(--primary-rgb), 0.2)' : undefined }}
    >
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={imageUrl} 
          alt={product.name} 
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
        />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `linear-gradient(to top, var(--bg-deep) 0%, rgba(5,5,8,0.4) 40%, transparent 100%)`,
        }} />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{product.category}</p>
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight font-outfit line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            ${product.price ? product.price.toLocaleString() : '0'}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); addToCart(product, 1); }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              fontSize: '0.8rem', fontWeight: 600,
              color: '#fff',
              background: 'rgba(var(--primary-rgb), 0.15)',
              border: '1px solid rgba(var(--primary-rgb), 0.25)',
              borderRadius: '9999px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(var(--primary-rgb), 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ShoppingBag size={14} /> Add
          </motion.button>
        </div>
      </div>

      {/* Wishlist Heart Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleWishlist(product); }}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: wishlisted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          border: wishlisted ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}
        aria-label={wishlisted ? 'Remove from saved' : 'Save product'}
      >
        <Heart
          size={18}
          fill={wishlisted ? '#ef4444' : 'none'}
          color={wishlisted ? '#ef4444' : '#fff'}
          style={{ transition: 'all 0.3s ease' }}
        />
      </motion.button>

      {product.badge && (
        <span
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 20,
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            background: 'var(--gradient-primary)',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)',
          }}
        >
          {product.badge}
        </span>
      )}

      {/* Hover glow effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '40%',
          background: `radial-gradient(ellipse, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 5,
        }} />
      )}
    </motion.div>
  );
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.getAll()
      .then((res: any) => {
        const data = res.data;
        if (data.products) setProducts(data.products.slice(0, 8));
        else if (Array.isArray(data)) setProducts(data.slice(0, 8));
        else setProducts(FALLBACK_PRODUCTS as any);
      })
      .catch((err: any) => {
        console.error("Failed to fetch products:", err);
        setProducts(FALLBACK_PRODUCTS as any);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative z-10 section-padding">
      <div className="container">
        <div className="flex justify-between items-end mb-16 px-4">
          <h2 className="text-5xl font-extrabold text-white font-outfit">Latest <span className="gradient-text">Innovations.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading 
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product, idx) => (
                <ProductCard3D key={product._id || idx} product={product} index={idx} />
              ))
          }
        </div>
      </div>
    </section>
  );
}
