import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    navigate('/CompleteView', { state: { product } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="product-grid">
      <h2>New Arrivals</h2>
      <div className="products">
        {products.map((product, index) => (
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
                  className="product-image"
                  
                />
              </LazyLoad>

              <div className="likeiconbtn">
                <FavoriteIcon className="like-icon" />
              </div>

              <div className="categories">
                <span className="category">{product.categories}</span>
              </div>
            </div>

            <div className="product-details">
              <h3 style={{fontFamily:'Twentieth Century'}}>{product.title}</h3>

              <div className="price">
                <span className="current-price" style={{fontFamily:'Twentieth Century sans-serif'}}>Rs. {product.price}</span>
              </div>

              <div className="rating" style={{backgroundColor:'',width:'50%',textAlign:'center',marginLeft:'-5px'}}>
                <span> <GradeIcon className='ratingicon'/> </span>
                <span> <GradeIcon className='ratingicon'/> </span>
                <span> <GradeIcon className='ratingicon'/> </span>
                <span> <GradeIcon className='ratingicon'/> </span>
                <span> <GradeIcon className='ratingicon'/> </span>
              </div>

              <div className="Size-options">
                {/* {product.sizes.map((size) => ( */}
                  <button className="size">S</button>
                  <button className="size">M</button>
                  <button className="size">L</button>
                  <button className="size">XL</button>
                  <ShoppingCartIcon className='cart-icon'/>
                {/* ))} */}
              </div>
              
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
