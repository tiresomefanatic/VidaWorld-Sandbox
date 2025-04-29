import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import { connect } from "react-redux";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";

const DeliveryStatus = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const {
    formId,
    currentStatus,
    deliveryStatusConfig,
    productDataDetails,
    paymentDetails,
    // insuranceDetails,
    triggerAction,
    paymentHandler,
    redirectionHandler,
    paymentMethod,
    loanLeasePaymentHandler
  } = props;

  const { helpLink, saveBtn, paymentBtn, centrePayBtn, statuses, applyBtn } =
    deliveryStatusConfig;
  const imgPath = appUtils.getConfig("imgPath");

  const handleBackButton = () => {
    redirectionHandler && redirectionHandler();
  };

  const handlePayment = () => {
    paymentHandler && paymentHandler();
  };

  const handleLoanLeasePayment = () => {
    loanLeasePaymentHandler && loanLeasePaymentHandler(paymentMethod);
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
  return (
    <div className="vida-delivery-status">
      {productDataDetails.eccentricImage ? (
        <img
          className="vida-delivery-status__product-image"
          src={productDataDetails.eccentricImage}
          alt={productDataDetails.name}
        />
      ) : (
        <img
          className="vida-delivery-status__product-image"
          src={imgPath + productDataDetails.variantSku + ".png"}
          alt={productDataDetails.name}
        />
      )}

      <div className="vida-delivery-status__product-info">
        <h3>{productDataDetails.name}</h3>
        {paymentDetails.updatedOrderGrandTotal > 0 && (
          <h3>
            {currencyUtils.getCurrencyFormatValue(
              paymentDetails.updatedOrderGrandTotal
            )}
          </h3>
        )}
      </div>
      <nav className="vida-delivery-status__stepper">
        {statuses.map((e) => {
          return (
            <ul key={e.id}>
              <li>
                <div className="vida-delivery-status__steps">
                  <div>
                    {e.id < currentStatus && (
                      <i className="icon-check-circle"></i>
                    )}
                    {e.id === currentStatus && (
                      <img
                        className="vida-delivery-status__stepper-image"
                        src={imgPath + "stepper-scooter.png"}
                        alt="Stepper Scooter"
                      ></img>
                    )}
                    {e.id > currentStatus && (
                      <span className="vida-delivery-status__stepper-next"></span>
                    )}
                  </div>
                  <div
                    className={
                      e.id === currentStatus
                        ? "vida-delivery-status__info-active"
                        : "vida-delivery-status__info"
                    }
                  >
                    <h3>
                      {e.id === 3 && paymentMethod
                        ? paymentMethod.toLowerCase() ===
                          CONSTANT.PAYMENT_METHOD.LOAN
                          ? e.label.loan
                          : paymentMethod.toLowerCase() ===
                            CONSTANT.PAYMENT_METHOD.LEASE
                          ? e.label.lease
                          : e.label.payment
                        : e.label}
                    </h3>
                  </div>
                </div>
              </li>
            </ul>
          );
        })}
      </nav>
      <div className="form__group form__field-button">
        <span className="form__field-button-icon" onClick={handleBackButton}>
          <i className="icon-arrow"></i>
        </span>
        {formId ? (
          triggerAction === "updateDetails" && (
            <button className="btn btn--primary" type="submit" form={formId}>
              {saveBtn.label}
            </button>
          )
        ) : (
          <>
            {paymentMethod === CONSTANT.PAYMENT_METHOD.LOAN ||
            paymentMethod === CONSTANT.PAYMENT_METHOD.LEASE ? (
              <button
                className="btn btn--primary"
                type="button"
                onClick={handleLoanLeasePayment}
              >
                {applyBtn.label}
              </button>
            ) : (
              <button
                className="btn btn--primary"
                type="button"
                onClick={handlePayment}
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

      <div className="vida-delivery-status__help-text">
        {helpLink.helpLabel}{" "}
        <a href="#" onClick={(event) => handleChatBotEvent(event)}>
          {helpLink.chatLabel}
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    productDataDetails: purchaseConfigReducer.productData,
    paymentDetails: purchaseConfigReducer.payment
    // insuranceDetails: purchaseConfigReducer.insurance
  };
};

DeliveryStatus.propTypes = {
  redirectionHandler: PropTypes.func,
  deliveryStatusConfig: PropTypes.shape({
    helpLink: PropTypes.object,
    saveBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    paymentBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    centrePayBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    statuses: PropTypes.any,
    applyBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  paymentHandler: PropTypes.func,
  formId: PropTypes.string,
  currentStatus: PropTypes.number,
  triggerAction: PropTypes.string,
  productDataDetails: PropTypes.object,
  paymentDetails: PropTypes.object,
  paymentMethod: PropTypes.string,
  loanLeasePaymentHandler: PropTypes.func
  // insuranceDetails: PropTypes.object
};

DeliveryStatus.defaultProps = {
  currentStatus: 0
};
export default connect(mapStateToProps)(DeliveryStatus);
