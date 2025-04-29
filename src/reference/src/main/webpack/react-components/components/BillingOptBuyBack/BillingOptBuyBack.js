import React, { useState } from "react";
import PropTypes from "prop-types";

const BillingOptBuyBack = (props) => {
  const {
    checkBoxLabel,
    isBuyBackChecked,
    optBuyBackSubtext,
    setHandleSetBuyBack,
    agreeTerms
  } = props;
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const [checked, setChecked] = useState(isBuyBackChecked);

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const content = document.getElementById(agreeTerms.id);
    setTermsContent(content.innerHTML);
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setHandleSetBuyBack(true);
    setChecked(true);
    closeTermsPopup();
  };

  const handleBuyBackChange = (e) => {
    if (e.target.checked) {
      setHandleSetBuyBack && setHandleSetBuyBack(true);
      setChecked(true);
    } else {
      setHandleSetBuyBack && setHandleSetBuyBack(false);
      setChecked(false);
    }
  };

  return (
    <>
      <div className="vida-billing-buy-back__container">
        <div className="vida-billing-buy-back__wrapper">
          <div className="vida-billing-buy-back__checkbox form__group form__field-checkbox">
            <label className="vida-user-access__label">
              <span className="vida-billing-buy-back__heading">
                {checkBoxLabel}
              </span>
              <input
                type="checkbox"
                defaultChecked={isBuyBackChecked}
                checked={checked}
                // ref={setCheckboxRef}
                onClick={(e) => handleBuyBackChange(e)}
              />
              <span className="form__field-checkbox-mark"></span>
            </label>
          </div>
          <div className="vida-billing-buy-back__subtext">
            <label className="form__field-label">{optBuyBackSubtext}</label>
            <a
              href="#"
              rel="noreferrer noopener"
              onClick={(event) => handleTermsandConditions(event)}
            >
              {agreeTerms?.terms?.label}
            </a>
          </div>
        </div>
      </div>
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
                className="btn btn--primary"
                role="button"
                onClick={() => handleAgreeTerms()}
              >
                {agreeTerms?.btnLabel?.agree}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {agreeTerms?.btnLabel?.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BillingOptBuyBack.propTypes = {
  checkBoxLabel: PropTypes.string,
  optBuyBackSubtext: PropTypes.string,
  isBuyBackChecked: PropTypes.boolean,
  setHandleSetBuyBack: PropTypes.func,
  agreeTerms: PropTypes.shape({
    agreeLabel: PropTypes.string,
    btnLabel: PropTypes.shape({
      agree: PropTypes.string,
      close: PropTypes.string
    }),
    id: PropTypes.string,
    terms: PropTypes.shape({
      actionUrl: PropTypes.string,
      label: PropTypes.string
    })
  })
};
export default BillingOptBuyBack;
