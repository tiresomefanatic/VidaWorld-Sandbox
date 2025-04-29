import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const EVBanner = (props) => {
  const { evBannerContent } = props.config;
  const isTablet = window.matchMedia(
    breakpoints.mediaExpression.tablet
  ).matches;

  // intersection observer
  const { ref: evBannerContainerRef, isVisible: evBannerContainerVisible } =
    useIntersectionObserver();

  return (
    <div
      className="ev-banner-pt-container"
      ref={evBannerContainerRef}
      style={{ opacity: evBannerContainerVisible ? 1 : 0 }}
    >
      <div
        className="ev__container"
        style={{
          backgroundImage: `url(${
            isTablet
              ? evBannerContent.desktopBackgroundImg
              : evBannerContent.mobileBackgroundImg
          })`
        }}
        role="img"
        aria-label={evBannerContent?.backgroundImgAlt}
        title={evBannerContent?.backgroundImgTitle}
      >
        <div className="vida-2-container">
          <div className="ev__right-bg">
            <img src={evBannerContent.bannerTopRightImage} loading="lazy"></img>
          </div>
          <div className="ev__explore-content">
            <div className="ev__expore-icon">
              <img src={evBannerContent.exporeIcon}></img>
            </div>
            <p className="ev__explore-label">{evBannerContent.exploreLabel}</p>
          </div>
          <h2 className="ev__header">{evBannerContent.header}</h2>
          <div className="ev__desc-container">
            <p className="ev__desc">{evBannerContent.description1}</p>
            <p className="ev__desc">{evBannerContent.description2}</p>
          </div>
          <a
            className="ev__link"
            href={evBannerContent.howVidaLink}
            target={evBannerContent.isNewTab ? "_blank" : "_self"}
            rel="noreferrer"
          >
            {evBannerContent.howVidaLabel}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EVBanner;
EVBanner.propTypes = {
  config: PropTypes.shape({
    evBannerContent: PropTypes.shape({
      desktopBackgroundImg: PropTypes.string,
      mobileBackgroundImg: PropTypes.string,
      bannerTopRightImage: PropTypes.string,
      exporeIcon: PropTypes.string,
      exploreLabel: PropTypes.string,
      header: PropTypes.string,
      description1: PropTypes.string,
      description2: PropTypes.string,
      howVidaLink: PropTypes.string,
      howVidaLabel: PropTypes.string,
      isNewTab: PropTypes.bool,
      backgroundImgAlt: PropTypes.string,
      backgroundImgTitle: PropTypes.string
    })
  })
};
