import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const AboutVidaCard = ({ dataPosition, aboutVidaCardContent }) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation: e?.target?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div className="about-vida-card-wrapper">
      {aboutVidaCardContent?.map((item, index) => (
        <div className="about-vida-card-container" key={index}>
          <div
            className={
              item.isVideo
                ? "about-vida-media-container img-none"
                : "about-vida-media-container video-none"
            }
          >
            <img
              className="about-vida-card-img"
              src={isDesktop ? item.cardDesktopImg : item.cardMobileImg}
              alt={item?.imagealttext || "about_vida_card_img"}
              title={item?.imageTitle}
              loading="lazy"
            ></img>
            <video
              className="about-vida-card-video"
              src={item.cardVideo}
              autoPlay
              playsInline
              muted
              loop
            ></video>
          </div>
          <div className="about-vida-card-content-container">
            <div className="about-vida-card-title">
              <h3>{item.cardTitle}</h3>
              {item?.cardNavLink && (
                <a
                  data-link-position={dataPosition || "aboutVidaCard"}
                  onClick={(e) => ctaTracking(e)}
                  href={item?.cardNavLink}
                  target={item.newTab ? "_blank" : "_self"}
                  rel="noreferrer"
                >
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/png/about_vida_card_right_arrow.png`}
                    data-link-position={dataPosition || "aboutVidaCard"}
                    alt="right_arrow"
                  ></img>
                </a>
              )}
            </div>
            <div className="about-vida-card-description">
              <p dangerouslySetInnerHTML={{ __html: item.cardDescription }}></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutVidaCard;

AboutVidaCard.propTypes = {
  dataPosition: PropTypes.string,
  aboutVidaCardContent: PropTypes.arrayOf(PropTypes.any)
};
