import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import BillingDetailsNew from "../BillingDetailsNew/BillingDetailsNew";
import PricingDetailsNew from "../PricingDetailsNew/PricingDetailsNew";
import BillingOptBuyBackNew from "../BillingOptBuyBackNew/BillingOptBuyBackNew";
import BillingHomeDelivery from "../BillingHomeDelivery/BillingHomeDelivery";
import PropTypes from "prop-types";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  useOptimizedGetOrderData,
  useUpdateOptimizedOrder
} from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { useUserData } from "../../hooks/userProfile/userProfileHooks";
import { useBookingPaymentInfo } from "../../hooks/payment/paymentHooks";
import DeliveryStatusNew from "../DeliveryStatusNew/DeliveryStatusNew";
import CONSTANT from "../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useLoanLeasePaymentInfo } from "../../hooks/loanLeasePayment/loanLeasePaymentHooks";
import Popup from "../Popup/Popup";
import BillingPricingPaymentNew from "../BillingPricingPaymentNew/BillingPricingPaymentNew";
import breakpoints from "../../../site/scripts/media-breakpoints";
import BillingConfigure from "./BillingConfigure/BillingConfigure";
import { useGetMyScooterDetails } from "../../hooks/myScooter/myScooterHooks";
import ShowVariants from "../ShowVariants/ShowVariants";
import IndividualCorporate from "./IndividualCorporate/IndividualCorporate";

