import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import { setUserStatusAction } from "../../store/userAccess/userAccessActions";
import Logger from "../../../services/logger.service";
import Header from "../../../components/header/header";
import { useUpdateProfile } from "../../hooks/userProfile/userProfileHooks";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import QuickDriveForm from "./QuickDriveForm/QuickDriveForm";
import appUtils from "../../../site/scripts/utils/appUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../site/scripts/constant";
import { getCityListForQuickTestDrive } from "../../../services/location.service";
import { useUserData } from "../../hooks/userProfile/userProfileHooks";

const TestDrive = (props) => {
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const isLoggedIn = loginUtils.isSessionActive();
  const queryString = location.href.split("?")[1];
  let testRideType = "";
  if (queryString) {
    const decryptedParams = cryptoUtils.decrypt(queryString);
    const params = new URLSearchParams("?" + decryptedParams);
    testRideType = params.get("testRideType");
  }
  const testDriveURL =
    testRideType === CONSTANT.TEST_RIDE_OPTIONS.LONG_TERM
      ? appUtils.getPageUrl("longTermTestDriveNewUrl")
      : appUtils.getPageUrl("shortTermTestDriveUrl");

  const testDriveSelectorUrl = appUtils.getPageUrl("testDriveSelectorUrl");
  const { backgroundImg, bookingForm, isLttrAvailable } = props.config;
  const { userDisplayData, setUserStatus } = props;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const getUserData = useUserData();

  const checkForLttr = async (city) => {
    setSpinnerActionDispatcher(true);
    const lttrCities = await getCityListForQuickTestDrive(defaultCountry, true);
    if (lttrCities.some((item) => item.city === city)) {
      setSpinnerActionDispatcher(true);
      window.location.href = testDriveSelectorUrl;
    }
  };
  useEffect(() => {
    setSpinnerActionDispatcher(true);
    if (userDisplayData.city && !queryString && isLttrAvailable) {
      checkForLttr(userDisplayData.city);
    }
  }, [userDisplayData.city]);

  const redirectToTestRide = (
    testrideLocation,
    submitForNotification,
    lttrData
  ) => {
    let params = [
      "country=",
      testrideLocation.country,
      "&state=",
      testrideLocation.state,
      "&city=",
      testrideLocation.city,
      "&cityId=",
      "&isOTPVerified="
    ].join("");

    if (lttrData && lttrData.id) {
      params = [
        "&partnerAccountId=",
        lttrData.accountpartnerId,
        "&city=",
        testrideLocation.city,
        "&state=",
        testrideLocation.state,
        "&branchId=",
        lttrData.id,
        "&centreName=",
        lttrData.experienceCenterName,
        "&postalCode=",
        lttrData.postalCode
      ].join("");
    }
    const encryptedParams = cryptoUtils.encrypt(params);

    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Next",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const location = {
        pinCode: "",
        city: testrideLocation.city,
        state: testrideLocation.state,
        country: testrideLocation.country
      };
      const productDetails = {
        modelVariant: "",
        modelColor: "",
        productID: ""
      };
      const bookingDetails = {
        testDriveReceiveNotificationStatus: submitForNotification ? "Yes" : "No"
      };
      const additionalPageName = " Personal Information";
      const additionalJourneyName = "Booking";
      analyticsUtils.trackNotificationCBClick(
        customLink,
        location,
        productDetails,
        bookingDetails,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = `${testDriveURL}?${encryptedParams}`;
        }
      );
    } else {
      window.location.href = `${testDriveURL}?${encryptedParams}`;
    }
  };

  // update profile for get notification flow
  const updateProfileForNotificationData = useUpdateProfile(true, false);
  const handleBookingFormSubmit = async (
    testrideLocation,
    submitForNotification,
    lttrData,
    testRideAvailable
  ) => {
    try {
      setSpinnerActionDispatcher(true);
      const updateProfileRes = await updateProfileForNotificationData({
        variables: {
          whatapp_consent: submitForNotification
        }
      });
      if (updateProfileRes.data.updateProfile.status_code === 200) {
        setSpinnerActionDispatcher(true);
        if (isLoggedIn) {
          redirectToTestRide(testrideLocation, submitForNotification, lttrData);
        } else {
          const header = document.querySelector(".vida-header");
          Header.enableUserAccessLinks(header);
          setUserStatus({
            isUserLoggedIn: true
          });
          if (!testRideAvailable) {
            redirectToTestRide(
              testrideLocation,
              submitForNotification,
              lttrData
            );
          } else {
            getUserData();
          }
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  return (
    <div className="vida-test-drive__container">
      <div className="vida-test-drive__asset">
        <img src={backgroundImg} alt="Vida Test Drive" />
      </div>
      <div className="vida-test-drive__content">
        {isLoggedIn && (
          <QuickDriveForm
            userDetails={userDisplayData}
            config={bookingForm}
            submitBookingFormData={handleBookingFormSubmit}
            isLttr={testRideType === CONSTANT.TEST_RIDE_OPTIONS.LONG_TERM}
          />
        )}
      </div>
    </div>
  );
};

TestDrive.propTypes = {
  setUserStatus: PropTypes.func,
  userDisplayData: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string
  }),
  config: PropTypes.shape({
    backgroundImg: PropTypes.string,
    bookingForm: PropTypes.object,
    otpConfig: PropTypes.object,
    testDriveSelector: PropTypes.object,
    contactInfo: PropTypes.object,
    isLttrAvailable: PropTypes.bool
  })
};

TestDrive.defaultProps = {
  config: {}
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userDisplayData: {
      firstname: userProfileDataReducer.fname,
      lastname: userProfileDataReducer.lname,
      city: userProfileDataReducer.city,
      countrycode: userProfileDataReducer.code,
      mobilenumber: userProfileDataReducer.number,
      email: userProfileDataReducer.email
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserStatus: (status) => {
      dispatch(setUserStatusAction(status));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestDrive);
