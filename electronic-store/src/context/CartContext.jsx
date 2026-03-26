import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const cartKey = (userId) => userId ? `ecore_cart_${userId}` : null;

const loadCart = (userId) => {
  const key = cartKey(userId);
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
};

const saveCartToStorage = (userId, items) => {
  const key = cartKey(userId);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(loadCart(user?._id));
  }, [user?._id]);

  const addToCart = useCallback((product, quantity = 1) => {
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

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === product._id);
      const updated = existingItem
        ? prev.map((i) => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...product, quantity }];
      saveCartToStorage(user._id, updated);
      return updated;
    });
    toast.success(`${product.name} added to cart`);
    return true;
  }, [user, cartItems]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      saveCartToStorage(user?._id, updated);
      return updated;
    });
  }, [user]);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    
    // Find the product to check stock
    const item = cartItems.find(i => i._id === id);
    if (!item) return;

    if (quantity > (item.stock || 0)) {
      toast.error(`Only ${item.stock || 0} items available in stock`);
      return;
    }

    setCartItems((prev) => {
      const updated = prev.map((i) => i._id === id ? { ...i, quantity } : i);
      saveCartToStorage(user?._id, updated);
      return updated;
    });
  }, [user, removeFromCart, cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCartToStorage(user?._id, []);
  }, [user]);

  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Expose both flat format AND nested format for backward compat
  const cart = {
    items: cartItems.map(item => ({ product: item, quantity: item.quantity })),
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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
