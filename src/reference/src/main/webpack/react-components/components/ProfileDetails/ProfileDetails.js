import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Logout from "../Logout/Logout";
import ProfileImage from "../ProfileImage/ProfileImage";

const ProfileDetails = (props) => {
  const {
    config,
    cmpProps,
    setImageCropper,
    setFileName,
    setVerifyEmailHandler,
    isEmailVerified
  } = props;
  const { fname, lname, number, email, city, profile_pic } = cmpProps;
  const {
    title,
    firstNameField,
    lastNameField,
    phoneNumberField,
    emailField,
    cityField,
    editBtn,
    logoutBtn,
    emailOtpConfig,
    profilePicConfig
  } = config;

  const handleVerifyEmail = (event) => {
    event.preventDefault();
    setVerifyEmailHandler && setVerifyEmailHandler(event);
  };

  const handleSetFileName = (fileName) => {
    setFileName && setFileName(fileName);
  };
  const handleImageCropper = (toggleView) => {
    setImageCropper && setImageCropper(toggleView);
  };

  return (
    <>
      <div className="vida-container vida-profile-details">
        <div className="vida-profile-details__header">
          <h1 className="h2 vida-profile-details__title">{title}</h1>
          <div className="vida-profile-details__action">
            <button
              className="btn btn--secondary"
              onClick={props.onEditProfile}
            >
              {editBtn.label}
              <i className="icon-pencil-alt"></i>
            </button>
            <Logout label={logoutBtn.label} className="btn btn--secondary" />
          </div>
        </div>
        <div className="vida-profile-details__content">
          <ProfileImage
            setImageCropperHandler={handleImageCropper}
            setFileNameHandler={handleSetFileName}
            profilePicture={profile_pic}
            profilePicConfig={profilePicConfig}
          />
          <div className="vida-profile-details__fields vida-profile-details--limited-fields-sm">
            <div className="vida-profile-details__field vida-profile-details__name-field">
              <div className="vida-profile-details__label">
                {firstNameField.label} / {lastNameField.label}
              </div>
              <div className="vida-profile-details__value">{`${fname} ${lname}`}</div>
            </div>
            <div className="vida-profile-details__field vida-profile-details__phone-field">
              <div className="vida-profile-details__label">
                {phoneNumberField.label}
              </div>
              <div className="vida-profile-details__value">{number}</div>
            </div>
            <div className="vida-profile-details__field vida-profile-details__city-field">
              <div className="vida-profile-details__label">
                {cityField.label}
              </div>
              <div className="vida-profile-details__value">{city}</div>
            </div>

            <div
              className={`vida-profile-details__field vida-profile-details__email-field ${
                !isEmailVerified ? "show-email" : ""
              }`}
            >
              <div className="vida-profile-details__label">
                {emailField.label}
              </div>
              <div className="vida-profile-details__value">
                {email}
                {!isEmailVerified && (
                  <>
                    <br />
                    <a onClick={(event) => handleVerifyEmail(event)}>
                      {emailOtpConfig.verifyNowLabel}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className="vida-profile-details__edit-icon"
            onClick={() => {
              props.onEditProfile(true);
            }}
          >
            <i className="icon-pencil-alt"></i>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const userProfileDataReducer = state.userProfileDataReducer;
  return {
    cmpProps: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      number: userProfileDataReducer.number,
      email: userProfileDataReducer.email,
      city: userProfileDataReducer.city,
      profile_pic: userProfileDataReducer.profile_pic
    }
  };
};

ProfileDetails.propTypes = {
  onEditProfile: PropTypes.func,
  logoutHandler: PropTypes.func,
  config: PropTypes.shape({
    title: PropTypes.string,
    firstNameField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    lastNameField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    phoneNumberField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    emailField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    cityField: PropTypes.shape({
      label: PropTypes.string
    }),
    editBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    logoutBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    emailOtpConfig: PropTypes.object,
    profilePicConfig: PropTypes.object
  }),
  cmpProps: PropTypes.object,
  setImageCropper: PropTypes.func,
  setFileName: PropTypes.func,
  setVerifyEmailHandler: PropTypes.func,
  isEmailVerified: PropTypes.bool
};

ProfileDetails.defaultProps = {
  config: {},
  cmpProps: {}
};
export default connect(mapStateToProps)(ProfileDetails);
