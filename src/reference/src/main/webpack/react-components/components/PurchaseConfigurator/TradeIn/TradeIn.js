import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import ExchangeTrackerStatus from "../ExchangeTrackerStatus/ExchangeTrackerStatus";
import ExchangeTrackerSteps from "../ExchangeTrackerSteps/ExchangeTrackerSteps";
import ExchageTrackerDetails from "../ExchangeTrackerDetails/ExchangeTrackerDetails";
import {
  clearTradeInDataDispatcher,
  setTradeInDataDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import { connect } from "react-redux";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const TradeIn = (props) => {
  const { config, cmpProps } = props;
  const { tradeInPlan, exchangePolicy } = config;
  const { tradeInSelected, popupError } = cmpProps;
  const [showExchangeDetails, setShowExchangeDetails] = useState(false);
  const [selected, setSelected] = useState(tradeInSelected);
  const [errorPopup, setErrorPopup] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  useEffect(() => {
    setSelected(tradeInSelected);
  }, [tradeInSelected]);

  useEffect(() => {
    if (showExchangeDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [showExchangeDetails]);

  const handleClosePopup = (data) => {
    if (data) {
      clearTradeInDataDispatcher();
    }
    setShowExchangeDetails(false);
    if (!tradeInSelected) {
      setSelected(false);
    }
  };

  const handleAccept = () => {
    setShowExchangeDetails(false);
    setTradeInDataDispatcher({ tradeInSelected: true });
    setSelected(true);
    if (isAnalyticsEnabled) {
      analyticsUtils.trackExchangeCompleted();
    }
  };

  const handleError = () => {
    setTradeInDataDispatcher({
      popupError: false
    });
    setErrorPopup(false);
    handleClosePopup(true);
  };
  useEffect(() => {
    setErrorPopup(popupError);
  }, [popupError]);

  const handleExchageScooter = () => {
    setShowExchangeDetails(true);
    if (isAnalyticsEnabled) {
      analyticsUtils.trackExchangeStart();
    }
  };

  const handleEditExchange = () => {
    setShowExchangeDetails(true);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Edit",
        position: "Bottom",
        type: "Icon",
        clickType: "other"
      };
      const additionalPageName = ":Edit";
      analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
    }
  };

  return (
    <div className="vida-trade-in">
      <h1 className="vida-trade-in__title">{tradeInPlan.title}</h1>
      <div className="form__group form__field-radio-btn-group vida-trade-in__radio-btn">
        <div className={"form__field-radio-btn"}>
          <label className="form__field-label">
            {tradeInPlan.noBtn.label}
            <input
              type="radio"
              name="tradeindetails"
              value="no"
              checked={!selected}
              readOnly
              onClick={() => {
                handleClosePopup(true);
              }}
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
        <div className="form__field-radio-btn">
          <label className="form__field-label">
            {tradeInPlan.yesBtn.label}
            <input
              type="radio"
              name="tradeindetails"
              value="yes"
              checked={selected}
              readOnly
              onClick={() => {
                handleExchageScooter();
              }}
              disabled={selected}
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
      </div>
      {showExchangeDetails && (
        <Popup mode="full-screen" handlePopupClose={handleClosePopup}>
          <div className="vida-trade-in__container">
            <div className="vida-trade-in__header">
              <div>
                <span className="vida-trade-in__title">
                  {exchangePolicy.title}
                </span>
                <span className="vida-trade-in__description">
                  {exchangePolicy.description}
                </span>
              </div>
              <picture className="vida-trade-in__logo-lg">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <div className="vida-trade-in__header-mobile">
              <span className="vida-trade-in__description-mobile">
                {exchangePolicy.description}
              </span>

              <picture className="vida-trade-in__logo-lg-mobile">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <ExchangeTrackerStatus
              config={exchangePolicy}
            ></ExchangeTrackerStatus>

            <div>
              <ExchangeTrackerSteps
                vehiclePurchaseConfig={exchangePolicy}
                handlePopupClose={handleClosePopup}
                handleAccept={handleAccept}
              ></ExchangeTrackerSteps>
            </div>
          </div>
        </Popup>
      )}
      {selected && (
        <div className="vida-purchase-configurator__exchange-tracker">
          <ExchageTrackerDetails
            exchangeOfferConfig={exchangePolicy}
            handleDelete={() => handleClosePopup(true)}
            handleEdit={() => handleEditExchange()}
          ></ExchageTrackerDetails>
        </div>
      )}

      {errorPopup && (
        <Popup handlePopupClose={handleError} mode="medium">
          <h3 className="vida-exchange-tracker-steps__popup-title">
            {tradeInPlan.confirmation.title}
          </h3>
          <p className="vida-exchange-tracker-steps__popup-desc">
            {tradeInPlan.confirmation.description}
          </p>
          <div className="vida-exchange-tracker-steps__popup-btn-wrapper">
            <button className="btn btn--primary" onClick={handleError}>
              {tradeInPlan.confirmation.okBtn.label}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

TradeIn.propTypes = {
  config: PropTypes.shape({
    tradeInPlan: PropTypes.shape({
      title: PropTypes.string,
      yesBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      noBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      confirmation: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        okBtn: PropTypes.shape({
          label: PropTypes.string
        })
      })
    }),
    exchangePolicy: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      poweredByImg: PropTypes.string,
      orderStatusConfig: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          message: PropTypes.string,
          label: PropTypes.string
        })
      ),
      vehiclePurchaseDetails: PropTypes.object
    })
  }),
  cmpProps: PropTypes.object
};
const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      ...purchaseConfigReducer.tradeIn
    }
  };
};
export default connect(mapStateToProps)(TradeIn);
