import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useValidateAadhar,
  useValidateAadharStatus
} from "../../hooks/validateAadhar/validateAadharHooks";
import appUtils from "../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const AadharStatus = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { config } = props;
  const {
    aadharValidationSuccess,
    aadharValidationFailure,
    pageRedirectionTimeout
  } = config;
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const queryString = location.href.split("?")[1];
  const [orderId, setOrderId] = useState("");
  const [id, setId] = useState("");
  const getAadharSignzy = useValidateAadhar();
  const getAadharStatus = useValidateAadharStatus();
  const [isAadharSuccess, setAadharStatus] = useState(false);

  const getValidationStatus = async (orderId) => {
    const result = await getAadharStatus({
      variables: {
        order_id: orderId,
        status: "true"
      }
    });
    if (
      result &&
      result.data &&
      result.data.UpdateAadharStatus &&
      result.data.UpdateAadharStatus.status.toLowerCase() == "success"
    ) {
      setTimeout(() => {
        window.location.href = profileUrl;
      }, pageRedirectionTimeout);
    }
  };

  useEffect(() => {
    if (queryString) {
      const urlParams = new URLSearchParams(location.search);

      const additionalPageName = ":Aadhar Validation Status";
      const bookingStatus = urlParams.get("status");

      if (isAnalyticsEnabled) {
        analyticsUtils.trackAadharCard(additionalPageName, bookingStatus);
      }

      if (urlParams.get("status").toLowerCase() === "success") {
        setAadharStatus(true);
        setId(urlParams.get("id"));
        getValidationStatus(urlParams.get("orderId"));
      } else if (urlParams.get("status").toLowerCase() === "failure") {
        setAadharStatus(false);
      }
      setOrderId(urlParams.get("orderId"));
    } else {
      window.location.href = profileUrl;
    }
  }, []);

  const handleAadharStatusValidate = async () => {
    setSpinnerActionDispatcher(true);
    const result = await getAadharSignzy({
      variables: {
        order_id: orderId
      }
    });
    if (result && result.data) {
      setSpinnerActionDispatcher(false);
      if (isAnalyticsEnabled) {
        const customLink = {
          name: "Re-Validate Aadhar",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        const additionalPageName = ":Aadhar Validation Failure";
        const additionalJourneyName = "";
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            window.location.href = result.data.CreateUrl.url;
          }
        );
      } else {
        window.location.href = result.data.CreateUrl.url;
      }
    }
  };

  return (
    <div className="vida-container">
      <div className="vida-aadhar-status">
        <div className="vida-aadhar-status__container">
          <div className="vida-aadhar-status__title">
            {isAadharSuccess ? (
              <>
                <h1>{aadharValidationSuccess.title}</h1>
                <p className="vida-aadhar-status__confirmation-msg">
                  {aadharValidationSuccess.content} - {id}
                </p>
                <p className="vida-aadhar-status__redirection-msg">
                  {aadharValidationSuccess.redirectMessage}
                </p>
              </>
            ) : (
              <>
                <h1>{aadharValidationFailure.title}</h1>
                <p className="vida-aadhar-status__confirmation-msg">
                  {aadharValidationFailure.content}
                </p>
                <button
                  className="btn btn--primary"
                  onClick={handleAadharStatusValidate}
                >
                  {config.primaryBtn.label}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AadharStatus.propTypes = {
  config: PropTypes.shape({
    aadharValidationSuccess: PropTypes.object,
    aadharValidationFailure: PropTypes.object,
    primaryBtn: PropTypes.object,
    pageRedirectionTimeout: PropTypes.number
  })
};

export default AadharStatus;
