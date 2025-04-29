import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import InputField from "../forms/InputField/InputField";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Location from "../../../../site/scripts/location";
import {
  useUpdateProfile,
  useVerifyUpdateProfile
} from "../../../hooks/userProfile/userProfileHooks";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Dropdown from "../forms/Dropdown/Dropdown";
// import ProfileImage from "../ProfileImage/ProfileImage";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import NumberField from "../forms/NumberField/NumberField";
import CONSTANT from "../../../../site/scripts/constant";
// import Popup from "../Popup/Popup";
// import ProfileOtpForm from "../ProfileOtpForm/ProfileOtpForm";
import { setSFIDActionDispatcher } from "../../../store/userAccess/userAccessActions";
import { setUserProfileDataDispatcher } from "../../../store/userProfile/userProfileActions";
import { updateNameToSendInApi } from "../../../services/commonServices/commonServices";

const EditProfile = (props) => {
  const { config, cmpProps, setImageCropper, setFileName } = props;
  const {
    title,
    firstNameField,
    lastNameField,
    phoneNumberField,
    emailField,
    countryField,
    stateField,
    cityField,
    pinCodeField,
    cancelBtn,
    saveBtn,
    mobileOtpConfig,
    profilePicConfig,
    secondFormPrimaryText,
    registerFormNamePrefixText,
    registerFormNamePostText
  } = config;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [resetTimer, setResetTimer] = useState(false);
  const codeList = appUtils.getConfig("countryCodes");

  /* Defining Field IDs and default config for Country, State and City */
  const countryFieldInfo = {
    name: "country",
    options: appUtils.getConfig("countryList"),
    ...countryField
  };

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

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const updateProfileData = useUpdateProfile();
  const verifyUpdateProfileData = useVerifyUpdateProfile();

  const [profileData, setProfileData] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [locationObj, setLocationObj] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [pincodeValue, setPincodeValue] = useState(cmpProps.pincode);
  const [isPincodeDisabled, setIsPincodeDisabled] = useState(true);
  const [isVerifyMobileOTP, showVerifyMobileOTP] = useState(false);
  const [countryFieldData] = useState({
    options: countryFieldInfo.options,
    value: cmpProps.country?.toUpperCase() || ""
  });

  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: cmpProps.state || "",
    isDisabled: true
  });

  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: cmpProps.city || "",
    isDisabled: true
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
      isDisabled: !cmpProps.isEligibleForAddressUpdate
    });

    setCityFieldData({
      options: stateObj
        ? [...cityFieldInfo.options, ...stateObj.cities]
        : [...cityFieldInfo.options],
      value: cmpProps.city,
      isDisabled: !cmpProps.isEligibleForAddressUpdate
    });

    setIsPincodeDisabled(!cmpProps.isEligibleForAddressUpdate);
    setSelectedCountry(countryId);
  };

  const resetStateField = () => {
    setStateFieldData({
      options: stateFieldInfo.options,
      value: "",
      isDisabled: true
    });
    setValue(stateFieldInfo.name, "");
  };

  const resetCityField = () => {
    setCityFieldData({
      options: cityFieldInfo.options,
      value: "",
      isDisabled: true
    });
    setValue(cityFieldInfo.name, "");
  };

  const resetPincodeField = () => {
    setIsPincodeDisabled(true);
    setPincodeValue("");
    setValue("pincode", "");
  };

  const handlePincodeList = (country, state, city) => {
    const locationObj = new Location();
    const selectedLocationData = {
      country: country,
      state: state,
      city: city
    };
    try {
      setIsPincodeDisabled(false);
      locationObj.getServiceablePincodesList(selectedLocationData);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    if (cmpProps.city) {
      handlePincodeList(cmpProps.country, cmpProps.state, cmpProps.city);
      setSelectedCountry(cmpProps.country);
      setSelectedState(cmpProps.state);
      setValue("pincode", cmpProps.pincode, { shouldValidate: true });
    }
  }, []);

  const handleDropdownChange = async (name, id) => {
    if (locationObj) {
      if (name === countryFieldInfo.name) {
        if (id) {
          const stateObj = await locationObj.getStates(id);
          setStateFieldData({
            options: [...stateFieldInfo.options, ...stateObj],
            isDisabled: false
          });
          setValue(stateFieldInfo.name, "");
        } else {
          resetStateField();
        }
        resetCityField();
        resetPincodeField();
      } else if (name === stateFieldInfo.name) {
        resetCityField();
        resetPincodeField();
        if (id) {
          const cities = await locationObj.getCities(
            countryFieldData.value,
            id
          );
          setCityFieldData({
            options: [...cityFieldInfo.options, ...cities],
            isDisabled: false
          });
          setValue(cityFieldInfo.name, "");
          setSelectedState(id);
        } else {
          resetCityField();
          resetPincodeField();
        }
      } else if (name === cityFieldInfo.name) {
        handlePincodeList(selectedCountry, selectedState, id);
      }
    } else {
      name === countryFieldInfo.name && getStateList(id);
    }
  };

  const handleSetFileName = (fileName) => {
    setFileName && setFileName(fileName);
  };
  const handleImageCropper = (toggleView) => {
    setImageCropper && setImageCropper(toggleView);
  };

  const handleFormSubmit = async (formData) => {
    const [firstName, lastName] = updateNameToSendInApi(
      cmpProps.fname,
      cmpProps.lname
    );
    try {
      setSpinnerActionDispatcher(true);
      const { serviceablePincodesList } = cmpProps;
      if (
        serviceablePincodesList &&
        serviceablePincodesList.allPincodes &&
        serviceablePincodesList.allPincodes.includes(parseInt(formData.pincode))
      ) {
        const profileDataValues = {
          country_code: formData.code ? formData.code : "+91",
          mobile_number: RSAUtils.encrypt(cmpProps.number),
          email: RSAUtils.encrypt(cmpProps.email),
          firstname: firstName,
          lastname: lastName,
          customer_state: formData.state,
          customer_city: formData.city,
          customer_country: formData.country,
          customer_pincode: formData.pincode
        };
        setMobileNumber(cmpProps.number);

        const updateResult = await updateProfileData({
          variables: profileDataValues
        });
        setSpinnerActionDispatcher(false);
        if (
          updateResult &&
          updateResult.data &&
          updateResult.data.updateProfile
        ) {
          if (!updateResult.data.updateProfile.SF_ID) {
            props.onFormCancel && props.onFormCancel(false);

            if (isAnalyticsEnabled) {
              const location = {
                pincode: formData.pincode,
                city: formData.city,
                state: formData.state,
                country: formData.country
              };
              analyticsUtils.trackUpdateProfile(location);
            }
          } else {
            setSFIDActionDispatcher({
              SFID: updateResult.data.updateProfile.SF_ID
            });
            showVerifyMobileOTP(true);
          }
        }
        if (
          updateResult &&
          updateResult?.data &&
          updateResult?.data?.updateProfile
        ) {
          props.secondFormSubmitHandler &&
            props.secondFormSubmitHandler(profileDataValues);
        } else {
          setError("email", {
            type: "custom",
            message: updateResult?.errors?.message
          });
        }
      } else {
        setSpinnerActionDispatcher(false);
        setError("pincode", {
          type: "custom",
          message: pinCodeField.validationRules.custom.noCityMatchMsg
        });
      }
    } catch (error) {
      setSpinnerActionDispatcher(false);
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    if (cmpProps.country) {
      getStateList(cmpProps.country);
    }
  }, []);

  const handleCloseOtpForm = () => {
    showVerifyMobileOTP(false);
  };

  const handleVerifyOTP = async (event, otp) => {
    try {
      setSpinnerActionDispatcher(true);
      const sendOTPResult = await verifyUpdateProfileData({
        variables: {
          SF_ID: cmpProps.sfid,
          otp: RSAUtils.encrypt(otp),
          ...profileData
        }
      });
      setSpinnerActionDispatcher(false);

      if (
        sendOTPResult &&
        sendOTPResult.data &&
        sendOTPResult.data.updateProfile &&
        sendOTPResult.data.updateProfile.status_code === 200
      ) {
        showVerifyMobileOTP(false);
        setUserProfileDataDispatcher(profileData);
        props.onFormCancel && props.onFormCancel(false);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setSpinnerActionDispatcher(true);
    const updateResult = await updateProfileData({
      variables: profileData
    });
    setSpinnerActionDispatcher(false);
    if (
      updateResult &&
      updateResult.data &&
      updateResult.data.updateProfile &&
      updateResult.data.updateProfile.status_code === 200
    ) {
      setResetTimer(!resetTimer);
    }
  };

  const handlePincodeInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  return (
    <>
      <div className="vida-edit-container">
        <div className="vida-edit">
          {/* <ProfileImage
            setImageCropperHandler={handleImageCropper}
            setFileNameHandler={handleSetFileName}
            profilePicture={cmpProps.profile_pic}
            profilePicConfig={profilePicConfig}
          /> */}

          <div className="user-access-login-primary-text">
            <p>{secondFormPrimaryText}</p>
          </div>
          <div className="user-access-login-bold-text">
            <p>
              {registerFormNamePrefixText} {cmpProps.fname}
              {registerFormNamePostText}
            </p>
          </div>

          <form
            className="form vida-profile"
            onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
          >
            {/* <InputField
              name="fname"
              label={firstNameField.label}
              placeholder={firstNameField.placeholder}
              value={cmpProps.fname || ""}
              autoFocus
              validationRules={firstNameField.validationRules}
              register={register}
              errors={errors}
              checkNameFormat
              setValue={setValue}
            /> */}

            {/* <InputField
              name="lname"
              label={lastNameField.label}
              placeholder={lastNameField.placeholder}
              value={cmpProps.lname || ""}
              validationRules={lastNameField.validationRules}
              register={register}
              errors={errors}
              checkNameFormat
              setValue={setValue}
            /> */}

            {/* <PhoneNumber
              label={phoneNumberField.label}
              fieldNames={{
                inputFieldName: "number",
                selectFieldName: "code"
              }}
              placeholder={phoneNumberField.placeholder}
              options={codeList}
              values={{
                code: cmpProps.code || "",
                number: cmpProps.number || ""
              }}
              register={register}
              errors={errors}
              validationRules={phoneNumberField.validationRules}
              maxLength={phoneNumberField.validationRules.maxLength.value}
            /> */}

            {/* <InputField
              name="email"
              // label={emailField.label}
              infoLabel={emailField.infoLabel}
              placeholder={emailField.placeholder}
              value={""}
              validationRules={emailField.validationRules}
              register={register}
              errors={errors}
              checkEmailFormat
              setValue={setValue}
            /> */}

            <Dropdown
              name={countryFieldInfo.name}
              // label={countryFieldInfo.label}
              iconClass={`icon-location-marker`}
              options={
                countryFieldData.options.length > 0
                  ? countryFieldData.options
                  : countryFieldInfo.options
              }
              value={""}
              setValue={setValue}
              onChangeHandler={handleDropdownChange}
              errors={errors}
              validationRules={countryFieldInfo.validationRules}
              clearErrors={clearErrors}
              register={register}
              // isDisabled={!cmpProps.isEligibleForAddressUpdate}
              isSortAsc={true}
            />

            <Dropdown
              name={stateFieldInfo.name}
              // label={stateFieldInfo.label}
              iconClass={`icon-location-marker`}
              options={
                stateFieldData.options.length > 0
                  ? stateFieldData.options
                  : stateFieldInfo.options
              }
              value={""}
              setValue={setValue}
              onChangeHandler={handleDropdownChange}
              errors={errors}
              validationRules={stateFieldInfo.validationRules}
              clearErrors={clearErrors}
              register={register}
              // isDisabled={stateFieldData.isDisabled}
              isSortAsc={true}
            />

            <Dropdown
              name={cityFieldInfo.name}
              // label={cityFieldInfo.label}
              iconClass={`icon-location-marker`}
              onChangeHandler={handleDropdownChange}
              options={
                cityFieldData.options.length > 0
                  ? cityFieldData.options
                  : cityFieldInfo.options
              }
              value={""}
              setValue={setValue}
              errors={errors}
              validationRules={cityFieldInfo.validationRules}
              clearErrors={clearErrors}
              register={register}
              isDisabled={cityFieldData.isDisabled}
              isSortAsc={true}
            />
            <NumberField
              name="pincode"
              // label={pinCodeField.label}
              placeholder={pinCodeField.placeholder}
              validationRules={pinCodeField.validationRules}
              register={register}
              errors={errors}
              value={""}
              maxLength={CONSTANT.RESTRICT_PINCODE}
              isDisabled={isPincodeDisabled}
              setValue={setValue}
              onChangeHandler={(value) =>
                handlePincodeInputFieldChange("pincode", value)
              }
            />

            {/* {mobileOtpConfig.notificationLabel && (
              <div className="vida-edit-profile__warning">
                <section className="notification notification--info">
                  <div className="notification__container">
                    <div className="notification__title">
                      <span className="notification__icon">
                        <i className="icon-information-circle"></i>
                      </span>
                      <label className="notification__label">
                        {mobileOtpConfig.notificationLabel}
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            )} */}

            <div className="vida-edit-profile__btn-wrapper vida-access-login-btn-container">
              <button
                className="btn btn--primary vida-access-login-btn"
                onClick={handleSubmit}
              >
                {saveBtn.label}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* {isVerifyMobileOTP && (
        <div className="vida-user-profile__otp-popup">
          <Popup handlePopupClose={handleCloseOtpForm}>
            <div className="vida-user-access__otp-container">
              <ProfileOtpForm
                mobileOtpConfig={mobileOtpConfig}
                mobileNumber={mobileNumber}
                resetTimer={resetTimer}
                verifyOTPHandler={handleVerifyOTP}
                changeNumberHandler={handleCloseOtpForm}
                resendOTPhandler={handleResendOtp}
              ></ProfileOtpForm>
            </div>
          </Popup>
        </div>
      )} */}
    </>
  );
};

