import React, { useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import InputField from "../../forms/InputField/InputField";
import { useForm } from "react-hook-form";
import { FIELDNAMES } from "./Constants";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import { useVerifyGST } from "../../../../hooks/purchaseConfig/purchaseConfigHooks";
import Logger from "js-logger";
import Button from "../Components/Button";

const FameSubsidy = ({
  config,
  submitFameSubsidyDetails,
  subsidyDetails,
  backToSummaryPage
}) => {
  const [isIndividual, setIndividualSelected] = useState(true);
  const [isCorporate, setCorporateSelected] = useState(false);
  const [showDisclaimer, toggleDisclaimer] = useState(false);

  const verifyGstDetails = useVerifyGST();

  const individualSelectHandler = () => {
    if (isCorporate) {
      setCorporateSelected(false);
    }
    setIndividualSelected(!isIndividual);
  };
  const corporateSelectHandler = () => {
    if (isIndividual) {
      setIndividualSelected(false);
    }
    setCorporateSelected(!isCorporate);
  };

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

  // function to return data to back to main component
  const submitData = (data) => {
    let newData = {
      [FIELDNAMES.GST_NUMBER]: "",
      [FIELDNAMES.GST_COMPANY_NAME]: "",
      [FIELDNAMES.GST_EMAIL]: "",
      [FIELDNAMES.GST_SELECTED]: false
    };
    if (isCorporate) {
      newData = {
        [FIELDNAMES.GST_NUMBER]: data[FIELDNAMES.GST_NUMBER],
        [FIELDNAMES.GST_COMPANY_NAME]: data[FIELDNAMES.GST_COMPANY_NAME],
        [FIELDNAMES.GST_EMAIL]: data[FIELDNAMES.GST_EMAIL],
        [FIELDNAMES.GST_SELECTED]: true
      };
    }
    if (submitFameSubsidyDetails) {
      submitFameSubsidyDetails(newData);
      backToSummaryPage(
        isCorporate || isIndividual,
        isCorporate || isIndividual
          ? subsidyDetails.fameSubsidyEligibleAmount
          : 0
      );
    }
  };

  const handleFormSubmit = async (formData) => {
    if (isCorporate) {
      try {
        const result = await verifyGstDetails({
          variables: {
            gstin: formData[FIELDNAMES.GST_NUMBER],
            order_id: subsidyDetails.orderId
          }
        });

        if (result.data && result.data.VerifyGst) {
          const newData = { ...formData };
          const companyName = result?.data?.VerifyGst?.legalNameOfBusiness;
          const companyEmail = result?.data?.VerifyGst?.email;
          if (companyName) {
            if (
              formData[FIELDNAMES.GST_COMPANY_NAME] &&
              companyName === formData[FIELDNAMES.GST_COMPANY_NAME]
            ) {
              newData[FIELDNAMES.GST_COMPANY_NAME] = companyName;
              submitData(newData);
            } else {
              setError(FIELDNAMES.GST_COMPANY_NAME, {
                type: "custom",
                message: "Company Name not same as GST Company"
              });
            }
          }
          if (companyEmail) {
            if (
              formData[FIELDNAMES.GST_EMAIL] &&
              companyEmail === formData[FIELDNAMES.GST_EMAIL]
            ) {
              newData[FIELDNAMES.GST_EMAIL] = companyEmail;
              submitData(newData);
            } else {
              setError(FIELDNAMES.GST_EMAIL, {
                type: "custom",
                message: "Email not same as GST Email"
              });
            }
          }
        } else {
          setError(FIELDNAMES.GST_NUMBER, {
            type: "custom",
            message: "GST number is wrong"
          });
        }
      } catch (error) {
        Logger.error(error.message);
      }
    } else {
      submitData(formData);
    }
  };

  return (
    <div className="fame-subsidy-wrapper">
      <ConfirmModal
        showModal={showDisclaimer}
        header={"Disclaimer"}
        content={() => (
          <p className="fame-subsidy-modal-content">
            I state that I have not used my Aadhaar card to register for FAME
            Subsidy ever before. In case of a failed Aadhaar Validation, I am
            aware the FAME subsidy will be cancelled and I will pay the
            difference in price.
          </p>
        )}
        onCancel={() => toggleDisclaimer(false)}
        cancelButtonLabel={"Disagree"}
        confirmButtonLabel={"Agree"}
        onConfirm={handleFormSubmit}
      />
      <form
        className=""
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <div className="fame-subsidy-subheader">{config.subsidySubTitle}</div>
        <div className="fame-subsidy-header">{config.subsidyTitle}</div>
        <div className="fame-subsidy-info">
          <p className="fame-subsidy-info-desc">{`FAME Subsidy in ${
            subsidyDetails?.state || "Delhi"
          } is ₹${Number(
            subsidyDetails?.fameSubsidyEligibleAmount || 0
          ).toLocaleString()}`}</p>
        </div>
        <div className="fame-subsidy-content">
          <div className="fame-subsidy-content-radio-input">
            <label className="option-select" onClick={individualSelectHandler}>
              {isIndividual ? (
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/checkbox-selected.svg`}
                />
              ) : (
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/checkbox.svg`}
                />
              )}
              <span htmlFor="individual">{config.subsidyIndividualText}</span>
            </label>
            {isIndividual && (
              <div className="fame-subsidy-info">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/info-dark-black.svg`}
                />
                <p className="fame-subsidy-info-desc">
                  {config.subsidyDescription}
                </p>
              </div>
            )}
          </div>
          <div className="dotted-seperator"></div>
          <div className="fame-subsidy-content-radio-input">
            <label className="option-select" onClick={corporateSelectHandler}>
              {isCorporate ? (
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/checkbox-selected.svg`}
                />
              ) : (
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/checkbox.svg`}
                />
              )}
              <span htmlFor="corporate">{config.subsidyCorporateText}</span>
            </label>
            {isCorporate && (
              <>
                <div className="fame-subsidy-info">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/info-dark-black.svg`}
                  />
                  <div>
                    <p className="fame-subsidy-info-desc">
                      {config.subsidyDescription}
                    </p>
                    {config.subsidyCorporateDescription && (
                      <p className="fame-subsidy-info-desc">
                        {config.subsidyCorporateDescription}{" "}
                      </p>
                    )}
                  </div>
                </div>

                <div className="gst-form-wrapper">
                  <InputField
                    name={FIELDNAMES.GST_NUMBER}
                    placeholder={config?.gstFormFields?.gstNumber?.placeholder}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    value=""
                  />
                  <InputField
                    name={FIELDNAMES.GST_COMPANY_NAME}
                    placeholder={
                      config?.gstFormFields?.gstCompanyName?.placeholder
                    }
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    value=""
                  />
                  <InputField
                    name={FIELDNAMES.GST_EMAIL}
                    placeholder={config?.gstFormFields?.gstEmail?.placeholder}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    value=""
                    checkEmailFormat
                  />
                </div>
              </>
            )}
          </div>

          <div className="fame-subsidy-content-button-wrapper">
            {isIndividual ? (
              <Button
                className="primary-btn"
                onClick={() => toggleDisclaimer(true)}
                type="button"
                label={"Confirm"}
              />
            ) : (
              <Button className="primary-btn" type="submit" label={"Confirm"} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FameSubsidy;

FameSubsidy.propTypes = {
  config: PropTypes.object,
  submitFameSubsidyDetails: PropTypes.func,
  subsidyDetails: PropTypes.object,
  backToSummaryPage: PropTypes.func
};
