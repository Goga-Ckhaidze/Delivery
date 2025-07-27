import React, { useState, useEffect } from 'react';
import './Order.css';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function Orders() {
  const [showAlert, setShowAlert] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryGuyID, setDeliveryGuyID] = useState(null);
  const [takingOrderId, setTakingOrderId] = useState(null);

  // Decode token once on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login.');
      setLoading(false);
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded) {
      setError('Failed to decode token.');
      setLoading(false);
      return;
    }

    const id = decoded._id || null;
    setDeliveryGuyID(id);
  }, []);

  // Fetch orders after deliveryGuyID is set
  useEffect(() => {
    if (!deliveryGuyID) return;

    async function fetchOrders() {
      try {
        const response = await fetch('https://deliveryback-y8wi.onrender.com/api/orders');
        const data = await response.json();

        const filtered = data.filter(order => {
          if ((order.status || '').toLowerCase() === 'pending') return true;
          if (deliveryGuyID && String(order.takenBy) === deliveryGuyID) return true;
          return false;
        });

        const sorted = [
          ...filtered.filter(o => o.takenBy === deliveryGuyID),
          ...filtered.filter(o => o.status === 'pending'),
        ];

        // Normalize deliveryEndTime to timestamp and calculate deliveryTime in minutes left
        const normalizedOrders = sorted.map(order => {
          const deliveryEndTime = order.deliveryEndTime ? new Date(order.deliveryEndTime).getTime() : 0;
          const deliveryTime = deliveryEndTime
            ? Math.max(0, Math.floor((deliveryEndTime - Date.now()) / 60000))
            : 0;

          return {
            ...order,
            deliveryEndTime,
            deliveryTime,
          };
        });

        setOrders(normalizedOrders);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch orders');
        setLoading(false);
      }
    }

    fetchOrders();
  }, [deliveryGuyID]);

  // Countdown interval - decreases deliveryTime every minute based on deliveryEndTime
  useEffect(() => {
    if (!deliveryGuyID) return;

    const updateDeliveryTimes = () => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.takenBy === deliveryGuyID && order.deliveryEndTime) {
            const remaining = Math.max(0, Math.floor((order.deliveryEndTime - Date.now()) / 60000));
            return {
              ...order,
              deliveryTime: remaining,
            };
          }
          return order;
        })
      );
    };

    updateDeliveryTimes();
    const interval = setInterval(updateDeliveryTimes, 60000);

    return () => clearInterval(interval);
  }, [deliveryGuyID]);

  const handleTakeOrder = async (orderId) => {
    const deliveryTimeInput = prompt('Enter delivery time in minutes (e.g., 30)');
    if (!deliveryTimeInput) return;

    const deliveryTime = Number(deliveryTimeInput);
    if (isNaN(deliveryTime) || deliveryTime <= 0) {
      alert('Please enter a valid positive number for delivery time.');
      return;
    }

    setTakingOrderId(orderId);
    try {
      const deliveryEndTimeISO = new Date(Date.now() + deliveryTime * 60000).toISOString();

      const res = await fetch(`https://deliveryback-y8wi.onrender.com/api/orders/${orderId}/take`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryGuyID, deliveryTime, deliveryEndTime: deliveryEndTimeISO }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to take order');

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // hide after 3 seconds

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId
            ? { ...o, status: 'taken', takenBy: deliveryGuyID, deliveryTime, deliveryEndTime: new Date(deliveryEndTimeISO).getTime() }
            : o
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setTakingOrderId(null);
    }
  };

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="ptpb"></div>
      {showAlert && (
        <div className="custom-alert">✅ Order successfully taken!</div>
      )}
      <main className="orders-container">
        <h2 className="orders-title">📦 Orders to Deliver</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order) => {
            const total = order.items
              ? order.items.reduce(
                  (sum, item) => sum + item.price * (item.quantity || 1),
                  0
                )
              : 0;

            const isMine = order.takenBy === deliveryGuyID;

            return (
              <section
                key={order._id}
                className={`order-card ${isMine ? 'highlighted-order' : ''}`}
              >
                <div className="order-left">
                  <h3 className="customer-name">🧍 {order.name}</h3>
                  <p className="phone">📞 {order.phone}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${order.location.lat.toFixed(
                      6
                    )},${order.location.lng.toFixed(6)}`}
                    className="location"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍See Location 🌍
                  </a>
                </div>

                <div className="order-right">
                  <div className="left-right">
                    <h4>Items Ordered:</h4>
{order.takenBy === null || order.takenBy === undefined ? (
  <p className="delivery-time late">Order Not Taken</p>
) : order.deliveryEndTime && order.deliveryTime > 0 ? (
  <p className="delivery-time">
    ⏰ Delivery Time: {order.deliveryTime} minute{order.deliveryTime !== 1 ? 's' : ''} left
  </p>
) : (
  <p className="delivery-time late">❌ Delivery Late</p>
)}


                  </div>
                  <ul className="items-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <li key={i} className="order-item">
                          <span className="item-title">
                            {item.title || item.name}
                          </span>{' '}
                          -{' '}
                          <span className="item-price">
                            ${item.price.toFixed(2)}
                          </span>{' '}
                          × <span className="item-quantity">{item.quantity || 1}</span>
                        </li>
                      ))
                    ) : (
                      <li className="no-items">No items found</li>
                    )}
                  </ul>

                  <div className="order-footer">
                    <p className="total-value">
                      Total: <strong>${total.toFixed(2)}</strong>
                    </p>

                    {order.status === 'pending' && (
                      <button
                        disabled={takingOrderId === order._id}
                        className="get-order-btn"
                        onClick={() => handleTakeOrder(order._id)}
                        aria-label={`Take order for ${order.name}`}
                      >
                        {takingOrderId === order._id ? 'Taking...' : 'Take Order'}
                      </button>
                    )}

                    {isMine && <p className="taken-label">✅ Your Order</p>}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
}

export default Orders;
