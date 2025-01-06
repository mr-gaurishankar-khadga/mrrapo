import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css'; 
import LazyLoad from 'react-lazyload';

// Import images
import slider1 from './images/m1.webp';
import slider2 from './images/m2.jpg';
import slider3 from './images/m3.jpg';
import slider4 from './images/m4.webp';




import ProductGrid from './ProductGrid';

const ZoomImageSlider = () => {
  const [zoomedIndex, setZoomedIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setZoomedIndex(0); 
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const handleAfterChange = (current) => {
    setZoomedIndex(current); 
  };


  
  const settings = {
    dots: true,
    infinite: true, 
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, 
    afterChange: handleAfterChange,
    centerMode: true, 
    centerPadding: '0', 
    arrows: false, 
  };



  const images = [slider1, slider4,slider1, slider4,slider1, slider4,slider1, slider4];


  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className={`zoom-effect ${index === zoomedIndex ? 'zoomed' : ''}`}>
              <LazyLoad height={250} offset={100}>
                <img src={image} alt={`slide-${index}`} className="slider-image" />
              </LazyLoad>
            </div>
          ))}
        </Slider>
      </div>
      


      <div className="main-bottom-container">
        <div className="bottom-content">
          <h1 style={{fontFamily:'Twentieth Century sans-serif'}}>For the Bold, Stylish & Confident you</h1>
          <p >Our collection features a range of stylish and versatile outfits perfect for any casual occasion. From breezy kurtas to comfy palazzos, each piece is crafted with care and attention to detail. We use high-quality fabrics that are breathable and easy to care for, ensuring that you look and feel your best all day long.</p>
        </div>
      </div>

      <ProductGrid/>
   
    </div>
  );
};

export default ZoomImageSlider;
