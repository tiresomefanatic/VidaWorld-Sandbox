import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import PropTypes from "prop-types";
import InputField from "../forms/InputField/InputField";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import CONSTANT from "../../../../site/scripts/constant";
import WebPopupOTP from "../WebPopupOTP/WebPopupOTP";
import Timer from "../Timer/Timer";
import {
  generateWebPopUpOTP,
  validateWebPopupOTP
} from "../../../hooks/webPopup/webPopupHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";

const WebPopUpNew = ({ config }) => {
  const [showWebPopup, setShowWebPopup] = useState(false);
  const [startAnalytics, setStartAnalytics] = useState(false);
  const [showOTP, setShowOTP] = useState(true);
  const [changeOtpText, setChangeOtpText] = useState(false);
  const [showOtpError, setShowOtpError] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState();
  const [otpResponse, setOtpResponse] = useState();
  const [showOTPTimer, setShowOTPTimer] = useState(false);
  const [showSendOTP, setShowSendOTP] = useState(true);
  const [showResendOTP, setShowResendOTP] = useState(false);
  const [disableSendOTP, setDisableSendOTP] = useState(true);
  const [disableOTPFields, setDisableOTPFields] = useState(true);
  const [isResend, setIsResend] = useState(false);

  const isLoggedIn = loginUtils.isSessionActive();
  const inactivityTime = config.genericConfig?.inactivityTime;
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");
  //const phNumberLength = appUtils.getConfig("phNumberLength");

  const generateOTP = generateWebPopUpOTP();
  const verifyOTP = validateWebPopupOTP();

  const {
    register,
    // handleSubmit,
    getValues,
    setError,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const handleClosePopup = () => {
    setShowWebPopup(false);
    document.body.style.overflow = "";
  };

  const handleFormFocus = () => {
    if (startAnalytics === false) {
      setStartAnalytics(true);
    }
  };

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
    } else {
      clearErrors(fieldname);
    }
  };

  const handleGenerateOTP = async () => {
    try {
      setUserName(getValues("fname"));
      setMobileNumber(getValues("mobileNumber"));

      const variables = {
        country_code: defaultCountryCode,
        username: RSAUtils.encrypt(getValues("mobileNumber")),
        is_login: false,
        sub_source: "web-popup"
      };

      const formDetails = {
        ctaText: config?.otpConfig?.sendOTPLabel,
        ctaLocation: "Lead Pop-Up"
      };
      const formEvent = "ctaButtonClick";
      analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);

      setSpinnerActionDispatcher(true);
      const sendOtpResult = await generateOTP({ variables });

      if (sendOtpResult?.data?.SendOtp?.status_code === 200) {
        setOtpResponse(sendOtpResult.data.SendOtp);
        setSpinnerActionDispatcher(false);
        setShowSendOTP(false);
        setShowResendOTP(false);
        setShowOTPTimer(true);
        setDisableOTPFields(false);
      }
    } catch (error) {
      Logger.error(error);
      setSpinnerActionDispatcher(false);
    }
  };

  const resendOtpHandler = () => {
    setDisableOTPFields(true);
    setIsResend(true);
    handleGenerateOTP();
  };

  const handleChangeOtpText = () => {
    setChangeOtpText(true);
  };

  const handleVerifyOTP = async (event, otp) => {
    try {
      setSpinnerActionDispatcher(true);
      const variables = {
        SF_ID: otpResponse.SF_ID,
        is_login: false,
        fname: userName.split(" ")[0],
        lname: userName.split(" ").pop() || "",
        country_code: defaultCountryCode,
        username: RSAUtils.encrypt(mobileNumber),
        otp: RSAUtils.encrypt(otp),
        sub_source: "web-popup"
      };

      const verifyOTPResult = await verifyOTP({ variables });
      if (
        verifyOTPResult &&
        verifyOTPResult.data &&
        verifyOTPResult.data.WebPopupVerifyOtp.status_code === 200
      ) {
        setSpinnerActionDispatcher(false);
        showNotificationDispatcher({
          title: verifyOTPResult.data.WebPopupVerifyOtp.message,
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
        document.body.style.overflow = "";
        if (startAnalytics) {
          const formDetails = { formType: "Lead Pop-Up" };
          const formEvent = "popUpFormSuccess";
          analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
        }
        setShowWebPopup(false);
      } else {
        showNotificationDispatcher({
          title: verifyOTPResult.data.WebPopupVerifyOtp.message,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        const formDetails = { formType: "Reserve/Buy" };
        const formEvent = "otpFailure";
        analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
      }
    } catch (error) {
      Logger.error(error);
      setSpinnerActionDispatcher(false);
    }
  };

  const changeNumberHandler = () => {
    resetField("mobileNumber");
  };

  useEffect(() => {
    if (startAnalytics) {
      const formDetails = { formType: "Lead Pop-Up" };
      const formEvent = "popUpFormStart";
      analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
    }
  }, [startAnalytics]);

  useEffect(() => {
    if (showWebPopup) {
      const formDetails = { formType: "Lead Pop-Up" };
      const formEvent = "popUpShown";
      analyticsUtils.trackLeadPopupEvents(formEvent, formDetails);
      document.body.style.overflow = "hidden";
    }
  }, [showWebPopup]);

  useEffect(() => {
    if (
      getValues("mobileNumber")?.length === 10 &&
      getValues("fname")?.length > 0 &&
      !errors.mobileNumber &&
      !errors.fname
    ) {
      setDisableSendOTP(false);
    } else {
      setDisableSendOTP(true);
    }
  }, [getValues("mobileNumber")?.length, getValues("fname")]);

  useEffect(() => {
    if (!isLoggedIn) {
      setTimeout(() => {
        setShowWebPopup(true);
      }, inactivityTime);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (showOTPTimer) {
      setTimeout(() => {
        setShowOTPTimer(false);
        setShowResendOTP(true);
      }, config.otpConfig.timer.seconds * 1000);
    }
  }, [showOTPTimer]);

  return (
    <>
      {showWebPopup && (
        <div>
          <div className="vida-webpopup-backdrop-new">
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
                <form
                  className="form-fields__name"
                  // onSubmit={handleSubmit((formData, event) =>
                  //   handleFormUserInfoSubmit(formData, event)
                  // )}
                  onFocus={handleFormFocus}
                >
                  <InputField
                    className="form-fields__name-input"
                    name="fname"
                    label={config?.firstNameField?.label}
                    placeholder={config?.firstNameField?.placeholder}
                    value=""
                    validationRules={config?.firstNameField?.validationRules}
                    register={register}
                    errors={errors}
                    checkNameFormat
                    onChangeHandler={handleInputChange}
                  />
                  <div
                    className={
                      errors["mobileNumber"]
                        ? "vida-form-group form__group--error"
                        : "vida-form-group"
                    }
                  >
                    <label
                      className="form__field-label"
                      htmlFor={config?.phoneNumberField?.label}
                    >
                      {config?.phoneNumberField?.label}
                    </label>
                    <div className="form__field-mobile">
                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="number"
                        placeholder={config?.phoneNumberField.placeholder}
                        className="vida-form-field-input"
                        disabled={isLoggedIn}
                        onWheel={(e) => e.target.blur()}
                        min="0"
                        {...register("mobileNumber", {
                          required:
                            config?.phoneNumberField.validationRules &&
                            "required" in
                              config?.phoneNumberField.validationRules,
                          minLength:
                            config?.phoneNumberField.validationRules?.minLength
                              ?.value,
                          maxLength:
                            config?.phoneNumberField.validationRules?.maxLength
                              ?.value,
                          validate: (value) =>
                            value &&
                            phNumberStartsWith.includes(value.charAt(0))
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .trim()
                            .slice(
                              0,
                              config?.phoneNumberField.validationRules
                                ?.maxLength?.value
                            );
                        }}
                      />
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/edit_square.svg`}
                        alt="edit_icon"
                        className={`edit-icon ${
                          disableSendOTP ? "" : "show-icon"
                        }`}
                        onClick={changeNumberHandler}
                      />
                    </div>
                    {errors["mobileNumber"] &&
                      errors["mobileNumber"].type === "required" && (
                        <>
                          <p className="form__field-message">
                            {
                              config?.phoneNumberField.validationRules?.required
                                ?.message
                            }
                          </p>
                        </>
                      )}
                    {errors["mobileNumber"] &&
                      errors["mobileNumber"].type === "minLength" && (
                        <>
                          <p className="form__field-message">
                            {
                              config?.phoneNumberField.validationRules
                                ?.minLength?.message
                            }
                          </p>
                        </>
                      )}
                    {errors["mobileNumber"] &&
                      errors["mobileNumber"].type === "maxLength" && (
                        <>
                          <p className="form__field-message">
                            {
                              config?.phoneNumberField.validationRules
                                ?.maxLength?.message
                            }
                          </p>
                        </>
                      )}
                    {errors["mobileNumber"] &&
                      errors["mobileNumber"].type === "validate" && (
                        <>
                          <p className="form__field-message">
                            {
                              config?.phoneNumberField.validationRules
                                ?.customValidation?.message
                            }
                          </p>
                        </>
                      )}
                    {errors["mobileNumber"] &&
                      errors["mobileNumber"].type === "custom" && (
                        <>
                          <p className="form__field-message">
                            {errors["mobileNumber"] &&
                              errors["mobileNumber"].message}
                          </p>
                        </>
                      )}
                  </div>
                  <div className="vida-otp">
                    {showSendOTP && (
                      <div className="user-access-timer-container">
                        <a
                          href="#"
                          className={`send-otp-text ${
                            disableSendOTP ? "disabled" : ""
                          }`}
                          data-link-position={
                            config?.otpConfig?.dataPosition || "web-popup"
                          }
                          onClick={handleGenerateOTP}
                        >
                          {config?.otpConfig.sendOTPLabel}
                        </a>
                      </div>
                    )}
                    {showResendOTP && (
                      <div className="user-access-timer-container">
                        <a
                          href="#"
                          className="resend-text"
                          data-link-position={
                            config?.otpConfig?.dataPosition || "web-popup"
                          }
                          onClick={resendOtpHandler}
                        >
                          {config?.otpConfig.resendLabel}
                        </a>
                      </div>
                    )}
                    {showOTPTimer && (
                      <div className="vida-otp__timer">
                        <Timer timer={config?.otpConfig?.timer}></Timer>
                      </div>
                    )}
                  </div>

                  {showOTP && (
                    <div className="test-ride-otp-form-container">
                      <p className="otp-sub-title-text">
                        {config?.otpConfig?.otpResentText}
                      </p>
                      <WebPopupOTP
                        otpConfig={config?.otpConfig}
                        handleChangeOtpText={handleChangeOtpText}
                        resendOtpHandler={resendOtpHandler}
                        isResend={isResend}
                        isLogin={false}
                        showError={showOtpError}
                        altDataPosition="webpopup"
                        verifyOTPHandler={handleVerifyOTP}
                        isdisabled={disableOTPFields}
                      ></WebPopupOTP>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WebPopUpNew;

WebPopUpNew.propTypes = {
  config: PropTypes.object
};
