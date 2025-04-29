import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { setScooterInfoAction } from "../../../react-components/store/scooterInfo/scooterInfoActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import loginUtils from "../../../site/scripts/utils/loginUtils";

const ScooterInfo = (props) => {
  const {
    scooterInfoConfig,
    isImgLeftLayout,
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
    isSimpleLayout
  } = props;
  const imgPath = appUtils.getConfig("imgPath");
  const isLoggedIn = loginUtils.isSessionActive();

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
    if (
      !isActiveScooterModel &&
      isOnStepThree &&
      activeVariant !== activeVariantParent
    ) {
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

    const data = {
      name: productData.name,
      sku: productData.sku,
      sf_id: productData.sf_id,
      variants: productData.variants,
      selectedVariant: productData.variants[index]
    };

    setScooterInfo(data);

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
    }
  }, [productData?.variants[activeVariant]?.product.city]);

  const variantChange = (e, variant, variantIndex) => {
    `${isImgLeftLayout ? handleVariant(e, variant, variantIndex) : ""}`;
  };

  return (
    <>
      <div
        onClick={(e) => `${isImgLeftLayout ? handleModel(e) : ""}`}
        className={`vida-scooter-info
        ${
          isImgLeftLayout && !isSimpleLayout
            ? "vida-scooter-info--image-left"
            : ""
        }
        ${
          !isSimpleLayout && isImgLeftLayout && isActiveScooterModel
            ? "vida-scooter-info--active"
            : ""
        }
        ${isSimpleLayout ? "vida-scooter-info--simple-layout" : ""}
        
      `}
      >
        {!isSimpleLayout && (
          <div className="vida-scooter-info__title">
            <h3 className="vida-scooter-info__name">{productData.name}</h3>
            <div className="vida-scooter-info__price">
              <h3 className="vida-scooter-info__price-info">
                {productData.variants.map((variant, variantIndex) => (
                  <span key={variantIndex}>
                    {activeVariant === variantIndex && (
                      <span>
                        {variant.product.price ||
                          currencyUtils.getCurrencyFormatValue(0)}
                      </span>
                    )}
                  </span>
                ))}
              </h3>
              <p className="vida-scooter-info__price-type">
                {scooterInfoConfig.priceType}
                {scooterInfoConfig?.tooltipConfig?.info && (
                  <>
                    <span
                      className="notification__icon"
                      data-tip={scooterInfoConfig.tooltipConfig.info}
                      data-for={scooterInfoConfig.tooltipConfig.id}
                    >
                      <i className="icon-information-circle txt-color--orange"></i>
                    </span>
                    <ReactTooltip
                      place={scooterInfoConfig?.tooltipConfig?.infoPosition}
                      type="warning"
                      effect="solid"
                      id={scooterInfoConfig.tooltipConfig.id}
                    />
                  </>
                )}{" "}
                <br />
                {productData.variants.map((variant, variantIndex) => (
                  <span key={variantIndex}>
                    {activeVariant === variantIndex && (
                      <span>{variant.product.city}</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
        {!isSimpleLayout && (
          <div className="vida-scooter-info__color">
            <ul className="vida-scooter-info__color-list">
              {productData.variants.map((variant, variantIndex) => (
                <li
                  tabIndex="0"
                  onClick={(e) => {
                    variantChange(e, variant, variantIndex);
                  }}
                  onKeyPress={(e) => {
                    if (e.which === 13) {
                      variantChange(e, variant, variantIndex);
                    }
                  }}
                  className={`vida-scooter-info__color-list-item
                ${
                  activeVariant === variantIndex
                    ? "vida-scooter-info__color-list-item--active"
                    : ""
                }
              `}
                  style={{
                    background: `${
                      productColors[variant?.attributes[0]?.label]
                    }`
                  }}
                  key={variantIndex}
                ></li>
              ))}
            </ul>
            <p className="vida-scooter-info__color-name">
              {variantColor}
              {!isImgLeftLayout ? (
                <span>{scooterInfoConfig.colorSummaryLabel}</span>
              ) : (
                <></>
              )}
            </p>
          </div>
        )}
        <div className="vida-scooter-info__image">
          {productData.variants.map((variant, variantIndex) => (
            <div key={variantIndex}>
              {activeVariant === variantIndex && (
                <img
                  className="vida-scooter-info__product-image"
                  src={`${imgPath}${variant.product.sku}.png`}
                  alt={productData.name}
                />
              )}
            </div>
          ))}
          {isImgLeftLayout && isActiveScooterModel && handleChangeVariant && (
            <div className="vida-card__button-container">
              <button
                className="btn btn--primary"
                onClick={handleChangeVariant}
              >
                {scooterInfoConfig.variantBtnText}
              </button>
            </div>
          )}
        </div>
        {isSimpleLayout && (
          <div className="vida-scooter-info__color">
            <ul className="vida-scooter-info__color-list vida-scooter-info__color-list--simple-layout">
              {productData.variants.map((variant, variantIndex) => (
                <li
                  tabIndex="0"
                  onClick={(e) => {
                    variantChange(e, variant, variantIndex);
                  }}
                  onKeyPress={(e) => {
                    if (e.which === 13) {
                      variantChange(e, variant, variantIndex);
                    }
                  }}
                  key={variantIndex}
                >
                  <div
                    className={`vida-scooter-info__color-list-item
          ${
            activeVariant === variantIndex
              ? "vida-scooter-info__color-list-item--active"
              : ""
          }
        `}
                    style={{
                      background: `${
                        productColors[variant?.attributes[0]?.label]
                      }`
                    }}
                  ></div>
                  <p
                    className={`vida-scooter-info__color-name--simple-layout ${
                      activeVariant === variantIndex
                        ? "vida-scooter-info__color-name--simple-layout--active"
                        : ""
                    }`}
                  >
                    {variant?.product?.vaahan_color}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!isSimpleLayout && (
          <div className="vida-scooter-info__performance">
            <div className="vida-scooter-info__performance-item">
              {scooterInfoConfig?.product?.enableCertifiedRange ? (
                <>
                  <label className="vida-scooter-info__performance-title">
                    {scooterInfoConfig?.product?.certifiedRange}
                  </label>
                  <h3 className="vida-scooter-info__performance-data">
                    {productData?.variants[0]?.product.rangewmtc_c}
                  </h3>
                </>
              ) : (
                <>
                  <label className="vida-scooter-info__performance-title">
                    {scooterInfoConfig?.product?.range}
                  </label>
                  <h3 className="vida-scooter-info__performance-data">
                    {productData?.variants[0]?.product.range}
                  </h3>
                </>
              )}
            </div>
            <div className="vida-scooter-info__performance-item">
              <label className="vida-scooter-info__performance-title">
                {scooterInfoConfig.product.topSpeed}
              </label>
              <h3 className="vida-scooter-info__performance-data">
                {productData.variants[0].product.top_speed}
              </h3>
            </div>
            <div className="vida-scooter-info__performance-item">
              <label className="vida-scooter-info__performance-title">
                {scooterInfoConfig.product.acceleration}
              </label>
              <h3 className="vida-scooter-info__performance-data">
                {productData.variants[0].product.accelerator}
                {/* <span>Secs</span> */}
              </h3>
            </div>
            <div className="vida-scooter-info__performance-item">
              <label className="vida-scooter-info__performance-title">
                {scooterInfoConfig.product.chargingTime}
              </label>
              <h3 className="vida-scooter-info__performance-data">
                {productData.variants[0].product.charging_time}
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
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
  scooterInfoConfig: PropTypes.object,
  isImgLeftLayout: PropTypes.bool,
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
  isSimpleLayout: PropTypes.bool
};

ScooterInfo.defaultProps = {
  myScooter: null
};

export default connect(null, mapDispatchToProps)(ScooterInfo);
