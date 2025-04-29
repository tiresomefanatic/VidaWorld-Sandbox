import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setScooterInfoAction } from "../../../../react-components/store/scooterInfo/scooterInfoActions";
import appUtils from "../../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import VidaToolTip from "../VidaToolTip/VidaToolTip";

const ScooterInfo = (props) => {
  const {
    scooterInfoConfig,
    genericConfig,
    isImgLeftLayout,
    isColorVariantLayout,
    isPriceVariant,
    isSpecificationLayout,
    productData,
    setScooterInfo,
    isActiveScooterModel,
    defaultSelection,
    isPincodePage,
    isBookingSummaryPage,
    selectedScooterData,
    myScooter,
    setActiveVariantParent,
    activeVariantParent,
    isOnStepThree,
    handleChangeVariant,
    isSimpleLayout,
    startAnalyticsHandler,
    handleColorChange
  } = props;
  const imgPath = appUtils.getConfig("imgPath");
  const isLoggedIn = loginUtils.isSessionActive();

  const CustomBuyNowTag = genericConfig?.priceHelperTag || "p";

  let selectedSkuIndex = "";
  if (isPincodePage && isActiveScooterModel && selectedScooterData.sku) {
    const selectedSku = selectedScooterData?.selectedVariant?.product.sku;
    selectedSkuIndex = selectedScooterData.variants.findIndex(
      (obj) => obj.product.sku === selectedSku
    );
  }

  if (isBookingSummaryPage && isActiveScooterModel) {
    const selectedSku = productData.selectedVariant.product.sku;
    selectedSkuIndex = productData.variants.findIndex(
      (obj) => obj.product.sku === selectedSku
    );
  }

  let selectedVariant = 0;
  if (
    isLoggedIn &&
    myScooter?.configuredScooterName &&
    myScooter?.configuredSKUId
  ) {
    if (productData.name === myScooter.configuredScooterName) {
      selectedVariant = productData.variants.findIndex(
        (variant) => variant.product.sf_id === myScooter.configuredSKUId
      );
    }
  } else {
    selectedVariant = productData.variants[defaultSelection]
      ? defaultSelection
      : 0;
  }
  const [activeVariant, setActiveVariant] = useState(
    isActiveScooterModel && activeVariantParent
      ? activeVariantParent
      : selectedSkuIndex
      ? selectedSkuIndex
      : selectedVariant
  );
  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");
  const [variantColor, setVariantColor] = useState(
    productData.variants[
      isActiveScooterModel && activeVariantParent
        ? activeVariantParent
        : selectedSkuIndex
        ? selectedSkuIndex
        : selectedVariant
    ]?.product?.vaahan_color
  );

  useEffect(() => {
    // Removing as part of EMBU-2247
    if (activeVariant !== activeVariantParent) {
      setActiveVariant(activeVariantParent);
      setVariantColor(
        productData.variants[activeVariantParent]?.product?.vaahan_color
      );
    }
  }, [activeVariantParent]);

  const productColors = appUtils.getConfig("productColorCodes");

  const handleModel = (e) => {
    e.preventDefault();
    if (!isActiveScooterModel && isImgLeftLayout) {
      const data = {
        name: productData.name,
        sku: productData.sku,
        sf_id: productData.sf_id,
        variants: productData.variants,
        selectedVariant: productData.variants[activeVariant]
      };

      setScooterInfo(data);
      props.activeScooterHandler && props.activeScooterHandler(productData);
    }
  };

  const handleVariant = (e, variantData, index) => {
    e.stopPropagation();
    setVariantColor(variantData.product?.vaahan_color);
    setActiveVariant(index);
    setActiveVariantParent(index);
    handleColorChange(variantData.product?.vaahan_color);

    const data = {
      name: productData.name,
      sku: productData.sku,
      sf_id: productData.sf_id,
      variants: productData.variants,
      selectedVariant: productData.variants[index]
    };

    setScooterInfo(data);
    // window.sessionStorage.setItem("scooterOrderInfo", JSON.stringify(data));

    if (!isActiveScooterModel && isImgLeftLayout) {
      props.activeScooterHandler && props.activeScooterHandler(productData);
    }
  };

  useEffect(() => {
    if (isActiveScooterModel && isImgLeftLayout) {
      const data = {
        name: productData.name,
        sku: productData.sku,
        sf_id: productData.sf_id,
        variants: productData.variants,
        selectedVariant: productData.variants[activeVariant]
      };

      setScooterInfo(data);
      // window.sessionStorage.setItem("scooterOrderInfo", JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (isActiveScooterModel && isImgLeftLayout) {
      const data = {
        name: productData.name,
        sku: productData.sku,
        sf_id: productData.sf_id,
        variants: productData.variants,
        selectedVariant: productData.variants[activeVariant]
      };

      setScooterInfo(data);
      // window.sessionStorage.setItem("scooterOrderInfo", JSON.stringify(data));
    }
  }, [productData?.variants[activeVariant]?.product.city]);

  const variantChange = (e, variant, variantIndex) => {
    `${isImgLeftLayout ? handleVariant(e, variant, variantIndex) : ""}`;
    startAnalyticsHandler && startAnalyticsHandler();
  };

  return (
    <div>
      {isColorVariantLayout && (
        <div className="scooter__color-container">
          {productData.variants.map((variant, variantIndex) => (
            <div
              key={variantIndex}
              className={`${
                activeVariant === variantIndex ? "scooter__colors-outline" : ""
              }`}
              style={{
                borderColor:
                  variant?.attributes[0]?.label === "White"
                    ? "black"
                    : getProductColor[variant?.attributes[0]?.label]
              }}
            >
              <button
                className={`scooter__colors ${
                  activeVariant === variantIndex
                    ? "scooter__colors-selected"
                    : ""
                } ${
                  variant?.attributes[0]?.label == "White" &&
                  activeVariant !== variantIndex
                    ? "scooter__black-border"
                    : "none"
                }`}
                key={variantIndex}
                style={{
                  background: `${
                    getProductColor[variant?.attributes[0]?.label]
                  }`
                }}
                onClick={(e) => {
                  variantChange(e, variant, variantIndex);
                }}
                onKeyPress={(e) => {
                  if (e.which === 13) {
                    variantChange(e, variant, variantIndex);
                  }
                }}
              ></button>
            </div>
          ))}
        </div>
      )}
      {isPriceVariant && (
        <div
          className="buy-now-pre-booking-vida2__price-lists"
          style={{
            borderBottom: `${productData?.name == "V1 PLUS" ? "none" : ""}`
          }}
        >
          <div className="buy-now-pre-booking-vida2__price-label">
            <CustomBuyNowTag className="buy-now-pre-booking-vida2__price-label-text">
              {genericConfig?.buyLabel1}&nbsp;
              {productData?.name}&nbsp;
              {genericConfig?.buyLabel2}
            </CustomBuyNowTag>
          </div>
          <div className="buy-now-pre-booking-vida2__price-wrapper">
            <p className="buy-now-pre-booking-vida2__price">
              {productData.variants.map((variant, variantIndex) => (
                <span key={variantIndex}>
                  {activeVariant === variantIndex && (
                    <span>
                      {variant?.product?.price?.split(".")[0] ||
                        currencyUtils.getCurrencyFormatValue(0).split(".")[0]}
                      <VidaToolTip
                        index={variantIndex}
                        componentName="scooter"
                      />
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="buy-now-pre-booking-vida2__showroom-text">
              {scooterInfoConfig?.priceType}
            </p>
          </div>
        </div>
      )}
      {isSpecificationLayout && (
        <div className="buy-now-pre-booking-vida2__product-specification">
          <div className="buy-now-pre-booking-vida2__specifications-container">
            <div className="buy-now-pre-booking-vida2__specifications-wrapper">
              <div className="buy-now-pre-booking-vida2__specification-icon">
                <img
                  src={scooterInfoConfig?.product?.inClineCapacityIcon}
                  alt="specification Value"
                ></img>
              </div>
              <div className="buy-now-pre-booking-vida2__specification-detail-wrapper">
                <p className="buy-now-pre-booking-vida2__specification-text">
                  {scooterInfoConfig?.product?.inClineCapacity}
                </p>
                <div className="buy-now-pre-booking-vida2__specification-value-wrapper">
                  <p className="buy-now-pre-booking-vida2__specification-value">
                    {productData?.incline_capacity?.split(" ")?.slice(0, 1)}
                  </p>
                  <p className="buy-now-pre-booking-vida2__specification-unit">
                    {productData?.incline_capacity?.split(" ")?.slice(1, 2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="buy-now-pre-booking-vida2__specifications-wrapper">
              <div className="buy-now-pre-booking-vida2__specification-icon">
                <img
                  src={scooterInfoConfig?.product?.rangeIcon}
                  alt="specification Value"
                ></img>
              </div>
              <div className="buy-now-pre-booking-vida2__specification-detail-wrapper">
                {scooterInfoConfig.product.enableCertifiedRange ? (
                  <>
                    <p className="buy-now-pre-booking-vida2__specification-text">
                      {scooterInfoConfig?.product?.certifiedRange}
                    </p>
                    <div className="buy-now-pre-booking-vida2__specification-value-wrapper">
                      <p className="buy-now-pre-booking-vida2__specification-value">
                        {productData?.variants[0]?.product?.rangewmtc_c?.replace(
                          /[A-Za-z]/g,
                          ""
                        )}
                      </p>
                      <p className="buy-now-pre-booking-vida2__specification-unit">
                        {productData?.variants[0]?.product?.rangewmtc_c?.replace(
                          /[0-9.]/g,
                          ""
                        ) + "*"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="buy-now-pre-booking-vida2__specification-text">
                      {scooterInfoConfig?.product?.range}
                    </p>
                    <div className="buy-now-pre-booking-vida2__specification-value-wrapper">
                      <p className="buy-now-pre-booking-vida2__specification-value">
                        {productData?.variants[0]?.product?.range
                          ?.split(" ")
                          ?.slice(0, 1)}
                      </p>
                      <p className="buy-now-pre-booking-vida2__specification-unit">
                        {productData?.variants[0]?.product?.range
                          ?.split(" ")
                          ?.slice(1, 2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="buy-now-pre-booking-vida2__specifications-container">
            <div className="buy-now-pre-booking-vida2__specifications-wrapper">
              <div className="buy-now-pre-booking-vida2__specification-icon">
                <img
                  src={scooterInfoConfig?.product?.topSpeedIcon}
                  alt="specification Value"
                ></img>
              </div>
              <div className="buy-now-pre-booking-vida2__specification-detail-wrapper">
                <p className="buy-now-pre-booking-vida2__specification-text">
                  {scooterInfoConfig?.product?.topSpeed}
                </p>
                <div className="buy-now-pre-booking-vida2__specification-value-wrapper">
                  <p className="buy-now-pre-booking-vida2__specification-value">
                    {productData?.variants[0]?.product?.top_speed
                      ?.split(" ")
                      ?.slice(0, 1)}
                  </p>
                  <p className="buy-now-pre-booking-vida2__specification-unit">
                    {productData?.variants[0]?.product?.top_speed
                      ?.split(" ")
                      ?.slice(1, 2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="buy-now-pre-booking-vida2__specifications-wrapper">
              <div className="buy-now-pre-booking-vida2__specification-icon">
                <img
                  src={scooterInfoConfig?.product?.removableBatteriesIcon}
                  alt="specification Value"
                ></img>
              </div>
              <div className="buy-now-pre-booking-vida2__specification-detail-wrapper">
                {productData?.variants[0]?.product?.name.includes("V2 LITE") ? (
                  <p className="buy-now-pre-booking-vida2__specification-text">
                    {scooterInfoConfig?.product?.removableBattery}
                  </p>
                ) : (
                  <p className="buy-now-pre-booking-vida2__specification-text">
                    {scooterInfoConfig?.product?.removableBatteries}
                  </p>
                )}
                <div className="buy-now-pre-booking-vida2__specification-value-wrapper">
                  <p className="buy-now-pre-booking-vida2__specification-value">
                    {productData?.battery_capacity?.split(" ")?.slice(0, 1)}
                  </p>
                  <p className="buy-now-pre-booking-vida2__specification-unit">
                    {productData?.battery_capacity?.split(" ")?.slice(1, 2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setScooterInfo: (data) => {
      dispatch(setScooterInfoAction(data));
    }
  };
};

ScooterInfo.propTypes = {
  genericConfig: PropTypes.object,
  scooterInfoConfig: PropTypes.object,
  isImgLeftLayout: PropTypes.bool,
  isColorVariantLayout: PropTypes.bool,
  isPriceVariant: PropTypes.bool,
  isSpecificationLayout: PropTypes.bool,
  productData: PropTypes.object,
  setScooterInfo: PropTypes.func,
  activeScooterHandler: PropTypes.func,
  isActiveScooterModel: PropTypes.bool,
  defaultSelection: PropTypes.number,
  isPincodePage: PropTypes.bool,
  isBookingSummaryPage: PropTypes.bool,
  selectedScooterData: PropTypes.any,
  myScooter: PropTypes.object,
  setActiveVariantParent: PropTypes.func,
  activeVariantParent: PropTypes.number,
  isOnStepThree: PropTypes.bool,
  handleChangeVariant: PropTypes.func,
  isSimpleLayout: PropTypes.bool,
  startAnalyticsHandler: PropTypes.func,
  handleColorChange: PropTypes.func
};

ScooterInfo.defaultProps = {
  myScooter: null
};

export default connect(null, mapDispatchToProps)(ScooterInfo);
