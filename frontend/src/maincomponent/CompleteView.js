import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Completeview.css';
import './ProductDetail.css';
import FeatureSection from './FeatureSection';
import ShoppingCart from './ShoppingCart';
import { IconButton, Popover, Paper, Button } from '@mui/material';

const CompleteView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;
  const [initialLoad, setInitialLoad] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [shopAnchor, setShopAnchor] = useState(null);

  useEffect(() => {
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

  const handleAddToCart = (event) => {
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

    // Show notification
    setShowNotification(true);
    setShopAnchor(event.currentTarget);
    setTimeout(() => {
      setShowNotification(false);
      setShopAnchor(null);
    }, 2000); // Hide notification after 3 seconds
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
        {/* Product Images */}
        <div className="frames">
          {[product.frontImage, product.backImage, product.extraImage1, product.extraImage2].map((src, index) => (
            <div 
              className="frame" 
              key={index} 
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <img
                src={`https://mrrapo.onrender.com/${src}`}
                alt={product.title}
                className={initialLoad ? 'initial-zoom' : ''}
              />
            </div>
          ))}
        </div>

        {/* Product Information */}
        <div className="product-info" style={{ marginTop: '20px' }}>
          <h1 style={{ fontFamily: 'Twentieth Century sans-serif' }}>{product.title}</h1>
          <div className="price">
            <span className="current-price">Rs.{product.price}</span>
            <span className="discount" style={{ fontFamily: 'Twentieth Century sans-serif' }}>Save {product.discount}% right now</span>
          </div>

          {/* Color Options */}
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

          {/* Size Options */}
          <div className="Size-option">
            <h4>Size</h4>
            <div className="Size-options">
              {product.sizes.map((size, index) => (
                <button key={index} className={`size ${size}`}>{size}</button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="selectitem">
              <select name="quantity" id="quantity" onChange={handleQuantityChange} value={quantity}>
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button 
              onClick={handleAddToCart} 
              style={{
                backgroundColor: 'rgb(251, 100, 27)',
                color: 'white',
                padding: '10px 20px',
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '5px',
                transition: 'transform 0.3s ease-in-out',
                marginRight: '10px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Add to Cart
            </Button>

            <Popover
              className='mypover'
              open={Boolean(shopAnchor)}
              onClose={() => setShopAnchor(null)}
              anchorEl={shopAnchor}
              anchorOrigin={{ vertical: '', horizontal: 'right' }}
              transformOrigin={{ vertical: '', horizontal: 'right' }}
              PaperProps={{
                style: {
                  color: 'white',
                  backgroundColor: '',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                  transition: 'transform 1m ease-in-out',
                  marginLeft:'640px',
                  marginTop:'200px',
                },
              }}
            >
              <Paper>
                <ShoppingCart />
              </Paper>
            </Popover>

            <Button 
              onClick={handleBuyNow} 
              style={{
                backgroundColor: 'rgb(76, 175, 80)',
                color: 'white',
                padding: '10px 20px',
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '5px',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Buy Now
            </Button>
          </div>

          {/* Feature Section */}
          <div className="featuresection" style={{ backgroundColor: '', overflowX: 'auto', maxWidth: '770px', marginLeft: '-25px', marginTop: '20px' }}>
            <FeatureSection />
          </div>

          {/* Product Features */}
          <div className="features" style={{ marginTop: '10px' }}>
            <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}>Features</h4>
            <ul>
              <li style={{ paddingRight: '20px', letterSpacing: '2px' }}>{product.description}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteView;
