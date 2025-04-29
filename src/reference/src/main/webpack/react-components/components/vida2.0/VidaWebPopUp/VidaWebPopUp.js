import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../../site/scripts/constant";
import InputField from "../forms/InputField/InputField";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import OtpForm from "../OtpForm/OtpForm";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useForm } from "react-hook-form";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import {
  useGenerateWebPopupOTP,
  useVerifyOTP
} from "../../../hooks/userAccess/userAccessHooks";
import { getCityListForQuickTestDrive } from "../../../../services/location.service";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import { getUtmParams } from "../../../services/utmParams/utmParams";
import { useUserData } from "../../../hooks/userProfile/userProfileHooks";

const WebPopup = ({ config }) => {
  const [startAnalytics, setStartAnalytics] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showWebPopup, setShowWebPopup] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showOption, setShowOption] = useState(false);
  const [availableCityList, setAvailableCityList] = useState();
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCityList = appUtils.getConfig("cityList");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const codeList = appUtils.getConfig("countryCodes");
  const [cityList, setCityList] = useState(defaultCityList);
  const [cityFieldErrorMsg, setCityFieldErrorMsg] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [changeOtpText, setChangeOtpText] = useState(false);
  const [sortedOptions, setSortedOptions] = useState();
  const [showOtpError, setShowOtpError] = useState("");
  const [cityFieldRequiredErrorMsg, setCityFieldRequiredErrorMsg] =
    useState(true);
  const [userDetails, setUserDetails] = useState();
  const [OTPResponse, setOTPResponse] = useState();
  const generateBookingRegisterOTP = useGenerateWebPopupOTP(false);
  // const verifyWebPopupOTP = useVerifyWebPopupOTP();
  const inactivityTime = config.genericConfig?.inactivityTime; // 10 seconds
  const timer = useRef(null);
  const getUserData = useUserData();
  const [formData, setFormData] = useState();

  const {
    register,
    // control,
    handleSubmit,
    // getValues,
    // setValue,
    setError,
    clearErrors,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const cityInputField = document?.getElementsByClassName(
    "test-ride-city-search-input"
  )[0];

  const isLoggedIn = loginUtils.isSessionActive();

  const handleInputChange = (fieldname, value) => {
    if (value === "") {
      setError(fieldname, {
        type: "required"
      });
    } else if (
      value.length < config?.firstNameField.validationRules.minLength.value &&
      fieldname === "fname"
    ) {
      setError("fname", {
        type: "custom",
        message: config?.firstNameField.validationRules.minLength.message
      });
    } else if (fieldname === "fname" && !CONSTANT.NAME_REGEX.test(value)) {
      setError("fname", {
        type: "custom",
        message: config?.firstNameField?.validationRules?.fullName?.message
      });
    } else if (fieldname === "email") {
      if (!CONSTANT.EMAIL_REGEX.test(value)) {
        setError("email", {
          type: "custom",
          message: config?.emailField.validationRules.customValidation.message
        });
      } else {
        clearErrors("email");
      }
    } else {
      clearErrors(fieldname);
    }
  };
  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");
  const validateInput = (name, value) => {
    const hasCustomValidation =
      config?.phoneNumberField.validationRules?.custom &&
      config?.phoneNumberField.validationRules?.custom?.message;
    const hasMinLengthValidation =
      config?.phoneNumberField.validationRules?.minLength &&
      config?.phoneNumberField.validationRules?.minLength?.message;
    const hasMaxLengthValidation =
      config?.phoneNumberField.validationRules?.maxLength &&
      config?.phoneNumberField.validationRules?.maxLength?.message;

    // setValue("mobileNumber", value);

    if (value.length === 0) {
      setError("mobileNumber", {
        type: "custom",
        message: config?.phoneNumberField.validationRules?.required?.message
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
          message: config?.phoneNumberField.validationRules?.custom?.message
        });
        return false;
      }
      if (hasMinLengthValidation && value.length < 10) {
        setError("mobileNumber", {
          type: "custom",
          message: config?.phoneNumberField.validationRules?.minLength?.message
        });
        return false;
      }
      if (hasMaxLengthValidation && value.length > 10) {
        setError("mobileNumber", {
          type: "custom",
          message: config?.phoneNumberField.validationRules?.maxLength?.message
        });
        return false;
      }
    } else if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("mobileNumber", {
        type: "custom",
        message: config?.phoneNumberField.validationRules?.custom?.message
      });
      return false;
    }
    clearErrors("number");
    return true;
  };

  const handleGenerateOTP = async (data) => {
    setFormData(data);
    try {
      // !isLoggedIn && setSpinnerActionDispatcher(true);
      // setShowOtpError("");
      let result = {};
      // let output = {};
      // output = await generateSendOtp({
      //   variables: {
      //     country_code: data.countryCode || defaultCountryCode,
      //     mobile_number: RSAUtils.encrypt(data.mobileNumber),
      //     email: RSAUtils.encrypt(data.email),
      //     is_login: isLoggedIn,
      //     source: "testdrive"
      //   }
      // });
      if (data.fname && data.mobileNumber && data.email) {
        setUserDetails(data);
        setSpinnerActionDispatcher(true);
        result = await generateBookingRegisterOTP({
          variables: {
            country_code: data.countryCode || defaultCountryCode,
            mobile_number: RSAUtils.encrypt(data.mobileNumber),
            email: RSAUtils.encrypt(data.email),
            is_login: isLoggedIn,
            sub_source: data.sub_source || "web-popup",
            isForcedLogIn: data.isForcedLogIn
          }
        });
      }
      if (result?.data?.SendOtp?.status_code === 200) {
        setShowOTP(true);
        setOTPResponse(result.data.SendOtp);
        setTimeout(() => {
          const otpElement = document.getElementsByClassName(
            "test-ride-otp-form-container"
          )[0];
          otpElement.scrollIntoView();
        }, 100);
      }
      if (result?.errors && output.errors?.message) {
        setError("mobileNumber", {
          type: "custom",
          message: output.errors.message
        });
      }
      setSpinnerActionDispatcher(false);
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };
  const handleChangeOtpText = () => {
    setChangeOtpText(true);
  };
  const resendOtpHandler = () => {
    handleGenerateOTP(formData);
  };
  const verifyOTP = useVerifyOTP(false);
  const handleVerifyOTP = async (event, otp) => {
    const data = userDetails;
    try {
      setSpinnerActionDispatcher(true);
      const params = getUtmParams();
      const variables = {
        SF_ID: OTPResponse.SF_ID,
        is_login: isLoggedIn,
        fname: data?.fname.split(" ")[0],
        lname: data?.fname.split(" ").pop() || "",
        email: RSAUtils.encrypt(data.email),
        country_code: data.countryCode || defaultCountryCode,
        customer_state: data.state,
        customer_city: data.city,
        mobile_number: RSAUtils.encrypt(data.mobileNumber),
        otp: RSAUtils.encrypt(otp),
        // whatsapp_consent: true,
        // source: "", // ""
        sub_source: "web-popup",
        // customer_exist: OTPResponse.customer_exist,
        utm_params: params
      };

      const verifyOtpResult = await verifyOTP({
        variables
      });
      if (verifyOtpResult && verifyOtpResult.data) {
        if (verifyOtpResult.data.VerifyOtp.status_code === 200) {
          showNotificationDispatcher({
            title: verifyOtpResult.data.VerifyOtp.message,
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
          // window.sessionStorage.setItem("webPopup", true);
          await getUserData();
          setShowWebPopup(false);
          document.body.style.overflow = "";
          if (startAnalytics) {
            const formDetails = { formType: "Lead Pop-Up" };
            const formEvent = "popUpFormSuccess";
            analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
          }
          //     trackLoginSignupSuccessFail("otpSuccess");
          //     !isLoggedIn &&
          //       setUserFormDataActionDispatcher({
          //         countryCode: cmpProps.countryCode || defaultCountryCode,
          //         numberOrEmail: cmpProps.mobileNumber || cmpProps.email || "",
          //         mobileNumber: cmpProps.mobileNumber || "",
          //         fname: cmpProps.fname || "",
          //         lname: cmpProps.lname || "",
          //         email: cmpProps.email || ""
          //       });
          //     window.scrollTo(0, 0);
          //     setShowUserInfoForm(false);
          //     setShowDealersLocation(true);
        }
        // }
        else {
          //   trackLoginSignupSuccessFail("otpFailure");
          setShowOtpError(verifyOtpResult.errors.message);
          showNotificationDispatcher({
            title: verifyOtpResult.data.VerifyOtp.message,
            type: CONSTANT.NOTIFICATION_TYPES.ERROR,
            isVisible: true
          });
          const formDetails = { formType: "Reserve/Buy" };
          const formEvent = "otpFailure";
          analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
          //   // setOtpFields([...otpFields.map(() => "")]);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
    // const formDetails = {
    //   ctaText: config?.otpConfig?.verifyBtn.label,
    //   ctaLocation: "Lead Pop-Up"
    // };
    // const formEvent = "ctaButtonClick";
    // analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
  };
  const handleOnChange = (e) => {
    // setValue("citySearchInput", e.target.value);
    setSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg("");
    } else {
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg(
        config?.cityField?.validationRules?.required?.message
      );
    }
  };
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
  const handleOnKeyUp = (e) => {
    handleSortOptions();
    if (e.target.value.length > 1) {
      setShowOption(true);
    } else {
      setShowOption(false);
      // setCityFieldErrorMsg("");
    }
  };
  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForQuickTestDrive(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
      setAvailableCityList(cityListRes);
    }
  };

  const handleOptionSelect = (value) => {
    cityInputField.value = value.city;
    const matchCity = cityList.filter((x) => x.city === value.city);
    if (matchCity.length > 0) {
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg("");
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg("");
    } else {
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg(noDealerAvailableError);
    }
  };

  const handleOnFocus = () => {
    handleSortOptions();
  };
  const handleFormFocus = () => {
    if (startAnalytics === false) {
      setStartAnalytics(true);
    }
  };
  useEffect(() => {
    if (startAnalytics) {
      const formDetails = { formType: "Lead Pop-Up" };
      const formEvent = "popUpFormStart";
      analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
    }
  }, [startAnalytics]);

  const handleFormUserInfoSubmit = async (formData) => {
    const matchCity = cityList.filter((x) => x.city === cityInputField.value);
    if (cityInputField.value.length > 0 && matchCity.length > 0) {
      if (!validateInput("number", formData.mobileNumber.trim())) {
        return;
      }
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg("");
      const datas = {
        fname: formData.fname,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        countryCode: defaultCountryCode,
        state: matchCity[0]?.state,
        city: matchCity[0]?.city
      };
      handleGenerateOTP(datas);
    } else {
      setCityFieldRequiredErrorMsg(false);
      setCityFieldErrorMsg(
        config?.cityField?.validationRules?.required?.message
      );
    }
    const formDetails = {
      ctaText: config?.genericConfig?.webPopupConfirmBtnLabel,
      ctaLocation: "Lead Pop-Up"
    };
    const formEvent = "ctaButtonClick";
    analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
  };

  //commenting this code as requirement changed from inactivity to seconds after load
  const resetTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      if (window.sessionStorage.getItem("optOutForPopup") !== "true") {
        setShowWebPopup(true);
        // if (!showWebPopup) {
        // if (!document.querySelector(".vida-webpopup-form")) {
        //   const formDetails = { formType: "Lead Pop-Up" };
        //   const formEvent = "popUpShown";
        //   analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
        // }
      }
    }, inactivityTime);
  };

  const handleClosePopup = () => {
    setShowWebPopup(false);
    window.sessionStorage.setItem("optOutForPopup", true);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
      //to trigger on initial page load
      resetTimer();

      // Cleanup on unmount
      return () => {
        clearTimeout(timer.current);
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
      };

      //   setTimeout(() => {
      //     setShowWebPopup(true);
      //   }, inactivityTime);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (showWebPopup) {
      const formDetails = { formType: "Lead Pop-Up" };
      const formEvent = "popUpShown";
      analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
      document.body.style.overflow = "hidden";
    }
  }, [showWebPopup]);

  useEffect(() => {
    fetchCityList();
  }, []);

  return (
    <>
      {showWebPopup && (
        <div>
          <div className="vida-webpopup-backdrop">
            <div className="vida-webpopup-form">
              <div className="vida-webpopup-header">
                <h1 className="user-info-form-title">
                  {config?.genericConfig?.webPopupTitleText}
                </h1>
                <button className="popup-close-btn" onClick={handleClosePopup}>
                  <i className="icon-x"></i>
                </button>
              </div>
              <div className="form-fields">
                {showPopup && (
                  <div className="test-ride-user-info-form-container">
                    <div className="web-popup-form-cont">
                      <form
                        className="form-fields__name"
                        onSubmit={handleSubmit((formData, event) =>
                          handleFormUserInfoSubmit(formData, event)
                        )}
                        onFocus={handleFormFocus}
                      >
                        <InputField
                          className="form-fields__name-input"
                          name="fname"
                          label={config?.firstNameField?.label}
                          placeholder={config?.firstNameField?.placeholder}
                          value=""
                          validationRules={
                            config?.firstNameField?.validationRules
                          }
                          register={register}
                          errors={errors}
                          checkNameFormat
                          onChangeHandler={handleInputChange}
                        />
                        <InputField
                          name="email"
                          placeholder={config?.emailField.placeholder}
                          validationRules={config?.emailField.validationRules}
                          register={register}
                          errors={errors}
                          checkEmailFormat
                          onChangeHandler={handleInputChange}
                          value=""
                        />
                        <div className="test-ride-location-container">
                          <div
                            className="test-ride-location-find-icon"
                            onClick={handleGetUserLocation}
                          ></div>
                          <div
                            className={
                              showOption
                                ? "test-ride-location-cancel-icon d-block"
                                : "test-ride-location-cancel-icon d-none"
                            }
                            // onClick={handleOnCancel}
                          >
                            <img
                              src={`${appUtils.getConfig(
                                "resourcePath"
                              )}images/png/test_ride_cancel_icon.png`}
                              alt="location_cancel_icon"
                            ></img>
                          </div>
                          <input
                            name="citySearchInput"
                            className="test-ride-city-search-input"
                            placeholder={config?.cityField?.label}
                            type="text"
                            {...register("citySearchInput", {
                              required: true,
                              onChange: (e) => {
                                handleOnChange(e);
                              }
                            })}
                            onClick={handleOnFocus}
                            onBlur={handleOnBlur}
                            onKeyUp={handleOnKeyUp}
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
                          {cityFieldRequiredErrorMsg &&
                            errors["citySearchInput"] &&
                            errors["citySearchInput"].type === "required" && (
                              <>
                                <p className="test-ride-city-error-msg">
                                  {config?.cityField?.validationRules &&
                                    config?.cityField?.validationRules
                                      ?.required &&
                                    config?.cityField?.validationRules?.required
                                      ?.message}
                                </p>
                              </>
                            )}
                          <p className="test-ride-city-error-msg">
                            {cityFieldErrorMsg}
                          </p>
                        </div>
                        <PhoneNumber
                          className="form-fields__name-input"
                          fieldNames={{
                            inputFieldName: "mobileNumber",
                            selectFieldName: "code"
                          }}
                          label={config?.phoneNumberField?.label}
                          placeholder={config?.phoneNumberField.placeholder}
                          options={codeList}
                          validationRules={
                            config?.phoneNumberField.validationRules
                          }
                          register={register}
                          errors={errors}
                          maxLength={
                            config?.phoneNumberField.validationRules?.maxLength
                              ?.value
                          }
                          isDisabled={isLoggedIn}
                        />
                        {!showOTP && (
                          <div className="form-fields__btn-wrapper">
                            <button
                              type="submit"
                              className="form-fields__btn-primary"
                              disabled={!isValid}
                            >
                              {config?.genericConfig?.webPopupConfirmBtnLabel}
                            </button>
                          </div>
                        )}
                        {showOTP && (
                          <div className="test-ride-otp-form-container">
                            <p className="otp-sub-title-text">
                              {config?.otpConfig?.otpResentText}
                            </p>
                            <OtpForm
                              otpConfig={config?.otpConfig}
                              verifyOTPHandler={handleVerifyOTP}
                              // changeNumberHandler={handleChangeNumber}
                              handleChangeOtpText={handleChangeOtpText}
                              isLogin={false}
                              showError={showOtpError}
                              resendOtpHandler={resendOtpHandler}
                              altDataPosition="webpopup"
                            ></OtpForm>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebPopup;

WebPopup.propTypes = {
  config: PropTypes.object
};
