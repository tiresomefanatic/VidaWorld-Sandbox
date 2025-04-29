import React from "react";
import PropTypes, { any } from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const ChargingLocatorFeaturesCard = ({ config }) => {
  const {
    variantTwoTitle,
    title,
    titleTag,
    title2Tag,
    cardsInfo,
    bgMobileImage,
    bgDesktopImage,
    isVariantTwo
  } = config;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const sortedCardsInfo = cardsInfo.sort(
    (a, b) => parseInt(a.order) - parseInt(b.order)
  );

  const CustomTitleTag = titleTag || "p";
  const CustomTitle2Tag = title2Tag || "p";

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

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
      style={{
        backgroundImage: `url(${isDesktop ? bgDesktopImage : bgMobileImage})`
      }}
      className={`charging-features-card-container ${
        isVariantTwo ? "variant-two" : ""
      } vida-2-container`}
    >
      <div className="header-container">
        <CustomTitle2Tag className="header-text-one">
          {variantTwoTitle}
        </CustomTitle2Tag>
        <CustomTitleTag
          dangerouslySetInnerHTML={{
            __html: title
          }}
        ></CustomTitleTag>
      </div>

      <div className="card-container-wrapper">
        {sortedCardsInfo.map((content, index) => (
          <a
            href={content.link}
            key={index}
            className="card-container"
            data-link-position={
              config.dataPosition || "chargingLocatorFeaturesCard"
            }
            onClick={(e) => ctaTracking(e)}
          >
            <div className="card-link">
              <div className="img-container">
                <img
                  src={isDesktop ? content?.desktopImage : content?.mobileImage}
                  alt={content?.imageAlt}
                  title={content?.imageTitle}
                  loading="lazy"
                />
              </div>
            </div>
            <div
              className={
                isDesktop
                  ? `txt-container-${content.labelPositionDesktop}`
                  : `txt-container-${content.labelPositionMobile}`
              }
            >
              {content.labelTag ? (
                React.createElement(
                  content.labelTag,
                  { className: "charging-features-text" },
                  content.label
                )
              ) : (
                <p className="charging-features-text">{content?.label}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChargingLocatorFeaturesCard;

ChargingLocatorFeaturesCard.propTypes = {
  config: PropTypes.shape({
    titleTag: PropTypes.string,
    title2Tag: PropTypes.string,
    dataPosition: PropTypes.string,
    bgMobileImage: PropTypes.string,
    bgDesktopImage: PropTypes.string,
    variantTwoTitle: PropTypes.string,
    title: PropTypes.string,
    cardsInfo: PropTypes.arrayOf(
      PropTypes.shape({
        order: PropTypes.string,
        labelPositionDesktop: PropTypes.string,
        labelPositionMobile: PropTypes.string,
        labelTag: PropTypes.string,
        link: PropTypes.string,
        mobileImage: PropTypes.string,
        desktopImage: PropTypes.string,
        imageAlt: PropTypes.string,
        imageTitle: PropTypes.string,
        label: PropTypes.string
      })
    ),
    isVariantTwo: PropTypes.bool
  })
};
