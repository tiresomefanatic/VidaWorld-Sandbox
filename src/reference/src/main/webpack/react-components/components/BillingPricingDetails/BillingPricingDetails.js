import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import BillingDetails from "../BillingDetails/BillingDetails";
import PricingDetails from "../PricingDetails/PricingDetails";
import BillingPricingPayment from "../BillingPricingPayment/BillingPricingPayment";
import BillingOptBuyBack from "../BillingOptBuyBack/BillingOptBuyBack";
import PropTypes from "prop-types";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { useGetOrderData } from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { useUserData } from "../../hooks/userProfile/userProfileHooks";
import { useBookingPaymentInfo } from "../../hooks/payment/paymentHooks";
import DeliveryStatus from "../DeliveryStatus/DeliveryStatus";
import CONSTANT from "../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useLoanLeasePaymentInfo } from "../../hooks/loanLeasePayment/loanLeasePaymentHooks";
import Popup from "../Popup/Popup";

const BillingPricingDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { config, payment, order, billingAddresses, productData, productId } =
    props;
  const {
    billingDetails,
    pricingConfig,
    paymentOption,
    optBuyBackConfig,
    deliveryStatusConfig
    // infoBox
  } = config;

  const getOrderData = useGetOrderData();
  const getUserData = useUserData();
  const [paymentMode, setPaymentMode] = useState(CONSTANT.PAYMENT_MODE.ONLINE);
  const [buybackOpted, setBuybackOpted] = useState(true);
  const currentStatus = 3;
  const queryString = location.href.split("?")[1];
  const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const billingShippingUrl = appUtils.getPageUrl("billingShippingUrl");
  const redirectionBackUrl = queryString
    ? `${billingShippingUrl}?${queryString}`
    : profileUrl;
  const bookingStatusUrl = appUtils.getPageUrl("bookingStatusUrl");

  useEffect(() => {
    if (queryString) {
      if (params && params.get("orderId") && params.get("opportunityId")) {
        setSpinnerActionDispatcher(true);
        getOrderData({
          variables: {
            order_id: params.get("orderId"),
            opportunity_id: params.get("opportunityId")
          }
        });
      } else {
        window.location.href = profileUrl;
      }
    } else {
      window.location.href = profileUrl;
    }
    getUserData();
  }, []);

  useEffect(() => {
    setBuybackOpted(payment.buybackOpted);
  }, [payment.buybackOpted]);

  const handleSetPaymentMode = (value) => {
    setPaymentMode(value);
  };

  const handleSetBuyBack = (value) => {
    setBuybackOpted(value);
  };

  const bookingPaymentInfo = useBookingPaymentInfo();
  const handlePayment = async () => {
    setSpinnerActionDispatcher(true);
    const paymentResult = await bookingPaymentInfo({
      variables: {
        order_id: params.get("orderId"),
        payment_mode: paymentMode,
        buyback_opted: buybackOpted
      }
    });
    if (
      paymentResult &&
      paymentResult.data &&
      paymentResult.data.CreateSaleOrderPayment
    ) {
      if (isAnalyticsEnabled) {
        const customLink = {
          name: "Make Payment",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        const location = {
          pinCode: billingAddresses.pincode,
          city: billingAddresses.city,
          state: billingAddresses.state,
          country: ""
        };
        const productDetails = {
          modelVariant: productData.name,
          modelColor: productData.color,
          productID: productId
        };
        analyticsUtils.trackBookingPayment(
          customLink,
          location,
          productDetails
        );
      }
      if (
        paymentResult.data.CreateSaleOrderPayment.payment_url &&
        paymentMode === CONSTANT.PAYMENT_MODE.ONLINE
      ) {
        window.location.href =
          paymentResult.data.CreateSaleOrderPayment.payment_url;
      } else if (paymentMode === CONSTANT.PAYMENT_MODE.CASH && order.orderId) {
        window.location.href = `${bookingStatusUrl}?status=${
          order.payment_status
            ? order.payment_status
            : CONSTANT.PAYMENT_STATUS.PAYMENT_PENDING
        }&orderId=${order.orderId}`;
      }
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState();
  const loanLeasePayment = useLoanLeasePaymentInfo();
  const handleLoanLeasePayment = async (paymentMethod) => {
    if (order.orderId) {
      setSpinnerActionDispatcher(true);
      const loanLeasePaymentResult = await loanLeasePayment({
        variables: {
          order_id: order.orderId,
          application_type: paymentMethod.toUpperCase()
        }
      });
      if (loanLeasePaymentResult) {
        const url =
          loanLeasePaymentResult.data.createLoanLeaseApplication
            .application_link;

        if (url) {
          setShowPopup(true);
          setPaymentUrl(url);
        }
      }
    }
  };

  const handleRedirection = () => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Back",
        position: "Bottom",
        type: "Icon",
        clickType: "other"
      };
      const additionalPageName = ":Billing details";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          if (redirectionBackUrl) {
            window.location.href = redirectionBackUrl;
          }
        }
      );
    } else if (redirectionBackUrl) {
      window.location.href = redirectionBackUrl;
    }
  };
  return (
    <div className="vida-billing-pricing bg-color--smoke-white">
      <div className="vida-container">
        <div className="vida-billing-pricing__payment">
          <div className="vida-billing-pricing__wrapper">
            <div className="vida-billing-pricing__billing">
              <BillingDetails billingConfig={billingDetails}></BillingDetails>
            </div>
            <div className="vida-billing-pricing__pricing">
              <PricingDetails pricingConfig={pricingConfig}></PricingDetails>
            </div>
          </div>

          {/* <div className="vida-billing-pricing__info-container">

            // To be uncommented after state subsidy confirmation

            <section className="notification notification--info">
              <div className="notification__container">
                <div className="notification__title">
                  <span className="notification__icon">
                    <i className="icon-information-circle"></i>
                  </span>
                  <p className="notification__description">{infoBox}</p>
                </div>
              </div>
            </section>
          </div> */}
          {payment && payment.showBuybackOpted && (
            <div className="vida-billing-pricing__opt-buyback">
              <BillingOptBuyBack
                isBuyBackChecked={payment.buybackOpted}
                setHandleSetBuyBack={handleSetBuyBack}
                {...optBuyBackConfig}
              ></BillingOptBuyBack>
            </div>
          )}
          <div className="vida-billing-pricing__payment-container">
            <BillingPricingPayment
              billingPricingConfig={paymentOption}
              paymentMode={paymentMode}
              setPaymentMode={handleSetPaymentMode}
            ></BillingPricingPayment>
          </div>
        </div>
        {payment.paymentMethod && (
          <div className="vida-billing-pricing__status">
            <DeliveryStatus
              deliveryStatusConfig={deliveryStatusConfig}
              currentStatus={currentStatus}
              triggerAction={paymentMode}
              paymentMethod={payment.paymentMethod}
              paymentHandler={handlePayment}
              loanLeasePaymentHandler={handleLoanLeasePayment}
              redirectionHandler={handleRedirection}
            ></DeliveryStatus>
            {showPopup && (
              <div className="vida-payment__payment-frame">
                <Popup
                  mode="full-screen"
                  handlePopupClose={() => setShowPopup(false)}
                >
                  <div className="vida-payment__frame-container">
                    <iframe src={paymentUrl} allow="camera *;"></iframe>
                  </div>
                </Popup>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    productId: purchaseConfigReducer.productId,
    productData: purchaseConfigReducer.productData,
    payment: purchaseConfigReducer.payment,
    order: purchaseConfigReducer.order,
    billingAddresses: purchaseConfigReducer.billingAddresses
  };
};

BillingPricingDetails.propTypes = {
  config: PropTypes.shape({
    billingDetails: PropTypes.object,
    optBuyBackConfig: PropTypes.object,
    pricingConfig: PropTypes.object,
    paymentOption: PropTypes.object,
    deliveryStatusConfig: PropTypes.object
    // infoBox: PropTypes.string
  }),
  handlePayment: PropTypes.func,
  payment: PropTypes.object,
  order: PropTypes.object,
  billingAddresses: PropTypes.object,
  productId: PropTypes.string,
  productData: PropTypes.object
};

export default connect(mapStateToProps)(BillingPricingDetails);
