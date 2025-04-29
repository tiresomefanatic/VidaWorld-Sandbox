import React, { useEffect, useState } from "react";
import { useAllUserTestRides } from "../../hooks/userProfile/userProfileHooks";
import TestRideCardDetails from "./TestRideCardDetails/TestRideCardDetails";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CONSTANT from "../../../site/scripts/constant";
import Popup from "../Popup/Popup";
import CancelTestDrive from "../TestDrive/CancelTestDrive/CancelTestDrive";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";

const UserTestRides = (props) => {
  const { userTestRideConfig, cancelTestDriveConfig, allUserTestRidesData } =
    props;
  const [scheduledData, setScheduledData] = useState([]);
  const [confirmedData, setConfirmedData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);
  const [lapsedData, setLapsedData] = useState([]);
  const [cancelTestDriveData, setCancelTestDriveData] = useState({});
  const [isCancelTestDrive, setIsCancelTestDrive] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const getAllUserTestRides = useAllUserTestRides();

  useEffect(() => {
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );
      const scheduledData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.SCHEDULED
      );
      setScheduledData(scheduledData);

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );
      setConfirmedData(confirmedData);

      const completedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.COMPLETED
      );
      setCompletedData(completedData);

      const cancelledData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CANCELLED
      );
      setCancelledData(cancelledData);

      const lapsedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.LAPSED
      );
      setLapsedData(lapsedData);
    }
  }, [allUserTestRidesData]);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getAllUserTestRides();
  }, []);

  const reloadUserTestRides = () => {
    setSpinnerActionDispatcher(true);
    getAllUserTestRides();
    setIsCancelTestDrive(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleCancelTestDrive = (cancelTestDriveData) => {
    document.querySelector("html").classList.add("overflow-hidden");
    // document.querySelector(".vida-header__wrapper").style.transform =
    //   "translate(0px, 0px)";  // need to enable this later for 1.0
    setCancelTestDriveData(cancelTestDriveData);
    setIsCancelTestDrive(true);

    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Cancel Booking",
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const closeCancelTestDrive = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setIsCancelTestDrive(false);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "No",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
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
      const additionalPageName = ":Short Term Test Drive";
      const additionalJourneyName = "";

      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = appUtils.getPageUrl("testDriveUrl");
        }
      );
    } else {
      window.location.href = testDriveUrl;
    }
  };

  return (
    <>
      {allUserTestRidesData.items && (
        <div className="vida-user-test-rides">
          {allUserTestRidesData.items.filter((item) => !item.IsLTTR).length >
          0 ? (
            <>
              {scheduledData && scheduledData.length > 0 ? (
                <div className="vida-user-test-rides__type">
                  <h2 className="vida-user-test-rides__type-title">
                    {userTestRideConfig.scheduledLabel}
                  </h2>
                  {scheduledData.map((scheduledItem, index) => (
                    <TestRideCardDetails
                      userTestRideConfig={userTestRideConfig}
                      cardData={scheduledItem}
                      key={index}
                      cancelTestDriveHandler={handleCancelTestDrive}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
              {confirmedData && confirmedData.length > 0 ? (
                <div className="vida-user-test-rides__type">
                  <h2 className="vida-user-test-rides__type-title">
                    {userTestRideConfig.confirmedLabel}
                  </h2>
                  {confirmedData.map((confirmedItem, index) => (
                    <TestRideCardDetails
                      userTestRideConfig={userTestRideConfig}
                      cardData={confirmedItem}
                      key={index}
                      cancelTestDriveHandler={handleCancelTestDrive}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
              {completedData && completedData.length > 0 ? (
                <div className="vida-user-test-rides__type">
                  <h2 className="vida-user-test-rides__type-title">
                    {userTestRideConfig.completedLabel}
                  </h2>
                  {completedData.map((completedItem, index) => (
                    <TestRideCardDetails
                      userTestRideConfig={userTestRideConfig}
                      cardData={completedItem}
                      key={index}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
              {cancelledData && cancelledData.length > 0 ? (
                <div className="vida-user-test-rides__type">
                  <h2 className="vida-user-test-rides__type-title">
                    {userTestRideConfig.cancelledLabel}
                  </h2>
                  {cancelledData.map((cancelledItem, index) => (
                    <TestRideCardDetails
                      userTestRideConfig={userTestRideConfig}
                      cardData={cancelledItem}
                      key={index}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}

              {lapsedData && lapsedData.length > 0 ? (
                <div className="vida-user-test-rides__type">
                  <h2 className="vida-user-test-rides__type-title">
                    {userTestRideConfig.lapsedLabel}
                  </h2>
                  {lapsedData.map((lapsedItem, index) => (
                    <TestRideCardDetails
                      userTestRideConfig={userTestRideConfig}
                      cardData={lapsedItem}
                      key={index}
                    />
                  ))}
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="vida-user-test-rides__no-record">
              <h3>{userTestRideConfig.noRecordFound.title}</h3>
              {userTestRideConfig.noRecordFound.description && (
                <h4>{userTestRideConfig.noRecordFound.description}</h4>
              )}
              <button
                className="btn btn--primary btn--lg"
                onClick={(event) => handleTestRideNow(event)}
              >
                {userTestRideConfig.noRecordFound.btnLabel}
              </button>
            </div>
          )}
        </div>
      )}
      {isCancelTestDrive && (
        <Popup handlePopupClose={() => closeCancelTestDrive()}>
          <CancelTestDrive
            cancelTestDriveConfig={cancelTestDriveConfig}
            cardData={cancelTestDriveData}
            getAllTestRides={reloadUserTestRides}
            handleCancelTestDriveClose={() => closeCancelTestDrive()}
          />
        </Popup>
      )}
    </>
  );
};

const mapStateToProps = ({ userTestRideReducer }) => {
  return {
    allUserTestRidesData: {
      items: userTestRideReducer.items
    }
  };
};

UserTestRides.propTypes = {
  userTestRideConfig: PropTypes.object,
  cancelTestDriveConfig: PropTypes.object,
  allUserTestRidesData: PropTypes.object
};

export default connect(mapStateToProps)(UserTestRides);
