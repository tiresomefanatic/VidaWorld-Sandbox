import React, { useState, useEffect } from 'react';
import './HeroPage.scss';

const HeroPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const backgroundImage = isMobile ? '/banner_mobile.jpg' : '/banner_desktop.png';

  return (
    <div className="hero-page">
      <div className="hero-page__hero-section">
        {/* Background Image Container */}
        <div className="hero-page__background">
          <img 
            src={backgroundImage}
            alt="VIDA Electric Scooters and Charging Station" 
            className="hero-page__background-image"
          />
          
          <div className="hero-page__overlay"></div>
        </div>
        
        {/* Hero Content */}
        <div className="hero-page__content">
          <div className="hero-page__text-content">
            <h1 className="hero-page__headline">Lorem Ipsum</h1>
            <p className="hero-page__subheadline">
              Lorem Ipsum is simply dummy text of the printing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
