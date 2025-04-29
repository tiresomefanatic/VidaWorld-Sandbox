import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Location from "../../../../site/scripts/location";
import { useForm } from "react-hook-form";
import Dropdown from "../../form/Dropdown/Dropdown";
import InputField from "../../form/InputField/InputField";
import PhoneNumber from "../../form/PhoneNumber/PhoneNumber";
import QuickDriveOtpForm from "../QuickDriveForm/QuickDriveOtpForm";
import Timer from "../../Timer/Timer";
import CONSTANT from "../../../../site/scripts/constant";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import Logger from "../../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import {
  useTestDriveSendOtp,
  useTestDriveVerifyOtp
} from "../../../hooks/userAccess/userAccessHooks";
import { setUserFormDataActionDispatcher } from "../../../store/userAccess/userAccessActions";
import { getUtmParams } from "../../../../react-components/services/utmParams/utmParams";
import { setTestDriveDataDispatcher } from "../../../store/testDrive/testDriveActions";
import { getCityListForQuickTestDrive } from "../../../../services/location.service";

const TestDriveRegister = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const defaultStateList = appUtils.getConfig("stateList");
  const defaultCityList = appUtils.getConfig("cityList");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const [stateList, setStateList] = useState(defaultStateList);
  const [cityList, setCityList] = useState(defaultCityList);
  const codeList = appUtils.getConfig("countryCodes");
  const [locationObj, setLocationObj] = useState(null);
  const [otpFields, setOtpFields] = useState(new Array(6).fill(""));
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [resend, setResend] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [showOtpError, setShowOtpError] = useState("");
  const [agreeTermsSelected, setAgreeTermsSelected] = useState(true);
  const [showAgreeTermError, setShowAgreeTermError] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const [isOTPLinkVisible, setOTPLinkVisible] = useState(false);
  const [isResendBtnVisible, setResendBtnVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const [testrideLocation, setTestrideLocation] = useState({});
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [cityIsDisabled, setCityIsDisabled] = useState(true);
  const redirectUrl = appUtils.getPageUrl("testDriveSelectorUrl");
  const islttr = true;

  const { submitBookingFormData, cmpProps, customerExists, isLttrAvailable } =
    props;
  const { sfid } = cmpProps;
  const {
    bookingTitle,
    firstNameField,
    lastNameField,
    emailField,
    phoneNumberField,
    stateField,
    cityField,
    notificationField,
    agreeTerms,
    nextBtn,
    otpConfig
  } = props.config;
  const {
    register,
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
  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateList"),
    ...stateField
  };
  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("cityList"),
    ...cityField
  };

  const getStateList = async (countryId) => {
    const obj = new Location();
    setLocationObj(obj);

    const states = await obj.getStates(countryId);
    const stateOptions = states.map((state) => {
      return {
        state: state.label,
        label: state.label,
        value: state.value,
        cities: state.cities
      };
    });
    setStateList([...stateList, ...stateOptions]);
  };

  useEffect(() => {
    getStateList("India");
  }, []);

  const handleOnSubscribeChange = () => {
    setIsSubscribed(!isSubscribed);
  };

  const customCheckBoxKeyPress = (event) => {
    const isEnter = event.which === 13;
    if (isEnter) {
      event.preventDefault();
      setIsSubscribed(!isSubscribed);
    }
  };

  const toggleTermsCheck = (event) => {
    setAgreeTermsSelected(event.target.checked);
    setIsFormValid(event.target.checked);
    setShowAgreeTermError(!event.target.checked);
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const content = document.getElementById(agreeTerms.id);
    setTermsContent(content.innerHTML);
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setAgreeTermsSelected(true);
    setShowAgreeTermError(false);
    setIsFormValid(true);
    closeTermsPopup();
  };

  const validateInput = (value) => {
    const hasCustomValidation =
      emailField?.validationRules?.customValidation?.message;

    setValue("email", value);
    if (value.length === 0) {
      setError("email", {
        type: "custom",
        message: emailField.validationRules.required.message
      });
      return false;
    }
    if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("email", {
        type: "custom",
        message: emailField.validationRules.customValidation.message
      });
      return false;
    }
    clearErrors("email");
    return true;
  };

  const generateSendOtp = useTestDriveSendOtp();
  const handleGenerateOTP = async (formDataValues, methodName) => {
    const { email, countryCode, city, fname, lname, phoneNumber, subscribe } =
      formDataValues;

    if (!phoneNumber) {
      setError("phoneNumber", {
        type: "required",
        message: phoneNumberField.validationRules.required.message
      });
    }
    if (!fname) {
      setError("fname", {
        type: "required",
        message: firstNameField.validationRules.required.message
      });
    }
    if (!lname) {
      setError("lname", {
        type: "required",
        message: lastNameField.validationRules.required.message
      });
    }
    if (!email) {
      setError("email", {
        type: "required",
        message: emailField.validationRules.required.message
      });
    }
    if (!city) {
      setError("city", {
        type: "required",
        message: cityField.validationRules.required.message
      });
    }
    if (
      email &&
      validateInput(email.trim()) &&
      phoneNumber &&
      fname &&
      lname &&
      city
    ) {
      try {
        setSpinnerActionDispatcher(true);
        const variables = {
          country_code: countryCode || defaultCountryCode,
          mobile_number: RSAUtils.encrypt(phoneNumber),
          email: RSAUtils.encrypt(email),
          is_login: false,
          source: "testdrive"
        };
        const sendOtpResult = await generateSendOtp({ variables });

        if (sendOtpResult) {
          if (sendOtpResult.data) {
            if (isResendBtnVisible) {
              setResetTimer(!resetTimer);
              setResend(false);
              setOtpFields([...otpFields.map(() => "")]);
            } else {
              setShowOTPForm(true);
              setResendBtnVisible(true);
              setBtnDisabled(false);
            }

            if (isAnalyticsEnabled) {
              if (methodName === "resend") {
                const customLink = {
                  name: "Resend",
                  position: "Middle",
                  type: "Link",
                  clickType: "other"
                };
                analyticsUtils.trackCtaClick(customLink);
              }
              if (methodName === "send") {
                const customLink = {
                  name: "Send Otp",
                  position: "Bottom",
                  type: "Button",
                  clickType: "other"
                };
                const location = {
                  pinCode: "",
                  city: testrideLocation.city,
                  state: testrideLocation.state,
                  country: testrideLocation.country
                };
                const productDetails = {
                  modelVariant: "",
                  modelColor: "",
                  productID: ""
                };
                const bookingDetails = {
                  testDriveReceiveNotificationStatus: subscribe ? "Yes" : "No"
                };
                const additionalPageName = " Send Otp";
                const additionalJourneyName = "Booking";
                analyticsUtils.trackNotificationCBClick(
                  customLink,
                  location,
                  productDetails,
                  bookingDetails,
                  additionalPageName,
                  additionalJourneyName
                );
              }
            }

            setShowOtpError("");
            clearErrors("phoneNumber");
          } else if (sendOtpResult.errors && sendOtpResult.errors.message) {
            setError("phoneNumber", {
              type: "custom",
              message: sendOtpResult.errors.message
            });
          } else {
            Logger.error(sendOtpResult);
          }
        }
      } catch (error) {
        Logger.error(error);
      }
    }
  };
  //check for Lttr availability
  const checkLttr = async (formDataValues) => {
    const { subscribe } = formDataValues;
    let istestRideAvailable = true;
    if (isLttrAvailable) {
      const lttrCities = await getCityListForQuickTestDrive(
        defaultCountry,
        islttr
      );
      if (lttrCities.some((item) => item.state === formDataValues.state)) {
        window.location.href = redirectUrl;
      } else {
        // islttr = false;
        // const testRideCities = await getCityListForQuickTestDrive(
        //   defaultCountry,
        //   islttr
        // );
        istestRideAvailable = true;
        // if (
        //   testRideCities.some(
        //     (item) =>
        //       item.state === testrideLocation.state &&
        //       item.city === testrideLocation.city
        //   )
        // ) {
        //   istestRideAvailable = false;
        // }
        submitBookingFormData(
          testrideLocation,
          subscribe,
          "",
          istestRideAvailable
        );
      }
    } else {
      submitBookingFormData(
        testrideLocation,
        subscribe,
        "",
        istestRideAvailable
      );
    }
  };
  const verifyOTP = useTestDriveVerifyOtp();

  const handleVerifyOTP = async (formDataValues) => {
    const { countryCode, email, fname, lname, phoneNumber, subscribe, city } =
      formDataValues;
    if (validateInput(email.trim())) {
      let otp = "";
      for (let otpValue = 0; otpValue < 6; otpValue++) {
        otp += document
          .getElementsByName(`QuickDriveOtpForm${otpValue}`)[0]
          .value.trim();
      }
      try {
        setSpinnerActionDispatcher(true);
        const params = getUtmParams();
        const selectedCity = cityList.filter((x) => x.value === city);

        const variables = {
          SF_ID: sfid,
          is_login: isLoggedIn,
          fname,
          lname,
          email: RSAUtils.encrypt(email),
          country_code: countryCode ? countryCode : defaultCountryCode,
          mobile_number: RSAUtils.encrypt(phoneNumber),
          otp: RSAUtils.encrypt(otp),
          whatsapp_consent: subscribe,
          source: "testdrive",
          customer_exist: customerExists,
          utm_params: params,
          customer_city: formDataValues.city,
          customer_state: formDataValues.state
        };

        const verifyOtpResult = await verifyOTP({
          variables
        });

        if (verifyOtpResult && verifyOtpResult.data) {
          if (verifyOtpResult.data.VerifyOtp.status_code === 200) {
            try {
              setTestDriveDataDispatcher({
                location: {
                  country: "",
                  state: "",
                  city: selectedCity
                },
                subscribe: subscribe
              });
              !isLoggedIn &&
                setUserFormDataActionDispatcher({
                  countryCode: countryCode || defaultCountryCode,
                  numberOrEmail: phoneNumber || email || "",
                  mobileNumber: phoneNumber || "",
                  fname: fname || "",
                  lname: lname || "",
                  email: email || ""
                });
              checkLttr(formDataValues);
              //   const lttrCities = await getCityListForQuickTestDrive(
              //     defaultCountry,
              //     islttr
              //   );
              //   if (
              //     lttrCities.some((item) => item.state === formDataValues.state)
              //   ) {
              //     window.location.href = redirectUrl;
              //   } else {
              //     // islttr = false;
              //     // const testRideCities = await getCityListForQuickTestDrive(
              //     //   defaultCountry,
              //     //   islttr
              //     // );
              //     const istestRideAvailable = true;
              //     // if (
              //     //   testRideCities.some(
              //     //     (item) =>
              //     //       item.state === testrideLocation.state &&
              //     //       item.city === testrideLocation.city
              //     //   )
              //     // ) {
              //     //   istestRideAvailable = false;
              //     // }
              //     submitBookingFormData(
              //       testrideLocation,
              //       subscribe,
              //       "",
              //       istestRideAvailable
              //     );
              //   }
            } catch (error) {
              Logger.error(error);
            }
          }
        } else {
          setShowOtpError(verifyOtpResult.errors.message);
          setOtpFields([...otpFields.map(() => "")]);
        }
      } catch (error) {
        Logger.error(error);
      }
    }
  };
  const handleResend = (isResend) => {
    if (isResendBtnVisible) {
      setResend(isResend);
    }
  };
  const handleFormSubmit = (formData, event) => {
    setTestrideLocation({
      state: formData.state,
      city: formData.city,
      country: defaultCountry
    });

    if (!isResendBtnVisible) {
      handleGenerateOTP(formData, "send");
    } else {
      let errorCount = 0;
      for (let otpValue = 0; otpValue < 6; otpValue++) {
        document.getElementsByName(`QuickDriveOtpForm${otpValue}`)[0].value ===
          "" && errorCount++;
      }

      if (errorCount === 0) {
        handleVerifyOTP(formData);
      } else {
        setShowOtpError(otpConfig.validationRules.required.message);
        setOtpFields([...otpFields.map(() => "")]);
      }
    }
  };
  const handleOtpField = (toggleValue) => {
    setOTPLinkVisible(toggleValue);
    setResend(false);
    if (!toggleValue) {
      setBtnDisabled(true);
      setShowOTPForm(false);
      setResendBtnVisible(false);
    }
  };
  const handleInputChange = async (fieldname, value) => {
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
    } else if (fieldname === "email") {
      if (!CONSTANT.EMAIL_REGEX.test(value)) {
        setError("email", {
          type: "custom",
          message: emailField.validationRules.customValidation.message
        });
      } else if (CONSTANT.EMAIL_REGEX.test(value) && isResendBtnVisible) {
        setResend(false);
        setBtnDisabled(true);
        setShowOTPForm(false);
        setResendBtnVisible(false);
      } else {
        clearErrors("email");
      }
    } else if (fieldname === stateFieldInfo.name) {
      if (value) {
        const cities = await locationObj.getCities("India", value);
        setCityList([...defaultCityList, ...cities]);
        setCityIsDisabled(false);
      }
    } else {
      clearErrors(fieldname);
    }
  };
  return (
    <>
      <h1 className="vida-quick-drive-form__title">{bookingTitle}</h1>
      <form
        className="form vida-quick-drive-form"
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <Dropdown
          name={stateFieldInfo.name}
          label={stateFieldInfo.label}
          options={stateList}
          isSortAsc={true}
          value={defaultStateList.label}
          setValue={setValue}
          errors={errors}
          clearErrors={clearErrors}
          register={register}
          onChangeHandler={handleInputChange}
          validationRules={stateFieldInfo.validationRules}
        />

        <Dropdown
          name={cityFieldInfo.name}
          label={cityFieldInfo.label}
          options={cityList}
          isSortAsc={true}
          value={defaultCityList.label}
          setValue={setValue}
          errors={errors}
          clearErrors={clearErrors}
          register={register}
          onChangeHandler={handleInputChange}
          validationRules={cityFieldInfo.validationRules}
          isDisabled={cityIsDisabled}
        />

        <InputField
          name="fname"
          label={firstNameField.label}
          placeholder={firstNameField.placeholder}
          value=""
          validationRules={firstNameField.validationRules}
          register={register}
          errors={errors}
          checkNameFormat
          setValue={setValue}
          onChangeHandler={handleInputChange}
        />
        <InputField
          name="lname"
          label={lastNameField.label}
          placeholder={lastNameField.placeholder}
          value=""
          validationRules={lastNameField.validationRules}
          register={register}
          errors={errors}
          checkNameFormat
          setValue={setValue}
          onChangeHandler={handleInputChange}
        />
        <InputField
          name="email"
          label={emailField.label}
          infoLabel={emailField.infoLabel}
          placeholder={emailField.placeholder}
          validationRules={emailField.validationRules}
          register={register}
          errors={errors}
          checkEmailFormat
          onChangeHandler={handleInputChange}
          value=""
          setValue={setValue}
          // isDisabled={isLoggedIn}
        />
        <PhoneNumber
          label={phoneNumberField.label}
          fieldNames={{
            inputFieldName: "phoneNumber",
            selectFieldName: "countryCode"
          }}
          placeholder={phoneNumberField.placeholder}
          options={codeList}
          values={{
            code: defaultCountryCode || "",
            number: ""
          }}
          validationRules={phoneNumberField.validationRules}
          register={register}
          errors={errors}
          setValue={setValue}
          maxLength={phoneNumberField.validationRules.maxLength.value}
          showOtpFieldHandler={handleOtpField}
        />
        {showOTPForm && (
          <div className="vida-quick-drive-form__otpfields">
            <QuickDriveOtpForm
              name="QuickDriveOtpForm"
              mobileOtpConfig={otpConfig}
              showError={showOtpError}
              validationRules={otpConfig.validationRules}
              register={register}
              isLogin={isLoggedIn}
              formDataValues={getValues()}
              otpFields={otpFields}
              resend={resend}
            />
            <div className="vida-otp__timer">
              <Timer
                resendHandler={handleResend}
                timer={otpConfig.timer}
                resetTimer={resetTimer}
              ></Timer>
              <a
                href="#"
                className={`${resend ? "" : "disabled"}`}
                onClick={(event) => {
                  event.preventDefault(),
                    handleGenerateOTP(getValues(), "resend");
                }}
              >
                {otpConfig.resendLabel}
              </a>
            </div>
          </div>
        )}
        <div className="form__group form__field-checkbox">
          <label className="form__field-label">
            {notificationField.label}
            <i className="icon-whatsapp"></i>
            <input
              tabIndex="0"
              type="checkbox"
              checked={isSubscribed}
              {...register("subscribe", {
                onChange: () => handleOnSubscribeChange()
              })}
            ></input>
            <span
              tabIndex="0"
              className="form__field-checkbox-mark"
              role="checkbox"
              aria-checked="false"
              onKeyPress={(e) => customCheckBoxKeyPress(e)}
            ></span>
          </label>
        </div>

        <div className="vida-quick-drive-form__notification-msg">
          {notificationField.message}
        </div>

        <div className="form__group form__field-checkbox vida-quick-drive-form__terms">
          <label className="vida-quick-drive-form__label vida-quick-drive-form__terms-label">
            {agreeTerms.agreeLabel}{" "}
            <input
              type="checkbox"
              name="agreeTerms"
              htmlFor="terms"
              checked={agreeTermsSelected}
              onChange={(event) => toggleTermsCheck(event)}
            ></input>
            <span className="form__field-checkbox-mark"></span>
          </label>
          <a
            href="#"
            rel="noreferrer noopener"
            onClick={(event) => handleTermsandConditions(event)}
          >
            {agreeTerms.terms.label}
          </a>
        </div>
        {showAgreeTermError && (
          <div className={`${showAgreeTermError ? "form__group--error" : ""}`}>
            <p className="form__field-message">
              {agreeTerms.validationRules.required.message}
            </p>
          </div>
        )}
        {!isResendBtnVisible && (
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={!isOTPLinkVisible || !isFormValid}
          >
            {otpConfig.sendOtp}
          </button>
        )}
        {showOTPForm && (
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {nextBtn.label}
          </button>
        )}
      </form>

      {showTermsPopup && (
        <div className="vida-terms-conditions">
          <div className="vida-terms-conditions__container">
            <div className="vida-terms-conditions__body">
              <div className="vida-terms-conditions__body-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent
                  }}
                ></div>
              </div>
            </div>
            <div className="vida-terms-conditions__btn-wrap">
              <button
                className="btn btn--primary"
                role="button"
                onClick={() => handleAgreeTerms()}
              >
                {agreeTerms.btnLabel.agree}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {agreeTerms.btnLabel.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ userAccessReducer }) => {
  return {
    cmpProps: {
      isLogin: userAccessReducer.isLogin,
      fname: userAccessReducer.fname,
      lname: userAccessReducer.lname,
      email: userAccessReducer.email,
      sfid: userAccessReducer.sfid
    }
  };
};
TestDriveRegister.propTypes = {
  submitBookingFormData: PropTypes.func,
  config: PropTypes.shape({
    bookingTitle: PropTypes.string,
    cityField: PropTypes.shape({
      label: PropTypes.string,
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
    notificationField: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
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
    nextBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    otpConfig: PropTypes.object
  }),
  cmpProps: PropTypes.object,
  sfid: PropTypes.string,
  customerExists: PropTypes.bool,
  isLttrAvailable: PropTypes.bool
};

TestDriveRegister.defaultProps = {
  config: {},
  sfid: "",
  customerExists: false
};

export default connect(mapStateToProps)(TestDriveRegister);
