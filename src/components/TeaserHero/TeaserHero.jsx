import React, { useState, useEffect, useMemo } from 'react';
import './TeaserHero.scss';
import PropTypes from 'prop-types';

const TeaserHero = (props) => {
  const {
    heading,
    subheading,
    ctaText,
    bgImgDes,
    bgImgMob,
    bgImgTab,
    webPopupConfig
  } = props.config || props;

  const [ctaHovered, setCtaHovered] = useState(false);
  const [showPIIForm, setShowPIIForm] = useState(false);

  // Detect touchscreen capability
  const isTouchDevice = useMemo(() => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  // Auto-trigger brightness effect for touch devices on mount
  useEffect(() => {
    if (isTouchDevice) {
      const timer = setTimeout(() => {
        setCtaHovered(true);
      }, 500); // 500ms delay for better visual effect

      return () => clearTimeout(timer);
    }
  }, [isTouchDevice]);

  const notifyClickHandler = () => {
    // For sandbox - you can customize this action
    if (props.ctaAction) {
      props.ctaAction();
    }
    
    // If webPopupConfig exists, handle popup
    if (webPopupConfig) {
      setShowPIIForm(true);
    }
  };

  const handleClosePopup = () => {
    setShowPIIForm(false);
  };

  // Mobile-first breakpoint detection
  const isTablet = window.matchMedia("(min-width: 768px)").matches;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  // Image selection logic (mobile-first)
  let selectedImage = bgImgMob || "/TeaserHeroFull4.jpg"; // Default: mobile image or fallback
  if (isDesktop && bgImgDes) {
    selectedImage = bgImgDes; // Desktop: 1024px+
  } else if (isTablet && bgImgTab) {
    selectedImage = bgImgTab; // Tablet: 768px-1023px
  }
  // Mobile: < 768px (uses default bgImgMob)

  // Conditional event handlers - only add hover events for non-touch devices
  const ctaEventHandlers = isTouchDevice
    ? {}
    : {
        onMouseEnter: () => setCtaHovered(true),
        onMouseLeave: () => setCtaHovered(false)
      };

  return (
    <div className="teaser teaser--dark">
      <div className="teaser__hero">
        <div className="teaser__image-container">
          <img
            src={selectedImage}
            alt={heading}
            className={`teaser__image${
              ctaHovered ? " teaser__image--faded" : ""
            }`}
          />
        </div>
        <div className="teaser__content">
          <h1 className="teaser__heading">{heading}</h1>
          <p className="teaser__subheading">{subheading}</p>

          {ctaText && (
            <button
              className="teaser__cta"
              onClick={notifyClickHandler}
              {...ctaEventHandlers}
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
      {/* Placeholder for TeaserInfoForm - you can add this component when needed */}
      {showPIIForm && webPopupConfig && (
        <div className="popup-placeholder">
          {/* TeaserInfoForm would go here */}
          <div style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            zIndex: 1000
          }}>
            <p>Popup would appear here</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

TeaserHero.propTypes = {
  config: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string.isRequired,
    ctaText: PropTypes.string,
    webPopupConfig: PropTypes.object,
    bgImgDes: PropTypes.string,
    bgImgMob: PropTypes.string,
    bgImgTab: PropTypes.string
  }),
  // Legacy props for backward compatibility
  heading: PropTypes.string,
  subheading: PropTypes.string,
  ctaText: PropTypes.string,
  ctaAction: PropTypes.func,
  bgImgDes: PropTypes.string,
  bgImgMob: PropTypes.string,
  bgImgTab: PropTypes.string
};

export default TeaserHero; 