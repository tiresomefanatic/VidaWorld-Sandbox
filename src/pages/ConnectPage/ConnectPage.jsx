import React from 'react';
import './ConnectPage.scss';

const ConnectPage = () => {
  return (
    <div className="connect-page">
      <div className="connect-page__container">
        <div className="connect-page__content">
          <h1 className="connect-page__headline">
            Stay connected with <span className="connect-page__app-name">MY VIDDA app</span> no matter where you are.
          </h1>
          
          <div className="connect-page__divider"></div>
          
          <div className="connect-page__download-buttons">
            <img src="/google_button.svg" alt="Google Play" className="connect-page__download-btn" />
            <img src="/apple_button.svg" alt="App Store" className="connect-page__download-btn" />
          </div>
          
          <div className="connect-page__phones">
            <div className="connect-page__phone connect-page__phone--left">
              <img src="/phone-left.png" alt="Charging Status Interface" className="connect-page__phone-image" />
            </div>
            
            <div className="connect-page__phone connect-page__phone--center">
              <img src="/phone-center.png" alt="Find Chargers Map Interface" className="connect-page__phone-image" />
            </div>
            
            <div className="connect-page__phone connect-page__phone--right">
              <img src="/phone-right.png" alt="Booking Interface" className="connect-page__phone-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
