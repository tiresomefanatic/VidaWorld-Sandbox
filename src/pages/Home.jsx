import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.scss';
import Button from '../components/Button/Button';

const Home = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Welcome to Vida World</h1>
      <p>Experience the future of electric mobility with Vida's premium electric scooters.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* First section: Page navigation */}
        <div>
          <h2>Navigation</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Button size="medium">Home Page</Button>
            </Link>
            <Link to="/product" style={{ textDecoration: 'none' }}>
              <Button size="medium">Product Page</Button>
            </Link>
            <Link to="/explore" style={{ textDecoration: 'none' }}>
              <Button size="medium">Explore Page</Button>
            </Link>
          </div>
        </div>
        
        {/* Second section: Components */}
        <div>
          <h2>Components Gallery</h2>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/components" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="medium">View Components</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
