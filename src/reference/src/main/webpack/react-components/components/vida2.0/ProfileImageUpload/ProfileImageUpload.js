import React, { useState } from "react";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import CONSTANT from "../../../../site/scripts/constant";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import ImageCropper from "../../ImageCropper/ImageCropper";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useUploadProfileImage } from "../../../hooks/userProfile/userProfileHooks";
import { setUserImageDispatcher } from "../../../store/userProfile/userProfileActions";

const ProfileImageUpload = (props) => {
  const { handleFileName, config, id, fileName } = props;
  const { profilePicConfig } = config;
  const checker = CONSTANT.FILE_REGEX_IMAGE;
  const [showImageCropper, setShowImageCropper] = useState(false);
  const uploadProfileImage = useUploadProfileImage();

  const handleImageCropper = (toggleView) => {
    setShowImageCropper(toggleView);
    document.querySelector("html").classList.add("overflow-hidden");
  };

  const handleProfilePopupClose = () => {
    setShowImageCropper(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

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
        console.log(reader, "inside if===");
        handleFileName && handleFileName(reader.result);
        handleImageCropper && handleImageCropper(true);
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

  const handleCroppedImage = async (base64Value) => {
    setSpinnerActionDispatcher(true);
    handleProfilePopupClose();
    handleFileName("");
    const uploadImageResult = await uploadProfileImage({
      variables: {
        file: base64Value.split(",")[1]
      }
    });
    if (uploadImageResult?.data?.uploadProfileImage?.status) {
      // Dispatching the value from request inorder to avoid getCustomer call again
      setUserImageDispatcher(base64Value);
    }
  };

  return (
    <>
      <input type="file" onChange={uploadFile} hidden id={id} />

      {showImageCropper && (
        <div className="profile--cropper">
          <Popup handlePopupClose={() => setShowImageCropper(false)}>
            <ImageCropper
              elementClassName="vida-profile-cropper__container"
              config={config}
              fileName={fileName}
              profilePictureHandler={handleCroppedImage}
              closePopupHandler={handleProfilePopupClose}
            />
          </Popup>
        </div>
      )}
    </>
  );
};

ProfileImageUpload.propTypes = {
  config: PropTypes.object,
  id: PropTypes.string,
  handleFileName: PropTypes.func,
  fileName: PropTypes.string
};

export default ProfileImageUpload;
