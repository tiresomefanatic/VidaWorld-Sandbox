import React, { useLayoutEffect, useRef } from "react";
import PropTypes, { any } from "prop-types";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const FeatureImgCardSlider = ({ config }) => {
  const { preTitle, title, description, descriptionTitle } = config;
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
        gutter: 20,
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
    <div className="brand-slider-description-wrapper vida-2-container">
      <div className="image-detail-specification-container__header-container">
        <p className="pre-title">{preTitle}</p>
        <p className="title">{title}</p>
      </div>
      <div className="image-detail-specification-container__slider-description-wrapper">
        <div
          className="image-detail-specification-container__slider-description-wrapper__carousel-slider"
          ref={tns_slider}
        >
          {sliderConfig.map((content, index) => (
            <div key={index} className="slider-parent-container">
              <div className="img-container">
                <img
                  src={isDesktop ? content?.imgDesktop : content?.imgMobile}
                  alt={content?.altImageText}
                  title={content?.imageTitle}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="description-wrapper">
          <div className="description-wrapper__description-container-left">
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionTitle
              }}
            ></div>
          </div>
          {/* {descriptions?.map((content, index) => ( */}
          <div className="description-wrapper__description-container">
            <div
              dangerouslySetInnerHTML={{
                __html: description
              }}
            ></div>
          </div>
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
    sliderConfig: PropTypes.string,
    descriptionTitle: PropTypes.string,
    description: PropTypes.string
  })
};
