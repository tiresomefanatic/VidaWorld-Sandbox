import React from "react";
import PropTypes from "prop-types";

const Link = ({ url, label, className, ...rest }) => {
  if (url && label) {
    return (
      <a href={url} {...rest} className={`vida2-link ${className}`}>
        {label}
      </a>
    );
  }
  return <></>;
};

Link.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};
export default Link;
