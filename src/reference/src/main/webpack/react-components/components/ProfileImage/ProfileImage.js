import React from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../site/scripts/constant";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";

const ProfileImage = (props) => {
  const {
    setFileNameHandler,
    setImageCropperHandler,
    profilePicture,
    profilePicConfig
  } = props;
  const checker = CONSTANT.FILE_REGEX_IMAGE;

  const uploadFile = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (checker.test(files[0].type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileNameHandler && setFileNameHandler(reader.result);
        setImageCropperHandler && setImageCropperHandler(true);
        e.target.value = null;
      };
      reader.readAsDataURL(files[0]);
    } else {
      showNotificationDispatcher({
        title: profilePicConfig.validationMsg,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
  };

  return (
    <div className="vida-profile-image">
      <div className="vida-profile-image__profile-icon">
        <div className="vida-profile-image__preview">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile Image" />
          ) : (
            <img src={profilePicConfig.userImg} alt="Profile Image" />
          )}
        </div>
        <div className="vida-profile-image__profile-image-icon">
          <i className="icon-pencil-alt"></i>
          <input type="file" onChange={uploadFile} />
        </div>
      </div>
    </div>
  );
};

ProfileImage.propTypes = {
  setFileNameHandler: PropTypes.func,
  setImageCropperHandler: PropTypes.func,
  profilePicture: PropTypes.string,
  profilePicConfig: PropTypes.object
};
export default ProfileImage;
