import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useUserData } from "../../../hooks/userProfile/userProfileHooks";
import { updateNameToDisplay } from "../../../services/commonServices/commonServices";

const UserLogin = (props) => {
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

  const ctaHamburgerAnalytics = (e, ctaName, eventName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: ctaName || e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition,
        clickURL: e.currentTarget.href
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    }
  }, []);

  return (
    <div className="vida-hamburger-profile">
      <div
        className={
          isLoggedIn
            ? props.profile_pic
              ? "user-profile-img"
              : "user-profile-img user-icon"
            : "d-none"
        }
      >
        <a
          href={isLoggedIn ? props.profileLink : props.preLoginNavLink}
          onClick={(e) => ctaHamburgerAnalytics(e, "profileImage")}
        >
          {props.profile_pic ? (
            <img src={props.profile_pic} alt="user_profile_img" />
          ) : (
            <i className="icon-user"></i>
          )}
        </a>
      </div>
      <a
        href={props.profileLink}
        className={
          isLoggedIn ? "vida-hamburger-sites-name login-text" : "d-none"
        }
      >
        {updateNameToDisplay(props.firstName, props.lastName)}
      </a>
      <a
        href={props.preLoginNavLink}
        data-link-position={props.dataPosition || "header"}
        onClick={(e) => ctaHamburgerAnalytics(e, null, "loginClick")}
        className={
          isLoggedIn ? "d-none" : "vida-hamburger-sites-name login-text"
        }
      >
        {props.preLoginText}
      </a>
      <a
        href={props.signUpNavLink}
        data-link-position={props.dataPosition || "header"}
        onClick={(e) => ctaHamburgerAnalytics(e, null, "signupClick")}
        className={
          isLoggedIn ? "d-none" : "vida-hamburger-sites-name login-text"
        }
      >
        {props.signUpText}
      </a>
    </div>
  );
};

UserLogin.propTypes = {
  userStatus: PropTypes.bool,
  profile_pic: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  mobileNumber: PropTypes.string,
  mailId: PropTypes.string,
  pincode: PropTypes.string,
  profileLink: PropTypes.string,
  preLoginNavLink: PropTypes.string,
  signUpNavLink: PropTypes.string,
  preLoginText: PropTypes.string,
  signUpText: PropTypes.string,
  dataPosition: PropTypes.string
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

export default connect(mapStateToProps)(UserLogin);
