import React, { useState } from "react";
import PropTypes from "prop-types";

const OwnerDetails = (props) => {
  const { customerDetails, customerInfo } = props;
  const { title } = customerDetails;
  const [showOwnerDetails, setShowOwnerDetails] = useState(true);
  const handleBreakUpDetail = () => {
    setShowOwnerDetails(!showOwnerDetails);
  };

  return (
    customerInfo && (
      <div className="vida-owner-details">
        <div className="vida-owner-details__wrapper">
          <div className="vida-owner-details__title">
            <h3>{title}</h3>
            <i
              className={showOwnerDetails ? "icon-minus" : "icon-plus"}
              onClick={handleBreakUpDetail}
            />
          </div>
          {showOwnerDetails && (
            <div className="vida-owner-details__info">
              <div className="vida-owner-details__info--title">
                {customerInfo.customerName}
              </div>
              {customerInfo.customerEmail ? (
                <div className="vida-owner-details__info--content">
                  <span className="icon-mail icon-size"></span>
                  {customerInfo.customerEmail}
                </div>
              ) : (
                ""
              )}
              {customerInfo.customerMobilePhone ? (
                <div className="vida-owner-details__info--content">
                  <span className="icon-phone icon-size"></span>
                  {customerInfo.customerMobilePhone}
                </div>
              ) : (
                ""
              )}
              {customerInfo.customerAddress ? (
                <div className="vida-owner-details__info--content">
                  <span className="icon-location-marker icon-size"></span>
                  {customerInfo.customerAddress}
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
};

OwnerDetails.propTypes = {
  customerDetails: PropTypes.shape({
    title: PropTypes.string
  }),
  customerInfo: PropTypes.object
};

export default OwnerDetails;
