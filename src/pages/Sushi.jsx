import React from 'react'
import { useCart } from '../components/CartContext.jsx';

function sushi() {
    const { addToCart } = useCart();
  return (
        <div className="container-1250">

        <div className="padding-tb"></div>
        
        <div className="welcomeDivv">
        <h1 className='sushiTitle'>Our Delicious Sushi's</h1>
        <img src="/images/s1.avif" alt="" className='welcomeImage' />
</div>
      <div className="cardFlex">
        <div className="card">
            <div className="tiktokliva">
          <img src="/images/sushi1.jpg" alt="burger1" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Tasty Sushi</h1>
          <p className='price'>Price: 30.00$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Tasty Sushi',
              price: 30.0,
              image: '/images/sushi1.jpg'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
        <div className="card">
            <div className="tiktokliva">
          <img src="/images/sushi2.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Delicious Sushi</h1>
          <p className='price'>Price: 22.90$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Delicious Sushi',
              price: 22.90,
              image: '/images/sushi2.jpg'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
        <div className="card">
            <div className="tiktokliva">
          <img src="/images/sushi3.avif" alt="burger3" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Yummy Sushi</h1>
          <p className='price'>Price: 23.40$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Yummy Sushi',
              price: 23.40,
              image: '/images/sushi3.avif'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
      </div>
      <div className="pd-50"></div>
    </div>
  )
}

export default sushi