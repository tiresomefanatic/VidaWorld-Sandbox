import React from "react";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useLogout } from "../../../hooks/userAccess/userAccessHooks";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { clearUtmParams } from "../../../../react-components/services/utmParams/utmParams";

const Logout = (props) => {
  const { label, className } = props;
  const loginUrl = appUtils.getPageUrl("loginUrl");
  const LogoutUser = useLogout();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setSpinnerActionDispatcher(true);
      clearUtmParams();
      const response = await LogoutUser();
      if (response?.data?.revokeCustomerToken?.result) {
        if (loginUrl) {
          window?.embedded_svc?.liveAgentAPI.endChat();
          if (window.sessionStorage.getItem("partPayDetails")) {
            window.sessionStorage.removeItem("partPayDetails");
          }
          if (window.localStorage.getItem("appState")) {
            window.localStorage.removeItem("appState");
          }
          if (window.sessionStorage.getItem("aadharVerificationUrl")) {
            window.sessionStorage.removeItem("aadharVerificationUrl");
          }
          if (window.sessionStorage.getItem("optOutForPopup")) {
            window.sessionStorage.removeItem("optOutForPopup");
          }
          if (isAnalyticsEnabled) {
            const customLink = {
              ctaText: "Logout",
              ctaLocation: "Profile"
            };
            analyticsUtils.trackCTAClicksVida2(
              customLink,
              "ctaButtonClick",
              function () {
                window.location.replace(loginUrl);
              }
            );
          } else {
            window.location.replace(loginUrl);
          }
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  return (
    <>
      <a
        href="#"
        className={className}
        onClick={(e) => {
          e.preventDefault;
          handleLogout(e);
        }}
      >
        {label}
      </a>
    </>
  );
};

Logout.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string
};

Logout.defaultProps = {
  label: "Logout",
  className: ""
};

export default Logout;
