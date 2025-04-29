import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const FeatureImgCardSlider = ({ config }) => {
  const { preTitle, title } = config;
  let { sliderConfig } = config;

  sliderConfig = JSON.parse(sliderConfig);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const tns_slider = useRef(null);

  useLayoutEffect(() => {
    const slider = setTimeout(() => {
      tns({
        container: tns_slider.current,
        loop: false,
        items: 3,
        page: 1,
        slideBy: 1,
        nav: true,
        autoplay: false,
        speed: 1000,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        controls: false,
        navPosition: "bottom",
        responsive: {
          360: {
            items: 1
          },
          1024: {
            items: 1
          }
        }
      });
    }, 500);

    return () => clearTimeout(slider);
  }, [sliderConfig]);

  return (
    <div>
      <div className="vida-2-container feature-card-slider-container ">
        <div className="feature-card-slider-container__header-container">
          <p className="pre-title">{preTitle}</p>
          <p className="title">{title}</p>
        </div>

        <div
          className="feature-card-slider-container__carousel-slider"
          ref={tns_slider}
        >
          {sliderConfig.map((content, index) => (
            <div key={index} className="slider-parent-container">
              {content?.assetType === "image" && (
                <div className="img-container">
                  <img
                    src={
                      isDesktop ? content?.imageDesktop : content?.imageMobile
                    }
                    alt={content?.imagealttext}
                    title={content?.imageTitle}
                    loading="lazy"
                  />
                </div>
              )}
              {content?.assetType === "video" && (
                <div className="video-container">
                  <video
                    src={
                      isDesktop ? content?.videoDesktop : content?.videoMobile
                    }
                    muted
                    loop
                    autoPlay
                  />
                </div>
              )}
              <div className="slider-card-container">
                <div className="slider-bg-img-container">
                  <img
                    src={
                      isDesktop
                        ? content?.cardBgImgDesktop
                        : content?.cardBgImgMobile
                    }
                    alt={content?.cardBgImgAlt}
                    title={content?.cardBgImgTitle}
                    loading="lazy"
                  />
                </div>

                <div className="slider-card-container__icon-container">
                  <img
                    src={
                      isDesktop
                        ? content?.badgeIconDesktop
                        : content?.badgeIconMobile
                    }
                    alt={content?.altIconTxt}
                    title={content?.badgeIconTitle}
                  />
                </div>
                <div className="slider-card-container__text-container">
                  <p className="card-text">{content?.cardText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureImgCardSlider;

FeatureImgCardSlider.propTypes = {
  config: PropTypes.shape({
    preTitle: PropTypes.string,
    title: PropTypes.string,
    sliderConfig: PropTypes.string
  })
};
