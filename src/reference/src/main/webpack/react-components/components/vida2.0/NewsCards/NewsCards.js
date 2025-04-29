import React from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const NewsCards = (props) => {
  const { newslabel, newsHeader, dataPosition } = props.config;
  let { newsCardContent } = props.config;
  newsCardContent = JSON.parse(newsCardContent);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  // intersection observer
  const {
    ref: loveNewsCardContainerRef,
    isVisible: loveNewsCardContainerVisible
  } = useIntersectionObserver();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition,
        ctaLink:
          e?.target?.href || e?.target?.closest("a")?.getAttribute("href")
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div
      className="vida-love-container vida-2-container"
      ref={loveNewsCardContainerRef}
      style={{ opacity: loveNewsCardContainerVisible ? 1 : 0 }}
    >
      <div className="vida-news-section">
        <div className="vida-love-header-section">
          <p>{newslabel}</p>
          <h2>{newsHeader}</h2>
        </div>
        <HorizontalScroll>
          <div className="vida-news-container">
            {newsCardContent?.map((news, index) => (
              <div className="vida-news-card" key={index}>
                <div className="news-card-wrapper">
                  <div className="news-card-asset">
                    <picture>
                      <img
                        src={news?.imagePath}
                        alt={news?.imageAltText}
                        className="vida-news-card-image"
                        loading="lazy"
                        title={news?.imageTitleText}
                      ></img>
                    </picture>
                  </div>

                  <div className="news-card-content">
                    <p>{news?.title}</p>
                    <a
                      target={news.newTab ? "_blank" : "_self"}
                      href={news?.newsRedirection ? news?.newsRedirection : "#"}
                      rel="noreferrer"
                      data-link-position={dataPosition || "newsCards"}
                      onClick={(e) => ctaTracking(e)}
                    >
                      {news?.loadMoreLabel}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HorizontalScroll>
      </div>
    </div>
  );
};

NewsCards.propTypes = {
  config: PropTypes.shape({
    newslabel: PropTypes.string,
    newsHeader: PropTypes.string,
    newsCardContent: PropTypes.string,
    dataPosition: PropTypes.string
  })
};

export default NewsCards;
