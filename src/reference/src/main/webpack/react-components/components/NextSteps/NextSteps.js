import React, { useState } from "react";
import PropTypes from "prop-types";
import Popup from "../Popup/Popup";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useGetExchangeInspectionDetails } from "../../hooks/exchangeInspection/exchangeInspectionHooks";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

// TODO: Add null check for insuranceAvailability
const NextSteps = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const {
    config,
    orderId,
    insuranceAvailability,
    exchangeDataDetails,
    displayOrderId
  } = props;
  const [showPopUp, setShowPopUp] = useState(false);
  const [inspectionDetail, setInspectionDetails] = useState(
    config.inspectionDetails.atCenter.id
  );
  const params = `orderId=${orderId}&insuranceAvailability=${insuranceAvailability}`;
  const encryptedParams = cryptoUtils.encrypt(params);
  const exchangeInspectionDetails = useGetExchangeInspectionDetails();
  const nomineeDetailsUrl = appUtils.getPageUrl("nomineeDetailsUrl");
  const uploadDocumentsUrl = appUtils.getPageUrl("uploadDocumentsUrl");

  const redirectionUrl = insuranceAvailability
    ? `${nomineeDetailsUrl}?${encryptedParams}`
    : `${uploadDocumentsUrl}?${encryptedParams}`;

  const handlePopupClose = () => {
    setShowPopUp(false);
  };

  const handleRedirection = async (event) => {
    event.preventDefault();
    if (exchangeDataDetails) {
      setSpinnerActionDispatcher(true);
      const exchangeInfo = await exchangeInspectionDetails({
        variables: {
          sf_order_id: displayOrderId,
          exchange_option: inspectionDetail
        }
      });
      if (exchangeInfo.data) {
        if (isAnalyticsEnabled) {
          const customLink = {
            name: event.target.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const additionalPageName = ":Payment";
          const additionalJourneyName = "";
          analyticsUtils.trackCtaClick(
            customLink,
            additionalPageName,
            additionalJourneyName,
            function () {
              window.location.href = event.target.href;
            }
          );
        } else {
          window.location.href = event.target.href;
        }
      }
    } else {
      window.location.href = event.target.href;
    }
  };

  const handleShowPopUp = (event) => {
    event.preventDefault();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Completed";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
    }
    setShowPopUp(true);
  };

  const handleRadioBtn = (e) => {
    setInspectionDetails(e.target.value);
  };

  return (
    <div className="vida-next-steps">
      <div className="vida-next-steps__nominee-wrapper">
        <div className="vida-next-steps__next-step">
          <h2>{config.title}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: config.message }}
            className="vida-next-steps__message"
          ></p>
        </div>
        {false && exchangeDataDetails && (
          <div className="vida-next-steps__exchange-inspection">
            <p>{config.inspectionDetails.title}</p>
            <div className="vida-next-steps__radio-wrapper">
              <div className="form__group form__field-radio">
                <label className="form__field-label">
                  {config.inspectionDetails.atHome.label}
                  <input
                    type="radio"
                    name="delivery"
                    id={config.inspectionDetails.atHome.id}
                    value={config.inspectionDetails.atHome.id}
                    checked={
                      inspectionDetail === config.inspectionDetails.atHome.id
                    }
                    onChange={handleRadioBtn}
                  ></input>
                  <span className="form__field-radio-mark"></span>
                </label>
              </div>
              <div className="form__group form__field-radio">
                <label className="form__field-label">
                  {config.inspectionDetails.atCenter.label}
                  <input
                    type="radio"
                    name="delivery"
                    id={config.inspectionDetails.atCenter.id}
                    value={config.inspectionDetails.atCenter.id}
                    checked={
                      inspectionDetail === config.inspectionDetails.atCenter.id
                    }
                    onChange={handleRadioBtn}
                  ></input>
                  <span className="form__field-radio-mark"></span>
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="vida-next-steps__nominee-container">
          {insuranceAvailability && (
            <div className="vida-next-steps__nominee-info">
              <div className="vida-next-steps__nominee-info-wrapper">
                <div className="vida-next-steps__nominee-icon">
                  <i className="icon-user-add"></i>
                </div>
                <div className="vida-next-steps__nominee-detail">
                  <h4>{config.nomineeInfo.title}</h4>
                  <p className="vida-next-steps__nominee-text">
                    {config.nomineeInfo.message}
                  </p>
                  <span className="txt-color--orange vida-next-steps__time">
                    {config.nomineeInfo.processingTime}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="vida-next-steps__nominee-document">
            <div className="vida-next-steps__nominee-doc-wrapper">
              <div className="vida-next-steps__document-icon">
                <i className="icon-document-add"></i>
              </div>
              <div className="vida-next-steps__document-detail">
                <h4>{config.uploadDocumentInfo.title}</h4>
                <div
                  className="vida-next-steps__nominee-text"
                  dangerouslySetInnerHTML={{
                    __html: config.uploadDocumentInfo.documentsList
                  }}
                ></div>
                <span className="txt-color--orange vida-next-steps__document-time">
                  {config.uploadDocumentInfo.processingTime}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="vida-next-steps__btn-container">
          {redirectionUrl && (
            <a
              className="btn btn--primary vida-next-steps__btn"
              href={redirectionUrl}
              onClick={(event) => handleRedirection(event)}
            >
              {config.primaryBtn.label}
            </a>
          )}
          <button
            className="btn btn--secondary vida-next-steps__btn"
            onClick={(event) => handleShowPopUp(event)}
          >
            {config.secondaryBtn.label}
          </button>
        </div>
      </div>

      {showPopUp && (
        <div className="vida-next-steps__payment-frame">
          <Popup mode="large" handlePopupClose={() => setShowPopUp(false)}>
            <div className="vida-next-steps__popup-wrapper">
              <div className="vida-next-steps__order-detail">
                <h2 className="vida-next-steps__order-heading">
                  {config.confirmationPopUp.title}
                </h2>
                <div className="vida-next-steps__order-message">
                  <p
                    className="vida-next-steps__popup-message"
                    dangerouslySetInnerHTML={{
                      __html: config.confirmationPopUp.message
                    }}
                  ></p>
                </div>
                <div className="vida-next-steps__order-btn-container">
                  <button
                    className="btn btn--secondary vida-next-steps__order-btn"
                    onClick={handlePopupClose}
                  >
                    {config.confirmationPopUp.secondaryBtn.label}
                  </button>
                  {redirectionUrl && (
                    <a
                      className="btn btn--primary vida-next-steps__btn"
                      href={redirectionUrl}
                    >
                      {config.confirmationPopUp.primaryBtn.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        </div>
      )}
    </div>
  );
};

NextSteps.propTypes = {
  orderId: PropTypes.string,
  displayOrderId: PropTypes.string,
  insuranceAvailability: PropTypes.bool,
  exchangeDataDetails: PropTypes.bool,
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    inspectionDetails: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      atHome: PropTypes.shape({
        label: PropTypes.string,
        id: PropTypes.string
      }),
      atCenter: PropTypes.shape({
        label: PropTypes.string,
        id: PropTypes.string
      })
    }),
    nomineeInfo: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      processingTime: PropTypes.string
    }),
    uploadDocumentInfo: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      documentsList: PropTypes.string,
      processingTime: PropTypes.string
    }),

    primaryBtn: PropTypes.shape({
      label: PropTypes.string,
      actionUrl: PropTypes.string
    }),
    secondaryBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    confirmationPopUp: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      info: PropTypes.string,
      primaryBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      secondaryBtn: PropTypes.shape({
        label: PropTypes.string
      })
    })
  })
};
export default NextSteps;
