import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { usePaymentInfo } from "../../../../hooks/payment/paymentHooks";
import CONSTANT from "../../../../../site/scripts/constant";
import { connect } from "react-redux";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import currencyUtils from "../../../../../site/scripts/utils/currencyUtils";
import { getUtmParams } from "../../../../../react-components/services/utmParams/utmParams";

const BookingSummary = (props) => {
  const {
    config,
    genericConfig,
    handleBackShowDetails,
    selectedScooterData,
    showSteps,
    firstName,
    lastName,
    email,
    pincode,
    branchId,
    partnerId,
    setSteps,
    customerCity,
    myScooter
  } = props;
  const { content, helpLink, paymentBtn, productInfo, agreeTerms, title } =
    config;
  const paymentInfo = usePaymentInfo();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [checked, setChecked] = useState(true);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);

  //Toggle check box click
  const toggleTermsCheck = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Check Availability",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const location = {
        state: "",
        city: "",
        pinCode: pincode,
        country: ""
      };
      const productDetails = {
        modelVariant: selectedScooterData.name,
        modelColor: selectedScooterData.selectedVariant.product.name,
        productID: selectedScooterData.sf_id
      };
      const ctaPageName = ":Reserve for Pin Code";
      analyticsUtils.trackCustomButtonClick(
        customLink,
        location,
        productDetails,
        ctaPageName
      );
      const additionalPageName = ":Booking Summary";
      analyticsUtils.trackPageLoad(additionalPageName);
    }
  }, []);

  const handleMakePayment = async (e) => {
    e.preventDefault();
    setSpinnerActionDispatcher(true);
    const params = getUtmParams();
    const paymentResult = await paymentInfo({
      variables: {
        sf_itemsku_id: selectedScooterData.selectedVariant.product.sf_id,
        sf_item_id: selectedScooterData.sf_id,
        first_name: firstName,
        last_name: lastName,
        email_id: email,
        customer_city: customerCity,
        pincode,
        branchId,
        partnerId,
        utm_params: params
      }
    });
    if (
      paymentResult.data &&
      paymentResult.data.createPayment &&
      paymentResult.data.createPayment.payment_url
    ) {
      if (isAnalyticsEnabled) {
        const location = {
          state: "",
          city: "",
          pinCode: pincode,
          country: ""
        };
        const customLink = {
          name: e.target.innerText,
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        const productDetails = {
          modelVariant: selectedScooterData.name,
          modelColor: selectedScooterData.selectedVariant.product.name,
          productID: selectedScooterData.sf_id
        };
        const configuratorDetails = {
          accessorizeName: myScooter.configuredAccessories
            .toString()
            .split(",")
            .join("|")
        };
        analyticsUtils.trackPreBookingPayment(
          customLink,
          location,
          productDetails,
          configuratorDetails
        );
      }
      window.location.href = paymentResult.data.createPayment.payment_url;
    }
  };

  const handleBack = () => {
    handleBackShowDetails(true);
    setSteps(false);

    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Back",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Reserve for Pin Code";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
    }
  };

  const handleChatBotEvent = (event) => {
    event.preventDefault();
    bootstrapChat && bootstrapChat();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.currentTarget.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Reserve for Pin Code";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
    }
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const termsContent = document.getElementById(agreeTerms.id);
    setTermsContent(termsContent.innerHTML);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackTermsCondition(customLink);
    }
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setChecked(true);
    closeTermsPopup();
  };

  return (
    <div>
      {
        <div className="vida-booking-summary">
          <div className="vida-booking-summary__steps">
            {genericConfig.stepLabel}
            <span>{showSteps}</span>
            <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
          </div>
          <div className="vida-booking-summary__title">
            <h1>{title}</h1>
          </div>
          <div className="vida-booking-summary__content">
            <p>{content}</p>
          </div>
          <div className="vida-booking-summary__scooter-info">
            <h3>{selectedScooterData.name}</h3>
            <h3>
              {currencyUtils.getCurrencyFormatValue(productInfo.priceInfo)}
            </h3>
          </div>
          <div className="vida-booking-summary__deliver-info">
            <p>{productInfo.time}</p>
            <p>{productInfo.priceLabel}</p>
          </div>

          <div className={`${!checked ? "form__group--error" : ""}`}>
            <div className="form__group form__field-checkbox vida-booking-summary__term-checkbox">
              <label className="vida-user-access__label">
                {agreeTerms.agreeLabel}
                <input
                  type="checkbox"
                  name="agreeTerms"
                  htmlFor="terms"
                  checked={checked}
                  onChange={(e) => toggleTermsCheck(e)}
                ></input>
                <span className="form__field-checkbox-mark"></span>
              </label>{" "}
              <a
                href="#"
                rel="noreferrer noopener"
                onClick={(event) => handleTermsandConditions(event)}
              >
                {agreeTerms.terms.label}
              </a>
            </div>
            {!checked && (
              <p className="form__field-message">
                {agreeTerms.validationRules.required.message}
              </p>
            )}
          </div>
          <div className="vida-booking-summary__buttons">
            <div className="form__group form__field-button form__field-button--lg">
              <span className="form__field-button-icon" onClick={handleBack}>
                <i className="icon-arrow"></i>
              </span>
              <button
                className="btn btn--primary"
                disabled={!checked}
                onClick={handleMakePayment}
              >
                {paymentBtn.label}
              </button>
            </div>
          </div>
          <div className="vida-booking-summary__help-text">
            {helpLink.helpLabel}{" "}
            <a href="#" onClick={(event) => handleChatBotEvent(event)}>
              {helpLink.chatLabel}
            </a>
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
                    {agreeTerms.btnLabel.agree}
                  </button>
                  <button
                    className="btn btn--secondary"
                    role="button"
                    onClick={() => closeTermsPopup()}
                  >
                    {agreeTerms.btnLabel.close}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
};
const mapStateToProps = ({
  userProfileDataReducer,
  preBookingReducer,
  userAccessReducer
}) => {
  return {
    firstName: userProfileDataReducer.fname,
    lastName: userProfileDataReducer.lname,
    email: userProfileDataReducer.email,
    pincode: preBookingReducer.pincode,
    branchId: preBookingReducer.branchId,
    partnerId: preBookingReducer.partnerId,
    customerCity: userAccessReducer.customerCity
  };
};

BookingSummary.propTypes = {
  config: PropTypes.shape({
    content: PropTypes.string,
    helpLink: PropTypes.object,
    steps: PropTypes.string,
    title: PropTypes.string,
    productInfo: PropTypes.shape({
      // model: PropTypes.string,
      // price: PropTypes.string,
      priceLabel: PropTypes.string,
      priceInfo: PropTypes.string,
      time: PropTypes.string
    }),
    agreeTerms: PropTypes.any,
    paymentBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    helpLink: PropTypes.object
  }),
  genericConfig: PropTypes.shape({
    stepLabel: PropTypes.string
  }),
  cmpProps: PropTypes.object,
  handleBackShowDetails: PropTypes.func,
  selectedScooterData: PropTypes.object,
  showSteps: PropTypes.number,
  setSteps: PropTypes.func,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  pincode: PropTypes.string,
  branchId: PropTypes.string,
  partnerId: PropTypes.string,
  customerCity: PropTypes.string,
  myScooter: PropTypes.object
};

BookingSummary.defaultProps = {
  config: {},
  cmpProps: {}
};
export default connect(mapStateToProps)(BookingSummary);
