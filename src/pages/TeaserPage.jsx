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
    </div>
  );
};

export default TeaserPage; 