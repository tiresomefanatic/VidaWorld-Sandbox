import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import InputField from "../form/InputField/InputField";
import PropTypes from "prop-types";
import {
  cryptoUtils,
  RSAUtils
} from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  useGetAadharVerified,
  useCreateAadharVerification,
  useVerifySignzyValue
} from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { useUserData } from "../../hooks/userProfile/userProfileHooks";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import Logger from "../../../services/logger.service";
import CONSTANT from "../../../site/scripts/constant";

const AadharVerification = (props) => {
  const {
    config: {
      title,
      subtext1,
      subtext2,
      subtext3,
      subtext4,
      aadharNoField,
      buttonText,
      buttonTextManual,
      isOptimizedJourneyEnabled
    },
    aadharVerified
  } = props;
  const aadharInputBtnRef = useRef(null);
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

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  //call api as per opportunity id
  //get if aadhar verified or not
  //if not verified show page
  //if verified redirect to PCconfig
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const queryString = location.href.split("?")[1];
  let decryptedNewParams = "";
  let decryptedParams = "";
  if (queryString.includes("&requestId=")) {
    decryptedNewParams =
      queryString &&
      cryptoUtils.decrypt(
        decodeURIComponent(queryString.split("&requestId=")[0])
      );

    decryptedParams =
      queryString && cryptoUtils.decrypt(decodeURIComponent(queryString));
  } else {
    // decryptedNewParams =
    //   queryString && cryptoUtils.decrypt(queryString.split("&requestId=")[0]);
    decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  }

  const newParams = new URLSearchParams("?" + decryptedNewParams);

  const paramsSignzy = new URLSearchParams("?" + queryString);

  const params = new URLSearchParams("?" + decryptedParams);
  const [isVerifyCheckDone, setVerifyCheckDone] = useState(false);
  const getAadharVerified = useGetAadharVerified(setVerifyCheckDone);
  const getUserData = useUserData();
  const verifySignzy = useVerifySignzyValue();
  const purchaseConfigUrl = appUtils.getPageUrl("purchaseConfigUrl");
  const billingPricingNewUrl = appUtils.getPageUrl("billingPricingNewUrl");
  const redirectUrl = isOptimizedJourneyEnabled
    ? billingPricingNewUrl
    : purchaseConfigUrl;

  const paramsOpportunityId = params.get("opportunityId");
  const encryptedOpportunityId = cryptoUtils.encrypt(
    params.get("opportunityId")
  );
  const handleRedirection = () => {
    let encryptParams = [
      "orderId=",
      params.get("orderId"),
      "&opportunityId=",
      params.get("opportunityId")
    ].join("");
    if (queryString.includes("&requestId=")) {
      encryptParams = [
        "orderId=",
        newParams.get("orderId"),
        "&opportunityId=",
        newParams.get("opportunityId")
      ].join("");
    }

    const encryptedParams = cryptoUtils.encrypt(encryptParams);
    window.location.href = redirectUrl + "?" + encryptedParams;
  };
  useEffect(() => {
    if (
      params &&
      paramsOpportunityId &&
      encryptedOpportunityId &&
      !(
        paramsSignzy &&
        paramsSignzy.get("requestId") &&
        paramsSignzy.get("status")
      ) &&
      !isVerifyCheckDone
    ) {
      setSpinnerActionDispatcher(true);

      const verifyAadhar = () => {
        // const aadharVerified =
        getAadharVerified({
          variables: {
            opportunity_id: `${params.get("opportunityId")}`
          }
        });
      };

      verifyAadhar();
    } else if (
      newParams &&
      newParams.get("opportunityId") &&
      paramsSignzy &&
      paramsSignzy.get("requestId") &&
      paramsSignzy.get("status") &&
      newParams.get("orderId")
    ) {
      //from signzy when returned check params and send to api
      setSpinnerActionDispatcher(true);

      const paramRequestId = paramsSignzy.get("requestId");
      const paramStatus = paramsSignzy.get("status");

      const signzyResHandling = async () => {
        const verifySignzyRes = await verifySignzy({
          variables: {
            opportunity_id: `${newParams.get("opportunityId")}`,
            order_id: `${newParams.get("orderId")}`,
            request_id: paramRequestId,
            status: paramStatus
          }
        });

        //if success redirect or show error with aadhar number as blank
        if (verifySignzyRes?.data?.OpUpdateAadharStatus?.status === "200") {
          handleRedirection();
        } else if (verifySignzyRes?.data?.OpUpdateAadharStatus?.message) {
          setSpinnerActionDispatcher(false);
          setError("aadharNo", {
            type: "custom",
            message: verifySignzyRes?.data?.OpUpdateAadharStatus?.message
          });
        } else {
          setSpinnerActionDispatcher(false);
          setError("aadharNo", {
            type: "custom",
            message: aadharNoField.validationRules.customValidation.message
          });
        }
      };
      signzyResHandling();
    } else {
      setSpinnerActionDispatcher(false);
      window.location.href = profileUrl;
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (isVerifyCheckDone) {
      if (isAnalyticsEnabled) {
        const additionalPageName = ":Aadhar Verification";
        analyticsUtils.trackAadharVerificationPageLoad(
          additionalPageName,
          aadharVerified
        );
      }

      if (aadharVerified) {
        handleRedirection();
      }
    }
  }, [aadharVerified, isVerifyCheckDone]);

  // get aadhar number with basic number validation in ui

  const generateAadhaarVerificationUrl = useCreateAadharVerification();

  const updateAadharNo = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  // get aadhar number with basic number validation in ui
  //submit aadhar number to api
  const handleFormSubmit = async (formData, e) => {
    e.preventDefault();
    const formDataAadharNo =
      formData && formData.aadharNo && formData.aadharNo.replace(/ /g, ""); // In UI, we are showing space splitted number which is not required to send in the API

    if (formDataAadharNo && !CONSTANT.AADHAAR_REGEX.test(formDataAadharNo)) {
      //if user enters invalid aadharNo
      setError("aadharNo", {
        type: "custom",
        message:
          aadharNoField.validationRules.customValidation.inValidAadharMessage
      });
      return;
    }
    try {
      setSpinnerActionDispatcher(true);

      if (formData && formData.aadharNo) {
        let requestData = encodeURIComponent(queryString);
        if (paramsSignzy.get("requestId")) {
          requestData = queryString.split("&requestId=")[0];
        }
        const encryptedAadharNo = RSAUtils.encrypt(formDataAadharNo);
        const updateResult = await generateAadhaarVerificationUrl({
          variables: {
            opportunity_id: `${params.get("opportunityId")}`,
            aadhaar_number: `${encryptedAadharNo}`,
            request_data: `${requestData}`
          }
        });

        setSpinnerActionDispatcher(false);
        //get response true then redirect to signzy
        if (updateResult?.data?.generateAadhaarVerificationUrl?.url) {
          if (isAnalyticsEnabled) {
            const customLink = {
              name: "Submit",
              position: "Middle",
              type: "Button",
              clickType: "other"
            };
            const location = {
              state: "",
              city: "",
              pinCode: "",
              country: ""
            };
            const productDetails = {
              modelVariant: "",
              modelColor: "",
              productID: "",
              startingPrice: ""
            };
            const additionalPageName = ":Aadhar Verification";
            const additionalJourneyName = "Aadhar Submit";
            analyticsUtils.trackCustomButtonClick(
              customLink,
              location,
              productDetails,
              additionalPageName,
              additionalJourneyName,
              function () {
                window.location.href =
                  updateResult.data.generateAadhaarVerificationUrl.url;
              }
            );
          } else {
            window.location.href =
              updateResult.data.generateAadhaarVerificationUrl.url;
          }
        } else if (
          updateResult?.data?.generateAadhaarVerificationUrl?.message
        ) {
          setSpinnerActionDispatcher(false);
          setError("aadharNo", {
            type: "custom",
            message: updateResult?.data?.generateAadhaarVerificationUrl?.message
          });
        } else {
          //if response false then show error
          setSpinnerActionDispatcher(false);
          setError("aadharNo", {
            type: "custom",
            message: aadharNoField.validationRules.customValidation.message
          });
        }
      }
    } catch (error) {
      setSpinnerActionDispatcher(false);
      setError("aadharNo", {
        type: "custom",
        message: aadharNoField.validationRules.customValidation.message
      });
      Logger.error(error.message);
    }
  };

  const onKeyDownAadharField = (e) => {
    if (e.keyCode === 13) {
      aadharInputBtnRef.current.click();
      return;
    }
    const aadharNoHtmlField = document.querySelector('input[name="aadharNo"]');
    //it is used to detect the value is selected/highlighted and replace..that time we are not required to validate length
    //this will be true/selectedvalue when user selectes the value to replace

    const isSelectedValue = aadharNoHtmlField.value.substring(
      aadharNoHtmlField.selectionStart,
      aadharNoHtmlField.selectionEnd
    );
    if (
      (!isSelectedValue &&
        e.target.value.length >= 14 &&
        e.keyCode !== 46 && // keycode for delete
        e.keyCode !== 8) || // keycode for backspace
      (!(e.metaKey || e.ctrlKey) &&
        (e.key < "0" ||
          (e.key > "9" &&
            e.keyCode !== 46 && // keycode for delete
            e.keyCode !== 8)))
    ) {
      e.preventDefault();
      return;
    }
    const updatedVal = e.target.value
      .replace(/\D/g, "")
      .split(/(?:([\d]{4}))/g)
      .filter((s) => s.length > 0)
      .join(" ");
    document.querySelector('input[name="aadharNo"]').value = updatedVal;
  };

  const formId = "aadhar-verification-form";
  return (
    <div className="vida-aadhar-verification bg-color--smoke-white">
      <div className="vida-container">
        <div className="vida-aadhar-verification__payment">
          <div className="vida-aadhar-verification__wrapper">
            <div>
              <div className="vida-aadhar-verification__title">
                <h2>{title}</h2>
              </div>
              <div className="vida-aadhar-verification__subtext">
                <h4>{subtext1}</h4>
                <h4>{subtext2}</h4>
                <h4>{subtext3}</h4>
                {subtext4 && <h4>{subtext4}</h4>}
              </div>
              <div className="vida-aadhar-verification__billing">
                <form
                  id={formId}
                  className="form vida-billing-shipping-details__form"
                  onSubmit={handleSubmit((formData, event) => {
                    handleFormSubmit(formData, event);
                  })}
                >
                  <InputField
                    autoFocus
                    name="aadharNo"
                    label={aadharNoField.label}
                    placeholder={aadharNoField.placeholder}
                    validationRules={aadharNoField.validationRules}
                    onChangeHandler={(name, value) => {
                      updateAadharNo("aadharNo", value);
                    }}
                    register={register}
                    errors={errors}
                    maxLength={aadharNoField.validationRules.minLength.value}
                    setValue={setValue}
                    onKeyDown={onKeyDownAadharField}
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    ref={aadharInputBtnRef}
                  >
                    {buttonText}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handleRedirection}
                  >
                    {buttonTextManual}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return { aadharVerified: purchaseConfigReducer.aadharVerified };
};

AadharVerification.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    subtext1: PropTypes.string,
    subtext2: PropTypes.string,
    subtext3: PropTypes.string,
    subtext4: PropTypes.string,
    errorMsg: PropTypes.string,
    aadharNoField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    buttonText: PropTypes.string,
    buttonTextManual: PropTypes.string,
    isOptimizedJourneyEnabled: PropTypes.bool
  }),
  aadharVerified: PropTypes.bool
};

export default connect(mapStateToProps)(AadharVerification);
