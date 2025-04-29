import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setUserFormDataAction,
  setUserCheckAction
} from "../../../../react-components/store/userAccess/userAccessActions";
import { useForm } from "react-hook-form";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import CONSTANT from "../../../../site/scripts/constant";

const LoginForm = (props) => {
  const { loginConfig, setUserInfo, setUserCheckInfo, showLoginError } = props;
  const {
    phoneNumberField,
    disclaimer,
    generateOtpBtnLabel,
    loginFormPrimaryText,
    loginFormBoldText,
    loginFormPrivacyPolicy
  } = loginConfig;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const codeList = appUtils.getConfig("countryCodes");
  const [singleAnlyticsFlag, setSingleAnlytics] = useState(true);
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onSubmit"
  });
  const currentUrl = new URL(window.location.href);
  const redirectionUrl = currentUrl?.search?.split("?redirectURL=")[1];

  useEffect(() => {
    if (showLoginError) {
      setError("numberOrEmail", {
        type: "custom",
        message: showLoginError
      });
    }
  }, [showLoginError]);

  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");

  const validateInput = (name, value) => {
    const hasCustomValidation =
      phoneNumberField?.validationRules?.custom?.message;
    const hasMinLengthValidation =
      phoneNumberField?.validationRules?.minLength?.message;
    const hasMaxLengthValidation =
      phoneNumberField?.validationRules?.maxLength?.message;

    setValue("numberOrEmail", value);

    if (value.length === 0) {
      setError("numberOrEmail", {
        type: "custom",
        message: phoneNumberField?.validationRules?.required?.message
      });
      return false;
    }
    if (CONSTANT.NUMBER_REGEX.test(value)) {
      if (
        hasCustomValidation &&
        !phNumberStartsWith.includes(value.charAt(0))
      ) {
        setError("numberOrEmail", {
          type: "custom",
          message: phoneNumberField?.validationRules?.custom?.message
        });
        return false;
      }
      if (hasMinLengthValidation && value.length < 10) {
        setError("numberOrEmail", {
          type: "custom",
          message: phoneNumberField.validationRules?.minLength?.message
        });
        return false;
      }
      if (hasMaxLengthValidation && value.length > 10) {
        setError("numberOrEmail", {
          type: "custom",
          message: phoneNumberField.validationRules?.maxLength?.message
        });
        return false;
      }
    } else if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("numberOrEmail", {
        type: "custom",
        message: phoneNumberField.validationRules?.custom?.message
      });
      return false;
    }
    clearErrors("numberOrEmail");
    return true;
  };

  const handleFormSubmit = (formData, event, generateOtpBtnLabel) => {
    try {
      if (!validateInput("numberOrEmail", formData.numberOrEmail.trim())) {
        return;
      }
      const data = {
        countryCode: formData.code ? formData.code : defaultCountryCode,
        numberOrEmail: formData.numberOrEmail,
        isLogin: true
      };
      setUserInfo(data);
      setUserCheckInfo({
        isLogin: true
      });

      props.generateOTPHandler &&
        props.generateOTPHandler(data, event, generateOtpBtnLabel);
    } catch (error) {
      Logger.error(error);
    }
  };

  const ctaAnalytics = () => {
    // is should run only once per render
    if (singleAnlyticsFlag) {
      analyticsUtils.trackLoginStart();
      setSingleAnlytics(false);
    }
  };

  return (
    <form
      className="form vida-user-access__login"
      onSubmit={handleSubmit((formData, event) =>
        handleFormSubmit(formData, event, generateOtpBtnLabel)
      )}
    >
      <div className="user-access-login-primary-text">
        <p>{loginFormPrimaryText}</p>
      </div>
      <div className="user-access-login-bold-text">
        <p>{loginFormBoldText}</p>
      </div>
      {/* <InputField
              name="numberOrEmail"
              placeholder={phoneNumberField.placeholder}
              value=""
              autoFocus
              register={register}
              errors={errors}
              onChangeHandler={validateInput}
            /> */}
      <PhoneNumber
        fieldNames={{
          inputFieldName: "numberOrEmail",
          selectFieldName: "code"
        }}
        placeholder={phoneNumberField.placeholder}
        inputFocusHandler={ctaAnalytics}
        options={codeList}
        values={{
          code: "",
          number: ""
        }}
        validationRules={phoneNumberField.validationRules}
        register={register}
        errors={errors}
        maxLength={phoneNumberField.validationRules?.maxLength?.value}
      />
      <div className="user-access-login-privacy-policy">
        <p>{loginFormPrivacyPolicy}</p>
      </div>
      <div className="vida-user-access__btn-container vida-access-login-btn-container">
        {redirectionUrl && redirectionUrl !== "" && (
          <a
            className="vida-access-signup-btn"
            href={`${appUtils.getPageUrl(
              "signUpUrl"
            )}?redirectURL=${redirectionUrl}`}
          >
            Sign Up
          </a>
        )}
        <button
          type="submit"
          className="btn btn--primary btn--full-width vida-access-login-btn"
        >
          {generateOtpBtnLabel}
        </button>
        {/* <label className="vida-user-access__label">
          {disclaimer.accountLabel}
          <a href="" onClick={handleTabSwitch}>
            {disclaimer.registerNowLabel}
          </a>
        </label> */}
      </div>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => {
      dispatch(setUserFormDataAction(data));
    },
    setUserCheckInfo: (data) => {
      dispatch(setUserCheckAction(data));
    }
  };
};

LoginForm.propTypes = {
  loginConfig: PropTypes.shape({
    phoneNumberField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    disclaimer: PropTypes.shape({
      accountLabel: PropTypes.string,
      registerNowLabel: PropTypes.string
    }),
    generateOtpBtnLabel: PropTypes.string,
    loginFormPrimaryText: PropTypes.string,
    loginFormBoldText: PropTypes.string,
    loginFormPrivacyPolicy: PropTypes.string
  }),
  generateOTPHandler: PropTypes.func,
  setUserInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  showLoginError: PropTypes.string
};

LoginForm.defaultProps = {
  config: {}
};

export default connect(null, mapDispatchToProps)(LoginForm);
