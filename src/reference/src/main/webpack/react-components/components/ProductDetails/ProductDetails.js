import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  getProductDetailsData,
  getProductBranchesData,
  getProductPricesData
} from "../../services/productDetails/productDetailsService";
import animation from "../../../site/scripts/animation";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import Dropdown from "../form/Dropdown/Dropdown";
import { useForm } from "react-hook-form";

const ProductDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const counterWrapper = useRef(0);

  const { config } = props;
  const {
    productHeading,
    priceLabel,
    primaryBtn,
    secondaryBtn,
    showPrice,
    selectedProductSku,
    selectedVariantSku,
    selectedCityId
    // one3DConfig
  } = config;
  // const { packageDivId, packageUrl, packagePath, variant } = one3DConfig;
  const { topSpeed, range, chargingTime } = config.performance;

  const productColors = appUtils.getConfig("productColorCodes");

  // const [productList, setProductList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [priceList, setPriceList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const imgPath = appUtils.getConfig("imgPath");
  const [activeVariant, setActiveVariant] = useState();
  const [selectedCity, setSelectedCity] = useState(null);

  const { register, setValue } = useForm({
    mode: "onSubmit"
  });

  // const OnLoadingComplete = () => {
  //   document.querySelector("html").classList.remove("overflow-hidden");
  // };

  // const initOne3DProductDetails = () => {
  //   document.querySelector("html").classList.add("overflow-hidden");
  //   const script = document.createElement("script");
  //   script.src = packageUrl + packagePath;
  //   script.async = true;
  //   script.type = "text/javascript";
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     ONE3D.init(
  //       packageDivId,
  //       packageUrl + "one3d/",
  //       "VIDA",
  //       variant.toUpperCase(),
  //       {
  //         callback: OnLoadingComplete,
  //         showDefaultLoader: true
  //       }
  //     );
  //   };
  //   document.getElementsByTagName("head")[0].appendChild(script);
  // };

  const updatePrice = (cityStateId, variantSku) => {
    const selectedSkuPrice = priceList.filter(
      (item) =>
        item.city_state_id === cityStateId && item.variant_sku === variantSku
    )[0];
    setSelectedCity(cityStateId);
    setSelectedPrice((selectedSkuPrice && selectedSkuPrice.price) || "0");
  };

  const getProductBranch = async () => {
    const result = await getProductBranchesData();
    setBranchList(result);
    const cityStateList = result.map((item) => {
      return item["id"];
    });
    if (cityStateList.indexOf(selectedCityId) > 0) {
      setSelectedCity(selectedCityId);
    } else {
      setSelectedCity(cityStateList[0]);
    }
  };

  const getProductPrice = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  const getProduct = async () => {
    const productListData = await getProductDetailsData();
    // setProductList(productListData);

    let selectedProductData;

    if (selectedProductSku) {
      selectedProductData = productListData.items.filter(
        (a) => a.sku == selectedProductSku
      )[0];
      if (selectedProductData) {
        setSelectedProduct(selectedProductData);
      } else {
        selectedProductData = { ...productListData.items[0] };
        setSelectedProduct(selectedProductData);
      }
    } else {
      selectedProductData = { ...productListData.items[0] };
      setSelectedProduct(selectedProductData);
    }

    if (selectedVariantSku) {
      let selectedVariantDetails = selectedProductData.variants.find(
        (e) => e.sku === selectedVariantSku
      );

      if (selectedVariantDetails) {
        setSelectedVariant(selectedVariantDetails);
      } else {
        selectedVariantDetails = { ...selectedProductData.variants[0] };
        setSelectedVariant(selectedVariantDetails);
      }
      setSelectedCity(selectedCity || branchList[0].id);
      setActiveVariant(selectedVariantDetails.color);
      updatePrice(selectedCity || branchList[0].id, selectedVariantDetails.sku);
    } else {
      setSelectedVariant(selectedProductData.variants[0]);
      setSelectedCity(selectedCity || branchList[0].id);
      setActiveVariant(selectedProductData.variants[0].color);
      updatePrice(
        selectedCity || branchList[0].id,
        selectedProductData.variants[0].sku
      );
    }
    // initOne3DProductDetails();
  };

  useEffect(() => {
    /* Load Rest API Data */
    getProductBranch();
    getProductPrice();
  }, []);

  useEffect(() => {
    if (branchList.length > 0 && priceList.length > 0) {
      getProduct();
    }
  }, [branchList, priceList]);

  useEffect(() => {
    animation.animate(counterWrapper.current);
  }, [selectedPrice]);

  const handleVariantChange = (e, variant) => {
    e.stopPropagation();
    // ONE3D.changeColor(variant.color.toUpperCase());
    setActiveVariant(variant.color);
    updatePrice(selectedCity, variant.sku);
  };

  const buildYourOwn = (pageUrl) => {
    window.location.href = pageUrl;
  };

  const handleAnalyticsCBClick = (event) => {
    event.preventDefault();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const cityStateValue = branchList.find(
        (item) => item.id === selectedCity
      );
      const location = {
        state: cityStateValue.cityName.trim(),
        city: cityStateValue.stateName.trim(),
        pinCode: "",
        country: cityStateValue.countryName.trim()
      };
      const productDetails = {
        modelVariant: selectedProduct.name,
        modelColor: selectedVariant.color,
        productID: selectedVariant.sf_id,
        startingPrice:
          showPrice === "true"
            ? analyticsUtils.priceConversion(selectedPrice)
            : ""
      };
      const additionalPageName = "";
      const additionalJourneyName = "";
      analyticsUtils.trackCustomButtonClick(
        customLink,
        location,
        productDetails,
        additionalPageName,
        additionalJourneyName,
        function () {
          buildYourOwn(event.target.href);
        }
      );
    } else {
      buildYourOwn(event.target.href);
    }
  };

  return (
    <>
      {selectedProduct && selectedVariant && selectedPrice && selectedCity && (
        <div className="vida-product-detail">
          <div className="vida-product-detail__wrapper">
            <div className="vida-container vida-product-detail__product-container">
              <div className="vida-product-detail__header">
                <h3
                  className="vida-product-detail__heading"
                  dangerouslySetInnerHTML={{
                    __html: productHeading
                  }}
                ></h3>
              </div>
              <div className="vida-product-detail__details">
                <div className="vida-product-detail__container">
                  <h2>{selectedProduct.name}</h2>
                  <div className="vida-product-detail__color-container">
                    <ul className="vida-product-detail__color-list">
                      {selectedProduct.variants.map((variant, variantIndex) => (
                        <li
                          key={variantIndex}
                          className={`vida-product-detail__color-list-item
                        ${
                          activeVariant === variant.color
                            ? "vida-product-detail__color-list-item--active"
                            : ""
                        }
                      `}
                          style={{
                            background: `${productColors[variant.color]}`
                          }}
                          onClick={(e) => handleVariantChange(e, variant)}
                        ></li>
                      ))}
                    </ul>
                  </div>
                  <div className="vida-product-detail__form">
                    {/* <div className="form__group">
                      <div className="form__field-select-wrapper">
                        <i className="icon-location-marker"></i>
                        <select
                          className="form__field-select"
                          name="location"
                          value={selectedCity}
                          onChange={(e) =>
                            updatePrice(e.target.value, selectedVariant.sku)
                          }
                        >
                          {branchList.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.cityName + ", " + branch.stateName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}
                    <Dropdown
                      name="location"
                      label=""
                      iconClass={`icon-location-marker`}
                      options={branchList}
                      value={selectedCity}
                      setValue={setValue}
                      onChangeHandler={(name, value) =>
                        updatePrice(value, selectedVariant.sku)
                      }
                      register={register}
                    />
                  </div>
                  {showPrice === "true" && (
                    <div className="vida-product-detail__price-container">
                      <label>{priceLabel}</label>
                      <h2>
                        {currencyUtils.getCurrencyFormatValue(selectedPrice)}
                      </h2>
                    </div>
                  )}
                  <div className="vida-product-detail__btn-container">
                    <a
                      href={primaryBtn.actionUrl}
                      className="btn btn--primary"
                      onClick={(event) => handleAnalyticsCBClick(event)}
                    >
                      {primaryBtn.label}
                    </a>
                    <a
                      href={secondaryBtn.actionUrl}
                      className="btn btn--secondary"
                      onClick={(event) =>
                        handleAnalyticsCBClick(event, secondaryBtn.label)
                      }
                    >
                      {secondaryBtn.label}
                    </a>
                  </div>
                </div>
                <div className="vida-product-detail__image-container">
                  <div className="vida-product-detail__image">
                    {selectedProduct.variants.map((variant, variantIndex) => (
                      <div key={variantIndex}>
                        {activeVariant === variant.color && (
                          <img
                            className="vida-product-detail__product-image"
                            src={imgPath + variant.sku + ".png"}
                            alt={selectedProduct.name}
                          />
                        )}
                      </div>
                    ))}
                    {/* <div
                      id={packageDivId}
                      className="vida-product-detail__3dscooter"
                    ></div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="vida-container vida-product-detail__performance-container"
            ref={counterWrapper}
          >
            <div className="vida-product-detail__performance-item">
              <label className="vida-product-detail__performance-title">
                {topSpeed}
              </label>
              <h3 className="vida-product-detail__performance-data">
                <span
                  className="vida-product-detail__config-value"
                  data-animate="true"
                  data-animation-name="counter"
                  data-counter-value={selectedVariant.top_speed.replace(
                    /[^0-9]/g,
                    ""
                  )}
                  data-animation-scroller-start="100%"
                ></span>
                <span>
                  {selectedVariant.top_speed.replace(/[\d\.]+/, "").trim()}
                </span>
                {/* <span>km/h</span> */}
                {/* {selectedVariant.top_speed} */}
              </h3>
            </div>
            <div className="vida-product-detail__performance-item">
              <label className="vida-product-detail__performance-title">
                {range}
              </label>
              <h3 className="vida-product-detail__performance-data">
                <span
                  className="vida-product-detail__config-value"
                  data-animate="true"
                  data-animation-name="counter"
                  data-counter-value={selectedVariant.range.replace(
                    /[^0-9]/g,
                    ""
                  )}
                  data-animation-scroller-start="100%"
                ></span>
                <span>
                  {selectedVariant.range.replace(/[\d\.]+/, "").trim()}
                </span>
                {/* <span>Km</span> */}
              </h3>
            </div>
            <div className="vida-product-detail__performance-item">
              <label className="vida-product-detail__performance-title">
                {chargingTime}
              </label>
              <h3 className="vida-product-detail__performance-data">
                <span>&lt;</span>
                <span
                  className="vida-product-detail__config-value"
                  data-animate="true"
                  data-animation-name="counter"
                  data-counter-value={selectedVariant.charging_time.match(
                    /[\d\.]+/
                  )}
                  data-animation-scroller-start="100%"
                ></span>
                <span>
                  {selectedVariant.charging_time.replace(/[\d\.]+/, "").trim()}
                </span>
                {/* <span>mins</span> */}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ProductDetails.propTypes = {
  config: PropTypes.shape({
    productHeading: PropTypes.string,
    priceLabel: PropTypes.string,
    selectedProductSku: PropTypes.string,
    selectedVariantSku: PropTypes.string,
    selectedCityId: PropTypes.string,
    showPrice: PropTypes.string,
    primaryBtn: PropTypes.shape({
      label: PropTypes.string,
      actionUrl: PropTypes.string
    }),
    secondaryBtn: PropTypes.shape({
      label: PropTypes.string,
      actionUrl: PropTypes.string
    }),
    performance: PropTypes.shape({
      topSpeed: PropTypes.string,
      range: PropTypes.string,
      chargingTime: PropTypes.string
    })
    // one3DConfig: PropTypes.shape({
    //   packageDivId: PropTypes.string,
    //   packageUrl: PropTypes.string,
    //   packagePath: PropTypes.string,
    //   variant: PropTypes.string
    // })
  })
};
export default ProductDetails;
