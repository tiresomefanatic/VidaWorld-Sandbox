import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dateUtils from "../../../../site/scripts/utils/dateUtils";

const DeliveryTracker = ({ config, progressStatus }) => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const pagePathName = window.location.pathname;

  useEffect(() => {
    setDeliveryDate(dateUtils.calcDeliveryDate());
  }, []);

  return (
    <div className="delivery-tracker-wrapper">
      <div className="delivery-tracker-container">
        <p className="delivery-tracker-title">
          {config?.deliveryTrackerTitle}
          {/* Date will be displayed as common message as 15 days */}
          {pagePathName?.includes("payment-summary") ||
          pagePathName?.includes("partial-payment")
            ? " " + deliveryDate
            : ""}
        </p>
        <p className="delivery-tracker-description">
          {config?.deliveryTrackerDescription}
        </p>
        <div className={`delivery-stepper-tracker-container ${progressStatus}`}>
          <div className="stepper-initial-tracker">
            <div className="stepper-initial-circle"></div>
            <div className="stepper-initial-line"></div>
          </div>
          <div className="stepper-tracker-bar-container">
            {config?.deliveryTrackerStepperContent?.map((item, index) => (
              <div className="stepper-tracker-bar" key={index}>
                <div className="stepper-tracker-bar-flex-container">
                  <div className="stepper-tracker-circle">
                    <div className="stepper-tracker-image">
                      <img src={item?.icon} alt="payment_icon"></img>
                    </div>
                  </div>
                  <div className="stepper-tracker-line"></div>
                </div>
                <div className="stepper-tracker-title">
                  <p className="stepper-tracker-title-text">{item?.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="stepper-end-tracker">
            <div className="stepper-end-line"></div>
            <div className="stepper-end-circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;

DeliveryTracker.propTypes = {
  config: PropTypes.shape({
    deliveryTrackerTitle: PropTypes.string,
    deliveryTrackerDescription: PropTypes.string,
    deliveryTrackerStepperContent: PropTypes.arrayOf(PropTypes.any)
  }),
  progressStatus: PropTypes.string
};
