import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

const initialState = {
  cartItems: [],
  loading: true,
  error: null,
  cartId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cartItems: action.payload.items,
        cartId: action.payload._id,
        loading: false,
        error: null,
      };
    case "ADD_ITEM":
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load cart from backend or create new one
  useEffect(() => {
    async function fetchOrCreateCart() {
      try {
        const savedCartId = localStorage.getItem("cartId");
        if (savedCartId) {
          // Try to get existing cart
          const res = await axios.get(`https://deliveryback-y8wi.onrender.com/api/cart/${savedCartId}`);
          dispatch({ type: "SET_CART", payload: res.data });
        } else {
          // Create new cart
          const res = await axios.post("https://deliveryback-y8wi.onrender.com/api/cart", { items: [] });
          localStorage.setItem("cartId", res.data._id);
          dispatch({ type: "SET_CART", payload: res.data });
        }
      } catch (error) {
        console.error("Error fetching or creating cart:", error);
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
    }
    fetchOrCreateCart();
  }, []);

  // Add item to cart locally and sync with backend
  const addItem = async (item) => {
    try {
      const updatedItems = [...state.cartItems, item];
      dispatch({ type: "ADD_ITEM", payload: item });

      // Sync with backend
      if (state.cartId) {
        await axios.put(`https://deliveryback-y8wi.onrender.com/api/cart/${state.cartId}`, {
          items: updatedItems,
        });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        loading: state.loading,
        error: state.error,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
