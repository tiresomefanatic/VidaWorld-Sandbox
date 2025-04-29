import React, { useState, useEffect } from "react";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import BookingDetailsByDealers from "./BookingDetailsByDealers/BookingDetailsByDealers";
// import BookingDetails from "./BookingDetails/BookingDetails";
import PropTypes from "prop-types";
import Header from "../../../../components/header/header";
import OtpForm from "../OtpForm/OtpForm";
// import BookingLogin from "./BookingLogin/BookingLogin";
import Logger from "../../../../services/logger.service";
// import BookingInterest from "./BookingInterest/BookingInterest";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import {
  useGenerateOTP,
  useVerifyOTP,
  useGenerateBookingOTP,
  useVerifyBookingOTP
} from "../../../hooks/userAccess/userAccessHooks";
import { useGetAllProducts } from "../../../../react-components/hooks/preBooking/preBookingHooks";
import { connect } from "react-redux";
// import BookingSummary from "./BookingSummary/BookingSummary";
import RegisterForm from "../UserAccess/RegisterForm";
import { usePaymentInfo } from "../../../hooks/payment/paymentHooks";
import { setPreBookingDataAction } from "../../../store/preBooking/preBookingActions";
import {
  setUserFormDataAction,
  // setUserCheckAction,
  setUserStatusAction
} from "../../../store/userAccess/userAccessActions";
import CONSTANT from "../../../../site/scripts/constant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import {
  RSAUtils,
  cryptoUtils
} from "../../../../site/scripts/utils/encryptDecryptUtils";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setScooterInfoAction } from "../../../store/scooterInfo/scooterInfoActions";
import { useGetMyScooterDetails } from "../../../hooks/myScooter/myScooterHooks";
import { getUtmParams } from "../../../../react-components/services/utmParams/utmParams";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { RWebShare } from "react-web-share";
import {
  updateNameToSendInApi,
  updateNameToDisplay,
  getBikeDetailsByColor
} from "../../../services/commonServices/commonServices";
import {
  useUserData,
  useCheckActiveReservation
} from "../../../hooks/userProfile/userProfileHooks";
// import ScooterInfoWrapper from "../ScooterInfoWrapper/ScooterInfoWrapper";
import { useQuickPurchasePayment } from "../../../hooks/quickPurchase/quickPurchaseHook";
// import useScreen from "../../../hooks/utilities/useScreen";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const PURCHASE_TYPE = {
  BUY: "BUY",
  BOOK: "BOOK"
};

