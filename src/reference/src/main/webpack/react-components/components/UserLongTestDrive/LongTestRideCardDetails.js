import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const LongTestRideCardDetails = (props) => {
  const { userLongTestRideConfig, cardData } = props;
  const imgPath = appUtils.getConfig("imgPath");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const uploadDocumentUrl = appUtils.getPageUrl(
    "lttrTestDriveUploadDocumentsUrl"
  );
  const handleDocumentUpload = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const ctaPageName = ":Long Term Test Rides";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        ctaPageName,
        additionalJourneyName,
        function () {
          window.location.href = uploadDocumentUrl;
        }
      );
    } else {
      window.location.href = uploadDocumentUrl;
    }
  };

  const longTermTestDriveUrl = appUtils.getPageUrl("longTermTestDriveUrl");

  const handleRescheduleTestDrive = (e) => {
    e.preventDefault();
    const params = [
      "bookingId=",
      cardData.bookingId,
      "&isReschedule=",
      true
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(params);
    if (isAnalyticsEnabled) {
      const location = {
        state: "",
        city: cardData.rentalCity,
        pinCode: cardData.postalCode,
        country: cardData.country ? cardData.country : ""
      };
      const productDetails = {
        modelVariant: cardData.modelVariant ? cardData.modelVariant : "",
        modalColor: "",
        productID: cardData.itemId
      };
      const bookingDetails = {
        testDriveType: "Long Term Test Drive",
        testDriveLocation: "",
        vidaCenter: "",
        testDriveDate: cardData.startDate,
        testDriveTime: cardData.startTime,
        bookingID: cardData.bookingId,
        bookingStatus: "Test Drive Booking Cancelled",
        rentDuration: ""
      };
      analyticsUtils.trackTestRideReschedule(
        location,
        productDetails,
        bookingDetails,
        function () {
          window.location.href = `${longTermTestDriveUrl}?${encryptedParams}`;
        }
      );
    } else {
      window.location.href = `${longTermTestDriveUrl}?${encryptedParams}`;
    }
  };
  return (
    <>
      <div className="vida-test-ride-card-details">
        <div className="vida-card">
          <div className="vida-card__container">
            <div className="vida-card__image">
              <img
                className="vida-card__product-image"
                src={imgPath + cardData.productSku + ".png"}
                alt="Scooter Image"
              />
            </div>
            <div className="vida-card__data">
              <div className="vida-card__product-data">
                <div className="vida-card__product-title">
                  <h3>{cardData.name}</h3>
                  <h4>
                    {userLongTestRideConfig.bookingIdLabel}: {cardData.Name}
                  </h4>
                </div>
                <div className="vida-card__product-schedule">
                  {/* <h3>
                    {cardData.startDate} - {cardData.startTime}
                  </h3> */}
                  {cardData.price && (
                    <p>
                      {userLongTestRideConfig.paidLabel}{" "}
                      {currencyUtils.getCurrencyFormatValue(cardData.price)}
                    </p>
                  )}
                </div>
              </div>
              <div className="vida-card__booking-data">
                <div className="vida-card__booking-item">
                  <i className="icon-location-marker"></i>
                  <label>
                    {cardData.homeDelivery
                      ? userLongTestRideConfig.homeLabel
                      : userLongTestRideConfig.dealershipLabel}
                  </label>
                  <h4>
                    {cardData.dmpl__DemoAddress__c
                      ? cardData.dmpl__DemoAddress__c + " "
                      : ""}
                    {cardData.address2 ? cardData.address2 + " " : ""}
                    {cardData.landmark ? cardData.landmark + " " : ""}
                    {cardData.postalCode && cardData.postalCode}
                  </h4>
                </div>
                <div className="vida-card__booking-item">
                  <i className="icon-status-online"></i>
                  <label>{userLongTestRideConfig.statusLabel}</label>
                  <h4>{cardData.dmpl__Status__c}</h4>
                </div>
              </div>
              {/* {cardData.bookingStatus !== CONSTANT.TEST_RIDE_STATUS.CANCELLED &&
                cardData.bookingStatus !== CONSTANT.TEST_RIDE_STATUS.ENDED &&
                cardData.bookingStatus !==
                  CONSTANT.TEST_RIDE_STATUS.COMPLETED &&
                cardData.bookingStatus !==
                  CONSTANT.TEST_RIDE_STATUS.ONGOING && (
                  <div className="vida-card__button-container">
                    <button
                      className="btn btn--secondary"
                      onClick={(event) =>
                        props.cancelTestDriveHandler &&
                        props.cancelTestDriveHandler(event, cardData)
                      }
                    >
                      {userLongTestRideConfig.cancelBtn.label}
                    </button>
                    {!cardData?.IsDocumentVerified && (
                      <button
                        className="btn btn--primary"
                        onClick={(event) => handleDocumentUpload(event)}
                      >
                        {userLongTestRideConfig.uploadDocBtn.label}
                      </button>
                    )}
                    <a
                      href="#"
                      className="btn btn--primary"
                      onClick={handleRescheduleTestDrive}
                    >
                      {" "}
                      {userLongTestRideConfig.rescheduleBtn.label}
                    </a>
                  </div>
                )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

LongTestRideCardDetails.propTypes = {
  userLongTestRideConfig: PropTypes.object,
  cardData: PropTypes.object,
  cancelTestDriveHandler: PropTypes.func
};

LongTestRideCardDetails.defaultProps = {
  cardData: {}
};

export default LongTestRideCardDetails;
