import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationChosen, setLocationChosen] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [errors, setErrors] = useState({});

  // Load from localStorage
  useEffect(() => {
    const isChosen = localStorage.getItem('locationChosen') === 'true';
    const storedLat = localStorage.getItem('locationLat');
    const storedLng = localStorage.getItem('locationLng');
    const savedName = localStorage.getItem('userName');
    const savedPhone = localStorage.getItem('userPhone');

    setLocationChosen(isChosen);
    if (storedLat && storedLng) {
      setLat(parseFloat(storedLat));
      setLng(parseFloat(storedLng));
    }
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\d{9,15}$/.test(phone.trim())) errs.phone = 'Enter valid phone number (9–15 digits).';
    if (!locationChosen || lat === null || lng === null) errs.location = 'Please choose delivery location.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChooseLocation = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    navigate('/map');
  };

  const handleOrder = async () => {
    if (!validate()) return;

    const token = localStorage.getItem('token');

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    try {
      const response = await fetch('https://deliveryback-y8wi.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, location: { lat, lng }, items: cartItems, token }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order successfully placed!');
        // Clear inputs & storage
        setName('');
        setPhone('');
        setLocationChosen(false);
        setLat(null);
        setLng(null);
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('locationChosen');
        localStorage.removeItem('locationLat');
        localStorage.removeItem('locationLng');
        localStorage.removeItem('cartItems');
        window.location = "/";
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Try again later.');
    }
  };

  return (
    <>
    <div className="ptpb"></div>
    <div style={{ maxWidth: 450, margin: '50px auto', padding: 30, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 25, color: '#333' }}>Complete Your Order</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => {
          setName(e.target.value);
          localStorage.setItem('userName', e.target.value);
        }}
        style={{ width: '100%', padding: 14, fontSize: 16, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', outlineColor: '#00a082' }}
      />
      {errors.name && <div style={{ color: '#e53935', fontSize: 14, marginBottom: 10 }}>{errors.name}</div>}

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={e => {
          setPhone(e.target.value);
          localStorage.setItem('userPhone', e.target.value);
        }}
        style={{ width: '100%', padding: 14, fontSize: 16, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd', outlineColor: '#00a082' }}
      />
      {errors.phone && <div style={{ color: '#e53935', fontSize: 14, marginBottom: 10 }}>{errors.phone}</div>}

      <button onClick={handleChooseLocation} style={{ width: '100%', padding: 14, fontSize: 16, backgroundColor: '#ffc440', borderRadius: 8, border: 'none', marginBottom: 10, cursor: 'pointer' }}>
        📍 {locationChosen ? 'Location Chosen ✔' : 'Choose Delivery Location'}
      </button>
      {errors.location && <div style={{ color: '#e53935', fontSize: 14, marginBottom: 10 }}>{errors.location}</div>}

      {locationChosen && lat !== null && lng !== null && (
        <p style={{ fontSize: 14, marginBottom: 20, color: '#555', textAlign: 'center' }}>
          📍 <strong>Latitude:</strong> {lat.toFixed(6)}, <strong>Longitude:</strong> {lng.toFixed(6)}
        </p>
      )}

      <button onClick={handleOrder} style={{ width: '100%', padding: 14, fontSize: 16, backgroundColor: '#00a082', borderRadius: 8, border: 'none', color: '#fff', cursor: 'pointer' }}>
        🛒 Place Order
      </button>
    </div>
    </>
  );
}

export default Payment;
