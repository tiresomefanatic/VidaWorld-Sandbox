import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import InputField from "../../form/InputField/InputField";
import Dropdown from "../../form/Dropdown/Dropdown";
import PhoneNumber from "../../form/PhoneNumber/PhoneNumber";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";

import CONSTANT from "../../../../site/scripts/constant";

const QuickReserveForm = (props) => {
  const {
    config,
    cityList,
    userData,
    defaultCityValue,
    handleCityDropdownChange,
    handleFormSubmit
  } = props;
  const isLoggedIn = loginUtils.isSessionActive();
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const codeList = appUtils.getConfig("countryCodes");
  const [agreeTermsSelected, setAgreeTermsSelected] = useState(false);
  const [showAgreeTermError, setShowAgreeTermError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const handleInputChange = (fieldname, value) => {
    if (value === "") {
      setError(fieldname, {
        type: "required"
      });
    } else if (
      value.length < config.firstNameField.validationRules.minLength.value &&
      fieldname === "fname"
    ) {
      setError("fname", {
        type: "custom",
        message: config.firstNameField.validationRules.minLength.message
      });
    } else if (
      !isLoggedIn &&
      !CONSTANT.EMAIL_REGEX.test(value) &&
      fieldname === "email"
    ) {
      setError("email", {
        type: "custom",
        message: config.emailField.validationRules.customValidation.message
      });
    } else {
      clearErrors(fieldname);
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
    const content = document.getElementById(config.agreeTerms.id);
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

  useEffect(() => {
    userData.fname && setValue("fname", userData.fname);
    userData.lname && setValue("lname", userData.lname);
    userData.email && setValue("email", userData.email);
    userData.number && setValue("phoneNumber", userData.number);
  }, [userData]);

  return (
    <div className="vida-quick-reserve-form">
      <div className="vida-quick-reserve-form__title">{config.title}</div>
      <form
        className="vida-quick-reserve-form__form"
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <Dropdown
          name="city"
          label={config.cityField.label}
          options={cityList}
          value={defaultCityValue}
          setValue={setValue}
          onChangeHandler={handleCityDropdownChange}
          errors={errors}
          validationRules={config.cityField.validationRules}
          clearErrors={clearErrors}
          register={register}
          isSortAsc={true}
        />

        <InputField
          name="fname"
          label={config.firstNameField.label}
          placeholder={config.firstNameField.placeholder}
          validationRules={config.firstNameField.validationRules}
          onChangeHandler={handleInputChange}
          register={register}
          errors={errors}
          checkNameFormat
          setValue={setValue}
        />

        <InputField
          name="lname"
          label={config.lastNameField.label}
          placeholder={config.lastNameField.placeholder}
          validationRules={config.lastNameField.validationRules}
          onChangeHandler={handleInputChange}
          register={register}
          errors={errors}
          checkNameFormat
          setValue={setValue}
        />

        <PhoneNumber
          label={config.mobileField.label}
          fieldNames={{
            inputFieldName: "phoneNumber",
            selectFieldName: "countryCode"
          }}
          placeholder={config.mobileField.placeholder}
          options={codeList}
          values={{
            code: defaultCountryCode || "",
            number: ""
          }}
          validationRules={config.mobileField.validationRules}
          register={register}
          errors={errors}
          maxLength={config.mobileField.validationRules.maxLength.value}
          isDisabled={isLoggedIn}
        />

        <InputField
          name="email"
          label={config.emailField.label}
          infoLabel={config.emailField.infoLabel}
          placeholder={config.emailField.placeholder}
          validationRules={config.emailField.validationRules}
          register={register}
          errors={errors}
          checkEmailFormat
          onChangeHandler={handleInputChange}
          value=""
          setValue={setValue}
          isDisabled={isLoggedIn}
        />

        <div className="form__group form__field-checkbox vida-quick-reserve-form__terms">
          <label className="vida-quick-reserve-form__label">
            {config.agreeTerms.agreeLabel}{" "}
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
            {config.agreeTerms.terms.label}
          </a>
        </div>
        {showAgreeTermError && (
          <div className={`${showAgreeTermError ? "form__group--error" : ""}`}>
            <p className="form__field-message">
              {config.agreeTerms.validationRules.required.message}
            </p>
          </div>
        )}

        <div className="vida-quick-reserve-form__action">
          <button
            type="submit"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {config.paymentBtn.label}
          </button>
        </div>
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
                {config.agreeTerms.btnLabel.agree}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {config.agreeTerms.btnLabel.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

QuickReserveForm.propTypes = {
  config: PropTypes.any,
  cityList: PropTypes.array,
  userData: PropTypes.object,
  defaultCityValue: PropTypes.string,
  handleCityDropdownChange: PropTypes.func,
  handleFormSubmit: PropTypes.func
};

export default QuickReserveForm;
