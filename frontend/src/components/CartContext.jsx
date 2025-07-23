import React, { createContext, useContext, useEffect, useReducer } from "react";

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  loading: false,
  error: null,
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cartItems.find(
        (item) => item.title === action.payload.title
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.title === action.payload.title
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }

    case "INCREMENT_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.title === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREMENT_ITEM":
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.title === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0), // Remove if quantity hits 0
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.title !== action.payload),
      };

    case "CLEAR_CART":    // <-- Added this
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
}

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage on every cart change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Functions to call
  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const incrementItem = (title) => {
    dispatch({ type: "INCREMENT_ITEM", payload: title });
  };

  const decrementItem = (title) => {
    dispatch({ type: "DECREMENT_ITEM", payload: title });
  };

  const removeFromCart = (title) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: title });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        incrementItem,
        decrementItem,
        removeFromCart,
        clearCart,   // <-- Expose clearCart here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => useContext(CartContext);
