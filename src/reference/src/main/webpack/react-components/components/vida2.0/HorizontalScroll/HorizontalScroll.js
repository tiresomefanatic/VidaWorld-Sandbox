import React from "react";
import PropTypes from "prop-types";
const HorizontalScroll = ({ children }) => {
  return <div className="horizontal-scroll-container">{children}</div>;
};

export default HorizontalScroll;
HorizontalScroll.propTypes = {
  children: PropTypes.node
};
