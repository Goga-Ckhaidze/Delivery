import axios from 'axios';
import React, { useEffect, useState } from 'react';

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [userID, setUserID] = useState(null);

  // Decode token to get user ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      const decoded = JSON.parse(payload);
      setUserID(decoded._id);
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }, []);

  // Fetch user orders once userID is available
  useEffect(() => {
    if (!userID) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const getOrders = async () => {
try {
  const response = await axios.post(
    'https://deliveryback-y8wi.onrender.com/api/orders/my-orders',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

        const normalizedOrders = response.data.map(order => {
          const deliveryEndTime = order.deliveryEndTime ? new Date(order.deliveryEndTime).getTime() : null;
          const remaining = deliveryEndTime ? Math.max(0, Math.floor((deliveryEndTime - Date.now()) / 60000)) : 0;

          return {
            ...order,
            deliveryEndTime,
            deliveryTime: remaining,
          };
        });

        setOrders(normalizedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    getOrders();

  }, [userID]);

  // Update delivery time countdown every minute
  useEffect(() => {
    if (!userID) return;

    const interval = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.deliveryEndTime) {
            const remaining = Math.max(0, Math.floor((order.deliveryEndTime - Date.now()) / 60000));
            return { ...order, deliveryTime: remaining };
          }
          return order;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [userID]);

  async function handleDeliveredButton(index) {
    const token = localStorage.getItem('token');
    const orderToDeleteID = orders[index]._id;

    try {
      const response = await axios.delete(
        `https://deliveryback-y8wi.onrender.com/api/orders/${orderToDeleteID}`,
        {
          data: { token },
          headers: {
          Authorization: `Bearer ${token}`,
         },
        },
        
      );

      if (response.status === 200) {
        setOrders(prev => prev.filter((item, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to delete order:', error.response?.data || error.message);
    }
  }
  return (
    <>
      <div className="ptpb"></div>
      <main className="orders-container">
        <h2 className="orders-title">📦 Your Order's</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order, index) => {


            const total = order.items
              ? order.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
              : 0;

            return (
              <section className="order-card" key={order._id}>
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


{order.deliveryTime > 0 ? (
  <p className="delivery-time">
    ⏰ Delivery Time: {order.deliveryTime} minute{order.deliveryTime !== 1 ? 's' : ''} left
  </p>
) : order.deliveryTime === 0 ? (
  <p className="delivery-time late">❌ Delivery Late</p>

) : (
  <p className="delivery-time late">Order Not Taken</p>
)}  



</div>
                  <ul className="items-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <li key={i} className="order-item">
                          <span className="item-title">{item.title || item.name}</span> -{' '}
                          <span className="item-price">${item.price.toFixed(2)}</span> ×{' '}
                          <span className="item-quantity">{item.quantity || 1}</span>
</li>
                      ))
                    ) : (
                      <li className="no-items">No items found</li>
                    )
                    }
                  </ul>
                  <div className="order-footer">
                    <p className="total-value">
                      Total: <strong>${total.toFixed(2)}</strong>
                    </p>
                      {order.user_id === userID && (
  <button className='login' onClick={() => handleDeliveredButton(index)}>
    Order Delivered ✓
  </button>
)}

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


export default MyOrder;
