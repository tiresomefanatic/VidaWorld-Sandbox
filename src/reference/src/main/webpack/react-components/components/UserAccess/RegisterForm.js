import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setUserFormDataAction,
  setUserCheckAction,
  setUserFormDataActionDispatcher
} from "../../../react-components/store/userAccess/userAccessActions";
import { getProductBranchesData } from "../../services/productDetails/productDetailsService";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import InputField from "../form/InputField/InputField";
import Dropdown from "../form/Dropdown/Dropdown";
import PhoneNumber from "../form/PhoneNumber/PhoneNumber";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../site/scripts/constant";
import Location from "../../../site/scripts/location";

const RegisterForm = (props) => {
  const {
    cmpProps,
    registerConfig,
    setUserInfo,
    setUserCheckInfo,
    showRegisterError
  } = props;

  const {
    firstNameField,
    lastNameField,
    mobileField,
    emailField,
    stateField,
    cityField,
    agreeTerms,
    notificationField,
    disclaimer,
    generateOtpBtnLabel
  } = registerConfig;

  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateList"),
    ...stateField
  };

  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("citySearchList"),
    ...cityField
  };

  const [checked, setChecked] = useState(true);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const codeList = appUtils.getConfig("countryCodes");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [locationObj, setLocationObj] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: "",
    isDisabled: true
  });
  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: cmpProps.state || "",
    isDisabled: true
  });

  //Handle form submission
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

  const getStateList = async (countryId) => {
    /* Instantiate Location to render the Country, State and City */
    const obj = new Location();
    setLocationObj(obj);

    /* Fetch States based on Country ID */
    const stateList = await obj.getStates(countryId);
    const stateObj = stateList.find((o) => o.value === cmpProps.state);
    setStateFieldData({
      options: stateList
        ? [...stateFieldInfo.options, ...stateList]
        : [...stateFieldInfo.options],
      value: cmpProps.state || "",
      isDisabled: false
    });

    setCityFieldData({
      options: stateObj
        ? [...cityFieldInfo.options, ...stateObj.cities]
        : [...cityFieldInfo.options],
      value: cmpProps.city,
      isDisabled: !cmpProps.isEligibleForAddressUpdate
    });

    //setIsPincodeDisabled(!cmpProps.isEligibleForAddressUpdate);
    setSelectedCountry(countryId);
  };
  const getCityList = async () => {
    // const result = await getProductBranchesData();
    // setCityFieldData({
    //   ...cityFieldData,
    //   options: [
    //     ...cityFieldInfo.options,
    //     ...result.map((item) => {
    //       return {
    //         value: item.id,
    //         label: item.cityName
    //       };
    //     })
    //   ]
    // });
  };

  useEffect(() => {
    getCityList();
    if (showRegisterError) {
      setError("number", {
        type: "custom"
      });
      setError("email", {
        type: "custom",
        message: showRegisterError
      });
    }
  }, [showRegisterError]);

  useEffect(() => {
    //if (cmpProps.country) {
    getStateList("India");
    //}
  }, []);

  // To switch between tabs login and register
  const handleTabSwitch = (e) => {
    try {
      e.preventDefault();
      // Switch to Register Tab
      const loginTabId = 0;
      props.tabSwitchHandler && props.tabSwitchHandler(loginTabId);
      if (isAnalyticsEnabled) {
        const customLink = {
          name: e.target.innerText,
          position: "Bottom",
          type: "Link",
          clickType: "other"
        };
        analyticsUtils.trackLoginNow(customLink);
        analyticsUtils.trackLoginStart();
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  //to handle form data Submission
  const handleFormSubmit = (formData, event) => {
    try {
      if (checked) {
        const data = {
          countryCode: formData.code ? formData.code : defaultCountryCode,
          customer_city: formData.city || "",
          customer_state: formData.state || "",
          customer_country: "India",
          mobileNumber: formData.number,
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          whatsappConsent: formData.subscribe,
          isLogin: false
        };
        setUserFormDataActionDispatcher({
          countryCode: formData.code ? formData.code : defaultCountryCode,
          customer_city: formData.city ? formData.city : "",
          customer_state: formData.state ? formData.state : "",
          customer_country: "India" || ""
        });
        setUserInfo(data);
        setUserCheckInfo({
          isLogin: false
        });
        props.generateOTPHandler && props.generateOTPHandler(data, event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  //Toggle check box click
  const toggleTermsCheck = () => {
    setChecked(!checked);
    // isChecked !== null ? setChecked(isChecked) : setChecked(!checked);
    // if (isChecked === false || e.target.checked === false) {
    //   e.target.classList.add("checkbox__error");
    // } else {
    //   e.target.classList.remove("checkbox__error");
    // }
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const termsContent = document.getElementById(agreeTerms.id);
    setTermsContent(termsContent.innerHTML);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackTermsCondition(customLink);
    }
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setChecked(true);
    closeTermsPopup();
  };

  const customCheckBoxKeyPress = (event) => {
    const isEnter = event.which === 13;
    if (isEnter) {
      event.preventDefault();
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleOnSubscribeChange = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCustomValidation = async (fieldname, value) => {
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
    } else if (!CONSTANT.EMAIL_REGEX.test(value) && fieldname === "email") {
      setError("email", {
        type: "custom",
        message: emailField.validationRules.customValidation.message
      });
    } else if (fieldname === stateFieldInfo.name) {
      if (value) {
        const cities = await locationObj.getCities(selectedCountry, value);
        setCityFieldData({
          options: [...cityFieldInfo.options, ...cities],
          isDisabled: false
        });
        setValue(cityFieldInfo.name, "");
        setSelectedState(value);
      } else {
      }
    } else {
      clearErrors(fieldname);
    }
  };

  return (
    <>
      <div className="form vida-user-access__register">
        <form
          onSubmit={handleSubmit((formData, event) =>
            handleFormSubmit(formData, event)
          )}
        >
          <InputField
            name="fname"
            label={firstNameField.label}
            placeholder={firstNameField.placeholder}
            validationRules={firstNameField.validationRules}
            register={register}
            errors={errors}
            onChangeHandler={handleCustomValidation}
            value={cmpProps.fname || ""}
            checkNameFormat
            setValue={setValue}
          />

          <InputField
            name="lname"
            label={lastNameField.label}
            placeholder={lastNameField.placeholder}
            validationRules={lastNameField.validationRules}
            register={register}
            errors={errors}
            onChangeHandler={handleCustomValidation}
            value={cmpProps.lname || ""}
            checkNameFormat
            setValue={setValue}
          />

          <PhoneNumber
            label={mobileField.label}
            fieldNames={{
              inputFieldName: "number",
              selectFieldName: "code"
            }}
            placeholder={mobileField.placeholder}
            options={codeList}
            values={{
              code: "",
              number: ""
            }}
            validationRules={mobileField.validationRules}
            register={register}
            errors={errors}
            maxLength={mobileField.validationRules.maxLength.value}
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
            onChangeHandler={handleCustomValidation}
            value={cmpProps.email || ""}
            setValue={setValue}
          />
          <Dropdown
            name={stateFieldInfo.name}
            label={stateFieldInfo.label}
            iconClass={`icon-location-marker`}
            options={
              stateFieldData.options.length > 0
                ? stateFieldData.options
                : stateFieldInfo.options
            }
            value={stateFieldData.value}
            setValue={setValue}
            onChangeHandler={handleCustomValidation}
            errors={errors}
            validationRules={stateFieldInfo.validationRules}
            clearErrors={clearErrors}
            register={register}
            isDisabled={stateFieldData.isDisabled}
            isSortAsc={true}
          />
          <Dropdown
            name={cityFieldInfo.name}
            label={cityFieldInfo.label}
            iconClass={`icon-location-marker`}
            options={
              cityFieldData.options.length > 0
                ? cityFieldData.options
                : cityFieldInfo.options
            }
            value={cityFieldData.value}
            setValue={setValue}
            errors={errors}
            validationRules={cityFieldInfo.validationRules}
            clearErrors={clearErrors}
            register={register}
            isAutocomplete={true}
            isDisabled={cityFieldData.isDisabled}
            isSortAsc={true}
          />
          <div className="form__group form__field-checkbox vida-user-access__whatsapp-checkbox">
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
          <div className="vida-user-access__notification-msg">
            {notificationField.message}
          </div>

          <div
            className={`vida-user-access__terms ${
              !checked && "form__group--error"
            }`}
          >
            <div className="form__group form__field-checkbox">
              <label className="vida-user-access__label">
                {agreeTerms.agreeLabel}
                <input
                  type="checkbox"
                  name="agreeTerms"
                  htmlFor="terms"
                  checked={checked}
                  className={!checked ? "checkbox__error" : ""}
                  onChange={() => toggleTermsCheck()}
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
            {!checked && (
              <p className="form__field-message">
                {agreeTerms.validationRules.required.message}
              </p>
            )}
          </div>
          <div className="vida-user-access__btn-container">
            <button
              type="submit"
              className="btn btn--primary btn--full-width"
              onClick={handleSubmit}
            >
              {generateOtpBtnLabel}
            </button>
            <label className="vida-user-access__label">
              {disclaimer.existingAccLabel}
              <a href="" onClick={handleTabSwitch}>
                {disclaimer.loginLabel}
              </a>
            </label>
          </div>
        </form>
      </div>
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
      email: userAccessReducer.email
    }
  };
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

RegisterForm.propTypes = {
  registerConfig: PropTypes.shape({
    firstNameField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      minLength: PropTypes.number,
      minLengthError: PropTypes.string,
      validationRules: PropTypes.object
    }),
    lastNameField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    mobileField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    emailField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      infoLabel: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    cityField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    agreeTerms: PropTypes.any,
    notificationField: PropTypes.object,
    disclaimer: PropTypes.shape({
      existingAccLabel: PropTypes.string,
      loginLabel: PropTypes.string
    }),
    generateOtpBtnLabel: PropTypes.string
  }),
  cmpProps: PropTypes.object,
  tabSwitchHandler: PropTypes.func,
  generateOTPHandler: PropTypes.func,
  setUserInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  showRegisterError: PropTypes.string
};

RegisterForm.defaultProps = {
  registerConfig: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
