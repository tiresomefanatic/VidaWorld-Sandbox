import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import InputField from "../../forms/InputField/InputField";
import PhoneNumber from "../../forms/PhoneNumber/PhoneNumber";
import OtpForm from "../../OtpForm/OtpForm";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import Dropdown from "../../forms/Dropdown/Dropdown";
import CONSTANT from "../../../../../site/scripts/constant";
import {
  getCityListForQuickTestDrive,
  getStateCityList,
  getCitiesByCountryId
} from "../../../../../services/location.service";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import loginUtils from "../../../../../site/scripts/utils/loginUtils";
import DealersTab from "../../DealersTab/DealersTab";
import { getVidaCentreList } from "../../../../../services/location.service";
import { getUserCityDetails } from "../../../../services/locationFinder/locationFinderService";
import { getUtmParams } from "../../../../services/utmParams/utmParams";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import {
  useTestDriveSendOtp,
  useTestDriveVerifyOtp
} from "../../../../hooks/userAccess/userAccessHooks";
import Logger from "../../../../../services/location.service";
import { RSAUtils } from "../../../../../site/scripts/utils/encryptDecryptUtils";
import { setTestDriveDataDispatcher } from "../../../../store/testDrive/testDriveActions";
import { setUserFormDataActionDispatcher } from "../../../../store/userAccess/userAccessActions";
import { showNotificationDispatcher } from "../../../../store/notification/notificationActions";
import {
  useBookingDates,
  useBookingTimeSlot,
  useModelVariantList
} from "../../../../hooks/testDrive/testDriveHooks";
import DateField from "../../forms/DateField/DateField";
import breakpoints from "../../../../../site/scripts/media-breakpoints";
import RedirectionCards from "../../ReDirectionCards/ReDirectionCards";
import { postContactData } from "../../../../services/contact/contactService";
import { useUserData } from "../../../../hooks/userProfile/userProfileHooks";

