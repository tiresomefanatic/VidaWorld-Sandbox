import React from 'react';
import './TeaserFeatureSpecCard.scss';

const TeaserFeatureSpecCard = () => {
  return (
    <section className="teaser-spec-card">
      <img src="/TeaserScooterImage.svg" alt="Modern aesthetics" className="teaser-feature-card__image teaser-feature-card__image--blend" />
      <svg width="1294" height="684" viewBox="0 0 1294 684" fill="none" xmlns="http://www.w3.org/2000/svg" className="teaser-spec-card__spotlight-svg">
        <path opacity="0.6" d="M0.0291608 335.417L1445.41 -163.405L1466.31 -148.158L265.832 949.779L0.0291608 335.417Z" fill="url(#paint0_linear_609_3239)" fillOpacity="0.5"/>
        <defs>
          <linearGradient id="paint0_linear_609_3239" x1="1205.43" y1="3.44599" x2="199.405" y2="1084.21" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="0.687619"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="teaser-spec-card__content">
        <h2 className="teaser-spec-card__heading">Modern aesthetics with<br/>ease of use</h2>
      </div>
    </section>
  );
};

export default TeaserFeatureSpecCard; 