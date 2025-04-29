import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { getUserCityDetails } from "../../../services/locationFinder/locationFinderService";
import { useForm } from "react-hook-form";
import InputField from "../forms/InputField/InputField";
import PhoneNumber from "../forms/PhoneNumber/PhoneNumber";
import NumberField from "../forms/NumberField/NumberField";
import CONSTANT from "../../../../site/scripts/constant";
import Logger from "../../../../services/logger.service";
import { postContactData } from "../../../services/contact/contactService";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";

const ChargingStationRequestForm = (props) => {
  const { config } = props;
  const [userCityName, setUserCityName] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const CustomTitleTag = config?.titleTag || "p";
  const CustomFormTitleTag = config?.formTitleTag || "p";

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [isDisabled, setDisabled] = useState(false);
  const [singleAnlyticsFlag, setSingleAnlytics] = useState(true);
  const codeList = appUtils.getConfig("countryCodes");
  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const getUserCityFromLocality = async (position) => {
    setSpinnerActionDispatcher(true);
    const getCityDetails = await getUserCityDetails(position);
    if (getCityDetails) {
      const getUserCityFromDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("locality")
        ).long_name;
      const getUserCityByLocation = getUserCityFromDetails.toUpperCase();
      setUserCityName(getUserCityByLocation);
      setValue("userCity", getUserCityByLocation);
      setSpinnerActionDispatcher(false);
    } else {
      setSpinnerActionDispatcher(false);
    }
  };
  const showError = () => {
    alert(config?.locationErrorMsg);
  };
  const showPosition = async (position) => {
    setSpinnerActionDispatcher(true);
    await getUserCityFromLocality(position);
    setSpinnerActionDispatcher(false);
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };

  const handleFormSubmit = async (formData) => {
    setSpinnerActionDispatcher(true);
    let lastName;
    const fullNameArr =
      formData?.fname?.trim().split(" ") || fname?.trim().split(" ");
    if (fullNameArr.length > 1) {
      lastName = fullNameArr.splice(-1).toString();
    } else {
      lastName = "-";
    }
    const firstName = fullNameArr.join(" ");
    setDisabled(true);
    try {
      console.log("leadCreationUrl", appUtils.getAPIUrl("leadCreationUrl"));
      const url = appUtils.getAPIUrl("leadCreationUrl");
      const result = await postContactData(url, {
        FirstName: firstName,
        LastName: lastName,
        MobilePhone: RSAUtils.encrypt(formData.number),
        dmpl__City__c: formData.userCity,
        postalCode: formData.pincode,
        LeadSource: "Website",
        SubSource__c: "Intrested_charging_infra"
      });
      if (result.success && result.success === true) {
        setDisabled(false);
        setErrorMsg("");
        setSuccessMsg(config?.formSuccessMsg);
        document.getElementById("charging-stations-request-form").reset();
        setSpinnerActionDispatcher(false);
        const journeyName = "Charging Request";
        const eventName = "chargingRequestFormSubmit";
        const customLink = {
          name: "Send",
          position: "Bottom",
          type: "Link",
          clickType: "other"
        };
        if (isAnalyticsEnabled) {
          analyticsUtils.trackContactus(journeyName, eventName, customLink);
        }
        if (isAnalyticsEnabled) {
          const customFormLink = {
            formName: config?.formTitle || "Request a Charging Station"
          };
          analyticsUtils.trackFormData("formSuccess", customFormLink);
        }
      } else {
        if (isAnalyticsEnabled) {
          const customFormLink = {
            formName: config?.formTitle || "Request a Charging Station",
            formError: result[0]?.message || ""
          };
          analyticsUtils.trackFormData("formError", customFormLink);
        }
        setDisabled(false);
        setSuccessMsg("");
        setErrorMsg(config?.formErrorMsg);
        setSpinnerActionDispatcher(false);
      }
    } catch (error) {
      setDisabled(false);
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  };

  const handlePincodeInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const ctaAnalytics = (formField) => {
    // is should run only once per render
    if (isAnalyticsEnabled && singleAnlyticsFlag) {
      const customFormLink = {
        formName: config?.formTitle || "Request a Charging Station",
        formField: formField || ""
      };
      analyticsUtils.trackFormData("formStart", customFormLink);
      setSingleAnlytics(false);
    }
  };

  const submitErrorHandler = (errors) => {
    if (isAnalyticsEnabled && errors) {
      const customFormLink = {
        formName: config?.formTitle || "Request a Charging Station",
        formErrorField: ""
      };

      const errorFields = Object.keys(errors)
        .map((key) => {
          switch (key) {
            case "fname":
              return (
                config?.nameField?.label ||
                config?.nameField?.placeholder ||
                "Enter name"
              );
            case "number":
              return (
                config?.phoneNumberField?.label ||
                config?.phoneNumberField?.placeholder ||
                "Enter mobile number"
              );
            case "pincode":
              return (
                config?.pincodeField?.label ||
                config?.pincodeField?.placeholder ||
                "Enter pincode"
              );
            case "userCity":
              return (
                config?.cityField?.label ||
                config?.cityField?.placeholder ||
                "Enter city"
              );
            default:
              return key;
          }
        })
        .join(" | ");
      customFormLink.formErrorField = errorFields;
      analyticsUtils.trackFormData("formError", customFormLink);
    }
  };

  return (
    <div className="charging-station-form-wrapper vida-2-container">
      <div className="charging-station-form-container">
        <div className="charging-station-form-title-container">
          <CustomTitleTag className="charging-station-form-title">
            {config?.title}
          </CustomTitleTag>
          <p className="charging-station-form-description">
            {config?.description}
          </p>
        </div>
        <div className="charging-station-form-content-container">
          <div className="charging-station-form-heading">
            <CustomFormTitleTag className="charging-station-form-heading-text">
              {config?.formTitle}
            </CustomFormTitleTag>
          </div>
          <div className="charging-station-form-main-container">
            <form
              id="charging-stations-request-form"
              className="charging-station-request-form"
              onSubmit={handleSubmit(
                (formData) => handleFormSubmit(formData),
                submitErrorHandler
              )}
            >
              <div className="charging-request-form-group">
                <InputField
                  name="fname"
                  label={config?.nameField?.label}
                  placeholder={config?.nameField?.placeholder}
                  inputFocusHandler={() =>
                    ctaAnalytics(
                      config?.nameField?.label || config?.nameField?.placeholder
                    )
                  }
                  validationRules={config?.nameField?.validationRules}
                  register={register}
                  errors={errors}
                  checkNameFormat
                  setValue={setValue}
                />
                <PhoneNumber
                  label={config?.phoneNumberField?.label}
                  fieldNames={{
                    inputFieldName: "number",
                    selectFieldName: "code"
                  }}
                  placeholder={config?.phoneNumberField?.placeholder}
                  options={codeList}
                  values={{
                    code: "",
                    number: ""
                  }}
                  validationRules={config?.phoneNumberField?.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={
                    config?.phoneNumberField?.validationRules?.maxLength?.value
                  }
                />
                <InputField
                  name="userCity"
                  label={config?.cityField?.label}
                  value={getValues("userCity") || ""}
                  placeholder={config?.cityField?.placeholder}
                  validationRules={config?.cityField?.validationRules}
                  register={register}
                  errors={errors}
                  checkNameFormat
                  setValue={setValue}
                />
                <NumberField
                  name="pincode"
                  label={config?.pincodeField?.label}
                  placeholder={config?.pincodeField?.placeholder}
                  validationRules={config?.pincodeField?.validationRules}
                  register={register}
                  errors={errors}
                  value={""}
                  maxLength={CONSTANT.RESTRICT_PINCODE}
                  isDisabled={false}
                  setValue={setValue}
                  onChangeHandler={(value) =>
                    handlePincodeInputFieldChange("pincode", value)
                  }
                />
                <div
                  className="current-location-wrapper"
                  onClick={handleGetUserLocation}
                >
                  <div className="current-location-flex-container">
                    <div className="location-icon">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/png/location_icon.png`}
                        alt="location_icon"
                      ></img>
                    </div>
                    <div className="current-location-text-wrapper">
                      <p className="current-location-text">
                        {config?.chooseYourLocationCta}
                      </p>
                    </div>
                  </div>
                  <div className="chevron-right-icon">
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/png/chevron_right_orange.png`}
                      alt="chevron_right"
                    ></img>
                  </div>
                </div>
                <p className="form-error-msg">{errorMsg}</p>
                <p className="form-success-msg">{successMsg}</p>
                <div className="send-request-btn-wrapper">
                  <button
                    type="submit"
                    className="send-request-btn"
                    disabled={isDisabled}
                  >
                    {config?.buttonLabel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingStationRequestForm;

ChargingStationRequestForm.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    titleTag: PropTypes.string,
    description: PropTypes.string,
    formTitle: PropTypes.string,
    formTitleTag: PropTypes.string,
    chooseYourLocationCta: PropTypes.string,
    locationErrorMsg: PropTypes.string,
    buttonLabel: PropTypes.string,
    formSuccessMsg: PropTypes.string,
    formErrorMsg: PropTypes.string,
    nameField: PropTypes.object,
    phoneNumberField: PropTypes.object,
    cityField: PropTypes.object,
    pincodeField: PropTypes.object
  })
};
