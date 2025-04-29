import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ReDirectionCards = ({ config, clickEvent, isDesignVida }) => {
  const {
    dataPosition,
    reDirectionCardContents,
    isVariantWarrantyCard,
    title,
    cardType,
    cardImg,
    cardBgImgDesktop,
    cardBgImgMobile,
    cardImgText,
    cardBgColor,
    cardTextColor,
    fontSize,
    fontWeight,
    imageAlt,
    imageTitle
  } = config;

  // intersection observer
  const {
    ref: reDirectionCardWrapperRef,
    isVisible: reDirectionCardWrapperVisible
  } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const cardStyle = {
    backgroundColor: cardBgColor,
    color: cardTextColor
  };

  const fontStyle = {
    fontSize: fontSize,
    fontWeight: fontWeight
  };
  const pagePath = window.location.pathname;

  const ctaTracking = (e, text) => {
    if (isAnalyticsEnabled) {
      const closestLink = e?.target?.closest("a");
      const ctaText = text || e?.target?.alt || e?.target?.innerText;
      const ctaLocation = closestLink?.dataset?.linkPosition;
      const clickURL = closestLink?.getAttribute("href");

      if (clickURL?.endsWith(".pdf")) {
        const documentName = decodeURIComponent(
          clickURL
            .split("/")
            .pop()
            .replace(/\.pdf$/, "")
        );
        analyticsUtils.trackDocumentDetailsClick({
          documentName
        });
      } else {
        analyticsUtils.trackCTAClicksVida2(
          { ctaText, ctaLocation, clickURL },
          "ctaButtonClick"
        );
      }
    }
    clickEvent(true);
  };

  return (
    <div className={`${cardType}`}>
      <a
        data-link-position={dataPosition || "redirectionCard"}
        onClick={(e) => ctaTracking(e, reDirectionCardContents?.cardText)}
        href={
          reDirectionCardContents?.reDirect?.redirectLink ||
          "javascript:void(0)"
        }
        target={
          reDirectionCardContents?.reDirect?.redirectLink &&
          reDirectionCardContents?.reDirect?.newTab
            ? "_blank"
            : "_self"
        }
        rel="noreferrer"
      >
        <div
          className="card-wrapper"
          ref={reDirectionCardWrapperRef}
          style={{ opacity: reDirectionCardWrapperVisible ? 1 : 0 }}
        >
          <div
            className={
              isDesignVida
                ? "vida-offer-card__container-design-your-vida"
                : `${cardType}__container`
            }
            style={cardStyle}
          >
            {cardBgImgMobile && (
              <img
                src={cardBgImgMobile}
                alt="card_bg_img"
                aria-label="card-img-bg"
                className="card-bg-img-mobile"
              />
            )}
            {cardBgImgDesktop && (
              <img
                src={cardBgImgDesktop}
                alt="card_bg_img"
                aria-label="card-img-bg"
                className="card-bg-img-desktop"
              />
            )}
            <div
              className={
                `${cardType}` &&
                (pagePath.includes("offer")
                  ? `${cardType}__wrapper-offers ${cardType}__wrapper`
                  : `${cardType}__wrapper`)
              }
            >
              {cardImg &&
                (!pagePath.includes("offer") ? (
                  <div className={`${cardType}__img-txt-container`}>
                    <div className={`${cardType}__img-container`}>
                      <div className="stack-images">
                        {cardImg?.map((image, index) => (
                          <img
                            src={image}
                            alt={imageAlt || "card-img"}
                            title={imageTitle}
                            key={index}
                            aria-label="card-img"
                            className={`card-img profileImg${index + 1} `}
                          />
                        ))}
                      </div>
                    </div>

                    <div className={`${cardType}__img-txt`}>
                      <p style={{ color: cardTextColor }}>{cardImgText}</p>
                    </div>
                  </div>
                ) : (
                  ""
                ))}
              {cardType === "vida-offer-card" && (
                <div className="title-container">
                  <p>{title}</p>
                </div>
              )}
              <div className={`${cardType}__txt-redirect-container`}>
                <div
                  className={
                    isDesignVida
                      ? "vida-offer-card__design-vida-txt-container"
                      : `${cardType}__txt-container`
                  }
                >
                  {reDirectionCardContents?.cardTitle &&
                    (pagePath.includes("offer") ? (
                      <h2
                        style={{
                          color: cardTextColor,
                          fontSize: fontSize,
                          fontWeight: fontWeight
                        }}
                      >
                        {reDirectionCardContents?.cardTitle || ""}
                      </h2>
                    ) : (
                      ""
                    ))}
                  {reDirectionCardContents?.cardText &&
                    (pagePath.includes("offer") ? (
                      <h3
                        style={{
                          color: cardTextColor,
                          fontSize: fontSize,
                          fontWeight: fontWeight
                        }}
                      >
                        {reDirectionCardContents?.cardText || ""}
                      </h3>
                    ) : (
                      <p
                        style={{
                          color: cardTextColor,
                          fontSize: fontSize,
                          fontWeight: fontWeight
                        }}
                      >
                        {reDirectionCardContents?.cardText || ""}
                      </p>
                    ))}
                </div>

                {reDirectionCardContents?.reDirect?.imageUrl && (
                  <div className={`${cardType}__redirect-icon-container`}>
                    <a
                      data-link-position={dataPosition || "redirectionCard"}
                      href={
                        reDirectionCardContents?.reDirect?.redirectLink || ""
                      }
                      target={
                        reDirectionCardContents?.reDirect?.newTab
                          ? "_blank"
                          : "_self"
                      }
                      rel="noreferrer"
                    >
                      <img
                        src={reDirectionCardContents?.reDirect?.imageUrl || ""}
                        alt="right-up-arrow-img"
                        className="right-up-arrow-img"
                        aria-label="right-up-arrow-img"
                      />
                      <img
                        src={
                          reDirectionCardContents?.reDirect?.secondImageUrl ||
                          ""
                        }
                        alt="right-up-arrow-second-img"
                        className="right-up-arrow-img-on-hover"
                        aria-label="right-up-arrow-second-img"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

ReDirectionCards.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    reDirectionCardContents: PropTypes.shape({
      cardText: PropTypes.string,
      cardTitle: PropTypes.string,
      reDirect: PropTypes.shape({
        redirectLink: PropTypes.string,
        newTab: PropTypes.bool,
        imageUrl: PropTypes.string
      })
    }),
    isVariantWarrantyCard: PropTypes.bool,
    title: PropTypes.string,
    cardType: PropTypes.string,
    cardImg: PropTypes.arrayOf(PropTypes.string),
    cardImgText: PropTypes.string,
    cardBgImg: PropTypes.string,
    cardBgImgDesktop: PropTypes.string,
    cardBgImgMobile: PropTypes.string,
    cardBgColor: PropTypes.string,
    cardTextColor: PropTypes.string,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.string,
    imageAlt: PropTypes.string,
    imageTitle: PropTypes.string
  }),
  clickEvent: PropTypes.any,
  isDesignVida: PropTypes.bool
};

ReDirectionCards.defaultProps = {
  config: {},
  clickEvent: () => undefined
};

export default ReDirectionCards;
