import React from 'react';
import Teaser from '../components/Teaser/Teaser';
import './TeaserPage.scss';

const teaserData = {
  heading: 'The Future of Urban Movement',
  subheading: 'The all new VX2 starting from *****',
  ctaText: 'Notify Me',
  ctaAction: () => console.log('CTA clicked'),
  image: '/TeaserBanner.png',
  bannerText: 'LAUNCHING THIS JULY',
  backgroundColor: 'dark',
  productName: 'Vida VX2',
};

const TeaserPage = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100%',
        background: '#000',
      }}
    >
      <Teaser {...teaserData} />
      <div className="teaser-page__container">
        {/* Top Feature Block */}
        <section className="teaser-feature-block">
          <div className="teaser-feature-block__content">
            <h2 className="teaser-feature-block__heading">Modern aesthetics with<br/>ease of use</h2>
            <img src="/TeaserBanner.png" alt="Scooter" className="teaser-feature-block__image" />
            <div className="teaser-feature-block__spotlight" />
          </div>
        </section>
        {/* Feature Cards */}
        <section className="teaser-feature-cards">
          <div className="teaser-feature-card">
            <div className="teaser-feature-card__title">Removable battery</div>
            <div className="teaser-feature-card__image-placeholder" />
          </div>
          <div className="teaser-feature-card">
            <div className="teaser-feature-card__title">BAAS</div>
            <div className="teaser-feature-card__image-placeholder" />
          </div>
        </section>
        {/* Orange Text */}
        <div className="teaser-feature-orange-text">
          VIDA VX2 <span className="teaser-feature-orange-text__icon">⚡</span> VIDA
        </div>
      </div>
    </div>
  );
};

export default TeaserPage; 