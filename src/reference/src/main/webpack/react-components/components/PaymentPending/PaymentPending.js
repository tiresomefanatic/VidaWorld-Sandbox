import React from "react";
import PropTypes from "prop-types";
import NextSteps from "../NextSteps/NextSteps";
import appUtils from "../../../site/scripts/utils/appUtils";

const PaymentPending = (props) => {
  const {
    config,
    orderId,
    displayOrderId,
    modelVariant,
    insuranceAvailability,
    showNextSteps,
    exchangeDataDetails,
    documentSection
  } = props;
  const profileUrl = appUtils.getPageUrl("profileUrl");

  return (
    <div className="vida-payment-pending">
      <div className="vida-payment-pending__pending-wrapper">
        <div className="vida-payment-pending__container">
          <div className="vida-payment-pending__title">
            <h1>{config.title}</h1>
            {modelVariant && (
              <p className="vida-payment-pending__confimation-msg">
                {config.message} {modelVariant}
              </p>
            )}
          </div>

          <div className="vida-payment-pending__order-id">
            <h4>
              {config.orderDetails.message} {displayOrderId}
            </h4>
            <p
              className="vida-payment-pending__confimation-msg"
              dangerouslySetInnerHTML={{
                __html: config.orderDetails.subText
              }}
            >
              {}
            </p>
          </div>
          <div className="vida-payment-pending__order-id">
            <h4>{config.confirmationDetails.title}</h4>
          </div>

          <div className="vida-payment-pending__confirm-details">
            <p className="vida-payment-pending__confirm_message">
              <span>{config.confirmationDetails.message}</span>{" "}
              {profileUrl && (
                <span>
                  <a href={profileUrl}>
                    {config.confirmationDetails.trackDeliveryLabel}
                  </a>
                </span>
              )}
            </p>
            <p className="vida-payment-pending__confirm_message">
              {config.confirmationDetails.info}
            </p>
          </div>
        </div>
        {documentSection && showNextSteps && (
          <NextSteps
            config={documentSection}
            orderId={orderId}
            displayOrderId={displayOrderId}
            insuranceAvailability={insuranceAvailability}
            exchangeDataDetails={exchangeDataDetails}
          ></NextSteps>
        )}
      </div>
    </div>
  );
};

PaymentPending.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    confirmationDetails: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      trackDeliveryLabel: PropTypes.string,
      info: PropTypes.string
    }),
    orderDetails: PropTypes.shape({
      message: PropTypes.string,
      subText: PropTypes.string
    })
  }),
  orderId: PropTypes.string,
  displayOrderId: PropTypes.string,
  modelVariant: PropTypes.string,
  exchangeDataDetails: PropTypes.bool,
  insuranceAvailability: PropTypes.bool,
  showNextSteps: PropTypes.bool,
  documentSection: PropTypes.object
};
export default PaymentPending;
