import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext.jsx';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function Header() {
  const token = localStorage.getItem('token');
  const {
    cartItems,
    cartCount,
    incrementItem,
    decrementItem,
    removeFromCart,
  } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);

  const userData = token ? parseJwt(token) : null;
  const userId = userData?._id || null;
  const role = userData?.role || null;

  useEffect(() => {
    if (!userId || role === 'delivery') {
      setHasOrders(false);
      return;
    }

    async function checkOrders() {
      try {
        const res = await fetch(`https://deliveryback-y8wi.onrender.com/api/orders?userId=${userId}`);
        if (!res.ok) {
          setHasOrders(false);
          return;
        }
        const data = await res.json();
        setHasOrders(Array.isArray(data) && data.length > 0);
      } catch (e) {
        setHasOrders(false);
      }
    }

    checkOrders();
  }, [userId, role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="header">
      <div className="container-1250">
        <div className="headerFlex">
          <Link to={'/'} className="link">
            <h1 className="headerTitle">Delivery🌍</h1>
          </Link>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>

          <div className={`nav-buttons ${menuOpen ? 'open' : ''}`}>
            <div
              className="cart-container"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="login">
                🛒 Cart ({cartCount})
              </button>
              {showDropdown && (
                <div className="cart-dropdown">
                  {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                  ) : (
                    <>
                      <ul className="cart-list">
                        {cartItems.map((item, index) => (
                          <li key={index} className="cart-item">
                            <span>{item.title}</span>
                            <div className="cart-controls">
                              <button onClick={() => decrementItem(item.title)} className="qty-btn-sm">−</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => incrementItem(item.title)} className="qty-btn-sm">+</button>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.title)} className="remove-small">×</button>
                          </li>
                        ))}
                      </ul>
                      <div className="cart-total">Total: ${total.toFixed(2)}</div>
                      <Link to="/cart" className="go-to-cart">Go to Cart</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {!token ? (
              <Link to="/login">
                <button className="login">👤 Login</button>
              </Link>
            ) : (
              <>
                {role !== 'delivery' && hasOrders && (
                  <Link to="/my-orders">
                    <button className="login">🧀 Your Order</button>
                  </Link>
                )}
                <button className="login" onClick={handleLogout}>
                  🔓 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
