import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
const BookingInterest = (props) => {
  const { config, handleBackShowDetails } = props;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const handleBackButton = () => {
    handleBackShowDetails(true);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Get Notified",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };
  const { title, content, helpContent, backBtn } = config;
  // const { chatBtn } = config;
  return (
    <div className="vida-booking-interest">
      <div>
        <h1 className="vida-booking-interest__title">{title}</h1>
      </div>
      <div>
        <p className="vida-booking-interest__content">{content}</p>
      </div>
      <div className="vida-booking-interest__question">
        <h4>{helpContent.title}</h4>
      </div>
      <div className="vida-booking-interest__with-you">
        <p>{helpContent.message}</p>
      </div>
      <div className="vida-booking-interest__contact">
        <i className="icon-phone vida-booking-interest__phone-icon"></i>
        <a href={`tel:${helpContent.call}`}>{helpContent.call}</a>
      </div>
      <div className="vida-booking-interest__contact">
        <i className="icon-mail vida-booking-interest__email-icon"></i>
        <a href={`mailto:${helpContent.mail}`}>{helpContent.mail}</a>
      </div>
      <div className="vida-booking-interest__chat-lg">
        {/* <div className="form__group form__field-button form__field-button--lg">
          <span className="form__field-button-icon" onClick={handleBackButton}>
            <i className="icon-arrow"></i>
          </span>
          <button className="btn btn--primary">{chatBtn.label}</button>
        </div> */}
        <button
          className="btn btn--secondary btn--lg btn--icon"
          onClick={handleBackButton}
        >
          <i className="icon-arrow-sm"></i> {backBtn.label}
        </button>
      </div>
    </div>
  );
};

BookingInterest.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    helpContent: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      call: PropTypes.string,
      mail: PropTypes.string
    }),
    // chatBtn: PropTypes.shape({
    //   label: PropTypes.string
    // }),
    backBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  handleBackShowDetails: PropTypes.func
};

export default BookingInterest;
