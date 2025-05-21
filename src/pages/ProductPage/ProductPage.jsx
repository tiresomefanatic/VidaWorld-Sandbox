import React from 'react';
import './ProductPage.scss';
import Button from '../../components/Button/Button';

const ProductPage = () => {
  return (
    <div className="product-page">
      <div className="product-page__container">
        <h1>Vida Electric Scooter Models</h1>
        
        <div className="product-page__models">
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
          
          <div className="product-page__compare">
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

export default ProductPage; 