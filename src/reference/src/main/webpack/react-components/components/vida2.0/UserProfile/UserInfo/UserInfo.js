import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { updateNameToDisplay } from "../../../../services/commonServices/commonServices";

const UserInfo = (props) => {
  const { userProfileProps, onTestRideToProfileSwitch } = props;

  const handleTestRideToProfileSwitch = () => onTestRideToProfileSwitch();

  return (
    <div
      className="vida-user-info-wrapper"
      onClick={() => handleTestRideToProfileSwitch()}
    >
      <div className="icon-desc-container">
        <div className="icon-container">
          {userProfileProps?.profile_pic ? (
            <img
              src={userProfileProps.profile_pic}
              alt="profile-image"
              title="profile-image"
              loading="lazy"
            />
          ) : (
            <img
              src={`${appUtils.getConfig(
                "resourcePath"
              )}images/png/Ellipse.png`}
              alt="no-profile-image"
              title="no-profile-image"
              loading="lazy"
            />
          )}
        </div>
        <div className="description-container">
          <p>
            Hi{" "}
            {updateNameToDisplay(
              userProfileProps.fname,
              userProfileProps.lname
            )}
          </p>
        </div>
      </div>
      <div className="redirection-container">
        <img
          src={`${appUtils.getConfig(
            "resourcePath"
          )}images/png/ion_options-sharp.png`}
          alt="menu-icon"
          title="menu-icon"
          loading="lazy"
        ></img>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileProps: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      profile_pic: userProfileDataReducer.profile_pic
    }
  };
};
UserInfo.propTypes = {
  config: PropTypes.object,
  userProfileProps: PropTypes.object,
  onTestRideToProfileSwitch: PropTypes.func
};

export default connect(mapStateToProps)(UserInfo);
