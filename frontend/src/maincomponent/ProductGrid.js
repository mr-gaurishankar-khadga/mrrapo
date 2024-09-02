import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './ProductGrid.css';

const ProductGrid = ({ searchQuery = '', user }) => {  // Added user prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [likedProducts, setLikedProducts] = useState(new Set()); // State for liked products
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data.products);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (product) => {
    window.scrollTo(0, 0);
    navigate('/CompleteView', { state: { product } });
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleLikeClick = async (productId) => {
    if (!user) { // If user is not logged in, redirect
      navigate('/LoginPage');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/likes', { productId });
      
      // Update local liked products state based on the response
      if (response.data.message.includes('liked')) {
        setLikedProducts((prev) => new Set(prev).add(productId)); // Add product ID to liked state
      } else {
        setLikedProducts((prev) => {
          const newLiked = new Set(prev);
          newLiked.delete(productId); // Remove product ID from liked state
          return newLiked;
        });
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };
  

  if (loading) {
    return (
      <div className="product-grid">
        <h2>New Arrivals</h2>
        <div className="products">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="product-card" key={index}>
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
              <div className="skeleton-wave" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error loading products: {error.message}</p>;

  const normalizedSearchQuery = searchQuery ? searchQuery.toLowerCase() : '';

  const filteredProducts = products.filter(
    (product) =>
      product.title && 
      product.title.toLowerCase().includes(normalizedSearchQuery)
  );

  return (
    <div className="product-grid">
      <h2>New Arrivals</h2>
      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="product-card"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(product)}
            >
              <div className="image-container">
                <LazyLoad height={250} offset={100}>
                  <img
                    src={
                      hoveredIndex === index && product.backImage
                        ? `http://localhost:8000/${product.backImage}`
                        : `http://localhost:8000/${product.frontImage}`
                    }
                    alt={product.title}
                    className={`product-image ${loadedImages.has(index) ? 'fade-in' : 'hidden'}`}
                    onLoad={() => handleImageLoad(index)}
                  />
                </LazyLoad>

                <div className="likeiconbtn" onClick={(e) => { e.stopPropagation(); handleLikeClick(product._id); }}>
                  <FavoriteIcon className={`like-icon ${likedProducts.has(product._id) ? 'liked' : ''}`} />
                </div>

                <div className="categories">
                  <span className="category">{product.categories}</span>
                </div>
              </div>

              <div className="product-details">
                <h3 style={{ fontFamily: 'Twentieth Century' }}>{product.title}</h3>

                <div className="price">
                  <span className="current-price" style={{ fontFamily: 'Twentieth Century sans-serif' }}>
                    Rs. {product.price}
                  </span>
                </div>

                <div className="rating" style={{ width: '50%', textAlign: 'center', marginLeft: '-15px', justifyContent: 'flex-start' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i}><GradeIcon className="ratingicon" /></span>
                  ))}
                </div>

                <div className="Size-options">
                  <button className="size">S</button>
                  <button className="size">M</button>
                  <button className="size">L</button>
                  <button className="size">XL</button>
                  <ShoppingCartIcon className="cart-icon" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found matching "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
