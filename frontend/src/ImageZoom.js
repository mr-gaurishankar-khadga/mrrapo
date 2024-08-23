import React from 'react';
import './ImageZoom.css';

const ImageZoom = () => {
  const carStyle = {
    width: '180px',
    height: '70px',
    backgroundColor: '#ff5722', // Bright orange color for the car
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%) rotateY(20deg)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)', // Deep shadow for depth
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
  };

  const roofStyle = {
    width: '80px',
    height: '40px',
    backgroundColor: '#ff7043', // Lighter shade for the roof
    position: 'absolute',
    top: '-20px',
    left: '50px',
    borderRadius: '10px 10px 0 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  };

  const windowStyle = {
    width: '40px',
    height: '20px',
    backgroundColor: '#fff', // White color for windows
    position: 'absolute',
    top: '-15px',
    left: '60px',
    borderRadius: '2px',
    boxShadow: '0 0 5px rgba(255, 255, 255, 0.6)', // Glow effect for windows
  };

  const stripeStyle = {
    width: '100%',
    height: '10px',
    backgroundColor: '#ffd740', // Yellow color for the stripe
    position: 'absolute',
    top: '25px',
    left: '0',
    borderRadius: '5px',
  };

  const wheelStyle = {
    width: '30px',
    height: '30px',
    backgroundColor: '#000', // Black color for wheels
    borderRadius: '50%',
    position: 'absolute',
    bottom: '-15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', // Shadow for wheels
  };

  const frontWheelStyle = {
    ...wheelStyle,
    left: '20px',
  };

  const backWheelStyle = {
    ...wheelStyle,
    right: '20px',
  };

  const roadStyle = {
    position: 'relative',
    width: '100%',
    height: '150px',
    background: 'linear-gradient(to bottom, #606060 0%, #303030 100%)',
    overflow: 'hidden',
  };

  const animationStyle = {
    position: 'relative',
    width: '200%',
    height: '100%',
    animation: 'moveCar 5s linear infinite',
  };

  const headlightsStyle = {
    width: '15px',
    height: '15px',
    backgroundColor: '#fff', // White color for headlights
    position: 'absolute',
    top: '10px',
    left: '15px',
    borderRadius: '50%',
    boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)', // Glow effect
  };

  const tailLightsStyle = {
    width: '15px',
    height: '15px',
    backgroundColor: '#ff1744', // Red color for tail lights
    position: 'absolute',
    top: '10px',
    right: '15px',
    borderRadius: '50%',
    boxShadow: '0 0 5px rgba(255, 0, 0, 0.8)', // Glow effect
  };

  return (
    <div style={roadStyle}>
      <div style={animationStyle}>
        <div style={{ ...carStyle, left: 'calc(100% - 200px)' }}>
          <div style={roofStyle}></div>
          <div style={windowStyle}></div>
          <div style={stripeStyle}></div>
          <div style={headlightsStyle}></div>
          <div style={tailLightsStyle}></div>
          <div style={frontWheelStyle}></div>
          <div style={backWheelStyle}></div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoom;
