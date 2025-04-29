import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setUserFormDataAction,
  setUserCheckAction
} from "../../../react-components/store/userAccess/userAccessActions";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import InputField from "../form/InputField/InputField";
import CONSTANT from "../../../site/scripts/constant";

const LoginForm = (props) => {
  const { loginConfig, setUserInfo, setUserCheckInfo, showLoginError } = props;
  const { phoneNumberEmailField, disclaimer, generateOtpBtnLabel } =
    loginConfig;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
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

  useEffect(() => {
    if (showLoginError) {
      setError("numberOrEmail", {
        type: "custom",
        message: showLoginError
      });
    }
  }, [showLoginError]);

  const handleTabSwitch = (e) => {
    try {
      e.preventDefault();
      // Switch to Register Tab
      const registerTabId = 1;
      props.tabSwitchHandler && props.tabSwitchHandler(registerTabId);
      if (isAnalyticsEnabled) {
        const customLink = {
          name: e.target.innerText,
          position: "Bottom",
          type: "Link",
          clickType: "other"
        };
        analyticsUtils.trackRegisterNow(customLink);
        analyticsUtils.trackSignupStart();
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");

  const validateInput = (name, value) => {
    const hasCustomValidation =
      phoneNumberEmailField.validationRules.custom &&
      phoneNumberEmailField.validationRules.custom.message;
    const hasMinLengthValidation =
      phoneNumberEmailField.validationRules.minLength &&
      phoneNumberEmailField.validationRules.minLength.message;
    const hasMaxLengthValidation =
      phoneNumberEmailField.validationRules.maxLength &&
      phoneNumberEmailField.validationRules.maxLength.message;

    setValue("numberOrEmail", value);

    if (value.length === 0) {
      setError("numberOrEmail", {
        type: "custom",
        message: phoneNumberEmailField.validationRules.required.message
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
          message: phoneNumberEmailField.validationRules.custom.message
        });
        return false;
      }
      if (hasMinLengthValidation && value.length < 10) {
        setError("numberOrEmail", {
          type: "custom",
          message: phoneNumberEmailField.validationRules.minLength.message
        });
        return false;
      }
      if (hasMaxLengthValidation && value.length > 10) {
        setError("numberOrEmail", {
          type: "custom",
          message: phoneNumberEmailField.validationRules.maxLength.message
        });
        return false;
      }
    } else if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("numberOrEmail", {
        type: "custom",
        message: phoneNumberEmailField.validationRules.custom.message
      });
      return false;
    }
    clearErrors("numberOrEmail");
    return true;
  };

  const handleFormSubmit = (formData, event) => {
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

      props.generateOTPHandler && props.generateOTPHandler(data, event);
    } catch (error) {
      Logger.error(error);
    }
  };

  return (
    <form
      className="form vida-user-access__login"
      onSubmit={handleSubmit((formData, event) =>
        handleFormSubmit(formData, event)
      )}
    >
      <div className="form__group">
        <div className="form__field">
          <div className="form__group">
            <InputField
              name="numberOrEmail"
              label={phoneNumberEmailField.label}
              placeholder={phoneNumberEmailField.placeholder}
              value=""
              autoFocus
              register={register}
              errors={errors}
              onChangeHandler={validateInput}
            />
          </div>
        </div>
      </div>
      <div className="vida-user-access__btn-container">
        <button type="submit" className="btn btn--primary btn--full-width">
          {generateOtpBtnLabel}
        </button>
        <label className="vida-user-access__label">
          {disclaimer.accountLabel}
          <a href="" onClick={handleTabSwitch}>
            {disclaimer.registerNowLabel}
          </a>
        </label>
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
    phoneNumberEmailField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    disclaimer: PropTypes.shape({
      accountLabel: PropTypes.string,
      registerNowLabel: PropTypes.string
    }),
    generateOtpBtnLabel: PropTypes.string
  }),
  tabSwitchHandler: PropTypes.func,
  generateOTPHandler: PropTypes.func,
  setUserInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  showLoginError: PropTypes.string
};

LoginForm.defaultProps = {
  config: {}
};

export default connect(null, mapDispatchToProps)(LoginForm);
