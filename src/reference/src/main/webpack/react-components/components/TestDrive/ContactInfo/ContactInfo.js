import React from "react";
import PropTypes from "prop-types";

const ContactInfo = (props) => {
  const { title, description, contactDetails } = props.config;

  return (
    <div className="vida-contact-info">
      <h1 className="vida-contact-info__title">{title}</h1>
      <div className="vida-contact-info__description">{description}</div>
      <div className="vida-contact-info__details">
        <span>{contactDetails.title}</span>
        <span>{contactDetails.description}</span>
        <span>
          <i className="icon-phone"></i> {contactDetails.contactNumber}
        </span>
        <span>
          <i className="icon-mail"></i> {contactDetails.contactEmail}
        </span>
      </div>
      {/* <div className="vida-contact-info__btn-wrapper">
        <button className="btn btn--secondary btn--lg">{chatBtn.label}</button>

        <button className="btn btn--primary btn--lg">
          {redirectBtn.label}
        </button>
      </div> */}
    </div>
  );
};

ContactInfo.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    contactDetails: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      contactNumber: PropTypes.string,
      contactEmail: PropTypes.string
    })
  })
};

ContactInfo.defaultProps = {
  config: {}
};

export default ContactInfo;
