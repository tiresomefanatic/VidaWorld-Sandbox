import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useUpdateEmergencyDetails } from "../../hooks/testDrive/uploadDocument/uploadDocumentsHooks";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import Dropdown from "../form/Dropdown/Dropdown";
import API from "../../../services/rest.service";
import PhoneNumber from "../form/PhoneNumber/PhoneNumber";
import UploadCards from "./UploadCard/UploadCard";
import { RSAUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";

const TestDriveUpload = (props) => {
  const {
    title,
    subTitle,
    documents,
    actions,
    messages,
    emergencyNumberField,
    relationField,
    backgroundImg,
    redirectMessage
  } = props.config;
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur"
  });
  const [submittedData, setSubmittedData] = useState({
    isSubmitted: false
  });
  const [uploadCardError, setUploadCardError] = useState([]);
  const [relationOptions, setRelationOptions] = useState(
    appUtils.getConfig("dropdownInitialValue")
  );
  const relationDataURL = appUtils.getAPIUrl("lttrRelationMasterUrl");
  const relationFieldInfo = {
    name: "relation",
    ...relationField
  };

  const [uploadedData, setUploadedData] = useState({});
  const setUploadData = (data, isRemove) => {
    let files = { ...uploadedData };
    !isRemove
      ? (files = {
          ...files,
          ...data
        })
      : delete files[data];
    setUploadedData(files);
  };

  const setUpdateEmergencyDetails = useUpdateEmergencyDetails();

  const handleFormSubmit = async () => {
    const fields = getValues();
    delete fields.countryCode;
    const errorKeys = [];
    if (!uploadedData["front_key"]) {
      errorKeys.push("front_key");
    }
    if (!uploadedData["back_key"]) {
      errorKeys.push("back_key");
    }
    const uploadedLocalData = {
      ...fields,
      ...uploadedData
    };
    uploadedLocalData.emergencyNumber = RSAUtils.encrypt(
      uploadedLocalData.emergencyNumber
    );

    setUploadCardError(errorKeys);
    if (uploadedLocalData["front_key"] && uploadedLocalData["back_key"]) {
      setSpinnerActionDispatcher(true);
      setUpdateEmergencyDetails({
        variables: uploadedLocalData
      }).then((res) => {
        if (res.data) {
          setSubmittedData({
            isSubmitted: true,
            message: messages.finalSuccess
          });
          setTimeout(() => {
            window.location.href =
              appUtils.getPageUrl("profileUrl") +
              "?" +
              cryptoUtils.encrypt("?tabId=longTerm").toString();
          }, 5000);
        }
      });
    }
  };

  const codeList = appUtils.getConfig("countryCodes");

  useEffect(() => {
    const relationData = [...relationOptions];
    API.getData(relationDataURL)
      .then((response) => {
        response.data.map((item) => {
          relationData.push({
            label: item.name,
            value: item.id
          });
        });
        setRelationOptions(relationData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="vida-test-drive__container">
      <div className="vida-test-drive__asset vida-test-drive__asset-block">
        <img src={backgroundImg} alt="Vida Test Drive" />
      </div>

      <div className="vida-test-drive__content vida-test-drive__content-upload">
        <h2>{title}</h2>
        <p className="p3">{subTitle}</p>
        {!submittedData.isSubmitted ? (
          <form
            className="form vida-booking-form"
            onSubmit={handleSubmit(() => handleFormSubmit())}
          >
            <PhoneNumber
              label={emergencyNumberField.label}
              fieldNames={{
                inputFieldName: "emergencyNumber",
                selectFieldName: "countryCode"
              }}
              placeholder={emergencyNumberField.placeholder}
              options={codeList}
              validationRules={emergencyNumberField.validationRules}
              register={register}
              errors={errors}
              maxLength={emergencyNumberField.validationRules.maxLength.value}
            />
            <Dropdown
              name={relationFieldInfo.name}
              label={relationFieldInfo.label}
              value={getValues(relationFieldInfo.name) || ""}
              options={relationOptions}
              setValue={setValue}
              errors={errors}
              validationRules={relationFieldInfo.validationRules}
              clearErrors={clearErrors}
              register={register}
              searchable
            />
            <div className="vida-upload-documents__items">
              {documents &&
                documents.map((document) => {
                  return (
                    !document.hidden && (
                      <UploadCards
                        messagesData={messages}
                        documentData={document}
                        key={document.fieldName}
                        setUploadData={setUploadData}
                        uploadCardError={uploadCardError.includes(
                          document.fieldName
                        )}
                      />
                    )
                  );
                })}
            </div>
            <div className="vida-upload-documents__btn-container">
              <button type="submit" className="btn btn--primary">
                {actions.primary}
              </button>
            </div>
          </form>
        ) : (
          <div className="vida-test-drive__content__submitted">
            <p className="vida-test-drive__content__submitted-status">
              {submittedData.message}
            </p>
            <p className="vida-test-drive__content__submitted-message">
              {redirectMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

TestDriveUpload.propTypes = {
  config: PropTypes.object
};

TestDriveUpload.defaultProps = {};

export default TestDriveUpload;
