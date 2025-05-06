import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

/**
 * Button component using Vida design tokens
 */
const Button = ({
  label,
  prominence = 'primary',
  size = 'm',
  state = 'default',
  disabled = false,
  iconLeft = false,
  iconRight = false,
  onClick,
  className = '',
}) => {
  const getStateClass = () => {
    if (disabled) return 'button--disabled';
    switch (state) {
      case 'hover':
        return 'button--hover';
      case 'pressed':
        return 'button--pressed';
      default:
        return '';
    }
  };

  return (
    <button
      className={`button button--${prominence} button--${size} ${getStateClass()} ${className} ${iconLeft ? 'button--icon-left' : ''} ${iconRight ? 'button--icon-right' : ''}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {iconLeft && (
        <span className="button__icon button__icon--left">
          <IconPlaceholder />
        </span>
      )}
      <span className="button__label">{label}</span>
      {iconRight && (
        <span className="button__icon button__icon--right">
          <IconPlaceholder />
        </span>
      )}
    </button>
  );
};

const IconPlaceholder = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L15 8L8 15L1 8L8 1Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  prominence: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  state: PropTypes.oneOf(['default', 'hover', 'pressed']),
  disabled: PropTypes.bool,
  iconLeft: PropTypes.bool,
  iconRight: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button; 