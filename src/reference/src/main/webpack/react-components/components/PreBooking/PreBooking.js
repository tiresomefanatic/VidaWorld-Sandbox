import React, { useState, useEffect } from "react";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import BookingDetailsByDealers from "./BookingDetailsByDealers/BookingDetailsByDealers";
import BookingDetails from "./BookingDetails/BookingDetails";
import PropTypes from "prop-types";
import Header from "../../../components/header/header";
import OtpForm from "../OtpForm/OtpForm";
import BookingLogin from "./BookingLogin/BookingLogin";
import Logger from "../../../services/logger.service";
import BookingInterest from "./BookingInterest/BookingInterest";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import {
  useGenerateOTP,
  useVerifyOTP,
  useGenerateBookingOTP,
  useVerifyBookingOTP
} from "../../hooks/userAccess/userAccessHooks";
import { useGetAllProducts } from "../../../react-components/hooks/preBooking/preBookingHooks";
import { connect } from "react-redux";
import BookingSummary from "./BookingSummary/BookingSummary";
import { setPreBookingDataAction } from "../../store/preBooking/preBookingActions";
import {
  setUserFormDataAction,
  // setUserCheckAction,
  setUserStatusAction
} from "../../store/userAccess/userAccessActions";
import CONSTANT from "../../../site/scripts/constant";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { RSAUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { getProductPricesData } from "../../services/productDetails/productDetailsService";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { setScooterInfoAction } from "../../store/scooterInfo/scooterInfoActions";
import { useGetMyScooterDetails } from "../../hooks/myScooter/myScooterHooks";
import { getUtmParams } from "../../../react-components/services/utmParams/utmParams";

const PreBooking = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const [showLogin, setShowLogin] = useState(true);
  const [showRegisterFields, setShowRegisterFields] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const [showBookingDetails, setShowBookingDetails] = useState(true);
  const [hideBookingIntrest, sethideBookingIntrest] = useState(true);
  const [scooterData, setScooterData] = useState(null);

  const [isActiveScooterModel, setActiveScooterModel] = useState();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const [showSteps, setShowSteps] = useState(1);
  const [priceList, setPriceList] = useState([]);
  const [isUserDataAvailable, setUserDataAvailable] = useState(false);
  const [showOtpError, setShowOtpError] = useState("");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const [defaultSelection, setDefaultSelection] = useState(0);
  const [isUpdatedCityState, setUpdatedCityState] = useState("");

  const getAllProductData = useGetAllProducts();
  const {
    config,
    userData,
    selectedScooterData,
    setPreBookingInfo,
    setUserAccessInfo,
    // setUserCheckInfo,
    setUserStatus,
    userProfileData,
    setScooterInfo,
    myScooter
  } = props;

  const [myScooterDetails, setMyScooterDetails] = useState(null);
  const [handleVariantCalled, setHandleVariantCalled] = useState();
  const getMyScooter = useGetMyScooterDetails();
  const [activeVariant, setActiveVariant] = useState(0);
  const getMyScooterData = async () => {
    setSpinnerActionDispatcher(true);
    const scooterData = await getMyScooter();
    setMyScooterDetails(scooterData);

    const configuratorDetails = {
      accessorizeName: ""
    };
    if (isAnalyticsEnabled) {
      const additionalPageName = ":Reserve for Pin Code";
      if (
        scooterData?.data?.getAllEccentricConfiguration[0]?.opportunity_lines
          ?.records.length
      ) {
        const accessoriesList = [];
        scooterData?.data?.getAllEccentricConfiguration[0]?.opportunity_lines?.records.forEach(
          (element) => {
            if (element.item_type === "Accessory") {
              accessoriesList.push(element.item_name);
            }
          }
        );
        configuratorDetails.accessorizeName = accessoriesList
          .toString()
          .split(",")
          .join("|");
      }

      analyticsUtils.trackPreBookingStart(
        additionalPageName,
        configuratorDetails
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getMyScooterData();
    } else {
      if (isAnalyticsEnabled) {
        const additionalPageName = ":Mobile Number";
        const configuratorDetails = {
          accessorizeName: ""
        };
        analyticsUtils.trackPreBookingStart(
          additionalPageName,
          configuratorDetails
        );
      }
    }
  }, []);

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });

      if (allProductsData) {
        allProductsData.data.products.items =
          allProductsData.data.products.items.filter(function (item) {
            return item.variants.length > 0;
          });
        let cityStateId = "";
        if (isUserLoggedIn) {
          let isPriceNotAvailable = false;
          if (
            isUserDataAvailable &&
            userProfileData.city &&
            userProfileData.state &&
            userProfileData.country
          ) {
            if (isUpdatedCityState !== "") {
              cityStateId = isUpdatedCityState;
              setUpdatedCityState("");
            } else {
              cityStateId =
                userProfileData.city +
                config.scooterInfo.splitterChar +
                userProfileData.state +
                config.scooterInfo.splitterChar +
                userProfileData.country;
            }

            allProductsData.data.products.items.map((model) => {
              model.variants.map((variant) => {
                priceList.map((item) => {
                  if (
                    item.city_state_id.toLowerCase() ===
                      cityStateId.toLowerCase() &&
                    item.variant_sku === variant.product.sku
                  ) {
                    isPriceNotAvailable = true;
                  }
                });
              });
            });

            if (!isPriceNotAvailable) {
              cityStateId = config.scooterInfo.defaultCityState;
            }
          } else {
            cityStateId = config.scooterInfo.defaultCityState;
          }
        } else {
          cityStateId = config.scooterInfo.defaultCityState;
        }
        allProductsData.data.products.items.map((model) => {
          model.variants.map((variant) => {
            priceList.map((item) => {
              if (
                item.city_state_id.toLowerCase() ===
                  cityStateId.toLowerCase() &&
                item.variant_sku === variant.product.sku
              ) {
                variant.product["price"] = currencyUtils.getCurrencyFormatValue(
                  item?.effectivePrice
                );
                variant.product["city"] =
                  cityStateId &&
                  cityStateId.split(config.scooterInfo.splitterChar)[0];
              }
            });
          });
        });

        setScooterData(allProductsData.data);
        if (!isActiveScooterModel && myScooterDetails) {
          if (myScooterDetails) {
            const myScooterAllRecords =
              myScooterDetails?.data?.getAllEccentricConfiguration[0]
                ?.opportunity_lines?.records || [];

            if (myScooterAllRecords.length) {
              const myScooterRecords =
                myScooterDetails.data.getAllEccentricConfiguration[0].opportunity_lines.records.find(
                  (element) => element.item_type === "Product"
                );
              const configuredScooterName = myScooterRecords.item_name;
              const selectedSku = allProductsData.data.products.items.filter(
                (item) => item.name === configuredScooterName
              );

              allProductsData.data.products.items.map((obj) => {
                obj.variants.map((variant, index) => {
                  if (variant.product.name == myScooterRecords.sku_name) {
                    setActiveVariant(index);
                  }
                });
              });

              const selectedSkuIndex =
                allProductsData.data.products.items.findIndex(
                  (obj) => obj.name === selectedSku[0].name
                );

              setActiveScooterModel(selectedSku[0].sku);
              setDefaultSelection(selectedSkuIndex);
            }
          } else {
            setActiveScooterModel(allProductsData.data.products.items[0].sku);
          }
        } else {
          const activeScooterData = allProductsData.data.products.items.filter(
            (item) => item.sku === selectedScooterData.sku
          )[0];
          const selectedScooterVariant = activeScooterData.variants.filter(
            (variant) =>
              variant.product.sku ===
              selectedScooterData.selectedVariant.product.sku
          )[0];

          const data = {
            name: selectedScooterData.name,
            sku: selectedScooterData.sku,
            sf_id: selectedScooterData.sf_id,
            variants: activeScooterData?.variants,
            selectedVariant: selectedScooterVariant
          };
          setScooterInfo(data);
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleActiveScooter = (productData) => {
    setActiveScooterModel(productData.sku);
  };

  // function for going to next step by increasing step state by 1
  const handleStep = (type) => {
    if (type) {
      setShowSteps(showSteps + 1);
    } else {
      setShowSteps(showSteps - 1);
    }
  };

  useEffect(() => {
    getProductPriceList();
    if (isLoggedIn) {
      setShowSteps(CONSTANT.PRE_BOOKING_STEPS.LOGGEDIN_USER_STEP);
    }
  }, []);

  //TODO: Below 2 useEffect methods needs to be merged together (Since useEffect called multiple time, setting isUserDataAvailable flag as true always)
  useEffect(() => {
    if (priceList.length > 0) {
      if (isUserLoggedIn) {
        if (isUserDataAvailable) {
          getAllProductsData();
        }
      } else {
        getAllProductsData();
      }
    }
  }, [priceList, isUserDataAvailable]);

  useEffect(() => {
    if (
      userProfileData.fname ||
      (userProfileData.city && userProfileData.state && userProfileData.country)
    ) {
      setUserDataAvailable(true);
    }
  }, [userProfileData]);

  useEffect(() => {
    if (isUpdatedCityState !== "") {
      getAllProductsData();
    }
  }, [isUpdatedCityState]);

  useEffect(() => {
    //if user logged in then check if myScooter is already fetched
    if (showBookingDetails && myScooterDetails && isUserLoggedIn) {
      getAllProductsData();
    }
  }, [showBookingDetails, myScooterDetails, isUserLoggedIn]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [showLogin, isUserLoggedIn, showBookingDetails, hideBookingIntrest]);

  const [showEmailverify, setShowEmailverify] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const generateBookingLoginOTP = useGenerateBookingOTP(true);
  const generateBookingRegisterOTP = useGenerateBookingOTP(false);
  const generateVerifyEmailOTP = useGenerateOTP(false, true);
  const verifyBookinLoginOTP = useVerifyBookingOTP(true);
  const verifyBookingRegisterOTP = useVerifyBookingOTP(false);
  const verifyEmailOTP = useVerifyOTP(false);

  //sending data for generating OTP
  const handleGenerateOTP = async (data) => {
    try {
      !isLoggedIn &&
        setUserAccessInfo({
          countryCode: data.countryCode || defaultCountryCode,
          numberOrEmail: data.numberOrEmail || "",
          mobileNumber: data.mobileNumber,
          fname: data.fname || "",
          lname: data.lname || "",
          email: data.email || "",
          customer_city: data.customerCity || "",
          customer_state: data.customer_state || "",
          customer_country: data.customer_country || ""
        });
      setPreBookingInfo({
        source: "prebooking",
        subscribe: data.subscribe
      });
      setSpinnerActionDispatcher(true);
      setShowOtpError("");
      let result = {};
      if (data.fname && data.lname && data.email && !userData.customerExists) {
        result = await generateBookingRegisterOTP({
          variables: {
            country_code: data.countryCode || defaultCountryCode,
            mobile_number: RSAUtils.encrypt(data.mobileNumber),
            email: RSAUtils.encrypt(data.email),
            source: data.source,
            isForcedLogIn: data.isForcedLogIn
          }
        });
      } else if (showEmailverify) {
        await generateVerifyEmailOTP({
          variables: {
            country_code: userData.countryCode || defaultCountryCode,
            mobile_number: RSAUtils.encrypt(userData.mobileNumber),
            email: RSAUtils.encrypt(userData.email)
          }
        });
      } else {
        result = await generateBookingLoginOTP({
          variables: {
            country_code: data.countryCode || defaultCountryCode,
            username: RSAUtils.encrypt(data.numberOrEmail),
            source: data.source,
            isForcedLogIn: data.isForcedLogIn
          }
        });
      }

      if (result.data && result.data.SendOtp.status_code === 200) {
        const customLink = {
          name: "Continue",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        const location = {
          state: "",
          city: "",
          pinCode: "",
          country: ""
        };
        const productDetails = {
          modelVariant: selectedScooterData?.name,
          modelColor: selectedScooterData?.selectedVariant?.product.name,
          productID: selectedScooterData?.sf_id
        };
        const bookingDetails = {
          preBookingReceiveNotificationStatus: data.subscribe ? "Yes" : "No"
        };
        if (result.data.SendOtp.customer_exist || data.isForcedLogIn) {
          setShowLogin(false);
          setShowRegisterFields(false);
          if (isAnalyticsEnabled) {
            const additionalPageName = ":Personal Detail";

            analyticsUtils.trackNotificationCBClick(
              customLink,
              location,
              productDetails,
              bookingDetails,
              additionalPageName
            );
            const pageViewName = "Verify OTP";
            analyticsUtils.trackPreBookPageView(pageViewName);
          }
        } else {
          setShowLogin(true);
          setShowRegisterFields(true);
          if (isAnalyticsEnabled) {
            const additionalPageName = ":Mobile Number";
            analyticsUtils.trackCustomButtonClick(
              customLink,
              location,
              productDetails,
              additionalPageName
            );
            const ctaPageView = "Personal Detail";
            analyticsUtils.trackPreBookPageView(ctaPageView);
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const setLoginStatus = () => {
    const header = document.querySelector(".vida-header");
    Header.enableUserAccessLinks(header);
    // Push the user status "true" to the Reducer
    setUserStatus({
      isUserLoggedIn: true
    });
  };

  const redirectToLoggedInUserStep = () => {
    setUserLoggedIn(true);
    setShowSteps(CONSTANT.PRE_BOOKING_STEPS.LOGGEDIN_USER_STEP);
  };

  //Verify OTP
  const handleVerifyOTP = async (event, otp) => {
    const params = getUtmParams();
    let variables = {
      SF_ID: userData.sfid,
      otp: RSAUtils.encrypt(otp),
      username: RSAUtils.encrypt(userData.numberOrEmail),
      country_code: userData.countryCode
        ? userData.countryCode
        : defaultCountryCode,
      is_login: userData.customerExists,
      intrested_in_prebooking: true,
      intrested_in_testride: false,
      customer_city: userData.customerCity,
      customer_state: userData.customerState,
      customer_country: userData.customerCountry,
      customer_pincode: "",
      whatsapp_consent: userData.subscribe,
      customer_exist: userData.customerExists,
      utm_params: params
    };

    if (!userData.customerExists) {
      variables = showEmailOtp
        ? {
            SF_ID: userData.sfid,
            otp: RSAUtils.encrypt(otp),
            country_code: userData.countryCode
              ? userData.countryCode
              : defaultCountryCode,
            fname: userData.firstname,
            lname: userData.lastname,
            mobile_number: RSAUtils.encrypt(userData.mobileNumber),
            email: RSAUtils.encrypt(userData.email),
            customer_city: userData.customerCity,
            customer_state: userData.customerState,
            customer_country: userData.customerCountry,
            utm_params: params
          }
        : {
            SF_ID: userData.sfid,
            otp: RSAUtils.encrypt(otp),
            fname: userData.firstname,
            lname: userData.lastname,
            email: RSAUtils.encrypt(userData.email),
            country_code: userData.countryCode
              ? userData.countryCode
              : defaultCountryCode,
            mobile_number: RSAUtils.encrypt(userData.mobileNumber),
            is_login: userData.customerExists,
            intrested_in_prebooking: true,
            intrested_in_testride: false,
            customer_city: userData.customerCity,
            customer_state: userData.customerState,
            customer_country: userData.customerCountry,
            customer_pincode: "",
            whatsapp_consent: userData.subscribe,
            customer_exist: userData.customerExists,
            utm_params: params
          };
    }

    try {
      setSpinnerActionDispatcher(true);
      setShowOtpError("");
      const otpResult = userData.customerExists
        ? await verifyBookinLoginOTP({
            variables
          })
        : showEmailOtp
        ? await verifyEmailOTP({
            variables
          })
        : await verifyBookingRegisterOTP({
            variables
          });

      if (otpResult && otpResult.data) {
        if (otpResult.data.VerifyOtp.status_code === 200) {
          if (userData.customerExists) {
            setLoginStatus();
            redirectToLoggedInUserStep();
          } else {
            setShowEmailverify(true);
            setLoginStatus();
            if (showEmailOtp) {
              redirectToLoggedInUserStep();
            }
          }

          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.target.innerText,
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const ctaPageName = ":Verify OTP";
            analyticsUtils.trackCtaClick(customLink, ctaPageName);
          }
        }
      } else {
        setShowOtpError(otpResult.errors.message);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCancelEmailVerification = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Reserve for Pin Code";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName
      );
    }
    setLoginStatus();
    redirectToLoggedInUserStep();
  };

  const handleSendEmailOtp = (data, event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Reserve for Pin Code";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
    }
    handleGenerateOTP(data);
    setShowEmailOtp(true);
  };

  // TODO: Need to cleanup the below 2 methods.
  const handleChangeNumber = (event) => {
    setShowLogin(true);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.currentTarget.innerText,
        position: "Middle",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Verify OTP";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
      const pageViewName = "Mobile Number";
      analyticsUtils.trackPreBookPageView(pageViewName);
    }
  };

  const handleBookingLoginNumber = () => {
    setShowRegisterFields(false);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Change Number",
        position: "Middle",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackPreBookChangeNumber(customLink);
    }
  };

  const showBookingSummary = (isNotified) => {
    setShowBookingDetails(false);
    sethideBookingIntrest(isNotified);
    setShowSteps(CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS);
    if (isAnalyticsEnabled) {
      if (!isNotified) {
        const customLink = {
          name: "Get Notified",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        analyticsUtils.trackCtaClick(customLink);
      }
    }
  };

  const updateOverridePrice = (city, state, country) => {
    setUpdatedCityState(
      city +
        config.scooterInfo.splitterChar +
        state +
        config.scooterInfo.splitterChar +
        country
    );
  };

  return (
    <div className="vida-container">
      <div className="vida-pre-booking">
        <div className="vida-pre-booking__container">
          <div className="vida-pre-booking__title">
            <div className="vida-pre-booking__step">
              {config.genericConfig.stepLabel}
              <span>{showSteps}</span>
              <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
            </div>
          </div>
          <h1 className="vida-pre-booking__title">
            {config.userDetails.title}
          </h1>
          <div
            className={`vida-pre-booking__scooter-info
          ${
            isUserLoggedIn && !showBookingDetails
              ? "vida-pre-booking__scooter-info-summary"
              : ""
          }`}
          >
            {isUserLoggedIn ? (
              <>
                {showBookingDetails ? (
                  <>
                    {scooterData?.products?.items
                      ?.sort((variantX, variantY) =>
                        variantX?.name?.toLowerCase() >
                        variantY?.name?.toLowerCase()
                          ? 1
                          : -1
                      )
                      ?.map((product, index) => (
                        <ScooterInfo
                          scooterInfoConfig={config.scooterInfo}
                          isPincodePage={true}
                          selectedScooterData={selectedScooterData}
                          isImgLeftLayout={true}
                          productData={product}
                          activeScooterHandler={handleActiveScooter}
                          key={index}
                          isActiveScooterModel={
                            isActiveScooterModel
                              ? product.sku == isActiveScooterModel
                                ? true
                                : false
                              : index == 0
                              ? true
                              : false
                          }
                          defaultSelection={defaultSelection}
                          myScooter={myScooter}
                          handleVariantCalled={handleVariantCalled}
                          setHandleVariantCalled={setHandleVariantCalled}
                          activeVariantParent={activeVariant}
                          setActiveVariantParent={setActiveVariant}
                          isOnStepThree={false}
                          // colorConfigured={
                          //   product.sku == isActiveScooterModel
                          //     ? colorConfigured
                          //     : ""
                          // }
                        ></ScooterInfo>
                      ))}
                  </>
                ) : (
                  <ScooterInfo
                    scooterInfoConfig={config.scooterInfo}
                    isBookingSummaryPage={true}
                    productData={selectedScooterData}
                    isActiveScooterModel={
                      selectedScooterData.sku == isActiveScooterModel
                        ? true
                        : false
                    }
                    defaultSelection={defaultSelection}
                    myScooter={myScooter}
                    handleVariantCalled={handleVariantCalled}
                    setHandleVariantCalled={setHandleVariantCalled}
                    activeVariantParent={activeVariant}
                    setActiveVariantParent={setActiveVariant}
                    isOnStepThree={true}
                    // colorConfigured={
                    //   product.sku == isActiveScooterModel ? colorConfigured : ""
                    // }
                  ></ScooterInfo>
                )}
              </>
            ) : (
              <>
                {scooterData?.products?.items
                  ?.sort((variantX, variantY) =>
                    variantX?.name?.toLowerCase() >
                    variantY?.name?.toLowerCase()
                      ? 1
                      : -1
                  )
                  ?.map((product, index) => (
                    <ScooterInfo
                      scooterInfoConfig={config.scooterInfo}
                      isImgLeftLayout={true}
                      productData={product}
                      activeScooterHandler={handleActiveScooter}
                      key={index}
                      isActiveScooterModel={
                        isActiveScooterModel
                          ? product.sku == isActiveScooterModel
                            ? true
                            : false
                          : index == 0
                          ? true
                          : false
                      }
                      defaultSelection={defaultSelection}
                      handleVariantCalled={handleVariantCalled}
                      setHandleVariantCalled={setHandleVariantCalled}
                      activeVariantParent={activeVariant}
                      setActiveVariantParent={setActiveVariant}
                      isOnStepThree={false}
                      // colorConfigured={
                      //   product.sku == isActiveScooterModel ? colorConfigured : ""
                      // }
                    ></ScooterInfo>
                  ))}
              </>
            )}
          </div>
          <div className="vida-pre-booking__booking-details">
            {isUserLoggedIn ? (
              <>
                {showBookingDetails ? (
                  <>
                    {config.showBookingdealers ? (
                      <BookingDetailsByDealers
                        personalDetails={config.userDetails}
                        genericConfig={config.genericConfig}
                        showBookingSummaryFields={showBookingSummary}
                        showSteps={showSteps}
                        cityField={config.cityField}
                        stateField={config.stateField}
                        overrideInfo={config.overrideInfo}
                        updateOverridePrice={updateOverridePrice}
                      ></BookingDetailsByDealers>
                    ) : (
                      <BookingDetails
                        personalDetails={config.userDetails}
                        genericConfig={config.genericConfig}
                        overrideInfo={config.overrideInfo}
                        showBookingSummaryFields={showBookingSummary}
                        showSteps={showSteps}
                        updateOverridePrice={updateOverridePrice}
                      ></BookingDetails>
                    )}
                  </>
                ) : (
                  <>
                    {hideBookingIntrest ? (
                      <BookingSummary
                        config={config.bookingSummary}
                        genericConfig={config.genericConfig}
                        handleBackShowDetails={setShowBookingDetails}
                        selectedScooterData={selectedScooterData}
                        showSteps={showSteps}
                        setSteps={handleStep}
                        myScooter={myScooter}
                      ></BookingSummary>
                    ) : (
                      <BookingInterest
                        config={config.bookingInterest}
                        handleBackShowDetails={setShowBookingDetails}
                      ></BookingInterest>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {showLogin ? (
                  <BookingLogin
                    loginConfig={config.userDetails}
                    genericConfig={config.genericConfig}
                    generateOTPHandler={handleGenerateOTP}
                    changeNumberHandler={handleBookingLoginNumber}
                    showRegisterFields={showRegisterFields}
                    showSteps={showSteps}
                  ></BookingLogin>
                ) : (
                  <>
                    <div className="vida-pre-booking__step">
                      {config.stepLabel}
                    </div>
                    <OtpForm
                      otpConfig={config.otpDetails}
                      showDisclaimer
                      genericConfig={config.genericConfig}
                      verifyOTPHandler={handleVerifyOTP}
                      changeNumberHandler={handleChangeNumber}
                      showSteps={showSteps}
                      isLogin={userData.customerExists}
                      showEmailverify={showEmailverify}
                      showEmailOtp={showEmailOtp}
                      cancelEmailVerification={handleCancelEmailVerification}
                      sendEmailOtp={handleSendEmailOtp}
                      showError={showOtpError}
                    ></OtpForm>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userAccessReducer,
  scooterInfoReducer,
  preBookingReducer,
  userProfileDataReducer,
  myScooterReducer
}) => {
  return {
    userData: {
      sfid: userAccessReducer.sfid,
      isLogin: userAccessReducer.isLogin,
      countryCode: userAccessReducer.countryCode,
      numberOrEmail: userAccessReducer.numberOrEmail,
      mobileNumber: userAccessReducer.mobileNumber,
      firstname: userAccessReducer.fname,
      lastname: userAccessReducer.lname,
      email: userAccessReducer.email,
      customerExists: userAccessReducer.customerExists,
      subscribe: preBookingReducer.subscribe,
      source: preBookingReducer.source,
      customerCity: userAccessReducer.customerCity,
      customerState: userAccessReducer.customerState,
      customerCountry: userAccessReducer.customerCountry
    },
    selectedScooterData: {
      name: scooterInfoReducer.name,
      sku: scooterInfoReducer.sku,
      sf_id: scooterInfoReducer.sf_id,
      variants: scooterInfoReducer.variants,
      selectedVariant: scooterInfoReducer.selectedVariant
    },
    userProfileData: {
      fname: userProfileDataReducer.fname,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    myScooter: {
      configuredScooterName: myScooterReducer.configuredScooterName,
      configuredSKUId: myScooterReducer.configuredSKUId,
      configuredAccessories: myScooterReducer.configuredAccessories
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPreBookingInfo: (data) => {
      dispatch(setPreBookingDataAction(data));
    },
    setUserAccessInfo: (data) => {
      dispatch(setUserFormDataAction(data));
    },
    // setUserCheckInfo: (data) => {
    //   dispatch(setUserCheckAction(data));
    // },
    setUserStatus: (status) => {
      dispatch(setUserStatusAction(status));
    },
    setScooterInfo: (data) => {
      dispatch(setScooterInfoAction(data));
    }
  };
};

PreBooking.propTypes = {
  config: PropTypes.object,
  userData: PropTypes.shape({
    sfid: PropTypes.string,
    isLogin: PropTypes.bool,
    countryCode: PropTypes.string,
    numberOrEmail: PropTypes.string,
    mobileNumber: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    customerExists: PropTypes.bool,
    subscribe: PropTypes.bool,
    source: PropTypes.string,
    customerCountry: PropTypes.string,
    customerCity: PropTypes.string,
    customerState: PropTypes.string
  }),
  setPreBookingInfo: PropTypes.func,
  setUserAccessInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  selectedScooterData: PropTypes.object,
  setUserStatus: PropTypes.func,
  userProfileData: PropTypes.object,
  setScooterInfo: PropTypes.func,
  myScooter: PropTypes.object
};

PreBooking.defaultProps = {
  config: {}
};
export default connect(mapStateToProps, mapDispatchToProps)(PreBooking);
