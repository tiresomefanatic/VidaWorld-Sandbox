import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import NextSteps from "../NextSteps/NextSteps";
import CONSTANT from "../../../site/scripts/constant";

const PaymentSuccess = (props) => {
  const {
    config,
    orderId,
    displayOrderId,
    status,
    insuranceAvailability,
    modelVariant,
    modelSku,
    paymentView,
    showNextSteps,
    documentSection,
    exchangeDataDetails
  } = props;

  const imgPath = appUtils.getConfig("imgPath");
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const configurationUrl = appUtils.getPageUrl("configurationUrl");

  return (
    <>
      {paymentView === CONSTANT.PURCHASE_VIEW.PREBOOKING ? (
        <div className="vida-prebooking-success">
          <div className="vida-prebooking-success__container">
            <div className="vida-prebooking-success__title">
              <h1>{config.title}</h1>
              {modelVariant && (
                <p className="vida-prebooking-success__confimation-msg">
                  {status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS &&
                    config.successMessage}
                  {status.toLowerCase() ===
                    CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING &&
                    config.pendingMessage}{" "}
                  {modelVariant}
                </p>
              )}
            </div>
            {orderId && (
              <div className="vida-prebooking-success__order-id">
                <h4>
                  {config.orderDetails.message} {orderId}
                </h4>

                <p className="vida-prebooking-success__confimation-msg">
                  {config.orderDetails.subText}
                </p>
              </div>
            )}

            <div className="vida-prebooking-success__order-id">
              <h4>{config.launchDetails.message}</h4>

              <p className="vida-prebooking-success__confimation-msg">
                {config.launchDetails.subText}
              </p>
            </div>
            {/* Commenting as per Story EMBU-2287 #2 */}
            {/* <div className="vida-prebooking-success__order-id">
              {config.disclaimer && (
                <>
                  <h3>{config.disclaimer.title}</h3>
                  <p className="vida-prebooking-success__confimation-msg">
                    {config.disclaimer.subText}{" "}
                  </p>
                </>
              )}
            </div> */}
            <div className="vida-prebooking-success__action">
              {/* Commenting as per Story EMBU-2287 #3 */}
              {/* {config.configureBtn && (
                <div className="vida-prebooking-success__action-btn">
                  <a
                    className="btn btn--primary btn--full-width"
                    href={configurationUrl}
                  >
                    {config.configureBtn.label}
                  </a>
                </div>
              )} */}
              {config.profileBtn && (
                <div className="vida-prebooking-success__action-btn">
                  <a
                    className="btn btn--primary btn--full-width"
                    href={profileUrl}
                  >
                    {config.profileBtn.label}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="vida-prebooking-success__image-container">
            {modelSku && (
              <div className="vida-scooter-info__image">
                <img
                  className="vida-scooter-info__product-image"
                  src={`${imgPath}${modelSku}.png`}
                  alt="Scooter Image"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="vida-booking-success">
          <div className="vida-booking-success__wrapper">
            <div className="vida-booking-success__congrats-wrapper">
              <div className="vida-booking-success__image-container">
                <div className="vida-scooter-info__image">
                  <img
                    className="vida-scooter-info__product-image"
                    src={`${imgPath}${modelSku}.png`}
                    alt="Scooter Image"
                  />
                </div>
              </div>
              <div className="vida-booking-success__container">
                <div className="vida-booking-success__title">
                  <h1>{config.title}</h1>
                  <p className="vida-booking-success__confirmation-msg">
                    {status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS &&
                      config.successMessage}
                    {status.toLowerCase() ===
                      CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING &&
                      config.pendingMessage}{" "}
                    {modelVariant}
                  </p>
                </div>
                <div className="vida-booking-success__order-id">
                  <h4>
                    {config.orderDetails.message} {displayOrderId}
                  </h4>
                  <p
                    className="vida-booking-success__confirmation-msg"
                    dangerouslySetInnerHTML={{
                      __html: config.orderDetails.subText
                    }}
                  ></p>
                </div>
                <div className="vida-booking-success__confirmation-head">
                  <p className="vida-booking-success__order-msg">
                    {config.launchDetails.message}
                  </p>
                  <p className="vida-booking-success__confirmation-msg">
                    <span>{config.launchDetails.subText}</span>{" "}
                    {profileUrl && (
                      <span>
                        <a href={profileUrl}>
                          {config.launchDetails.trackDeliveryLabel}
                        </a>
                      </span>
                    )}
                  </p>
                  <p className="vida-booking-success__confirmation-msg">
                    {config.launchDetails.info}
                  </p>
                </div>
                <div className="vida-booking-success__order-id">
                  <p className="vida-booking-success__disclaimer">
                    {config.disclaimer.subText}
                  </p>
                </div>
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
      )}
    </>
  );
};
PaymentSuccess.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    successMessage: PropTypes.string,
    pendingMessage: PropTypes.string,
    disclaimer: PropTypes.shape({
      title: PropTypes.string,
      subText: PropTypes.string
    }),
    configureBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    profileBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    launchDetails: PropTypes.shape({
      message: PropTypes.string,
      subText: PropTypes.string,
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
  status: PropTypes.string,
  exchangeDataDetails: PropTypes.bool,
  insuranceAvailability: PropTypes.bool,
  modelVariant: PropTypes.string,
  modelSku: PropTypes.string,
  configMessages: PropTypes.object,
  paymentView: PropTypes.string,
  showNextSteps: PropTypes.bool,
  documentSection: PropTypes.object
};
export default PaymentSuccess;
