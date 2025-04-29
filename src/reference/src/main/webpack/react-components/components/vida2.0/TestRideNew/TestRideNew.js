import React, { useEffect, useState, useRef } from "react";
import Drawer from "../Drawer/Drawer";
import NameTicket from "../NameTicket/NameTicket";
import QuickDriveFormNew from "./QuickDriveFormNew/QuickDriveFormNew";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { connect } from "react-redux";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import {
  setUserStatusAction,
  setUserFormDataAction
} from "../../../store/userAccess/userAccessActions";
import { setUserFormDataActionDispatcher } from "../../../store/userAccess/userAccessActions";
import { setUserProfileDataDispatcher } from "../../../store/userProfile/userProfileActions";
import { setVidaTestDriveDispatcher } from "../../../store/vidaTestDrive/vidaTestDriveActions";
import {
  useBookTestDrive,
  useRescheduleTestDrive
} from "../../../hooks/testDrive/testDriveHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { useCancelUserTestRide } from "../../../hooks/userProfile/userProfileHooks";
import Logger from "../../../../services/logger.service";
import CONSTANT from "../../../../site/scripts/constant";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { getVidaCentreList } from "../../../../services/location.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useScreenshot } from "use-react-screenshot";
import { RWebShare } from "react-web-share";
import { updateNameToSendInApi } from "../../../services/commonServices/commonServices";

