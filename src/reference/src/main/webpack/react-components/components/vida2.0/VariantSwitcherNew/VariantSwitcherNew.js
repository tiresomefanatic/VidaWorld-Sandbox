import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import appUtils from "../../../../site/scripts/utils/appUtils";
import productDetailsConfig from "../../../../site/scripts/product-details-config";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const VariantSwitcherNew = (props) => {
  const {
    dataPosition,
    selectedProduct,
    productDetailsTitle,
    title,
    preTitle,
    items,
    rangeDesktopIcon,
    topSpeedDesktopIcon,
    rangeMobileIcon,
    topSpeedMobileIcon,
    exShowroomLabel,
    acceleratorDesktopIcon,
    acceleratorMobileIcon,
    batteryDesktopIcon,
    batteryMobileIcon,
    defaultCity
  } = props.config;

  const [priceList, setPriceList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [currIndex, setCurrentIndex] = useState(0);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const getProductPriceList = async () => {
    const priceDataResult = await getProductPricesData();
    if (priceDataResult) {
      setPriceList(priceDataResult);
    }
  };

  const getVariantPrice = (variantSku) => {
    let price = 0;
    if (priceList) {
      priceList.map((item) => {
        if (
          item.city_state_id.toLowerCase() === defaultCity.toLowerCase() &&
          item.variant_sku === variantSku
        ) {
          price = currencyUtils.getCurrencyFormatValue(
            item?.exShowRoomPrice,
            0
          );
        }
      });
      return price;
    }
  };

  const getProductDetails = () => {
    const productDetailsList = [];
    items.map((data) => {
      if (
        selectedProduct.some((product) => data.varSku === product.productSku)
      ) {
        productDetailsList.push({
          productName: data.item_name,
          productImage: data.item_image,
          batteryCapacity: data.batteryCapacity,
          batteryCapacityUnit: data.batteryCapacityUnit,
          productDetails: data.productVariantInfoList[0],
          productVariants: data.productVariantInfoList
        });
      }
    });
    setProductList(productDetailsList);
  };

  const tabSwitchingHandler = (index) => {
    setCurrentIndex(index);
  };

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  useEffect(() => {
    getProductPriceList();
    getProductDetails();
  }, []);

  return (
    <section className="variant-switcher-new vida-2-container">
      <div className="variant-switcher-new--header-container">
        <p className="variant-switcher-new--subheading">{preTitle}</p>
        <p className="variant-switcher-new--heading">{title}</p>
      </div>
      <div className="variant-buttons-wrapper">
        <div className="variant-buttons-container">
          {productList.map((item, index) => (
            <div
              className={`variant-button ${
                index === currIndex ? "active" : ""
              }`}
              key={index}
              onClick={() => tabSwitchingHandler(index)}
            >
              <p className="button-product-name">{item.productName}</p>
              <p className="button-product-price">
                {getVariantPrice(item?.productDetails?.variant_sku)}
              </p>
              {index === currIndex && (
                <p className="button-price-text">{exShowroomLabel}</p>
              )}
            </div>
          ))}
        </div>
        <div className="variant-specifications-container">
          {productList.map((item, index) => (
            <React.Fragment key={index}>
              {index === currIndex && (
                <>
                  <div className="variant-spec">
                    <div className="variant-spec-item">
                      <div className="variant-switcher--tab--panel--detail--title">
                        <div className="title-image">
                          <img
                            src={
                              isDesktop ? batteryDesktopIcon : batteryMobileIcon
                            }
                          ></img>
                        </div>
                        <div className="battery-header">
                          {item.productName.toLowerCase() === "v2 lite" ? (
                            <span className="battery-info">
                              {productDetailsTitle.removableBattery}
                            </span>
                          ) : (
                            <span className="battery-info">
                              {productDetailsTitle.batteryQuantity && (
                                <span className="battery-count">
                                  {productDetailsTitle.batteryQuantity}
                                </span>
                              )}
                              {productDetailsTitle.battery}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {item?.batteryCapacity}
                        <span className="variant-switcher--tab--panel--detail--unit">
                          {item?.batteryCapacityUnit}
                        </span>
                      </div>
                    </div>
                    <div className="variant-spec-item">
                      <div className="variant-switcher--tab--panel--detail--title">
                        <div className="title-image">
                          <img
                            src={
                              isDesktop
                                ? acceleratorDesktopIcon
                                : acceleratorMobileIcon
                            }
                          ></img>
                        </div>
                        {productDetailsTitle.accelerator}
                      </div>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {item.productDetails.variant_accelerator_value}
                        <span className="variant-switcher--tab--panel--detail--unit">
                          {item.productDetails.variant_accelerator_unit}
                        </span>
                      </div>
                    </div>
                    <div className="variant-spec-item">
                      <div className="variant-switcher--tab--panel--detail--title">
                        <div className="title-image">
                          <img
                            src={isDesktop ? rangeDesktopIcon : rangeMobileIcon}
                          ></img>
                        </div>

                        {productDetailsTitle.enableCertifiedRange
                          ? productDetailsTitle.certifiedRange
                          : productDetailsTitle.range}
                      </div>
                      {productDetailsTitle.enableCertifiedRange ? (
                        <div className="variant-switcher--tab--panel--detail--value">
                          {`${item.productDetails.variant_certified_range_value}`.replace(
                            /[A-Za-z]/g,
                            ""
                          )}
                          <span className="variant-switcher--tab--panel--detail--unit">
                            {item.productDetails.variant_certified_range_unit
                              ? `${item.productDetails.variant_certified_range_unit}*`
                              : `${item.productDetails.variant_certified_range_value}`.replace(
                                  /[0-9.]/g,
                                  ""
                                ) + "*"}
                          </span>
                        </div>
                      ) : (
                        <div className="variant-switcher--tab--panel--detail--value">
                          {item.productDetails.variant_range_value}{" "}
                          <span className="variant-switcher--tab--panel--detail--unit">
                            {item.productDetails.variant_range_unit}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="variant-spec-item">
                      <div className="variant-switcher--tab--panel--detail--title">
                        <div className="title-image">
                          <img
                            src={
                              isDesktop
                                ? topSpeedDesktopIcon
                                : topSpeedMobileIcon
                            }
                          ></img>
                        </div>
                        {productDetailsTitle.top_speed}
                      </div>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {item.productDetails.variant_top_speed_value}
                        <span className="variant-switcher--tab--panel--detail--unit">
                          {item.productDetails.variant_top_speed_unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="variant-colors">
                    <div className="variant-switcher--tab--panel--detail">
                      <p className="variant-switcher--tab--panel--detail--title">
                        Available in {item.productVariants.length} colours{" "}
                      </p>
                      <div
                        className={`variant-switcher--tab--panel--detail--colors-container`}
                      >
                        {item.productVariants.map((variant, index) => (
                          <div
                            key={index + "variant"}
                            className={`${
                              variant.varinat_color === "White"
                                ? "border-black"
                                : ""
                            }`}
                            style={{
                              background: `${
                                getProductColor[
                                  productDetailsConfig.variantColors[
                                    variant.varinat_color
                                  ]
                                ]
                              }`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="know-more-link">
                    <div className="variant-switcher--tab--panel--link">
                      <a
                        href={selectedProduct[index].labelLink}
                        data-link-position={dataPosition || "variantSwitcher"}
                        onClick={(e) => ctaTracking(e)}
                        target={
                          selectedProduct[index].isLabelNewtab
                            ? "_blank"
                            : "_self"
                        }
                        rel="noreferrer"
                      >
                        {selectedProduct[index].label}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VariantSwitcherNew;

VariantSwitcherNew.propTypes = {
  config: PropTypes.object
};
