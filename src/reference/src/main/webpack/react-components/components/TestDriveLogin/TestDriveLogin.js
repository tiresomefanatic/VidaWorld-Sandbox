import React from "react";
import TestDriveRegister from "../TestDrive/TestDriveRegister/TestDriveRegister";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import {
  useUpdateProfile,
  useUserData
} from "../../hooks/userProfile/userProfileHooks";
import Logger from "../../../services/logger.service";
import appUtils from "../../../site/scripts/utils/appUtils";

const TestDriveLogin = (props) => {
  const { backgroundImg, bookingForm, isLttrAvailable } = props.config;
  const getUserData = useUserData();
  const testRideUrl = appUtils.getPageUrl("testDriveUrl");

  const updateProfileForNotificationData = useUpdateProfile(true, false);
  const bookingFormSubmitHandler = async (
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
        if (!testRideAvailable) {
          redirectToTestRide(testrideLocation, submitForNotification, lttrData);
        } else {
          getUserData();
          window.location.href = testRideUrl;
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
        <TestDriveRegister
          config={bookingForm}
          submitBookingFormData={bookingFormSubmitHandler}
          isLttrAvailable={isLttrAvailable}
        />
      </div>
    </div>
  );
};
TestDriveLogin.propTypes = {
  config: PropTypes.shape({
    backgroundImg: PropTypes.string,
    bookingForm: PropTypes.object,
    isLttrAvailable: PropTypes.bool
  })
};
TestDriveLogin.defaultProps = {
  config: {}
};
export default TestDriveLogin;