const TestRideNew = (props) => {
  const {
    backgroundImg,
    mobileBackgroundImg,
    redirectionUrl,
    bookingForm,
    bgImgAlt,
    bgImgTitle
  } = props.config;
  const {
    userDisplayData,
    setUserStatus,
    setUserAccessInfo,
    testDriveData,
    cmpProps,
    modelVariantList
  } = props;
  const { dataPosition } = bookingForm.otpConfig;
  const [isEditDealerData, setIsEditDealerData] = useState({
    location: false,
    date: false,
    time: false
  });
  const isLoggedIn = loginUtils.isSessionActive();

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const [modalVariant, setModalVariant] = useState([]);
  const bookTestRide = useBookTestDrive();
  const getCancelUserTestRide = useCancelUserTestRide();
  const rescheduleTestDrive = useRescheduleTestDrive();
  const [isBooked, setIsBooked] = useState(false);
  const [isOptForCancel, setOptForCancel] = useState(false);
  const [testRideResult, setTestRideResult] = useState({});
  const [isReschedule, setIsReschedule] = useState(false);
  const [testDriveId, setTestDriveId] = useState(null);
  const queryString = location.href.split("?")[1];
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const successContainerRef = useRef();
  const [isAnimate, setIsAnimate] = useState(false);

  const fetchCentreList = async (locationData) => {
    await getVidaCentreList(locationData.city);
  };

  const formatDate = (dateObj) => {
    const date = dateObj.split("T")[0].split("-");
    const formattedDate = date[2] + "-" + date[1] + "-" + date[0];

    return formattedDate;
  };

  const ticketDownloadRef = useRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "test-ride-confirmation.jpg";
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenShot(ticketDownloadRef.current).then(download);

  const ctaTracking = (e, pageName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          pageName ||
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
  };

  const ctaTrackingDownload = (e) => {
    if (isAnalyticsEnabled) {
      const closestLink = e?.target?.closest("a");
      const ctaText = e?.target?.alt || e?.target?.innerText;
      const ctaLocation = closestLink?.dataset?.linkPosition;
      const clickURL = closestLink?.getAttribute("href");
      if (clickURL?.endsWith(".pdf")) {
        const documentName = decodeURIComponent(
          clickURL
            .split("/")
            .pop()
            .replace(/\.pdf$/, "")
        );
        analyticsUtils.trackDocumentDetailsClick({
          documentName
        });
      } else {
        analyticsUtils.trackCTAClicksVida2(
          { ctaText, ctaLocation, clickURL },
          "ctaButtonClick"
        );
      }
    }
  };

  const trackFormDataChange = (pageName) => {
    if (isAnalyticsEnabled) {
      analyticsUtils.trackTestRideFormData(pageName);
    }
  };

  useEffect(() => {
    setModalVariant(modelVariantList);
  }, [modelVariantList]);

  useEffect(() => {
    async function checkforQueryParams() {
      if (queryString) {
        const decryptedParams = cryptoUtils.decrypt(queryString);
        const params = new URLSearchParams("?" + decryptedParams);

        const id = params.get("id");
        setTestDriveId(id);

        if (id) {
          setIsReschedule(true);
        }

        const locationData = {
          city: params.get("city"),
          state: params.get("state"),
          country: params.get("country"),
          dealerName: params.get("dealerName"),
          date: params.get("date"),
          time: params.get("time"),
          modalVariant: params.get("variantId")
        };

        fetchCentreList(locationData);
        const date = formatDate(locationData.date);
        setVidaTestDriveDispatcher({
          ...testDriveData,
          dealerName: locationData.dealerName,
          date: date,
          timeLabel: locationData.time,
          modalVariant: locationData.modalVariant
        });
      }
    }
    checkforQueryParams();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      trackFormDataChange("Test Ride");
    }
  }, []);

  //api call to book test Ride

  const handleTestRideBooking = async (
    selectedVariant,
    selectedDate,
    selectedTime
  ) => {
    setSpinnerActionDispatcher(true);
    if (testDriveId) {
      const rescheduleTestDriveData = await rescheduleTestDrive({
        variables: {
          SF_Booking_Id: testDriveId,
          dmpl__PartnerAccountId__c: testDriveData.partnerId,
          dmpl__BranchId__c: testDriveData.branchId,
          dmpl__ItemId__c: selectedVariant
            ? selectedVariant
            : testDriveData.modalVariant,
          dmpl__DemoSlotId__c: selectedTime?.id
            ? selectedTime?.id
            : testDriveData.time,
          dmpl__DemoDate__c: selectedDate ? selectedDate : testDriveData.date,
          dmpl__IsDemoOnsite__c: false,
          dmpl__DemoAddress__c: testDriveData.dealerName,
          dmpl__PostalCode__c: testDriveData.pincode
        }
      });

      if (
        rescheduleTestDriveData &&
        rescheduleTestDriveData?.data &&
        rescheduleTestDriveData?.data?.rescheduleTestDrive
      ) {
        setIsBooked(true);
        if (isAnalyticsEnabled) {
          const location = {
            state: testDriveData?.state,
            city: testDriveData?.city,
            pinCode: testDriveData?.pincode,
            country: "India"
          };
          const bookingDetails = {
            bookingStatus: "Test drive booking rescheduled",
            testDriveLocation: "Nearby Vida Center",
            vidaCenter: testDriveData?.dealerName,
            testDriveDate: selectedDate ? selectedDate : testDriveData.date,
            testDriveTime: selectedTime?.timeslot
              ? selectedTime?.timeslot
              : testDriveData.time,
            bookingID: testDriveId
          };
          analyticsUtils.trackTestRideReschedule(location, "", bookingDetails);
        }
        // window.location.href = redirectionUrl;
      }
    } else {
      const variables = {
        dmpl__PartnerAccountId__c: testDriveData.partnerId,
        dmpl__BranchId__c: testDriveData.branchId,
        dmpl__ItemId__c: selectedVariant
          ? selectedVariant
          : testDriveData.modalVariant,
        dmpl__DemoSlotId__c: selectedTime?.id
          ? selectedTime?.id
          : testDriveData?.time,
        dmpl__DemoDate__c: selectedDate ? selectedDate : testDriveData?.date,
        dmpl__IsDemoOnsite__c: false, //only at centre
        Test_Drive_Geolocation__Longitude__s: testDriveData.dealerLongitude,
        Test_Drive_Geolocation__Latitude__s: testDriveData.dealerLatitude,
        Google_Address__c: "",
        dmpl__DemoAddress__c: testDriveData.dealerName,
        dmpl__City__c: testDriveData.city,
        dmpl__State__c: testDriveData.state,
        dmpl__PostalCode__c: testDriveData.pincode,
        utm_params: {}
      };
      const result = await bookTestRide({
        variables
      });
      if (isAnalyticsEnabled && result?.data?.bookTestDrive?.success) {
        const location = {
          state: testDriveData?.state,
          city: testDriveData?.city,
          pinCode: testDriveData?.pincode,
          country: "India"
        };
        const bookingDetails = {
          bookingStatus: "Test Drive Booking Completed",
          testDriveLocation: "Nearby Vida Center",
          vidaCenter: testDriveData?.dealerName,
          testDriveDate: selectedDate ? selectedDate : testDriveData?.date,
          testDriveTime: selectedTime?.timeslot
            ? selectedTime?.timeslot
            : testDriveData?.time,
          bookingID: testDriveId || result?.data?.bookTestDrive?.id
        };
        const selectedModalVariant = modalVariant?.filter(
          (item) => item.sf_id === selectedVariant
        );
        const productDetails = {
          modelVariant: selectedModalVariant[0]?.sku || "",
          modalColor: "",
          productID: selectedModalVariant[0]?.sf_id || ""
        };
        analyticsUtils.trackTestDriveComplete(
          location,
          productDetails,
          bookingDetails,
          ""
        );
      }

      setTestRideResult(result);
      setTestDriveId(result?.data?.bookTestDrive?.id);

      return result;
    }
  };

  // storing the datas in store
  const handleFormSubmit = (
    formData,
    testrideLocation,
    selectedModalVariant,
    dealer,
    selectedDate,
    selectedTime
  ) => {
    // const [formFname, formLname] = updateNameToSendInApi(formData.fname);
    const username = formData.fname ? formData.fname.split(" ") : "";
    let formFname;
    let formLname;
    if (username) {
      formFname = username[0];
      formLname = username.splice(1).join(" ");
    }
    setUserFormDataActionDispatcher({
      ...cmpProps,
      fname: formFname || "",
      lname: formLname || "",
      email: formData?.email || "",
      mobileNumber: formData?.mobileNumber || "",
      customerCity: formData?.city || "",
      customerState: formData?.state || ""
    });
    setVidaTestDriveDispatcher({
      ...testDriveData,
      state: testrideLocation?.state || testDriveData?.state,
      city: testrideLocation?.city || testDriveData?.city,
      pincode: testDriveData.pincode
        ? testDriveData.pincode
        : dealer?.postalCode,
      branchId: dealer?.id ? dealer?.id : testDriveData.branchId,
      partnerId: dealer?.accountpartnerId
        ? dealer?.accountpartnerId
        : testDriveData.partnerId,
      dealerName: dealer?.experienceCenterName
        ? dealer?.experienceCenterName
        : testDriveData.dealerName,
      dealerLatitude: dealer?.latitude
        ? dealer?.latitude
        : testDriveData.dealerLatitude,
      dealerLongitude: dealer?.longitude
        ? dealer?.longitude
        : testDriveData.dealerLongitude,
      dealerAddress: dealer?.address
        ? dealer?.address
        : testDriveData.dealerAddress,
      date: selectedDate ? selectedDate : testDriveData.date,
      time: selectedTime?.id ? selectedTime?.id : testDriveData.time,
      timeLabel: selectedTime?.timeslot
        ? selectedTime?.timeslot
        : testDriveData.timeLabel,
      modalVariant: selectedModalVariant || testDriveData.modalVariant
    });
  };

  // for editing the dealers
  const handleIsEditDealer = (isEditData) => {
    setIsEditDealerData(isEditData);
  };

  const optForCancel = (event) => {
    if (successContainerRef) {
      successContainerRef.current.className += " animate-in";
    }
    event.preventDefault();
    setOptForCancel(true);
    ctaTracking(event, "Test Drive: Booking Confirmation");
    setTimeout(() => {
      successContainerRef.current.className = "vida-success__content";
    }, 1000);
  };

  const optForReschedule = (event) => {
    event.preventDefault();
    setIsAnimate(true);
    setIsReschedule(true);
    setTimeout(() => {
      setOptForCancel(false);
      setIsBooked(false);
      setIsAnimate(false);
      ctaTracking(event, "Test Drive: Booking Confirmation");
    }, 500);
  };

  const keepTestRide = (e) => {
    if (successContainerRef) {
      successContainerRef.current.className += " animate-in";
    }
    ctaTracking(e, "Test Drive: Booking Confirmation");
    setOptForCancel(false);
    setTimeout(() => {
      successContainerRef.current.className = "vida-success__content";
    }, 1000);
  };

  const cancelTestRide = async (e) => {
    try {
      ctaTracking(e, "Test Drive: Booking Confirmation");
      setSpinnerActionDispatcher(true);
      const cancelTestRideData = await getCancelUserTestRide({
        variables: {
          SF_Booking_Id: testDriveId,
          dmpl__Status__c: CONSTANT.TEST_RIDE_STATUS.CANCELLED,
          dmpl__CancellationReason__c: "I am out of station",
          dmpl__Remarks__c: "cancel please"
        }
      });
      if (cancelTestRideData) {
        if (isAnalyticsEnabled) {
          const location = {
            state: testDriveData?.state,
            city: testDriveData?.city,
            pinCode: testDriveData?.pincode,
            country: "India"
          };
          const bookingDetails = {
            bookingStatus: "Test Drive Booking Cancelled",
            testDriveLocation: "Nearby Vida Center",
            vidaCenter: testDriveData?.dealerName,
            testDriveDate: testDriveData?.date,
            testDriveTime: testDriveData?.timeLabel,
            bookingID: testDriveId
          };
          const cancellation = {
            cancellationReason: "I am out of station"
          };
          analyticsUtils.trackTestRideCancel(
            location,
            "",
            bookingDetails,
            cancellation
          );
        }
        // setIsBooked(true);
        window.location.href = redirectionUrl;
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  return (
    <div className="test-ride__container">
      <p>{isEditDealerData.location}</p>
      <div className="test-ride__bg-image">
        <img
          src={isDesktop ? backgroundImg : mobileBackgroundImg}
          alt={bgImgAlt || "background img"}
          title={bgImgTitle}
          loading="lazy"
        ></img>
      </div>
      <div className="vida-2-container test-ride__wrapper">
        {!isBooked && (
          <Drawer>
            <QuickDriveFormNew
              config={bookingForm}
              userDetails={userDisplayData}
              submitTestDriveFormData={handleFormSubmit}
              bookTestRide={handleTestRideBooking}
              dealersEdit={isEditDealerData}
              isSuccess={setIsBooked}
              isReschedule={isReschedule}
              dataPosition={dataPosition}
              testDriveData={testDriveData}
            ></QuickDriveFormNew>
          </Drawer>
        )}
        {isBooked && (
          <div
            className={
              isAnimate
                ? "vida-test-ride__success fade-out"
                : "vida-test-ride__success fade-in"
            }
          >
            <div className="vida-success__content" ref={successContainerRef}>
              {!isOptForCancel ? (
                <>
                  <div className="vida-test-ride__message">
                    <div className="test-ride-asset">
                      <img
                        src={
                          appUtils.getConfig("resourcePath") +
                          "images/svg/confirm-image.svg"
                        }
                      />
                    </div>
                    <p>
                      {bookingForm?.confirmCard?.confirmMsg}
                      <br />
                      <span>{bookingForm?.confirmCard?.funRideMsg}</span>
                    </p>
                  </div>
                  <div className="vida-test-ride__actions">
                    <div className="test-ride__actions-icons">
                      <RWebShare
                        data={{
                          url: ""
                        }}
                        onClick={(e) => console.log("shared successfully!")}
                      >
                        <div className="share-icon">
                          <a
                            href={bookingForm?.shareUrl}
                            onClick={(e) =>
                              ctaTracking(e, "Test Drive: Booking Confirmation")
                            }
                            data-link-position={dataPosition || "testride"}
                          >
                            <img
                              src={
                                appUtils.getConfig("resourcePath") +
                                "images/svg/share.svg"
                              }
                              alt="share"
                            />
                          </a>
                        </div>
                      </RWebShare>
                      <div
                        className="download-icon"
                        onClick={(event) => {
                          downloadScreenshot();
                        }}
                      >
                        <a
                          href={bookingForm?.downloadUrl}
                          onClick={(e) => ctaTrackingDownload(e)}
                          data-link-position={dataPosition || "testride"}
                        >
                          <img
                            src={
                              appUtils.getConfig("resourcePath") +
                              "images/svg/download.svg"
                            }
                            alt="download"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="test-ride-links">
                      <a
                        onClick={(e) => optForReschedule(e)}
                        data-link-position={dataPosition || "testride"}
                      >
                        {bookingForm?.rescheduleLabel}
                      </a>
                      <a
                        onClick={(e) => optForCancel(e)}
                        data-link-position={dataPosition || "testride"}
                      >
                        {bookingForm?.cancelLabel}
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="test-ride__cancel-container">
                  <div className="test-ride__cancel-content">
                    <p className="cancel-ride__message">
                      {bookingForm?.cancelCard?.cancelContentMsg}
                    </p>
                    <h3 className="cancel-ride__header">
                      {bookingForm?.cancelCard?.cancelHeader}
                    </h3>
                    <div className="cancel-ride__btn-wrapper">
                      <button
                        className="secondary-btn"
                        onClick={(e) => keepTestRide(e)}
                        data-link-position={dataPosition || "testride"}
                      >
                        {bookingForm?.cancelCard?.keepBtnLabel}
                      </button>
                      <button
                        className="primary-btn"
                        onClick={(e) => cancelTestRide(e)}
                        data-link-position={dataPosition || "testride"}
                      >
                        {bookingForm?.cancelCard?.cancelBtnLabel}
                      </button>
                    </div>
                    <p className="cancel-ride__notifyMsg">
                      {bookingForm?.cancelCard?.mistakeLabel}
                    </p>
                    <a
                      className="cancel-ride__reschedule"
                      onClick={(e) => optForReschedule(e)}
                      data-link-position={dataPosition || "testride"}
                    >
                      {bookingForm.rescheduleLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <NameTicket
          config={bookingForm}
          // userDetails={userDisplayData}
          getIsEditDealers={handleIsEditDealer}
          isSuccess={isBooked}
          ticketDownloadRef={ticketDownloadRef}
        ></NameTicket>
      </div>
    </div>
  );
};

TestRideNew.propTypes = {
  setUserStatus: PropTypes.func,
  setUserAccessInfo: PropTypes.func,
  userDisplayData: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string
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
    itemId: PropTypes.string,
    timeLabel: PropTypes.string,
    modalVariant: PropTypes.string
  }),
  cmpProps: PropTypes.object,
  config: PropTypes.shape({
    backgroundImg: PropTypes.string,
    mobileBackgroundImg: PropTypes.string,
    redirectionUrl: PropTypes.string,
    bookingForm: PropTypes.object,
    updateInfo: PropTypes.object,
    bgImgAlt: PropTypes.string,
    bgImgTitle: PropTypes.string
  }),
  modelVariantList: PropTypes.array
};

const mapStateToProps = ({
  userProfileDataReducer,
  testDriveVidaReducer,
  userAccessReducer,
  testDriveReducer
}) => {
  return {
    userDisplayData: {
      firstname: userProfileDataReducer.fname,
      lastname: userProfileDataReducer.lname,
      city: userProfileDataReducer.city,
      countrycode: userProfileDataReducer.code,
      mobilenumber: userProfileDataReducer.number,
      email: userProfileDataReducer.email
    },
    testDriveData: {
      state: testDriveVidaReducer.state,
      city: testDriveVidaReducer.city,
      pincode: testDriveVidaReducer?.pincode,
      branchId: testDriveVidaReducer?.branchId,
      partnerId: testDriveVidaReducer?.partnerId,
      dealerName: testDriveVidaReducer?.dealerName,
      date: testDriveVidaReducer?.date,
      time: testDriveVidaReducer?.time,
      dealerLatitude: testDriveVidaReducer?.dealerLatitude,
      dealerLongitude: testDriveVidaReducer?.dealerLongitude,
      dealerAddress: testDriveVidaReducer?.dealerAddress,
      timeLabel: testDriveVidaReducer?.timeLabel,
      modalVariant: testDriveVidaReducer?.modalVariant
    },
    cmpProps: {
      isLogin: userAccessReducer.isLogin,
      fname: userAccessReducer.fname,
      lname: userAccessReducer.lname,
      email: userAccessReducer.email,
      sfid: userAccessReducer.sfid,
      mobileNumber: userAccessReducer.mobileNumber,
      customerCity: userAccessReducer.customerCity,
      customerState: userAccessReducer.customerState
    },
    modelVariantList: testDriveReducer.modelVariantList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserStatus: (status) => {
      dispatch(setUserStatusAction(status));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestRideNew);
