import React from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../site/scripts/utils/appUtils";

const PaymentFailure = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { config, paymentView, modelSku, CCAvenueStatus } = props;
  const imgPath = appUtils.getConfig("imgPath");

  const preBookingUrl = appUtils.getPageUrl("preBookingUrl");
  const quickReserveUrl = appUtils.getPageUrl("quickReserveUrl");
  const reserveRedirectionUrl =
    CCAvenueStatus === CONSTANT.REDIRECTION_STATUS.QUICK_RESERVE
      ? quickReserveUrl
      : preBookingUrl;
  const profileUrl = appUtils.getPageUrl("profileUrl");

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
    <div className="vida-payment-failure">
      <div className="vida-payment-failure__image-container">
        <div className="vida-scooter-info__image">
          <img
            className="vida-scooter-info__product-image"
            src={`${imgPath}${modelSku}.png`}
            alt="Scooter Image"
          />
        </div>
      </div>
      <div className="form__group form__group--error vida-payment-failure__message-container">
        <h2 className="vida-payment-failure__heading">{config.title}</h2>
        <label className="form__field-label vida-payment-failure__detail">
          {config.message}
        </label>

        <div className="vida-payment-failure__btn-container">
          {paymentView === CONSTANT.PURCHASE_VIEW.PREBOOKING && (
            <a
              href={reserveRedirectionUrl}
              className="btn btn--primary btn--full-width"
            >
              {config.retryPaymentBtn.label}
            </a>
          )}

          {/* TODO: This should redirect to billingPricingUrl instead of profileUrl  */}
          {paymentView === CONSTANT.PURCHASE_VIEW.BOOKING && (
            <a href={profileUrl} className="btn btn--primary btn--full-width">
              {config.retryPaymentBtn.label}
            </a>
          )}

          {paymentView === CONSTANT.PURCHASE_VIEW.OUTSTANDING && (
            <a href={profileUrl} className="btn btn--primary btn--full-width">
              {config.retryPaymentBtn.label}
            </a>
          )}
        </div>

        <div className="vida-payment-failure__help-text">
          {config.helpLink.helpLabel}{" "}
          <a href="#" onClick={(event) => handleChatBotEvent(event)}>
            {config.helpLink.chatLabel}
          </a>
        </div>
      </div>
    </div>
  );
};
PaymentFailure.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    imageUrl: PropTypes.string,
    retryPaymentBtn: PropTypes.shape({
      label: PropTypes.string,
      actionUrl: PropTypes.string
    }),
    helpLink: PropTypes.shape({
      helpLabel: PropTypes.string,
      chatLabel: PropTypes.string
    })
  }),
  paymentView: PropTypes.string,
  modelSku: PropTypes.string,
  CCAvenueStatus: PropTypes.string
};
export default PaymentFailure;
