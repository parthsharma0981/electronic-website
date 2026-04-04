import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Product } from '../types';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = useCallback((product: Product) => {
    setCompareItems(prev => {
      if (prev.find(p => p._id === product._id)) {
        toast.error('Already in comparison');
        return prev;
      }
      if (prev.length >= 3) {
        toast.error('You can compare up to 3 products');
        return prev;
      }
      toast.success(`${product.name} added to compare`);
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareItems(prev => prev.filter(p => p._id !== id));
  }, []);

  const isInCompare = useCallback((id: string) => {
    return compareItems.some(p => p._id === id);
  }, [compareItems]);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be inside CompareProvider');
  return ctx;
};
