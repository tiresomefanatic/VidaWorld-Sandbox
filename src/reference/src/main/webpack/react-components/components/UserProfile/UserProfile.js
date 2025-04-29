import React, { useEffect, useState } from "react";
import ProfileDetails from "../ProfileDetails/ProfileDetails";
import EditProfile from "../EditProfile/EditProfile";
import ProfileTabs from "../ProfileTabs/ProfileTabs";
import Popup from "../Popup/Popup";
import {
  useUserData,
  useUploadProfileImage,
  useElligibleAddressUpdate
} from "../../hooks/userProfile/userProfileHooks";
import {
  useGenerateOTP,
  useVerifyOTP
} from "../../hooks/userAccess/userAccessHooks";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import ImageCropper from "../ImageCropper/ImageCropper";
import { setUserImageDispatcher } from "../../store/userProfile/userProfileActions";
import VerifyEmail from "../VerifyEmail/VerifyEmail";
import Logger from "../../../services/logger.service";
import { RSAUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import CONSTANT from "../../../site/scripts/constant";
import Cookies from "js-cookie";
import appUtils from "../../../site/scripts/utils/appUtils";
import { getUtmParams } from "../../../react-components/services/utmParams/utmParams";

const UserProfile = (props) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { config, userProfileProps } = props;
  const {
    city,
    state,
    country,
    code,
    number,
    email,
    fname,
    lname,
    email_verified,
    sfid,
    isLogin,
    customer_number
  } = userProfileProps;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const uploadProfileImage = useUploadProfileImage();
  const getUserData = useUserData();
  const getElligibleAddressUpdate = useElligibleAddressUpdate();

  useEffect(() => {
    //REF: Hide spinner for remaining API calls
    // setSpinnerActionDispatcher(true);
    getUserData();
    getElligibleAddressUpdate();
  }, []);

  useEffect(() => {
    if (customer_number) {
      Cookies.set(CONSTANT.COOKIE_CUSTOMER_NUMBER, customer_number, {
        expires: appUtils.getConfig("tokenExpirtyInDays"),
        secure: true,
        sameSite: "strict"
      });
      if (isAnalyticsEnabled) {
        analyticsUtils.trackPageLoad();
      }
    }
  }, [customer_number]);

  const toggleShowEditProfile = (state) => {
    setShowEditProfile(state);
    //REF: Hide spinner for remaining API calls
    // setSpinnerActionDispatcher(true);
    getUserData();
    getElligibleAddressUpdate();
    if (isAnalyticsEnabled && state) {
      const customLink = {
        name: state ? "Edit Profile" : "Close Profile",
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  /* Function starts for Profile picture upload */
  const [showImageCropper, setImageCropper] = useState(false);
  const [fileName, setFileName] = useState();

  const handleFileName = (fileName) => {
    setFileName(fileName);
  };
  const handleImageCropper = (toggleView) => {
    setImageCropper(toggleView);
    document.querySelector("html").classList.add("overflow-hidden");
  };

  const handleProfilePopupClose = () => {
    setImageCropper(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleCroppedImage = async (base64Value) => {
    setSpinnerActionDispatcher(true);
    handleProfilePopupClose();
    setFileName("");
    const uploadImageResult = await uploadProfileImage({
      variables: {
        file: base64Value.split(",")[1]
      }
    });
    if (
      uploadImageResult &&
      uploadImageResult.data &&
      uploadImageResult.data.uploadProfileImage &&
      uploadImageResult.data.uploadProfileImage.status
    ) {
      // Dispatching the value from request inorder to avoid getCustomer call again
      setUserImageDispatcher(base64Value);
    }
  };
  /* Function ends for Profile picture upload */

  /* Function starts for Veriy Email OTP */
  const [isVerifyEmailPopup, setShowtVerifyEmail] = useState(false);

  const generateVerifyEmailOTP = useGenerateOTP(false, true);
  const handleShowVerifyEmail = async (event) => {
    const variables = {
      country_code: code,
      mobile_number: RSAUtils.encrypt(number),
      email: RSAUtils.encrypt(email)
    };

    try {
      setSpinnerActionDispatcher(true);
      const loginResult = await generateVerifyEmailOTP({
        variables
      });

      if (loginResult) {
        try {
          if (loginResult.data.SendOtp.status_code === 200) {
            setShowtVerifyEmail(true);
            if (isAnalyticsEnabled) {
              const customLink = {
                name: event.target.innerText,
                position: "Top",
                type: "Link",
                clickType: "other"
              };
              analyticsUtils.trackCtaClick(customLink);
            }
          }
        } catch (error) {
          Logger.error(error);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const verifyOTP = useVerifyOTP(isLogin);
  const handleVerifyEmail = async (event, otp) => {
    const params = getUtmParams();
    const variables = {
      SF_ID: sfid,
      otp: RSAUtils.encrypt(otp),
      country_code: code ? code : "+91",
      fname,
      lname,
      mobile_number: RSAUtils.encrypt(number),
      email: RSAUtils.encrypt(email),
      utm_params: params
    };

    try {
      setSpinnerActionDispatcher(true);
      const otpResult = await verifyOTP({
        variables
      });

      if (otpResult && otpResult.data) {
        if (otpResult.data.VerifyOtp.status_code === 200) {
          showNotificationDispatcher({
            title: otpResult.data.VerifyOtp.message,
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
          setShowtVerifyEmail(false);
          setSpinnerActionDispatcher(true);
          getUserData();
          setSpinnerActionDispatcher(true);
          getElligibleAddressUpdate();
          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.target.innerText,
              position: "Middle",
              type: "Button",
              clickType: "other"
            };
            analyticsUtils.trackCtaClick(customLink);
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  /* Function ends for Veriy Email OTP */

  return (
    <div className="vida-user-profile">
      {showEditProfile || (number && (!city || !state || !country)) ? (
        <div className="vida-user-profile__edit-popup">
          <Popup handlePopupClose={toggleShowEditProfile}>
            <EditProfile
              config={config.userProfileConfig}
              onFormCancel={toggleShowEditProfile}
              setImageCropper={handleImageCropper}
              setFileName={handleFileName}
            />
          </Popup>
        </div>
      ) : (
        <>
          {number && email && fname && lname && (
            <>
              <ProfileDetails
                config={config.userProfileConfig}
                onEditProfile={toggleShowEditProfile}
                setImageCropper={handleImageCropper}
                setFileName={handleFileName}
                setVerifyEmailHandler={handleShowVerifyEmail}
                isEmailVerified={email_verified}
              ></ProfileDetails>
              <ProfileTabs config={config}></ProfileTabs>
            </>
          )}
        </>
      )}

      {showImageCropper && (
        <div className="profile--cropper">
          <Popup handlePopupClose={() => setImageCropper(false)}>
            <ImageCropper
              elementClassName="vida-profile-cropper__container"
              config={config.userProfileConfig}
              fileName={fileName}
              profilePictureHandler={handleCroppedImage}
              closePopupHandler={handleProfilePopupClose}
            />
          </Popup>
        </div>
      )}

      {isVerifyEmailPopup && email && (
        <div className="vida-profile-details__verify-email-popup">
          <Popup handlePopupClose={() => setShowtVerifyEmail(false)}>
            <VerifyEmail
              config={config.userProfileConfig.emailOtpConfig}
              verifyEmailHandler={handleVerifyEmail}
              email={email}
            />
          </Popup>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer, userAccessReducer }) => {
  return {
    userProfileProps: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      code: userProfileDataReducer.code,
      number: userProfileDataReducer.number,
      email: userProfileDataReducer.email,
      country: userProfileDataReducer.country,
      state: userProfileDataReducer.state,
      city: userProfileDataReducer.city,
      pincode: userProfileDataReducer.pincode,
      profile_pic: userProfileDataReducer.profile_pic,
      email_verified: userProfileDataReducer.email_verified,
      sfid: userAccessReducer.sfid,
      isLogin: userAccessReducer.isLogin,
      customer_number: userProfileDataReducer.customer_number
    }
  };
};

UserProfile.propTypes = {
  config: PropTypes.object,
  userProfileProps: PropTypes.object
};

UserProfile.defaultProps = {
  config: {}
};

export default connect(mapStateToProps)(UserProfile);