const BillingPricingDetailsNew = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const {
    config,
    payment,
    order,
    subscription,
    aadhar,
    billingAddresses,
    shippingAddresses,
    gstdetails,
    productData,
    productId,
    insurance,
    tradeIn,
    userLocation,
    myScooter,
    homeDelivery
  } = props;
  const {
    billingDetails,
    pricingConfig,
    paymentOption,
    optBuyBackConfig,
    homeDeliveryConfig,
    gstConfig,
    scooterInfo,
    policySelection,
    exchangePolicyDetails,
    billingShippingConfig,
    deliveryStatusConfig,
    infoBox,
    loanErrorMsg,
    configureConfig,
    showHomeDelivery
  } = config;

  const getOrderData = useOptimizedGetOrderData();
  const getUserData = useUserData();
  const updateOrderData = useUpdateOptimizedOrder();
  const [paymentMode, setPaymentMode] = useState(CONSTANT.PAYMENT_MODE.ONLINE);
  const [buybackOpted, setBuybackOpted] = useState(true);
  const currentStatus = 3;
  const queryString = location.href.split("?")[1];
  const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const [showInsuranceCheckPopup, setShowInsuranceCheckPopup] = useState(false);
  const [showSubsidyCheckPopup, setShowSubsidyCheckPopup] = useState(false);
  const [isLoanAlreadySubmittedPopup, setIsLoanAlreadySubmittedPopup] =
    useState(false);
  const [isopenConfigurePopup, setIsOpenConfigurePopup] = useState(false);
  const [loanSubmissionError, setIsLoanSubmissionError] = useState(false);
  const [callPaymentFunction, setCallPaymentFunction] = useState(() => false);
  const [subsidyChecked, setSubsidyChecked] = useState(false);
  const { tradeInSelected, popupError } = tradeIn;
  const [exchangeSelected, setExchangeSelected] = useState(tradeInSelected);
  const customizedRequestsRef = useRef("");
  const [showGstPopup, setShowGstPopup] = useState(false);
  const [originalGstValue, setOriginalGstValue] = useState(false);
  const [hasExchangeApprovedChanged, setHasExchangeApprovedChanged] =
    useState(false);
  const [CustomerType, setCustomerType] = useState(
    CONSTANT.CUSTOMER_TYPES.INDIVIDUAL
  );
  const [homeDeliveryOpted, setHomeDeliveryOpted] = useState(true);

  useEffect(() => {
    setExchangeSelected(tradeInSelected);
  }, [tradeInSelected]);

  // useEffect(() => {
  //   if (aadhar.fameSubsidyAmount > 0) {
  //     setSubsidyChecked(aadhar.fameSubsidyAmount > 0);
  //   }
  // }, [aadhar.fameSubsidyAmount]);
  useEffect(() => {
    if (aadhar.empsSubsidyAmount > 0) {
      setSubsidyChecked(aadhar.empsSubsidyAmount > 0);
    }
  }, [aadhar.empsSubsidyAmount]);

  const bookingStatusUrl = appUtils.getPageUrl("bookingStatusUrl");

  const createQueryVariables = (paymentMethod) => {
    let selectedPayment = "";
    if (
      paymentMethod === CONSTANT.PAYMENT_MODE.ONLINE ||
      paymentMethod === CONSTANT.PAYMENT_MODE.CASH
    ) {
      selectedPayment = CONSTANT.PAYMENT_METHOD.FULL_PAYMENT;
    }
    if (paymentMethod === CONSTANT.PAYMENT_MODE.LOAN) {
      selectedPayment = CONSTANT.PAYMENT_METHOD.LOAN;
    }
    if (paymentMethod === CONSTANT.PAYMENT_MODE.LEASE) {
      selectedPayment = CONSTANT.PAYMENT_METHOD.LEASE;
    }

    const variables = {
      order_id: order.orderId,
      subscription_plan_id: subscription.package_id,
      aadhar_selected: subsidyChecked,
      aadhar_number: aadhar.aadharNumber,
      aadhar_used_for_register: aadhar.aadharUsedForRegister,
      gst_selected: gstdetails.gstSelected,
      gst_number: gstdetails.gstNumber,
      company_name: gstdetails.companyName,
      company_email: gstdetails.companyEmail,
      selected_payment: selectedPayment,
      payment_method: paymentMethod,
      insurer_id: insurance.insurerId,
      insurance_addons: insurance.insuranceAddons,
      cpa_opted: insurance.cpaOpted ? "Y" : "N",
      cpa_reason: insurance.cpaNotOptedReason,
      paymentType: paymentMethod.toUpperCase(),
      buyBack: buybackOpted,
      exchange_selected: exchangeSelected ? "Y" : "N",
      customer_remarks: customizedRequestsRef?.current?.value,
      home_delivery_opt_in: false,
      address: {
        billing_address_landmark: billingAddresses.addressLandmark,
        billing_address_line1: billingAddresses.addressLine1,
        billing_address_line2: billingAddresses.addressLine2,
        billing_city: billingAddresses.city,
        billing_country: billingAddresses.country || "",
        billing_pincode: billingAddresses.pincode,
        billing_state: billingAddresses.state,
        same_as_billing: shippingAddresses.sameAsBilling ? "1" : "0",
        shipping_address_landmark: shippingAddresses.addressLandmark,
        shipping_address_line1: shippingAddresses.addressLine1,
        shipping_address_line2: shippingAddresses.addressLine2,
        shipping_city: shippingAddresses.city,
        shipping_country: shippingAddresses.country || "",
        shipping_pincode: shippingAddresses.pincode,
        shipping_state: shippingAddresses.state
      },
      home_delivery_opt_in: homeDelivery.homeDeliverySelected
    };
    return variables;
  };

  const handleSetPaymentMode = (value) => {
    setPaymentMode(value);
  };

  const handleSetBuyBack = (value) => {
    setBuybackOpted(value);
  };

  const handleSetHomeDelivery = (value) => {
    setHomeDeliveryOpted(value);
  };

  const fameSubsidyCheck = (paymentFunction) => {
    if (!subsidyChecked) {
      setCallPaymentFunction(() => paymentFunction);
      setShowSubsidyCheckPopup(true);
    } else {
      paymentFunction();
    }
  };

  const handlePaymentSubmit = (paymentFunction) => {
    if (
      !gstdetails.gstSelected &&
      CustomerType != CONSTANT.CUSTOMER_TYPES.INDIVIDUAL
    ) {
      setShowGstPopup(true);
    } else if (!insurance.insurerId) {
      if (subsidyChecked) {
        setCallPaymentFunction(() => paymentFunction);
      } else {
        setCallPaymentFunction(() => () => fameSubsidyCheck(paymentFunction));
      }

      setShowInsuranceCheckPopup(true);
    } else if (!subsidyChecked) {
      fameSubsidyCheck(paymentFunction);
      //setCallPaymentFunction(() => paymentFunction);
      //setShowSubsidyCheckPopup(true);
    } else if (paymentFunction) {
      paymentFunction();
    }
  };
  const [showPopup, setShowPopup] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState();
  const loanLeasePayment = useLoanLeasePaymentInfo();
  const bookingPaymentInfo = useBookingPaymentInfo();

  const loanLeasePaymentCallback = async () => {
    const params = {
      order_id: order.orderId,
      application_type: paymentMode
    };
    const loanLeasePaymentResult = await loanLeasePayment({
      variables: params
    });
    return loanLeasePaymentResult;
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

  const handleLoanLeasePayment = async (paymentMethod) => {
    setSpinnerActionDispatcher(true);
    updateOrderData({
      variables: createQueryVariables(paymentMethod)
    }).then((data) => {
      if (
        data.data &&
        data.data.opUpdateSaleOrder &&
        data.data.opUpdateSaleOrder.status_code == "200"
      ) {
        setSpinnerActionDispatcher(true);
        loanLeasePaymentCallback().then((res) => {
          if (res.data && res.data.createLoanLeaseApplication) {
            const url = res.data.createLoanLeaseApplication.application_link;
            if (url) {
              setShowPopup(true);
              setPaymentUrl(url);
            }
          }
        });
      } else if (
        data.data &&
        data.data.opUpdateSaleOrder &&
        data.data.opUpdateSaleOrder.status_code == "LOAN_PENDING"
      ) {
        setIsLoanSubmissionError(data.data.opUpdateSaleOrder.message);
        setIsLoanAlreadySubmittedPopup(true);
      }
    });
  };

  const handlePayment = async (paymentMethod) => {
    setSpinnerActionDispatcher(true);
    updateOrderData({
      variables: createQueryVariables(paymentMethod)
    }).then((data) => {
      if (
        data.data &&
        data.data.opUpdateSaleOrder &&
        data.data.opUpdateSaleOrder.status_code == "200"
      ) {
        const url = data.data.opUpdateSaleOrder.payment_url;
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
        if (url && paymentMode === CONSTANT.PAYMENT_MODE.ONLINE) {
          window.location.href = url;
        } else if (
          paymentMode === CONSTANT.PAYMENT_MODE.CASH &&
          order.orderId
        ) {
          window.location.href = `${bookingStatusUrl}?status=${
            order.payment_status
              ? order.payment_status
              : CONSTANT.PAYMENT_STATUS.PAYMENT_PENDING
          }&orderId=${order.orderId}`;
        }
      } else if (
        data.data &&
        data.data.opUpdateSaleOrder &&
        data.data.opUpdateSaleOrder.status_code == "LOAN_PENDING"
      ) {
        setIsLoanSubmissionError(data.data.opUpdateSaleOrder.message);
        setIsLoanAlreadySubmittedPopup(true);
      }
    });
  };
  const getMyScooter = useGetMyScooterDetails();
  useEffect(() => {
    if (queryString) {
      if (params && params.get("orderId") && params.get("opportunityId")) {
        setSpinnerActionDispatcher(true);
        getOrderData({
          variables: {
            order_id: params.get("orderId"),
            opportunity_id: params.get("opportunityId")
          }
        }).then((res) => {
          setSpinnerActionDispatcher(true);
          if (!res.data.OpGetSaleOrderDetails.allowEdit) {
            window.location.href = profileUrl;
          } else {
            setSpinnerActionDispatcher(false);
          }
          setOriginalGstValue(
            res.data.OpGetSaleOrderDetails.gst_selected === "1"
          );
        });
        getMyScooter();
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

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  return (
    <div className="vida-billing-pricing-new bg-color--smoke-white">
      <div className="vida-container">
        <div className="vida-billing-pricing-new__payment">
          {order.orderId && (
            <>
              <div className="vida-billing-pricing-new__configure-wrapper">
                {/* <BillingConfigure configureConfig={configureConfig} /> */}
                <IndividualCorporate
                  setShowGstPopup={setShowGstPopup}
                  setCustomerType={setCustomerType}
                  CustomerType={CustomerType}
                  pricingConfig={pricingConfig}
                />
              </div>
              <div className="vida-billing-pricing-new__wrapper">
                <div className="vida-billing-pricing-new__billing">
                  <BillingDetailsNew
                    billingConfig={billingDetails}
                    gstConfig={gstConfig}
                    billingShippingConfig={billingShippingConfig}
                    setShowGstPopup={setShowGstPopup}
                    showGstPopup={showGstPopup}
                    CustomerType={CustomerType}
                    originalGstValue={originalGstValue}
                  ></BillingDetailsNew>
                </div>
                <div className="vida-billing-pricing-new__pricing">
                  <PricingDetailsNew
                    pricingConfig={pricingConfig}
                    policySelection={policySelection}
                    exchangePolicyDetails={exchangePolicyDetails}
                    showInsuranceCheckPopup={showInsuranceCheckPopup}
                    setShowInsuranceCheckPopup={setShowInsuranceCheckPopup}
                    callPaymentFunction={callPaymentFunction}
                    setSubsidyChecked={setSubsidyChecked}
                    subsidyChecked={subsidyChecked}
                    tradeInSelected={tradeInSelected}
                    popupError={popupError}
                    exchangeSelected={exchangeSelected}
                    setExchangeSelected={setExchangeSelected}
                    showSubsidyCheckPopup={showSubsidyCheckPopup}
                    setShowSubsidyCheckPopup={setShowSubsidyCheckPopup}
                    homeDeliveryOpted={homeDeliveryOpted}
                    hasExchangeApprovedChanged={hasExchangeApprovedChanged}
                    setHasExchangeApprovedChanged={
                      setHasExchangeApprovedChanged
                    }
                  ></PricingDetailsNew>
                </div>
              </div>

              <div className="vida-billing-pricing-new__wrapper">
                {payment && payment.showBuybackOpted && (
                  <div className="vida-billing-pricing-new__opt-buyback">
                    <BillingOptBuyBackNew
                      isBuyBackChecked={buybackOpted}
                      setHandleSetBuyBack={handleSetBuyBack}
                      buybackOpted={buybackOpted}
                      {...optBuyBackConfig}
                    ></BillingOptBuyBackNew>
                  </div>
                )}
                {showHomeDelivery && (
                  <div className="vida-billing-pricing-new__home-delivery">
                    <BillingHomeDelivery
                      isHomeDeliveryChecked={homeDelivery.homeDeliverySelected}
                      setHandleHomeDelivery={handleSetHomeDelivery}
                      buybackOpted={buybackOpted}
                      {...homeDeliveryConfig}
                    ></BillingHomeDelivery>
                  </div>
                )}
              </div>
            </>
          )}
          {!isDesktop && (
            <div className="vida-payment-new-mobile-wrapper">
              <div className="vida-delivery-status-new__product-info-new">
                <h3>{deliveryStatusConfig.paymentOption.label}</h3>
              </div>
              <div className="vida-payment-new-mobile-wrapper__payments">
                <BillingPricingPaymentNew
                  billingPricingConfig={paymentOption}
                  paymentMode={paymentMode}
                  setPaymentMode={setPaymentMode}
                ></BillingPricingPaymentNew>
              </div>
            </div>
          )}
          {/* <section className="notification notification--info vida-billing-pricing-new__banner">
            <div className="notification__container">
              <div className="notification__title">
                <span className="notification__icon">
                  <i className="icon-information-circle"></i>
                </span>
                <label className="notification__label">{infoBox}</label>
              </div>
            </div>
          </section> */}
        </div>
        {/* {payment.paymentMethod && ( */}
        <div className="vida-billing-pricing-new__status">
          <DeliveryStatusNew
            handlePaymentSubmit={handlePaymentSubmit}
            deliveryStatusConfig={deliveryStatusConfig}
            currentStatus={currentStatus}
            triggerAction={paymentMode}
            paymentMethod={payment.paymentMethod}
            paymentHandler={handlePayment}
            loanLeasePaymentHandler={handleLoanLeasePayment}
            billingPricingConfig={paymentOption}
            paymentMode={paymentMode}
            setPaymentMode={handleSetPaymentMode}
            customizedRequestsRef={customizedRequestsRef}
            setIsOpenConfigurePopup={setIsOpenConfigurePopup}
            hasExchangeApprovedChanged={hasExchangeApprovedChanged}
          ></DeliveryStatusNew>
          {showPopup && (
            <div className="vida-payment-new__payment-frame">
              <Popup
                mode="full-screen"
                handlePopupClose={() => setShowPopup(false)}
              >
                <div className="vida-payment-new__frame-container">
                  <iframe src={paymentUrl} allow="camera *;"></iframe>
                </div>
              </Popup>
            </div>
          )}
          {isLoanAlreadySubmittedPopup && (
            <div className="vida-pricing-new vida-pricing-new__insurance-popup-wrapper">
              <Popup
                mode="medium"
                handlePopupClose={() => {
                  setIsLoanAlreadySubmittedPopup(false);
                  window.location.href = profileUrl;
                }}
              >
                <div className="vida-pricing-new__insurance-popup">
                  <h4>{pricingConfig.loanSubmitted.warning.title}</h4>
                  <p>
                    {loanSubmissionError ||
                      pricingConfig.loanSubmitted.warning.description}
                  </p>

                  <div className="vida-pricing-new__insure-btn-container">
                    <button
                      className="btn btn--primary"
                      onClick={(event) => {
                        setIsLoanAlreadySubmittedPopup(false);
                        window.location.href = profileUrl;
                      }}
                    >
                      {pricingConfig.subsidy.yesBtn.label}
                    </button>
                  </div>
                </div>
              </Popup>
            </div>
          )}

          <ShowVariants
            setIsOpenConfigurePopup={setIsOpenConfigurePopup}
            scooterInfo={scooterInfo}
            isopenConfigurePopup={isopenConfigurePopup}
            orderId={order.orderId}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  purchaseConfigReducer,
  userProfileDataReducer,
  myScooterReducer
}) => {
  return {
    productId: purchaseConfigReducer.productId,
    productData: purchaseConfigReducer.productData,
    payment: purchaseConfigReducer.payment,
    order: purchaseConfigReducer.order,
    billingAddresses: purchaseConfigReducer.billingAddresses,
    shippingAddresses: purchaseConfigReducer.shippingAddresses,
    gstdetails: purchaseConfigReducer.gst,
    subscription: purchaseConfigReducer.subscriptionPlan,
    aadhar: purchaseConfigReducer.aadhar,
    insurance: purchaseConfigReducer.insurance,
    tradeIn: purchaseConfigReducer.tradeIn,
    userLocation: {
      pincode: userProfileDataReducer.pincode,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    myScooter: {
      configuredAccessories: myScooterReducer.configuredAccessories
    },
    homeDelivery: purchaseConfigReducer.homeDelivery
  };
};

BillingPricingDetailsNew.propTypes = {
  config: PropTypes.shape({
    billingDetails: PropTypes.object,
    optBuyBackConfig: PropTypes.object,
    homeDeliveryConfig: PropTypes.object,
    gstConfig: PropTypes.object,
    policySelection: PropTypes.object,
    exchangePolicyDetails: PropTypes.object,
    billingShippingConfig: PropTypes.object,
    pricingConfig: PropTypes.object,
    paymentOption: PropTypes.object,
    deliveryStatusConfig: PropTypes.object,
    infoBox: PropTypes.string,
    loanErrorMsg: PropTypes.string,
    configureConfig: PropTypes.object,
    scooterInfo: PropTypes.object,
    showHomeDelivery: PropTypes.bool
  }),
  handlePayment: PropTypes.func,
  payment: PropTypes.object,
  order: PropTypes.object,
  billingAddresses: PropTypes.object,
  shippingAddresses: PropTypes.object,
  productId: PropTypes.string,
  productData: PropTypes.object,
  gstdetails: PropTypes.object,
  subscription: PropTypes.object,
  aadhar: PropTypes.object,
  insurance: PropTypes.object,
  tradeIn: PropTypes.object,
  userLocation: PropTypes.object,
  myScooter: PropTypes.object,
  homeDelivery: PropTypes.object
};

export default connect(mapStateToProps)(BillingPricingDetailsNew);
