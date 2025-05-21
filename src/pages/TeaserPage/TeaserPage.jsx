import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeaserPage.scss';
import VelocityScroll from "../../components/VelocityScroll/VelocityScroll";

const TeaserPage = () => {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (pageRef.current) {
        setScrollPosition(Math.round(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teaserData = {
    heading: 'The Future of Urban Movement',
    subheading: 'The all new VX2 starting from *****',
    ctaText: 'Notify Me',
    ctaAction: () => console.log('CTA clicked'),
    image: '/TeaserBannerFull.png',
    bannerText: 'LAUNCHING THIS JULY',
    backgroundColor: 'dark',
    productName: 'Vida VX2',
  };

  return (
    <div
      ref={pageRef}
      className="teaser-page"
      style={{
        width: '100%',
        minHeight: '100%',
        background: '#000'
      }}
    >
      <div className="teaser teaser--dark">
        <div className="teaser__breadcrumb">
          <Link to="/" className="teaser__breadcrumb-link">Home</Link>
          <span className="teaser__breadcrumb-separator">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2L11 8L5 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="teaser__breadcrumb-current">{teaserData.productName}</span>
        </div>
        
        <div className="teaser__hero">
          <div className="teaser__content">
            <h1 className="teaser__heading">{teaserData.heading}</h1>
            <p className="teaser__subheading">{teaserData.subheading}</p>
            
            {teaserData.ctaText && (
              <button 
                className="teaser__cta" 
                onClick={teaserData.ctaAction}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                {teaserData.ctaText}
              </button>
            )}
          </div>
          
          {teaserData.image && (
            <div className="teaser__image-container">
              <img 
                src={teaserData.image} 
                alt={teaserData.heading} 
                className={`teaser__image${ctaHovered ? ' teaser__image--faded' : ''}`}
                width="100%"
                height="auto"
              />
            </div>
          )}
          
          {teaserData.bannerText && (
            <div className="teaser__banner">
              <div className="teaser__banner-content">
                {[...Array(2)].map((_, j) =>
                  Array(40).fill(teaserData.bannerText).map((text, i) => (
                    <span key={j + '-' + i} className="teaser__banner-text">{text}</span>
                  ))
                )}
              </div>
            </div>
          )}
        
        </div>
      </div>
      <div className="teaser-page__container">
        {/* Top Feature Block */}
        <section className="teaser-feature-block">
          <img src="/TeaserScooterImage.svg" alt="Modern aesthetics" className="teaser-feature-card__image teaser-feature-card__image--blend" />
          <svg width="1294" height="684" viewBox="0 0 1294 684" fill="none" xmlns="http://www.w3.org/2000/svg" className="teaser-feature-block__spotlight-svg">
            <path opacity="0.6" d="M0.0291608 335.417L1445.41 -163.405L1466.31 -148.158L265.832 949.779L0.0291608 335.417Z" fill="url(#paint0_linear_609_3239)" fillOpacity="0.5"/>
            <defs>
              <linearGradient id="paint0_linear_609_3239" x1="1205.43" y1="3.44599" x2="199.405" y2="1084.21" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="0.687619"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="teaser-feature-block__content">
            <h2 className="teaser-feature-block__heading">Modern aesthetics with<br/>ease of use</h2>
          </div>
        </section>
        {/* Feature Cards */}
        <section className="teaser-feature-cards">
          <div className="teaser-feature-card">
            <div className="teaser-feature-card__title">Removable battery</div>
          </div>
          <div className="teaser-feature-card">
            <div className="teaser-feature-card__title">BAAS</div>
          </div>
        </section>
        {/* Orange Text */}
        <div className="teaser-feature-orange-text">
          <div className="teaser-feature-orange-text__marquee">
            {[...Array(2)].map((_, j) =>
              Array(8).fill(null).map((_, i) => (
                <React.Fragment key={j + '-' + i}>
                  VIDA VX2 <span className="teaser-feature-orange-text__icon"><img src="/marqueeLightningIcon.svg" alt="Lightning Icon" className="teaser-feature-orange-text__icon-img" /></span>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
        {/* Footer Section */}
        <footer className="teaser-footer">
          <div className="teaser-footer__columns">
            <div className="teaser-footer__column teaser-footer__column--brand">
              <div className="teaser-footer__brand">VIDA</div>
              <div className="teaser-footer__desc">Electric Scooters in India</div>
            </div>
            <div className="teaser-footer__column">
              <div className="teaser-footer__heading">Try</div>
              <div className="teaser-footer__item">Reserve a VX2</div>
              <div className="teaser-footer__item">Test Ride</div>
              <div className="teaser-footer__item">VX2 Lite</div>
              <div className="teaser-footer__item">VX2 Plus</div>
              <div className="teaser-footer__item">VX2 Pro</div>
            </div>
            <div className="teaser-footer__column">
              <div className="teaser-footer__heading">Buy</div>
              <div className="teaser-footer__item">Subscription</div>
              <div className="teaser-footer__item">Savings Calculator</div>
              <div className="teaser-footer__item">Offers</div>
            </div>
            <div className="teaser-footer__column">
              <div className="teaser-footer__heading">Love</div>
              <div className="teaser-footer__item">Miles Map</div>
              <div className="teaser-footer__item">VX2 Community</div>
            </div>
            <div className="teaser-footer__column">
              <div className="teaser-footer__heading">Explore</div>
              <div className="teaser-footer__item">Accessories</div>
              <div className="teaser-footer__item">Charging Network</div>
              <div className="teaser-footer__item">Charging Locator</div>
            </div>
            <div className="teaser-footer__column">
              <div className="teaser-footer__heading">Support</div>
              <div className="teaser-footer__item">About Us</div>
              <div className="teaser-footer__item">Contact Us</div>
            </div>
          </div>
        </footer>
      </div>
      <div className="scroll-position">
        Scroll: {scrollPosition}px
      </div>
    </div>
  );
};

export default TeaserPage;