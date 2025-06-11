import React, { useEffect, useRef } from 'react';
import './TeaserSecondFold.scss';

const TeaserSecondFold = ({ heading, subheading, bgImg, Ray1Img, Ray2Img, VidaVX2Img, HeartIconImg }) => {
  const imageRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (parentRef.current) {
            if (entry.isIntersecting) {
              parentRef.current.classList.add('teaser-second-fold--visible');
            } else {
              parentRef.current.classList.remove('teaser-second-fold--visible');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    const currentImage = imageRef.current;
    if (currentImage) {
      observer.observe(currentImage);
    }

    return () => {
      if (currentImage) {
        observer.unobserve(currentImage);
      }
    };
  }, []);

  return (
    <div className="teaser-second-fold" ref={parentRef}>
      <div className="teaser-second-fold__content">
        <h1 className="teaser-second-fold__heading">
          {heading.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx !== heading.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <h2 className="teaser-second-fold__subheading">
          {subheading.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx !== subheading.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>
      <div className="teaser-second-fold__spotlight-wrapper">
       
        <img 
          src={Ray1Img} 
          alt="Spotlight 1" 
          className="teaser-second-fold__spotlight teaser-second-fold__spotlight--8"
        />
        <img 
          src={Ray2Img} 
          alt="Spotlight 2" 
          className="teaser-second-fold__spotlight teaser-second-fold__spotlight--10"
        />
      </div>
      <img 
        ref={imageRef}
        src={bgImg} 
        alt="Teaser Second Fold" 
        className="teaser-second-fold__image"
      />
      <div className="teaser-footer-banner">
        <div className="teaser-footer-banner__marquee">
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={i}>
              <img src={VidaVX2Img} alt="VIDA VX2" className="teaser-footer-banner__text" />
              <img src={HeartIconImg} alt="Heart" className="teaser-footer-banner__icon" />
            </React.Fragment>
          ))}
          {/* Duplicate for seamless loop */}
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={`dup-${i}`}>
              <img src={VidaVX2Img} alt="VIDA VX2" className="teaser-footer-banner__text" />
              <img src={HeartIconImg} alt="Heart" className="teaser-footer-banner__icon" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeaserSecondFold;