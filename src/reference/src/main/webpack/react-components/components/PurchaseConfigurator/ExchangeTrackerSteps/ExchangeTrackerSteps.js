import React, { useState } from "react";
import PropTypes from "prop-types";
import ExchangeTrackerDetails from "../ExchangeTrackerDetails/ExchangeTrackerDetails";
import VehiclePurchaseDetailsStep from "./VehiclePurchaseDetailsStep";
import OwnershipDetailsStep from "./OwnershipDetailsStep";
import VehicleConditionDetailsStep from "./VehicleConditionDetailsStep";
import { setTradeInDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";

import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useExchangeAgreed } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
const ExchangeTrackerSteps = (props) => {
  const {
    vehiclePurchaseConfig,
    handlePopupClose,
    handleAccept,
    orderId,
    handleNotInterestedInExchange,
    tradeInSelected,
    setHasExchangeApprovedChanged
  } = props;
  const {
    vehiclePurchaseDetails,
    ownershipDetails,
    vehicleConditionDetails,
    actionBtns,
    agreeTerms
  } = vehiclePurchaseConfig;

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [purchaseMonth, setPurchaseMonth] = useState();
  const [purchaseYear, setPurchaseYear] = useState();
  //agree terms
  const [agreeTermsSelected, setAgreeTermsSelected] = useState(true);
  const [showAgreeTermError, setShowAgreeTermError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const toggleTermsCheck = (event) => {
    setAgreeTermsSelected(event.target.checked);
    setIsFormValid(event.target.checked);
    setShowAgreeTermError(!event.target.checked);
  };

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
    setAgreeTermsSelected(true);
    setShowAgreeTermError(false);
    setIsFormValid(true);
    closeTermsPopup();
  };

  const handlePurchaseDateChange = async (
    manufacturingMonth,
    manufacturingYear
  ) => {
    //if purchase year is before manufacturing year or
    // years are same and month for purchase is before manufacturing show error
    if (
      purchaseYear < manufacturingYear ||
      (manufacturingYear == purchaseYear && manufacturingMonth > purchaseMonth)
    ) {
      return false;
    }
    return true;
  };
  const exchangeAgreed = useExchangeAgreed();
  const handleNotInterset = (e, popupNeeded) => {
    setSpinnerActionDispatcher(true);
    exchangeAgreed({
      variables: {
        agreed_flag: "n",
        order_id: orderId
      }
    }).then((result) => {
      if (
        result.data &&
        result.data.ExchangeAgreed &&
        result.data.ExchangeAgreed.status == "200"
      ) {
        handleNotInterestedInExchange();
        handlePopupClose(popupNeeded);
        if (isAnalyticsEnabled) {
          const customLink = {
            name: e.target.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const additionalPageName = `:${e.target.innerText}`;
          analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
        }
      } else {
        setTradeInDataDispatcher({
          popupError: true
        });
        setErrorMsg(result.data.ExchangeAgreed.message);
        handlePopupClose();
        setSpinnerActionDispatcher(false);
      }
    });
  };
  return (
    <div className="vida-exchange-tracker-steps">
      {step === 1 && (
        <VehiclePurchaseDetailsStep
          vehiclePurchaseDetails={vehiclePurchaseDetails}
          actionBtns={actionBtns}
          handleStep={(e) => setStep(e)}
          setPurchaseMonth={setPurchaseMonth}
          setPurchaseYear={setPurchaseYear}
          handleNotInterset={handleNotInterset}
          tradeInSelected={tradeInSelected}
        />
      )}
      {step === 2 && (
        <OwnershipDetailsStep
          ownershipDetails={ownershipDetails}
          actionBtns={actionBtns}
          handleStep={(e) => setStep(e)}
          handleCloseMainPopup={handlePopupClose}
          handlePurchaseDateChange={handlePurchaseDateChange}
        />
      )}

      {step === 3 && (
        <VehicleConditionDetailsStep
          vehicleConditionDetails={vehicleConditionDetails}
          actionBtns={actionBtns}
          handleStep={(e) => setStep(e)}
          handlePopupClose={handlePopupClose}
          tradeInSelected={tradeInSelected}
        />
      )}

      {step === 4 && (
        <div>
          <ExchangeTrackerDetails
            exchangeOfferConfig={vehiclePurchaseConfig}
            handleEdit={() => setStep(1)}
          >
            {" "}
          </ExchangeTrackerDetails>

          <div className="form__group form__field-checkbox vida-exchange-tracker-steps__terms">
            <label className="vida-quick-drive-form__label vida-exchange-tracker-steps__terms-label">
              {agreeTerms.agreeLabel}{" "}
              <input
                type="checkbox"
                name="agreeTerms"
                htmlFor="terms"
                checked={agreeTermsSelected}
                onChange={(event) => toggleTermsCheck(event)}
              ></input>
              <span className="form__field-checkbox-mark"></span>
            </label>
            <a
              href="#"
              rel="noreferrer noopener"
              onClick={(event) => handleTermsandConditions(event)}
            >
              {agreeTerms.terms.label}
            </a>
          </div>
          {showAgreeTermError && (
            <div
              className={`${showAgreeTermError ? "form__group--error" : ""}`}
            >
              <p className="form__field-message">
                {agreeTerms.validationRules.required.message}
              </p>
            </div>
          )}
          {errorMsg && (
            <div className="form__group--error vida-exchange-tracker-steps__error-wrapper">
              <p className="form__field-message">{errorMsg}</p>
            </div>
          )}
          <div className="vida-exchange-tracker-steps__btn-container">
            <button
              className="btn btn--primary vida-exchange-tracker-steps__btn"
              onClick={() => handleAccept()}
              disabled={!isFormValid}
            >
              {actionBtns.acceptBtn.label}
            </button>
            <button
              className="btn btn--secondary vida-exchange-tracker-steps__btn"
              onClick={(e) => handleNotInterset(e, true)}
            >
              {actionBtns.notInterestedBtn.label}
            </button>
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
      )}
    </div>
  );
};

ExchangeTrackerSteps.propTypes = {
  vehiclePurchaseConfig: PropTypes.shape({
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
      }),
      validationRules: PropTypes.shape({
        required: PropTypes.shape({
          message: PropTypes.string
        })
      })
    }),
    vehiclePurchaseDetails: PropTypes.shape({
      stepTitle: PropTypes.string,
      title: PropTypes.string,
      vehicleMakeField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      vehicleModelField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      vehicleTypeField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      ccField: PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      dateField: PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        validationRules: PropTypes.object
      }),
      cityField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      stateField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      })
    }),
    ownershipDetails: PropTypes.shape({
      stepTitle: PropTypes.string,
      title: PropTypes.string,
      registrationNumberField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        validationRules: PropTypes.object
      }),
      numberField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      ownershipField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      insuranceValidityField: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        validationRules: PropTypes.object
      }),
      challanInfo: PropTypes.object
    }),
    vehicleConditionDetails: PropTypes.shape({
      stepTitle: PropTypes.string,
      title: PropTypes.string,
      rateConditionDetails: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      distanceDetails: PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
          })
        ),
        validationRules: PropTypes.object
      }),
      issuesListDetails: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    }),
    exchangeOfferDetails: PropTypes.shape({
      message: PropTypes.string,
      priceText: PropTypes.string,
      details: PropTypes.string
    }),
    actionBtns: PropTypes.shape({
      continueBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      backBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      acceptBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      notInterestedBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      removeExchangeBtn: PropTypes.shape({
        label: PropTypes.string
      })
    })
  }),
  cmpProps: PropTypes.object,
  handlePopupClose: PropTypes.func,
  handleAccept: PropTypes.func,
  orderId: PropTypes.string,
  handleNotInterestedInExchange: PropTypes.func,
  tradeInSelected: PropTypes.bool,
  setHasExchangeApprovedChanged: PropTypes.func
};

ExchangeTrackerSteps.defaultProps = {
  cmpProps: {}
};

export default ExchangeTrackerSteps;
