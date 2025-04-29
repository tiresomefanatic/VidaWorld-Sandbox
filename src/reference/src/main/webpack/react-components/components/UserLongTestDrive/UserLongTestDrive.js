import React, { useEffect, useState } from "react";
import {
  useAllUserTestRides,
  useCancelUserLongTestRide
} from "../../hooks/userProfile/userProfileHooks";
import LongTestRideCardDetails from "./LongTestRideCardDetails";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Popup from "../Popup/Popup";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { useCancelUserTestRide } from "../../hooks/userProfile/userProfileHooks";
import CONSTANT from "../../../site/scripts/constant";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";

const UserLongTestDrive = (props) => {
  const {
    userLongTestRideConfig,
    allUserLongTestRidesData,
    cancelLongTestDriveConfig
  } = props;
  const [longTermTestDriveData, setlongTermTestDriveData] = useState([]);
  const [isCancelTestDrive, setIsCancelTestDrive] = useState(false);
  const [currentCardItem, setCardItem] = useState(null);
  const getAllUserLongTestRides = useAllUserTestRides();
  const getCancelUserLongTestDrive = useCancelUserLongTestRide();

  const getCancelUserTestRide = useCancelUserTestRide();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  useEffect(() => {
    if (allUserLongTestRidesData && allUserLongTestRidesData.length > 0) {
      // TODO: BELOW CODE WILL BE MODIFIED ONCE WE RECEIVE THE COMPLETE BOOKING STATUS LIST
      console.log(allUserLongTestRidesData);
      const longTermTestDriveData = allUserLongTestRidesData.filter(
        (item) => item.IsLTTR
      );
      setlongTermTestDriveData(longTermTestDriveData);
    }
  }, [allUserLongTestRidesData]);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getAllUserLongTestRides();
  }, []);

  const handleCancelTestDrive = (event, cardItem) => {
    setIsCancelTestDrive(true);
    setCardItem(cardItem);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const ctaPageName = ":Long Term Test Drive";
      const additionalJourneyName = ":Long Term Test Drive";
      analyticsUtils.trackCtaClick(
        customLink,
        ctaPageName,
        additionalJourneyName
      );
    }
  };

  const handleCancelLongTestDrive = async () => {
    try {
      if (currentCardItem.SfRentalId) {
        setSpinnerActionDispatcher(true);
        setIsCancelTestDrive(false);
        const response = await getCancelUserLongTestDrive({
          variables: {
            testRideId: currentCardItem.SfRentalId
          }
        });
        if (response?.data?.cancelTestRide) {
          getAllUserLongTestRides();
          if (isAnalyticsEnabled) {
            const location = {
              state: "",
              city: currentCardItem.rentalCity,
              pinCode: "",
              country: currentCardItem.country ? currentCardItem.country : ""
            };
            const productDetails = {
              modelVariant: currentCardItem.modelVariant
                ? currentCardItem.modelVariant
                : "",
              modalColor: "",
              productID: currentCardItem.itemId
            };
            const bookingDetails = {
              testDriveType: "Long Term Test Drive",
              testDriveLocation: currentCardItem.location,
              vidaCenter: "",
              testDriveDate: currentCardItem.startDate,
              testDriveTime: currentCardItem.startTime,
              bookingID: currentCardItem.bookingId,
              bookingStatus: "Test Drive Booking Cancelled",
              rentDuration: ""
            };
            const cancellation = {
              cancellationReason: "",
              cancellationComment: ""
            };
            analyticsUtils.trackTestRideCancel(
              location,
              productDetails,
              bookingDetails,
              cancellation
            );
          }
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const closeCancelTestDrive = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setIsCancelTestDrive(false);
  };

  const handleNoClickEvent = (event) => {
    setIsCancelTestDrive(false);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const ctaPageName = ":Long Term Test Drive";
      const additionalJourneyName = ":Long Term Test Drive";
      analyticsUtils.trackCtaClick(
        customLink,
        ctaPageName,
        additionalJourneyName
      );
    }
  };

  const handleTestRideNow = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Long Term Test Drive";
      const additionalJourneyName = "";
      const testDriveUrl = appUtils.getPageUrl("testDriveUrl");
      const queryString = cryptoUtils.encrypt(
        "testRideType=" + userLongTestRideConfig.id
      );
      const redirectUrl = `${testDriveUrl}?${queryString}`;

      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = redirectUrl;
        }
      );
    } else {
      window.location.href = redirectUrl;
    }
  };

  return (
    <>
      {allUserLongTestRidesData && (
        <div className="vida-user-long-test-rides">
          {allUserLongTestRidesData.filter((item) => item.IsLTTR).length > 0 ? (
            <>
              {longTermTestDriveData && longTermTestDriveData.length > 0 ? (
                <div className="vida-user-long-test-rides__type">
                  {longTermTestDriveData.map((scheduledItem, index) => (
                    <LongTestRideCardDetails
                      userLongTestRideConfig={userLongTestRideConfig}
                      cardData={scheduledItem}
                      key={index}
                      cancelTestDriveHandler={handleCancelTestDrive}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="vida-user-long-test-rides__no-record">
              <h3>{userLongTestRideConfig.noRecordFound.title}</h3>
              {userLongTestRideConfig.noRecordFound.description && (
                <h4>{userLongTestRideConfig.noRecordFound.description}</h4>
              )}
              <button
                className="btn btn--primary btn--lg"
                onClick={(event) => handleTestRideNow(event)}
              >
                {userLongTestRideConfig.noRecordFound.btnLabel}
              </button>
            </div>
          )}
        </div>
      )}
      {isCancelTestDrive && (
        <div className="vida-user-long-test-rides__popup-container">
          <Popup
            mode="popup--full-screen"
            handlePopupClose={() => closeCancelTestDrive()}
          >
            <div className="vida-user-long-test-rides__confirmation">
              <h3>{cancelLongTestDriveConfig.title}</h3>
              <p className="vida-user-long-test-rides__message">
                {cancelLongTestDriveConfig.message}
              </p>
              <div className="vida-user-long-test-rides__button-container">
                <button
                  className="btn btn--primary"
                  onClick={handleCancelLongTestDrive}
                >
                  {cancelLongTestDriveConfig.yesBtn.label}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={(event) => handleNoClickEvent(event)}
                >
                  {cancelLongTestDriveConfig.noBtn.label}
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ userTestRideReducer }) => {
  return {
    allUserLongTestRidesData: userTestRideReducer.items
  };
};

UserLongTestDrive.propTypes = {
  userLongTestRideConfig: PropTypes.object,
  cancelLongTestDriveConfig: PropTypes.object,
  allUserLongTestRidesData: PropTypes.array
};

export default connect(mapStateToProps)(UserLongTestDrive);
