import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setUserFormDataAction,
  setUserCheckAction,
  setUserFormDataActionDispatcher
} from "../../../../react-components/store/userAccess/userAccessActions";
import { useForm } from "react-hook-form";
import appUtils from "../../../../site/scripts/utils/appUtils";
import InputField from "../forms/InputField/InputField";
// import Dropdown from "../forms/Dropdown/Dropdown";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../../site/scripts/constant";
import Location from "../../../../site/scripts/location";
import {
  // updateNameToSendInApi,
  updateNameToDisplay
} from "../../../services/commonServices/commonServices";

const RegisterForm = (props) => {
  const {
    cmpProps,
    registerConfig,
    setUserInfo,
    setUserCheckInfo,
    showRegisterError,
    isRequired,
    guestuserName,
    showQuickPurchaseTab,
    isBooking,
    scooterInfo
  } = props;
  const {
    firstNameField,
    // lastNameField,
    mobileField,
    emailField,
    stateField,
    cityField,
    agreeTerms,
    notificationField,
    disclaimer,
    generateOtpBtnLabel,
    registerFormPrimaryText,
    registerFormBoldText
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
  const [singleAnlyticsFlag, setSingleAnlytics] = useState(true);
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
  const [singlePIIEvent, setSinglePIIEvent] = useState(true);

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

  useEffect(() => {
    console.log("...Logs for reference", registerConfig);
  }, [showQuickPurchaseTab]);

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
        type: "custom",
        message: showRegisterError
      });
      // setError("email", {
      //   type: "custom",
      //   message: showRegisterError
      // });
    }
  }, [showRegisterError]);

  useEffect(() => {
    //if (cmpProps.country) {
    getStateList("India");
    // if (isPrebookingStart) {
    //   analyticsUtils.trackPreBookingStart();
    // }
    //}
  }, []);
  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");

  const validateInput = (name, value) => {
    const hasCustomValidation =
      mobileField.validationRules?.custom &&
      mobileField.validationRules?.custom?.message;
    const hasMinLengthValidation =
      mobileField.validationRules?.minLength &&
      mobileField.validationRules?.minLength?.message;
    const hasMaxLengthValidation =
      mobileField.validationRules?.maxLength &&
      mobileField.validationRules?.maxLength?.message;

    setValue("number", value);

    if (value.length === 0) {
      setError("number", {
        type: "custom",
        message: mobileField.validationRules?.required?.message
      });
      return false;
    }
    if (CONSTANT.NUMBER_REGEX.test(value)) {
      if (
        hasCustomValidation &&
        !phNumberStartsWith.includes(value.charAt(0))
      ) {
        setError("number", {
          type: "custom",
          message: mobileField.validationRules?.custom?.message
        });
        return false;
      }
      if (hasMinLengthValidation && value.length < 10) {
        setError("number", {
          type: "custom",
          message: mobileField.validationRules?.minLength?.message
        });
        return false;
      }
      if (hasMaxLengthValidation && value.length > 10) {
        setError("number", {
          type: "custom",
          message: mobileField.validationRules?.maxLength?.message
        });
        return false;
      }
    } else if (hasCustomValidation && !CONSTANT.EMAIL_REGEX.test(value)) {
      setError("number", {
        type: "custom",
        message: mobileField.validationRules?.custom?.message
      });
      return false;
    }
    clearErrors("number");
    return true;
  };

  //to handle form data Submission
  const handleFormSubmit = (formData, event) => {
    try {
      if (!validateInput("number", formData.number.trim())) {
        return;
      }
      //I will remove the commented code once tested in stage
      // const [firstName, lastName] = updateNameToSendInApi(
      //   formData?.fname ? formData?.fname : "",
      //   formData?.lname ? formData?.lname : ""
      // );
      const username = formData.fname ? formData.fname.split(" ") : "";
      const firstName = username[0];
      const lastName = username.splice(1).join(" ");
      if (checked) {
        const data = {
          countryCode: formData.code ? formData.code : defaultCountryCode,
          customer_city: formData?.city || "",
          customer_state: formData?.state || "",
          customer_country: "India",
          mobileNumber: formData?.number,
          fname: firstName,
          lname: lastName,
          email: formData.email,
          whatsappConsent: formData?.subscribe,
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
        props.generateOTPHandler &&
          props.generateOTPHandler(data, event, generateOtpBtnLabel);
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
      value.length < firstNameField.validationRules?.minLength?.value &&
      fieldname === "fname"
    ) {
      setError("fname", {
        type: "custom",
        message: firstNameField.validationRules?.minLength?.message
      });
    } else if (fieldname === "fname" && !CONSTANT.NAME_REGEX.test(value)) {
      setError("fname", {
        type: "custom",
        message: firstNameField?.validationRules?.fullName?.message
      });
    } else if (!CONSTANT.EMAIL_REGEX.test(value) && fieldname === "email") {
      setError("email", {
        type: "custom",
        message: emailField.validationRules?.customValidation?.message
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

  const ctaAnalytics = () => {
    // is should run only once per render
    if (isRequired && singleAnlyticsFlag) {
      analyticsUtils.trackSignupStart();
      setSingleAnlytics(false);
    } else if (isBooking && singlePIIEvent) {
      setSinglePIIEvent(false);
      const formDetails = {
        formType: "Buy"
      };
      let productDetails;
      if (scooterInfo?.modelVariant) {
        productDetails = {
          modelVariant: scooterInfo?.modelVariant,
          modelColor: scooterInfo?.modelColor,
          productID: scooterInfo?.productID
        };
      }
      analyticsUtils.trackBuyPIIFormStart(
        formDetails,
        productDetails ? productDetails : {}
      );
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
          <div className="user-access-login-primary-text">
            <p>{registerFormPrimaryText}</p>
          </div>
          <div className="user-access-login-bold-text">
            <p>{registerFormBoldText}</p>
          </div>

          {firstNameField && (
            <InputField
              name="fname"
              // label={firstNameField.label}
              placeholder={firstNameField.placeholder}
              inputFocusHandler={ctaAnalytics}
              validationRules={firstNameField.validationRules}
              register={register}
              errors={errors}
              onChangeHandler={handleCustomValidation}
              value={
                updateNameToDisplay(cmpProps.fname, cmpProps.lname) ||
                guestuserName ||
                ""
              }
              checkNameFormat
              setValue={setValue}
            />
          )}

          <InputField
            name="email"
            // label={emailField.label}
            // infoLabel={emailField.infoLabel}
            placeholder={emailField.placeholder}
            value={cmpProps.email || ""}
            validationRules={emailField.validationRules}
            register={register}
            errors={errors}
            checkEmailFormat
            setValue={setValue}
          />

          <PhoneNumber
            // label={mobileField.label}
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
            maxLength={mobileField.validationRules?.maxLength?.value}
          />

          <div className="vida-user-access__btn-container vida-access-login-btn-container">
            <button
              type="submit"
              className="btn btn--primary btn--full-width vida-access-login-btn"
              onClick={handleSubmit}
            >
              {generateOtpBtnLabel}
            </button>
            {/* <label className="vida-user-access__label">
              {disclaimer.existingAccLabel}
              <a href="" onClick={handleTabSwitch}>
                {disclaimer.loginLabel}
              </a>
            </label> */}
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
                {agreeTerms.btnLabel?.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ userAccessReducer, scooterInfoReducer }) => {
  return {
    cmpProps: {
      isLogin: userAccessReducer.isLogin,
      fname: userAccessReducer.fname,
      lname: userAccessReducer.lname,
      email: userAccessReducer.email
    },
    scooterInfo: {
      modelVariant: scooterInfoReducer?.name || "",
      modelColor: scooterInfoReducer?.selectedVariant?.product?.name || "",
      productID: scooterInfoReducer?.sf_id || ""
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
    generateOtpBtnLabel: PropTypes.string,
    registerFormPrimaryText: PropTypes.string,
    registerFormBoldText: PropTypes.string
  }),
  cmpProps: PropTypes.object,
  tabSwitchHandler: PropTypes.func,
  generateOTPHandler: PropTypes.func,
  setUserInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  showRegisterError: PropTypes.string,
  isRequired: PropTypes.bool,
  guestuserName: PropTypes.string,
  showQuickPurchaseTab: PropTypes.bool,
  isBooking: PropTypes.bool,
  scooterInfo: PropTypes.object
};

RegisterForm.defaultProps = {
  registerConfig: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
