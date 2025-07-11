import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Header from './components/Header.jsx';
import Footer from './components/footer.jsx';
import { CartProvider } from './components/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Header />
        <App />
        <Footer />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
