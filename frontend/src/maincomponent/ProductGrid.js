import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './ProductGrid.css';



const ProductGrid = ({ searchQuery = '', user }) => {  

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [loadedImages, setLoadedImages] = useState(new Set());

  const [likedProducts, setLikedProducts] = useState(new Set()); 

  const navigate = useNavigate();



  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return; 
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/products?page=${page}&search=${searchQuery}`);
      const newProducts = response.data.products;

      if (newProducts.length === 0) {
        setHasMore(false); 
      } else {
        const shuffledProducts = shuffleArray(newProducts);
        
        // Filter out duplicate products
        setProducts((prevProducts) => {
          const existingProductIds = new Set(prevProducts.map(p => p._id));
          const filteredProducts = shuffledProducts.filter(product => !existingProductIds.has(product._id));
          return [...prevProducts, ...filteredProducts];
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, loading, hasMore]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 15 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [handleScroll]);

  const debounce = (func, delay) => {
    let timeoutId;
    
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleClick = (product) => {
    window.scrollTo(0, 0);
    navigate('/CompleteView', { state: { product } });
  };

  if (error) return <p>Error loading products: {error.message}</p>;





  return (
    <div className="product-grid">
      <h2>New Arrivals</h2>
      <div className="products">
        <Suspense fallback={<p>Loading products...</p>}>
          {products.map((product, index) => (
            <ProductCard 
              key={product._id}
              product={product}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              loadedImages={loadedImages}
              setLoadedImages={setLoadedImages}
              likedProducts={likedProducts}
              setLikedProducts={setLikedProducts}
              handleClick={handleClick}
            />
          ))}
        </Suspense>
        {/* {loading && <p>Loading more products...</p>} */}
      </div>
    </div>
  );
};





const ProductCard = React.memo(({ 
  product, 
  index, 
  hoveredIndex, 
  setHoveredIndex, 
  loadedImages, 
  setLoadedImages, 
  likedProducts, 
  setLikedProducts, 
  handleClick 
}) => {
  const imageStyle = {
    height: '100%',
    width: '100%',
    display: 'block',
    transition: 'transform 0.5s ease, transform-origin 5s ease',
    transformOrigin: 'center',
    animation: loadedImages.has(index) ? 'zoomIn 1.0s ease-out forwards' : 'none',
  };




  return (
    <div
      className="product-card"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
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
            style={imageStyle}
            onLoad={() => setLoadedImages((prev) => new Set(prev).add(index))}
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



        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <span key={i}><GradeIcon className="ratingicon" /></span>
          ))}
        </div>



        <div className="Size-options" style={{display:'none'}}>
          <button className="size">S</button>
          <button className="size">M</button>
          <button className="size">L</button>
          <button className="size">XL</button>

          <ShoppingCartIcon className="cart-icon" style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }} />

        </div>

      </div>
    </div>
  );
});

export default ProductGrid;
