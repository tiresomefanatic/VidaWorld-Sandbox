import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";
import { useGetAllProducts } from "../../../../react-components/hooks/preBooking/preBookingHooks";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import VidaToolTip from "../VidaToolTip/VidaToolTip";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

const CompareVariants = (props) => {
  const { userProfileData } = props;
  const {
    dataPosition,
    selectedProduct,
    buttonLabel,
    buyNowUrl,
    learnMoreLabel,
    heading,
    compareVariantText,
    exShowRoomText,
    colorsAvailableText,
    showOnlyDifferenceText,
    availableInText,
    colorsText,
    colorSwatchesIcon,
    productInfoList,
    learnMoreRedirections
  } = props.config;

  const getAllProductData = useGetAllProducts();

  // intersection observer
  const {
    ref: compareVariantContainerRef,
    isVisible: compareVariantContainerVisible
  } = useIntersectionObserver(0.1);

  const {
    ref: compareVariantModelImageRef,
    isVisible: compareVariantModelImageVisible
  } = useIntersectionObserver(0.5);

  const [productDetailsList, setproductDetailsList] = useState([]);
  const [isShowDifferentVariant, setShowDifferentVariant] = useState(true);
  const [iscopyProductList, setcopyProductList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");
  const isLoggedIn = loginUtils.isSessionActive();
  const dataElement = document?.getElementById("tooltip-data");
  const [defaultCity, setDefaultCity] = useState("NEW DELHI~DELHI~INDIA");
  const [allScooterData, setAllScooterData] = useState([]);
  const [productVariantConfigData, setProductVariantConfigData] = useState([]);
  const [dropdownOptionsList, setDropdownOptionsList] = useState();
  const [showDiffSelected, setShowDiffSelected] = useState(false);

  const [productConfig, setProductConfig] = useState(productInfoList);
  const [isCopyProductConfig, setCopyProductConfig] = useState(productInfoList);
  const [compareColors, setCompareColors] = useState(true);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || "compareVariants"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const getVariantPrice = (variantSku, defaultCity) => {
    let price = 0;
    priceList.map((item) => {
      if (
        item.city_state_id.toLowerCase() === defaultCity.toLowerCase() &&
        item.variant_sku === variantSku
      ) {
        price = currencyUtils.getCurrencyFormatValue(item?.exShowRoomPrice, 0);
      }
    });
    return price;
  };

  // To get the specific product details
  const getProductDetails = async () => {
    setSpinnerActionDispatcher(true);
    const filterProuductDetailsList = [];
    const dropdownOptions = [];
    const productDetailsResponse = await getAllProductData({
      variables: {
        category_id: 2
      }
    });
    if (productDetailsResponse) {
      setSpinnerActionDispatcher(false);
      setAllScooterData(productDetailsResponse?.data?.products?.items);
      const variantDetails = productDetailsResponse?.data?.products?.items;
      const configData = variantDetails.map((product) => ({
        sku: product.sku,
        variantConfig: product.variants[0]?.product // 0th variant's product object
      }));
      setProductVariantConfigData(configData);
      productDetailsResponse?.data?.products?.items?.map((data) => {
        if (
          selectedProduct.some((product) => data?.sku === product?.productSku)
        ) {
          const pdpPageLink = learnMoreRedirections.find(
            (product) => product.name === data?.name
          )?.url;
          filterProuductDetailsList.push({
            productName: data?.name,
            productDetails: data?.variants[0]?.product,
            productVariants: data?.variants,
            productSku: data?.sku,
            dropdownId: data?.sku,
            isVisible: false,
            learnMoreLink: pdpPageLink
          });
          dropdownOptions.push(data?.name);
        }
      });
      setproductDetailsList(filterProuductDetailsList);
      setcopyProductList(JSON.parse(JSON.stringify(filterProuductDetailsList)));
      setDropdownOptionsList(dropdownOptions);
    }
  };

  // to get product price list
  const getProductPriceList = async () => {
    const priceResult = await getProductPricesData();
    if (priceResult) {
      setPriceList(priceResult);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [priceList]);

  useEffect(() => {
    getProductPriceList();
  }, []);

  useEffect(() => {
    const getDefaultCity = dataElement?.getAttribute("data-default-city");
    if (getDefaultCity) {
      setDefaultCity(getDefaultCity);
    }
  }, [dataElement]);

  const compareVariantColors = () => {
    const filterColorData1 = [];
    const filterColorData2 = [];
    if (productDetailsList.length > 1) {
      productDetailsList[0]?.productVariants?.map((data) => {
        filterColorData1.push(data?.attributes[0]?.label);
      });
      productDetailsList[1]?.productVariants?.map((data) => {
        filterColorData2.push(data?.attributes[0]?.label);
      });
      if (filterColorData1.length === filterColorData2.length) {
        if (
          JSON.stringify(filterColorData1.sort()) ===
          JSON.stringify(filterColorData2.sort())
        ) {
          if (isShowDifferentVariant) {
            setCompareColors(false);
          } else {
            setCompareColors(true);
          }
        } else {
          setCompareColors(true);
        }
      } else {
        setCompareColors(true);
      }
    }
  };

  const isHandleCompareVariant = (newState, nextState) => {
    if (isShowDifferentVariant || nextState) {
      if (nextState) {
        setShowDifferentVariant(!nextState);
        setcopyProductList(JSON.parse(JSON.stringify(newState)));
      } else {
        setShowDifferentVariant(!isShowDifferentVariant);
        setcopyProductList(JSON.parse(JSON.stringify(productDetailsList)));
      }
      const filterData =
        newState && Object.keys(newState).length > 0
          ? JSON.parse(JSON.stringify(newState))
          : JSON.parse(JSON.stringify(productDetailsList));
      const productConfigList = JSON.parse(JSON.stringify(productInfoList));
      const filterDataStrings = [];
      const filteredConfig = [];
      productInfoList?.map((info, index) => {
        if (
          filterData[0].productDetails[info.value] ==
          filterData[1].productDetails[info.value]
        ) {
          delete filterData[0].productDetails[info.value];
          delete filterData[1].productDetails[info.value];
          delete filterData[0].productDetails[info.key];
          delete filterData[1].productDetails[info.key];
        } else {
          filterDataStrings.push(info.value);
        }
      });

      productConfigList
        .filter((item) => {
          if (filterDataStrings.includes(item.value)) {
            return item;
          }
        })
        .map((item) => {
          filteredConfig.push(item);
        });
      setproductDetailsList(JSON.parse(JSON.stringify(filterData)));
      setProductConfig(filteredConfig);
    } else {
      setShowDifferentVariant(!isShowDifferentVariant);
      setProductConfig(JSON.parse(JSON.stringify(isCopyProductConfig)));
      setproductDetailsList(JSON.parse(JSON.stringify(iscopyProductList)));
    }
    compareVariantColors();
  };

  const isshowDiffClicked = () => {
    setShowDiffSelected(!showDiffSelected);
    isHandleCompareVariant();
  };

  const buyNowHandler = (e, url, productName) => {
    ctaTracking(e);
    if (url) {
      window.location.href = url + "?" + productName;
    }
  };

  const handleOptionSelect = (item, product) => {
    let variantObj = {};
    const updatedProductList = JSON.parse(JSON.stringify(productDetailsList));
    const dropdownOptions = [...dropdownOptionsList];
    const replaceOptionIndex = updatedProductList.findIndex(
      (ele) => ele.productSku === item.productSku
    );

    if (replaceOptionIndex !== -1) {
      const selectedIndex = allScooterData.findIndex(
        (ele) => ele.sku === product.sku
      );
      const selectedItem = allScooterData[selectedIndex];
      const pdpPageLink = learnMoreRedirections.find(
        (product) => product.name === selectedItem?.name
      )?.url;

      variantObj = {
        productName: selectedItem?.name,
        productDetails: selectedItem?.variants[0]?.product,
        productVariants: selectedItem?.variants,
        productSku: selectedItem?.sku,
        dropdownId: selectedItem?.sku,
        isVisible: false,
        learnMoreLink: pdpPageLink
      };

      updatedProductList[replaceOptionIndex] = variantObj;
      dropdownOptions[replaceOptionIndex] = selectedItem?.name;
    }

    setproductDetailsList(JSON.parse(JSON.stringify(updatedProductList)));
    setDropdownOptionsList(dropdownOptions);
    if (showDiffSelected) {
      const compareArrays = (arr1, arr2) => {
        const common = [];
        arr1.forEach((item1) => {
          arr2.forEach((item2) => {
            if (item1.productSku === item2.sku) {
              item1.productDetails = item2.variantConfig;
              common.push(item1);
            }
          });
        });
        return common;
      };
      const commonItems = compareArrays(
        updatedProductList,
        productVariantConfigData
      );
      setproductDetailsList(commonItems);
      setShowDifferentVariant((prevState) => {
        const nextState = !prevState;
        isHandleCompareVariant(commonItems, nextState);
        return nextState;
      });
    }
  };

  const toggleOptionsVisibility = (id) => {
    setproductDetailsList((prevDropdowns) =>
      prevDropdowns.map((dropdown) =>
        dropdown.dropdownId === id
          ? { ...dropdown, isVisible: !dropdown.isVisible }
          : { ...dropdown, isVisible: false }
      )
    );
  };

  return (
    <div
      className="compare-variants vida-2-container"
      id="compare-variants"
      ref={compareVariantContainerRef}
      style={{ opacity: compareVariantContainerVisible ? 1 : 0 }}
    >
      <p className="compare-variants--heading">{heading}</p>
      <div
        className="variants-details-wrapper"
        style={{
          justifyContent: `${
            productDetailsList?.length === 1 ? "center" : "end"
          }`
        }}
        ref={compareVariantModelImageRef}
      >
        <div
          className={
            productDetailsList?.length > 1
              ? "compare-variant-text-container"
              : "compare-variant-text-container align-center"
          }
        >
          {productDetailsList?.length > 1 && (
            <div className="compare-variant-text">
              <p>{compareVariantText}</p>
            </div>
          )}

          <div className="variant-parent-container">
            {/* <div className="vs-container">
              <p className="vs-text">vs</p>
            </div> */}
            {productDetailsList?.map((item, index) => (
              <div className="variants-details" key={index}>
                {productDetailsList?.length > 1 && (
                  <div className="left">
                    <div
                      className="custom-select"
                      onClick={() => toggleOptionsVisibility(item.dropdownId)}
                      style={{
                        backgroundImage: item.isVisible
                          ? `url(${appUtils.getConfig(
                              "resourcePath"
                            )}images/svg/chevron-up.svg)`
                          : `url(${appUtils.getConfig(
                              "resourcePath"
                            )}images/svg/chevron-down.svg)`
                      }}
                    >
                      {" "}
                      {item.productName}
                      {item.isVisible && (
                        <div className="options-container">
                          {allScooterData.map((optionItem, index) => (
                            <div
                              className={`option-name ${
                                dropdownOptionsList.includes(optionItem.name)
                                  ? item.productName.toLowerCase() ===
                                    optionItem.name.toLowerCase()
                                    ? "selected"
                                    : "disabled"
                                  : ""
                              }`}
                              key={index}
                              onClick={() =>
                                handleOptionSelect(item, optionItem)
                              }
                              selected={
                                item.productName.toLowerCase() ===
                                  optionItem.name.toLowerCase() ||
                                dropdownOptionsList.includes(optionItem.name)
                              }
                            >
                              {"VIDA " + optionItem.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className="variants-details--bikeimg-wrapper"
                  style={{
                    transform: compareVariantModelImageVisible
                      ? "scale(1)"
                      : "scale(0.5)"
                  }}
                >
                  <img
                    src={selectedProduct[index]?.baseImg}
                    alt={selectedProduct[index]?.imageAlt}
                    title={selectedProduct[index]?.imageTitle}
                  ></img>
                </div>
                <p className="variants-details--model-name">
                  {item.productName}
                </p>
                <p className="variants-details--model-price">
                  {getVariantPrice(
                    item?.productDetails?.sku,
                    isLoggedIn
                      ? `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`
                      : defaultCity
                  )}
                  <VidaToolTip index={index} componentName="compareVariant" />
                </p>
                <p className="variants-details--model-price-details">
                  {exShowRoomText}
                </p>
                <a
                  className="btn btn--tertiary-2 variants-details--buy-now-cta"
                  data-link-position={dataPosition || "compareVariants"}
                  onClick={(e) =>
                    buyNowHandler(
                      e,
                      selectedProduct[index]?.buyNowUrl,
                      item.productName
                    )
                  }
                >
                  {buttonLabel}
                </a>
                <a
                  className="variants-details--link"
                  data-link-position={dataPosition || "compareVariants"}
                  onClick={(e) => ctaTracking(e)}
                  href={item.learnMoreLink}
                  target={
                    selectedProduct[index]?.learnMoreNewTab ? "_blank" : "_self"
                  }
                  rel="noreferrer"
                >
                  {learnMoreLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="product-details-wrapper">
        {/* Desktop view for Title starts here */}
        <div className="product-details">
          {compareColors && (
            <div className="product-data">
              <div className="product-data--title">
                <img src={colorSwatchesIcon}></img>
                {colorsAvailableText}
              </div>
            </div>
          )}
          {productConfig?.map((info) => (
            <Fragment key={info.title}>
              {(productDetailsList[0]?.productDetails?.[info.value] ||
                productDetailsList[1]?.productDetails?.[info.value]) && (
                <div className="product-data">
                  <div className="product-data--title">
                    <img src={info.icon}></img>
                    {info.title}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        {/* Desktop view for Title ends here */}

        {productDetailsList?.map((item, index) => (
          <div className="product-details" key={index}>
            {compareColors && (
              <div
                style={{
                  alignItems: `${
                    productDetailsList?.length === 1 ? "center" : "unset"
                  }`
                }}
                className="product-data"
              >
                <div className="product-data--title mob-title">
                  <img src={colorSwatchesIcon}></img>
                  {availableInText} {item?.productVariants?.length} {colorsText}{" "}
                </div>
                <div className="product-data--colors">
                  {item?.productVariants?.map((variant, index) => (
                    <div
                      className={`${
                        variant?.attributes[0]?.label === "White"
                          ? "border-black"
                          : ""
                      }`}
                      key={variant?.attributes[0]?.label}
                      style={{
                        background: `${
                          getProductColor[variant?.attributes[0]?.label]
                        }`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            {productConfig?.map((info, index) => (
              <Fragment key={index}>
                {item?.productDetails?.[info.value] && (
                  <div
                    style={{
                      alignItems: `${
                        productDetailsList?.length === 1 ? "center" : "unset"
                      }`
                    }}
                    className="product-data"
                  >
                    <div className="product-data--title mob-title">
                      <img src={info?.icon}></img>
                      {info?.title}
                    </div>
                    <div className="product-data--value">
                      {info?.title === "Riding Modes" &&
                      item?.productDetails?.[info?.value] > 100
                        ? "100+"
                        : `${`${item?.productDetails?.[info?.value]}`.replace(
                            /[A-Za-z]/g,
                            ""
                          )}`}
                      <span>
                        {info?.unit}
                        {info.value === "rangewmtc_c" && (
                          <span className="custom-span">*</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      {productDetailsList?.length > 1 && (
        <div className="variant-compare">
          <label className="container">
            {showOnlyDifferenceText}
            <input
              type="checkbox"
              onChange={(e) => {
                isshowDiffClicked();
              }}
              checked={showDiffSelected}
            ></input>
            <span className="checkmark"></span>
          </label>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileData: {
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    }
  };
};

CompareVariants.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    heading: PropTypes.string,
    selectedProduct: PropTypes.arrayOf(PropTypes.any),
    buttonLabel: PropTypes.string,
    buyNowUrl: PropTypes.string,
    learnMoreLabel: PropTypes.string,
    compareVariantText: PropTypes.string,
    exShowRoomText: PropTypes.string,
    colorsAvailableText: PropTypes.string,
    showOnlyDifferenceText: PropTypes.string,
    availableInText: PropTypes.string,
    colorsText: PropTypes.string,
    colorSwatchesIcon: PropTypes.string,
    productInfoList: PropTypes.arrayOf(PropTypes.any),
    learnMoreRedirections: PropTypes.any
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(CompareVariants);
