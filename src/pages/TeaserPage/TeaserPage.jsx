import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeaserPage.scss';
import TeaserHero from '../../components/TeaserHero/TeaserHero';
import TeaserHeroBanner from '../../components/TeaserHeroBanner/TeaserHeroBanner';
import TeaserSecondFold from '../../components/TeaserSecondFold/TeaserSecondFold';
import TeaserFooterBanner from '../../components/TeaserFooterBanner/TeaserFooterBanner';
import { VelocityScroll } from '../../components/VelocityScroll/VelocityScroll';

const TeaserPage = () => {
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
    heading: 'Not just a scooter, Not just an EV',
    subheading: 'The biggest debate of all time ends here',
    ctaText: 'Notify Me',
    ctaAction: () => console.log('CTA clicked'),
    image: '/TeaserHeroFull2.png',
    bannerText: 'LAUNCHING THIS JULY · ',
    backgroundColor: 'dark',
    productName: 'Vida VX2',
  };

  const secondFoldData = {
    heading: `The wait will be worth it.\nGet ready for something big.`,
    subheading: `From cutting-edge design to effortless performance, this is\nthe future of urban movement. And it's coming fast. \nClear your schedule - the ride of your life is about to begin.`,
    image: '/TeaserSecondFold.png',
  };

  return (
    <div
      ref={pageRef}
      // className="teaser-page"
    >
      {/* Teaser Breadcrumb Section Starts */}
      <div className="teaser__breadcrumb">
        <Link to="/" className="teaser__breadcrumb-link">Home</Link>
        <span className="teaser__breadcrumb-separator">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 2L11 8L5 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="teaser__breadcrumb-current">{teaserData.productName}</span>
      </div>
      {/* Teaser Breadcrumb Section Ends */}

     
      {/* Teaser Hero Section */}
      {/* <div className="teaser-hero-section"> */}
        <TeaserHero teaserData={teaserData} />
        <TeaserHeroBanner bannerText={teaserData.bannerText} />
      {/* </div> */}

      {/* <div className="teaser-page__container"> */}
        {/* Teaser Feature Spec Card Section */}
        <TeaserSecondFold {...secondFoldData} />

        {/* Teaser Footer Banner Section */}
        {/* <TeaserFooterBanner /> */}

        {/* Footer Section Starts */}
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
        {/* Footer Section Ends */}
      {/* </div> */}
      <div className="scroll-position">
        Scroll: {scrollPosition}px
      </div>
    </div>
  );
};

export default TeaserPage;