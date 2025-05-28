import React from 'react';
import './TeaserSecondFold.scss';

const TeaserSecondFold = ({ heading, subheading, image }) => {
  return (
    <div className="teaser-second-fold">
      <div className="teaser-second-fold__content">
        <h1 className="teaser-second-fold__heading">
          {heading.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx !== heading.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <h2 className="teaser-second-fold__subheading">
          {subheading.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx !== subheading.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
      <img 
        src={image} 
        alt="Teaser Second Fold" 
        className="teaser-second-fold__image"
      />
      <div className="teaser-footer-banner">
        <div className="teaser-footer-banner__marquee">
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={i}>
              <img src="/FooterText.svg" alt="VIDA VX2" className="teaser-footer-banner__text" />
              <img src="/HeartFooter.svg" alt="Heart" className="teaser-footer-banner__icon" />
            </React.Fragment>
          ))}
          {/* Duplicate for seamless loop */}
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={`dup-${i}`}>
              <img src="/FooterText.svg" alt="VIDA VX2" className="teaser-footer-banner__text" />
              <img src="/HeartFooter.svg" alt="Heart" className="teaser-footer-banner__icon" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default TeaserSecondFold;