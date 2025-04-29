import { any } from "prop-types";
import PropTypes from "prop-types";
import React, { useState } from "react";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const FaqCard = ({ config }) => {
  const {
    dataPosition,
    faqIcon,
    faqTitle,
    faqArrowIcon,
    reDirectLink,
    reDirectLabel,
    newTab,
    faqContent
  } = config;

  // intersection observer
  const { ref: faqCardContainerRef, isVisible: faqCardContainerVisible } =
    useIntersectionObserver(0.5);

  const {
    ref: faqCardContainerOpenedRef,
    isVisible: faqCardContainerOpenedVisible
  } = useIntersectionObserver(0.001);

  const [readMoreClicked, setReadMoreClicked] = useState(false);

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

  const handleContainerClick = () => {
    setReadMoreClicked(!readMoreClicked);
  };

  return (
    <div className="faq-card">
      <div className="faq-card__container vida-2-container">
        <div
          className={`faq-card__wrapper ${readMoreClicked ? "open" : ""}`}
          ref={
            readMoreClicked ? faqCardContainerOpenedRef : faqCardContainerRef
          }
          style={{
            opacity: readMoreClicked
              ? faqCardContainerOpenedVisible
                ? 1
                : 1
              : faqCardContainerVisible
              ? 1
              : 0
          }}
        >
          <div
            className={`faq-card__header-container ${
              readMoreClicked ? "open" : ""
            }`}
            onClick={() => {
              handleContainerClick();
            }}
          >
            <div className="faq-icon-header-wrapper">
              <div className="faq-icon-container">
                <img src={faqIcon} alt="faq-icon" aria-label="faq-icon" />
              </div>
              <h2 className="faq-header">{faqTitle}</h2>
            </div>
            <div className="faq-dropdown-arrow">
              <a>
                <img
                  src={faqArrowIcon}
                  alt="drop-down-arrow"
                  aria-label="drop-down-arrow"
                  className="drop-down-arrow"
                />
              </a>
            </div>
          </div>
          {readMoreClicked && (
            <div className="faq-card__content-container">
              <div className="content-container">
                <div
                  className="content-container__content"
                  dangerouslySetInnerHTML={{
                    __html: faqContent
                  }}
                ></div>
              </div>
            </div>
          )}
          <div
            className={`read-more-container ${readMoreClicked ? "open" : ""}`}
          >
            <a
              href={reDirectLink}
              target={newTab ? "_blank" : "_self"}
              className="orange-color-text redirect-anchor"
              data-link-position={dataPosition || "faqCard"}
              onClick={(e) => ctaTracking(e)}
              rel="noreferrer"
            >
              {reDirectLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqCard;

FaqCard.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    faqIcon: PropTypes.string,
    faqTitle: PropTypes.string,
    faqArrowIcon: PropTypes.string,
    reDirectLink: PropTypes.string,
    reDirectLabel: PropTypes.string,
    newTab: PropTypes.bool,
    faqContent: PropTypes.string
  })
};
