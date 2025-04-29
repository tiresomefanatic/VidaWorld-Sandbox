import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import DeliveryTracker from "../DeliveryTracker/DeliveryTracker";
import ChargingLocatorChoosePlan from "../ChargingLocatorChoosePlan/ChargingLocatorChoosePlan";
import VidaAppDownload from "../VidaAppDownload/VidaAppDownload";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { useOptimizedGetOrderData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import Banner from "../Purchase/Components/Banner";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const TrackDelivery = (props) => {
  const { config, userProfileInfo, productData } = props;
  const [isPostDeliveryPage, setIsPostDeliveryPage] = useState(false);
  const [progessStatus, setProgressStatus] = useState("delivery-in-progress");
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const variant = window.sessionStorage.getItem("Variant");
  const orderDate = window.sessionStorage.getItem("orderDate");

  const queryString = window.location.href.split("?")[1];
  const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);
  const orderId = params && params.get("orderId");

  const getOrderDetails = useOptimizedGetOrderData();
  const bikeVariantDetails = JSON.parse(config?.bikeVariantDetails || "{}"); //JSON.parse
  const [activeVariant, setActiveVariant] = useState();

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getOrderDetails({
      variables: {
        order_id: orderId,
        opportunity_id: ""
      }
    });
  }, []);

  const getSelectedScooter = async () => {
    const selectedVariant = bikeVariantDetails?.bikeVariants?.filter(
      (item) =>
        item?.variantName?.toLowerCase() === productData?.name?.toLowerCase()
    );
    const bikeVariant = selectedVariant[0]?.variantDetails
      ? selectedVariant[0]?.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(
      productData?.color,
      bikeVariant
    );
    setActiveVariant(selectedBikeVariant);
  };

  useEffect(() => {
    getSelectedScooter();
  }, [productData]);

  return (
    <div className="track-delivery-wrapper">
      <img
        className="track-delivery-bg-img"
        src={
          isDesktop
            ? config.trackDeliveryBgDesktop
            : config.trackDeliveryBgMobile
        }
        alt="cancel_booking_bg"
      ></img>
      <div className="track-delivery-container vida-2-container">
        <div className="track-delivery-left-container">
          {isPostDeliveryPage && (
            <div>
              <p className="track-delivery-normal-title">
                {config?.trackDeliveryNormalTitle}
              </p>
              <p className="track-delivery-bold-title">
                {config?.trackDeliveryBoldTitle}
              </p>
            </div>
          )}
          {/* <div className="track-delivery-banner-container">
            <img
              className="track-delivery-banner-bg"
              src={config?.bannerBgImg}
              alt="banner_bg"
            ></img>
            <div className="track-delivery-banner-content-container">
              <div className="user-info-container">
                <div className="user-info-name">
                  <p
                    className="user-info-name-text"
                    style={{ fontSize: fontSize }}
                  >{`${
                    userProfileInfo?.fname?.charAt(0).toUpperCase() +
                    userProfileInfo?.fname?.slice(1)
                  }'s`}</p>
                </div>
                <div className="user-info-bike">
                  <p
                    className="user-info-bike-text"
                    style={{ fontSize: fontSizeSubHeader }}
                  >
                    {variant}{" "}
                    <span className="bike-sub-text">
                      {config?.onItsWayText}
                    </span>
                  </p>
                </div>
              </div>
              <div className="user-bike-img-container">
                <img
                  className="user-bike-img"
                  src={config?.bannerBikeImg}
                  alt="bike_img"
                ></img>
              </div>
            </div>
          </div> */}
          <Banner
            bannerBgImg={activeVariant?.bgImg}
            bikeName={productData?.name}
            onItsWayText={config?.onItsWayText}
            userName={userProfileInfo?.fname}
            bannerBikeImg={activeVariant?.bikeImg}
            optedBikeVariant={activeVariant}
          />
          <div className="track-delivery-delivery-tracker-container">
            <DeliveryTracker
              config={config?.deliveryTrackerContent}
              progressStatus={progessStatus}
            />
          </div>
          {isDesktop && (
            <div className="track-delivery-download-invoice">
              <a>{config?.downloadBookingInvoiceText}</a>
            </div>
          )}
        </div>
        <div className="track-delivery-right-container">
          {!isPostDeliveryPage && (
            <div>
              <div className="track-delivery-title-container">
                <div className="track-delivery-title-flex-container">
                  <p className="track-delivery-title-text">
                    {config?.trackDeliveryTitle}
                  </p>
                  <p className="track-delivery-description-text">
                    {config?.trackDeliveryDescription}
                  </p>
                </div>
                <div className="track-delivery-dropdown-icon">
                  <img src={config?.dropDownIcon} alt="chevron_icon"></img>
                </div>
              </div>
              <div className="track-delivery-tracker-container">
                {/* <DeliveryTracker
                  config={config?.purchaseTrackerContent}
                  progressStatus={progessStatus}
                /> */}
                <div className="final-tracker-wrapper">
                  <div className="final-tracker-container">
                    <div
                      className={`final-stepper-tracker-container ${progessStatus}`}
                    >
                      <div className="stepper-initial-tracker">
                        <div className="stepper-initial-circle"></div>
                        <div className="stepper-initial-line"></div>
                      </div>
                      <div className="stepper-tracker-bar-container">
                        {config?.purchaseTrackerContent?.deliveryTrackerStepperContent?.map(
                          (item, index) => (
                            <div className="stepper-tracker-bar" key={index}>
                              <div className="stepper-tracker-bar-flex-container">
                                <div className="stepper-tracker-circle">
                                  <div className="stepper-tracker-image">
                                    <img
                                      src={item?.icon}
                                      alt="payment_icon"
                                    ></img>
                                  </div>
                                </div>
                                <div className="stepper-tracker-line"></div>
                              </div>
                              <div className="stepper-tracker-title">
                                <p className="stepper-tracker-title-text">
                                  {item?.title}
                                  {item.title.includes("Order ID")
                                    ? " : " + orderId
                                    : ""}
                                </p>
                                <p className="stepper-tracker-title-sub-text">
                                  For Vida {" " + variant}
                                </p>
                                <p className="stepper-tracker-title-sub-text">
                                  Placed on {" " + orderDate}
                                </p>
                                {item.subTitle && (
                                  <p className="stepper-tracker-title-sub-title">
                                    {"Your" +
                                      " " +
                                      variant +
                                      " " +
                                      item.subTitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="stepper-end-tracker">
                        <div className="stepper-end-line"></div>
                        <div className="stepper-end-circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!isDesktop && (
                <div className="track-delivery-download-invoice">
                  <a>{config?.downloadBookingInvoiceText}</a>
                </div>
              )}
            </div>
          )}
          {isPostDeliveryPage && (
            <div className="post-delivery-summary-container">
              <div className="charging-choose-plan-container">
                <ChargingLocatorChoosePlan
                  config={config?.chargingLocatorChoosePlanConfig}
                />
              </div>
              <div className="vida-app-download-container">
                <VidaAppDownload config={config?.vidaAppDownloadConfig} />
              </div>
              <div className="join-community-btn">
                <button type="button">{config?.joinVidaCommunityText}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ userProfileDataReducer, purchaseConfigReducer }) => {
  return {
    userProfileInfo: {
      fname: userProfileDataReducer?.fname,
      lname: userProfileDataReducer?.lname
    },
    productData: purchaseConfigReducer.productData
  };
};

TrackDelivery.propTypes = {
  config: PropTypes.shape({
    trackDeliveryBgDesktop: PropTypes.string,
    trackDeliveryBgMobile: PropTypes.string,
    trackDeliveryNormalTitle: PropTypes.string,
    trackDeliveryBoldTitle: PropTypes.string,
    bannerBgImg: PropTypes.string,
    onItsWayText: PropTypes.string,
    bannerBikeImg: PropTypes.string,
    deliveryTrackerContent: PropTypes.object,
    purchaseTrackerContent: PropTypes.object,
    trackDeliveryTitle: PropTypes.string,
    trackDeliveryDescription: PropTypes.string,
    dropDownIcon: PropTypes.string,
    downloadBookingInvoiceText: PropTypes.string,
    joinVidaCommunityText: PropTypes.string,
    chargingLocatorChoosePlanConfig: PropTypes.object,
    vidaAppDownloadConfig: PropTypes.object,
    bikeVariantDetails: PropTypes.object
  }),
  userProfileInfo: PropTypes.object,
  productData: PropTypes.object
};

export default connect(mapStateToProps)(TrackDelivery);
