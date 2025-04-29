import React from "react";
import PropTypes from "prop-types";
import { BUTTON_TYPES } from "../BillingShippingAddress/Constants";

const getButtonType = (value) => {
  switch (value) {
    case BUTTON_TYPES.SECONDARY:
      return "secondary";
    case BUTTON_TYPES.TERNARY:
      return "ternary";
    default:
      return "primary";
  }
};

const Button = ({
  variant,
  onClick,
  formId,
  label,
  secondaryLabel,
  className,
  disabled,
  ...rest
}) => {
  if (label) {
    return (
      <button
        className={`vida2-button vida2-button--${getButtonType(
          variant
        )} ${className}`}
        onClick={onClick}
        form={formId}
        disabled={disabled}
        {...rest}
      >
        {label}
        {secondaryLabel ? (
          <p className="secondary-label">{secondaryLabel}</p>
        ) : (
          ""
        )}
      </button>
    );
  }
  return <></>;
};

Button.propTypes = {
  variant: PropTypes.string,
  onClick: PropTypes.func,
  formId: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  secondaryLabel: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
