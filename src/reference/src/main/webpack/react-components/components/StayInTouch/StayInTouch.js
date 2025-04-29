import React, { useState } from "react";
import PhoneNumber from "../form/PhoneNumber/PhoneNumber";
import InputField from "../form/InputField/InputField";
import NumberField from "../form/NumberField/NumberField";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import { postContactData } from "../../services/contact/contactService";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { RSAUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../site/scripts/constant";

const StayInTouch = (props) => {
  const [showCongratsPage, setShowCongratsPage] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { config } = props;
  const {
    mobileField,
    title,
    message,
    successTitle,
    successMessage,
    firstNameField,
    lastNameField,
    submitBtn,
    emailField,
    socialLinks,
    productImage,
    errorMessage,
    pinCodeField
  } = config;
  const codeList = appUtils.getConfig("countryCodes");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleSocialEvent = (event) => {
    if (isAnalyticsEnabled) {
      event.preventDefault();
      const customLink = {
        name: event.target.parentElement.dataset.socialIcon,
        position: "Bottom",
        type: "Link",
        clickType: "exit"
      };

      analyticsUtils.trackSocialIcons(customLink, function () {
        window.open(
          event.target.parentElement.href,
          event.target.parentElement.getAttribute("target")
        );
      });
    } else {
      window.open(
        event.target.parentElement.href,
        event.target.parentElement.getAttribute("target")
      );
    }
  };

  const handleFormSubmit = async (formData) => {
    setDisabled(true);
    try {
      const url = appUtils.getAPIUrl("getInTouchUrl");
      const contactData = {
        Email: RSAUtils.encrypt(formData.email),
        MobilePhone: RSAUtils.encrypt(formData.number),
        FirstName: formData.fname,
        LastName: formData.lname,
        dmpl__PostalCode__c: formData.pincode
      };
      const result = await postContactData(url, contactData);
      if (result.success && result.success === true) {
        setDisabled(false);
        setShowCongratsPage(true);
        const journeyName = "Stay Connected With US";
        const eventName = "stayConnectedFormSubmit";
        const customLink = {
          name: "Submit",
          position: "Bottom",
          type: "Link",
          clickType: "other"
        };
        if (isAnalyticsEnabled) {
          analyticsUtils.trackContactus(journeyName, eventName, customLink);
        }
      } else {
        setDisabled(false);
        setError("number", {
          type: "custom"
        });
        setError("email", {
          type: "custom",
          message: errorMessage
        });
      }
    } catch (error) {
      setDisabled(false);
      Logger.error(error);
    }
  };

  return (
    <div className="vida-home-contact vida-container">
      <div
        className={`
      ${
        showCongratsPage
          ? "vida-home-contact__congrats-social-links"
          : "vida-home-contact__social-links"
      }`}
      >
        <div>
          {showCongratsPage ? (
            <>
              <h1 className="vida-home-contact__congrats-title">
                {successTitle}
              </h1>
              <h3 className="vida-home-contact__congrats-msg">
                {successMessage}
              </h3>
            </>
          ) : (
            <>
              <h2 className="vida-home-contact__title">{title}</h2>
              <h4 className="vida-home-contact__msg">{message}</h4>
            </>
          )}
          <div className="vida-home-contact__contact-social">
            {socialLinks.map((val) => (
              <a
                className="vida-home-contact__links"
                href={val.actionUrl}
                key={val.name}
                target="_blank"
                rel="noreferrer noopener"
                data-social-icon={val.name}
              >
                <i
                  className={val.icon}
                  onClick={(event) => handleSocialEvent(event)}
                />
              </a>
            ))}
          </div>
        </div>
        <div
          className={`
      ${
        showCongratsPage
          ? "vida-home-contact__congrats-scooter-img"
          : "vida-home-contact__scooter-img"
      }`}
        >
          <img src={productImage} alt="Vida Home Contact" />
        </div>
      </div>
      {!showCongratsPage && (
        <div className="vida-home-contact__contact-details">
          <form
            className="vida-home-contact__fields form__group"
            onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
          >
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
              setValue={setValue}
            />
            <NumberField
              name="pincode"
              label={pinCodeField.label}
              placeholder={pinCodeField.placeholder}
              validationRules={pinCodeField.validationRules}
              register={register}
              errors={errors}
              maxLength={CONSTANT.RESTRICT_PINCODE}
              value=""
              setValue={setValue}
            />
            <div className="vida-home-contact__btn-container">
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={isDisabled}
              >
                {submitBtn.label}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
StayInTouch.propTypes = {
  config: PropTypes.shape({
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
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    submitBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    socialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    message: PropTypes.string,
    title: PropTypes.string,
    successMessage: PropTypes.string,
    successTitle: PropTypes.string,
    productImage: PropTypes.string,
    errorMessage: PropTypes.string
  })
};

StayInTouch.defaultProps = {
  config: {}
};
export default StayInTouch;
