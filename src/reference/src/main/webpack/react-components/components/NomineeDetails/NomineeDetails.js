import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputField from "../form/InputField/InputField";
import { useForm } from "react-hook-form";
// import SelectField from "../form/SelectField/SelectField";
import NumberField from "../../components/form/NumberField/NumberField";
import appUtils from "../../../site/scripts/utils/appUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import {
  useGetNomineeDetails,
  useUpdateNomineeDetails
} from "../../hooks/nomineeDetails/nomineeDetailsHooks";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../site/scripts/constant";
import Dropdown from "../form/Dropdown/Dropdown";

const NomineeDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { config } = props;
  const [productSku, setProductSku] = useState(null);
  const imgPath = appUtils.getConfig("imgPath");
  const queryString = location.href.split("?")[1];
  const uploadDocumentsUrl = `${appUtils.getPageUrl(
    "uploadDocumentsUrl"
  )}?${queryString}`;
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const [orderId, setOrderId] = useState(null);
  const [relationFieldData] = useState({
    options: config.relationField.options,
    value: ""
  });

  const getNomineeDetails = useGetNomineeDetails();
  const updateNomineeDetails = useUpdateNomineeDetails();

  //Handle form submission
  const {
    register,
    // control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const fetchNomineeDetails = async (id) => {
    const response = await getNomineeDetails({
      variables: {
        order_id: id
      }
    });

    const nomineeData =
      response && response.data && response.data.getNomineeDetails
        ? response.data.getNomineeDetails
        : null;
    setProductSku(response.data.getNomineeDetails.productSku);
    if (nomineeData) {
      nomineeData.nominee_name && setValue("name", nomineeData.nominee_name);
      nomineeData.nominee_age &&
        setValue("age", nomineeData.nominee_age.toString());
      nomineeData.nominee_relation &&
        setValue("relation", nomineeData.nominee_relation);
    }
  };

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    if (queryString) {
      setSpinnerActionDispatcher(true);
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      if (
        params &&
        params.has("insuranceAvailability") &&
        params.get("insuranceAvailability") === "true" &&
        params.has("orderId")
      ) {
        setOrderId(params.get("orderId"));
        fetchNomineeDetails(params.get("orderId"));
      } else {
        window.location.href = profileUrl;
      }
    } else {
      window.location.href = profileUrl;
    }
  }, []);

  const handleDropdownChange = async (name, value) => {
    setValue(name, value);
  };

  const handleCustomValidation = (fieldname, value) => {
    if (value === "") {
      setError(fieldname, {
        type: "required"
      });
    } else if (fieldname === "age") {
      if (parseInt(value) < 18) {
        setError("age", {
          type: "customValidation",
          message: config.ageField.validationRules.customValidation.message
        });
      } else {
        clearErrors("age");
      }
    } else {
      clearErrors(fieldname);
    }
  };

  //to handle form data Submission
  const handleFormSubmit = async (formData) => {
    try {
      // if (!handleCustomValidation("age", formData.age)) {
      //   return;
      // }
      if (orderId) {
        setSpinnerActionDispatcher(true);
        const nomineeInfo = await updateNomineeDetails({
          variables: {
            order_id: orderId,
            nominee_name: formData.name,
            nominee_age: formData.age,
            nominee_relation: formData.relation
          }
        });
        if (nomineeInfo && nomineeInfo.data && uploadDocumentsUrl) {
          setSpinnerActionDispatcher(true);
          if (isAnalyticsEnabled) {
            const bookingDetails = {
              bookingID: orderId,
              bookingStatus: "Nominee Details Updated"
            };
            analyticsUtils.trackNomineeDetailsVida2(bookingDetails);
            analyticsUtils.trackNominee(function () {
              window.location.href = uploadDocumentsUrl;
            });
          } else {
            window.location.href = uploadDocumentsUrl;
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  return (
    <div className="vida-container vida-nominee-details">
      <div className="vida-nominee-details__container">
        <div className="vida-nominee-details__details-wrapper">
          <div className="vida-nominee-details__heading-wrapper">
            <h2 className="vida-nominee-details__heading">{config.title}</h2>
          </div>
          <div className="vida-nominee-details__form-wrapper">
            <form
              onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
            >
              <InputField
                name="name"
                label={config.nameField.label}
                placeholder={config.nameField.placeholder}
                validationRules={config.nameField.validationRules}
                register={register}
                errors={errors}
                onChangeHandler={handleCustomValidation}
                value=""
                checkNameFormat
                setValue={setValue}
              />

              <NumberField
                name="age"
                label={config.ageField.label}
                placeholder={config.ageField.placeholder}
                validationRules={config.ageField.validationRules}
                register={register}
                errors={errors}
                onChangeHandler={(value) =>
                  handleCustomValidation("age", value)
                }
                value=""
                maxLength={CONSTANT.RESTRICT_AGE}
              ></NumberField>

              {/* <SelectField
                name="relation"
                label={config.relationField.label}
                options={relationFieldData.options}
                value={relationFieldData.options.id}
                onChangeHandler={handleDropdownChange}
                validationRules={config.relationField.validationRules}
                control={control}
                errors={errors}
              /> */}

              <Dropdown
                name="relation"
                label={config.relationField.label}
                options={relationFieldData.options}
                value={relationFieldData.options.id}
                setValue={setValue}
                onChangeHandler={handleDropdownChange}
                errors={errors}
                clearErrors={clearErrors}
                validationRules={config.relationField.validationRules}
                register={register}
              />

              <div className="vida-nominee-details__btn-container">
                <button
                  className="btn btn--primary vida-nominee-details__btn btn--full-width"
                  onClick={handleSubmit}
                >
                  {config.primaryBtn.label}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="vida-nominee-details__image-container">
          {productSku && (
            <div className="vida-scooter-info__image">
              <img
                className="vida-scooter-info__product-image"
                src={imgPath + productSku + ".png"}
                alt="Scooter Image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NomineeDetails.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    nameField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    ageField: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    relationField: PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    primaryBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  orderId: PropTypes.string
};
export default NomineeDetails;
