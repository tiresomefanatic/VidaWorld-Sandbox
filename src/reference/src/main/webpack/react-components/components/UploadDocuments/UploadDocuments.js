import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FileBase64 from "react-file-base64";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import Dropdown from "../form/Dropdown/Dropdown";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { getAddressTypesData } from "../../services/commonServices/commonServices";
import CONSTANT from "../../../site/scripts/constant";
import {
  useSubmitDocuments,
  useUploadDocuments
} from "../../hooks/uploadDocument/uploadDocumentsHooks";
import { useOptimizedGetOrderData } from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { connect } from "react-redux";
import UploadCards from "./UploadCard/UploadCard";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const UploadDocuments = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { title, addressProof, documents, actions, messages, finalSubmission } =
    props.config;
  const { addressLine1, addressLine2, addressLandmark, city, state, pincode } =
    props.billingAddressDetail;
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const profileUrl = appUtils.getPageUrl("profileUrl");
  const insuranceType = "INSURANCE_COPY";
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [fileName, setFileName] = useState();
  const [submitData, setSubmitData] = useState();
  const [renderingDocs, setRenderingDocs] = useState([]);
  const [status, setStatus] = useState({
    isError: false,
    isSuccess: false
  });
  const [listingData, setListingData] = useState({
    "order-id": ""
  });
  const [options, setOptions] = useState([
    {
      label: "Select",
      value: ""
    }
  ]);
  const notInitialRender = useRef(false);

  // const aadhaarValidationUrl = appUtils.getPageUrl("aadharValidationUrl");

  let decryptedParams = "";
  const setSubmitDocuments = useSubmitDocuments();
  const setUploadDocuments = useUploadDocuments();
  const getOrderData = useOptimizedGetOrderData();
  const queryString = location.href.split("?")[1];
  if (queryString) {
    decryptedParams = cryptoUtils.decrypt(queryString);
  }
  const params = new URLSearchParams(decryptedParams);
  const [orderId, setOrderId] = useState(params.get("orderId"));
  const [isAddressTypeDisabled, setIsAddressTypeDisabled] = useState(true);
  const [insuranceAvailability, setInsuranceAvailability] = useState(
    params.get("insuranceAvailability")
  );
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const setUploadData = (data, isRemove) => {
    const files = [...uploadedFiles];
    if (isRemove && files.indexOf(data) !== -1) {
      files.splice(files.indexOf(data), 1);
    }
    if (!isRemove && files.indexOf(data) === -1) {
      files.push(data);
    }
    setUploadedFiles(files);
  };
  const getAddressTypes = async () => {
    const result = await getAddressTypesData();
    setOptions([...options, ...result]);
  };
  const navigateToProfile = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Upload Documents";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = profileUrl;
        }
      );
    } else {
      window.location.href = profileUrl;
    }
  };
  const handleFormSubmit = () => {
    if (orderId) {
      const submitDataset = submitData;
      submitDataset.input.address_type = getValues("address_type");
      setSubmitDocuments({
        variables: {
          order_id: orderId,
          ...submitDataset
        }
      }).then((res) => {
        if (res.data && res.data.submitDocuments.status) {
          if (isAnalyticsEnabled) {
            const documentDetails = {
              documentName: submitData.input.type
                .toString()
                .split(",")
                .join("|"),
              documentUploadStatus: "success"
            };
            analyticsUtils.trackDocument(documentDetails, function () {
              setIsSubmitSuccess(true);
              // window.location.href =
              //   aadhaarValidationUrl + (queryString ? "?" + queryString : "");
            });
          } else {
            setIsSubmitSuccess(true);
            // window.location.href =
            //   aadhaarValidationUrl + (queryString ? "?" + queryString : "");
          }
        }
      });
    }
  };

  const setupUploadFile = (file) => {
    if (CONSTANT.FILE_REGEX_DOC.test(file.type)) {
      setListingData({
        document_type: addressProof.id,
        file: file.base64.split("base64,")[1]
      });
      setFileName(file.name);
    } else {
      setStatus({
        isError: true,
        isSuccess: false
      });
      setFileName("");
      setUploadData(addressProof.id, true);
    }
  };

  useEffect(() => {
    if (notInitialRender.current) {
      if (
        (insuranceAvailability === "true" && uploadedFiles.length === 3) ||
        (insuranceAvailability === "false" && uploadedFiles.length === 4)
      ) {
        setSubmitDisabled(false);
      } else {
        setSubmitDisabled(true);
      }
    } else {
      getAddressTypes();
      if (params && params.has("orderId")) {
        setOrderId(params.get("orderId"));
      } else if (appUtils.getConfig("authorMode") !== "true") {
        window.location.href = profileUrl;
      }

      if (params && params.has("insuranceAvailability")) {
        setInsuranceAvailability(params.get("insuranceAvailability"));
      }
      const submitTypes =
        insuranceAvailability === "true"
          ? ["SELF_IMAGE", "PAN_CARD", "ADDRESS_PROOF"]
          : ["SELF_IMAGE", "PAN_CARD", "INSURANCE_COPY", "ADDRESS_PROOF"];

      setSubmitData({
        input: {
          type: submitTypes
        }
      });

      documents.map((document) => {
        if (insuranceAvailability === "true" && document.id === insuranceType) {
          setRenderingDocs(documents.filter((doc) => doc.id !== insuranceType));
        } else {
          setRenderingDocs(documents);
        }
        return document;
      });
    }
  }, [uploadedFiles]);

  useEffect(() => {
    if (notInitialRender.current) {
      if (orderId) {
        setSpinnerActionDispatcher(true);
        setUploadDocuments({
          variables: {
            order_id: orderId,
            address_type: getValues("address_type"),
            ...listingData
          }
        }).then((res) => {
          if (res.data) {
            setStatus({
              isError: false,
              isSuccess: res.data.uploadCustomerDocuments.status
            });
            setUploadData(listingData.document_type);
            setSpinnerActionDispatcher(false);
          }
          if (res.errors) {
            setStatus({
              isError: true,
              isSuccess: false
            });
            setSpinnerActionDispatcher(false);
          }
        });
      } else {
        setSpinnerActionDispatcher(false);
      }
    } else {
      getOrderData({
        variables: {
          order_id: orderId,
          opportunity_id: ""
        }
      });
      notInitialRender.current = true;
    }
  }, [listingData]);

  const onChangeAddressType = (value) => {
    setIsAddressTypeDisabled(!value);
  };

  return (
    <div className="vida-container">
      <div className="vida-upload-documents">
        <div className="vida-upload-documents__container">
          {!isSubmitSuccess ? (
            <div className="vida-upload-documents__title">{title}</div>
          ) : (
            ""
          )}
          {!isSubmitSuccess ? (
            <form
              className="form vida-upload-documents__form"
              onSubmit={handleSubmit(() => handleFormSubmit())}
            >
              <div className="vida-upload-documents__items">
                {renderingDocs &&
                  renderingDocs.map((document, index) => {
                    return (
                      <UploadCards
                        messagesData={messages}
                        documentData={document}
                        key={index}
                        setUploadData={setUploadData}
                      />
                    );
                  })}
              </div>
              <div className="vida-upload-documents__address-details">
                <h3 className="vida-upload-documents__address-details-title">
                  {addressProof.title}
                </h3>
                <p className="vida-upload-documents__address-details-address p2">
                  {addressProof.subTitle}
                </p>
                <p>
                  {addressLine1 +
                    " " +
                    addressLine2 +
                    " " +
                    addressLandmark +
                    " " +
                    city +
                    " " +
                    state +
                    " " +
                    pincode}
                </p>
                <div className="vida-upload-documents__address-details-upload">
                  {options && options.length ? (
                    <Dropdown
                      name="address_type"
                      label={addressProof.label}
                      value={getValues("address_type") || ""}
                      options={options}
                      onChangeHandler={(name, value) =>
                        onChangeAddressType(value)
                      }
                      setValue={setValue}
                      errors={errors}
                      control={control}
                      register={register}
                      searchable
                    />
                  ) : (
                    ""
                  )}
                  <div className="vida-upload-documents__upload">
                    <div
                      className={`vida-upload-documents__upload-fileUpload ${
                        isAddressTypeDisabled
                          ? "vida-upload-documents__upload-fileUpload-disabled"
                          : ""
                      }`}
                    >
                      <span className="vida-upload-documents-fileUpload-btn">
                        <i className="icon-upload"></i>{" "}
                        {addressProof.uploadLabel}
                      </span>
                      <FileBase64
                        hidden
                        id="vida-upload-documents__upload-btn"
                        type="file"
                        multiple={false}
                        onDone={(file) => setupUploadFile(file)}
                      />
                    </div>
                  </div>
                </div>
                {fileName ? (
                  <p className="file-name">
                    <i className="icon-document-text"></i>
                    {fileName}
                  </p>
                ) : (
                  ""
                )}

                {status.isError ? (
                  <p className="error">{addressProof.messages.error}</p>
                ) : (
                  ""
                )}
                {status.isSuccess ? (
                  <p className="success">{addressProof.messages.success}</p>
                ) : (
                  ""
                )}

                <div className="vida-upload-documents__btn-container">
                  <button
                    disabled={isSubmitDisabled}
                    type="submit"
                    className="btn btn--primary"
                  >
                    {actions.primary}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={(event) => navigateToProfile(event)}
                  >
                    {actions.secondary}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            ""
          )}
          {isSubmitSuccess ? (
            <div className="vida-upload-documents__success">
              <p className="success">{finalSubmission.success}</p>
              <div className="vida-upload-documents__success-btn vida-upload-documents__btn-container">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={(event) => navigateToProfile(event)}
                >
                  {finalSubmission.primary}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    billingAddressDetail: purchaseConfigReducer.billingAddresses
  };
};
UploadDocuments.propTypes = {
  config: PropTypes.object,
  billingAddressDetail: PropTypes.object
};

export default connect(mapStateToProps)(UploadDocuments);
