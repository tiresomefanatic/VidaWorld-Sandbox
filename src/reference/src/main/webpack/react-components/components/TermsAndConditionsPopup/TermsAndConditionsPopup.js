import React, { useState } from "react";
import PropTypes from "prop-types";

const TermsAndConditionsPopup = (props) => {
  const { agreeLabel, btnLabel, popupId, terms } = props.config;
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const termsContent = document.getElementById(popupId);
    setTermsContent(termsContent.innerHTML);
  };
  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };
  return (
    <div className="advantage-terms">
      {showTermsPopup && (
        <div className="vida-terms-conditions">
          <div className="vida-terms-conditions__container">
            <div className="vida-terms-conditions__body">
              <div className="vida-terms-conditions__body-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent
                  }}
                ></div>
              </div>
            </div>
            <div className="vida-terms-conditions__btn-wrap">
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {btnLabel.close}
              </button>
            </div>
          </div>
        </div>
      )}
      <a
        href="#"
        rel="noreferrer noopener"
        onClick={(event) => handleTermsandConditions(event)}
      >
        {terms.label}
      </a>
    </div>
  );
};

TermsAndConditionsPopup.propTypes = {
  config: PropTypes.object,
  agreeLabel: PropTypes.string,
  popupId: PropTypes.string,
  btnLabel: PropTypes.object,
  terms: PropTypes.object
};

export default TermsAndConditionsPopup;
