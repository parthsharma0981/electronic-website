import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Load cart from user profile on mount/login
  useEffect(() => {
    if (user && user.cart) {
      const items = user.cart
        .filter((item: any) => item.product) // Safely ignore gracefully deleted products
        .map((item: any) => ({
          ...item.product,
          quantity: item.quantity
        }));
      setCartItems(items);
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Sync cart to backend on change (debounced or on every change)
  // For simplicity here, we'll call it in each action
  const syncCart = async (items: any[]) => {
    if (!user) return;
    try {
      const backendCart = items.map(i => ({ product: i._id, quantity: i.quantity }));
      await authService.updateCart(backendCart);
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const addToCart = useCallback((product: any, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return false;
    }

    const existing = cartItems.find((i) => i._id === product._id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + quantity > (product.stock || 0)) {
      toast.error(`Only ${product.stock || 0} items available in stock`);
      return false;
    }

    const updated = existing
      ? cartItems.map((i) => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i)
      : [...cartItems, { ...product, quantity }];
    
    setCartItems(updated);
    syncCart(updated);
    toast.success(`${product.name} added to cart`);
    return true;
  }, [user, cartItems]);

  const removeFromCart = useCallback((id: string) => {
    const updated = cartItems.filter((i) => i._id !== id);
    setCartItems(updated);
    syncCart(updated);
  }, [user, cartItems]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);

    const item = cartItems.find((i: any) => i._id === id);
    if (!item) return;

    if (quantity > (item.stock || 0)) {
      toast.error(`Only ${item.stock || 0} items available in stock`);
      return;
    }

    const updated = cartItems.map((i) => i._id === id ? { ...i, quantity } : i);
    setCartItems(updated);
    syncCart(updated);
  }, [user, removeFromCart, cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    syncCart([]);
  }, [user]);

  const totalPrice = cartItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum: number, i: any) => sum + i.quantity, 0);

  const cart = {
    items: cartItems.map((item: any) => ({ product: item, quantity: item.quantity })),
    totalPrice,
    totalItems,
  };

  return (
    <CartContext.Provider value={{
      cartItems, cart, addToCart, removeFromCart,
      updateQuantity, clearCart, totalPrice, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): any => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
