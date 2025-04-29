import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../../site/scripts/constant";

const StatusPage = (props) => {
  const { title, message, info, redirectBtn } = props.config;
  const { bookingId, summaryData, status, firstName, lastName } = props;
  const userName = firstName + " " + lastName;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleRedirection = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const ctaPageName = ":Long Term Test Rides";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        ctaPageName,
        additionalJourneyName,
        function () {
          window.location.href =
            status === CONSTANT.PAYMENT_STATUS.SUCCESS
              ? appUtils.getPageUrl("lttrTestDriveUploadDocumentsUrl")
              : appUtils.getPageUrl("lttrTestDriveSummaryUrl") +
                "?" +
                RSAUtils.encrypt("bookingId=" + bookingId);
        }
      );
    } else {
      window.location.href =
        status === CONSTANT.PAYMENT_STATUS.SUCCESS
          ? appUtils.getPageUrl("lttrTestDriveUploadDocumentsUrl")
          : appUtils.getPageUrl("lttrTestDriveSummaryUrl") +
            "?" +
            RSAUtils.encrypt("bookingId=" + bookingId);
    }
  };

  return (
    <>
      {summaryData && bookingId ? (
        <div className="vida-success-page">
          <div className="vida-success-page__title">{title}</div>
          <div className="vida-success-page__message">{message}</div>
          <div className="vida-test-drive__content-details">
            {userName && (
              <div className="vida-test-drive__content-data">
                <i className="icon-user"></i>
                <span className="h4-md">{userName}</span>
              </div>
            )}

            {(summaryData.address1 ||
              summaryData.address2 ||
              summaryData.landmark ||
              summaryData.postalCode) && (
              <div className="vida-test-drive__content-data">
                <i className="icon-location-marker"></i>
                <span className="h4-md">
                  {summaryData.address1} {summaryData.address2}{" "}
                  {summaryData.landmark} {summaryData.postalCode}
                </span>
              </div>
            )}

            {summaryData.startDate && (
              <div className="vida-test-drive__content-data">
                <i className="icon-calendar"></i>
                <span className="h4-md">{summaryData.startDate}</span>
              </div>
            )}

            {summaryData.startTime && (
              <div className="vida-test-drive__content-data">
                <i className="icon-clock"></i>
                <span className="h4-md">{summaryData.startTime}</span>
              </div>
            )}
          </div>
          <div className="vida-success-page__info">{info}</div>
          <button
            className="btn btn--primary btn--lg"
            onClick={(event) => handleRedirection(event)}
          >
            {redirectBtn.label}
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

StatusPage.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    rescheduleMessage: PropTypes.string,
    info: PropTypes.string,
    redirectBtn: PropTypes.shape({
      label: PropTypes.string,
      actionURL: PropTypes.string
    })
  }),
  bookingId: PropTypes.number,
  summaryData: PropTypes.object,
  status: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    firstName: userProfileDataReducer.fname,
    lastName: userProfileDataReducer.lname
  };
};

export default connect(mapStateToProps)(StatusPage);
