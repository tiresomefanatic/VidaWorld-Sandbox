import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import OwnershipPlans from "./OwnershipPlans/OwnershipPlans";
import PaymentOptions from "./PaymentOptions/PaymentOptions";
import AadharDetails from "./AadharDetails/AadharDetails";
import GstDetails from "./GstDetails/GstDetails";
import AboutFame from "./AboutFame/AboutFame";
import Popup from "../Popup/Popup";
import appUtils from "../../../site/scripts/utils/appUtils";
import Breakup from "./Breakup/Breakup";
import InsurancePolicy from "./InsurancePolicy/InsurancePolicy";
import { useGetOrderData } from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import TradeIn from "./TradeIn/TradeIn";
import { useGetMyScooterDetails } from "../../hooks/myScooter/myScooterHooks";

const PurchaseConfigurator = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const configurationUrl = appUtils.getPageUrl("configurationUrl");

  const imgPath = appUtils.getConfig("imgPath");
  const { config } = props;
  const {
    productData,
    payment,
    productId,
    eccentricImage,
    userLocation,
    myScooter
  } = props.cmpProps;
  const { scooterInfo, subscription, exchangePolicyDetails } = props.config;
  const [showFame, setShowFame] = useState(false);
  // const [gstEmailValidation, setGstEmailValidation] = useState(false);

  const toggleShowFame = (state) => {
    if (state) {
      document.querySelector("html").classList.remove("overflow-hidden");
    }
    setShowFame(state);
  };
  const productColors = appUtils.getConfig("productColorCodes");

  const getOrderData = useGetOrderData();
  const getMyScooter = useGetMyScooterDetails();
  const queryString = location.href.split("?")[1];
  useEffect(() => {
    if (queryString) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      if (params && params.get("orderId") && params.get("opportunityId")) {
        setSpinnerActionDispatcher(true);
        getOrderData({
          variables: {
            order_id: params.get("orderId"),
            opportunity_id: params.get("opportunityId")
          }
        });
        setSpinnerActionDispatcher(true);
        getMyScooter();
      } else {
        window.location.href = appUtils.getPageUrl("profileUrl");
      }
    } else {
      window.location.href = appUtils.getPageUrl("profileUrl");
    }
  }, []);

  const [showAadharError, setShowAadharError] = useState(false);
  const [showGSTError, setShowGSTError] = useState(false);

  const handleAadharError = (val) => {
    setShowAadharError(val);
  };

  const handleGSTError = (val) => {
    setShowGSTError(val);
  };

  useEffect(() => {
    if (isAnalyticsEnabled) {
      const productDetails = {
        modelVariant: productData.name,
        modelColor: productData.color,
        productID: productId
      };
      const configuratorDetails = {
        accessorizeName: ""
      };
      if (productData.name) {
        configuratorDetails.accessorizeName = myScooter.configuredAccessories
          .length
          ? myScooter.configuredAccessories.toString().split(",").join("|")
          : "";
        analyticsUtils.trackBookingStart(
          productDetails,
          userLocation,
          configuratorDetails
        );
      }
    }
  }, [payment.basePrice]);

  return (
    <div className="vida-purchase-configurator">
      {payment.basePrice !== 0 && (
        <>
          <div className="vida-purchase-configurator__product-info">
            <div className="vida-container vida-purchase-configurator__product-info-container">
              <h3>{productData.name}</h3>
              <h3>
                {currencyUtils.getCurrencyFormatValue(payment.finalPrice)}
              </h3>
            </div>
          </div>
          <div className="vida-container vida-purchase-configurator__product-container">
            <div className="vida-purchase-configurator__scooter-info">
              <div className="vida-purchase-configurator__scooter-card">
                <div className="vida-purchase-configurator__card-config">
                  <div className="vida-purchase-configurator__scooter-color">
                    <p
                      className="vida-purchase-configurator__color"
                      style={{
                        background: `${productColors[productData.color]}`
                      }}
                    ></p>
                    <p className="vida-purchase-configurator__color-name">
                      {productData.color}
                      <span>{scooterInfo.colorSummaryLabel}</span>
                    </p>
                  </div>
                </div>
                <div className="vida-purchase-configurator__card-image">
                  {eccentricImage ? (
                    <img
                      className="vida-purchase-configurator__product-image"
                      src={eccentricImage}
                      alt={productData.name}
                    />
                  ) : (
                    <img
                      className="vida-purchase-configurator__product-image"
                      src={`${imgPath + productData.variantSku}.png`}
                      alt={productData.name}
                    />
                  )}
                </div>
              </div>
              <div className="vida-purchase-configurator__scooter-performance">
                <div className="vida-purchase-configurator__performance-item">
                  <label className="vida-purchase-configurator__performance-title">
                    {scooterInfo.product.range}
                  </label>
                  <h2 className="vida-purchase-configurator__performance-data">
                    {productData.range}
                  </h2>
                </div>
                <div className="vida-purchase-configurator__performance-item">
                  <label className="vida-purchase-configurator__performance-title">
                    {scooterInfo.product.topSpeed}
                  </label>
                  <h2 className="vida-purchase-configurator__performance-data">
                    {productData.topSpeed}
                  </h2>
                </div>
                <div className="vida-purchase-configurator__performance-item">
                  <label className="vida-purchase-configurator__performance-title">
                    {scooterInfo.product.acceleration}
                  </label>
                  <h2 className="vida-purchase-configurator__performance-data">
                    {productData.accelerator}
                  </h2>
                </div>
                <div className="vida-purchase-configurator__performance-item">
                  <label className="vida-purchase-configurator__performance-title">
                    {scooterInfo.product.chargingTime}
                  </label>
                  <h2 className="vida-purchase-configurator__performance-data">
                    {productData.chargingTime}
                  </h2>
                </div>
              </div>
            </div>
            <div className="vida-purchase-configurator__product-details">
              <div className="vida-purchase-configurator__product-item">
                <TradeIn config={exchangePolicyDetails}></TradeIn>
              </div>
              {/* <div className="vida-purchase-configurator__product-item">
                <OwnershipPlans
                  config={config.ownershipPlan}
                  subscriptionConfig={subscription}
                ></OwnershipPlans>
              </div> */}
              <div className="vida-purchase-configurator__product-item">
                {showFame && (
                  <div>
                    <Popup handlePopupClose={toggleShowFame}>
                      <AboutFame
                        fameConfig={
                          config.aadharDetails.cardDetails.subsidy.details
                        }
                      ></AboutFame>
                    </Popup>
                  </div>
                )}
                <AadharDetails
                  aadharConfig={config.aadharDetails}
                  onShowPopup={toggleShowFame}
                  aadharData={props.cmpProps.aadhar}
                  showAadharError={showAadharError}
                  handleAadharError={handleAadharError}
                ></AadharDetails>
              </div>
              <div className="vida-purchase-configurator__product-item">
                <GstDetails
                  gstConfig={config.gstDetails}
                  gstData={props.cmpProps.gst}
                  showGSTError={showGSTError}
                  handleGSTError={handleGSTError}
                  // gstEmailValidtion={gstEmailValidation}
                ></GstDetails>
              </div>
              <div className="vida-purchase-configurator__product-item">
                <PaymentOptions config={config.paymentOptions}></PaymentOptions>
              </div>
              {payment.paymentMethod !== CONSTANT.PAYMENT_METHOD.LEASE && (
                <div className="vida-purchase-configurator__product-item">
                  <InsurancePolicy config={config.insurancePolicy} />
                </div>
              )}
              <div className="vida-purchase-configurator__product-item">
                <Breakup
                  queryString={queryString}
                  config={config.breakup}
                  insuranceMessage={config.insurancePolicy.warning}
                  showAadharError={handleAadharError}
                  showGSTError={handleGSTError}
                  // gstEmailValidtion={setGstEmailValidation}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

PurchaseConfigurator.propTypes = {
  config: PropTypes.object,
  cmpProps: PropTypes.shape({
    productId: PropTypes.string,
    productData: PropTypes.object,
    payment: PropTypes.object,
    aadhar: PropTypes.object,
    gst: PropTypes.object,
    eccentricImage: PropTypes.string,
    userLocation: PropTypes.object,
    myScooter: PropTypes.object
  }),
  scooterInfo: PropTypes.shape({
    product: PropTypes.shape({
      range: PropTypes.string,
      topSpeed: PropTypes.string,
      acceleration: PropTypes.string,
      chargingTime: PropTypes.string
    }),
    colorSummaryLabel: PropTypes.string
  }),
  exchangePolicyDetails: PropTypes.object,
  subscription: PropTypes.object
};

const mapStateToProps = ({
  purchaseConfigReducer,
  userProfileDataReducer,
  myScooterReducer
}) => {
  return {
    cmpProps: {
      productId: purchaseConfigReducer.productId,
      productData: purchaseConfigReducer.productData,
      aadhar: purchaseConfigReducer.aadhar,
      gst: purchaseConfigReducer.gst,
      payment: purchaseConfigReducer.payment,
      eccentricImage: purchaseConfigReducer.eccentricImage,
      userLocation: {
        pincode: userProfileDataReducer.pincode,
        city: userProfileDataReducer.city,
        state: userProfileDataReducer.state,
        country: userProfileDataReducer.country
      },
      myScooter: {
        configuredAccessories: myScooterReducer.configuredAccessories
      }
    }
  };
};

export default connect(mapStateToProps)(PurchaseConfigurator);
