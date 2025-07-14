import React from 'react';
import { useCart } from '../components/CartContext.jsx';
import './Second.css';
import { Link } from 'react-router-dom';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    incrementItem,
    decrementItem,
  } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container-outer">
        <div className="ptpb"></div>
        
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <div className="cart-card" key={index}>
                <img src={item.image} alt={item.title} className="cart-img" />
                <div className="cart-details">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => decrementItem(item.title)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => incrementItem(item.title)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-subtotal">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.title)}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            <Link to="/Payment">
            <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
            <button className="clear-btn" onClick={clearCart}>
              ❌ Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
