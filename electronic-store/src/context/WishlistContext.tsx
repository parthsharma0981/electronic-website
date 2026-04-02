import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Since AuthContext now fetches the full profile from the backend on load,
  // we can reliably use `user.wishlist` as the source of truth for initialization.
  useEffect(() => {
    if (user?.wishlist && Array.isArray(user.wishlist)) {
      // Filter out non-populated ObjectIds (just in case)
      const populated = user.wishlist.filter(
        (p: any) => p && typeof p === 'object' && p._id
      );
      setWishlist(populated);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const syncWishlist = async (items: any[]) => {
    if (!user) return;
    try {
      const ids = items.map(p => p._id);
      const { data } = await authService.updateWishlist(ids);
      // Backend returns populated wishlist, use it
      if (Array.isArray(data) && data.length > 0 && data[0]._id) {
        setWishlist(data);
      }
    } catch (err) {
      console.error('Failed to sync wishlist to backend:', err);
    }
  };

  const toggleWishlist = useCallback((product: any) => {
    if (!user) {
      toast.error('Please sign in to save favourites');
      return;
    }
    const exists = wishlist.find((p: any) => p._id === product._id);
    const updated = exists
      ? wishlist.filter((p: any) => p._id !== product._id)
      : [...wishlist, product];
    
    setWishlist(updated);
    syncWishlist(updated);
    
    toast(exists ? 'Removed from Favourites' : 'Added to Favourites ♥', {
      icon: exists ? '🤍' : '❤️',
    });
  }, [user, wishlist]);

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
