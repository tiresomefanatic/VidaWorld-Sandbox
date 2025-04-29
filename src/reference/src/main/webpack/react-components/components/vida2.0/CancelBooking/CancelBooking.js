import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useCancelPreBooking } from "../../../hooks/userProfile/userProfileHooks";
import { useGetMyScooterDetails } from "../../../hooks/myScooter/myScooterHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";

const CancelBooking = (props) => {
  const { config, cancelUserData } = props;
  const [isOpened, setIsOpened] = useState(false);
  const [orderBookingId, setOrderBookingId] = useState();
  const [isShowCancelBookingError, setIsShowCancelBookingError] = useState();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const cancelBooking = useCancelPreBooking();
  let myScooterDetails = null;
  const getMyScooter = useGetMyScooterDetails();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const handleToggleDrawer = () => {
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    const orderBookingId = window.sessionStorage.getItem("bookingId");
    setOrderBookingId(orderBookingId);
  });

  const ctaTracking = (e, eventName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: "Cancel-Booking"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const cancelPreBooking = async (e) => {
    e.preventDefault();
    try {
      setSpinnerActionDispatcher(true);
      const cancelUserOrderData = await cancelBooking({
        variables: {
          increment_id: orderBookingId,
          reason: "cancelbooking"
        }
      });

      myScooterDetails = await getMyScooter();

      if (cancelUserOrderData?.data?.cancelPayment) {
        if (cancelUserOrderData.data.cancelPayment.status == "200") {
          if (isAnalyticsEnabled) {
            const productDetails = {
              modelColor: ""
            };
            const bookingDetails = {
              bookingID: orderBookingId,
              bookingStatus: "Pre Booking Canceled"
            };
            const cancellation = {
              cancellatonReason: "cancelbooking",
              orderID: ""
            };

            const myScooterAllRecords =
              myScooterDetails?.data?.getAllEccentricConfiguration[0]
                ?.opportunity_lines?.records || [];

            if (myScooterAllRecords.length) {
              const accessoriesList = [];
              myScooterAllRecords.forEach((element) => {
                if (element.item_type === "Accessory") {
                  accessoriesList.push(element.item_name);
                }
              });
            }
            analyticsUtils.trackPreBookingCancel(
              productDetails,
              bookingDetails,
              cancellation
            );
          }
          window.sessionStorage.removeItem("bookingId");
          const redirectionUrl = appUtils.getPageUrl("profileUrl");
          window.location.href = redirectionUrl;
        } else {
          setIsShowCancelBookingError(
            cancelUserOrderData.data.cancelPayment.message
          );
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  return (
    <div className="cancel-booking-wrapper">
      <img
        className="cancel-booking-bg-img"
        src={
          isDesktop
            ? config.cancelBookingBgDesktop
            : config.cancelBookingBgMobile
        }
        alt="cancel_booking_bg"
      ></img>
      <div className="cancel-booking-conatiner">
        <div className="cancel-booking-left-container">
          <div className="cancel-booking-title">
            <h2>{config.cancelBookingTitle}</h2>
          </div>
          <div className="cancel-booking-banner-container">
            <img
              className="cancel-booking-banner-bg"
              src={config.cancelBookingBannerImg}
              alt={config?.bannerImgAlt || "banner_bg"}
              title={config?.bannerImgTitle}
            ></img>
            <div className="cancel-booking-banner-content-container">
              <div className="user-info-conatiner">
                <p className="user-info-name">
                  {cancelUserData.first_name}
                  <span>’s</span>
                </p>
                <p className="user-info-bike">
                  {config.cancelBookingBikeName}{" "}
                  <span className="subtext">{config.bikeInfoSubText}</span>
                </p>
              </div>
              <div className="user-info-bike-img">
                <img
                  src={config.cancelBookingBikeImg}
                  alt={config?.bikeImgAlt || "user_info_bike_img"}
                  title={config?.bikeImgTitle}
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="cancel-booking-right-container">
          <div className="cancel-booking-right-content-container">
            <div className="booking-delivery-info-container">
              <div className="delivering-from-info">
                <p className="delivery-info">
                  {config.cancelBookingDeliveryText}{" "}
                  <span className="delivery-place">
                    {cancelUserData.dealer_name}
                  </span>
                </p>
              </div>
              <div className="delivery-payment-info">
                <p className="payable-text">
                  {config.cancelBookingPayableText}
                </p>
                <p className="payable-amount">{config.bikePriceWithTax}</p>
              </div>
            </div>
            <div className="delivery-bike-info-container">
              <div className="delivery-bike-flex-container">
                <div className="delivery-bike-icon">
                  <img
                    src={config.deliveryBikeIcon}
                    alt="delivery_bike_icon"
                  ></img>
                </div>
                <div className="delivery-bike-model-info">
                  <p className="delivery-bike-model-info-text">
                    {config.cancelBookingVidaText}{" "}
                    {config.cancelBookingBikeName}
                  </p>
                  <p className="delivery-bike-charges-text">
                    {config.deliveryChargesHandlingText}
                  </p>
                </div>
              </div>
              <div className="delivery-model-flex-container">
                <div className="delivery-bike-model-amount">
                  <p>{config.bikePriceWithoutTax}</p>
                </div>
                {config.isShowChevronDownIcon && (
                  <div className="chevron-down-icon">
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/png/chevron-down.png`}
                      alt="chevron_down_icon"
                    ></img>
                  </div>
                )}
              </div>
            </div>
            <hr className="dashed-border"></hr>
            <div className="delivery-add-on-container">
              {config.cancelBookingAddOnContent?.map((item, index) => (
                <div className="delivery-add-on-content-container" key={index}>
                  <div className="delivery-add-on-title-container">
                    <div className="delivery-add-on-icon">
                      <img
                        src={item.addOnIcon}
                        alt="delivery_add_on_icon"
                      ></img>
                    </div>
                    <div className="delivery-add-on-info">
                      <p className="delivery-add-on-info-title">
                        {item.addOnTitle}
                      </p>
                      <p className="delivery-add-on-info-sub-text">
                        {item.addOnSubText}
                      </p>
                    </div>
                  </div>
                  <div className="delivery-add-on-btn-container">
                    <a
                      href={item.addOnBtnNavLink}
                      target={item.newTab ? "_blank" : "_self"}
                      className="delivery-add-on-btn"
                      rel="noreferrer"
                    >
                      {item.addOnBtnText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          isOpened
            ? "cancel-booking-drawer-wrapper slide-down"
            : "cancel-booking-drawer-wrapper"
        }
      >
        <div className="drawer-btn-container">
          <div className="drawer-btn" onClick={handleToggleDrawer}></div>
        </div>
        <p className="cancel-booking-error show-only-desktop">
          {isShowCancelBookingError}
        </p>
        <div className="cancel-booking-drawer-container">
          <div className="cancel-booking-drawer-title">
            <p>{config.drawerTitle}</p>
          </div>
          <p className="cancel-booking-error show-only-mobile">
            {isShowCancelBookingError}
          </p>
          <div className="cancel-booking-drawer-btn-container">
            <a
              onClick={(e) => cancelPreBooking(e)}
              href="#"
              target={config.cancelNewTab ? "_blank" : "_self"}
              className="cancel-booking-cancel-btn"
              rel="noreferrer"
            >
              {config.cancelBtnLabel}
            </a>
            <a
              href={config.confirmNavLink}
              target={config.confirmNewTab ? "_blank" : "_self"}
              className="cancel-booking-confirm-btn"
              rel="noreferrer"
              onClick={(e) => ctaTracking(e, "confirmCTAClick")}
            >
              {config.confirmBtnLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ preBookingReducer, userProfileDataReducer }) => {
  return {
    cancelUserData: {
      first_name: userProfileDataReducer?.fname,
      dealer_name: preBookingReducer?.dealerName
    }
  };
};

CancelBooking.propTypes = {
  config: PropTypes.shape({
    cancelBookingAddOnContent: PropTypes.arrayOf(PropTypes.any),
    cancelBookingBgDesktop: PropTypes.string,
    cancelBookingBgMobile: PropTypes.string,
    cancelBookingTitle: PropTypes.string,
    cancelBookingBannerImg: PropTypes.string,
    cancelBookingBikeName: PropTypes.string,
    cancelBookingVidaText: PropTypes.string,
    bikeInfoSubText: PropTypes.string,
    cancelBookingBikeImg: PropTypes.string,
    cancelBookingDeliveryText: PropTypes.string,
    cancelBookingPayableText: PropTypes.string,
    deliveryChargesHandlingText: PropTypes.string,
    bikePriceWithoutTax: PropTypes.string,
    bikePriceWithTax: PropTypes.string,
    deliveryBikeIcon: PropTypes.string,
    drawerTitle: PropTypes.string,
    cancelBtnLabel: PropTypes.string,
    confirmBtnLabel: PropTypes.string,
    cancelNavLink: PropTypes.string,
    confirmNavLink: PropTypes.string,
    cancelNewTab: PropTypes.bool,
    confirmNewTab: PropTypes.bool,
    isShowChevronDownIcon: PropTypes.bool,
    bannerImgAlt: PropTypes.string,
    bannerImgTitle: PropTypes.string,
    bikeImgAlt: PropTypes.string,
    bikeImgTitle: PropTypes.string
  }),
  cancelUserData: PropTypes.object
};

export default connect(mapStateToProps)(CancelBooking);
