import './App.css'
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

function home() {

  const [isDelivery, setIsDelivery] = useState(false);

  const navigate = useNavigate();

    useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setIsDelivery(decoded.role === 'delivery');
      }
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }, []);

  const handleNavigateToOrder = () =>{ 
    navigate('/orders')
  }

  return (
    <>
        <div className='welcomeDiv'>
          <div className="container-1250">
            <div className="welcomeFlex">
          <div className="width-40">
            <video autoPlay loop muted className='video'>
              <source src="https://glovoapp.com/images/landing/address-container-animation.webm" type='video/webm' />
            </video>
          </div>
          <div className="width-60">
            <h1 className='welcomeTitle'>Delivery Food And More</h1>
            <h2 className='welcomeText'>Food, stores, pharmacies, whatever you want!</h2>

            <p className='locationP'>Welcome To Delivery 🌍</p>
          </div>
          </div>
          </div>
        </div>
          <img className='underImage' src="https://glovoapp.com/images/waves/address-jumbotron-wave-desktop.svg" alt="" />
    
    <div className="center">
    <img src="https://glovoapp.com/images/landing/cities.svg" alt="cities.svg" className='cityImage' />
    <h1 className='categoryTitle'>Top Categories in Here</h1>


    {isDelivery ? (<button className='buttons' onClick={handleNavigateToOrder}>Order's</button>) : 
    (<><Link to='/burger' className='buttons'>
     Burgers
    </Link>
    <Link to='/Sushi' className='buttons'>
     Sushi
    </Link>
    <Link to='/Pizza' className='buttons'>
     Pizza
    </Link>
    </>)}


</div>

    <div className="padding-50"></div>

    </>
  )
}

export default home;