const PreBooking = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const [showLogin, setShowLogin] = useState(true);
  const [showRegisterFields, setShowRegisterFields] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const [showBookingDetails, setShowBookingDetails] = useState(true);
  const [hideBookingIntrest, sethideBookingIntrest] = useState(true);
  const [scooterData, setScooterData] = useState(null);
  const [topTabActive, setTopTabActive] = useState(PURCHASE_TYPE.BUY); //default will be Buy Journey
  const [selectedCityData, setSelectedCityData] = useState("");

  const [isActiveScooterModel, setActiveScooterModel] = useState();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const paymentInfo = usePaymentInfo();
  const isActiveReservation = useCheckActiveReservation();

  const [showSteps, setShowSteps] = useState(1);
  const [priceList, setPriceList] = useState([]);
  const [isUserDataAvailable, setUserDataAvailable] = useState(false);
  const [showOtpError, setShowOtpError] = useState("");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const defaultCountry = "INDIA";
  const [defaultSelection, setDefaultSelection] = useState(0);
  const [isUpdatedCityState, setUpdatedCityState] = useState("");
  const [variantActiveIndex, setVariantActiveIndex] = useState("");
  const [isSelectedstatecity, setSelectedstatecity] = useState(true);
  const [isSelectedDealers, setSelectedDealers] = useState(false);
  const [isShowBookingPayment, setShowBookingPayment] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [isDealersConfirm, setDealersConfirm] = useState(false);
  const [isBacktoDealersList, setBacktoDealersList] = useState(false);
  const [isSelectedStateValue, setSelectedStateValue] = useState("");
  const [isSelectedCityValue, setSelectedCityValue] = useState("");
  const [isShowStateError, setShowStateError] = useState(false);
  const [isShowCityError, setShowCityError] = useState(false);
  const [showRegisterError, setShowRegisterError] = useState("");
  const [isDealersFound, setDealersFound] = useState(false);
  const [showLoginAccess, setShowLoginAccess] = useState(true);
  const [apiRejectError, setApiRejectError] = useState(null);
  const [variant, setVariant] = useState("V2 PRO");
  const [isBooking, setIsBooking] = useState(true);
  const [startAnalytics, setStartAnalytics] = useState(true);
  const [optedBikeVariant, setOptedBikeVariant] = useState({});
  // const [isredirectedFromDesignVida, setIsredirectedFromDesignVida] =
  //   useState(false);
  // const [buyerName, setBuyerName] = useState("");
  const [isredirectedFromDesignVida, setIsredirectedFromDesignVida] =
    useState(false);
  const [buyerName, setBuyerName] = useState("");
  const cityInputField = document.getElementsByClassName(
    "booking-city-search-input"
  )[0];
  const [dealerCity, setDealerCity] = useState();
  const [locationBool, setLocationBool] = useState(false);
  const ordersUrl = appUtils.getPageUrl("ordersUrl");
  const profileUrl = appUtils.getPageUrl("profileUrl");

  const getAllProductData = useGetAllProducts();
  const getUserData = useUserData();
  const {
    config,
    userData,
    selectedScooterData,
    nearByVidaExpCentreLength,
    setPreBookingInfo,
    setUserAccessInfo,
    // setUserCheckInfo,
    setUserStatus,
    userProfileData,
    setScooterInfo,
    myScooter
  } = props;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const purchaseDetailOptions =
    typeof config?.buyOptionsPopup.purchaseDetailsOptions == "string"
      ? JSON.parse(config?.buyOptionsPopup.purchaseDetailsOptions || "{}")
      : config?.buyOptionsPopup.purchaseDetailsOptions;
  const purchaseOptions = purchaseDetailOptions.purchaseOptions;

  const purchaseSummaryUrl = appUtils.getPageUrl("vidaPurchaseSummaryUrl");
  const [myScooterDetails, setMyScooterDetails] = useState(null);
  const [handleVariantCalled, setHandleVariantCalled] = useState();
  const getMyScooter = useGetMyScooterDetails();
  const [activeVariant, setActiveVariant] = useState(0);
  const [isUserName, setUserNames] = useState({
    randomNameContent: config?.genericConfig?.defaultRandomName
  });
  const queryString = location.href.split("?")[1];
  const selectedVariant = queryString ? decodeURIComponent(queryString) : "";
  const [showQuickPurchase, setShowQuickPurchase] = useState(true);
  const [registerHeader, setRegisterHeader] = useState("");

  const CustomSubHeaderTag = config?.genericConfig?.subHeaderTag;
  const CustomSelectVidaTag = config?.genericConfig?.selectVidaTag;
  const CustomChooseVidaTag = config?.genericConfig?.chooseColorTag;
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [showBuyOptionsPopup, setShowBuyOptionsPopup] = useState(true);

  const handleStartAnalytics = () => {
    // should run only once per render
    if (isAnalyticsEnabled) {
      if (startAnalytics) {
        setStartAnalytics(false);
        // analyticsUtils.trackPreBookingStart();
        if (topTabActive === "BUY") {
          analyticsUtils.trackBuyFormStart();
        }
      }
    }
  };

  const getMyScooterData = async () => {
    setSpinnerActionDispatcher(true);
    const scooterData = await getMyScooter();
    setMyScooterDetails(scooterData);

    const configuratorDetails = {
      accessorizeName: ""
    };
    if (isAnalyticsEnabled) {
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
      }
    }
  };

  const isUserEligibleForQuickPurchase = async () => {
    setSpinnerActionDispatcher(true);
    const isReservation = await isActiveReservation();
    const isEligible = parseInt(
      isReservation.data.checkActiveReservation.is_active_reservation
    );
    if (isEligible === 0) {
      setShowQuickPurchase(true);
      setTopTabActive(PURCHASE_TYPE.BUY);
    } else {
      setShowQuickPurchase(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getMyScooterData();
      isUserEligibleForQuickPurchase();
    }
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (cityInputField) {
      if (dealerCity) {
        cityInputField.disabled = false;
      } else {
        cityInputField.disabled = true;
      }
    }
  }, [dealerCity]);

  const ctaTracking = (e, eventName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const getProductPriceList = async () => {
    try {
      const result = await getProductPricesData();
      setPriceList(result);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleTopTabActive = (tabNumber) => {
    setTopTabActive(tabNumber);
  };

  const handleSelectedCityHandler = (value) => {
    setSelectedCityData(`${value?.city}~${value?.state}~${defaultCountry}`);
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
        // filtering the products with 0 color variants
        allProductsData.data.products.items =
          allProductsData.data.products.items.filter(function (item) {
            return item.variants.length > 0;
          });

        let cityStateId = "";

        if (isUserLoggedIn || !isUserLoggedIn) {
          let isPriceNotAvailable = false;
          if (
            (isUserDataAvailable || isUserDataAvailable == "") &&
            (userProfileData.city || userProfileData.city == "") &&
            (userProfileData.state || userProfileData.state == "") &&
            (userProfileData.country || userProfileData.country == "")
          ) {
            if (isUpdatedCityState !== "") {
              cityStateId = isUpdatedCityState;
              setUpdatedCityState("");
            } else {
              if (selectedCityData == "") {
                cityStateId =
                  userProfileData.city +
                  config.scooterInfo.splitterChar +
                  userProfileData.state +
                  config.scooterInfo.splitterChar +
                  userProfileData.country;
              } else {
                cityStateId = selectedCityData;
              }
            }

            allProductsData?.data?.products?.items?.map((model) => {
              model.variants?.map((variant) => {
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
              if (selectedCityData == "") {
                cityStateId = config.scooterInfo.defaultCityState;
              } else {
                cityStateId = selectedCityData;
              }
            }
          } else {
            if (selectedCityData == "") {
              cityStateId = config.scooterInfo.defaultCityState;
            } else {
              cityStateId = selectedCityData;
            }
          }
        } else {
          // if user not logged in
          if (selectedCityData == "") {
            // if user has not selected any city
            cityStateId = config.scooterInfo.defaultCityState;
          } else {
            // if user has selected a city
            cityStateId = selectedCityData;
          }
        }
        window.sessionStorage.setItem("cityStateId", cityStateId);
        allProductsData?.data?.products?.items?.map((model) => {
          model?.variants?.map((variant) => {
            priceList.map((item) => {
              if (
                item.city_state_id.toLowerCase() ===
                  cityStateId.toLowerCase() &&
                item.variant_sku === variant.product.sku
              ) {
                variant.product["price"] = currencyUtils.getCurrencyFormatValue(
                  item?.exShowRoomPrice
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
                myScooterDetails?.data?.getAllEccentricConfiguration[0].opportunity_lines.records.find(
                  (element) => element.item_type === "Product"
                );
              const configuredScooterName = myScooterRecords.item_name;
              const selectedSku = allProductsData.data.products.items.filter(
                (item) => item.name === configuredScooterName
              );

              allProductsData?.data?.products?.items.map((obj) => {
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
            setActiveScooterModel(
              allProductsData?.data?.products?.items[0].sku
            );
          }
        } else {
          const activeScooterData =
            allProductsData?.data?.products?.items?.filter(
              (item) => item.sku === selectedScooterData.sku
            )[0];
          const selectedScooterVariant = activeScooterData?.variants?.filter(
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

  useEffect(() => {
    const val = scooterData?.products?.items?.find((el) => el.name == variant);
    if (val) {
      const data = {
        name: val?.name,
        sku: val?.sku,
        sf_id: val?.sf_id,
        variants: val?.variants,
        selectedVariant: val?.variants[activeVariant]
      };
      setScooterInfo(data);
    }
  }, [variant, scooterData]);

  //TODO: Below 2 useEffect methods needs to be merged together (Since useEffect called multiple time, setting isUserDataAvailable flag as true always)
  useEffect(() => {
    if (priceList?.length > 0) {
      if (isUserLoggedIn) {
        if (isUserDataAvailable) {
          getAllProductsData();
        }
      } else {
        getAllProductsData();
      }
    }
  }, [priceList, isUserDataAvailable, selectedCityData]);

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

  // for generating random names
  // useEffect(() => {
  //   // create interval
  //   const interval = setInterval(
  //     // set name every 1s
  //     () => {
  //       setUserNames(
  //         JSON.parse(config?.genericConfig?.randomNames)?.randomNameLabels[
  //           Math.floor(
  //             Math.random() *
  //               JSON.parse(config?.genericConfig?.randomNames)?.randomNameLabels
  //                 .length
  //           )
  //         ]
  //       );
  //     },

  //     1000
  //   );

  //   // clean up interval on unmount
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const [showEmailverify, setShowEmailverify] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const generateBookingLoginOTP = useGenerateBookingOTP(true);
  const generateBookingRegisterOTP = useGenerateBookingOTP(false);
  const generateVerifyEmailOTP = useGenerateOTP(false, true);
  const verifyBookinLoginOTP = useVerifyBookingOTP(true);
  const verifyBookingRegisterOTP = useVerifyBookingOTP(false);
  const verifyEmailOTP = useVerifyOTP(false);
  const quickPurchasePayment = useQuickPurchasePayment();

  const isHandleModalClose = () => {
    setOpenModal(!isOpenModal);
  };

  //sending data for generating OTP
  const handleGenerateOTP = async (data, event, generateOtpBtnLabel) => {
    try {
      if (isAnalyticsEnabled) {
        const customLink = {
          ctaText: generateOtpBtnLabel,
          ctaLocation: "Buy"
        };
        analyticsUtils.trackCTAClicksVida2(customLink, "verifyOtpCta");
      }
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
      setShowRegisterError("");
      let result = {};
      let output = {};

      output = await generateBookingLoginOTP({
        variables: {
          country_code: data.countryCode || defaultCountryCode,
          username: RSAUtils.encrypt(data.mobileNumber),
          email: RSAUtils.encrypt(data.email),
          source: "prebooking",
          isForcedLogIn: false
        }
      });
      if (
        output?.data?.SendOtp?.status_code === 200 &&
        output?.data?.SendOtp?.customer_exist
      ) {
        setShowLoginAccess(false);
        setShowQuickPurchase(false);
        setShowRegisterError("");
      }
      if (
        output?.data?.SendOtp?.status_code === 200 &&
        !output?.data?.SendOtp?.customer_exist
      ) {
        setSpinnerActionDispatcher(true);
        result = await generateBookingRegisterOTP({
          variables: {
            country_code: data.countryCode || defaultCountryCode,
            mobile_number: RSAUtils.encrypt(data.mobileNumber),
            email: RSAUtils.encrypt(data.email),
            source: "prebooking",
            isForcedLogIn: true
          }
        });
        if (
          result?.data?.SendOtp?.status_code === 200 &&
          !result.data?.SendOtp?.customer_exist
        ) {
          setShowLoginAccess(false);
          setShowQuickPurchase(false);
          setShowRegisterError("");
        } else {
          setShowRegisterError(result?.errors?.message);
          if (
            result?.errors?.message.toLowerCase().includes("customer already")
          ) {
            const formDetails = {
              formType: "Buy",
              formErrorField: result.errors.message
                .toLowerCase()
                .includes("phone number and email")
                ? "Phone Number | Email"
                : result.errors.message.toLowerCase().includes("phone number")
                ? "Phone Number"
                : "Email"
            };
            analyticsUtils.trackBuyJourneyDropOut(
              formDetails,
              result?.errors?.message
            );
          }
        }
      }

      if (result?.data?.SendOtp?.status_code === 200) {
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
        } else {
          setShowLogin(true);
          setShowRegisterFields(true);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const setLoginStatus = () => {
    const header = document?.querySelector(".vida-header");
    if (header) {
      Header.enableUserAccessLinks(header);
    }
    // Push the user status "true" to the Reducer
    setUserStatus({
      isUserLoggedIn: true
    });
  };

  const redirectToLoggedInUserStep = () => {
    setUserLoggedIn(true);
    setShowSteps(CONSTANT.PRE_BOOKING_STEPS.LOGGEDIN_USER_STEP);
  };

  const handleMakePayment = async (e) => {
    let lastName =
      userProfileData?.lname ||
      userData.lastname ||
      userProfileData?.fname ||
      userData.firstname;
    lastName = lastName.trim().split(" ")[lastName.split(" ").length - 1];
    e.preventDefault();
    setSpinnerActionDispatcher(true);
    const params = getUtmParams();
    const paymentResult = await paymentInfo({
      variables: {
        sf_itemsku_id: selectedScooterData.selectedVariant.product.sf_id,
        sf_item_id: selectedScooterData.sf_id,
        first_name: userProfileData?.fname || userData.firstname,
        last_name: lastName,
        email_id: userProfileData?.email,
        customer_city: userProfileData?.city,
        pincode: userData?.dealerPinCode,
        branchId: userData?.branchId,
        partnerId: userData?.partnerId,
        utm_params: params
      }
    });
    if (!isLoggedIn) {
      await getUserData();
    }
    if (paymentResult?.data?.createPayment?.payment_url) {
      if (isAnalyticsEnabled) {
        const location = {
          state: selectedCityData
            ? selectedCityData?.split("~")[1]
            : userProfileData?.state, //userProfileData?.state,
          city: selectedCityData
            ? selectedCityData?.split("~")[0]
            : userProfileData?.city, //userProfileData?.city,
          pinCode: userData?.dealerPinCode,
          country: selectedCityData
            ? selectedCityData?.split("~")[2]
            : userProfileData?.country
        };
        const productDetails = {
          modelVariant: selectedScooterData?.selectedVariant?.product?.sku,
          modelColor:
            selectedScooterData?.selectedVariant?.product?.vaahan_color,
          productID: selectedScooterData?.sf_id
        };
        analyticsUtils.trackPreBookingPayment(location, productDetails);
      }
      window.location.href = paymentResult.data.createPayment.payment_url;
    } else {
      setSpinnerActionDispatcher(false);
      setApiRejectError(paymentResult?.errors?.message || "Error occured");
      setShowOtpError(paymentResult?.errors?.message || "Error occured");
    }
  };

  const trackLoginSignupSuccessFail = (eventName) => {
    if (isAnalyticsEnabled) {
      analyticsUtils.trackCTAClicksVida2("", eventName);
    }
  };

  const handleQuickPurchase = async (event) => {
    setSpinnerActionDispatcher(true);
    try {
      const params = getUtmParams();
      const quickPurchaseInfo = {
        branchId: userData?.branchId,
        firstname: isLoggedIn ? userProfileData.fname : userData?.firstname,
        lastname: isLoggedIn ? userProfileData.lname : userData?.lastname,
        email: isLoggedIn
          ? RSAUtils.encrypt(userProfileData.email)
          : RSAUtils.encrypt(userData?.email),
        mobile: isLoggedIn
          ? RSAUtils.encrypt(userProfileData.number)
          : RSAUtils.encrypt(userData?.mobileNumber),
        city: userData?.customerCity
          ? userData?.customerCity
          : isLoggedIn
          ? userProfileData.city
          : userData?.customerCity,
        state: userData?.customerState
          ? userData?.customerState
          : isLoggedIn
          ? userProfileData.state
          : userData?.customerState,
        pincode: userData?.dealerPinCode
          ? userData?.dealerPinCode
          : isLoggedIn
          ? userProfileData.pincode
          : userData?.dealerPinCode,
        skuId: selectedScooterData?.selectedVariant?.product?.sf_id,
        itemId: selectedScooterData?.sf_id,
        partnerAccountId: userData?.partnerId,
        utm_params: params
      };

      const quickPurchasePaymentRes = await quickPurchasePayment({
        variables: { input: quickPurchaseInfo }
      });
      if (!isLoggedIn) {
        await getUserData();
      }
      if (
        quickPurchasePaymentRes?.data?.quickPurchase?.success &&
        quickPurchasePaymentRes?.data?.quickPurchase?.opportunityId &&
        quickPurchasePaymentRes?.data?.quickPurchase?.saleOrderId
      ) {
        setSpinnerActionDispatcher(false);
        const opportunityId =
          quickPurchasePaymentRes?.data?.quickPurchase?.opportunityId;
        const saleOrderId =
          quickPurchasePaymentRes?.data?.quickPurchase?.saleOrderId;

        const encryptParams = [
          "orderId=",
          saleOrderId,
          "&opportunityId=",
          opportunityId
        ].join("");
        const encryptedParams = cryptoUtils.encrypt(encryptParams);
        const redirectUrl = purchaseSummaryUrl + "?" + encryptedParams;
        // setShowPopup(false);
        if (isAnalyticsEnabled) {
          const location = {
            state: userData?.customerState,
            city: userData?.customerCity,
            pinCode: "",
            country: defaultCountry
          };
          const startingPrice =
            selectedScooterData.selectedVariant.product.price;
          const productDetails = {
            modelVariant: selectedScooterData.name,
            modelColor: selectedScooterData.selectedVariant.attributes[0].label,
            productID: selectedScooterData.selectedVariant.product.sf_id,
            startingPrice: parseFloat(startingPrice.replace(/[₹\,]/g, ""))
          };
          const customLink = {
            name: event?.nativeEvent?.submitter?.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          // will be removed after trackQuickPurchaseInit this is created
          // analyticsUtils?.trackQuickPurchaseInit(
          //   location,
          //   productDetails,
          //   customLink,
          //   function () {
          //     window.location.href = redirectUrl;
          //   }
          // );
          window.location.href = redirectUrl;
        } else {
          window.location.href = redirectUrl;
        }
      } else {
        setSpinnerActionDispatcher(false);
        // setShowPopup(false);
        // const orderTag = `<a href='${ordersUrl}'> Orders </a>`;
        // const profileTag = `<a href='${profileUrl}'> Profile </a>`;
        // const orderReg = /orders/gi;
        // const profileReg = /profile/gi;
        const errMsg = quickPurchasePaymentRes?.errors?.message;
        const errMsgLowCase = errMsg.toLowerCase();

        // if (errMsgLowCase.includes("profile")) {
        //   errMsg = errMsg.replace(profileReg, profileTag);
        // }
        if (errMsgLowCase.includes("purchase")) {
          // errMsg = errMsg.replace(orderReg, orderTag);
          setDealersConfirm(true);
        }
        setShowOtpError(errMsg || "Error occured");
        setApiRejectError(errMsg || "Error occured");
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  //Verify OTP
  const handleVerifyOTP = async (event, otp) => {
    const [firstName, lastName] = updateNameToSendInApi(
      userData.firstname,
      userData.lastname
    );
    const params = getUtmParams();
    let variables = {
      SF_ID: userData.sfid,
      otp: RSAUtils.encrypt(otp),
      username: RSAUtils.encrypt(userData.mobileNumber),
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
            fname: firstName,
            lname: lastName,
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
            fname: firstName,
            lname: lastName,
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
      if (otpResult?.data) {
        if (otpResult?.data?.VerifyOtp?.status_code === 200) {
          trackLoginSignupSuccessFail("otpSuccess");

          // handleMakePayment(event);
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

          if (topTabActive === PURCHASE_TYPE.BOOK) {
            handleMakePayment(event);
          } else {
            // redirect to buy flow
            if (purchaseSummaryUrl) {
              if (isAnalyticsEnabled) {
                handleQuickPurchase(event);
                // const customLink = {
                //   ctaText: "verify otp",
                //   ctaLocation: "PreBooking"
                // };
                // analyticsUtils.trackCTAClicksVida2(
                //   customLink,
                //   "ctaButtonClick",
                //   async function () {
                //     handleQuickPurchase(event);
                //   }
                // );
              } else {
                handleQuickPurchase(event);
              }
            }
          }
        }
      } else {
        trackLoginSignupSuccessFail("otpFailure");
        setShowOtpError(otpResult.errors.message);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleCancelEmailVerification = (e) => {
    setLoginStatus();
    redirectToLoggedInUserStep();
  };

  const handleSendEmailOtp = (data, event) => {
    handleGenerateOTP(data, event);
    setShowEmailOtp(true);
  };

  // TODO: Need to cleanup the below 2 methods.
  const handleChangeNumber = (e) => {
    setShowLoginAccess(true);
    setShowLogin(true);
    ctaTracking(e, "ctaButtonClick");
  };

  const resendOtpHandler = () => {
    setShowOtpError("");
  };

  const handleBookingLoginNumber = () => {
    setShowRegisterFields(false);
  };

  const showBookingSummary = (isNotified) => {
    setShowBookingDetails(false);
    sethideBookingIntrest(isNotified);
    setShowSteps(CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS);
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

  // Getting the resourse(image/backgr) for the selected scooter variant color
  const handleColorChange = async (color, optedVariant = variant) => {
    const globalVarName = optedVariant.replace(" ", "").toLowerCase();
    const bikeVariantDetails = JSON.parse(
      config?.genericConfig?.bikeVariantDetails || "{}"
    );
    const bikeVariants = bikeVariantDetails?.bikeVariants;

    // Find the variant object with matching variantName
    const matchingVariant = bikeVariants.find(
      (variant) =>
        variant.variantName.replace(" ", "").toLowerCase() === globalVarName
    );

    const bikeVariant = matchingVariant.variantDetails
      ? matchingVariant.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(color, bikeVariant);
    setOptedBikeVariant(selectedBikeVariant);
  };

  // getting selected scooter from saved API data
  const getSelectedScooter = (currIndex) => {
    let defaultVariantColor = "";
    scooterData?.products?.items
      .filter((item, index) => {
        return index == currIndex;
      })
      .map((product, index) => {
        defaultVariantColor = product.variants[0].product.vaahan_color;
      });

    handleColorChange(defaultVariantColor, variant);
  };

  // for updating the variant info on variant button click
  const handleVariantClick = ({ name }, index) => {
    setVariant(name);
    setVariantActiveIndex(name);
    handleStartAnalytics();
    // gettiAng first color selection on bike variant switch
    getSelectedScooter(index);
    setActiveVariant(0);
  };

  useEffect(() => {
    let defaultVariant = "";
    if (scooterData && !locationBool) {
      setLocationBool(true);
      if (selectedVariant.toLowerCase().includes("v1")) {
        scooterData?.products?.items.map((item) => {
          if (selectedVariant.toLowerCase().includes(item.name.toLowerCase())) {
            defaultVariant = item;
          }
        });
        if (defaultVariant) {
          setVariantActiveIndex(defaultVariant?.name);
          setVariant(defaultVariant?.name);
          handleColorChange(
            defaultVariant?.variants[0]?.product?.vaahan_color,
            defaultVariant?.name
          );
          setVariant(defaultVariant?.name);
          getSelectedScooter(0);
          setActiveVariant(0);
        } else {
          setVariantActiveIndex(scooterData?.products?.items[0]?.name);
          setVariant(scooterData?.products?.items[0]?.name);
          getSelectedScooter(0);
          setActiveVariant(0);
        }
      } else {
        setVariantActiveIndex(scooterData?.products?.items[0]?.name);
        setVariant(scooterData?.products?.items[0]?.name);
        getSelectedScooter(0);
        setActiveVariant(0);
      }
    }
  }, [scooterData]);

  // for showing the dealers popup
  const handleDealersConfirm = (e) => {
    ctaTracking(e, "confirmCTAClick");
    setDealersConfirm(true);
    setSelectedstatecity(false);
    setBacktoDealersList(false);
  };

  // for Active reservation
  const handleActiveReservation = (e) => {
    ctaTracking(e, "ctaButtonClick");
    window.location.href = ordersUrl;
  };

  // for showing the booking payment
  const isHandleGoToPaymentBooking = (e) => {
    if (isAnalyticsEnabled) {
      const dealerData = {
        dealerName: userData.dealerName,
        dealerAddress: userData.dealerAddress,
        dealerPhoneNumber: userData.dealerPhoneNumber
      };
      analyticsUtils.trackCTAClickWithDealerDetails(dealerData);
    }
    if (!isLoggedIn) {
      setSelectedDealers(false);
      setDealersConfirm(false);
      setTopTabActive(PURCHASE_TYPE.BUY);
      setShowBookingPayment(true);
    } else {
      if (showQuickPurchase) {
        if (topTabActive === PURCHASE_TYPE.BOOK) {
          handleMakePayment(e);
        } else {
          handleQuickPurchase(e);
        }
      } else {
        // handleMakePayment(e);
        handleQuickPurchase(e);
      }
    }
  };

  //for redirecting to same dealers page
  const isHandleBackDealersPage = (e) => {
    setDealersConfirm(false);
    setSelectedDealers(true);
    setShowBookingPayment(false);
    setBacktoDealersList(true);
    ctaTracking(e, "ctaButtonClick");
  };

  // for getting the seletced city
  const isgetcityvalue = (city) => {
    setSelectedCityValue(city);
    setShowCityError(false);
  };

  // for getting the seletced state
  const isgetStateValue = (state) => {
    setSelectedStateValue(state);
    setShowStateError(false);
  };

  // for getting the dealers
  const isgetDealersFound = (isDealers) => {
    setDealersFound(isDealers);
  };

  // for downloading the spec detail PDF
  const isHandleDownloadPDF = (url) => {
    const downloadLink = document.createElement("a");
    const fileURL = url;
    downloadLink.href = fileURL;
    downloadLink.download = "Product-specification.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // checking for showing the dealers list
  const isHandleConfirmStateCity = (e) => {
    if (isSelectedCityValue && !isDealersFound) {
      setSelectedstatecity(false);
      if (nearByVidaExpCentreLength && !cityInputField.value.length < 1) {
        setShowCityError(false);
        setSelectedDealers(true);
        setShowStateError(false);
        handleStartAnalytics();
        ctaTracking(e, "confirmCTAClick");
      } else {
        setShowStateError(false);
        setSelectedstatecity(true);
        setSelectedDealers(false);
      }
    } else if (!isSelectedCityValue) {
      setShowCityError(true);
    }
  };
  let fontSize = "";
  let fontSizeSubHeader = "";

  const checkFontSize = () => {
    const inputValue = isLoggedIn
      ? userProfileData?.fname
      : buyerName.length > 0
      ? buyerName.split(" ")[0]
      : isUserName?.randomNameContent;

    ({ fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop));

    // useEffect(() => {
    //   if (scooterData) {
    //     // checking query params for redirect from design your vida to get selected scooter
    //     const queryString = location.href.split("?")[1];
    //     if (queryString) {
    //       const decryptedParams = cryptoUtils.decrypt(queryString);
    //       const params = new URLSearchParams("?" + decryptedParams);
    //       const variant = params.get("variant");
    //       const color = params.get("color");
    //       const name = params.get("name");
    //       const sku = params.get("sku");
    //       if (variant && color && sku) {
    //         setIsredirectedFromDesignVida(true);
    //         setBuyerName(name);
    //         setActiveScooterModel(sku);
    //         setVariantActiveIndex(
    //           variant.toLocaleLowerCase() === "v1 pro" ? 0 : 1
    //         );
    //         setVariant(variant);
    //         handleColorChange(color, variant);
    //       } else {
    //         // Getting first color selection of scooter on page load or scooterData change
    //         getSelectedScooter(0);
    //       }
    //     } else {
    //       getSelectedScooter(0);
    //     }
    //   }
    // }, [scooterData]);
  };
  checkFontSize();

  useEffect(() => {
    checkFontSize();
  }, []);

  useEffect(() => {
    config.registerConfig.registerFormBoldText = "";
    if (topTabActive === PURCHASE_TYPE.BUY) {
      config.registerConfig.registerFormBoldText =
        config?.genericConfig?.buyHeaderLabel;
      setRegisterHeader(config?.genericConfig?.buyHeaderLabel);
    } else {
      config.registerConfig.registerFormBoldText =
        config?.genericConfig?.headerLabel;
      setRegisterHeader(config?.genericConfig?.headerLabel);
    }
  }, [topTabActive]);

  useEffect(() => {
    if (scooterData && queryString) {
      // checking query params for redirect from design your vida to get selected scooter
      const queryString = location.href.split("?")[1];
      if (queryString) {
        const decryptedParams = cryptoUtils.decrypt(queryString);
        const params = new URLSearchParams("?" + decryptedParams);
        const variant = params.get("variant");
        const color = params.get("color");
        const name = params.get("name");
        const sku = params.get("sku");
        if (variant && color && sku) {
          setIsredirectedFromDesignVida(true);
          setBuyerName(name);
          setActiveScooterModel(sku);
          setVariantActiveIndex(variant);
          setVariant(variant);
          handleColorChange(color, variant);
        } else {
          // Getting first color selection of scooter on page load or scooterData change
          // getSelectedScooter(0);
        }
      } else {
        // getSelectedScooter(0);
      }
    }
  }, [scooterData]);

  const handleDealersback = () => {
    setSelectedstatecity(true);
    setSelectedDealers(false);
    setDefaultCityValue(isSelectedCityValue);
  };

  const handleSignUpBack = () => {
    setSelectedDealers(true);
    setShowBookingPayment(false);
  };

  const ctaTrackingBack = (e, eventName, screenName, pageName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText + " - " + screenName,
        ctaLocation:
          pageName || e?.target?.dataset?.linkPosition || e?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName, "", pageName);
    }
  };

  const purchaseOptionsHandler = (e, item) => {
    const customLink = {
      ctaText: item.name,
      ctaLocation: "Mode of purchase"
    };
    analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    if (item?.redirectionLink) {
      window.open(item.redirectionLink, item.newTab ? "_blank" : "_self");
    } else {
      setShowBuyOptionsPopup(false);
      document.body.style.overflow = "";
    }
  };

  return (
    <div className="buy-now-pre-booking-vida2">
      <div className="buy-now-pre-booking-vida2__background">
        <img
          src={
            isDesktop
              ? config?.genericConfig?.backgroundImg
              : config?.genericConfig?.mobileBackgroundImg
          }
          loading="lazy"
        ></img>
      </div>
      <div className="buy-now-pre-booking-vida2__wrapper">
        <div className="vida-2-container buy-now-pre-booking-vida2__container">
          <div
            className={`buy-now-pre-booking-vida2__left-wrapper ${
              isOpenModal ? "slide-down" : ""
            }`}
          >
            {!isDesktop && (
              <div className="drawer__header" onClick={isHandleModalClose}>
                <div className="header__line"></div>
              </div>
            )}
            {isSelectedstatecity && (
              <>
                <div className="pre-booking">
                  {isLoggedIn && showQuickPurchase && (
                    <div className="booking-tab-wrapper">
                      <div className="booking-tab-container">
                        <div className="tab-container">
                          <div
                            className={`tab-one-container ${
                              topTabActive === PURCHASE_TYPE.BOOK
                                ? "tab-one-container-active"
                                : ""
                            }`}
                            onClick={() => {
                              handleTopTabActive(PURCHASE_TYPE.BOOK);
                            }}
                          >
                            <div className="text-container">
                              <p className="text-one active">
                                {config?.bookBuySwitch?.tabOne?.textOne}
                              </p>
                              <span className="tab-price active">
                                {config?.bookBuySwitch?.tabOne?.price}
                              </span>
                              <p className="second-text active">
                                {config?.bookBuySwitch?.tabOne?.textTwo}
                              </p>
                            </div>
                          </div>
                          {/* tab two disabled until buy journey is here */}
                          <div
                            className={`tab-two-container ${
                              topTabActive === PURCHASE_TYPE.BUY
                                ? "tab-two-container-active"
                                : ""
                            }`}
                            onClick={() => {
                              handleTopTabActive(PURCHASE_TYPE.BUY);
                            }}
                          >
                            <div className="text-container tab-two-text">
                              <p className="text-one active">
                                {`Buy in ${userProfileData?.city}` ||
                                  config?.bookBuySwitch?.tabTwo?.textOne}
                              </p>
                              <span className="tab-price active">
                                {selectedScooterData?.selectedVariant?.product
                                  ?.price ||
                                  config?.bookBuySwitch?.tabTwo?.price}
                              </span>
                              <p className="second-text active">
                                {config?.bookBuySwitch?.tabTwo?.textTwo}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="orange-bottom-line"></div>
                      </div>
                    </div>
                  )}
                  <div className="pre-booking__details">
                    {/* <div
                    className={`pre-booking__${
                      isredirectedFromDesignVida
                        ? "details-design-vida"
                        : "details"
                    }`}
                  > */}
                    <p className="pre-booking__beginLabel">
                      {config?.genericConfig?.letsBeginLabel}
                    </p>
                    <h1 className="pre-booking__headerLabel">
                      {showQuickPurchase
                        ? topTabActive === PURCHASE_TYPE.BOOK
                          ? config?.genericConfig?.headerLabel
                          : config?.genericConfig?.buyHeaderLabel
                        : config?.genericConfig?.headerLabel}
                    </h1>
                    <CustomSubHeaderTag className="pre-booking__subHeaderLabel">
                      {config?.genericConfig?.subHeaderLabel}
                    </CustomSubHeaderTag>
                    <div>
                      <BookingDetailsByDealers
                        personalDetails={config.userDetails}
                        genericConfig={config.genericConfig}
                        showBookingSummaryFields={showBookingSummary}
                        showSteps={showSteps}
                        cityField={config.cityField}
                        stateField={config.stateField}
                        overrideInfo={config.overrideInfo}
                        updateOverridePrice={updateOverridePrice}
                        showStateErrorText={isShowStateError}
                        showCityErrorText={isShowCityError}
                        getselectedstateValue={isgetStateValue}
                        getSelectedCityValue={isgetcityvalue}
                        getDealersFound={isgetDealersFound}
                        selectedCityHandler={handleSelectedCityHandler}
                        startAnalyticsHandler={handleStartAnalytics}
                        setDealerCity={setDealerCity}
                        defaultCityFieldValue={defaultCityValue}
                      ></BookingDetailsByDealers>
                    </div>
                  </div>
                  {/* {!isredirectedFromDesignVida && ( */}
                  <div className="scooter__info">
                    <p className="scooter__header">
                      {config?.scooterInfo?.variantHeaderLabel}
                    </p>
                    <CustomSelectVidaTag className="scooter__sub-header">
                      {config?.scooterInfo?.selectVidaLabel}
                    </CustomSelectVidaTag>
                    <div className="scooter__variant-buttons">
                      {scooterData?.products?.items.map((product, index) => (
                        <button
                          className={`scooter__type-text ${
                            product?.name?.toLowerCase() ===
                            variantActiveIndex?.toLowerCase()
                              ? "scooter__selected"
                              : "scooter__not-selected"
                          }`}
                          key={index}
                          onClick={(e) => {
                            handleVariantClick(product, index);
                          }}
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>
                    <CustomChooseVidaTag className="scooter__color-label">
                      {config?.scooterInfo?.chooseColorLabel}
                    </CustomChooseVidaTag>

                    {scooterData?.products?.items
                      .filter((item, index) => {
                        return (
                          item?.name?.toLowerCase() ==
                          variantActiveIndex?.toLowerCase()
                        );
                      })
                      .map((product, index) => (
                        <ScooterInfo
                          scooterInfoConfig={config.scooterInfo}
                          isColorVariantLayout={true}
                          genericConfig={config.genericConfig}
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
                          startAnalyticsHandler={handleStartAnalytics}
                          handleColorChange={handleColorChange}
                        ></ScooterInfo>
                      ))}
                  </div>
                  {/* )}
                   {!isredirectedFromDesignVida && ( */}
                  <div>
                    <a
                      className="add-more-link"
                      href={config?.genericConfig?.addMoreNewTab}
                      target={
                        config?.genericConfig?.addMoreLink ? "_blank" : "_self"
                      }
                      rel="noreferrer"
                    >
                      {config?.genericConfig?.addMoreLabe1}
                    </a>
                  </div>
                  {/* )} */}
                  <div className="pre-booking__confirm-button-wrapper">
                    <button
                      data-link-position={config?.dataPosition || "Buy"}
                      className="pre-booking__confirm"
                      onClick={(e) => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        isHandleConfirmStateCity(e);
                      }}
                      disabled={!dealerCity}
                    >
                      {config?.genericConfig?.confirmButtonLabel}
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* {isSelectedDealers && ( */}
            <div
              className={`buy-now-pre-booking-vida2__dealers-container ${
                !isSelectedDealers ? "d-none" : ""
              }`}
            >
              <button
                type="button"
                className="back-button"
                onClick={(e) => {
                  ctaTrackingBack(
                    e,
                    "backButtonClick",
                    "Dealer Selection",
                    "Buy: Dealer Selection"
                  );
                  handleDealersback();
                }}
              >
                {config?.genericConfig?.backButtonLabel}
              </button>
              <p className="dealers__headerLabel">
                {config?.dealersConfig?.headerLabel}
              </p>
              <div>
                <BookingDetailsByDealers
                  dealersConfig={config.dealersConfig}
                  isShowDealersList={isSelectedDealers}
                  personalDetails={config.userDetails}
                  genericConfig={config.genericConfig}
                  showBookingSummaryFields={showBookingSummary}
                  showSteps={showSteps}
                  overrideInfo={config.overrideInfo}
                  updateOverridePrice={updateOverridePrice}
                  getselectedstateValue={isgetStateValue}
                  getSelectedCityValue={isgetcityvalue}
                  getDealersFound={isgetDealersFound}
                  selectedCityHandler={handleSelectedCityHandler}
                  startAnalyticsHandler={handleStartAnalytics}
                ></BookingDetailsByDealers>
              </div>
              <div className="pre-booking__confirm-button-wrapper">
                <button
                  className="pre-booking__confirm"
                  data-link-position={config?.dataPosition || "Buy"}
                  onClick={(e) => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    handleDealersConfirm(e);
                  }}
                >
                  {config?.dealersConfig?.confirmDealerLabel}
                </button>
              </div>
            </div>
            {/* // )} */}
            {isShowBookingPayment && (
              <div className="booking-login-wrapper">
                <div className="booking-tab-wrapper">
                  {showQuickPurchase && (
                    <div className="booking-tab-container">
                      <div className="tab-container">
                        <div
                          className={`tab-one-container ${
                            topTabActive === PURCHASE_TYPE.BOOK
                              ? "tab-one-container-active"
                              : ""
                          }`}
                          onClick={() => {
                            handleTopTabActive(PURCHASE_TYPE.BOOK);
                          }}
                        >
                          <div className="text-container">
                            <p className="text-one active">
                              {config?.bookBuySwitch?.tabOne?.textOne}
                            </p>
                            <span className="tab-price active">
                              {config?.bookBuySwitch?.tabOne?.price}
                            </span>
                            <p className="second-text active">
                              {config?.bookBuySwitch?.tabOne?.textTwo}
                            </p>
                          </div>
                        </div>
                        {/* tab two disabled until buy journey is here */}
                        <div
                          className={`tab-two-container ${
                            topTabActive === PURCHASE_TYPE.BUY
                              ? "tab-two-container-active"
                              : ""
                          }`}
                          onClick={() => {
                            handleTopTabActive(PURCHASE_TYPE.BUY);
                          }}
                        >
                          <div className="text-container tab-two-text">
                            <p className="text-one active">
                              {`Buy in ${userData?.customerCity}` ||
                                config?.bookBuySwitch?.tabTwo?.textOne}
                            </p>
                            <span className="tab-price active">
                              {selectedScooterData?.selectedVariant?.product
                                ?.price || config?.bookBuySwitch?.tabTwo?.price}
                            </span>
                            <p className="second-text active">
                              {config?.bookBuySwitch?.tabTwo?.textTwo}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="orange-bottom-line"></div>
                    </div>
                  )}
                </div>

                <div className="booking-login-container">
                  {showLoginAccess ? (
                    // !isredirectedFromDesignVida ?
                    <>
                      <button
                        type="button"
                        className="back-button"
                        onClick={(e) => {
                          ctaTrackingBack(
                            e,
                            "backButtonClick",
                            "PII form",
                            "Buy: PII form"
                          );
                          handleSignUpBack();
                        }}
                      >
                        {config?.genericConfig?.backButtonLabel}
                      </button>
                      <RegisterForm
                        registerConfig={config.registerConfig}
                        generateOTPHandler={handleGenerateOTP}
                        changeNumberHandler={handleChangeNumber}
                        isRequired={false}
                        showRegisterError={showRegisterError}
                        showQuickPurchaseTab={showQuickPurchase}
                        isBooking={true}
                        //     ></RegisterForm>
                        // ) : showLoginAccess && isredirectedFromDesignVida ? (
                        //   <RegisterForm
                        //     registerConfig={config.registerConfig2}
                        //     generateOTPHandler={handleGenerateOTP}
                        //     changeNumberHandler={handleChangeNumber}
                        //     isRequired={false}
                      ></RegisterForm>
                    </>
                  ) : (
                    <div className="booking-otp-container">
                      <div className="booking-login-otp-primary-text">
                        <p>
                          {config?.otpConfig?.otpFormNormalText}{" "}
                          {userData?.firstname}
                        </p>
                      </div>
                      <OtpForm
                        otpConfig={config.otpConfig}
                        verifyOTPHandler={handleVerifyOTP}
                        changeNumberHandler={handleChangeNumber}
                        isLogin={userData.isLogin}
                        cancelEmailVerification={handleCancelEmailVerification}
                        sendEmailOtp={handleSendEmailOtp}
                        showError={showOtpError}
                        resendOtpHandler={resendOtpHandler}
                        altDataPosition="Buy"
                      ></OtpForm>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {isDealersConfirm && (
            <div
              className={`confirm__pop-up ${
                isBacktoDealersList ? "d-none" : ""
              }`}
            >
              <div className="confirm__content">
                <p className="confirm__header">{config?.popUpConfig?.header}</p>
                <p className="confirm__sub-header">{userData?.dealerName}</p>
                <p
                  className="confirm__desc"
                  dangerouslySetInnerHTML={{
                    __html: config?.popUpConfig?.desc
                  }}
                ></p>
                <p className="confirm__confirm-msg">
                  {config?.popUpConfig?.confirmMessage}
                </p>
                {apiRejectError && (
                  <p
                    className="confirm__api-error-msg"
                    dangerouslySetInnerHTML={{
                      __html: apiRejectError
                    }}
                  ></p>
                )}
                <div className="confirm__button-container">
                  {!apiRejectError && (
                    <button
                      className="confirm__cancel-button confirm__confirm-cancel-button"
                      data-link-position={
                        config?.otpConfig?.dataPosition || "Buy"
                      }
                      onClick={(e) => {
                        isHandleBackDealersPage(e);
                      }}
                    >
                      {config?.popUpConfig?.cancelButtonLabel}
                    </button>
                  )}
                  {!apiRejectError && (
                    <button
                      className="confirm__confirm-button confirm__confirm-cancel-button"
                      onClick={(e) => {
                        isHandleGoToPaymentBooking(e);
                      }}
                    >
                      {config?.popUpConfig?.confirmButtonLabel}
                    </button>
                  )}
                  {apiRejectError && (
                    <button
                      className="confirm__confirm-button confirm__confirm-cancel-button confirm__confirm-button--full-width"
                      data-link-position="Buy"
                      onClick={(e) => {
                        handleActiveReservation(e);
                      }}
                    >
                      {config?.popUpConfig?.goToOrdersButtonLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {showBuyOptionsPopup && (
            <div className="confirm__pop-up">
              <div className="buy-options__content">
                <p className="buy-options__header">
                  {config?.buyOptionsPopup.header}
                </p>
                {purchaseOptions.length > 1 && (
                  <div className="purchase-options-container">
                    {purchaseOptions.map(
                      (option) =>
                        option.show && (
                          <div
                            className="purchase-option"
                            key={option.name}
                            onClick={(e) => purchaseOptionsHandler(e, option)}
                          >
                            {option.imageDesktopPath ||
                            option.imageMobilePath ? (
                              <img
                                src={
                                  isDesktop
                                    ? option.imageDesktopPath
                                    : option.imageMobilePath
                                }
                                alt={option.name}
                              />
                            ) : (
                              <p className="direct-purchase-button">
                                {option.name}
                              </p>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )}
                {/* {Removing Button container as per Business Feedback} */}
                {/* <div className="buy-options-button-container">
                  <button className="cancel-button">
                    {config?.buyOptionsPopup?.cancelButton}
                  </button>

                  <button className="confirm-button">
                    {config?.buyOptionsPopup?.confirmButton}
                  </button>
                </div> */}
              </div>
            </div>
          )}
          <div className="buy-now-pre-booking-vida2__right-wrapper">
            <div
              className="buy-now-pre-booking-vida2__top-banner"
              style={{
                backgroundImage: `url(${
                  optedBikeVariant?.bgImg ||
                  config?.genericConfig?.bannerBackgroundImg
                })`
              }}
            >
              <div className="buy-now-pre-booking-vida2__user-details-wrapper">
                <div
                  className="buy-now-pre-booking-vida2__user-details"
                  style={{
                    color:
                      optedBikeVariant?.textColor ||
                      config?.genericConfig?.textColor
                  }}
                >
                  <p
                    className="buy-now-pre-booking-vida2__user-name"
                    style={{ fontSize: fontSize }}
                  >
                    {`${
                      isUserLoggedIn
                        ? updateNameToDisplay(userProfileData?.fname)
                        : isUserName?.randomNameContent
                    }'s`}
                  </p>
                  <p
                    className="buy-now-pre-booking-vida2__bike-name"
                    style={{ fontSize: fontSizeSubHeader }}
                  >
                    {variant || config?.genericConfig?.subHeader}
                  </p>
                  <p className="buy-now-pre-booking-vida2__sub-text">
                    {optedBikeVariant?.color || config?.genericConfig?.subText}
                  </p>
                </div>
                <div className="buy-now-pre-booking-vida2__bike-image">
                  <img
                    src={
                      optedBikeVariant?.bikeImg ||
                      config?.genericConfig?.bannerBikeImg
                    }
                    alt={config?.genericConfig?.bannerBikeImgAlt || "bike img"}
                    title={config?.genericConfig?.bannerBikeImgTitle}
                    loading="lazy"
                  ></img>
                </div>
              </div>
            </div>
            {/* Removing Offers scroll image as per Business comments*/}
            {/* <div className="buy-now-pre-booking-vida2__offer-text-streaming">
              <div className="buy-now-pre-booking-vida2__offer-scroll-wrapper">
                <div className="buy-now-pre-booking-vida2__img-scroll">
                  <img
                    src={config?.genericConfig?.offerScrollingImg}
                    alt="scrolling text"
                  ></img>
                  <img
                    src={config?.genericConfig?.offerScrollingImg}
                    alt="scrolling text"
                  ></img>
                  <img
                    src={config?.genericConfig?.offerScrollingImg}
                    alt="scrolling text"
                  ></img>
                  <img
                    src={config?.genericConfig?.offerScrollingImg}
                    alt="scrolling text"
                  ></img>
                </div>
              </div>
            </div> */}
            <div className="buy-now-pre-booking-vida2__price-details">
              <div className="buy-now-pre-booking-vida2__price-list-wrapper">
                {topTabActive === PURCHASE_TYPE.BOOK && (
                  <div className="buy-now-pre-booking-vida2__price-lists">
                    <div className="buy-now-pre-booking-vida2__price-label">
                      <p className="buy-now-pre-booking-vida2__price-label-text">
                        {config?.genericConfig?.buyAnyLabel}
                      </p>
                    </div>
                    <div className="buy-now-pre-booking-vida2__price-wrapper">
                      <p className="buy-now-pre-booking-vida2__price">
                        ₹{config?.genericConfig?.buyAnyPrice}
                      </p>
                      <p className="buy-now-pre-booking-vida2__subtext">
                        {config?.genericConfig?.fullyRefundableText}
                      </p>
                    </div>
                  </div>
                )}
                {topTabActive === PURCHASE_TYPE.BUY && (
                  <>
                    {scooterData?.products?.items
                      .filter((item, index) => {
                        return (
                          item?.name?.toLowerCase() ==
                          variantActiveIndex?.toLowerCase()
                        );
                      })
                      .map((product, index) => (
                        <ScooterInfo
                          scooterInfoConfig={config.scooterInfo}
                          genericConfig={config.genericConfig}
                          isColorVariantLayout={false}
                          isPriceVariant={true}
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
                          startAnalyticsHandler={handleStartAnalytics}
                        ></ScooterInfo>
                      ))}
                  </>
                )}

                <div className="buy-now-pre-booking-vida2__compare-wrapper">
                  <p className="buy-now-pre-booking-vida2__compare-text">
                    {config?.genericConfig?.compareVariantsText}
                  </p>
                </div>
              </div>
              <div className="buy-now-pre-booking-vida2__specifications">
                {scooterData?.products?.items
                  .filter((item, index) => {
                    return (
                      item.name.toLowerCase() ==
                      variantActiveIndex.toLowerCase()
                    );
                  })
                  .map((product, index) => (
                    <ScooterInfo
                      scooterInfoConfig={config.scooterInfo}
                      isSpecificationLayout={true}
                      genericConfig={config.genericConfig}
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
                      startAnalyticsHandler={handleStartAnalytics}
                    ></ScooterInfo>
                  ))}
              </div>
              <div className="buy-now-pre-booking-vida2__download-share-wrapper">
                <RWebShare
                  data={{
                    url: config?.genericConfig?.productSpecificationPdfUrl
                  }}
                  onClick={(e) => console.log("shared successfully!")}
                >
                  <div className="buy-now-pre-booking-vida2__share">
                    <a>
                      <img
                        src={
                          appUtils.getConfig("resourcePath") +
                          "images/svg/share.svg"
                        }
                        alt=""
                      ></img>
                    </a>
                  </div>
                </RWebShare>
                <div
                  className="buy-now-pre-booking-vida2__download"
                  onClick={(event) => {
                    isHandleDownloadPDF(
                      config?.genericConfig?.productSpecificationPdfUrl
                    );
                  }}
                >
                  <img
                    src={
                      appUtils.getConfig("resourcePath") +
                      "images/svg/download.svg"
                    }
                    alt=""
                  ></img>
                </div>
              </div>
            </div>
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
  myScooterReducer,
  testDriveReducer
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
      customerCountry: userAccessReducer.customerCountry,
      branchId: preBookingReducer.branchId,
      partnerId: preBookingReducer.partnerId,
      dealerName: preBookingReducer.dealerName,
      dealerPinCode: preBookingReducer.pincode,
      dealerPhoneNumber: preBookingReducer.dealerPhoneNumber,
      dealerAddress: preBookingReducer.dealerAddress
    },
    nearByVidaExpCentreLength:
      testDriveReducer.nearByVidaCentreList[0]?.items?.length,
    selectedScooterData: {
      name: scooterInfoReducer.name,
      sku: scooterInfoReducer.sku,
      sf_id: scooterInfoReducer.sf_id,
      variants: scooterInfoReducer.variants,
      selectedVariant: scooterInfoReducer.selectedVariant
    },
    userProfileData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country,
      email: userProfileDataReducer.email,
      number: userProfileDataReducer.number,
      pincode: userProfileDataReducer.pincode
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
    customerState: PropTypes.string,
    branchId: PropTypes.string,
    partnerId: PropTypes.string,
    dealerName: PropTypes.string,
    dealerPinCode: PropTypes.string,
    dealerAddress: PropTypes.string,
    dealerPhoneNumber: PropTypes.string
  }),
  setPreBookingInfo: PropTypes.func,
  setUserAccessInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  selectedScooterData: PropTypes.object,
  nearByVidaExpCentreLength: PropTypes.number,
  setUserStatus: PropTypes.func,
  userProfileData: PropTypes.object,
  setScooterInfo: PropTypes.func,
  myScooter: PropTypes.object,
  dataPosition: PropTypes.string
};

PreBooking.defaultProps = {
  config: {}
};
export default connect(mapStateToProps, mapDispatchToProps)(PreBooking);
