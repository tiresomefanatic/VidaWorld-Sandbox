import React from "react";
import PropTypes from "prop-types";
import Button from "../Purchase/Components/Button";
import { BUTTON_TYPES } from "../Purchase/BillingShippingAddress/Constants";

const ConfirmModal = ({
  showModal,
  header,
  desc,
  subHeader,
  confirmMessage,
  errorMessage,
  cancelButtonLabel,
  confirmButtonLabel,
  onCancel,
  onConfirm,
  content: Content
}) => {
  if (showModal) {
    return (
      <div className={`confirm__pop-up ${!showModal ? "d-none" : ""}`}>
        <div className="confirm__content">
          <p className="confirm__header">{header}</p>
          <p className="confirm__sub-header">{subHeader}</p>
          <p className="confirm__desc">{desc}</p>
          <Content />
          <p className="confirm__confirm-msg">{confirmMessage}</p>
          {errorMessage && (
            <p className="confirm__api-error-msg">{errorMessage}</p>
          )}
          <div className="confirm__button-container">
            <Button
              className="confirm__cancel-button confirm__confirm-cancel-button"
              label={cancelButtonLabel}
              variant={BUTTON_TYPES.SECONDARY}
              onClick={onCancel}
            />
            <Button
              className="confirm__confirm-button confirm__confirm-cancel-button"
              label={confirmButtonLabel}
              variant={BUTTON_TYPES.PRIMARY}
              onClick={onConfirm}
            />
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

ConfirmModal.propTypes = {
  showModal: PropTypes.bool,
  header: PropTypes.string,
  desc: PropTypes.string,
  subHeader: PropTypes.string,
  confirmMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  confirmButtonLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  content: PropTypes.node
};

export default ConfirmModal;
