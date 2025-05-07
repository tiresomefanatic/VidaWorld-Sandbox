import React from 'react';
import PropTypes from 'prop-types';
import './LabelButton.scss';
import { useContent } from '../../utils/ContentContext';

const LabelButton = ({
  label,
  onClick,
  className = '',
  customIcon
}) => {
  const { getContent } = useContent();
  
  // Use the label from props if provided, otherwise get it from the content context
  const displayLabel = label || getContent('LabelButton', 'label', 'Label');

  return (
    <button
      className={`label-button ${className}`}
      onClick={onClick}
    >
      <span className="label-button__icon">
        {customIcon ? (
          customIcon
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.33628 14.7854L7.19912 10.0412C7.28035 9.83572 7.17747 9.60324 6.97169 9.52485L2.92111 7.94073C2.64494 7.83259 2.57723 7.47036 2.79925 7.27303L10.0259 0.771654C10.34 0.490514 10.8192 0.820317 10.6649 1.21499L8.80204 5.95923C8.72081 6.16468 8.82369 6.39716 9.02947 6.47556L13.08 8.05967C13.3562 8.1678 13.4212 8.53004 13.2019 8.72738L5.97527 15.2287C5.6639 15.5099 5.18466 15.1774 5.33628 14.7854Z" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="label-button__label">{displayLabel}</span>
    </button>
  );
};

LabelButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  customIcon: PropTypes.element
};

export default LabelButton; 