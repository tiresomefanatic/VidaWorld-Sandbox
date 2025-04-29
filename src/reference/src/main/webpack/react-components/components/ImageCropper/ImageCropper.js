import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import PropTypes from "prop-types";

const ImageCropper = (props) => {
  const {
    elementClassName,
    fileName,
    profilePictureHandler,
    closePopupHandler,
    config,
    aspectRatio,
    zoomTo,
    initialAspectRatio,
    viewMode,
    minCropBoxHeight,
    minCropBoxWidth,
    background,
    responsive,
    autoCropArea,
    guides
  } = props;
  const { cancelBtn, saveBtn } = config;
  const [cropper, setCropper] = useState();

  const getImageData = () => {
    if (typeof cropper !== "undefined") {
      profilePictureHandler &&
        profilePictureHandler(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const closePopup = () => {
    closePopupHandler && closePopupHandler();
  };

  return (
    <div className="vida-image-cropper">
      <Cropper
        className={elementClassName}
        src={fileName}
        aspectRatio={aspectRatio}
        zoomTo={zoomTo}
        initialAspectRatio={initialAspectRatio}
        viewMode={viewMode}
        minCropBoxHeight={minCropBoxHeight}
        minCropBoxWidth={minCropBoxWidth}
        background={background}
        responsive={responsive}
        autoCropArea={autoCropArea}
        guides={guides}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
      <div className="vida-image-cropper__button-wrap">
        <button onClick={closePopup} className="btn btn--secondary">
          {cancelBtn.label}
        </button>
        <button onClick={getImageData} className="btn btn--primary">
          {saveBtn.label}
        </button>
      </div>
    </div>
  );
};

ImageCropper.propTypes = {
  elementClassName: PropTypes.string,
  fileName: PropTypes.string,
  profilePictureHandler: PropTypes.func,
  closePopupHandler: PropTypes.func,
  config: PropTypes.shape({
    cancelBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    saveBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  aspectRatio: PropTypes.number,
  zoomTo: PropTypes.any,
  initialAspectRatio: PropTypes.number,
  viewMode: PropTypes.number,
  minCropBoxHeight: PropTypes.number,
  minCropBoxWidth: PropTypes.number,
  background: PropTypes.bool,
  responsive: PropTypes.bool,
  autoCropArea: PropTypes.number,
  guides: PropTypes.bool
};

ImageCropper.defaultProps = {
  aspectRatio: 1,
  zoomTo: 0.5,
  initialAspectRatio: 1,
  viewMode: 1,
  minCropBoxHeight: 10,
  minCropBoxWidth: 10,
  background: true,
  responsive: true,
  autoCropArea: 1,
  guides: true
};

export default ImageCropper;
