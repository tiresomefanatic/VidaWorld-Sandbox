import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputField from "../../form/InputField/InputField";
import PhoneNumber from "../../form/PhoneNumber/PhoneNumber";
import { useForm } from "react-hook-form";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import Logger from "../../../../services/logger.service";
import Logout from "../../Logout/Logout";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Location from "../../../../site/scripts/location";
import {
  setTestDriveDataDispatcher,
  setTestDriveTypeUnavailableDispatcher,
  setLongTermSelectedCityIdDispatcher
} from "../../../store/testDrive/testDriveActions";
import { setUserFormDataActionDispatcher } from "../../../store/userAccess/userAccessActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import Dropdown from "../../form/Dropdown/Dropdown";
import CONSTANT from "../../../../site/scripts/constant";

const BookingForm = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const { userDetails, showNameAndEmailFields, submitBookingFormData } = props;
  const {
    bookingTitle,
    welcomeTitle,
    confirmText,
    changeLocationLabel,
    disclaimer,
    switchAccount,
    cityField,
    stateField,
    country,
    firstNameField,
    lastNameField,
    phoneNumberField,
    phoneNumberEmailField,
    emailField,
    notificationField,
    serviceErrorMsg,
    nextBtn,
    getNotifiedBtn
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
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [isLocationServiceable, setIsLocationServiceable] = useState(true);
  const [hasRequestedNotification, setHasRequestedNotification] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [locationObj, setLocationObj] = useState(null);
  const [shortTermServicableLocations, setshortTermServicableLocations] =
    useState([]);
  const [longTermServicableLocations, setLongTermServicableLocations] =
    useState([]);

  const codeList = appUtils.getConfig("countryCodes");
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const [isUserStateCity, setUserStateCity] = useState(false);

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

  const [stateFieldData, setStateFieldData] = useState({
    options: stateFieldInfo.options,
    value: "",
    isDisabled: false
  });

  const [cityFieldData, setCityFieldData] = useState({
    options: cityFieldInfo.options,
    value: "",
    isDisabled: true
  });

  const getStateList = async () => {
    const obj = new Location();
    setLocationObj(obj);

    /* Fetch States based on Country name */
    const stateList = await obj.getStates(country);

    setStateFieldData({
      options: stateList
        ? [...stateFieldInfo.options, ...stateList]
        : [...stateFieldInfo.options],
      value: "",
      isDisabled: false
    });

    /* Fetch Serviceable locations list */
    const shortTermlocations = await obj.getShortTermServiceableLocations(
      country
    );
    setshortTermServicableLocations(shortTermlocations);
    const longTermlocations = await obj.getLongTermServiceableLocations(
      country
    );
    setLongTermServicableLocations(longTermlocations);
  };

  const resetCityField = () => {
    setCityFieldData({
      options: cityFieldInfo.options,
      value: "",
      isDisabled: true
    });
    setValue(cityFieldInfo.name, "");
  };

  const handleDropdownChange = async (name, id) => {
    if (locationObj) {
      if (name === stateFieldInfo.name) {
        resetCityField();
        if (id) {
          const cities = await locationObj.getCities(country, id);
          setCityFieldData({
            options: [...cityFieldInfo.options, ...cities],
            value: "",
            isDisabled: false
          });
          setValue(cityFieldInfo.name, "");
        } else {
          resetCityField();
        }
      }
    }
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

  const checkLocationServiceability = (selectedLocation) => {
    const availableShortTermState = shortTermServicableLocations.find(
      (location) => {
        return location.state === selectedLocation.state;
      }
    );
    const availableLongTermState = longTermServicableLocations.find(
      (location) => {
        return location.state === selectedLocation.state;
      }
    );
    if (!availableShortTermState && !availableLongTermState) {
      return false;
    } else {
      const isShortTermServiceAvailable =
        availableShortTermState &&
        availableShortTermState.cities.includes(selectedLocation.city);
      const isLongTermServiceAvailable =
        availableLongTermState &&
        availableLongTermState.cities.filter(
          (city) => city.name === selectedLocation.city
        ).length !== 0;

      isLongTermServiceAvailable &&
        setLongTermSelectedCityIdDispatcher({
          cityId: availableLongTermState.cities.find(
            (city) => city.name === selectedLocation.city
          ).id
        });

      !isShortTermServiceAvailable &&
        setTestDriveTypeUnavailableDispatcher({
          serviceUnavailableFor: CONSTANT.TEST_RIDE_OPTIONS.SHORT_TERM
        });
      !isLongTermServiceAvailable &&
        setTestDriveTypeUnavailableDispatcher({
          serviceUnavailableFor: CONSTANT.TEST_RIDE_OPTIONS.LONG_TERM
        });

      return isShortTermServiceAvailable || isLongTermServiceAvailable;
    }
  };

  const handleLocationServiceError = (servicable) => {
    if (!servicable) {
      setIsLocationServiceable(false);
      setError("city", { type: "focus" });
      setError("state", { type: "focus" });
      setStateFieldData({
        ...stateFieldData,
        isDisabled: true
      });
      setCityFieldData({
        ...cityFieldData,
        isDisabled: true
      });
      setHasRequestedNotification(true);
    } else {
      setHasRequestedNotification(false);
      setIsLocationServiceable(true);
      setStateFieldData({
        ...stateFieldData,
        isDisabled: false
      });
      setCityFieldData({
        ...cityFieldData,
        isDisabled: false
      });
      clearErrors("city");
      clearErrors("state");
    }
  };

  const handleChangeLocation = (e) => {
    e.preventDefault();
    handleLocationServiceError(true);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Middle",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Location Selection";
      const additionalJourneyName = "Booking";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName
      );
    }
  };

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
    } else if (!CONSTANT.EMAIL_REGEX.test(value) && fieldname === "email") {
      setError("email", {
        type: "custom",
        message: emailField.validationRules.customValidation.message
      });
    } else {
      clearErrors(fieldname);
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

  const handleFormSubmit = async (formData, event) => {
    try {
      if (
        !isLoggedIn &&
        !validateInput("numberOrEmail", formData.numberOrEmail.trim())
      ) {
        return;
      }
      const selectedLocation = {
        country: country,
        state: formData.state,
        city: formData.city
      };
      setTestDriveDataDispatcher({
        location: {
          country: country || "",
          state: formData.state,
          city: formData.city
        },
        subscribe: formData.subscribe
      });
      !isLoggedIn &&
        setUserFormDataActionDispatcher({
          countryCode: formData.countryCode || defaultCountryCode,
          numberOrEmail: formData.numberOrEmail || "",
          mobileNumber: formData.phoneNumber || "",
          fname: formData.fname || "",
          lname: formData.lname || "",
          email: formData.email || ""
        });
      checkLocationServiceability(selectedLocation)
        ? submitBookingFormData && submitBookingFormData(formData)
        : hasRequestedNotification &&
          !checkLocationServiceability(selectedLocation)
        ? submitBookingFormData && submitBookingFormData(formData, true)
        : handleLocationServiceError(false);

      const customLink = {
        name: event.nativeEvent.submitter.innerText,
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const location = {
        state: formData.state,
        city: formData.city,
        pinCode: "",
        country: ""
      };
      const productDetails = {
        modelVariant: "",
        modalColor: "",
        productID: ""
      };
      const bookingDetails = {
        testDriveReceiveNotificationStatus: isSubscribed ? "Yes" : "No"
      };
      const additionalPageName = `:${
        isLoggedIn
          ? "Testdrive type"
          : formData.fname
          ? "Personal Information"
          : "Location Selection"
      }`;
      const additionalJourneyName = "Booking";
      if (
        !showNameAndEmailFields &&
        checkLocationServiceability(selectedLocation)
      ) {
        if (isAnalyticsEnabled) {
          analyticsUtils.trackNotificationCBClick(
            customLink,
            location,
            productDetails,
            bookingDetails,
            additionalPageName,
            additionalJourneyName
          );
        }
      } else if (
        showNameAndEmailFields &&
        checkLocationServiceability(selectedLocation)
      ) {
        if (isAnalyticsEnabled) {
          const customLink = {
            name: "Next",
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const ctaPageName = ":Personal Information";
          analyticsUtils.trackCtaClick(
            customLink,
            ctaPageName,
            additionalJourneyName
          );
        }
      } else if (
        hasRequestedNotification &&
        !checkLocationServiceability(selectedLocation)
      ) {
        if (isAnalyticsEnabled) {
          const customLink = {
            name: "Get Notified",
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          analyticsUtils.trackCtaClick(
            customLink,
            additionalPageName,
            additionalJourneyName
          );
        }
      } else if (!checkLocationServiceability(selectedLocation)) {
        const error = {
          errorType: "Validation Error",
          errorDescription: serviceErrorMsg.message
        };
        analyticsUtils.trackServiceNotAvailable(
          customLink,
          location,
          error,
          additionalPageName,
          additionalJourneyName
        );
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    if (country) {
      getStateList();
    }
  }, []);

  useEffect(() => {
    if (
      userDetails.state &&
      userDetails.city &&
      stateFieldData.options.length > 1 &&
      isLocationServiceable
    ) {
      const stateValue = stateFieldData.options.filter(
        (option) =>
          option.value.toLowerCase() === userDetails.state.toLowerCase()
      )[0];
      setValue(stateFieldInfo.name, (stateValue && stateValue.value) || "");

      setUserStateCity(true);
      handleDropdownChange(
        stateFieldInfo.name,
        (stateValue && stateValue.value) || ""
      );
    }
  }, [userDetails, stateFieldData]);

  useEffect(() => {
    if (
      userDetails.state &&
      userDetails.city &&
      cityFieldData.options.length > 1 &&
      isUserStateCity
    ) {
      const cityValue = cityFieldData.options.filter(
        (option) =>
          option.value.toLowerCase() === userDetails.city.toLowerCase()
      )[0];
      setValue(cityFieldInfo.name, (cityValue && cityValue.value) || "");
      setUserStateCity(false);
    }
  }, [cityFieldData, isUserStateCity]);

  return (
    <>
      <h1 className="vida-booking-form__title">
        {isLoggedIn ? welcomeTitle + "," : bookingTitle}
        {isLoggedIn && (
          <p>
            {userDetails.firstname} {userDetails.lastname}
          </p>
        )}
      </h1>
      {isLoggedIn && (
        <p className="form__field-label vida-booking-form__confirm">
          {confirmText}
        </p>
      )}
      <form
        className="form vida-booking-form"
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <div className="vida-booking-form__location">
          <Dropdown
            name={stateFieldInfo.name}
            label={stateFieldInfo.label}
            value={getValues(stateFieldInfo.name) || ""}
            options={
              stateFieldData.options.length > 0
                ? stateFieldData.options
                : stateFieldInfo.options
            }
            setValue={setValue}
            onChangeHandler={handleDropdownChange}
            errors={errors}
            validationRules={stateFieldInfo.validationRules}
            clearErrors={clearErrors}
            register={register}
            isDisabled={stateFieldData.isDisabled}
            searchable
            isSortAsc={true}
          />
          <Dropdown
            name={cityFieldInfo.name}
            label={cityFieldInfo.label}
            options={
              cityFieldData.options.length > 0
                ? cityFieldData.options
                : cityFieldInfo.options
            }
            value={getValues(cityFieldInfo.name) || ""}
            setValue={setValue}
            onChangeHandler={handleDropdownChange}
            errors={errors}
            validationRules={cityFieldInfo.validationRules}
            clearErrors={clearErrors}
            register={register}
            isDisabled={cityFieldData.isDisabled}
            isSortAsc={true}
          />
        </div>
        {!isLocationServiceable && (
          <p className="vida-booking-form__service-err-msg">
            {serviceErrorMsg.message}
            <a
              href="#"
              className="vida-booking-form__change-number"
              onClick={(e) => handleChangeLocation(e)}
            >
              {changeLocationLabel}
            </a>
          </p>
        )}

        {!isLoggedIn && !showNameAndEmailFields && (
          <InputField
            name="numberOrEmail"
            label={phoneNumberEmailField.label}
            placeholder={phoneNumberEmailField.placeholder}
            value=""
            // validationRules={phoneNumberEmailField.validationRules}
            register={register}
            errors={errors}
            onChangeHandler={validateInput}
          />
        )}
        {!isLoggedIn && showNameAndEmailFields && (
          <>
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
                number:
                  (CONSTANT.NUMBER_REGEX.test(userDetails.numberOrEmail) &&
                    userDetails.numberOrEmail) ||
                  ""
              }}
              validationRules={phoneNumberField.validationRules}
              register={register}
              errors={errors}
              maxLength={phoneNumberField.validationRules.maxLength.value}
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
              value={
                (!CONSTANT.NUMBER_REGEX.test(userDetails.numberOrEmail) &&
                  userDetails.numberOrEmail) ||
                ""
              }
              validationRules={emailField.validationRules}
              onChangeHandler={handleInputChange}
              register={register}
              errors={errors}
              setValue={setValue}
            />
          </>
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
        <div className="vida-booking-form__notification-msg">
          {notificationField.message}
        </div>

        {isLoggedIn && (
          <div className="vida-booking-form__disclaimer">
            <span className="vida-booking-form__disclaimer-label">
              {disclaimer.label}
            </span>
            <span className="vida-booking-form__disclaimer-msg">
              {disclaimer.message}
            </span>
          </div>
        )}
        {!isLocationServiceable && (
          <p className="vida-booking-form__service-err-info">
            {serviceErrorMsg.info}
          </p>
        )}
        {isLocationServiceable && (
          <button
            className={
              isLoggedIn
                ? "btn btn--primary btn--lg btn--no-top-margin"
                : "btn btn--primary btn--lg"
            }
            type="submit"
          >
            {nextBtn.label}
          </button>
        )}
        {!isLocationServiceable && (
          <button className="btn btn--primary btn--lg">
            {getNotifiedBtn.label}
            <i className="icon-bell"></i>
          </button>
        )}
        {isLoggedIn && (
          <p className="form__field-label vida-booking-form__relogin">
            {switchAccount.message}
            <Logout label={switchAccount.redirectionLabel} />
          </p>
        )}
      </form>
    </>
  );
};

BookingForm.propTypes = {
  submitBookingFormData: PropTypes.func,
  showNameAndEmailFields: PropTypes.bool,
  resetMobileNumberField: PropTypes.bool,
  userDetails: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    numberOrEmail: PropTypes.string,
    customerExists: PropTypes.bool
  }),
  config: PropTypes.shape({
    bookingTitle: PropTypes.string,
    welcomeTitle: PropTypes.string,
    confirmText: PropTypes.string,
    changeLocationLabel: PropTypes.string,
    disclaimer: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
    switchAccount: PropTypes.shape({
      message: PropTypes.string,
      redirectionLabel: PropTypes.string
    }),
    cityField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    country: PropTypes.string,
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
    phoneNumberEmailField: PropTypes.shape({
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
    serviceErrorMsg: PropTypes.shape({
      message: PropTypes.string,
      info: PropTypes.string
    }),
    nextBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    getNotifiedBtn: PropTypes.shape({
      label: PropTypes.string
    })
  })
};

BookingForm.defaultProps = {
  config: {},
  userDetails: {}
};

export default BookingForm;
