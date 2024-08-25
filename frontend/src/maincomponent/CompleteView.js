import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Completeview.css';
import './ProductDetail.css';
import FeatureSection from './FeatureSection';
import ProductGrid from './ProductGrid';

const CompleteView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;
  const [initialLoad, setInitialLoad] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);

    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleAddToCart = () => {
    setCartItems((prevItems) => [
      ...prevItems,
      {
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.frontImage,
        color: product.colors[0] || 'Default Color',
        size: product.sizes[0] || 'Default Size',
        quantity: quantity,
      },
    ]);
  };

  const handleBuyNow = () => {
    navigate('/payment', { state: { product, quantity } });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);



  return (
    <>
      <div className="complete-view">
        <div className="frames">
          {[product.frontImage, product.backImage, product.extraImage1, product.extraImage2].map((src, index) => (
            <div 
              className="frame" 
              key={index} 
              style={{ overflow: 'hidden', position: 'relative' }}
            >

              <img
                src={`https://rappo.onrender.com/${src}`}
                alt={product.title}
                className={initialLoad ? 'initial-zoom' : ''}
              />
            </div>
          ))}
        </div>

        <div className="product-info" style={{marginTop:'20px',backgroundColor:''}}>  
          <h1 style={{ fontFamily: 'Twentieth Century sans-serif' }}>{product.title}</h1>
          <div className="price">
            <span className="current-price">Rs.{product.price}</span>
            <span className="discount" style={{ fontFamily: 'Twentieth Century sans-serif' }}>Save {product.discount}% right now</span>
          </div>

          <div className="colors">
            <h4>Colors</h4>
            <div className="color-options">
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color, index) => (
                  <button key={index} className={`color ${color}`} />
                ))
              ) : (
                <p>No colors available</p>
              )}
            </div>
          </div>

          <div className="Size-option">
            <h4>Size</h4>
            <div className="Size-options">
              {product.sizes.map((size, index) => (
                <button key={index} className={`size ${size}`}>{size}</button>
              ))}
            </div>

            <div className="selectitem">
              <select name="quantity" id="quantity" onChange={handleQuantityChange} value={quantity}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            <button className="add-to-cart" onClick={handleBuyNow}>Buy Now</button>
            <button className="wishlist">
              <span style={{ fontSize: '20px', paddingLeft: '20px', paddingRight: '20px' }}> ♡ </span>
            </button>
          </div>



          <div className="featuresection" style={{ backgroundColor: '', overflowX: 'auto', maxWidth: '770px', marginLeft: '-25px', marginTop: '20px' }}>
  <FeatureSection />
</div>








          <div className="features" style={{ marginTop: '10px' }}>
            <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}>Features</h4>
            <ul>
              <li style={{paddingRight:'20px',letterSpacing:'2px'}}>{product.description}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteView;
