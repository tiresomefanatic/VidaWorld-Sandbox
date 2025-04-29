import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const DealershipLocator = (props) => {
  const { config } = props;

  // intersection observer
  const {
    ref: dealershipLocatorContainerRef,
    isVisible: dealershipLocatorContainerVisible
  } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };
  const HeadingTag = window.location.pathname.includes("vida-v1")
    ? "h2"
    : "span";

  return (
    <div className="dealership-locator-wrapper vida-2-container">
      <div
        className="dealership-locator-container"
        ref={dealershipLocatorContainerRef}
        style={{ opacity: dealershipLocatorContainerVisible ? 1 : 0 }}
      >
        <div className="dealership-locator-title-container">
          <div className="dealership-locator-secondary-text">
            <p>{config.dealershipSecondaryText}</p>
          </div>
          <HeadingTag className="dealership-locator-primary-text">
            {config.dealershipPrimaryText}
          </HeadingTag>
        </div>
        <div className="dealership-locator-card-container">
          <div className="dealership-locator-card-content-container">
            <div className="dealership-locator-search-icon">
              <img src={config.dealershipCardIcon} alt="search_icon"></img>
            </div>
            <div className="dealership-locator-card-primary-text">
              <p>{config.dealershipCardPrimaryText}</p>
            </div>
            <div className="dealership-locator-card-secondary-text">
              <p>{config.dealershipCardSecondaryText}</p>
            </div>
          </div>
          <div className="dealership-locator-card-button-container">
            <a
              className="locate-now-btn"
              href={config.dealershipBtnNavLink}
              data-link-position={config.dataPosition || "dealershipLocator"}
              onClick={(e) => ctaTracking(e)}
              target={config.newTab ? "_blank" : "_self"}
              rel="noreferrer"
            >
              {config.dealershipCardBtnText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealershipLocator;

DealershipLocator.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    dealershipPrimaryText: PropTypes.string,
    dealershipSecondaryText: PropTypes.string,
    dealershipCardIcon: PropTypes.string,
    dealershipCardPrimaryText: PropTypes.string,
    dealershipCardSecondaryText: PropTypes.string,
    dealershipCardBtnText: PropTypes.string,
    dealershipBtnNavLink: PropTypes.string,
    newTab: PropTypes.bool
  })
};
