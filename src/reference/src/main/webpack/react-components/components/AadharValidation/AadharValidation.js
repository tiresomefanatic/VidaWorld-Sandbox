import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useValidateAadhar } from "../../hooks/validateAadhar/validateAadharHooks";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";

const aadharValidation = (props) => {
  const { config } = props;
  const [orderId, setOrderId] = useState("");
  const getAadharSignzy = useValidateAadhar();
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const queryString = location.href.split("?")[1];

  useEffect(() => {
    if (queryString) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      if (params && params.get("orderId")) {
        setOrderId(params.get("orderId"));
      } else {
        window.location.href = profileUrl;
      }
    } else {
      window.location.href = profileUrl;
    }
  }, []);

  const handleAadharValidate = async () => {
    setSpinnerActionDispatcher(true);
    const result = await getAadharSignzy({
      variables: {
        order_id: orderId
      }
    });
    if (result && result.data && result.data.CreateUrl) {
      setSpinnerActionDispatcher(false);
      window.location.href = result.data.CreateUrl.url;
    }
  };

  return (
    <div className="vida-container">
      <div className="vida-validate-aadhar">
        <div className="vida-validate-aadhar__details-wrapper">
          <div className="vida-validate-aadhar__heading-wrapper">
            <h2 className="vida-validate-aadhar__heading">{config.title}</h2>
          </div>
          <button className="btn btn--primary" onClick={handleAadharValidate}>
            {config.primaryBtn.label}
          </button>
        </div>
      </div>
    </div>
  );
};

aadharValidation.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    primaryBtn: PropTypes.object
  })
};

export default aadharValidation;
