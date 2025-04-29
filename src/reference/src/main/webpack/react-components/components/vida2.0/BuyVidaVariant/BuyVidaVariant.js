import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import VidaToolTip from "../VidaToolTip/VidaToolTip";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
// import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const BuyVidaVariant = ({
  dataPosition,
  ProductDetailData,
  exShowRoomLabel,
  buyNowButtonLabel,
  learnMoreLabel,
  buyNowHeaderLabel,
  bikeTargetRefs,
  userProfileData,
  priceListData,
  defaultCity,
  isVariantTwo
}) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isLoggedIn = loginUtils.isSessionActive();
  const pagePath = window.location.pathname;

  // // intersection observer
  // const {
  //   ref: buyVidaVariantContainerRef,
  //   isVisible: buyVidaVariantContainerVisible
  // } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const getVariantPrice = (variantSku, defaultCity) => {
    let price = 0;
    if (priceListData) {
      priceListData.map((item) => {
        if (
          item?.city_state_id.toLowerCase() === defaultCity?.toLowerCase() &&
          item?.variant_sku === variantSku
        ) {
          price = currencyUtils.getCurrencyFormatValue(
            item?.exShowRoomPrice,
            0
          );
        }
      });
      return price;
    }
  };

  const ctaTracking = (e, redirectUrl, name) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
    if (name) {
      window.location.href = redirectUrl + "?" + name;
    }
  };

  return (
    <div
      className="buy-vida__scroll-wrapper"
      // ref={buyVidaVariantContainerRef}
      // style={{ opacity: buyVidaVariantContainerVisible ? 1 : 0 }}
    >
      <div className="buy-vida__wrapper vida-2-container">
        <h2 className="buy-vida__header">{buyNowHeaderLabel}</h2>
        <div
          className={
            ProductDetailData?.length < 3
              ? ProductDetailData?.length < 2
                ? "buy-vida__container align-center"
                : "buy-vida__container"
              : "buy-vida__container three-varient"
          }
        >
          {ProductDetailData?.map((item, index) => (
            <div
              className={`bike-specification__wrapper ${
                index % 2 && isVariantTwo
                  ? "bike-specification__wrapper--border-bottom"
                  : ""
              }`}
              key={item.variant_name + index}
              id={item.sectionid}
              ref={bikeTargetRefs.current[index]}
            >
              <div
                className={`bike-specification__container
             ${index % 2 ? "varient2Class" : ""} ${
                  isVariantTwo ? "home-page-view" : ""
                }`}
              >
                <div
                  className={`bike-specification__image-wrapper bike-target-container${index}`}
                >
                  {isVariantTwo && (
                    <img
                      src={
                        isDesktop
                          ? item.buyVidaDesktopImagePath
                          : item.buyVidaMobileImagePath
                      }
                      alt={item.altText}
                      className={"home-page-bike-image"}
                    ></img>
                  )}
                </div>
                <div className="bike-specification__detail">
                  <div className="bike-specification__detail-wraper">
                    {item.variant_name &&
                      (pagePath.includes("product") ? (
                        <h2 className="bike-specification__bike-model">
                          {"VIDA " + item.variant_name}
                        </h2>
                      ) : (
                        <h3 className="bike-specification__bike-model">
                          {"VIDA " + item.variant_name}
                        </h3>
                      ))}
                    <p className="bike-specification__bike-price">
                      {getVariantPrice(
                        item?.sectionid,
                        isLoggedIn
                          ? `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`
                          : defaultCity
                      )}
                      <VidaToolTip index={index} componentName="buyVariant" />
                    </p>
                    <p className="bike-specification__showroom-text">
                      {exShowRoomLabel}
                    </p>
                  </div>

                  {/* <div className="bike-specification__speed-detail-wrapper">
                    <div className="bike-specification__speed-detail-container">
                      <div className="bike-specification__speed-icon">
                        <img
                          src={item.acceration.acceleratorIcon}
                          alt={item.acceration.acceleratorIconAlt}
                        ></img>
                      </div>
                    </div>
                    <div className="bike-specification__speed-details">
                      <div className="bike-specification__acceleration-text-wrapper">
                        <p className="bike-specification__acceleration-text">
                          {item.acceration.accelerationlabel}
                        </p>
                      </div>
                      <div className="bike-specification__acceleration-detail">
                        <p className="bike-specification__acceleration-number">
                          {item.acceration.accelerationValue}
                        </p>
                        <p className="bike-specification__acceleration-unit">
                          {item.acceration.accerationUnit}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="buy-vida__buttonLink-wrapper">
                <a
                  className="buy-vida__buy-now-button"
                  onClick={(e) =>
                    ctaTracking(e, item?.buyNowLink, item?.variant_name)
                  }
                  data-link-position={dataPosition || "plpBanner"}
                >
                  {buyNowButtonLabel}
                </a>
                <a
                  className="buy-vida__learn-more-link"
                  onClick={(e) => ctaTracking(e)}
                  data-link-position={dataPosition || "plpBanner"}
                  href={item?.learnMoreLink}
                  target={item?.learnMoreNewTab ? "_blank" : "_self"}
                  rel="noreferrer"
                >
                  {learnMoreLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileData: {
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    }
  };
};

BuyVidaVariant.propTypes = {
  dataPosition: PropTypes.string,
  ProductDetailData: PropTypes.arrayOf(PropTypes.any),
  exShowRoomLabel: PropTypes.string,
  buyNowButtonLabel: PropTypes.string,
  learnMoreLabel: PropTypes.string,
  buyNowHeaderLabel: PropTypes.string,
  bikeTargetRefs: PropTypes.arrayOf(PropTypes.any),
  userProfileData: PropTypes.object,
  priceListData: PropTypes.arrayOf(PropTypes.any),
  defaultCity: PropTypes.string,
  isVariantTwo: PropTypes.bool
};

export default connect(mapStateToProps)(BuyVidaVariant);
