import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart once on mount
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = decodeToken(token);
      if (!decoded?.id) return;

      try {
        const { data } = await axios.get(`http://localhost:5000/api/cart/${decoded.id}`);
        if (Array.isArray(data.items)) setCartItems(data.items);
      } catch (e) {
        console.error('Fetch cart failed:', e);
      }
    })();
  }, []);

  // Sync cart on changes (skip if empty to avoid overwriting)
  useEffect(() => {
    if (cartItems.length === 0) return;
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = decodeToken(token);
      if (!decoded?.id) return;

      try {
        await axios.post('http://localhost:5000/api/cart', {
          userId: decoded.id,
          items: cartItems,
        });
      } catch (e) {
        console.error('Sync cart failed:', e);
      }
    })();
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find(i => i.productId === item.productId);
      if (exists) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const incrementItem = (productId) => setCartItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));

  const decrementItem = (productId) =>
    setCartItems(prev =>
      prev
        .map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );

  const removeFromCart = (productId) => setCartItems(prev => prev.filter(i => i.productId !== productId));

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, incrementItem, decrementItem, removeFromCart, clearCart, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}