const mapStateToProps = ({
  userProfileDataReducer,
  testDriveReducer,
  userAccessReducer
}) => {
  return {
    cmpProps: {
      fname: userAccessReducer.fname,
      lname: userAccessReducer.lname,
      code: userProfileDataReducer.code,
      number: userAccessReducer.mobileNumber,
      email: userAccessReducer.email,
      country: userProfileDataReducer.country,
      state: userProfileDataReducer.state,
      city: userProfileDataReducer.city,
      pincode: userProfileDataReducer.pincode,
      isEligibleForAddressUpdate:
        userProfileDataReducer.isEligibleForAddressUpdate,
      //TODO : Change naming pincode list name (Eg: serviceablePincodesList to allpincodelist)
      serviceablePincodesList: testDriveReducer.serviceablePincodesList,
      profile_pic: userProfileDataReducer.profile_pic,
      sfid: userAccessReducer.sfid
    }
  };
};

EditProfile.propTypes = {
  onFormCancel: PropTypes.func,
  config: PropTypes.shape({
    title: PropTypes.string,
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
    cityField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    countryField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    cancelBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    saveBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    mobileOtpConfig: PropTypes.object,
    profilePicConfig: PropTypes.object,
    secondFormPrimaryText: PropTypes.string,
    registerFormNamePrefixText: PropTypes.string,
    registerFormNamePostText: PropTypes.string
  }),
  cmpProps: PropTypes.object,
  setImageCropper: PropTypes.func,
  setFileName: PropTypes.func,
  secondFormSubmitHandler: PropTypes.func
};

EditProfile.defaultProps = {
  config: {},
  cmpProps: {}
};

export default connect(mapStateToProps)(EditProfile);
