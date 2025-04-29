import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PhoneNumber from "../../forms/PhoneNumber/PhoneNumber";
import InputField from "../../forms/InputField/InputField";
import Dropdown from "../../forms/Dropdown/Dropdown";
import PropTypes from "prop-types";
import Logger from "../../../../../services/logger.service";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { connect } from "react-redux";
import CONSTANT from "../../../../../site/scripts/constant";
import { getProductBranchesData } from "../../../../services/productDetails/productDetailsService";
import { setUserFormDataActionDispatcher } from "../../../../store/userAccess/userAccessActions";
import Location from "../../../../../site/scripts/location";

const BookingLogin = (props) => {
  const codeList = appUtils.getConfig("countryCodes");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");

  const {
    cmpProps,
    loginConfig,
    genericConfig,
    generateOTPHandler,
    userData,
    showRegisterFields,
    source,
    showSteps,
    changeNumberHandler
  } = props;

  const {
    phoneNumberEmailField,
    mobileField,
    continueBtn,
    disclaimer,
    title,
    firstNameField,
    lastNameField,
    emailField,
    stateField,
    cityField,
    notificationBanner,
    // promotionBanner,
    changeNumberLabel,
    message
  } = loginConfig;

  const [locationObj, setLocationObj] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

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
  const { numberOrEmail, countryCode } = userData;
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: "",
    isDisabled: false
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: "",
    isDisabled: true
  });

  const getStateList = async (countryId) => {
    /* Instantiate Location to render the Country, State and City */
    const obj = new Location();
    setLocationObj(obj);

    /* Fetch States based on Country ID */
    const stateList = await obj.getStates(countryId);
    const stateObj = stateList.find((o) => o.value === "");
    setStateFieldData({
      options: stateList
        ? [...stateFieldInfo.options, ...stateList]
        : [...stateFieldInfo.options],
      value: "",
      isDisabled: false
    });

    setCityFieldData({
      options: stateObj
        ? [...cityFieldInfo.options, ...stateObj.cities]
        : [...cityFieldInfo.options],
      value: "",
      isDisabled: true
    });

    //setIsPincodeDisabled(!cmpProps.isEligibleForAddressUpdate);
    setSelectedCountry(countryId);
  };

  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");
  const getCityList = async () => {
    const result = await getProductBranchesData();
    setCityFieldData({
      ...cityFieldData,
      options: [
        ...cityFieldInfo.options,
        ...result.map((item) => {
          return {
            value: item.id,
            label: item.cityName
          };
        })
      ]
    });
  };

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

  const handleFormSubmit = (formData) => {
    try {
      if (!validateInput("numberOrEmail", formData.numberOrEmail.trim())) {
        return;
      }
      const username = formData.fname ? formData.fname.split(" ") : "";
      const firstName = username[0];
      const lastName = username.splice(1).join(" ");

      const data = {
        countryCode: formData.code || defaultCountryCode,
        customerCity: formData.city?.split("~")[0] || "",
        customer_state: formData.state || "",
        customer_country: formData.city?.split("~")[2] || "",
        numberOrEmail: formData.numberOrEmail || "",
        mobileNumber: formData.number,
        fname: firstName || "",
        lname: formData.lname ? formData.lname : lastName,
        email: formData.email || "",
        source: source || "prebooking",
        isForcedLogIn: showRegisterFields ? true : false,
        subscribe: formData.subscribe
      };
      setUserFormDataActionDispatcher({
        countryCode: formData.code ? formData.code : defaultCountryCode,
        customer_city: formData.city ? formData.city?.split("~")[0] : "",
        customer_state: formData.city ? formData.city?.split("~")[1] : "",
        customer_country: formData.city ? formData.city?.split("~")[2] : ""
      });
      generateOTPHandler && generateOTPHandler(data);
    } catch (error) {
      Logger.error(error);
    }
  };

  const onChangeNumber = (e) => {
    e.preventDefault();
    changeNumberHandler && changeNumberHandler();
    reset({ inputFieldName: "" });
  };
  const handleCustomValidation = async (fieldname, value) => {
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
  };

  useEffect(() => {
    getCityList();
    getStateList("India");
  }, []);

  return (
    <div className="vida-booking-login">
      <div className="vida-booking-login__container">
        <div className="vida-booking-login__step">
          {genericConfig.stepLabel}
          <span>{showSteps}</span>
          <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
        </div>
        <div>
          <h1 className="vida-booking-login__title">{title}</h1>
          {!showRegisterFields && (
            <h4 className="vida-booking-login__message">{message}</h4>
          )}
        </div>
        <div className="form__group">
          <form
            onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
          >
            <div className="vida-booking-login__phone">
              {!showRegisterFields ? (
                <InputField
                  name="numberOrEmail"
                  label={phoneNumberEmailField.label}
                  placeholder={phoneNumberEmailField.placeholder}
                  value=""
                  register={register}
                  errors={errors}
                  onChangeHandler={validateInput}
                />
              ) : (
                <div className="vida-booking-login__change-number">
                  <p>
                    <span>
                      {CONSTANT.NUMBER_REGEX.test(numberOrEmail.trim()) &&
                        countryCode + ` `}
                      {numberOrEmail}
                    </span>
                  </p>
                  <a
                    href=""
                    onClick={(e) => {
                      onChangeNumber(e);
                    }}
                  >
                    {changeNumberLabel}
                  </a>
                </div>
              )}
            </div>
            {showRegisterFields && (
              <>
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
                    number:
                      (CONSTANT.NUMBER_REGEX.test(numberOrEmail) &&
                        numberOrEmail) ||
                      ""
                  }}
                  validationRules={mobileField.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={mobileField.validationRules.maxLength.value}
                />
                <InputField
                  name="fname"
                  label={firstNameField.label}
                  placeholder={firstNameField.placeholder}
                  validationRules={firstNameField.validationRules}
                  register={register}
                  errors={errors}
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
                  checkNameFormat
                  setValue={setValue}
                />
                <InputField
                  name="email"
                  label={emailField.label}
                  infoLabel={emailField.infoLabel}
                  placeholder={emailField.placeholder}
                  value={
                    (!CONSTANT.NUMBER_REGEX.test(numberOrEmail) &&
                      numberOrEmail) ||
                    ""
                  }
                  validationRules={emailField.validationRules}
                  register={register}
                  errors={errors}
                  checkEmailFormat
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
              </>
            )}
            <div className="vida-booking-login__notification-banner">
              <p className="vida-booking-login__whatsapp-title">
                {notificationBanner.label}
                <i className="icon-whatsapp vida-booking-login__whatsapp-icon"></i>
              </p>
              <p className="vida-booking-login__whatsapp-content">
                {notificationBanner.info}
              </p>
              <div className="form__group form__field-checkbox vida-booking-login__confirmation">
                <label className="form__field-label">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: notificationBanner.confirmField.label
                    }}
                  ></span>
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("subscribe")}
                  ></input>
                  <span className="form__field-checkbox-mark"></span>
                </label>
              </div>
            </div>

            <div className="vida-booking-login__disclaimer">
              <p
                dangerouslySetInnerHTML={{
                  __html: disclaimer
                }}
              ></p>
            </div>

            <div className="vida-booking-login__btn-container">
              <button type="submit" className="btn btn--primary btn--lg">
                {continueBtn.label}
              </button>
            </div>
          </form>
          {/* <div className="vida-booking-login__promo-banner">
            <div className="vida-booking-login__scooter-icon">
              <i className="icon-scooter"></i>
            </div>
            <label>{promotionBanner}</label>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userAccessReducer, preBookingReducer }) => {
  return {
    userData: {
      countryCode: userAccessReducer.countryCode,
      numberOrEmail: userAccessReducer.numberOrEmail,
      mobileNumber: userAccessReducer.mobileNumber
    },
    source: preBookingReducer.source
  };
};

BookingLogin.propTypes = {
  loginConfig: PropTypes.shape({
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
    phoneNumberEmailField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    mobileField: PropTypes.shape({
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
    continueBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notificationBanner: PropTypes.shape({
      label: PropTypes.string,
      info: PropTypes.string,
      confirmField: PropTypes.shape({
        label: PropTypes.string
      })
    }),
    message: PropTypes.string,
    disclaimer: PropTypes.string,
    title: PropTypes.string,
    // promotionBanner: PropTypes.string,
    changeNumberLabel: PropTypes.string
  }),
  genericConfig: PropTypes.shape({
    stepLabel: PropTypes.string
  }),
  generateOTPHandler: PropTypes.func,
  userData: PropTypes.object,
  showRegisterFields: PropTypes.bool,
  source: PropTypes.string,
  showSteps: PropTypes.number,
  changeNumberHandler: PropTypes.func,
  cmpProps: PropTypes.object
};

BookingLogin.defaultProps = {};
export default connect(mapStateToProps)(BookingLogin);
