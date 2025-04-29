import React from 'react';
import '../styles/main.scss';
import Button from '../components/Button/Button';

const Product = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Vida Electric Scooter Models</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ 
          padding: '2rem', 
          borderRadius: '12px', 
          backgroundColor: '#f4f4f4',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2>Vida V1 Pro</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>Our flagship electric scooter with premium features and extended range.</p>
            <ul>
              <li>Top Speed: 80 km/h</li>
              <li>Range: 165 km</li>
              <li>Battery: 3.94 kWh</li>
              <li>Charging Time: 5 hours 55 minutes</li>
            </ul>
            <Button size="medium">Learn More</Button>
          </div>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          borderRadius: '12px', 
          backgroundColor: '#f4f4f4',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2>Vida V1</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>The perfect balance of performance and value in an electric scooter.</p>
            <ul>
              <li>Top Speed: 80 km/h</li>
              <li>Range: 128 km</li>
              <li>Battery: 3.44 kWh</li>
              <li>Charging Time: 5 hours 15 minutes</li>
            </ul>
            <Button size="medium">Learn More</Button>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button 
            variant="tertiary"
            size="large"
            onClick={() => alert('Comparison tool coming soon!')}
          >
            Compare Models
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
