import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { updateNameToDisplay } from "../../../services/commonServices/commonServices";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const NameTicket = (props) => {
  const { updateInfo } = props.config;
  const {
    userDetails,
    testDriveData,
    getIsEditDealers,
    isSuccess,
    ticketDownloadRef,
    getIsEditDealerLocation,
    scheduledData
  } = props;
  const [isUserLocation, setUserLocation] = useState("");
  const [isUserTestDriveDate, setUserTestDriveDate] = useState("");
  const [isUserTestDriveTime, setUserTestDriveTime] = useState("");
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isLoggedIn = loginUtils.isSessionActive();
  const [isUserName, setUserNames] = useState({
    randomNameContent: updateInfo?.defaultRandomName
  });

  const editDealerData = (key) => {
    const dealerEditData = {
      location: false,
      date: false,
      time: false,
      isShowMap: false
    };

    dealerEditData[key] = true;
    // setIsEditDealer(dealerEditData);
    getIsEditDealers(dealerEditData);
  };

  // for generating random names
  useEffect(() => {
    // create interval
    const interval = setInterval(
      // set name every 1s
      () => {
        setUserNames(
          JSON.parse(updateInfo?.randomNames)?.randomNameLabels[
            Math.floor(
              Math.random() *
                JSON.parse(updateInfo?.randomNames)?.randomNameLabels.length
            )
          ]
        );
      },

      1000
    );

    // clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  const inputValue = userDetails?.firstname || userDetails?.profileFname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  useEffect(() => {
    if (
      testDriveData?.dealerName ||
      (scheduledData && scheduledData[0]?.dmpl__DemoAddress__c)
    ) {
      setUserLocation(
        testDriveData?.dealerName ||
          (scheduledData && scheduledData[0]?.dmpl__DemoAddress__c)
      );
    }
    if (
      testDriveData?.date ||
      (scheduledData && scheduledData[0]?.dmpl__DemoDateTime__c)
    ) {
      setUserTestDriveDate(
        testDriveData?.date ||
          (scheduledData &&
            (scheduledData[0]?.dmpl__DemoDateTime__c).split("T")[0])
      );
    }
    if (
      testDriveData?.timeLabel ||
      (scheduledData && scheduledData[0]?.DemoStartAndEndTime__c)
    ) {
      setUserTestDriveTime(
        testDriveData?.timeLabel ||
          (scheduledData && scheduledData[0]?.DemoStartAndEndTime__c)
      );
    }
  }, [testDriveData, scheduledData]);

  return (
    <div className="ticket-name__container" ref={ticketDownloadRef}>
      <div className="ticket-name-top__container">
        <div className="ticket-name-top__bg-1">
          <img
            src={updateInfo?.bannerLeftImg}
            alt="banner left img"
            loading="lazy"
          ></img>
        </div>
        <div className="ticket-name-top__bg-2">
          <img
            src={updateInfo?.BannerRightImg}
            alt="banner right img"
            loading="lazy"
          ></img>
        </div>
        <div className="ticket-name-top__content-container">
          <div className="ticket-name-top__content">
            <p
              className="ticket-name-top__user-name"
              style={{ fontSize: fontSize }}
            >
              {`${
                userDetails?.firstname || userDetails?.profileFname
                  ? updateNameToDisplay(userDetails?.firstname) ||
                    updateNameToDisplay(userDetails?.profileFname)
                  : isUserName?.randomNameContent
              }'s`}
            </p>
            <h2
              className="ticket-name-top__ride-text"
              style={{ fontSize: fontSizeSubHeader }}
            >
              {updateInfo?.testRideText}
            </h2>
            <div className="ticket-name-top__offer-wrapper">
              <p className="ticket-name-top__amount">
                {updateInfo?.OfferPrice}
              </p>
              <p className="ticket-name-top__free-text">
                {updateInfo?.freeText}
              </p>
            </div>
          </div>
          <div className="ticket-name-top__bikeImg">
            <img
              src={updateInfo?.bannerBikeImg}
              alt={updateInfo?.bannerBikeImgAlt || "banner bike img"}
              title={updateInfo?.bannerBikeImgTitle}
              loading="lazy"
            ></img>
          </div>
        </div>
      </div>
      <div className="ticket-name-bottom__container">
        <div className="ticket-name-bottom__lets-meet-up">
          <div>
            <p className="ticket-name-bottom__header-text">
              {updateInfo?.meetLabel}
            </p>
            <div className="ticket-name-bottom__location-container">
              <input
                type="text"
                className="ticket-name-bottom__location"
                placeholder={updateInfo.meetPlaceholderLabel}
                defaultValue={isUserLocation}
              ></input>
              {isUserLocation ? (
                isSuccess ? (
                  <></>
                ) : (
                  <div className="ticket-name-bottom__edit-icon">
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/svg/edit-white-icon.svg`}
                      alt="edit-icon"
                      onClick={() => editDealerData("location")}
                    />
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
            {isUserLocation && !isSuccess && (
              <div className="ticket-name-bottom__border-bottom"></div>
            )}
          </div>
          {isUserLocation && (
            <div className="ticket-name-bottom__map-wrapper">
              <img
                src={`${appUtils.getConfig(
                  "resourcePath"
                )}images/svg/googlemapnotification.svg`}
                alt="map-icon"
                onClick={() => editDealerData("isShowMap")}
              />
            </div>
          )}
        </div>
        <div className="ticket-name-bottom__lets-meet-date">
          <p className="ticket-name-bottom__header-text">
            {updateInfo?.dateLabel}
          </p>
          <div className="ticket-name-bottom__location-container">
            <input
              type="text"
              className="ticket-name-bottom__date"
              placeholder={updateInfo.dateplaceholderlabel}
              defaultValue={isUserTestDriveDate}
            ></input>
            {isUserTestDriveDate ? (
              isSuccess ? (
                <></>
              ) : (
                <div className="ticket-name-bottom__edit-icon">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/edit-white-icon.svg`}
                    onClick={() => editDealerData("date")}
                  />
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          {isUserTestDriveDate && !isSuccess && (
            <div className="ticket-name-bottom__border-bottom"></div>
          )}
        </div>
        <div className="ticket-name-bottom__lets-meet-time">
          <p className="ticket-name-bottom__header-text">
            {updateInfo?.timeLabel}
          </p>
          <div className="ticket-name-bottom__location-container">
            <input
              type="text"
              className="ticket-name-bottom__time"
              placeholder={updateInfo.timePlaceholderLabel}
              defaultValue={isUserTestDriveTime}
            ></input>
            {isUserTestDriveTime ? (
              isSuccess ? (
                <></>
              ) : (
                <div className="ticket-name-bottom__edit-icon">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/edit-white-icon.svg`}
                    onClick={() => editDealerData("time")}
                  />
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          {isUserTestDriveTime && !isSuccess && (
            <div className="ticket-name-bottom__border-bottom"></div>
          )}
        </div>
        <div className="ticket-name-bottom__vidaExpert-container">
          <div className="ticket-name-bottom__expert-info">
            <div className="ticket-name-bottom__icon-container">
              <img src={updateInfo?.vidaExpertIcon} alt="expert icon"></img>
            </div>
            <div className="ticket-name-bottom__expert-wrapper">
              <p className="ticket-name-bottom__header-text">
                {updateInfo?.VidaExpertLabel}
              </p>
              <p className="ticket-name-bottom__deatil-text">
                {updateInfo.yetToAssignLabel}
              </p>
            </div>
          </div>
          {isSuccess && (
            <a
              className="ticket-name-bottom__call-section"
              href={"tel:" + updateInfo.contactPhoneNumber}
            >
              <div className="expert__call-image">
                <img
                  src={
                    appUtils.getConfig("resourcePath") +
                    "images/svg/call-primary.svg"
                  }
                />
              </div>

              <p className="expert__call-text">Call</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userAccessReducer,
  testDriveVidaReducer,
  userProfileDataReducer
}) => {
  return {
    userDetails: {
      firstname: userAccessReducer.fname,
      mobileNumber: userAccessReducer.mobileNumber,
      profileFname: userProfileDataReducer.fname,
      profileNumber: userProfileDataReducer.number
    },
    testDriveData: {
      state: testDriveVidaReducer.state,
      city: testDriveVidaReducer.city,
      pincode: testDriveVidaReducer?.pincode,
      branchId: testDriveVidaReducer?.branchId,
      partnerId: testDriveVidaReducer?.partnerId,
      dealerName: testDriveVidaReducer?.dealerName,
      time: testDriveVidaReducer?.time,
      date: testDriveVidaReducer?.date,
      dealerLatitude: testDriveVidaReducer?.dealerLatitude,
      dealerLongitude: testDriveVidaReducer?.dealerLongitude,
      dealerAddress: testDriveVidaReducer?.dealerAddress,
      timeLabel: testDriveVidaReducer?.timeLabel
    }
  };
};

NameTicket.propTypes = {
  userDetails: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    mobileNumber: PropTypes.string,
    profileFname: PropTypes.string,
    profileNumber: PropTypes.string
  }),
  testDriveData: PropTypes.shape({
    state: PropTypes.string,
    city: PropTypes.string,
    pincode: PropTypes.string,
    branchId: PropTypes.string,
    partnerId: PropTypes.string,
    dealerName: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    dealerLatitude: PropTypes.string,
    dealerLongitude: PropTypes.string,
    dealerAddress: PropTypes.string,
    timeLabel: PropTypes.string
  }),
  config: PropTypes.shape({
    updateInfo: PropTypes.object
  }),
  getIsEditDealers: PropTypes.func,
  getIsEditDealerLocation: PropTypes.func,
  isSuccess: PropTypes.bool,
  ticketDownloadRef: PropTypes.object,
  scheduledData: PropTypes.array
};

export default connect(mapStateToProps)(NameTicket);
