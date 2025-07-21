import React, { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

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

  useEffect(() => {
    async function fetchOrCreateCart() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found, please login");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const savedCartId = localStorage.getItem("cartId");

        if (savedCartId) {
          const res = await axios.get(
            `https://deliveryback-y8wi.onrender.com/api/cart/${savedCartId}`,
            config
          );
          dispatch({ type: "SET_CART", payload: res.data });
        } else {
          const res = await axios.post(
            "https://deliveryback-y8wi.onrender.com/api/cart",
            { items: [] },
            config
          );
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

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please login");

      const updatedItems = [...state.cartItems, item];
      dispatch({ type: "ADD_ITEM", payload: item });

      if (state.cartId) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.put(
          `https://deliveryback-y8wi.onrender.com/api/cart/${state.cartId}`,
          { items: updatedItems },
          config
        );
      }a
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
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
