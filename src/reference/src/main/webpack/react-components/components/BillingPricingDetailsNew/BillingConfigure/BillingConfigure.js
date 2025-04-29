import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";

const BillingConfigure = (props) => {
  const {
    configureConfig: { mainText, yesBtn, noBtn },
    productDataDetails
  } = props;

  const [fadeOutConfigure, setFadeOutConfigure] = useState(false);
  const imgPath = appUtils.getConfig("imgPath");

  const configurationUrl = appUtils.getPageUrl("configurationUrl");
  const handleConfigScooter = () => {
    window.location.href = configurationUrl;
  };

  return (
    <>
      <div className="vida-billing-configure__container">
        <div
          className={
            "vida-billing-configure__wrapper " +
            (fadeOutConfigure ? " vida-billing-configure-fadeout" : "")
          }
        >
          {/* COMMENTING OUT AS OF STORY EMBU-2287 #5 */}
          <div className="vida-billing-configure__primary">
            {productDataDetails.eccentricImage ? (
              <img
                className="vida-billing-configure__product-image"
                src={productDataDetails.eccentricImage}
                alt={productDataDetails.name}
              />
            ) : (
              <img
                className="vida-billing-configure__product-image"
                src={imgPath + productDataDetails.variantSku + ".png"}
                alt={productDataDetails.name}
              />
            )}
            <div className="vida-billing-configure__product-title">
              <h3>{productDataDetails.name}</h3>
            </div>
          </div>
          <div className="vida-billing-configure__secondary">
            <div className="vida-billing-configure__product-info-new">
              <h3>{mainText}</h3>
            </div>
            <div className="vida-billing-configure__buttons">
              <button
                className="btn btn--primary"
                role="button"
                onClick={() => handleConfigScooter()}
              >
                {yesBtn}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => setFadeOutConfigure(true)}
              >
                {noBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    productDataDetails: purchaseConfigReducer.productData
    // insuranceDetails: purchaseConfigReducer.insurance
  };
};

BillingConfigure.propTypes = {
  configureConfig: PropTypes.object,
  productDataDetails: PropTypes.object
};

export default connect(mapStateToProps)(BillingConfigure);
