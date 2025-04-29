import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const ExchangeOfferCard = ({ config }) => {
  const {
    title,
    content,
    specificationTitle,
    btnLabelText,
    specificationContent,
    redirectUrl,
    newTab
  } = config;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleFormSubmit = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: event?.target?.innerText,
        ctaLocation: "bottom"
      };
      const pageName = "Offer Details";
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
    window.location.href = redirectUrl;
  };

  return (
    <div className="exchange-offer-card-container vida-2-container">
      <div className="exchange-offer-card-container__header">
        <p className="title">{title}</p>
        <p
          className="header-content"
          dangerouslySetInnerHTML={{
            __html: content
          }}
        ></p>
      </div>
      <div className="exchange-offer-card-container__terms-and-conditions-container">
        <div className="title-container">
          <p className="qna-title">{specificationTitle}</p>
        </div>
        {specificationContent.map((content, index) => (
          <div key={index} className="content-container">
            <div className="wrapper">
              <div className="question-number-container">
                <p className="question-number-text">
                  {index + 1}
                  {"."}
                </p>
              </div>
              <div className="qna-container">
                <p
                  className="question-text"
                  dangerouslySetInnerHTML={{
                    __html: content?.title
                  }}
                ></p>
                <p
                  className="answer-text"
                  dangerouslySetInnerHTML={{
                    __html: content?.description
                  }}
                ></p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="claim-offer-button">
        <button
          onClick={() => handleFormSubmit(event)}
          className="claim-offer-label"
        >
          {btnLabelText}
        </button>
      </div>
    </div>
  );
};

export default ExchangeOfferCard;

ExchangeOfferCard.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    specificationTitle: PropTypes.string,
    specificationContent: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string
      })
    ),
    btnLabelText: PropTypes.string,
    redirectUrl: PropTypes.string,
    newTab: PropTypes.bool
  })
};
