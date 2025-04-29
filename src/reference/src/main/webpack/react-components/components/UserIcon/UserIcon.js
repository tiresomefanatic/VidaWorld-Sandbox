import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useUserData } from "../../hooks/userProfile/userProfileHooks";

const UserIcon = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const getUserData = useUserData();

  const { firstName, lastName, mailId, mobileNumber, pincode } = props;

  useEffect(() => {
    if (window.embedded_svc) {
      if (firstName) {
        window.embedded_svc.settings.prepopulatedPrechatFields = {
          FirstName: firstName,
          LastName: lastName,
          Email: mailId,
          MobilePhone: mobileNumber,
          Pincode__c: pincode
        };
      } else {
        window.embedded_svc?.liveAgentAPI?.endChat();
      }
    }
  }, [firstName]);

  const analyticsCtaClick = (e, redirection) => {
    const customLink = {
      name: "User Icon",
      position: "Top",
      type: "Icon",
      clickType: "other"
    };

    if (redirection) {
      const additionalPageName = "";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = redirection;
        }
      );
    } else {
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const userIconClickHandler = (e) => {
    e.preventDefault();
    let redirectionUrl;
    if (isLoggedIn) {
      redirectionUrl = appUtils.getPageUrl("profileUrl");
    } else {
      redirectionUrl = appUtils.getPageUrl("loginUrl");
    }
    const showLeavePageNotification = appUtils.getPageConfig(
      "showLeavePageNotification"
    );

    if (
      showLeavePageNotification &&
      showLeavePageNotification.toLowerCase() === "true"
    ) {
      document.querySelector(".vida-leave-page-notification").style.display =
        "block";
      document.querySelector("html").classList.add("overflow-hidden");
      document
        .querySelector(".vida-leave-page-notification__redirection")
        .setAttribute("href", redirectionUrl);

      if (isAnalyticsEnabled) {
        analyticsCtaClick(e);
      }
    } else if (isAnalyticsEnabled) {
      analyticsCtaClick(e, redirectionUrl);
    } else {
      window.location.href = redirectionUrl;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <a
          href=""
          className={`vida-header__user-icon${
            props.profile_pic ? "" : " vida-header__user-icon--active"
          }`}
          onClick={(e) => userIconClickHandler(e)}
        >
          {props.profile_pic ? (
            <img src={props.profile_pic} alt="Profile Picture" />
          ) : (
            <i className="icon-user"></i>
          )}
        </a>
      ) : (
        <a
          href=""
          className="vida-header__user-icon"
          onClick={(e) => userIconClickHandler(e)}
        >
          <i className="icon-user"></i>
        </a>
      )}
    </>
  );
};

UserIcon.propTypes = {
  userStatus: PropTypes.bool,
  profile_pic: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  mobileNumber: PropTypes.string,
  mailId: PropTypes.string,
  pincode: PropTypes.string
};

const mapStateToProps = ({ userAccessReducer, userProfileDataReducer }) => {
  return {
    userStatus: userAccessReducer.isUserLoggedIn,
    profile_pic: userProfileDataReducer.profile_pic,
    firstName: userProfileDataReducer.fname,
    lastName: userProfileDataReducer.lname,
    mobileNumber: userProfileDataReducer.number,
    mailId: userProfileDataReducer.email,
    pincode: userProfileDataReducer.pincode
  };
};

export default connect(mapStateToProps)(UserIcon);
