import React from 'react'
import { useCart } from '../components/CartContext.jsx';


function pizza() {
    const { addToCart } = useCart();
  return (
        <div className="container-1250">

        <div className="padding-tb"></div>

        <div className="welcomeDivv">
        <h1 className='sushiTitle'>Our Delicious Pizza's</h1>
        <img src="/images/chef-pizza.avif" alt="" className='welcomeImage' />
</div>

<div className="ptpb"></div>

              <div className="cardFlex">
        <div className="card">
            <div className="tiktokliva">
          <img src="/images/pizza1.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Delicious Pizza</h1>
          <p className='price'>Price: 11.50$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Delicious Pizza',
              price: 11.50,
              image: '/images/pizza1.jpg'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
                <div className="card">
            <div className="tiktokliva">
          <img src="/images/pizza2.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Yummy Pizza</h1>
          <p className='price'>Price: 23.00$</p>
          <button className='order-btn' 
          onClick={() =>
            addToCart({
              title: 'Yummy Pizza',
              price: 23.00,
              image: '/images/pizza2.jpg'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
                        <div className="card">
            <div className="tiktokliva">
          <img src="/images/pizza3.jpg" alt="burger2" className='burgerImages' />
          <div className="bottom">
            <div className="div">
          <h1 className='burgerTitle'>Tasty Pizza</h1>
          <p className='price'>Price: 13.99$</p>
          <button className='order-btn'
          onClick={() =>
            addToCart({
              title: 'Tasty Pizza',
              price: 13.99,
              image: '/images/pizza3.jpg'
            })
          }>Order</button>
          </div>
          </div>
          </div>
        </div>
      </div>
      <div className="ptpb"></div>
    </div>
  )
}

export default pizza