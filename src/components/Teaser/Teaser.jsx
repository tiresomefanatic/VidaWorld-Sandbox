import React from 'react';
import PropTypes from 'prop-types';
import './Teaser.scss';
import { Link } from 'react-router-dom';

const Teaser = ({ 
  heading,
  subheading,
  ctaText,
  ctaAction,
  image,
  bannerText,
  features,
  backgroundColor = 'dark',
  productName = 'Vida VX2'
}) => {
  return (
    <div className={`teaser teaser--${backgroundColor}`}>
      <div className="teaser__breadcrumb">
        <Link to="/" className="teaser__breadcrumb-link">Home</Link>
        <span className="teaser__breadcrumb-separator">›</span>
        <span className="teaser__breadcrumb-current">{productName}</span>
      </div>
      
      <div className="teaser__hero">
        <div className="teaser__content">
          <h1 className="teaser__heading">{heading}</h1>
          <p className="teaser__subheading">{subheading}</p>
          
          {ctaText && (
            <button 
              className="teaser__cta" 
              onClick={ctaAction}
            >
              {ctaText}
            </button>
          )}
        </div>
        
        {image && (
          <div className="teaser__image-container">
            <img 
              src={image} 
              alt={heading} 
              className="teaser__image"
              width="100%"
              height="auto"
            />
          </div>
        )}
      </div>
      
     
      
      {bannerText && (
        <div className="teaser__banner">
          <div className="teaser__banner-content">
            {Array(15).fill(bannerText).map((text, index) => (
              <span key={index} className="teaser__banner-text">{text}</span>
            ))}
          </div>
        </div>
      )}
      
    
    </div>
  );
};

Teaser.propTypes = {
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

export default Teaser; 