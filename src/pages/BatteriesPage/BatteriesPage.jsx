import React, { useState, useEffect } from 'react';
import './BatteriesPage.scss';

const BatteriesPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const leftBatterySrc = isMobile ? "/battery_m_l.svg" : "/battery_l.png";
  const rightBatterySrc = isMobile ? "/battery_m_r.svg" : "/battery_r.png";

  return (
    <div className="batteries-page">
      <div className="batteries-page__background-container">
        <div className="batteries-page__content-card">
          {!isMobile && (
            <div className="batteries-page__battery batteries-page__battery--left">
              <img 
                src={leftBatterySrc}
                alt="VIDA Electric Scooter Battery" 
                className="batteries-page__battery-image"
              />
            </div>
          )}
          
          <div className="batteries-page__content">
            <h1 className="batteries-page__headline">
              The only Electric<br className="mobile-only" /> Scooter in India with
            </h1>
            <h2 className="batteries-page__feature">
              2 removable batteries
            </h2>
            <div className="batteries-page__divider"></div>
            <p className="batteries-page__description">
              Bring them home and charge them. They'll have your back during long rides. Charge them anywhere, anytime - at home, at the office, or even at your favourite café
            </p>
          </div>

          {!isMobile && (
            <div className="batteries-page__battery batteries-page__battery--right">
              <img 
                src={rightBatterySrc}
                alt="VIDA Electric Scooter Battery" 
                className="batteries-page__battery-image"
              />
            </div>
          )}

          {isMobile && (
            <div className="batteries-page__battery-stack">
              <img 
                src={leftBatterySrc}
                alt="VIDA Electric Scooter Battery Left" 
                className="batteries-page__battery-image"
              />
              <img 
                src={rightBatterySrc}
                alt="VIDA Electric Scooter Battery Right" 
                className="batteries-page__battery-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatteriesPage;
