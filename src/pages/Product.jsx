import React from 'react';
import '../styles/main.scss';
import Button from '../components/Button/Button';

const Product = () => {
  // Container styles - similar to what we used for design tokens page
  const containerStyle = {
    paddingTop: '80px',
    paddingBottom: '80px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  };

  // Models section style
  const modelsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginTop: '2rem',
    width: '100%'
  };

  // Compare section style
  const compareStyle = {
    textAlign: 'center',
    marginTop: '2rem',
    width: '100%'
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      minHeight: '100%',
      paddingTop: '64px' // Match header height exactly
    }}>
      <div style={containerStyle}>
        <h1>Vida Electric Scooter Models</h1>
        
        <div style={modelsStyle}>
          <div className="product-card">
            <h2>Vida V1 Pro</h2>
            <div className="product-card__content">
              <p>Our flagship electric scooter with premium features and extended range.</p>
              <ul>
                <li>Top Speed: 80 km/h</li>
                <li>Range: 165 km</li>
                <li>Battery: 3.94 kWh</li>
                <li>Charging Time: 5 hours 55 minutes</li>
              </ul>
              <Button label="Learn More" prominence="primary" size="m" />
            </div>
          </div>
          
          <div className="product-card">
            <h2>Vida V1</h2>
            <div className="product-card__content">
              <p>The perfect balance of performance and value in an electric scooter.</p>
              <ul>
                <li>Top Speed: 80 km/h</li>
                <li>Range: 128 km</li>
                <li>Battery: 3.44 kWh</li>
                <li>Charging Time: 5 hours 15 minutes</li>
              </ul>
              <Button label="Learn More" prominence="primary" size="m" />
            </div>
          </div>
          
          <div style={compareStyle}>
            <Button 
              label="Compare Models"
              prominence="tertiary"
              size="l"
              onClick={() => alert('Comparison tool coming soon!')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;