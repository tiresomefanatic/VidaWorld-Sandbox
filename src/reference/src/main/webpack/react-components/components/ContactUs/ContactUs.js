import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import InputField from "../form/InputField/InputField";
import PhoneNumber from "../form/PhoneNumber/PhoneNumber";
import appUtils from "../../../site/scripts/utils/appUtils";
import Logger from "../../../services/logger.service";
import { postContactData } from "../../services/contact/contactService";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { RSAUtils } from "../../../site/scripts/utils/encryptDecryptUtils";

const ContactUs = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [showThankYouPage, setShowThankYouPage] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { config } = props;
  const {
    contactMail,
    contactPhone,
    mobileField,
    firstNameField,
    lastNameField,
    emailField,
    followUsLabel,
    message,
    sendBtn,
    title,
    videoConnect,
    textField,
    thankYouTitle,
    thankYouMessage,
    socialLinks,
    productImage
  } = config;
  const codeList = appUtils.getConfig("countryCodes");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const handleFormSubmit = async (formData) => {
    setDisabled(true);
    try {
      const url = appUtils.getAPIUrl("contactUsUrl");
      const result = await postContactData(url, {
        Email: RSAUtils.encrypt(formData.email),
        MobilePhone: RSAUtils.encrypt(formData.number),
        FirstName: formData.fname,
        LastName: formData.lname,
        Message: formData.message
      });
      if (result.success && result.success === true) {
        setDisabled(false);
        setShowThankYouPage(true);

        const journeyName = "Contact Us";
        const eventName = "contactUsFormSubmit";
        const customLink = {
          name: "Send",
          position: "Bottom",
          type: "Link",
          clickType: "other"
        };
        if (isAnalyticsEnabled) {
          analyticsUtils.trackContactus(journeyName, eventName, customLink);
        }
      } else {
        setDisabled(false);
      }
    } catch (error) {
      setDisabled(false);
      Logger.error(error);
    }
  };

  const handleAnalyticsCTA = (event, linkName) => {
    if (isAnalyticsEnabled) {
      event.preventDefault();
      const customLink = {
        name: linkName,
        position: "Top",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = "";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = event.target.href;
        }
      );
    } else {
      window.location.href = event.target.href;
    }
  };

  const handleSocialEvent = (event) => {
    if (isAnalyticsEnabled) {
      event.preventDefault();
      const customLink = {
        name: event.target.parentElement.dataset.socialIcon,
        position: "Middle",
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

  return (
    <div className="vida-container">
      <div className="vida-contact-us">
        {showThankYouPage ? (
          <div className="vida-contact-us__thank-you">
            <div>
              <h1 className="vida-contact-us__thanks-title">{thankYouTitle}</h1>
              <h3 className="vida-contact-us__thanks-msg">{thankYouMessage}</h3>
            </div>
            <div className="vida-contact-us__contact-social">
              {socialLinks.map((val) => (
                <a
                  className="vida-contact-us__links"
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
            <div className="vida-contact-us__scooter-img">
              <img src={productImage} alt="Scooter Image" />
            </div>
          </div>
        ) : (
          <>
            <div className="vida-contact-us__contact">
              <h1 className="vida-contact-us__title">{title}</h1>
              <h4 className="vida-contact-us__msg">{message}</h4>
              <div className="vida-contact-us__contact-wrap">
                {contactPhone.label && contactPhone.number && (
                  <div className="vida-contact-us__contact-type">
                    <i className="icon-phone"></i>
                    <div className="vida-contact-us__contact-info">
                      <h4 className="vida-contact-us__contact-title">
                        {contactPhone.label}
                      </h4>
                      <p>
                        <a
                          className="vida-contact-us__contact-links"
                          href={"tel:" + contactPhone.number}
                          onClick={(event) =>
                            handleAnalyticsCTA(event, "Phone")
                          }
                        >
                          {contactPhone.number}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {contactMail.label && contactMail.email && (
                  <div className="vida-contact-us__contact-type">
                    <i className="icon-mail"></i>
                    <div className="vida-contact-us__contact-info">
                      <h4 className="vida-contact-us__contact-title">
                        {contactMail.label}
                      </h4>
                      <p>
                        <a
                          className="vida-contact-us__contact-links"
                          href={"mailto:" + contactMail.email}
                          onClick={(event) => handleAnalyticsCTA(event, "Mail")}
                        >
                          {contactMail.email}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {videoConnect.label && videoConnect.message && (
                  <div className="vida-contact-us__contact-type">
                    <i className="icon-video"></i>
                    <div className="vida-contact-us__contact-info">
                      <h4 className="vida-contact-us__contact-title">
                        {videoConnect.label}
                      </h4>
                      <p>
                        <a
                          className="vida-contact-us__contact-links"
                          href="#"
                          onClick={(event) =>
                            handleAnalyticsCTA(event, "Video Call")
                          }
                        >
                          {videoConnect.message}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="vida-contact-us__social-wrap">
                <h5 className="vida-contact-us__social-heading">
                  {followUsLabel}
                </h5>
                {socialLinks.map((val) => (
                  <a
                    className="vida-contact-us__social-links"
                    href={val.actionUrl}
                    key={val.name}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-social-icon={val.name}
                  >
                    <i
                      className={val.icon}
                      data-social-icon={val.icon}
                      onClick={(event) => handleSocialEvent(event)}
                    />
                  </a>
                ))}
              </div>
            </div>
            <div className="vida-contact-us__contact-details">
              <form
                className="vida-contact-us__contact-fields"
                onSubmit={handleSubmit((formData) =>
                  handleFormSubmit(formData)
                )}
              >
                <div className="form__group">
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
                    validationRules={emailField.validationRules}
                    register={register}
                    errors={errors}
                    checkEmailFormat
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
                  <div className="form__group">
                    <label htmlFor="message" className="form__field-label">
                      {textField.label}
                    </label>
                    <textarea
                      name="message"
                      className="form__field-textarea"
                      placeholder={textField.placeholder}
                      {...register("message")}
                    ></textarea>
                  </div>
                  <div className="vida-contact-us__btn-container">
                    <button
                      type="submit"
                      className="btn btn--primary btn--lg"
                      disabled={isDisabled}
                    >
                      {sendBtn.label}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ContactUs.propTypes = {
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
    sendBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    contactMail: PropTypes.shape({
      label: PropTypes.string,
      email: PropTypes.string
    }),
    contactPhone: PropTypes.shape({
      label: PropTypes.string,
      number: PropTypes.string
    }),
    videoConnect: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
    textField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string
    }),
    socialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.string
      })
    ),
    message: PropTypes.string,
    title: PropTypes.string,
    followUsLabel: PropTypes.string,
    thankYouMessage: PropTypes.string,
    thankYouTitle: PropTypes.string,
    productImage: PropTypes.string,
    errorMessage: PropTypes.string
  })
};

ContactUs.defaultProps = {
  config: {}
};

export default ContactUs;
