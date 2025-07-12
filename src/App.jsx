import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Sushi from './pages/Sushi.jsx';
import Pizza from './pages/Pizza.jsx';
import BurgerPage from './pages/BurgerPage.jsx';
import Index from './components/Index.jsx'
import Second from './components/Second.jsx'
import Map from './pages/Map.jsx';
import CartPage from './pages/CartPage.jsx';
import Payment from './pages/Payment.jsx';
import Orders from './pages/Orders.jsx'
import MyOrders from './pages/MyOrder.jsx';


function App() {
  return (
    <Routes>
      <Route path='/signup' element={<Index/>}></Route>
      <Route path='/login' element={<Second/>}></Route>
      <Route path="/" element={<Home />} />
      <Route path="/burger" element={<BurgerPage />} />
      <Route path="/sushi" element={<Sushi />} />
      <Route path="/pizza" element={<Pizza />} />
      <Route path="/map" element={<Map />} />
      <Route path='cart' element={<CartPage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path='/orders' element={<Orders />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </Routes>
  );
}

export default App;
