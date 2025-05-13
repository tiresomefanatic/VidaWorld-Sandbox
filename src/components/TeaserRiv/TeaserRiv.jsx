import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TeaserRiv.scss';
import { Link } from 'react-router-dom';

const TeaserRiv = ({ 
  heading,
  subheading,
  ctaText,
  ctaAction,
  image,
  bannerText,
  features,
  backgroundColor = 'dark',
  productName = 'Vida VX2 with RIV'
}) => {
  const [ctaHovered, setCtaHovered] = useState(false);
  return (
    <div className={`teaser-riv teaser-riv--${backgroundColor}`}>
      <div className="teaser-riv__breadcrumb">
        <Link to="/" className="teaser-riv__breadcrumb-link">Home</Link>
        <span className="teaser-riv__breadcrumb-separator">›</span>
        <span className="teaser-riv__breadcrumb-current">{productName}</span>
      </div>
      
      <div className="teaser-riv__hero">
        <div className="teaser-riv__content">
          <h1 className="teaser-riv__heading">{heading}</h1>
          <p className="teaser-riv__subheading">{subheading}</p>
          
          {ctaText && (
            <button 
              className="teaser-riv__cta" 
              onClick={ctaAction}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
            >
              {ctaText}
            </button>
          )}
        </div>
        
        {image && (
          <div className="teaser-riv__image-container">
            <img 
              src={image} 
              alt={heading} 
              className={`teaser-riv__image${ctaHovered ? ' teaser-riv__image--faded' : ''}`}
              width="100%"
              height="auto"
            />
          </div>
        )}
      </div>
      
      {bannerText && (
        <div className="teaser-riv__banner">
          <div className="teaser-riv__banner-content">
            {Array(15).fill(bannerText).map((text, index) => (
              <span key={index} className="teaser-riv__banner-text">{text}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TeaserRiv.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  ctaText: PropTypes.string,
  ctaAction: PropTypes.func,
  image: PropTypes.string,
  bannerText: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.string
    })
  ),
  backgroundColor: PropTypes.oneOf(['dark', 'light']),
  productName: PropTypes.string
};

export default TeaserRiv; 