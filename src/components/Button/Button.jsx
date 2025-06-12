import React from "react";
import PropTypes from "prop-types";
import "./Button.scss";

/**
 * Button component using Vida design tokens
 */
const Button = (props) => {
  // Extract props from config when passed through data-cmp-config
  const {
    label = "Reserve",
    prominence = "dark", // light or dark
    size = "l",
    state = "default",
    disabled = false,
    customIcon = null,
    semanticTypography = "desktop",
    // Visibility controls the position of the icon: left, right, or off (no icon)
    visibility = "left",
    variant = "primary", // primary, secondary, tertiary, destructive
    roundness = "large", // circle, large, small, off
    onClick,
    className = ""
  } = props.config || props;

  const getStateClass = () => {
    if (disabled) {
      return "button--disabled";
    }
    switch (state) {
      case "hover":
        return "button--hover";
      case "pressed":
        return "button--pressed";
      default:
        return "";
    }
  };

  // Determine if icons should be shown based on visibility
  const showLeftIcon = visibility === "left";
  const showRightIcon = visibility === "right";

  return (
    <button
      className={`button button--${prominence} button--${size} button--semantic-${semanticTypography} button--roundness-${roundness} icon--visibility-${visibility} button--variant-${variant} ${getStateClass()} ${className} ${
        showLeftIcon ? "button--icon-left" : ""
      } ${showRightIcon ? "button--icon-right" : ""}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {showLeftIcon && (
        <span className={`button__icon--${size} button__icon--left`}>
          {customIcon || <IconPlaceholder />}
        </span>
      )}
      <span className="button__label">{label}</span>
      {showRightIcon && (
        <span className={`button__icon--${size} button__icon--right`}>
          {customIcon || <IconPlaceholder />}
        </span>
      )}
    </button>
  );
};

const IconPlaceholder = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.33628 14.7854L7.19912 10.0412C7.28035 9.83572 7.17747 9.60324 6.97169 9.52485L2.92111 7.94073C2.64494 7.83259 2.57723 7.47036 2.79925 7.27303L10.0259 0.771654C10.34 0.490514 10.8192 0.820317 10.6649 1.21499L8.80204 5.95923C8.72081 6.16468 8.82369 6.39716 9.02947 6.47556L13.08 8.05967C13.3562 8.1678 13.4212 8.53004 13.2019 8.72738L5.97527 15.2287C5.6639 15.5099 5.18466 15.1774 5.33628 14.7854Z"
      fill="currentColor"
    />
  </svg>
);

Button.propTypes = {
  config: PropTypes.object,
  label: PropTypes.string,
  prominence: PropTypes.oneOf(["dark", "light", "link"]),
  size: PropTypes.oneOf(["s", "m", "l"]),
  state: PropTypes.oneOf(["default", "hover", "pressed"]),
  disabled: PropTypes.bool,
  customIcon: PropTypes.element,
  semanticTypography: PropTypes.oneOf(["desktop", "mobile"]),
  // Visibility controls the position of icons
  visibility: PropTypes.oneOf(["left", "right", "off"]),
  variant: PropTypes.oneOf(["primary", "secondary", "tertiary", "destructive"]),
  roundness: PropTypes.oneOf(["circle", "large", "small", "off"]),
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;
