import React, { useState } from 'react';
import './TeaserHero.scss';

const TeaserHero = ({ teaserData }) => {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <div className="teaser teaser--dark">
      <div className="teaser__hero">
        <div className="teaser__image-container">
          <img 
            src="/TeaserHeroFull4.jpg" 
            alt={teaserData.heading} 
            className={`teaser__image${ctaHovered ? ' teaser__image--faded' : ''}`} 
          />
        </div>
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
      </div>
    </div>
  );
};

export default TeaserHero; 