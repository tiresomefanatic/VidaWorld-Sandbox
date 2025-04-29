import React, { useState } from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const RegistrationDetails = (props) => {
  const { registrationDetails, registrationData } = props;
  const {
    title,
    registrationNameLabel,
    vehicleTypeLabel,
    vehicleColorLabel,
    vehicleNameLabel,
    registrationNumberLabel,
    registrationCertificateBtn
  } = registrationDetails;

  const [showRegistrationDetails, setShowRegistrationDetails] = useState(true);
  const handleBreakUpDetail = () => {
    setShowRegistrationDetails(!showRegistrationDetails);
  };
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const handleDownloadCertificate = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "exit"
      };

      analyticsUtils.trackCtaClick(customLink);
    }
  };
  return (
    registrationData && (
      <div className="vida-registration-details">
        <div className="vida-registration-details__wrapper">
          <div className="vida-registration-details__title">
            <h3>{title}</h3>
            <i
              className={showRegistrationDetails ? "icon-minus" : "icon-plus"}
              onClick={handleBreakUpDetail}
            />
          </div>
          {showRegistrationDetails && (
            <div className="vida-registration-details__info">
              <div className="vida-registration-details__info-left">
                {registrationData.registrationName ? (
                  <div className="items">
                    <div className="items__label">{registrationNameLabel}</div>
                    <div className="items__value">
                      {registrationData.registrationName}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {registrationData.vehicleType ? (
                  <div className="items">
                    <div className="items__label">{vehicleTypeLabel}</div>
                    <div className="items__value">
                      {registrationData.vehicleType}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {registrationData.vehicleColor ? (
                  <div className="items">
                    <div className="items__label">{vehicleColorLabel}</div>
                    <div className="items__value">
                      {registrationData.vehicleColor}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {registrationData.vehicleName ? (
                  <div className="items">
                    <div className="items__label">{vehicleNameLabel}</div>
                    <div className="items__value">
                      {registrationData.vehicleName}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="vida-registration-details__info-right">
                {registrationData.registrationNumber ? (
                  <div className="items">
                    <div className="items__value">
                      {registrationData.registrationNumber}
                    </div>
                    <div className="items__label">
                      {registrationNumberLabel}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {registrationData.registrationNumber ? (
                  <div className="items">
                    <button
                      className="btn btn--secondary"
                      onClick={() => handleDownloadCertificate(e)}
                      disabled
                    >
                      {registrationCertificateBtn.label}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

RegistrationDetails.propTypes = {
  registrationDetails: PropTypes.shape({
    title: PropTypes.string,
    registrationNameLabel: PropTypes.string,
    vehicleTypeLabel: PropTypes.string,
    vehicleColorLabel: PropTypes.string,
    vehicleNameLabel: PropTypes.string,
    registrationNumberLabel: PropTypes.string,
    registrationCertificateBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  registrationData: PropTypes.object
};

export default RegistrationDetails;
