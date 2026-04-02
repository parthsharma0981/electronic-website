import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { productService } from '../services/productService.js';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from API on mount
  useEffect(() => {
    setLoading(true);
    productService.getAll()
      .then((res: any) => {
        const data = res.data;
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error('API Error fetching products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const addProduct = useCallback(async (product: any) => {
    try {
      const { data } = await productService.create(product);
      setProducts((prev: any[]) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to add product:', err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await productService.delete(productId);
      setProducts((prev: any[]) => prev.filter((p: any) => p._id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, data: any) => {
    try {
      await productService.update(productId, data);
      setProducts((prev: any[]) => prev.map((p: any) => p._id === productId ? { ...p, ...data } : p));
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find((p: any) => p._id === id);
  }, [products]);

  const decreaseStock = useCallback((items: any[]) => {
    setProducts((prev: any[]) => {
      return prev.map((p: any) => {
        const cartItem = items.find((i: any) => (i._id || i.product) === p._id);
        if (cartItem && p.stock !== undefined) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
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
      products, loading, addProduct, deleteProduct, updateProduct, getProduct, decreaseStock,
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
