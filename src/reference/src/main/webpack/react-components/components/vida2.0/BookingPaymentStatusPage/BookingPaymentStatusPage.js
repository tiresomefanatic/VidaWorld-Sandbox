import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import Drawer from "../Drawer/Drawer";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const BookingPaymentStatusPage = ({
  config,
  isSuccess,
  userProfileInfo,
  variant,
  modelColor,
  orderId,
  opportunityId,
  modelValue,
  showNextSteps,
  insuranceAvailability,
  outstandingAmount,
  isPartialPayMade
}) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const uploadDocumentsUrl = appUtils.getPageUrl("uploadDocumentsUrl");
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const ordersUrl = appUtils.getPageUrl("ordersUrl");
  const purchaseSummaryUrl = appUtils.getPageUrl("vidaPurchaseSummaryUrl");
  const bikeVariantDetail = JSON.parse(config?.bikeVariantDetails || "{}");
  const [activeVariant, setActiveVariant] = useState();

  //Added for testing
  console.log("Modal Price ==== ", modelValue, modelColor);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const handlePaymentStatusRedirection = (e) => {
    const params = [
      "orderId=",
      orderId,
      "&opportunityId=",
      opportunityId,
      "&insuranceAvailability=",
      insuranceAvailability
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(params);
    ctaTracking(e, "ctaButtonClick", "Payment Status");
    if (showNextSteps) {
      if (isSuccess) {
        window.location.href = uploadDocumentsUrl + "?" + encryptedParams;
      } else {
        if (isPartialPayMade && parseInt(outstandingAmount) > 0) {
          window.location.href = ordersUrl;
        } else {
          window.location.href = purchaseSummaryUrl + "?" + encryptedParams;
        }
      }
    } else {
      if (isSuccess) {
        window.location.href = ordersUrl;
      } else {
        if (isPartialPayMade && parseInt(outstandingAmount) > 0) {
          window.location.href = ordersUrl;
        } else {
          window.location.href = purchaseSummaryUrl + "?" + encryptedParams;
        }
      }
    }
  };

  const getScooterColor = async () => {
    const selectedVariant = bikeVariantDetail?.bikeVariants?.filter(
      (item) => item?.variantName?.toLowerCase() === variant?.toLowerCase()
    );
    const bikeVariant = selectedVariant[0]?.variantDetails
      ? selectedVariant[0]?.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(
      modelColor,
      bikeVariant
    );
    setActiveVariant(selectedBikeVariant);
  };

  useEffect(() => {
    getScooterColor();
  }, [variant]);

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  return (
    <div className="booking-status-page-wrapper">
      <img
        className="booking-status-bg-img"
        src={
          isDesktop
            ? config.bookingStatusBgDesktop
            : config.bookingStatusBgMobile
        }
        alt="booking_status_bg"
      ></img>
      <div className="booking-status-page-container vida-2-container">
        <div className="booking-status-left-container">
          <div
            className={
              isSuccess
                ? "booking-status-banner-container"
                : "booking-status-banner-container failure"
            }
          >
            <img
              className="booking-status-banner-bg"
              src={activeVariant?.bgImg || config?.bannerBgImg}
              alt="banner_bg"
            ></img>
            <div className="booking-status-banner-content-container">
              <div className="user-info-container">
                <div className="user-info-name">
                  <p
                    className="user-info-name-text"
                    style={{
                      fontSize: fontSize,
                      color: activeVariant?.textColor || ""
                    }}
                  >{`${
                    userProfileInfo?.fname.charAt(0).toUpperCase() +
                    userProfileInfo?.fname.slice(1)
                  }'s`}</p>
                </div>
                <div className="user-info-bike">
                  <p
                    className="user-info-bike-text"
                    style={{
                      fontSize: fontSizeSubHeader,
                      color: activeVariant?.textColor || ""
                    }}
                  >
                    {variant}{" "}
                    {!isDesktop && (
                      <span
                        className="bike-sub-text"
                        style={{ color: activeVariant?.textColor || "white" }}
                      >
                        {config?.onItsWayText}
                      </span>
                    )}
                  </p>
                  <p
                    className="user-info-modal-color"
                    style={{ color: activeVariant?.textColor || "" }}
                  >
                    {modelColor}
                  </p>
                </div>
              </div>
              <div className="user-bike-img-container">
                <img
                  className="user-bike-img"
                  src={activeVariant?.bikeImg || config?.bannerBikeImg}
                  alt="bike_img"
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="booking-status-right-container">
          <div className="booking-status-right-content-container">
            <div className="booking-payment-status-success-failure-icon">
              <img
                src={
                  isSuccess
                    ? config?.bookingStatusSuccessIcon
                    : config?.bookingStatusFailureIcon
                }
                alt="status_icon"
              ></img>
            </div>
            <div className="booking-payment-status-title">
              <p className="booking-payment-status-title-text">
                {isSuccess
                  ? config?.paymentSuccessfulText
                  : config?.paymentFailedText}
              </p>
            </div>
            <div className="booking-payment-status-description">
              <p className="booking-payment-status-description-text">
                {isSuccess
                  ? `${config?.paymentOfText} ${
                      modelValue == null ? 0 : modelValue
                    } ${config?.isSuccessfulText}`
                  : `${config?.paymentOfText} ${
                      modelValue == null ? 0 : modelValue
                    } ${config?.failedText}`}
              </p>
              <p className="booking-payment-status-description-text">
                {isSuccess ? config?.thankYouText : config?.tryAgainText}
              </p>
              {isSuccess ? (
                <div className="booking-payment-status-order-details">
                  <p className="booking-payment-order-details-header">
                    {config?.orderIdHeader} {orderId}
                  </p>
                  <p className="booking-payment-order-details-link">
                    <a href={config?.clickMoreLink}>{config?.clickMoreText}</a>
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="booking-status-popup-container">
          <Drawer>
            <div className="booking-status-popup-btn-container">
              {showNextSteps ? (
                <button
                  className="booking-status-popup-btn"
                  type="button"
                  onClick={(e) => handlePaymentStatusRedirection(e)}
                >
                  {isSuccess
                    ? config?.continueToUploadDocumentsText
                    : config?.retryPaymentText}
                </button>
              ) : (
                <button
                  className="booking-status-popup-btn"
                  type="button"
                  onClick={(e) => handlePaymentStatusRedirection(e)}
                >
                  {isSuccess
                    ? config?.continueBtnText
                    : config?.retryPaymentText}
                </button>
              )}
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileInfo: {
      fname: userProfileDataReducer?.fname,
      lname: userProfileDataReducer?.lname
    }
  };
};

BookingPaymentStatusPage.propTypes = {
  config: PropTypes.shape({
    bookingStatusBgDesktop: PropTypes.string,
    bookingStatusBgMobile: PropTypes.string,
    bannerBgImg: PropTypes.string,
    onItsWayText: PropTypes.string,
    bannerBikeImg: PropTypes.string,
    bookingStatusSuccessIcon: PropTypes.string,
    bookingStatusFailureIcon: PropTypes.string,
    paymentSuccessfulText: PropTypes.string,
    paymentFailedText: PropTypes.string,
    paymentOfText: PropTypes.string,
    isSuccessfulText: PropTypes.string,
    failedText: PropTypes.string,
    thankYouText: PropTypes.string,
    tryAgainText: PropTypes.string,
    continueToUploadDocumentsText: PropTypes.string,
    retryPaymentText: PropTypes.string,
    continueBtnText: PropTypes.string,
    orderIdHeader: PropTypes.string,
    clickMoreText: PropTypes.string,
    clickMoreLink: PropTypes.string,
    bikeVariantDetails: PropTypes.object
  }),
  isSuccess: PropTypes.bool,
  userProfileInfo: PropTypes.object,
  variant: PropTypes.string,
  modelColor: PropTypes.string,
  orderId: PropTypes.string,
  opportunityId: PropTypes.string,
  modelValue: PropTypes.string,
  showNextSteps: PropTypes.bool,
  insuranceAvailability: PropTypes.bool,
  outstandingAmount: PropTypes.string,
  isPartialPayMade: PropTypes.bool
};

export default connect(mapStateToProps)(BookingPaymentStatusPage);
