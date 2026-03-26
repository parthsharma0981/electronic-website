import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext<any>(null);

const wishlistKey = (userId: string) => userId ? `miskara_wishlist_${userId}` : null;

const loadWishlist = (userId: string): any[] => {
  const key = wishlistKey(userId);
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]') || []; }
  catch { return []; }
};

const saveWishlist = (userId: string, items: any[]) => {
  const key = wishlistKey(userId);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(items));
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    setWishlist(loadWishlist(user?._id));
  }, [user?._id]);

  const toggleWishlist = useCallback((product: any) => {
    if (!user) {
      toast.error('Please sign in to save favourites');
      return;
    }
    setWishlist((prev: any[]) => {
      const exists = prev.find((p: any) => p._id === product._id);
      const updated = exists
        ? prev.filter((p: any) => p._id !== product._id)
        : [...prev, product];
      saveWishlist(user._id, updated);
      toast(exists ? 'Removed from Favourites' : 'Added to Favourites ♥', {
        icon: exists ? '🤍' : '❤️',
      });
      return updated;
    });
  }, [user]);

  const isWishlisted = useCallback((id: string) => {
    return wishlist.some((p: any) => p._id === id);
  }, [wishlist]);

  const totalWishlist = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, totalWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): any => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
};
