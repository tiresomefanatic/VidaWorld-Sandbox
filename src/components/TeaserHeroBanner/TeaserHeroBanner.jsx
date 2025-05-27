import React from 'react';
import './TeaserHeroBanner.scss';

const TeaserHeroBanner = ({ bannerText }) => {
  if (!bannerText) return null;

  // Create the text content with dots
  const createTextContent = () => {
    return Array(30).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        <span className="teaser-hero-banner__text">{bannerText}</span>
        <span className="teaser-hero-banner__dot">&middot;</span>
      </React.Fragment>
    ));
  };

  return (
    <div className="teaser-hero-banner">
      <div className="teaser-hero-banner__content">
        <div className="teaser-hero-banner__scroll">
          {createTextContent()}
          {createTextContent()}
        </div>
      </div>
    </div>
  );
};

export default TeaserHeroBanner;