import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.scss';
import Button from '../components/Button/Button';

const Home = () => {
  return (
    <div className="home-page" style={{ paddingTop: '96px' }}>
      <div className="home-page__container">
        <h1>Welcome to Vida World</h1>
        <p>Experience the future of electric mobility with Vida's premium electric scooters.</p>
        
        <div className="home-page__sections">
          {/* First section: Page navigation */}
          <div className="home-page__section">
            <h2>Navigation</h2>
            <div className="home-page__buttons">
              <Link to="/home">
                <Button label="Home Page" prominence="primary" size="m" />
              </Link>
              <Link to="/product">
                <Button label="Product Page" prominence="primary" size="m" />
              </Link>
              <Link to="/explore">
                <Button label="Explore Page" prominence="primary" size="m" />
              </Link>
              <Link to="/designtokens">
                <Button label="Design Tokens" prominence="primary" size="m" />
              </Link>
              <Link to="/teaser">
                <Button label="Teaser Page" prominence="primary" size="m" />
              </Link>
             
            </div>
          </div>
          
          {/* Components section */}
          <div className="home-page__section">
            <h2>Components</h2>
            <div className="home-page__buttons">
              <Link to="/buttons">
                <Button label="Buttons" prominence="primary" size="m" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
