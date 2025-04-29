import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import {
  cryptoUtils,
  RSAUtils
} from "../../../../site/scripts/utils/encryptDecryptUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../../site/scripts/constant";
import {
  useUploadDocuments,
  useSubmitDocuments
} from "../../../hooks/uploadDocument/uploadDocumentsHooks";
import { useCreateAadharVerification } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import FileBase64 from "react-file-base64";
import Drawer from "../Drawer/Drawer";
import { useForm } from "react-hook-form";
import NumberField from "../forms/NumberField/NumberField";
import DeliveryTracker from "../DeliveryTracker/DeliveryTracker";
import { connect } from "react-redux";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { getAddressTypesData } from "../../../services/commonServices/commonServices";
import Dropdown from "../forms/Dropdown/Dropdown";
import { useOptimizedGetOrderData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";
import Banner from "../Purchase/Components/Banner";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const DocumentUpload = (props) => {
  const { config, userProfileInfo, dealerData, productData, productID } = props;
  const [showAadharVerificationPopup, setShowAadharVerificationPopup] =
    useState(true);
  const [showPhotoUploadPopup, setShowPhotoUploadPopup] = useState(false);
  const [showInsuranceUploadPopup, setShowInsuranceUploadPopup] =
    useState(false);
  const [showAddressProofUploadPopup, setShowAddressProofUploadPopup] =
    useState(false);
  const [showContinueToDeliveryPopup, setShowContinueToDeliveryPopup] =
    useState(false);
  const [aadharFormValid, setAadharFormValid] = useState(false);
  const [aadharVerificationUrl, setAadharVerificationUrl] = useState("");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [progessStatus, setProgressStatus] = useState(
    "document-upload-in-progress"
  );
  const [submitUploadedData, setSubmitUploadedData] = useState({
    input: {
      type: ["INSURANCE_COPY", "ADDRESS_PROOF"]
    }
  });
  const [imageUploadStatus, setImageUploadStatus] = useState({
    status: "none",
    fileName: ""
  });
  const [insuranceUploadStatus, setInsuranceUploadStatus] = useState({
    status: "none",
    fileName: ""
  });
  const [addressProofUploadStatus, setAddressProofUploadStatus] = useState({
    status: "none",
    fileName: ""
  });
  const [opportunityId, setOpportunityId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [params, setParams] = useState();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const { addressLine1, addressLine2, addressLandmark, city, state, pincode } =
    props.billingAddressDetail;

  const addressParts = [
    addressLine1,
    addressLine2,
    addressLandmark ? addressLandmark : null,
    city,
    state,
    pincode
  ].filter((part) => part);

  const formattedAddress = addressParts.join(", ");

  const selectedVariant = window.sessionStorage.getItem("Variant");

  const queryString = window?.location?.href?.split("?")[1];
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const ordersUrl = appUtils.getPageUrl("ordersUrl");
  const [insuranceAvailability, setInsuranceAvailability] = useState();

  const generateAadhaarVerificationUrl = useCreateAadharVerification();
  const setUploadDocuments = useUploadDocuments();
  const setSubmitDocuments = useSubmitDocuments();
  const getOrderData = useOptimizedGetOrderData();
  const [addressOptions, setAddressOptions] = useState([
    {
      label: config?.addressDropdownLabel,
      value: ""
    }
  ]);
  const [isAddressTypeDisabled, setIsAddressTypeDisabled] = useState(true);
  // const bikeVariantDetails = JSON.parse(config?.bikeVariantDetails || "{}"); //JSON.parse();
  const bikeVariantDetails =
    typeof config?.bikeVariantDetails == "string"
      ? JSON.parse(config?.bikeVariantDetails || "{}")
      : config?.bikeVariantDetails;
  const [activeVariant, setActiveVariant] = useState();

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

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  useEffect(() => {
    if (queryString) {
      const urlParams = new URLSearchParams(location.search);
      const urlParamsKeys = [...urlParams.keys()];
      if (urlParamsKeys.length > 1) {
        const dataToDecrypt = urlParamsKeys[0];
        const newParam = cryptoUtils.decrypt(dataToDecrypt);
        const updatedParams = new URLSearchParams("?" + newParam);
        setParams(updatedParams);
        const order_Id = updatedParams?.get("orderId");
        setOrderId(order_Id);
        const opportunity_Id = updatedParams?.get("opportunityId");
        setOpportunityId(opportunity_Id);
        const hasInsurance =
          updatedParams.get("insuranceAvailability")?.toLowerCase() === "true";

        setInsuranceAvailability(hasInsurance);

        if (urlParams?.get("status")?.toLowerCase() === "success") {
          showNotificationDispatcher({
            title: "Verification Success",
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
          const bookingStatus = urlParams.get("status");
          analyticsUtils.trackAadharCard("", bookingStatus);
        } else if (
          urlParams?.get("status")?.toLowerCase() === "failure" ||
          urlParams?.get("status")?.toLowerCase() === "error"
        ) {
          showNotificationDispatcher({
            title: "Verification failure",
            type: CONSTANT.NOTIFICATION_TYPES.ERROR,
            isVisible: true
          });
          const bookingStatus = urlParams.get("status");
          analyticsUtils.trackAadharCard("", bookingStatus);
        }
      } else {
        const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
        const queryParams = new URLSearchParams("?" + decryptedParams);
        setParams(queryParams);
        const order_Id = queryParams.get("orderId");
        setOrderId(order_Id);
        const opportunity_Id = queryParams.get("opportunityId");
        setOpportunityId(opportunity_Id);
        const hasInsurance =
          queryParams.get("insuranceAvailability")?.toLowerCase() === "true";
        setInsuranceAvailability(hasInsurance);
      }
    }
  }, []);

  const ctaTracking = (e, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  // const handleOpenPhotoUploadPopup = () => {
  //   if (aadharFormValid) {
  //     setShowPhotoUploadPopup(true);
  //     setShowInsuranceUploadPopup(false);
  //     setShowAddressProofUploadPopup(false);
  //     setShowContinueToDeliveryPopup(false);
  //   } else {
  //     showNotificationDispatcher({
  //       title: "Please fill the aadhar details",
  //       type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
  //       isVisible: true
  //     });
  //   }
  // };

  const handleOpenInsuranceUploadPopup = () => {
    if (aadharFormValid) {
      setShowPhotoUploadPopup(false);
      setShowInsuranceUploadPopup(true);
      setShowAddressProofUploadPopup(false);
      setShowContinueToDeliveryPopup(false);
    } else {
      showNotificationDispatcher({
        title: "Please fill the aadhar details",
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
    }
  };

  const handleOpenAddressProofUploadPopup = () => {
    if (aadharFormValid) {
      setShowPhotoUploadPopup(false);
      setShowInsuranceUploadPopup(false);
      setShowAddressProofUploadPopup(true);
      setShowContinueToDeliveryPopup(false);
    } else {
      showNotificationDispatcher({
        title: "Please fill the aadhar details",
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
    }
  };

  const handleCloseUploadPopup = () => {
    setShowPhotoUploadPopup(false);
    setShowInsuranceUploadPopup(false);
    setShowAddressProofUploadPopup(false);
    if (insuranceAvailability) {
      if (
        // imageUploadStatus.status === "success" &&
        addressProofUploadStatus.status === "success"
      ) {
        setShowContinueToDeliveryPopup(true);
      }
    } else {
      if (
        // imageUploadStatus.status === "success" &&
        insuranceUploadStatus.status === "success" &&
        addressProofUploadStatus.status === "success"
      ) {
        setShowContinueToDeliveryPopup(true);
      }
    }
  };

  const handleAadharFormSubmit = async (formData, event) => {
    // ctaTracking(event, "aadharVerifyCtaButtonClick", "Upload Documents");
    // analyticsUtils.trackAadharCard()
    setSpinnerActionDispatcher(true);
    const requestData = encodeURIComponent(queryString);
    const encryptedAadharNumber = RSAUtils.encrypt(formData?.aadharNumber);
    if (formData && formData?.aadharNumber) {
      const updateAadharResult = await generateAadhaarVerificationUrl({
        variables: {
          opportunity_id: `${opportunityId}`,
          aadhaar_number: `${encryptedAadharNumber}`,
          request_data: `${requestData}`
        }
      });
      if (updateAadharResult?.data?.generateAadhaarVerificationUrl?.url) {
        setAadharVerificationUrl(
          updateAadharResult?.data?.generateAadhaarVerificationUrl?.url
        );
        window.sessionStorage.setItem(
          "aadharVerificationUrl",
          updateAadharResult?.data?.generateAadhaarVerificationUrl?.url
        );
        ctaTracking(event, "confirmCTAClick", "Confirm Aadhar Number");
        setShowAadharVerificationPopup(false);
        setSpinnerActionDispatcher(false);
        setAadharFormValid(true);
      } else {
        setSpinnerActionDispatcher(false);
      }
    } else {
      setSpinnerActionDispatcher(false);
    }
  };

  const handleAadharInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const handleDigilockerVerification = () => {
    if (aadharVerificationUrl) {
      window.location.href = aadharVerificationUrl;
    } else {
      setShowAadharVerificationPopup(true);
      showNotificationDispatcher({
        title: "Please fill the aadhar details",
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
    }
  };

  const setUploadDocument = async (file, docType) => {
    setSpinnerActionDispatcher(true);
    const checker =
      docType === "SELF_IMAGE"
        ? CONSTANT.FILE_REGEX_IMAGE
        : CONSTANT.FILE_REGEX_DOC;
    let uploadDocumentResult = {};
    if (checker.test(file.type) && file.size.match(/\d+/g)[0] < 1024) {
      if (params && orderId) {
        uploadDocumentResult = await setUploadDocuments({
          variables: {
            order_id: orderId,
            document_type: docType,
            file: file.base64.split("base64,")[1],
            address_type: getValues("address_type")
          }
        });
        if (
          uploadDocumentResult &&
          uploadDocumentResult?.data &&
          uploadDocumentResult?.data?.uploadCustomerDocuments &&
          uploadDocumentResult?.data?.uploadCustomerDocuments?.status
        ) {
          // if (docType === "SELF_IMAGE") {
          //   setImageUploadStatus({ status: "success", fileName: file?.name });
          //   setShowPhotoUploadPopup(false);
          //   const documentDetails = {
          //     documentName: docType,
          //     documentUploadStatus: "success"
          //   };
          //   let productDetails = {};
          //   if (productData) {
          //     productDetails = {
          //       modelVariant: productData?.name,
          //       modelColor: productData?.variantName,
          //       productID: productID
          //     };
          //   }
          //   analyticsUtils.trackDocument(documentDetails, productDetails);
          // }
          if (docType === "INSURANCE_COPY") {
            setInsuranceUploadStatus({
              status: "success",
              fileName: file?.name
            });
            setShowInsuranceUploadPopup(false);
            const documentDetails = {
              documentName: docType,
              documentUploadStatus: "success"
            };
            let productDetails = {};
            if (productData) {
              productDetails = {
                modelVariant: productData?.name,
                modelColor: productData?.variantName,
                productID: productID
              };
            }
            analyticsUtils.trackDocument(documentDetails, productDetails);
          } else if (docType === "ADDRESS_PROOF") {
            setAddressProofUploadStatus({
              status: "success",
              fileName: file?.name
            });
            setShowAddressProofUploadPopup(false);
            const documentDetails = {
              documentName: docType,
              documentUploadStatus: "success"
            };
            let productDetails = {};
            if (productData) {
              productDetails = {
                modelVariant: productData?.name,
                modelColor: productData?.variantName,
                productID: productID
              };
            }
            analyticsUtils.trackDocument(documentDetails, productDetails);
          }
          setSpinnerActionDispatcher(false);
        } else {
          setSpinnerActionDispatcher(false);
        }
      }
    } else {
      // if (docType === "SELF_IMAGE") {
      //   setImageUploadStatus({ status: "failed", fileName: file?.name });
      // } else
      if (docType === "INSURANCE_COPY") {
        setInsuranceUploadStatus({
          status: "failed",
          fileName: file?.name
        });
      } else if (docType === "ADDRESS_PROOF") {
        setAddressProofUploadStatus({
          status: "failed",
          fileName: file?.name
        });
      }
      setSpinnerActionDispatcher(false);
    }
  };

  const onChangeAddressType = (value) => {
    setIsAddressTypeDisabled(!value);
  };

  const handleSubmitUploadedDocuments = async (e) => {
    setSpinnerActionDispatcher(true);
    if (orderId) {
      const submitDataset = submitUploadedData;

      const documentList = insuranceAvailability
        ? ["ADDRESS_PROOF"]
        : ["INSURANCE_COPY", "ADDRESS_PROOF"];
      submitDataset.input.address_type = getValues("address_type");
      submitDataset.input.type = documentList;
      setSubmitUploadedData(documentList);
      const updateSubmitResult = await setSubmitDocuments({
        variables: {
          order_id: orderId,
          ...submitDataset
        }
      });
      if (
        updateSubmitResult?.data &&
        updateSubmitResult?.data?.submitDocuments?.status
      ) {
        if (isAnalyticsEnabled) {
          ctaTracking(e, "ctaButtonClick", "Upload Documents");
          const documentDetails = {
            documentName: submitUploadedData.input.type
              .toString()
              .split(",")
              .join("|"),
            documentUploadStatus: "success"
          };
          // analyticsUtils.trackDocument(documentDetails);
        }
        setSpinnerActionDispatcher(false);
        showNotificationDispatcher({
          title: "Document Upload Succesful",
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
        window.location.href = ordersUrl;
      } else {
        showNotificationDispatcher({
          title: "Document Upload Failure. Please try again after sometime",
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        setTimeout(() => {
          window.location.href = ordersUrl;
        }, 1000);
        setSpinnerActionDispatcher(false);
      }
    } else {
      setSpinnerActionDispatcher(false);
    }
  };

  useEffect(() => {
    if (insuranceAvailability) {
      if (
        // imageUploadStatus?.status === "success" &&
        addressProofUploadStatus?.status === "success"
      ) {
        setShowContinueToDeliveryPopup(true);
      } else {
        setShowContinueToDeliveryPopup(false);
      }
    } else {
      if (
        // imageUploadStatus?.status === "success" &&
        insuranceUploadStatus?.status === "success" &&
        addressProofUploadStatus?.status === "success"
      ) {
        setShowContinueToDeliveryPopup(true);
      } else {
        setShowContinueToDeliveryPopup(false);
      }
    }
  }, [insuranceUploadStatus, addressProofUploadStatus]);

  const getAddressTypes = async () => {
    const result = await getAddressTypesData();
    setAddressOptions([...addressOptions, ...result]);
  };

  useEffect(() => {
    const aadharDigilockerUrl = window.sessionStorage.getItem(
      "aadharVerificationUrl"
    );
    setAadharVerificationUrl(aadharDigilockerUrl);
    getAddressTypes();
  }, []);

  useEffect(() => {
    if (orderId) {
      getOrderData({
        variables: {
          order_id: orderId,
          opportunity_id: opportunityId
        }
      });
    }
  }, [orderId, opportunityId]);

  useEffect(() => {
    if (aadharVerificationUrl) {
      setShowAadharVerificationPopup(false);
      setAadharFormValid(true);
    } else {
      setShowAadharVerificationPopup(true);
    }
  }, [aadharVerificationUrl]);

  const getSelectedScooter = async () => {
    const selectedVariant = bikeVariantDetails?.bikeVariants?.filter(
      (item) =>
        item?.variantName?.toLowerCase() === productData?.name?.toLowerCase()
    );
    const bikeVariant = selectedVariant[0]?.variantDetails
      ? selectedVariant[0]?.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(
      productData?.vaahan_color,
      bikeVariant
    );
    setActiveVariant(selectedBikeVariant);
  };

  useEffect(() => {
    getSelectedScooter();
  }, [productData]);

  return (
    <div className="document-upload-wrapper">
      <img
        className="document-upload-bg-img"
        src={
          isDesktop
            ? config.documentUploadBgDesktop
            : config.documentUploadBgMobile
        }
        alt="cancel_booking_bg"
      ></img>
      <div className="document-upload-container vida-2-container">
        <div className="document-upload-left-container">
          <Banner
            bannerBgImg={activeVariant?.bgImg}
            bikeName={productData?.name}
            onItsWayText={config?.onItsWayText}
            userName={userProfileInfo?.fname}
            bannerBikeImg={activeVariant?.bikeImg}
            optedBikeVariant={activeVariant}
          />
          <div className="document-upload-delivery-tracker-container">
            <DeliveryTracker
              config={config?.deliveryTrackerContent}
              progressStatus={progessStatus}
            />
          </div>
        </div>
        <div className="document-upload-right-container">
          <div className="document-upload-right-secondary-title">
            <p className="document-upload-right-secondary-title-text">
              {config?.uploadDocumentsTitle}
            </p>
          </div>
          <div className="document-upload-right-secondary-description">
            <p className="document-upload-right-secondary-description-text">
              {config?.uploadDocumentsDescription}
            </p>
          </div>
          <div className="document-upload-digilocker-container">
            <div className="digilocker-card-container">
              <p className="digilocker-card-primary-text">
                {config?.aadharDigilockerPrimaryText}
              </p>
              <p className="digilocker-card-secondary-text">
                {config?.aadharDigilockerSecondaryText}
              </p>
              <p className="digilocker-card-description-text">
                {config?.digilockerCardDescription}
              </p>
              <div
                className="digilocker-card-verification-btn"
                onClick={handleDigilockerVerification}
              >
                <div className="digilocker-logo">
                  <img src={config?.digilockerLogo} alt="digilocker_logo"></img>
                </div>
                <p className="verify-with-digilocker-text">
                  {config?.verifyDigilockerText}
                </p>
                <div className="digilocker-external-link-icon">
                  <img
                    src={config?.externalLinkIcon}
                    alt="external_link_icon"
                  ></img>
                </div>
              </div>
            </div>
            {/* <div className="digilocker-card-container">
              <p className="digilocker-card-primary-text">
                {config?.panDigilockerPrimaryText}
              </p>
              <p className="digilocker-card-secondary-text">
                {config?.panDigilockerSecondaryText}
              </p>
              <p className="digilocker-card-description-text">
                {config?.digilockerCardDescription}
              </p>
              <div
                className="digilocker-card-verification-btn"
                onClick={handleDigilockerVerification}
              >
                <div className="digilocker-logo">
                  <img src={config?.digilockerLogo} alt="digilocker_logo"></img>
                </div>
                <p className="verify-with-digilocker-text">
                  {config?.verifyDigilockerText}
                </p>
                <div className="digilocker-external-link-icon">
                  <img
                    src={config?.externalLinkIcon}
                    alt="external_link_icon"
                  ></img>
                </div>
              </div>
            </div> */}
          </div>
          <div className="document-upload-cards-container">
            {/* <div
              className={
                imageUploadStatus?.status === "success"
                  ? "upload-card-container image-card success"
                  : imageUploadStatus?.status === "failed"
                  ? "upload-card-container image-card failed"
                  : "upload-card-container image-card"
              }
            >
              <div className="upload-card-flex-container">
                <p className="upload-card-primary-text">
                  {config?.photoUploadPrimaryText}
                </p>
                <div
                  className="upload-btn"
                  onClick={handleOpenPhotoUploadPopup}
                >
                  <div className="upload-icon">
                    <img src={config?.uploadIconSm}></img>
                  </div>
                  <p className="upload-btn-label">
                    {imageUploadStatus?.status === "success" ||
                    imageUploadStatus?.status === "failed"
                      ? config?.reUploadText
                      : config?.uploadText}
                  </p>
                </div>
              </div>
              {imageUploadStatus?.fileName === "" ? (
                <>
                  <p className="upload-card-secondary-text">
                    {config?.photoUploadSecondaryText}
                  </p>
                  <p className="upload-card-description-text2">
                    {config?.uploadFileDescription1}
                  </p>
                  <p className="upload-card-description-text2">
                    {config?.uploadFileDescription2}
                  </p>
                </>
              ) : (
                <p className="upload-card-secondary-text">
                  {imageUploadStatus?.fileName}
                </p>
              )}
            </div> */}
            {!insuranceAvailability && (
              <div
                className={
                  insuranceUploadStatus?.status === "success"
                    ? "upload-card-container insurance-card success"
                    : insuranceUploadStatus?.status === "failed"
                    ? "upload-card-container insurance-card failed"
                    : "upload-card-container insurance-card"
                }
              >
                <div className="upload-card-flex-container">
                  <p className="upload-card-primary-text">
                    {config?.insuranceUploadPrimaryText}
                  </p>
                  <div
                    className="upload-btn"
                    onClick={handleOpenInsuranceUploadPopup}
                  >
                    <div className="upload-icon">
                      <img src={config?.uploadIconSm} alt="upload_icon"></img>
                    </div>
                    <p className="upload-btn-label">
                      {insuranceUploadStatus?.status === "success" ||
                      insuranceUploadStatus?.status === "failed"
                        ? config?.reUploadText
                        : config?.uploadText}
                    </p>
                  </div>
                </div>
                {insuranceUploadStatus?.fileName === "" ? (
                  <>
                    <p className="upload-card-secondary-text">
                      {config?.insuranceUploadSecondaryText}
                    </p>
                    <p className="upload-card-description-text2">
                      {config?.uploadFileDescription1}
                    </p>
                    <p className="upload-card-description-text2">
                      {config?.uploadFileDescription2}
                    </p>
                  </>
                ) : (
                  <p className="upload-card-secondary-text">
                    {insuranceUploadStatus?.fileName}
                  </p>
                )}
              </div>
            )}
            <div
              className={
                addressProofUploadStatus?.status === "success"
                  ? "upload-card-container address-proof-card success"
                  : addressProofUploadStatus?.status === "failed"
                  ? "upload-card-container address-proof-card failed"
                  : "upload-card-container address-proof-card"
              }
            >
              <div className="upload-card-flex-container">
                <p className="upload-card-primary-text">
                  {config?.addressProofUploadPrimaryText}
                </p>
                <div
                  className={`upload-btn ${
                    isAddressTypeDisabled ? "upload-btn-disabled" : ""
                  }`}
                  onClick={handleOpenAddressProofUploadPopup}
                >
                  <div className="upload-icon">
                    <img src={config?.uploadIconSm} alt="upload_icon"></img>
                  </div>
                  <p className="upload-btn-label">
                    {addressProofUploadStatus?.status === "success" ||
                    addressProofUploadStatus?.status === "failed"
                      ? config?.reUploadText
                      : config?.uploadText}
                  </p>
                </div>
              </div>
              {addressProofUploadStatus?.fileName === "" ? (
                <>
                  <div className="address-type-input-container">
                    {addressOptions && addressOptions.length ? (
                      <Dropdown
                        name="address_type"
                        value={getValues("address_type") || ""}
                        setValue={setValue}
                        options={addressOptions}
                        errors={errors}
                        register={register}
                        searchable
                        onChangeHandler={(name, value) =>
                          onChangeAddressType(value)
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <p className="upload-card-secondary-text">
                    {formattedAddress}
                  </p>
                  <p className="upload-card-description-text1">
                    {config?.uploadFileDescription3}
                  </p>
                  <p className="upload-card-description-text2">
                    {config?.uploadFileInsAddressDescrip}
                  </p>
                  <p className="upload-card-description-text2">
                    {config?.uploadFileDescription2}
                  </p>
                </>
              ) : (
                <p className="upload-card-secondary-text">
                  {addressProofUploadStatus?.fileName}
                </p>
              )}
            </div>
          </div>
          <div className="document-upload-right-title">
            <p className="document-upload-right-title-text">
              {config?.submitDocumentsTitle}
            </p>
          </div>
          <div className="document-upload-right-description">
            <p className="document-upload-right-description-text">
              {config?.submitDocumentsDescription}
            </p>
          </div>
          {dealerData && (
            <div className="dealer-card-container">
              {config?.dealerDesktopImg && (
                <div className="vida-dealers-card-img">
                  <img
                    src={
                      isDesktop
                        ? config?.dealerDesktopImg
                        : config?.dealerMobileImg
                    }
                    alt={config?.dealerImageAlt}
                    title={config?.dealerImageTitle}
                  ></img>
                </div>
              )}
              <div className="vida-dealers-details-container">
                <div className="dealers-type">
                  <p className="dealers-type-text">{dealerData.dealerType}</p>
                </div>
                <div className="dealers-card-title">
                  <p className="dealers-card-title-text">
                    {dealerData.dealerName}
                  </p>
                </div>
                <div className="dealers-card-address">
                  <p className="dealers-card-address-text">
                    {dealerData.dealerAddress}
                  </p>
                </div>
                <div className="dealers-card-get-direction-cta">
                  <a
                    href={`https://maps.mapmyindia.com/@${dealerData?.dealerLatitude},${dealerData?.dealerLongitude}`}
                    target="_blank"
                    className="dealers-card-get-direction-cta-text"
                    rel="noreferrer"
                  >
                    {config?.getDirectionsText}
                  </a>
                </div>
              </div>
            </div>
          )}
          {!isDesktop && aadharFormValid && showContinueToDeliveryPopup && (
            <div className="continue-to-delivey-btn-container">
              <button
                className="continue-to-delivey-btn"
                type="button"
                onClick={(e) => handleSubmitUploadedDocuments(e)}
              >
                {config?.continueToDeliveryText}
              </button>
            </div>
          )}
          <div className="upload-drawer-container">
            {showAadharVerificationPopup && (
              <Drawer>
                <div className="aadhar-verify-popup-container">
                  <div className="aadhar-verify-title-container">
                    <p className="aadhar-verify-normal-title">
                      {config?.aadharVerifyNormalTitle}
                    </p>
                    <p className="aadhar-verify-bold-title">
                      {config?.aadharVerifyBoldTitle}
                    </p>
                  </div>
                  <div className="aadhar-verify-content-container">
                    <p className="aadhar-verify-description">
                      {config?.aadharVerifyDescription}
                    </p>
                    <form
                      onSubmit={handleSubmit((formData, event) =>
                        handleAadharFormSubmit(formData, event)
                      )}
                    >
                      <div className="aadhar-verify-number-input-container">
                        <NumberField
                          name="aadharNumber"
                          label={config?.aadharField?.label}
                          placeholder={config?.aadharField?.placeholder}
                          validationRules={config?.aadharField?.validationRules}
                          register={register}
                          errors={errors}
                          value={""}
                          maxLength={
                            config?.aadharField?.validationRules?.maxLength
                              ?.value
                          }
                          isDisabled={false}
                          setValue={setValue}
                          onChangeHandler={(value) =>
                            handleAadharInputFieldChange("aadharNumber", value)
                          }
                        />
                      </div>
                      <button
                        className="aadhar-verify-confirm-btn"
                        type="submit"
                      >
                        {config?.confirmText}
                      </button>
                    </form>
                  </div>
                </div>
              </Drawer>
            )}
            {/* {showPhotoUploadPopup && aadharFormValid && (
              <Drawer>
                <div className="upload-popup-container">
                  <div className="upload-popup-content-container">
                    <p className="upload-popup-normal-title">
                      {config?.uploadInProgressText}
                    </p>
                    <p className="upload-popup-bold-title">
                      {config?.uploadPhotoText}
                    </p>
                    <div
                      className={
                        imageUploadStatus?.status === "failed"
                          ? "upload-file-container image-upload-file-container failed"
                          : "upload-file-container image-upload-file-container"
                      }
                    >
                      <div className="upload-file-content-container">
                        <div className="upload-icon">
                          <img
                            src={config?.uploadIconLg}
                            alt="upload_icon"
                          ></img>
                        </div>
                        <div className="upload-file-description-container">
                          <p className="upload-file-description">
                            {config?.uploadFileDescription1}
                          </p>
                          <p className="upload-file-description">
                            {config?.uploadFileDescription2}
                          </p>
                        </div>
                      </div>
                    </div>
                    {imageUploadStatus?.status === "failed" ? (
                      <p className="upload-error-msg">
                        {config?.validDocumentErrorMsg}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="upload-popup-btn-container">
                    <div className="upload-file-btn">
                      <p className="upload-btn-label">{config?.uploadText}</p>
                      <FileBase64
                        hidden
                        id="upload-file-input-btn"
                        type="file"
                        multiple={false}
                        onDone={(file) => setUploadDocument(file, "SELF_IMAGE")}
                      />
                    </div>
                    <button
                      className="upload-cancel-btn"
                      type="button"
                      onClick={handleCloseUploadPopup}
                    >
                      {config?.cancelText}
                    </button>
                  </div>
                </div>
              </Drawer>
            )} */}
            {showInsuranceUploadPopup && aadharFormValid && (
              <Drawer>
                <div className="upload-popup-container">
                  <div className="upload-popup-content-container">
                    <p className="upload-popup-normal-title">
                      {config?.uploadInProgressText}
                    </p>
                    <p className="upload-popup-bold-title">
                      {config?.uploadInsuranceText}
                    </p>
                    <div
                      className={
                        insuranceUploadStatus?.status === "failed"
                          ? "upload-file-container insurance-upload-file-container failed"
                          : "upload-file-container insurance-upload-file-container"
                      }
                    >
                      <div className="upload-file-content-container">
                        <div className="upload-icon">
                          <img
                            src={config?.uploadIconLg}
                            alt="upload_icon"
                          ></img>
                        </div>
                        <div className="upload-file-description-container">
                          <p className="upload-file-description">
                            {config?.uploadFileInsAddressDescrip}
                          </p>
                          <p className="upload-file-description">
                            {config?.uploadFileDescription2}
                          </p>
                        </div>
                      </div>
                    </div>
                    {insuranceUploadStatus?.status === "failed" ? (
                      <p className="upload-error-msg">
                        {config?.validDocumentErrorMsg}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="upload-popup-btn-container">
                    <div className="upload-file-btn">
                      <p className="upload-btn-label">{config?.uploadText}</p>
                      <FileBase64
                        hidden
                        id="upload-file-input-btn"
                        type="file"
                        multiple={false}
                        onDone={(file) =>
                          setUploadDocument(file, "INSURANCE_COPY")
                        }
                      />
                    </div>
                    <button
                      className="upload-cancel-btn"
                      type="button"
                      onClick={handleCloseUploadPopup}
                    >
                      {config?.cancelText}
                    </button>
                  </div>
                </div>
              </Drawer>
            )}
            {showAddressProofUploadPopup && aadharFormValid && (
              <Drawer>
                <div className="upload-popup-container">
                  <div className="upload-popup-content-container">
                    <p className="upload-popup-normal-title">
                      {config?.uploadInProgressText}
                    </p>
                    <p className="upload-popup-bold-title">
                      {config?.uploadAddressProofText}
                    </p>
                    <div
                      className={
                        addressProofUploadStatus?.status === "failed"
                          ? "upload-file-container address-proof-upload-file-container failed"
                          : "upload-file-container address-proof-upload-file-container"
                      }
                    >
                      <div className="upload-file-content-container">
                        <div className="upload-icon">
                          <img
                            src={config?.uploadIconLg}
                            alt="upload_icon"
                          ></img>
                        </div>
                        <div className="upload-file-description-container">
                          <p className="upload-file-description">
                            {config?.uploadFileInsAddressDescrip}
                          </p>
                          <p className="upload-file-description">
                            {config?.uploadFileDescription2}
                          </p>
                        </div>
                      </div>
                    </div>
                    {addressProofUploadStatus?.status === "failed" ? (
                      <p className="upload-error-msg">
                        {config?.validDocumentErrorMsg}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="upload-popup-btn-container">
                    <div className="upload-file-btn">
                      <p className="upload-btn-label">{config?.uploadText}</p>
                      <FileBase64
                        hidden
                        id="upload-file-input-btn"
                        type="file"
                        multiple={false}
                        onDone={(file) =>
                          setUploadDocument(file, "ADDRESS_PROOF")
                        }
                      />
                    </div>
                    <button
                      className="upload-cancel-btn"
                      type="button"
                      onClick={handleCloseUploadPopup}
                    >
                      {config?.cancelText}
                    </button>
                  </div>
                </div>
              </Drawer>
            )}
            {isDesktop && showContinueToDeliveryPopup && aadharFormValid && (
              <Drawer>
                <div className="continue-to-delivey-btn-container">
                  <button
                    className="continue-to-delivey-btn"
                    type="button"
                    onClick={(e) => handleSubmitUploadedDocuments(e)}
                  >
                    {config?.continueToDeliveryText}
                  </button>
                </div>
              </Drawer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userProfileDataReducer,
  purchaseConfigReducer,
  preBookingReducer
}) => {
  return {
    userProfileInfo: {
      fname: userProfileDataReducer?.fname,
      lname: userProfileDataReducer?.lname
    },
    billingAddressDetail: purchaseConfigReducer.billingAddresses,
    productData: purchaseConfigReducer.productData,
    productID: purchaseConfigReducer.productId,
    dealerData: {
      dealerName: preBookingReducer?.dealerName,
      dealerAddress: preBookingReducer?.dealerAddress,
      dealerLatitude: preBookingReducer.latitude,
      dealerLongitude: preBookingReducer.longitude,
      dealerType: preBookingReducer.type
    }
  };
};

DocumentUpload.propTypes = {
  config: PropTypes.shape({
    documentUploadBgDesktop: PropTypes.string,
    documentUploadBgMobile: PropTypes.string,
    bannerBgImg: PropTypes.string,
    onItsWayText: PropTypes.string,
    bannerBikeImg: PropTypes.string,
    submitDocumentsTitle: PropTypes.string,
    submitDocumentsDescription: PropTypes.string,
    uploadDocumentsTitle: PropTypes.string,
    uploadDocumentsDescription: PropTypes.string,
    aadharDigilockerPrimaryText: PropTypes.string,
    aadharDigilockerSecondaryText: PropTypes.string,
    digilockerCardDescription: PropTypes.string,
    digilockerLogo: PropTypes.string,
    verifyDigilockerText: PropTypes.string,
    externalLinkIcon: PropTypes.string,
    panDigilockerPrimaryText: PropTypes.string,
    panDigilockerSecondaryText: PropTypes.string,
    photoUploadPrimaryText: PropTypes.string,
    photoUploadSecondaryText: PropTypes.string,
    uploadIconSm: PropTypes.string,
    uploadText: PropTypes.string,
    reUploadText: PropTypes.string,
    addressDropdownLabel: PropTypes.string,
    uploadFileDescription1: PropTypes.string,
    uploadFileDescription2: PropTypes.string,
    insuranceUploadPrimaryText: PropTypes.string,
    insuranceUploadSecondaryText: PropTypes.string,
    addressProofUploadPrimaryText: PropTypes.string,
    uploadFileDescription3: PropTypes.string,
    uploadInProgressText: PropTypes.string,
    uploadPhotoText: PropTypes.string,
    uploadInsuranceText: PropTypes.string,
    uploadAddressProofText: PropTypes.string,
    uploadIconLg: PropTypes.string,
    cancelText: PropTypes.string,
    validDocumentSuccessMsg: PropTypes.string,
    validDocumentErrorMsg: PropTypes.string,
    aadharVerifyNormalTitle: PropTypes.string,
    aadharVerifyBoldTitle: PropTypes.string,
    aadharVerifyDescription: PropTypes.string,
    aadharField: PropTypes.object,
    confirmText: PropTypes.string,
    continueToDeliveryText: PropTypes.string,
    deliveryTrackerContent: PropTypes.object,
    dealerDesktopImg: PropTypes.string,
    dealerMobileImg: PropTypes.string,
    dealerImageAlt: PropTypes.string,
    dealerImageTitle: PropTypes.string,
    getDirectionsText: PropTypes.string,
    uploadFileInsAddressDescrip: PropTypes.string,
    bikeVariantDetails: PropTypes.object
  }),
  userProfileInfo: PropTypes.object,
  billingAddressDetail: PropTypes.object,
  productData: PropTypes.object,
  dealerData: PropTypes.shape({
    dealerName: PropTypes.string,
    dealerAddress: PropTypes.string,
    dealerLatitude: PropTypes.string,
    dealerLongitude: PropTypes.string,
    dealerType: PropTypes.string
  }),
  productID: PropTypes.string
};

export default connect(mapStateToProps)(DocumentUpload);
