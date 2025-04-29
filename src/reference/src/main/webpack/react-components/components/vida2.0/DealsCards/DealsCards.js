import React, { useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const DealsCards = ({ dealsCardsContent, seeMoreText, seeLessText }) => {
  const [dealsCardsCount, setdealsCardsCount] = useState(
    dealsCardsContent?.length
  );
  const [defaultItems, setDefaultItems] = useState(2);
  const [seeMoreItems, setSeeMoreItems] = useState(false);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const pagePath = window.location.pathname;
  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const showMoreItems = () => {
    setSeeMoreItems(!seeMoreItems);
  };

  return (
    <div className="deals-cards-wrapper">
      <div className="deals-cards-main-container">
        {dealsCardsContent
          ?.slice(0, seeMoreItems ? dealsCardsCount : defaultItems)
          ?.map((item, index) => (
            <div className="deals-cards-parent-container" key={index}>
              <div className="deals-cards-container">
                <img
                  className="deals-cards-bg-img"
                  src={
                    isDesktop ? item?.cardDesktopBgImg : item?.cardMobileBgImg
                  }
                  alt={item?.backgroundImageAltText}
                  title={item?.backgroundImageTitle}
                ></img>
                <div className="deals-cards-content-container">
                  <div className="deals-cards-img-container">
                    <img
                      src={
                        isDesktop
                          ? item?.cardDesktopImg
                          : item?.cardMobileImg
                          ? item?.cardMobileImg
                          : item?.cardDesktopImg
                      }
                      alt={item?.imageAltText}
                      title={item?.imageTitle}
                    ></img>
                  </div>
                  <div className="deals-cards-flex-container">
                    <div className="deals-cards-title">
                      {item?.cardTitleText &&
                        (pagePath.includes("offer") ? (
                          <h3 className="deals-cards-title-text">
                            {item?.cardTitleText}
                          </h3>
                        ) : (
                          <p className="deals-cards-title-text">
                            {item?.cardTitleText}
                          </p>
                        ))}
                    </div>
                    <div className="deals-cards-redirection-cta">
                      <a
                        className="deals-cards-redirection-link"
                        href={item?.navLink}
                        target={item?.newTab ? "_blank" : "_self"}
                        rel="noreferrer"
                      >
                        <img
                          src={item?.redirectionIcon}
                          alt={item?.redirectImageAltText}
                          title={item?.redirectImageTitle}
                        ></img>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {dealsCardsContent?.length > 2 && (
        <div className="see-more-text-container" onClick={showMoreItems}>
          <p className="see-more-text" onClick={(e) => ctaTracking(e)}>
            {seeMoreItems ? seeLessText : seeMoreText}
          </p>
        </div>
      )}
    </div>
  );
};

export default DealsCards;

DealsCards.propTypes = {
  dealsCardsContent: PropTypes.arrayOf(PropTypes.any),
  seeMoreText: PropTypes.string,
  seeLessText: PropTypes.string
};
