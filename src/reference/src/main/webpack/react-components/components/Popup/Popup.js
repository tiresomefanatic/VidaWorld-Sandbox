import React from "react";
import PropTypes from "prop-types";

const Popup = (props) => {
  const { mode, handlePopupClose, children } = props;
  const onClose = () => {
    handlePopupClose && handlePopupClose();
  };

  return (
    <section
      className={
        "popup " +
        (mode === "full-screen"
          ? "popup--full-screen"
          : mode === "large"
          ? "popup--large"
          : mode === "medium"
          ? "popup--medium"
          : mode === "small"
          ? "popup--small"
          : "")
      }
    >
      <div className="popup__container">
        <div className="popup__header">
          <button className="popup__close-btn" onClick={onClose}>
            <i className="icon-x"></i>
          </button>
        </div>
        <div className="popup__body">
          <div className="popup__content">{children}</div>
        </div>
      </div>
    </section>
  );
};

Popup.propTypes = {
  mode: PropTypes.string,
  handlePopupClose: PropTypes.func,
  children: PropTypes.node.isRequired
};

Popup.defaultProps = {};

export default Popup;
