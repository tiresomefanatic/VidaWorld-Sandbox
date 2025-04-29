import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import { connect } from "react-redux";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import BillingPricingPaymentNew from "../BillingPricingPaymentNew/BillingPricingPaymentNew";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import breakpoints from "../../../site/scripts/media-breakpoints";

const DeliveryStatusNew = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const targetElement = useRef();

  const {
    formId,
    currentStatus,
    deliveryStatusConfig,
    productDataDetails,
    paymentDetails,
    // insuranceDetails,
    triggerAction,
    paymentHandler,
    loanLeasePaymentHandler,
    billingPricingConfig,
    setPaymentMode,
    billingAddresses,
    shippingAddresses,
    tradeIn,
    handlePaymentSubmit,
    paymentMode,
    customizedRequestsRef,
    setIsOpenConfigurePopup,
    hasExchangeApprovedChanged
  } = props;

  const {
    helpLink,
    saveBtn,
    configBtn,
    paymentBtn,
    centrePayBtn,
    statuses,
    deliveryMessage,
    applyBtn,
    paymentOption,
    shippingAddressError,
    billingAddressError,
    customizedRequests,
    exchangeApprovalInfo,
    termsAndCondition
  } = deliveryStatusConfig;
  const imgPath = appUtils.getConfig("imgPath");
  const [customizehidden, setCustomizehidden] = useState(true);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState();

  const checkMandatoryFieldsFilled = () => {
    let errMsg = "";
    if (!billingAddresses.addressLine1 || !billingAddresses.addressLine2) {
      errMsg = billingAddressError;
    } else if (
      !shippingAddresses.addressLine1 ||
      !shippingAddresses.addressLine2 ||
      !shippingAddresses.pincode
    ) {
      errMsg = shippingAddressError;
    }
    return errMsg;
  };
  const handlePayment = () => {
    const isErrorMsg = checkMandatoryFieldsFilled();
    if (isErrorMsg) {
      showNotificationDispatcher({
        title: isErrorMsg,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    } else {
      paymentHandler && paymentHandler(triggerAction);
    }
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const content = document.getElementById(termsAndCondition.contentId);
    setTermsContent(content.innerHTML);
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleLoanLeasePayment = () => {
    const isErrorMsg = checkMandatoryFieldsFilled();
    if (isErrorMsg) {
      showNotificationDispatcher({
        title: isErrorMsg,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    } else {
      loanLeasePaymentHandler && loanLeasePaymentHandler(paymentMode);
    }
  };
  const scrollingTop = (event) => {
    const elmnt = targetElement;
    elmnt.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start"
    });
  };
  const handleChatBotEvent = (event) => {
    event.preventDefault();
    bootstrapChat && bootstrapChat();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.currentTarget.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const customizeAccordion = () => {
    setCustomizehidden(!customizehidden);
  };
  return (
    <>
      <div className="vida-delivery-status-new">
        {isDesktop && (
          <div className="vida-delivery-status-new__primary">
            {productDataDetails.eccentricImage ? (
              <img
                className="vida-delivery-status-new__product-image"
                src={productDataDetails.eccentricImage}
                alt={productDataDetails.name}
              />
            ) : (
              <img
                className="vida-delivery-status-new__product-image"
                src={imgPath + productDataDetails.variantSku + ".png"}
                alt={productDataDetails.name}
              />
            )}
            <div className="vida-delivery-status-new__product-info-new">
              <h3>{productDataDetails.name}</h3>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => setIsOpenConfigurePopup(true)}
              >
                {configBtn.label}
              </button>
            </div>
            <div className="vida-delivery-status-new__product-info-subtext">
              <h4>{deliveryMessage}</h4>
            </div>
          </div>
        )}
        <div className="vida-delivery-status-new__secondary">
          {isDesktop && (
            <div className="vida-delivery-status-new__product-info-new">
              <h4>{paymentOption.label}</h4>
            </div>
          )}
          {!isDesktop && (
            <div className="vida-delivery-status-new__btn-container">
              <h3>{productDataDetails.name}</h3>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => setIsOpenConfigurePopup(true)}
              >
                {configBtn.label}
              </button>
            </div>
          )}
          {isDesktop && (
            <div className="vida-billing-pricing-new__payment-container">
              <BillingPricingPaymentNew
                billingPricingConfig={billingPricingConfig}
                paymentMode={triggerAction}
                setPaymentMode={setPaymentMode}
                scrollingTop={scrollingTop}
              ></BillingPricingPaymentNew>
            </div>
          )}
          <div className="form__group form__field-button vida-delivery-status-new__submit-form">
            <div
              className={
                !customizehidden ? "customize-accordion--expanded" : ""
              }
            >
              <label
                onClick={customizeAccordion}
                className="form__field-label customize-accordion-header"
              >
                {customizedRequests.label}
              </label>
              <textarea
                name="customizedRequests"
                className="form__field-textarea"
                placeholder={customizedRequests.placeholder}
                ref={customizedRequestsRef}
              ></textarea>
            </div>
            <div
              className={
                "vida-delivery-status-new__submit-form-btn " +
                (!isDesktop ? "mobile" : "")
              }
            >
              {tradeIn.tradeInSelected && !tradeIn.exchange_approved && (
                <div className="exchange-notapproved">
                  {exchangeApprovalInfo}
                </div>
              )}
              {formId ? (
                triggerAction === "updateDetails" && (
                  <button
                    className="btn btn--primary"
                    type="submit"
                    form={formId}
                  >
                    {saveBtn.label}
                  </button>
                )
              ) : (
                <>
                  {paymentMode === CONSTANT.PAYMENT_METHOD.LOAN ||
                  paymentMode === CONSTANT.PAYMENT_METHOD.LEASE ? (
                    <button
                      className={`btn btn--primary ${
                        tradeIn.tradeInSelected && !tradeIn.exchange_approved
                          ? "disabled"
                          : ""
                      }`}
                      type="button"
                      onClick={() =>
                        handlePaymentSubmit(handleLoanLeasePayment)
                      }
                      ref={targetElement}
                    >
                      {applyBtn.label}
                    </button>
                  ) : (
                    <button
                      className={`btn btn--primary ${
                        tradeIn.tradeInSelected && !tradeIn.exchange_approved
                          ? "disabled"
                          : ""
                      }`}
                      type="button"
                      onClick={() => handlePaymentSubmit(handlePayment)}
                      ref={targetElement}
                    >
                      {triggerAction === CONSTANT.PAYMENT_MODE.ONLINE &&
                        paymentBtn.label}

                      {triggerAction === CONSTANT.PAYMENT_MODE.CASH &&
                        centrePayBtn.label}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="vida-delivery-status-new__help-text">
            {helpLink.helpLabel}{" "}
            <a href="#" onClick={(event) => handleChatBotEvent(event)}>
              {helpLink.chatLabel}
            </a>
            <div>
              <a
                href="#"
                onClick={(event) => handleTermsandConditions(event)}
                rel="noreferrer"
              >
                {termsAndCondition.labelText}
              </a>
            </div>
          </div>
        </div>
      </div>
      {showTermsPopup && (
        <div className="vida-terms-conditions">
          <div className="vida-terms-conditions__container">
            <div className="vida-terms-conditions__body">
              <div className="vida-terms-conditions__body-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent
                  }}
                ></div>
              </div>
            </div>
            <div className="vida-terms-conditions__btn-wrap">
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {termsAndCondition.btnLabelClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    productDataDetails: purchaseConfigReducer.productData,
    paymentDetails: purchaseConfigReducer.payment,
    billingAddresses: purchaseConfigReducer.billingAddresses,
    shippingAddresses: purchaseConfigReducer.shippingAddresses,
    tradeIn: purchaseConfigReducer.tradeIn
    // insuranceDetails: purchaseConfigReducer.insurance
  };
};

DeliveryStatusNew.propTypes = {
  customizedRequestsRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    PropTypes.string,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  deliveryStatusConfig: PropTypes.shape({
    customizedRequests: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    helpLink: PropTypes.object,
    saveBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    configBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    paymentBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    centrePayBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    paymentOption: PropTypes.shape({
      label: PropTypes.string
    }),
    termsAndCondition: PropTypes.shape({
      labelText: PropTypes.string,
      btnLabelClose: PropTypes.string,
      contentId: PropTypes.string
    }),
    statuses: PropTypes.any,
    deliveryMessage: PropTypes.string,
    shippingAddressError: PropTypes.string,
    billingAddressError: PropTypes.string,
    exchangeApprovalInfo: PropTypes.string,
    applyBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  setIsOpenConfigurePopup: PropTypes.func,
  paymentHandler: PropTypes.func,
  formId: PropTypes.string,
  currentStatus: PropTypes.number,
  triggerAction: PropTypes.string,
  productDataDetails: PropTypes.object,
  paymentDetails: PropTypes.object,
  loanLeasePaymentHandler: PropTypes.func,
  setPaymentMode: PropTypes.func,
  billingPricingConfig: PropTypes.object,
  billingAddresses: PropTypes.object,
  shippingAddresses: PropTypes.object,
  tradeIn: PropTypes.object,
  // insuranceDetails: PropTypes.object,
  handlePaymentSubmit: PropTypes.func,
  paymentMode: PropTypes.string,
  hasExchangeApprovedChanged: PropTypes.bool
};

DeliveryStatusNew.defaultProps = {
  currentStatus: 0
};
export default connect(mapStateToProps)(DeliveryStatusNew);
