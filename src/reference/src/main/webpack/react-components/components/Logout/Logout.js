import React from "react";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useLogout } from "../../hooks/userAccess/userAccessHooks";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { clearUtmParams } from "../../../react-components/services/utmParams/utmParams";

const Logout = (props) => {
  const { label, className } = props;
  const loginUrl = appUtils.getPageUrl("loginUrl");
  const LogoutUser = useLogout();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleLogout = async () => {
    try {
      setSpinnerActionDispatcher(true);
      clearUtmParams();
      const response = await LogoutUser();
      if (response?.data?.revokeCustomerToken?.result) {
        if (loginUrl) {
          window.embedded_svc && window.embedded_svc.liveAgentAPI.endChat();
          if (isAnalyticsEnabled) {
            const customLink = {
              name: "Logout",
              position: "Top",
              type: "Button",
              clickType: "other"
            };
            const additionalPageName = "";
            const additionalJourneyName = "";
            analyticsUtils.trackCtaClick(
              customLink,
              additionalPageName,
              additionalJourneyName,
              function () {
                window.location.href = loginUrl;
              }
            );
          } else {
            window.location.href = loginUrl;
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
          handleLogout();
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
