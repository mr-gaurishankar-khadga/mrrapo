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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

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
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={initialLoad ? 'initial-zoom' : ''}
                style={{
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: isZoomed ? 'scale(5)' : 'scale(1)',
                }}
              />
            </div>
          ))}
        </div>

        <div className="product-info" style={{ marginTop: '-120px', marginLeft: '50px' }}>
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

          <div style={{ marginLeft: '-20px' }}>
            <FeatureSection />
          </div>

          <div className="features" style={{ marginTop: '10px' }}>
            <h4 style={{ fontFamily: 'Twentieth Century sans-serif' }}>Features</h4>
            <ul>
              <li>{product.description}</li>
            </ul>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <ProductGrid />
    </>
  );
};

export default CompleteView;