const QuickDriveForm = (props) => {
  const {
    agreeTerms,
    bookingTitle,
    bookingSubTitle,
    cityField,
    stateField,
    firstNameField,
    lastNameField,
    phoneNumberField,
    emailField,
    modalVariantField,
    notificationField,
    nextBtn,
    otpConfig,
    genericConfig,
    mapIcon,
    phoneIcon,
    notifyConfig,
    locationErrorMsg
  } = props.config;
  const {
    cmpProps,
    userDetails,
    userData,
    nearByVidaCentreList,
    submitTestDriveFormData,
    bookTestRide,
    isSuccess,
    isReschedule,
    dealersEdit,
    bookingDateList,
    bookingTimeSlotList,
    modelVariantList,
    dataPosition,
    testDriveData,
    rescheduledData
  } = props;
  const { notifySuccessConfig } = notifyConfig;
  const { noDealerAvailableError } = genericConfig;
  const { sfid } = cmpProps;
  const [isShowName, setShowName] = useState(true);
  const [isShowEmail, setShowEmail] = useState(false);
  const [isShowStateCity, setShowStateCity] = useState(false);
  const [isShowModalSelection, setShowModalSelection] = useState(false);
  const [isShowDealersLocation, setShowDealersLocation] = useState(false);
  const [isShowDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isShowNumberField, setShowNumberField] = useState(false);
  const [isShowOtpForm, setShowOtpForm] = useState(true);
  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const [constCityList, setConstCityList] = useState(defaultCityList);
  const defaultStateList = appUtils.getConfig("stateList");
  const [stateList, setStateList] = useState(defaultStateList);
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [defaultStateValue, setDefaultStateValue] = useState("");
  const [cityIsDisabled, setCityIsDisabled] = useState(true);
  const [listOfDealers, setListOfDealers] = useState();
  const [noDealersAvailable, setNoDealersAvailable] = useState(false);
  const codeList = appUtils.getConfig("countryCodes");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const isLoggedIn = loginUtils.isSessionActive();
  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [showOtpError, setShowOtpError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [TRNotApplicable, setTRNotApplicable] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [isLeadSuccess, setLeadSuccess] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchValueBack, setSearchValueBack] = useState({});
  const [showOption, setShowOption] = useState(false);
  const [sortedOptions, setSortedOptions] = useState();
  const [availableCityList, setAvailableCityList] = useState();
  const [dealersNotAvailable, setDealersNotAvailable] = useState(false);
  const [tryPincode, setTryPincode] = useState(false);
  const [cityFieldErrorMsg, setCityFieldErrorMsg] = useState();
  const [leadApiErrorMsg, setLeadApiErrorMsg] = useState();
  const getBookingDates = useBookingDates();
  const getBookingTimeSlot = useBookingTimeSlot();
  const getModelVariantList = useModelVariantList();
  const [changeOtpText, setChangeOtpText] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [dealersLoading, setDealersLoading] = useState("Loading...");
  const modelDefaultOption = appUtils.getConfig("modelDefaultOption");
  const [startAnalytics, setStartAnalytics] = useState(false);
  const [timeSlot, setTimeSlot] = useState("No time slot available");

  const [modalVariant, setModalVariant] = useState(modelVariantList);
  const [selectedModalVariant, setSelectedModalVariant] = useState(
    modelVariantList[0]?.value
  );

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const cityInputField = document?.getElementsByClassName(
    "test-ride-city-search-input"
  )[0];

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("cityList"),
    ...cityField
  };

  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateList"),
    ...stateField
  };

  const getUserData = useUserData();

  const [selectedCity, setSelectedCity] = useState("");
  const [testrideLocation, setTestrideLocation] = useState({});
  const [dynamicError, setDynamicError] = useState("");
  const [selectedDealer, setSelectedDealer] = useState({});
  const [isCityBtnDisabled, setIsCityBtnDisabled] = useState(true);
  const isCentre = true; //Enabled only for centres not at home
  const handleInputChange = (fieldname, value) => {
    if (value === "") {
      setError(fieldname, {
        type: "required"
      });
    } else if (
      value.length < firstNameField.validationRules.minLength.value &&
      fieldname === "fname"
    ) {
      setError("fname", {
        type: "custom",
        message: firstNameField.validationRules.minLength.message
      });
    } else if (fieldname === "fname" && !CONSTANT.NAME_REGEX.test(value)) {
      setError("fname", {
        type: "custom",
        message: firstNameField?.validationRules?.fullName?.message
      });
    } else if (fieldname === "email") {
      if (!CONSTANT.EMAIL_REGEX.test(value)) {
        setError("email", {
          type: "custom",
          message: emailField.validationRules.customValidation.message
        });
      } else {
        clearErrors("email");
      }
    } else {
      clearErrors(fieldname);
    }
  };

  const handleStartTrackAnalytics = () => {
    if (!startAnalytics) {
      setStartAnalytics(true);
      analyticsUtils.trackTestDriveBookingStart();
    }
  };

  const ctaTracking = (e, eventName, pageName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText || e?.innerText,
        ctaLocation:
          pageName || e?.target?.dataset?.linkPosition || e?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName, "", pageName);
    }
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

  const handleChangeOtpText = () => {
    setChangeOtpText(true);
  };

  const formatDate = (date) => {
    date = date.split("/"); // 21/05/2022
    return date[2] + "-" + date[1] + "-" + date[0];
  };

  const getBookingTime = async (date) => {
    setSpinnerActionDispatcher(true);
    const timeSlotResponse = await getBookingTimeSlot({
      variables: {
        transactionType: isCentre
          ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO
          : CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO_AT_SITE,
        branchId: selectedDealer.id,
        itemId: selectedModalVariant,
        bookingDate: date
      }
    });
    if (
      timeSlotResponse &&
      timeSlotResponse.data.getBranchTimeSlots.items.length > 0
    ) {
      setValue("time", timeSlotResponse.data.getBranchTimeSlots.items[0].id);
      setTimeSlot(timeSlotResponse.data.getBranchTimeSlots.items[0].timeslot);
      setSelectedTime({
        id: timeSlotResponse.data.getBranchTimeSlots.items[0].id,
        timeslot: timeSlotResponse.data.getBranchTimeSlots.items[0].timeslot
      });
    } else {
      setTimeSlot("No time slot available");
    }
  };

  const getBookingDatesList = async () => {
    const datePayload = {
      transactionType: isCentre
        ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO
        : CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO_AT_SITE,
      branchId: selectedDealer.id,
      itemId: selectedModalVariant,
      daysCount: "7"
    };
    setSpinnerActionDispatcher(true);
    const response = await getBookingDates({
      variables: datePayload
    });

    if (response && response.data.getBranchDateSlots.items.length > 0) {
      const date = response.data.getBranchDateSlots.items[0].bookingDate;
      const dateItems = date.split("-");
      setSelectedDate(dateItems[2] + "/" + dateItems[1] + "/" + dateItems[0]);
      setValue("date", date);
      setTimeout(() => {
        getBookingTime(date);
      }, 500);
    }
  };

  const dateChangeHandler = (date) => {
    setSelectedDate(date);
    setTimeout(() => {
      getBookingTime(formatDate(date));
    }, 500);
  };

  const handleTimeDropdownChange = (event, value) => {
    const timeObj = bookingTimeSlotList.find((data) => {
      return data.value === value;
    });
    setSelectedTime({ ...selectedTime, timeslot: timeObj?.label });
  };

  const handleBookTestRide = async (
    selectedVariant,
    selectedDate,
    selectedTime
  ) => {
    if (!isLoggedIn) {
      await getUserData();
    }
    const testRideResult = await bookTestRide(
      selectedVariant,
      formatDate(selectedDate),
      selectedTime
    );
    if (
      testRideResult &&
      testRideResult?.data &&
      testRideResult?.data?.bookTestDrive &&
      testRideResult?.data?.bookTestDrive?.success
    ) {
      isSuccess(true);
      setShowNumberField(false);
    } else {
      showNotificationDispatcher({
        title: testRideResult.errors.message,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
      if (selectedDate) {
        setShowDateTimePicker(true);
        setShowNumberField(false);
      } else {
        setShowNumberField(true);
      }
    }
  };

  const isPageView = (pageName) => {
    window.digitalData?.forEach((element) => {
      if (element.event === "pageView") {
        if (element.page.pageInfo.pageName == pageName) {
          return false;
        }
      } else {
        return true;
      }
    });
  };

  const trackFormDataChange = (pageName) => {
    if (isAnalyticsEnabled && isPageView()) {
      analyticsUtils.trackTestRideFormData(pageName);
    }
  };

  const trackLoginSignupSuccessFail = (eventName) => {
    if (isAnalyticsEnabled) {
      analyticsUtils.trackCTAClicksVida2("", eventName);
    }
  };

  const handleFormNameSubmit = async (formData) => {
    submitTestDriveFormData(formData, testrideLocation);
    setShowName(false);
    setShowEmail(true);
    window.scrollTo(0, 0);
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Enter Name"
    };
    ctaTracking(eventData, "confirmCTAClick", "Test Drive: Enter Name");
  };

  const handleFormEmailSubmit = (formData) => {
    submitTestDriveFormData(formData, testrideLocation);
    setShowEmail(false);
    setShowStateCity(true);
    const inputValueObj = { city: searchValue };
    setSearchValueBack(inputValueObj);
    window.scrollTo(0, 0);
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Enter Email"
    };
    ctaTracking(eventData, "confirmCTAClick", "Test Drive: Enter Email");
  };

  const handleFormStateCitySubmit = (formData) => {
    setSelectedModalVariant(modelVariantList[0]?.value);
    const matchCity = cityList.filter((x) => x.city === cityInputField.value);
    if (
      cityInputField.value.length > 0 &&
      matchCity.length > 0 &&
      !dealersNotAvailable
    ) {
      submitTestDriveFormData(formData, testrideLocation);
      setShowStateCity(false);
      isLoggedIn ? setShowDealersLocation(true) : setShowNumberField(true);
      setCityFieldErrorMsg("");
      window.scrollTo(0, 0);
      handleStartTrackAnalytics();
      const eventData = {
        innerText: "Confirm",
        linkPosition: "Test Drive: Select Location"
      };
      setSearchValue(cityInputField.value);
      setSearchValueBack({ city: cityInputField.value });
      ctaTracking(eventData, "confirmCTAClick", "Test Drive: Select Location");
    } else {
      setCityFieldErrorMsg(cityField?.validationRules?.required?.message);
    }
  };

  const modalVariantChangeHandler = (value) => {
    // setSelectedModalVariant(getValues(value));
  };

  const handleFormModalVariantSubmit = (formData) => {
    // setSelectedModalVariant(formData.modalVariant);
    submitTestDriveFormData(formData, testrideLocation, selectedModalVariant);
    setShowModalSelection(false);
    setShowDealersLocation(true);
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Select Variant"
    };
    ctaTracking(eventData, "confirmCTAClick", "Test Drive: Select Variant");
  };

  const handleFormDealersSubmit = (formData) => {
    submitTestDriveFormData(
      formData,
      testrideLocation,
      selectedModalVariant,
      selectedDealer
    );
    setShowDealersLocation(false);
    getBookingDatesList();
    setShowDateTimePicker(true);
    window.scrollTo(0, 0);
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Select Dealer"
    };
    ctaTracking(eventData, "confirmCTAClick", "Test Drive: Select Dealer");
  };

  const handleFormDateTimeSubmit = async (formData) => {
    if (!isDesktop) {
      const drawer = document.querySelector(".drawer__body");
      drawer.style.height = "100%";
      drawer.style.maxHeight = "300px";
    }

    submitTestDriveFormData(
      formData,
      testrideLocation,
      selectedModalVariant,
      "",
      selectedDate,
      selectedTime
    );
    // if (isLoggedIn) {
    handleBookTestRide(selectedModalVariant, selectedDate, selectedTime);
    // } else {
    setShowDateTimePicker(false);
    //   setShowNumberField(true);
    // }
    window.scrollTo(0, 0);
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Select Date and Time"
    };
    ctaTracking(
      eventData,
      "confirmCTAClick",
      "Test Drive: Select Date and Time"
    );
  };

  //sending data for generating OTP
  const generateSendOtp = useTestDriveSendOtp();
  const handleGenerateOTP = async (data) => {
    try {
      !isLoggedIn && setSpinnerActionDispatcher(true);
      setShowOtpError("");
      const result = {};
      let output = {};
      output = await generateSendOtp({
        variables: {
          country_code: data.countryCode || defaultCountryCode,
          mobile_number: RSAUtils.encrypt(data.mobileNumber),
          email: RSAUtils.encrypt(data.email),
          is_login: isLoggedIn,
          source: "testdrive"
        }
      });
      if (output?.data?.SendOtp?.status_code === 200) {
        setShowOtpForm(false);
        window.scrollTo(0, 0);
      }
      if (output?.errors && output.errors?.message) {
        setError("mobileNumber", {
          type: "custom",
          message: output.errors.message
        });
        if (output.errors?.message.toLowerCase().includes("already used")) {
          const formDetails = {
            formType: "TestRide",
            formErrorField: "Phone Number"
          };
          analyticsUtils.trackBuyJourneyDropOut(
            formDetails,
            output?.errors?.message
          );
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");

  const validateInput = (name, value) => {
    const hasCustomValidation =
      phoneNumberField.validationRules?.custom &&
      phoneNumberField.validationRules?.custom?.message;
    const hasMinLengthValidation =
      phoneNumberField.validationRules?.minLength &&
      phoneNumberField.validationRules?.minLength?.message;
    const hasMaxLengthValidation =
      phoneNumberField.validationRules?.maxLength &&
      phoneNumberField.validationRules?.maxLength?.message;

    setValue("mobileNumber", value);

    if (value.length === 0) {
      setError("mobileNumber", {
        type: "custom",
        message: phoneNumberField.validationRules?.required?.message
      });
      return false;
    }
    if (CONSTANT.NUMBER_REGEX.test(value)) {
      if (
        hasCustomValidation &&
        !phNumberStartsWith.includes(value.charAt(0))
      ) {
        setError("mobileNumber", {
          type: "custom",
          message: phoneNumberField.validationRules?.custom?.message
        });
        return false;
      }
      if (hasMinLengthValidation && value.length < 10) {
        setError("mobileNumber", {
          type: "custom",
          message: phoneNumberField.validationRules?.minLength?.message
        });
        return false;
      }
      if (hasMaxLengthValidation && value.length > 10) {
        setError("mobileNumber", {
          type: "custom",
          message: phoneNumberField.validationRules?.maxLength?.message
        });
        return false;
      }
    } else if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("mobileNumber", {
        type: "custom",
        message: phoneNumberField.validationRules?.custom?.message
      });
      return false;
    }
    clearErrors("number");
    return true;
  };

  const handleFormNumberSubmit = async (formData) => {
    if (!isNotify) {
      if (!validateInput("number", formData.mobileNumber.trim())) {
        return;
      }
      submitTestDriveFormData(formData, testrideLocation, selectedModalVariant);
      setSelectedData(formData);
      const datas = {
        email: cmpProps.email,
        mobileNumber: formData.mobileNumber,
        countryCode: cmpProps.countryCode
      };
      handleGenerateOTP(datas);
    } else {
      setSpinnerActionDispatcher(true);
      const url = appUtils.getAPIUrl("leadCreationUrl");
      const result = await postContactData(url, {
        FirstName: cmpProps.fname,
        LastName: cmpProps.lname ? cmpProps.lname : "-",
        MobilePhone: RSAUtils.encrypt(formData.mobileNumber),
        dmpl__City__c: testrideLocation.city,
        LeadSource: "Website",
        SubSource__c: "interested lead from non serviceable"
      });
      if (result && result.id) {
        setLeadSuccess(true);
        setShowNumberField(false);
        setLeadApiErrorMsg("");
        setSpinnerActionDispatcher(false);
      } else {
        setSpinnerActionDispatcher(false);
        setLeadApiErrorMsg(
          notifyConfig?.mobileFieldConfig?.validationRules?.errorMsg
        );
      }
    }
    const eventData = {
      innerText: "Confirm",
      linkPosition: "Test Drive: Enter Number"
    };
    ctaTracking(eventData, "verifyOtpCta", "Test Drive: Enter Number");
  };

  // Step 3 - Verify Otp
  const verifyOTP = useTestDriveVerifyOtp();
  const handleVerifyOTP = async (event, otp) => {
    // const { countryCode, email, fname, lname, phoneNumber, subscribe, city } =
    //   formDataValues;
    try {
      setSpinnerActionDispatcher(true);
      const params = getUtmParams();
      const selectedCitys = cityList.filter((x) => x.city === selectedCity);
      const variables = {
        SF_ID: sfid,
        is_login: isLoggedIn,
        fname: cmpProps.fname,
        lname: cmpProps.lname || "",
        email: RSAUtils.encrypt(cmpProps.email),
        country_code: cmpProps.countryCode
          ? cmpProps.countryCode
          : defaultCountryCode,
        mobile_number: RSAUtils.encrypt(cmpProps.mobileNumber),
        otp: RSAUtils.encrypt(otp),
        // whatsapp_consent: true,
        source: "testdrive",
        customer_exist: cmpProps.customerExists,
        utm_params: params,
        customer_city: selectedCitys[0].city,
        customer_state: selectedCitys[0].state
      };

      const verifyOtpResult = await verifyOTP({
        variables
      });

      if (verifyOtpResult && verifyOtpResult.data) {
        if (verifyOtpResult.data.VerifyOtp.status_code === 200) {
          trackLoginSignupSuccessFail("otpSuccess");
          setTestDriveDataDispatcher({
            location: {
              country: "",
              state: "",
              city: selectedCitys
            },
            subscribe: false
          });
          getUserData();
          !isLoggedIn &&
            setUserFormDataActionDispatcher({
              countryCode: cmpProps.countryCode || defaultCountryCode,
              numberOrEmail: cmpProps.mobileNumber || cmpProps.email || "",
              mobileNumber: cmpProps.mobileNumber || "",
              fname: cmpProps.fname || "",
              lname: cmpProps.lname || "",
              email: cmpProps.email || ""
            });
          submitTestDriveFormData(
            selectedData,
            testrideLocation,
            selectedModalVariant
          );
          // setShowModalSelection(true);
          setShowDealersLocation(true);
          setShowNumberField(false);
          await getUserData();
          window.scrollTo(0, 0);
        }
      } else {
        trackLoginSignupSuccessFail("otpFailure");
        setShowOtpError(verifyOtpResult.errors.message);
        // setOtpFields([...otpFields.map(() => "")]);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleChangeNumber = (event) => {
    ctaTracking(event, "ctaButtonClick", "Test Drive: Enter OTP");
    setShowOtpForm(true);
    setValue("mobileNumber", "");
  };

  const resendOtpHandler = () => {
    setShowOtpError("");
  };

  const fetchCentreList = async (userCity) => {
    setSpinnerActionDispatcher(true);
    const responseDealers = await getVidaCentreList(userCity.city);
    if (responseDealers && responseDealers.length < 1) {
      setDealersNotAvailable(true);
      setCityFieldErrorMsg(noDealerAvailableError);
      setIsCityBtnDisabled(true);
      setSpinnerActionDispatcher(false);
    } else {
      setDealersNotAvailable(false);
      setCityFieldErrorMsg("");
      setIsCityBtnDisabled(false);
      setSpinnerActionDispatcher(false);
    }
    setSelectedCity(userCity.city);
    setSelectedDealer({});
  };

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForQuickTestDrive(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
      setConstCityList([...defaultCityList, ...cityListRes]);
      setAvailableCityList(cityListRes);
    }
  };

  const setDealersDetail = (data) => {
    setSelectedDealer(data);
  };

  useEffect(() => {
    const dealersList = [];
    setListOfDealers([]);
    setSpinnerActionDispatcher(true);
    if (nearByVidaCentreList.length > 0) {
      nearByVidaCentreList.map((item) => {
        if (item.type === "Experience Center") {
          item.items.map((x) => {
            if (x.testRideAvailable) {
              dealersList.push(x);
            }
          });
        }
      });
    }
    if (selectedCity && !nearByVidaCentreList.length) {
      setNoDealersAvailable(true);
    } else {
      setNoDealersAvailable(false);
    }
    setListOfDealers(dealersList);
    setSpinnerActionDispatcher(false);
    setTimeout(() => {
      setDealersLoading("");
    }, 2000);
  }, [nearByVidaCentreList]);

  const handleSortOptions = () => {
    const filterBySearch = availableCityList
      ?.filter((item) => {
        if (item?.city.toUpperCase().includes(searchValue.toUpperCase())) {
          return item;
        }
      })
      .sort((a, b) => (a?.city > b?.city ? 1 : -1));
    setSortedOptions(filterBySearch);
  };

  const updateStateList = async () => {
    const list = await getCitiesByCountryId("INDIA");
    setAvailableCityList(list);
    handleSortOptions();
  };

  useEffect(() => {
    fetchCityList();
    // updateStateList();

    async function fetchModalVariantList() {
      const modalVariant = await getModelVariantList({
        variables: {
          type_id: "configurable"
        }
      });
    }
    if (!isReschedule) {
      fetchModalVariantList();
    }
  }, []);

  useEffect(() => {
    if (userDetails.city && cityList.length > 1) {
      const userCity = cityList.find((city) => city.city === userDetails.city);

      setCityIsDisabled(false);
      if (userCity) {
        const userCities = cityList.filter(
          (city) => city.state === userCity.state
        );
        // setCityList([...defaultCityList, ...userCities]);
        setDefaultCityValue(userCity.value);
        setDefaultStateValue(userCity.state);
        setTestrideLocation({
          city: userCity.city,
          state: userCity.state,
          country: defaultCountry
        });
      } else {
        if (!defaultStateValue) {
          setCityIsDisabled(true);
        }
      }
    } else if (cityList.length === 2) {
      setCityIsDisabled(false);
      setDefaultCityValue(cityList[1].value);
      setDefaultStateValue(cityList[1].state);
      setTestrideLocation({
        city: cityList[1].city,
        state: cityList[1].state,
        country: defaultCountry
      });
    }
  }, [userDetails.city]);

  useEffect(() => {
    userDetails.firstname && setValue("fname", userDetails.firstname);
    userDetails.lastname && setValue("lname", userDetails.lastname);
    userDetails.email && setValue("email", userDetails.email);
    userDetails.countrycode && setValue("code", userDetails.countrycode);
    userDetails.mobilenumber &&
      setValue("phoneNumber", userDetails.mobilenumber);
  }, [userDetails]);

  const notifyClickHandler = (e) => {
    e.preventDefault();
    setIsNotify(true);
    setShowNumberField(true);
    setTRNotApplicable(false);
  };

  const handleOnFocus = () => {
    // setShowOption(true); //removing it as per request
    handleSortOptions();
    handleStartTrackAnalytics();
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };

  const handleOnKeyUp = (e) => {
    handleSortOptions();
    if (e.target.value.length > 1) {
      setShowOption(true);
    } else {
      setShowOption(false);
      setCityFieldErrorMsg("");
    }
  };

  useEffect(() => {
    if (searchValue?.length > 1 && sortedOptions?.length < 1) {
      setCityFieldErrorMsg(noDealerAvailableError);
    } else {
      setCityFieldErrorMsg("");
    }
  }, [sortedOptions]);

  const handleOptionSelect = (value) => {
    setSearchValue(value.city);
    cityInputField.value = value.city;
    const matchCity = cityList.filter((x) => x.city === value.city);
    if (matchCity.length > 0) {
      setCityFieldErrorMsg("");
      setTestrideLocation({
        state: value.state,
        city: value.city
      });
      fetchCentreList(value);
      setDealersNotAvailable(false);
      setCityFieldErrorMsg("");
      setIsCityBtnDisabled(false);
    } else {
      setCityFieldErrorMsg(noDealerAvailableError);
      setDealersNotAvailable(true);
      setIsCityBtnDisabled(true);
    }
  };

  const handleOnCancel = () => {
    cityInputField.value = "";
    setDealersNotAvailable(false);
  };

  const handleRedirection = () => {
    window.location.href = notifySuccessConfig.successBtnRedirection;
  };

  const noDealerOptionHandler = () => {
    setShowStateCity(false);
    setTRNotApplicable(true);
  };

  // for getting user location
  const getUserCityFromLocality = async (position) => {
    setSpinnerActionDispatcher(true);
    const getCityDetails = await getUserCityDetails(position);
    if (getCityDetails) {
      const getUserCityFromDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("locality")
        ).long_name;
      const getUserStateDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("administrative_area_level_1")
        ).long_name;
      const getUserCityByLocation = getUserCityFromDetails.toUpperCase();
      const getUserState = getUserStateDetails.toUpperCase();
      handleOptionSelect({ city: getUserCityByLocation });
      setTestrideLocation({
        city: getUserCityByLocation,
        state: getUserState,
        country: defaultCountry
      });
      setLocationEnabled(true);
      setSpinnerActionDispatcher(false);
    } else {
      setLocationEnabled(false);
      setSpinnerActionDispatcher(false);
    }
  };

  const showError = () => {
    alert(locationErrorMsg);
  };

  const showPosition = async (position) => {
    setSpinnerActionDispatcher(true);
    await getUserCityFromLocality(position);
    setSpinnerActionDispatcher(false);
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };

  const handleBackEmail = () => {
    setShowEmail(false);
    setShowName(true);
  };
  const handleBackDealer = () => {
    setShowStateCity(false);
    setShowEmail(true);
  };
  // const handleBackModel = () => {
  //   setShowModalSelection(false);
  //   setShowStateCity(true);
  //   const inputValueObj = { city: searchValue };
  //   setSearchValueBack(inputValueObj);
  // };
  const handleBackLocator = () => {
    setShowDealersLocation(false);
    setShowNumberField(false);
    setShowStateCity(true);
    const inputValueObj = { city: searchValue };
    setSearchValueBack(inputValueObj);
    // setShowModalSelection(true);
  };
  const handleBackTime = () => {
    setShowDateTimePicker(false);
    setShowDealersLocation(true);
  };
  const handleBackNumber = () => {
    setShowNumberField(false);
    setShowStateCity(true);
    const inputValueObj = { city: searchValue };
    setSearchValueBack(inputValueObj);
    // setShowDateTimePicker(true);
  };

  useEffect(() => {
    if (userData.city && !isReschedule && !searchValueBack.city?.length > 0) {
      fetchCentreList(userData);
    }
    setTimeout(() => {
      if (isLoggedIn && userData && cityInputField) {
        cityInputField.value = userData.city;
      } else if (searchValueBack.city?.length > 0) {
        fetchCentreList(searchValueBack);
        document.getElementsByClassName(
          "test-ride-city-search-input"
        )[0].value = searchValue;
      }
    }, 500);
  }, [userData.city, searchValueBack]);

  useEffect(() => {
    setModalVariant(modelVariantList);
    setValue("modelVariant", modelVariantList[0]?.value);
  }, [modelVariantList]);

  useEffect(() => {
    setShowStateCity(false);
    if (dealersEdit.location || dealersEdit.isShowMap) {
      setShowStateCity(false);
      setShowName(false);
      setShowEmail(false);
      setShowDateTimePicker(false);
      setShowNumberField(false);
      setShowDealersLocation(true);
    }
    if (dealersEdit.date || dealersEdit.time) {
      setShowStateCity(false);
      setShowName(false);
      setShowEmail(false);
      setShowDateTimePicker(true);
      setShowDealersLocation(false);
      setShowNumberField(false);
    }
  }, [dealersEdit]);

  useEffect(() => {
    if (isLoggedIn) {
      if (isReschedule) {
        setShowDealersLocation(true);
        setShowStateCity(false);
        setSelectedModalVariant(rescheduledData.modalVariant);
      } else {
        // updateStateList();
        setShowStateCity(true);
      }
    }
  }, [isReschedule]);

  useEffect(() => {
    if (tryPincode) {
      setTRNotApplicable(false);
      setShowStateCity(true);
    }
  }, [tryPincode]);

  useEffect(() => {
    if (!isLoggedIn && isShowName) {
      trackFormDataChange("Test Ride");
    }
  }, [isLoggedIn, isShowName]);

  return (
    <div className="vida-quick-form">
      <div className="form-fields">
        {!isLoggedIn && isShowName && (
          <form
            className="form-fields__name"
            onSubmit={handleSubmit((formData, event) =>
              handleFormNameSubmit(formData, event)
            )}
          >
            <h1 className="form-fields__name-header">
              {genericConfig?.testRideNameHeader}
            </h1>
            <InputField
              className="form-fields__name-input"
              name="fname"
              label={firstNameField?.label}
              placeholder={firstNameField?.placeholder}
              value=""
              validationRules={firstNameField?.validationRules}
              register={register}
              errors={errors}
              checkNameFormat
              onChangeHandler={handleInputChange}
              inputFocusHandler={handleStartTrackAnalytics}
            />
            <div className="form-fields__btn-wrapper">
              <button
                type="submit"
                className="form-fields__btn-primary"
                data-link-position={dataPosition || "testRide"}
              >
                {genericConfig?.testRideNameConfirmBtnLabel}
              </button>
            </div>
          </form>
        )}
        {!isLoggedIn && isShowEmail && (
          <form
            className="form-fields__name form-fields__email"
            onSubmit={handleSubmit((formData, event) =>
              handleFormEmailSubmit(formData, event)
            )}
          >
            <button
              type="button"
              className="form-fields__btn-secondary"
              data-link-position={dataPosition || "testRide"}
              onClick={(e) => {
                ctaTrackingBack(
                  e,
                  "backButtonClick",
                  "Enter Email",
                  "Test Drive: Enter Email"
                );
                handleBackEmail(e);
              }}
            >
              {genericConfig?.testRideBackBtnLabel}
            </button>
            <p className="form-fields__name-header">
              {genericConfig?.testRideNameHeader}
            </p>
            <p className="form-fields__sub-header">
              {emailField?.label + " "}
              {cmpProps.fname + " ?"}
            </p>
            <InputField
              name="email"
              infoLabel={emailField.infoLabel}
              placeholder={emailField.placeholder}
              validationRules={emailField.validationRules}
              register={register}
              errors={errors}
              checkEmailFormat
              onChangeHandler={handleInputChange}
              value=""
              setValue={setValue}
            />
            <div className="form-fields__btn-wrapper">
              <button
                type="submit"
                className="form-fields__btn-primary"
                data-link-position={dataPosition || "testRide"}
                // onClick={(e) => {
                //   ctaTracking(e, "confirmCTAClick", "Test Drive: Enter Email");
                // }}
              >
                {genericConfig?.testRideNameConfirmBtnLabel}
              </button>
            </div>
          </form>
        )}
        {isShowStateCity && (
          <form
            className="form-fields__name form-fields__state-city"
            onSubmit={handleSubmit((formData, event) =>
              handleFormStateCitySubmit(formData, event)
            )}
          >
            {!isLoggedIn && (
              <button
                type="button"
                className="form-fields__btn-secondary"
                data-link-position={dataPosition || "testRide"}
                onClick={(e) => {
                  handleBackDealer(e);
                  ctaTrackingBack(
                    e,
                    "backButtonClick",
                    "Select City",
                    "Test Drive: Select Location"
                  );
                }}
              >
                {genericConfig?.testRideBackBtnLabel}
              </button>
            )}
            <p className="form-fields__name-header">
              {genericConfig?.testRideNameHeader}
            </p>
            <p className="form-fields__sub-header">
              {genericConfig?.testRidestateHeader + " "}
              {cmpProps.fname || userDetails.firstname} {" ?"}
            </p>
            <div className="test-ride-location-container">
              <div
                className="test-ride-location-find-icon"
                onClick={handleGetUserLocation}
              >
                {locationEnabled ? (
                  <img src={cityField?.icon} alt="location_find_icon1"></img>
                ) : (
                  <img
                    src={cityField?.secondIcon}
                    alt="location_find_icon2"
                  ></img>
                )}
              </div>
              <div
                className={
                  showOption
                    ? "test-ride-location-cancel-icon d-block"
                    : "test-ride-location-cancel-icon d-none"
                }
                onClick={handleOnCancel}
              >
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/test_ride_cancel_icon.png`}
                  alt="location_cancel_icon"
                ></img>
              </div>
              <input
                className="test-ride-city-search-input"
                placeholder={cityField?.label}
                type="text"
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onKeyUp={(e) => handleOnKeyUp(e)}
                onChange={(e) => setSearchValue(e.target.value)}
              ></input>
              <div
                className={
                  showOption
                    ? "city-option-container d-block"
                    : "city-option-container d-none"
                }
              >
                {sortedOptions?.map((item, index) => (
                  <div
                    className="city-option"
                    key={index}
                    onClick={() => handleOptionSelect(item)}
                  >
                    <p>{item.city}</p>
                  </div>
                ))}
              </div>
              {/* need to be checked with business */}
              <p className="test-ride-city-error-msg">{cityFieldErrorMsg}</p>
              {notifyConfig.showNotifyUs && dealersNotAvailable && (
                <div className="temp-no-dealers-found">
                  <p>{notifyConfig.notifyUsDescription}</p>
                  <button
                    className="click-here"
                    onClick={noDealerOptionHandler}
                  >
                    {notifyConfig.notifyUsBtnLabel}
                  </button>
                </div>
              )}
            </div>
            <div className="form-fields__btn-wrapper">
              <button
                type="submit"
                className="form-fields__btn-primary"
                disabled={isCityBtnDisabled}
                data-link-position={dataPosition || "testRide"}
                // disabled={cityFieldErrorMsg !== ""}
                // onClick={(e) => {
                //   ctaTracking(
                //     e,
                //     "confirmCTAClick",
                //     "Test Drive: Select Location"
                //   );
                // }}
              >
                {genericConfig?.testRideNameConfirmBtnLabel}
              </button>
            </div>
          </form>
        )}
        {isShowModalSelection && (
          <form
            className="form-fields__name form-fields__modal-variant"
            onSubmit={handleSubmit((formData, event) =>
              handleFormModalVariantSubmit(formData, event)
            )}
          >
            <button
              type="button"
              className="form-fields__btn-secondary"
              data-link-position={dataPosition || "testRide"}
              onClick={(e) => {
                handleBackModel(e);
                ctaTrackingBack(
                  e,
                  "backButtonClick",
                  "Select Model",
                  "Test Drive: Select Model"
                );
              }}
            >
              {genericConfig?.testRideBackBtnLabel}
            </button>
            <p className="form-fields__name-header">
              {genericConfig?.testRideNameHeader}
            </p>
            <p className="form-fields__sub-header">
              {modalVariantField.subHeader}
            </p>
            <Dropdown
              name="modalVariant"
              onChangeHandler={modalVariantChangeHandler}
              options={
                modelVariantList.length > 0
                  ? [...modelVariantList]
                  : modelDefaultOption
              }
              value={
                selectedModalVariant
                  ? selectedModalVariant
                  : modelVariantList[0]?.value
              }
              setValue={setValue}
              errors={errors}
              validationRules={modalVariantField.validationRules}
              clearErrors={clearErrors}
              register={register}
              isDisabled={false}
              isSortAsc={true}
            />
            <div className="form-fields__btn-wrapper">
              <button
                type="submit"
                className="form-fields__btn-primary"
                data-link-position={dataPosition || "testRide"}
              >
                {genericConfig?.testRideNameConfirmBtnLabel}
              </button>
            </div>
          </form>
        )}
        {/* {isShowDealersLocation && ( */}
        <form
          className={`form-fields__name ${
            !isShowDealersLocation ? "d-none" : ""
          }`}
          onSubmit={handleSubmit((formData, event) =>
            handleFormDealersSubmit(formData, event)
          )}
        >
          {!isReschedule && (
            <button
              type="button"
              className="form-fields__btn-secondary"
              data-link-position={dataPosition || "testRide"}
              onClick={(e) => {
                handleBackLocator(e);
                ctaTrackingBack(
                  e,
                  "backButtonClick",
                  "Select Dealer",
                  "Test Drive: Select Dealer"
                );
              }}
            >
              {genericConfig?.testRideBackBtnLabel}
            </button>
          )}
          <p className="form-fields__name-header">
            {genericConfig?.testRideDealersHeader}
          </p>
          <p className="form-fields__sub-header">
            {genericConfig?.testRideDealersSubHeader}
          </p>
          <div>
            <DealersTab
              tabList={genericConfig.tabList}
              config={genericConfig}
              listOfDealers={listOfDealers}
              getDealersDetail={setDealersDetail}
              isReschedule={isReschedule}
              dealersLoading={dealersLoading}
              selectedDealerDetails={selectedDealer}
              selectedDealersId={
                rescheduledData
                  ? rescheduledData.branchId
                  : testDriveData.branchId
              }
            ></DealersTab>
          </div>
          <div className="form-fields__btn-wrapper">
            <button
              type="submit"
              className="form-fields__btn-primary"
              data-link-position={dataPosition || "testRide"}
              // onClick={(e) => {
              //   ctaTracking(
              //     e,
              //     "confirmCTAClick",
              //     "Test Drive: Select Dealer"
              //   );
              // }}
            >
              {genericConfig?.testRideVidaCenterConfirmBtnLabel}
            </button>
          </div>
        </form>
        {/* )} */}
        {isShowDateTimePicker && (
          <form
            className="form-fields__name"
            onSubmit={handleSubmit((formData, event) =>
              handleFormDateTimeSubmit(formData, event)
            )}
          >
            <button
              type="button"
              className="form-fields__btn-secondary"
              data-link-position={dataPosition || "testRide"}
              onClick={(e) => {
                handleBackTime(e);
                ctaTrackingBack(
                  e,
                  "backButtonClick",
                  "Select Date-time",
                  "Test Drive: Select Date and time"
                );
              }}
            >
              {genericConfig?.testRideBackBtnLabel}
            </button>
            <p className="form-fields__name-header">{bookingTitle}</p>
            <p className="form-fields__sub-header">{bookingSubTitle}</p>
            {/* <DatePicker
              selectedDate={setSelectedDate}
              selectedTime={setSelectedTime}
            /> */}
            <DateField
              label="Date"
              value={selectedDate ? selectedDate : ""}
              name="date"
              placeholder="DD/MM/YYYY"
              control={control}
              errors={errors}
              disabled={bookingDateList.length === 0 ? true : false}
              onChangeHandler={dateChangeHandler}
              minDate={
                bookingDateList.length !== 0 ? bookingDateList[0].label : ""
              }
              maxDate={
                bookingDateList.length !== 0
                  ? bookingDateList[bookingDateList.length - 1].label
                  : ""
              }
            />

            {
              // <Dropdown
              //   name="time"
              //   label=""
              //   options={
              //     bookingTimeSlotList.length > 0
              //       ? bookingTimeSlotList
              //       : [
              //           {
              //             label: "Select Time",
              //             value: ""
              //           }
              //         ]
              //   }
              //   value={getValues("time") || ""}
              //   setValue={setValue}
              //   onChangeHandler={handleTimeDropdownChange}
              //   errors={errors}
              //   clearErrors={clearErrors}
              //   register={register}
              //   isDisabled={bookingTimeSlotList.length === 0 ? true : false}
              // />
              <div className="form__group time-slot-wrapper">
                <div className="time-slot-section">{timeSlot}</div>
              </div>
            }

            <div className="form-fields__btn-wrapper">
              <button
                type="submit"
                className="form-fields__btn-primary"
                disabled={bookingTimeSlotList.length === 0}
                data-link-position={dataPosition || "testRide"}
                // onClick={(e) => {
                //   ctaTracking(
                //     e,
                //     "confirmCTAClick",
                //     "Test Drive: Select Date and Time"
                //   );
                // }}
              >
                {genericConfig?.testRideNameConfirmBtnLabel}
              </button>
            </div>
          </form>
        )}

        {isShowNumberField && (
          <div className="test-ride-number-form-wrapper">
            {isShowOtpForm ? (
              <form
                className="form-fields__name"
                onSubmit={handleSubmit((formData, event) =>
                  handleFormNumberSubmit(formData, event)
                )}
              >
                <button
                  type="button"
                  className="form-fields__btn-secondary"
                  data-link-position={dataPosition || "testRide"}
                  onClick={(e) => {
                    handleBackNumber(e);
                    ctaTrackingBack(
                      e,
                      "backButtonClick",
                      "Enter Number",
                      "Test Drive: Enter Number"
                    );
                  }}
                >
                  {genericConfig?.testRideBackBtnLabel}
                </button>
                <p className="form-fields__name-header">
                  {`${
                    isNotify
                      ? notifyConfig?.mobileFieldConfig?.mobileHeader
                      : genericConfig?.testRideNameHeader
                  } ${cmpProps?.fname}?`}
                </p>
                <PhoneNumber
                  className="form-fields__name-input"
                  fieldNames={{
                    inputFieldName: "mobileNumber",
                    selectFieldName: "code"
                  }}
                  label={
                    isNotify
                      ? notifyConfig.mobileFieldConfig.mobileSubHeader
                      : phoneNumberField?.label
                  }
                  placeholder={phoneNumberField.placeholder}
                  options={codeList}
                  values={{
                    code: "",
                    number: userDetails.mobilenumber
                  }}
                  setValue={setValue}
                  validationRules={phoneNumberField.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={phoneNumberField.validationRules?.maxLength?.value}
                  isDisabled={isLoggedIn}
                />
                <p className="form__field-message">{leadApiErrorMsg}</p>
                {isNotify && !isDesktop && (
                  <div className="whatsapp-consent">
                    <p>{notifyConfig.mobileFieldConfig.whatsappConsent}</p>
                  </div>
                )}
                <div className="form-fields__btn-wrapper">
                  <button
                    type="submit"
                    className="form-fields__btn-primary"
                    data-link-position={dataPosition || "testRide"}
                    // onClick={(e) => {
                    //   // ctaTracking(
                    //   //   e,
                    //   //   "confirmCTAClick",
                    //   //   "Test Drive: Enter Number"
                    //   // );
                    // }}
                  >
                    {isNotify
                      ? notifyConfig.mobileFieldConfig.confirmBtnLabel
                      : genericConfig?.testRideNameConfirmBtnLabel}
                  </button>
                </div>
              </form>
            ) : (
              <div className="test-ride-otp-form-container">
                <p className="otp-sub-title-text">
                  {!changeOtpText
                    ? `${otpConfig?.otpSubTitle} ${cmpProps?.fname}`
                    : otpConfig?.otpResentText}
                </p>
                <OtpForm
                  otpConfig={otpConfig}
                  verifyOTPHandler={handleVerifyOTP}
                  changeNumberHandler={handleChangeNumber}
                  handleChangeOtpText={handleChangeOtpText}
                  isLogin={cmpProps.isLogin ? cmpProps.isLogin : false}
                  showError={showOtpError}
                  resendOtpHandler={resendOtpHandler}
                  altDataPosition="testRide"
                ></OtpForm>
              </div>
            )}
          </div>
        )}
        {TRNotApplicable && (
          <div className="vida-dealer-not-found__options">
            <p className="form-fields__name-header">
              {`${notifyConfig?.sorryText} ${cmpProps?.fname}, ${notifyConfig?.notifyHeader}`}
            </p>
            <p className="form-fields__sub-header">
              {`${notifyConfig?.notifySubHeader} ${
                cmpProps?.customerCity ? cmpProps?.customerCity : ""
              }`}
            </p>
            <RedirectionCards
              config={notifyConfig.pinCodeCard}
              clickEvent={setTryPincode}
            />
            <RedirectionCards config={notifyConfig.nearByCard} />
            <div className="notify-card">
              <p>{notifyConfig.notifyContent}</p>
              <a href="" onClick={notifyClickHandler}>
                {notifyConfig.notifyLink}
              </a>
            </div>
          </div>
        )}

        {isLeadSuccess && (
          <div className="vida-notify__success-container">
            <p className="form-fields__name-header">
              {`${notifySuccessConfig?.successSubHeader} ${cmpProps?.fname}!`}
            </p>
            <p className="form-fields__sub-header">
              {notifySuccessConfig.successHeader}
            </p>
            <p className="form-fields__content">
              {notifySuccessConfig.successMessage}
            </p>
            <div className="contact-us-container">
              <p className="contact-us-container__header">
                {notifySuccessConfig.contactUs.contactHeader}
              </p>
              <p className="contact-us-container__message">
                {notifySuccessConfig.contactUs.contactContent}
              </p>
              <div className="contact-us-container__details">
                <div className="contact-us-image">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/phone.svg`}
                  />
                </div>
                <a href="" className="contact-us-info">
                  {notifySuccessConfig.contactUs.contactPhone}
                </a>
              </div>
              <div className="contact-us-container__details">
                <div className="contact-us-image">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/email.svg`}
                  />
                </div>
                <a href="" className="contact-us-info">
                  {notifySuccessConfig.contactUs.contactEmail}
                </a>
              </div>
            </div>
            <div className="form-fields__btn-wrapper">
              <button
                type="button"
                className="form-fields__btn-primary"
                onClick={handleRedirection}
              >
                {notifySuccessConfig.successBtnLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userAccessReducer,
  userProfileDataReducer,
  testDriveReducer,
  testDriveVidaReducer
}) => {
  return {
    cmpProps: {
      isLogin: userAccessReducer.isLogin,
      fname: userAccessReducer.fname,
      lname: userAccessReducer.lname,
      email: userAccessReducer.email,
      sfid: userAccessReducer.sfid,
      countryCode: userAccessReducer.countryCode,
      numberOrEmail: userAccessReducer.numberOrEmail,
      mobileNumber: userAccessReducer.mobileNumber,
      customerExists: userAccessReducer.customerExists,
      customerCity: userAccessReducer.customerCity,
      customerState: userAccessReducer.customerState,
      customerCountry: userAccessReducer.customerCountry
    },
    userData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      pincode: userProfileDataReducer.pincode,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    nearByVidaCentreList: testDriveReducer.nearByVidaCentreList,
    bookingDateList: testDriveReducer.bookingDateList,
    bookingTimeSlotList: testDriveReducer.bookingTimeSlotList,
    modelVariantList: testDriveReducer.modelVariantList,
    rescheduledData: {
      dealerName: testDriveVidaReducer?.dealerName,
      date: testDriveVidaReducer?.date,
      timeLabel: testDriveVidaReducer?.timeLabel,
      modalVariant: testDriveVidaReducer?.modalVariant,
      branchId: testDriveVidaReducer?.branchId
    }
  };
};

QuickDriveForm.propTypes = {
  sfid: PropTypes.string,
  userDetails: PropTypes.object,
  userData: PropTypes.object,
  cmpProps: PropTypes.object,
  dealersEdit: PropTypes.object,
  nearByVidaCentreList: PropTypes.array,
  bookingDateList: PropTypes.array,
  bookingTimeSlotList: PropTypes.array,
  config: PropTypes.shape({
    agreeTerms: PropTypes.shape({
      agreeLabel: PropTypes.string,
      btnLabel: PropTypes.shape({
        agree: PropTypes.string,
        close: PropTypes.string
      }),
      id: PropTypes.string,
      terms: PropTypes.shape({
        actionUrl: PropTypes.string,
        label: PropTypes.string
      }),
      validationRules: PropTypes.shape({
        required: PropTypes.shape({
          message: PropTypes.string
        })
      })
    }),
    bookingTitle: PropTypes.string,
    bookingSubTitle: PropTypes.string,
    locationErrorMsg: PropTypes.string,
    cityField: PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      secondIcon: PropTypes.string,
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    firstNameField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    lastNameField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    phoneNumberField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    emailField: PropTypes.shape({
      label: PropTypes.string,
      infoLabel: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    modalVariantField: PropTypes.shape({
      subHeader: PropTypes.string,
      validationRules: PropTypes.object
    }),
    notificationField: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
    genericConfig: PropTypes.object,
    mapIcon: PropTypes.string,
    phoneIcon: PropTypes.string,
    nextBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    getNotifiedBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    otpConfig: PropTypes.object,
    notifyConfig: PropTypes.shape({
      showNotifyUs: PropTypes.bool,
      notifyUsDescription: PropTypes.string,
      notifyUsBtnLabel: PropTypes.string,
      notifyHeader: PropTypes.string,
      sorryText: PropTypes.string,
      notifySubHeader: PropTypes.string,
      pinCodeCard: PropTypes.object,
      nearByCard: PropTypes.object,
      notifyContent: PropTypes.string,
      notifyLink: PropTypes.string,
      mobileFieldConfig: PropTypes.shape({
        mobileHeader: PropTypes.string,
        mobileSubHeader: PropTypes.string,
        whatsappConsent: PropTypes.string,
        confirmBtnLabel: PropTypes.string,
        validationRules: PropTypes.object
      }),
      notifySuccessConfig: PropTypes.shape({
        successHeader: PropTypes.string,
        successSubHeader: PropTypes.string,
        successMessage: PropTypes.string,
        successBtnLabel: PropTypes.string,
        successBtnRedirection: PropTypes.string,
        contactUs: PropTypes.shape({
          contactHeader: PropTypes.string,
          contactContent: PropTypes.string,
          contactPhone: PropTypes.string,
          contactEmail: PropTypes.string
        })
      })
    })
  }),
  submitTestDriveFormData: PropTypes.func,
  bookTestRide: PropTypes.func,
  isSuccess: PropTypes.func,
  isReschedule: PropTypes.bool,
  modelVariantList: PropTypes.array,
  dataPosition: PropTypes.string,
  testDriveData: PropTypes.object,
  rescheduledData: PropTypes.object
};

export default connect(mapStateToProps)(QuickDriveForm);
