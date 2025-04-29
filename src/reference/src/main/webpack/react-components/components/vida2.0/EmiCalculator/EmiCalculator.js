import React, { useEffect, useState } from "react";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import PropTypes from "prop-types";
import ReDirectionCards from "../ReDirectionCards/ReDirectionCards";
import ScooterCardSelection from "../ScooterCardSelection/ScooterCardSelection";
import { useGetLoanDetails } from "../../../hooks/emiCalculator/emiCalculatorHooks";
import Logger from "../../../../../webpack/services/logger.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const EmiCalculatorCard = ({ config }) => {
  const {
    bgImageDesktop,
    bgImageMobile,
    bgImageTitle,
    bgImageAltText,
    emiSavingsCalculatorCardConfig,
    redirectionCard,
    showOfferCard,
    buyButtonLabel,
    buyRedirectUrl,
    newTab,
    showButton,
    closeButtonLabel
  } = config;

  const [loanDetailsLink, setLoanDetailsLink] = useState();
  const [cityFieldErrorMsg, setCityFieldErrorMsg] = useState("");
  const [isDealerAvailable, setDealerAvailable] = useState();
  const getLoanDetails = useGetLoanDetails();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const emiCalculatorHandler = async (city, itemId) => {
    try {
      setSpinnerActionDispatcher(true);
      const loanDetails = await getLoanDetails({
        variables: {
          city: city,
          sf_itemsku_id: itemId,
          application_type: "LOAN"
        }
      });

      if (
        loanDetails &&
        loanDetails?.data &&
        loanDetails?.data?.getEmiCalculators &&
        loanDetails?.data?.getEmiCalculators?.status == 200
      ) {
        setLoanDetailsLink(
          loanDetails?.data?.getEmiCalculators?.application_link
        );
        setCityFieldErrorMsg("");
        setDealerAvailable(true);
      } else {
        setCityFieldErrorMsg(loanDetails?.error?.message);
        setDealerAvailable(false);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleFormSubmit = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: event?.target?.innerText,
        ctaLocation: "bottom"
      };
      const pageName = "EMI Calculator";
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
    window.location.href = buyRedirectUrl;
  };

  const closeButtonhandler = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: event?.target?.innerText,
        ctaLocation: "bottom"
      };
      const pageName = "EMI Calculator";
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
    // window.location.href = buyRedirectUrl;
  };

  useEffect(() => {
    setSpinnerActionDispatcher(true);
  }, []);

  return (
    <div className="emi-calculator-container">
      <div className="bg-img-container">
        <img
          src={isDesktop ? bgImageDesktop : bgImageMobile}
          alt={bgImageAltText}
          title={bgImageTitle}
        />
      </div>
      <div className="emi-calculator-box-wrapper vida-2-container">
        <div className="emi-calculator-box-container">
          <div className="emi-calculator-wrapper">
            <ScooterCardSelection
              config={emiSavingsCalculatorCardConfig}
              emiCalculatorHandler={emiCalculatorHandler}
              cityInputErrorMsg={cityFieldErrorMsg}
              isDealerAvailable={isDealerAvailable}
            />
          </div>
          <div
            className={`emi-calculator-wrapper__loan-details-container ${
              !isDealerAvailable ? "emi-calculator-wrapper__no-dealer" : ""
            }`}
          >
            <div className="emi-calculator-iframe-wrapper">
              <iframe src={loanDetailsLink} allow="camera *;"></iframe>
            </div>
          </div>
          {showOfferCard && (
            <div className="emi-calculator-wrapper__redirection-card-container">
              <ReDirectionCards config={redirectionCard} />
            </div>
          )}
          {showButton && (
            <div className="emi-calculator-wrapper__choice-buttons">
              <button
                onClick={() => handleFormSubmit(event)}
                className="buy-button"
              >
                {buyButtonLabel}
              </button>
              <button
                className="close-button"
                onClick={() => closeButtonhandler(event)}
              >
                {closeButtonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EmiCalculatorCard.propTypes = {
  config: PropTypes.shape({
    bgImageDesktop: PropTypes.string,
    bgImageMobile: PropTypes.string,
    bgImageAltText: PropTypes.string,
    bgImageTitle: PropTypes.string,
    emiSavingsCalculatorCardConfig: PropTypes.shape({}),
    redirectionCard: PropTypes.shape(),
    showOfferCard: PropTypes.bool,
    buyRedirectUrl: PropTypes.string,
    newTab: PropTypes.bool,
    buyButtonLabel: PropTypes.string,
    closeButtonLabel: PropTypes.string,
    showButton: PropTypes.bool
  })
};
export default EmiCalculatorCard;
