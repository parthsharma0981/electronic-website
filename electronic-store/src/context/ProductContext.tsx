import { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/demoData';

const ProductContext = createContext<any>(null);

const STORAGE_KEY = 'ecore_products';

const loadProducts = (): any[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return INITIAL_PRODUCTS as any[];
};

const saveProducts = (products: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>(loadProducts);

  const addProduct = useCallback((product: any) => {
    const newProduct = {
      ...product,
      _id: 'p_' + Date.now(),
      numReviews: 0,
      rating: 0,
      stock: parseInt(product.stock) || 50,
      price: parseFloat(product.price) || 0,
      originalPrice: parseFloat(product.originalPrice) || parseFloat(product.price) || 0,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [{ url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=600' }],
      specs: product.specs || {},
      createdAt: new Date().toISOString(),
    };
    setProducts((prev: any[]) => {
      const updated = [newProduct, ...prev];
      saveProducts(updated);
      return updated;
    });
    return newProduct;
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev: any[]) => {
      const updated = prev.filter((p: any) => p._id !== productId);
      saveProducts(updated);
      return updated;
    });
  }, []);

  const updateProduct = useCallback((productId: string, data: any) => {
    setProducts((prev: any[]) => {
      const updated = prev.map((p: any) => p._id === productId ? { ...p, ...data } : p);
      saveProducts(updated);
      return updated;
    });
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find((p: any) => p._id === id);
  }, [products]);

  const decreaseStock = useCallback((items: any[]) => {
    setProducts((prev: any[]) => {
      const updated = prev.map((p: any) => {
        const cartItem = items.find((i: any) => i._id === p._id);
        if (cartItem && p.stock !== undefined) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
      saveProducts(updated);
      return updated;
    });
  }, []);

  // Computed stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * (p.stock || 1)), 0);
  const bestSellers = [...products].sort((a: any, b: any) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 5);
  const lowStock = products.filter((p: any) => (p.stock || 0) < 15);
  const categoryBreakdown = products.reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <ProductContext.Provider value={{
      products, addProduct, deleteProduct, updateProduct, getProduct, decreaseStock,
      totalProducts, totalValue, bestSellers, lowStock, categoryBreakdown,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): any => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be inside ProductProvider');
  return ctx;
};
