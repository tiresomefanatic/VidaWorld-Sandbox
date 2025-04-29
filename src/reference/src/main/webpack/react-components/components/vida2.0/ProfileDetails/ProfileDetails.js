import React, { useEffect, useState } from "react";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InputField from "../forms/InputField/InputField";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import { useForm } from "react-hook-form";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import {
  useUpdateProfile,
  useUserData
} from "../../../hooks/userProfile/userProfileHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logout from "../Logout/Logout";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import {
  updateNameToSendInApi,
  updateNameToDisplay
} from "../../../services/commonServices/commonServices";
import Dropdown from "../forms/Dropdown/Dropdown";
import Location from "../../../../site/scripts/location";

const ProfileDetails = (props) => {
  const {
    userProfileProps,
    firstNameField,
    lastNameField,
    emailField,
    phoneNumberField,
    pinCodeField,
    profilePicConfig,
    config,
    eligibleForAddressUpdate
  } = props;

  const {
    fname,
    lname,
    email,
    pincode,
    code,
    number,
    profile_pic,
    state,
    city,
    country,
    serviceablePincodesList
  } = userProfileProps;

  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateList"),
    ...config?.stateField
  };

  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("citySearchList"),
    ...config?.cityField
  };

  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const updateProfileData = useUpdateProfile();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  let fontSize = "48px";

  const inputValue = `${fname && fname} ${lname && lname}`;
  if (inputValue.length <= 16) {
    fontSize = isDesktop ? "48px" : "24px";
  } else if (inputValue.length <= 24) {
    fontSize = isDesktop ? "36px" : "20px";
  } else {
    fontSize = isDesktop ? "24px" : "16px";
  }

  const [inital, setInital] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isHover, setHover] = useState(false);
  const [fileName, setFileName] = useState();
  const [isEditImage, setIsEditImage] = useState(false);
  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: state || "",
    isDisabled: false
  });
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: city || "",
    isDisabled: false
  });
  const [selectedState, setSelectedState] = useState("");
  const [locationObj, setLocationObj] = useState(null);
  const [isPincodeDisabled, setIsPincodeDisabled] = useState(false);

  const getStateList = async (countryId) => {
    /* Instantiate Location to render the Country, State and City */
    const obj = new Location();
    setLocationObj(obj);

    /* Fetch States based on Country ID */
    const stateList = await obj.getStates(countryId);
    const stateObj = stateList.find((o) => o.value === state);
    setStateFieldData({
      options: stateList
        ? [...stateFieldInfo.options, ...stateList]
        : [...stateFieldInfo.options],
      value: state || "",
      isDisabled: false
    });

    setCityFieldData({
      options: stateObj
        ? [...cityFieldInfo.options, ...stateObj.cities]
        : [...cityFieldInfo.options],
      value: city,
      isDisabled: false
    });

    setIsPincodeDisabled(false);
  };

  const ctaTracking = () => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: "edit",
        ctaLocation: "profile"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const mouseEnterHandler = () => {
    setHover(true);
  };

  const mouseLeaveHandler = () => {
    setHover(false);
  };

  const imageClickHandler = () => {
    if (!isDesktop) {
      setHover(true);
    }
  };

  const handleFileName = (fileName) => {
    setFileName(fileName);
  };

  const setEditImage = () => {
    setIsEditImage(true);
    ctaTracking();
  };

  const getUserData = useUserData();

  const getInitials = (fname) => {
    setInital(fname.charAt(0));
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
    getInitials(fname);
  }, [fname]);

  useEffect(() => {
    if (country) {
      getStateList(country);
      handlePincodeList(country, state, city);
    }
  }, [country]);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const editUserData = () => {
    reset();
    setIsEdit(true);
  };

  const resetPincodeField = () => {
    setIsPincodeDisabled(true);
    setValue("pincode", "");
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
        resetPincodeField();
        if (id) {
          const cities = await locationObj.getCities(country, id);
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
        resetPincodeField();
        handlePincodeList(country, selectedState || state, id);
      }
    } else {
      name === country && getStateList(id);
    }
  };

  const handlePincodeInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleFormSubmit = async (formData, event) => {
    try {
      setSpinnerActionDispatcher(true);
      if (
        serviceablePincodesList &&
        serviceablePincodesList.allPincodes &&
        serviceablePincodesList.allPincodes.includes(
          parseInt(formData.pincode || pincode)
        )
      ) {
        const [firstName, lastName] = updateNameToSendInApi(
          formData?.fname ? formData?.fname : fname,
          formData?.fname ? "" : lname
        );

        const profileDataValues = {
          country_code: defaultCountryCode,
          mobile_number: formData?.phoneNumber
            ? RSAUtils.encrypt(formData.phoneNumber)
            : RSAUtils.encrypt(number),
          email: formData?.email
            ? RSAUtils.encrypt(formData.email)
            : RSAUtils.encrypt(email),
          firstname: firstName,
          lastname: lastName,
          customer_state: formData?.state || state || "",
          customer_city: formData?.city || city || "",
          customer_country: country,
          customer_pincode: formData?.pincode || pincode || ""
        };
        const updateResult = await updateProfileData({
          variables: profileDataValues
        });
        const location = {
          pincode: formData?.pincode || pincode || "",
          city: formData?.city || city || "",
          state: formData?.state || state || "",
          country: defaultCountry
        };
        setStateFieldData((prevState) => ({
          ...prevState, // Keep the rest of the state unchanged
          value: formData?.state // Update only the value property
        }));
        setCityFieldData((prevState) => ({
          ...prevState, // Keep the rest of the state unchanged
          value: formData?.city // Update only the value property
        }));
        if (updateResult?.data?.updateProfile) {
          getUserData();
          if (isAnalyticsEnabled) {
            analyticsUtils.trackUpdateProfile(location);
          }
          setIsEdit(false);
          setSpinnerActionDispatcher(false);
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

  return (
    <div className="user-profile-details">
      <div className="profile-details">
        <div className="profile-details-card">
          <form
            className="vida-profile-form"
            onSubmit={handleSubmit((formData, event) =>
              handleFormSubmit(formData, event)
            )}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <div className="user-name">
              {isEdit ? (
                <InputField
                  name="fname"
                  // label={firstNameField.label}
                  placeholder={firstNameField?.placeholder}
                  value={`${updateNameToDisplay(fname, lname)}`}
                  errors={errors}
                  validationRules={firstNameField?.validationRules}
                  register={register}
                  checkNameFormat
                />
              ) : (
                <>
                  <h2 style={{ fontSize: fontSize }}>
                    {updateNameToDisplay(fname, lname)}
                  </h2>
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/edit-icon.svg`}
                    onClick={() => {
                      editUserData();
                      ctaTracking();
                    }}
                    className="profile-edit-icon"
                  />
                </>
              )}
            </div>
            <div className="contact-details">
              <div className="user-profile__field">
                <div className="user-profile__label">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/phone.svg`}
                  />
                  <p>{`${code} ${number}`}</p>
                </div>
              </div>
              <div className="user-profile__field">
                {isEdit ? (
                  <InputField
                    name="email"
                    // label={emailField.label}
                    placeholder={emailField?.placeholder}
                    value={email}
                    validationRules={emailField?.validationRules}
                    register={register}
                    errors={errors}
                    checkEmailFormat
                    setValue={setValue}
                  />
                ) : (
                  <>
                    <div className="user-profile__label">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/email.svg`}
                      />
                      <p>{email}</p>
                    </div>
                  </>
                )}
              </div>

              {/* state starts here */}
              <div className="user-profile__field">
                {isEdit && eligibleForAddressUpdate ? (
                  <Dropdown
                    name={stateFieldInfo.name}
                    iconClass={`icon-location-marker`}
                    options={
                      stateFieldData.options.length > 0
                        ? stateFieldData.options
                        : stateFieldInfo.options
                    }
                    value={stateFieldData.value}
                    setValue={setValue}
                    onChangeHandler={handleDropdownChange}
                    errors={errors}
                    validationRules={stateFieldInfo.validationRules}
                    clearErrors={clearErrors}
                    register={register}
                    isDisabled={stateFieldData.isDisabled}
                    isSortAsc={true}
                  />
                ) : (
                  <>
                    <div className="user-profile__label">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/location.svg`}
                      />
                      <p>{state}</p>
                    </div>
                  </>
                )}
              </div>
              {/* state ends here */}

              {/* city starts here */}
              <div className="user-profile__field">
                {isEdit && eligibleForAddressUpdate ? (
                  <Dropdown
                    name={cityFieldInfo.name}
                    iconClass={`icon-location-marker`}
                    onChangeHandler={handleDropdownChange}
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
                    isDisabled={cityFieldData.isDisabled}
                    isSortAsc={true}
                  />
                ) : (
                  <>
                    <div className="user-profile__label">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/location.svg`}
                      />
                      <p>{city}</p>
                    </div>
                  </>
                )}
              </div>
              {/* city ends here */}

              <div className="user-profile__field">
                {isEdit && eligibleForAddressUpdate ? (
                  <InputField
                    name="pincode"
                    // label={pinCodeField.label}
                    placeholder={pinCodeField?.placeholder}
                    value={pincode || ""}
                    validationRules={pinCodeField?.validationRules}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    isDisabled={isPincodeDisabled}
                    onChangeHandler={(value) =>
                      handlePincodeInputFieldChange("pincode", value)
                    }
                  />
                ) : (
                  <>
                    <div className="user-profile__label">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/location.svg`}
                      />
                      <p>{pincode}</p>
                    </div>
                  </>
                )}
              </div>
              <div
                className={`user-profile-logout-link ${
                  isEdit ? "profile-edit-mode" : ""
                }`}
              >
                {isEdit && (
                  <>
                    <button type="submit" className="user-profile-save-btn">
                      {config?.saveBtn?.label}
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      className="user-profile-save-btn"
                    >
                      {config?.cancelBtn?.label}
                    </button>
                  </>
                )}
                {isDesktop && !isEdit && <Logout />}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        className="profile-image-wrapper"
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        onClick={imageClickHandler}
      >
        <div className="profile-image">
          {isHover && (
            <>
              <div className="edit-image-overlay">
                <label htmlFor="edit-profile" onClick={setEditImage}>
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/edit-icon.svg`}
                  />
                </label>
              </div>
            </>
          )}
          {profile_pic ? (
            <img src={profile_pic} alt="Profile Image" loading="lazy" />
          ) : (
            <div className="profile-image-inital"> {inital}</div>
          )}
        </div>
      </div>
      {isEditImage && (
        <ProfileImageUpload
          handleFileName={handleFileName}
          config={config}
          id="edit-profile"
          fileName={fileName}
        />
      )}
    </div>
  );
};
const mapStateToProps = ({
  userProfileDataReducer,
  userAccessReducer,
  testDriveReducer
}) => {
  return {
    userProfileProps: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      code: userProfileDataReducer.code,
      number: userProfileDataReducer.number,
      email: userProfileDataReducer.email,
      country: userProfileDataReducer.country,
      state: userProfileDataReducer.state,
      city: userProfileDataReducer.city,
      pincode: userProfileDataReducer.pincode,
      profile_pic: userProfileDataReducer.profile_pic,
      serviceablePincodesList: testDriveReducer.serviceablePincodesList,
      //   email_verified: userProfileDataReducer.email_verified,
      sfid: userAccessReducer.sfid,
      isLogin: userAccessReducer.isLogin
      //   customer_number: userProfileDataReducer.customer_number
    }
  };
};
ProfileDetails.propTypes = {
  config: PropTypes.object,
  userProfileProps: PropTypes.object,
  firstNameField: PropTypes.object,
  lastNameField: PropTypes.object,
  emailField: PropTypes.object,
  phoneNumberField: PropTypes.object,
  pinCodeField: PropTypes.object,
  profilePicConfig: PropTypes.object,
  eligibleForAddressUpdate: PropTypes.bool
};
export default connect(mapStateToProps)(ProfileDetails);
