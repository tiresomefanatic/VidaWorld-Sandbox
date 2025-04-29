import React from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

const RichTextComponent = ({ content, className }) => {
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(content)
  });

  return (
    <div className={className} dangerouslySetInnerHTML={sanitizedData()} />
  );
};

RichTextComponent.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default RichTextComponent;
