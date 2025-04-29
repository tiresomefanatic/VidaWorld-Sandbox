import React from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../../site/scripts/constant";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import Logger from "../../../../services/logger.service";
// import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { setTestDriveDataDispatcher } from "../../../store/testDrive/testDriveActions";

const TestRideCardDetails = (props) => {
  const { userTestRideConfig, cardData } = props;
  const imgPath = appUtils.getConfig("imgPath");
  const shortTermTestDriveUrl = appUtils.getPageUrl("shortTermTestDriveUrl");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const handleCTAClick = (e) => {
    e.preventDefault();

    //modifiled for vida 2.0
    const params = [
      "id=",
      cardData.Id,
      "&state=",
      cardData.State__c,
      "&city=",
      cardData.City__c,
      "&dealerName=",
      cardData.dmpl__DemoAddress__c,
      "&date=",
      cardData.dmpl__DemoDateTime__c,
      "&time=",
      cardData.DemoStartAndEndTime__c,
      "&variantId=",
      cardData.dmpl__ItemId__c,
      "&branchId=",
      cardData.dmpl__BranchId__c
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(params);

    if (isAnalyticsEnabled) {
      try {
        const customLink = {
          name: e.target.innerText,
          position: "Middle",
          type: "Button",
          clickType: "other"
        };

        const additionalPageName = ":Reschedule Appointment";
        const additionalJourneyName = "Reschedule";
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            if (cardData.State__c && cardData.City__c) {
              window.location.href = `${shortTermTestDriveUrl}?${encryptedParams}`;
            } else {
              window.location.href = `${shortTermTestDriveUrl}?id=${cardData.Id}&state=Delhi&city=NEW DELHI`;

              // TODO: remove default redirect once API is fixed
              // showNotificationDispatcher({
              //   title: "State or City value not available",
              //   type: CONSTANT.NOTIFICATION_TYPES.ERROR,
              //   isVisible: true
              // });
            }
          }
        );
      } catch (error) {
        Logger.error(error);
      }
    }
    if (cardData.State__c && cardData.City__c) {
      window.location.href = `${shortTermTestDriveUrl}?${encryptedParams}`;
    } else {
      window.location.href = `${shortTermTestDriveUrl}?id=${cardData.Id}&state=Delhi&city=NEW DELHI`;

      // TODO: remove default redirect once API is fixed
      // showNotificationDispatcher({
      //   title: "State or City value not available",
      //   type: CONSTANT.NOTIFICATION_TYPES.ERROR,
      //   isVisible: true
      // });
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
                alt={cardData.ItemName__c}
              />
            </div>
            <div className="vida-card__data">
              <div className="vida-card__product-data">
                <div className="vida-card__product-title">
                  <h3>{cardData.ItemName__c}</h3>
                  <h4>
                    {userTestRideConfig.bookingIdLabel}: {cardData.Name}
                  </h4>
                </div>
                <div className="vida-card__product-schedule">
                  <h3>{cardData.dmpl__DemoDate__c}</h3>
                  <p>{cardData.DemoStartAndEndTime__c}</p>
                </div>
              </div>
              <div className="vida-card__booking-data">
                <div className="vida-card__booking-item">
                  <i className="icon-location-marker"></i>
                  <label>
                    {cardData.dmpl__IsDemoOnsite__c
                      ? userTestRideConfig.homeLabel
                      : userTestRideConfig.dealershipLabel}
                  </label>
                  <h4>
                    {cardData?.dmpl__DemoAddress__c?.replaceAll("~", ",")}
                  </h4>
                  {/* <a href="#">View map</a> */}
                </div>
                <div className="vida-card__booking-item">
                  <i className="icon-user"></i>
                  <label>{userTestRideConfig.salesExecutiveLabel}</label>
                  <h4>
                    {cardData.SalesExecutiveName__c ||
                      userTestRideConfig.noAssigneeLabel}
                  </h4>
                  {cardData.SalesExecutivePhone__c && (
                    <a href={"tel:" + cardData.SalesExecutivePhone__c}>
                      {userTestRideConfig.callLabel}{" "}
                      {cardData.SalesExecutivePhone__c}
                    </a>
                  )}
                </div>
              </div>
              <div className="vida-card__button-container">
                {cardData.dmpl__Status__c ===
                  CONSTANT.TEST_RIDE_STATUS.SCHEDULED ||
                cardData.dmpl__Status__c ===
                  CONSTANT.TEST_RIDE_STATUS.CONFIRMED ? (
                  <>
                    <button
                      className="btn btn--secondary"
                      onClick={() =>
                        props.cancelTestDriveHandler &&
                        props.cancelTestDriveHandler(cardData)
                      }
                    >
                      {userTestRideConfig.cancelBtn.label}
                    </button>
                    <a
                      href="#"
                      className="btn btn--primary"
                      onClick={(e) => handleCTAClick(e)}
                    >
                      {userTestRideConfig.rescheduleBtn.label}
                    </a>
                  </>
                ) : (
                  <></>
                )}
                {/* {cardData.dmpl__Status__c ===
                CONSTANT.TEST_RIDE_STATUS.COMPLETED ? (
                  <>
                    <button className="btn btn--secondary">
                      {userTestRideConfig.downloadBtn.label}
                    </button>
                  </>
                ) : (
                  <></>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

TestRideCardDetails.propTypes = {
  userTestRideConfig: PropTypes.object,
  cardData: PropTypes.object,
  cancelTestDriveHandler: PropTypes.func
};

TestRideCardDetails.defaultProps = {
  cardData: {}
};

export default TestRideCardDetails;
