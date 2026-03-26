import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext';
import { PRODUCTS as DEMO_PRODUCTS } from '../data/demoData';
import { Product } from '../types';
import { ProductSkeleton } from './Skeleton';

const FALLBACK_PRODUCTS = DEMO_PRODUCTS.slice(0, 4);

export function ProductCard3D({ product, index }: { product: Product, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : (product as any).image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card relative overflow-hidden group cursor-pointer h-[500px] flex flex-col justify-end p-8"
      onClick={() => window.location.href = `/products/${product._id}`}
    >
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={imageUrl} 
          alt={product.name} 
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <p className="product-category mb-2">{product.category}</p>
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight font-outfit">{product.name}</h3>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-medium text-white/90">
            ${product.price ? product.price.toLocaleString() : '0'}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); addToCart(product, 1); }}
            className="btn-premium py-2 px-6 text-sm"
          >
            Quick Add
          </motion.button>
        </div>
      </div>

      {product.badge && (
        <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-widest uppercase text-white z-20">
          {product.badge}
        </span>
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
          <h2 className="text-5xl font-extrabold text-white font-outfit">Latest Innovations.</h2>
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
