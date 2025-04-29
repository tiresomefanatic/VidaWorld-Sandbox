import React, { useState } from "react";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const FaqQueries = ({ config }) => {
  const {
    searchIconMob,
    searchIconDesk,
    showSearchBar,
    searchAltTxt,
    searchIconImageTitle,
    searchLabel,
    FaqQueriesContent,
    reDirectLabel,
    reDirectUrl,
    newTab
  } = config;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);

  const handleBoxClick = (index) => {
    setSelectedContentIndex(index);
  };

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div className="faq-queries-container vida-2-container">
      {showSearchBar && (
        <div className="faq-queries-container__search-query-container">
          <div className="search-icon-container">
            <img
              src={isDesktop ? searchIconDesk : searchIconMob}
              alt={searchAltTxt}
              title={searchIconImageTitle}
            />
          </div>
          <input type="text" placeholder={searchLabel} />
        </div>
      )}
      <HorizontalScroll>
        <div className="faq-queries-container__box-container">
          {FaqQueriesContent.map((content, index) => (
            <div
              key={index}
              className={`box-wrapper ${
                index === selectedContentIndex ? "selected" : ""
              }`}
              onClick={() => handleBoxClick(index)}
            >
              <div className="icon-container">
                <img
                  className="icon"
                  src={isDesktop ? content.queryIconDesk : content.queryIconMob}
                  alt={content.queryIconAltText}
                  title={content.queryIconImgTitle}
                />
              </div>
              <div className="description-container">
                <p className="description">{content.queryDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
      <div className="faq-queries-container__content-container">
        <div className="content-wrapper">
          {FaqQueriesContent[selectedContentIndex].faqChildItems.map(
            (item, i) => (
              <div
                className="content-wrapper__content"
                key={i}
                dangerouslySetInnerHTML={{
                  __html: item?.queries
                }}
              ></div>
            )
          )}
        </div>
      </div>
      <div className="read-more-container">
        <a
          className="orange-color-text redirect-anchor"
          href={reDirectUrl}
          target={newTab ? "_blank" : "_self"}
          onClick={(e) => ctaTracking(e)}
          rel="noreferrer"
        >
          {reDirectLabel}
        </a>
      </div>
    </div>
  );
};

FaqQueries.propTypes = {
  config: PropTypes.shape({
    searchIconMob: PropTypes.string,
    searchIconDesk: PropTypes.string,
    showSearchBar: PropTypes.bool,
    searchAltTxt: PropTypes.string,
    searchIconImageTitle: PropTypes.string,
    searchLabel: PropTypes.string,
    FaqQueriesContent: PropTypes.arrayOf(
      PropTypes.shape({
        queryIconMob: PropTypes.string,
        queryIconDesk: PropTypes.string,
        queryIconAltText: PropTypes.string,
        queryIconImgTitle: PropTypes.string,
        queryDescription: PropTypes.string,
        faqChildItems: PropTypes.arrayOf(
          PropTypes.shape({
            queries: PropTypes.string
          })
        )
      })
    ),
    reDirectLabel: PropTypes.string,
    reDirectUrl: PropTypes.string,
    newTab: PropTypes.bool
  })
};
export default FaqQueries;
