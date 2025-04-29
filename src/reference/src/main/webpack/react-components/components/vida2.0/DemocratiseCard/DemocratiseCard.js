import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const DemocratiseCard = ({ config }) => {
  const { text, link, linkText, backgroundImage, bgColor } = config;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      const pageName = "About VIDA";
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
  };

  return (
    <div className="demo-card__container vida-2-container">
      <div className="demo-card__wrapper">
        <section
          className="demo-card__hero"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: `${bgColor ? bgColor : "white"}`
          }}
        >
          <div className="demo-card__content">{text}</div>
        </section>
        {link && (
          <div className="link">
            <a href={link} onClick={(e) => ctaTracking(e)}>
              {linkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemocratiseCard;

DemocratiseCard.propTypes = {
  config: PropTypes.shape({
    text: PropTypes.string,
    link: PropTypes.string,
    linkText: PropTypes.string,
    backgroundImage: PropTypes.string,
    bgColor: PropTypes.string
  })
};
