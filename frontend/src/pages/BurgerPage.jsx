import React from 'react';
import './pages.css';
import { useCart } from '../components/CartContext.jsx';


function BurgerPage() {
    const { addToCart } = useCart();
  return (
    <div className="container-1250">

        <div className="padding-tb"></div>

        <div className="welcomeDivv">
        <h1 className='sushiTitle'>Our Delicious Burger's</h1>
        <img src="/images/chef-burger.jpg" alt="" className='welcomeImage' />
</div>

<div className="ptpb"></div>

      <div className="cardFlex">
        <div className="card">
            <div className="tiktokliva">
          <img src="/images/burger2.avif" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Yummy Burger</h1>
          <p className='price'>Price: 19.50$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Yummy Burger',
              price: 19.5,
              image: '/images/burger2.avif',
              quantity: 1,
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
              <div className="card">
            <div className="tiktokliva">
          <img src="/images/burger3.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Tasty Burger</h1>
          <p className='price'>Price: 20.00$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Tasty Burger',
              price: 20.0,
              image: '/images/burger3.jpg',
              quantity: 1,
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
              <div className="card">
            <div className="tiktokliva">
          <img src="/images/burger1.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Delicious Burger</h1>
          <p className='price'>Price: 17.99$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Delicious Burger',
              price: 17.99,
              image: '/images/burger1.jpg',
              quantity: 1,
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
      </div>
              <div className="ptpb"></div>

    </div>
  );
}

export default BurgerPage;
