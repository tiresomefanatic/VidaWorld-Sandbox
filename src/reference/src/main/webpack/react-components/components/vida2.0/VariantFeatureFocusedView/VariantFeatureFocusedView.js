import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const VariantFeatureFocusedView = ({ config }) => {
  const { aboutText, VariantFocusedViewContent } = config;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: variantFeatureContainerRef,
    isVisible: variantFeatureContainerVisible
  } = useIntersectionObserver(0.1);

  return (
    <div
      className="variant-focused-view-container vida-2-container"
      ref={variantFeatureContainerRef}
      style={{ opacity: variantFeatureContainerVisible ? 1 : 0 }}
    >
      {VariantFocusedViewContent.map((item, index) => {
        const cardStyle = {
          color: item?.cardTextColor
        };

        return (
          <div
            style={cardStyle}
            key={index}
            className={`variant-focused-view-container__${item?.cardNumber}-container`}
          >
            <div className={`${item?.cardNumber}-text-container`}>
              {index === 0 && (
                <p
                  style={{ color: item?.cardTextColor }}
                  className="about-text"
                >
                  {aboutText}
                </p>
              )}
              <p style={{ color: item?.cardTextColor }} className="header-text">
                {item?.header}
              </p>
              <p
                style={{ color: item?.cardTextColor }}
                className="about-scooter-text"
              >
                {item?.content}
              </p>
            </div>
            <div className={`${item?.cardNumber}-img-container`}>
              <img
                className="scooty-image"
                src={isDesktop ? item?.desktopImg : item?.mobileImg}
                alt={item?.bikeImgAlt || "img-five"}
                title={item?.bikeImgTitle}
                loading="lazy"
              />

              {item?.isHeadLight && (
                <img
                  className="head-light-img"
                  src={
                    isDesktop
                      ? item?.headLightImgDesktop
                      : item?.headLightImgMobile
                  }
                  alt="head-light-img"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantFeatureFocusedView;

VariantFeatureFocusedView.propTypes = {
  config: PropTypes.shape({
    aboutText: PropTypes.string,

    VariantFocusedViewContent: PropTypes.arrayOf(
      PropTypes.shape({
        header: PropTypes.string,
        content: PropTypes.string,
        mobileImg: PropTypes.string,
        desktopImg: PropTypes.string,
        headLightImgMobile: PropTypes.string,
        headLightImgDesktop: PropTypes.string,
        cardNumber: PropTypes.string,
        cardTextColor: PropTypes.string,
        cardBgColor: PropTypes.string,
        isHeadLight: PropTypes.bool,
        bikeImgAlt: PropTypes.string,
        bikeImgTitle: PropTypes.string
      })
    )
  })
};
