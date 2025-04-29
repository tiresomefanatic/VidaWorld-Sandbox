import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import Dropdown from "../form/Dropdown/Dropdown";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../site/scripts/media-breakpoints";
import {
  getProductDetailsData,
  getProductBranchesData,
  getProductPricesData
} from "../../services/productDetails/productDetailsService";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import { useUserData } from "../../hooks/userAccess/userAccessHooks";
import Popup from "../Popup/Popup";
import { setHomepageCityDispatcher } from "../../store/myScooter/myScooterActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const isDesktop = window.matchMedia(
  breakpoints.mediaExpression.desktop
).matches;
const setSlider = () => {
  if (isDesktop) {
    return;
  }
  tns({
    container: ".vida-model-compare__specs-container",
    items: 1,
    slideBy: "page",
    mouseDrag: true,
    controls: false,
    navPosition: "bottom",
    edgePadding: 16,
    nav: true,
    loop: false
  });
};
const CompareModel = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const getUserData = useUserData();
  const { config, userProfileData, cityData } = props;
  const {
    title,
    tagLine,
    selectedCityId,
    splitterChar,
    CompareLinkText,
    specs,
    bookTestDrive,
    downloadBrochure,
    configure,
    selectedProduct,
    tooltipConfig
  } = config;
  const resourcePath = appUtils.getConfig("resourcePath");
  const testDriveUrl = appUtils.getPageUrl("testDriveUrl");
  const configurationUrl = appUtils.getPageUrl("configurationUrl");
  const [branchList, setBranchList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [productInfo, setProductInfo] = useState([]);
  const [priceList, setPriceList] = useState([]);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled;
  // const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = (e) => {
    // setIsHovering(true);
    e.currentTarget.lastChild.lastChild.play();
  };
  const handleMouseOut = (e) => {
    // setIsHovering(false);
    e.currentTarget.lastChild.lastChild.pause();
  };
  const { register, setValue, getValues } = useForm({
    mode: "onSubmit"
  });
  const productColors = appUtils.getConfig("productColorCodes");

  const getProductBranch = async () => {
    const result = await getProductBranchesData();
    setBranchList(result);
    const cityStateList = result.map((item) => {
      return item["id"];
    });
    if (cityStateList.includes(selectedCityId)) {
      setSelectedCity(selectedCityId);
    } else {
      setSelectedCity(cityStateList[0]);
    }

    const cityNameList = result.map((item) => {
      return item["cityName"];
    });
    if (cityNameList.includes(selectedCityId)) {
      setSelectedCityName(selectedCityId);
    } else {
      setSelectedCityName(cityNameList[0]);
    }
  };

  const getProduct = async () => {
    const productList = await getProductDetailsData();
    /* Filter dats based on product sku and variant sku */
    const selectedProductData = [];
    selectedProduct.forEach((pr) => {
      productList.items.filter((p) => {
        if (pr.productSku === p.sku) {
          selectedProductData.push(p);
          return true;
        }
      });
    });
    let selectedVariant = [];
    for (const e of selectedProductData) {
      const productData = e.variants.filter((ele) => {
        for (const pr of selectedProduct) {
          if (ele.sku === pr.variantSku) {
            return true;
          }
        }
      });

      productData[0]["productName"] = e.name;
      productData[0]["productSku"] = e.sku;
      productData[0]["variants"] = e.variants;
      selectedVariant = [...selectedVariant, ...productData];
    }

    setProductInfo(selectedVariant);
  };

  const getPriceDetails = async () => {
    const priceListRes = await getProductPricesData();
    setPriceList(priceListRes);
  };
  const getOnRoadPrice = (cityId) => {
    productInfo.forEach((element, index) => {
      priceList.forEach((product) => {
        if (
          cityId === product.city_state_id &&
          element.sku === product.variant_sku
        ) {
          productInfo[index]["effectivePrice"] = product.effectivePrice;
          productInfo[index]["price"] = product.onRoadPrice;
        }
      });
      selectedProduct.forEach((product) => {
        if (element.sku === product.variantSku) {
          productInfo[index]["baseImg"] = product.baseImg;
          productInfo[index]["hoverImg"] = product.hoverImg;
          productInfo[index]["isVideo"] = product.isVideo;
        }
      });
    });
    setProductInfo([...productInfo]);
  };
  const onChangeCity = (cityStateId) => {
    let dupCityStateId = cityStateId;
    const selectedBranch = branchList.filter((item) => item.id === cityStateId);
    if (selectedBranch.length > 0) {
      setSelectedCityName(selectedBranch[0].cityName);
    } else {
      if (branchList.length > 0) {
        const defaultBranch = branchList.filter(
          (item) => item.id === selectedCityId
        );
        dupCityStateId = selectedCityId;
        setSelectedCityName(defaultBranch[0].cityName);
      } else {
        dupCityStateId = selectedCityId;
      }
    }

    setSelectedCity(dupCityStateId);
    getOnRoadPrice(dupCityStateId);
    setHomepageCityDispatcher({
      cityData: dupCityStateId
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const showPopupWindow = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const handleTestRide = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const handleDownloadBrochure = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "link",
        clickType: "download"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const handleConfiguration = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "link",
        clickType: "other"
      };

      analyticsUtils.trackCtaClick(customLink);
    }
  };

  useEffect(() => {
    getProductBranch();
    setTimeout(() => {
      setSlider();
    }, 3000);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      getProduct();
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedCity && priceList.length) {
      getOnRoadPrice(selectedCity);
    }
  }, [priceList, selectedCity]);

  useEffect(() => {
    if (isLoggedIn && userProfileData.city) {
      setSpinnerActionDispatcher(true);
      getUserData().then(() => {
        const selectedCityStateId = (
          userProfileData.city +
          splitterChar +
          userProfileData.state +
          splitterChar +
          userProfileData.country
        ).toUpperCase();
        //  setValue("compareModel", selectedCityStateId);
        setSelectedCity(selectedCityStateId);
        onChangeCity(selectedCityStateId);
      });
    } else {
      setSelectedCity(selectedCityId);
      onChangeCity(selectedCityId);
    }
  }, [userProfileData.city]);

  useEffect(() => {
    getPriceDetails();
  }, []);

  useEffect(() => {
    setSelectedCity(cityData);
  }, [cityData]);

  return (
    <>
      {selectedCity && branchList.length > 0 && (
        <div className="vida-container">
          <div className="vida-model-compare">
            <div className="vida-model-compare__heading">
              <div className="vida-model-compare__title">
                <div
                  className="vida-model-compare__title-text"
                  dangerouslySetInnerHTML={{
                    __html: title
                  }}
                ></div>
                <div className="vida-model-compare__tagline">{tagLine}</div>
              </div>
              <div className="vida-model-compare__dropdown">
                <Dropdown
                  name="compareModel"
                  label=""
                  iconClass={`icon-location-marker`}
                  options={branchList}
                  value={selectedCity || getValues("compareModel")}
                  setValue={setValue}
                  onChangeHandler={(name, value) => onChangeCity(value)}
                  register={register}
                  isSortAsc={true}
                />
                <a
                  href="#"
                  onClick={(event) => showPopupWindow(event)}
                  className="vida-model-compare__link"
                >
                  {CompareLinkText}
                </a>
                {showPopup && (
                  <div className="vida-model-compare__compare-frame">
                    <Popup
                      mode="full-screen"
                      handlePopupClose={() => setShowPopup(false)}
                    >
                      <div className="vida-model-compare__popupspecs-modal">
                        <div className="vida-model-compare__popupspecs-location">
                          <h3>
                            <i className="icon-location-marker"></i>{" "}
                            {selectedCityName}
                          </h3>
                        </div>
                        <div className="vida-model-compare__popupspecs-container">
                          {productInfo &&
                            productInfo.length > 0 &&
                            productInfo.map((product, index) => {
                              return (
                                <div
                                  key={index + product.productName}
                                  className="vida-model-compare__popupspecs-item"
                                >
                                  <div className="vida-model-compare__popupspecs-product">
                                    <div className="vida-model-compare__popupimage">
                                      <img
                                        className="vida-model-compare__product-image"
                                        src={product.baseImg}
                                        alt={
                                          product?.productName ||
                                          "Product Image"
                                        }
                                        // onMouseOver={(e) =>
                                        //   (e.currentTarget.src =
                                        //     product.hoverImg)
                                        // }
                                        // onMouseOut={(e) =>
                                        //   (e.currentTarget.src =
                                        //     product.baseImg)
                                        // }
                                      />
                                    </div>

                                    <div className="vida-model-compare__popupspecs-title">
                                      <h3>{product.productName}</h3>
                                      <div className="vida-model-compare__popupspecs-titleimg">
                                        <ul className="vida-model-compare__color-list">
                                          {product.variants.map(
                                            (element, index) => {
                                              return (
                                                <li
                                                  key={index}
                                                  className={`vida-model-compare__color-list-item`}
                                                  style={{
                                                    background: `${
                                                      productColors[
                                                        element.color
                                                      ]
                                                    }`
                                                  }}
                                                ></li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </div>
                                      {product.effectivePrice && (
                                        <div className="vida-model-compare__popupspecs-price">
                                          <span className="vida-model-compare__popupspecs-price-tag">
                                            {specs.priceTag}
                                            {""}

                                            {tooltipConfig.info && (
                                              <>
                                                <span
                                                  className="notification__icon"
                                                  data-tip={tooltipConfig.info}
                                                  data-for={tooltipConfig.id}
                                                >
                                                  <i className="icon-information-circle txt-color--orange"></i>
                                                </span>
                                                <ReactTooltip
                                                  place={
                                                    tooltipConfig.infoPosition
                                                  }
                                                  type="warning"
                                                  effect="solid"
                                                  id={tooltipConfig.id}
                                                />
                                              </>
                                            )}
                                          </span>
                                          <p>
                                            {currencyUtils.getCurrencyFormatValue(
                                              product?.effectivePrice
                                            )}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="vida-model-compare__popupspecs-value">
                                      <div className="vida-model-compare__popupspecs-item">
                                        {/* <i className="vida-model-compare__popupspecs-item-range"></i> */}
                                        {specs?.enableCertifiedRange ? (
                                          <>
                                            <span>{specs?.certifiedRange}</span>
                                            <p>
                                              {product.certified_range}
                                            </p>{" "}
                                          </>
                                        ) : (
                                          <>
                                            <span>{specs?.range}</span>
                                            <p>{product?.range}</p>{" "}
                                          </>
                                        )}
                                      </div>
                                      <div className="vida-model-compare__popupspecs-item">
                                        {/* <i className="vida-model-compare__popupspecs-item-speed"></i> */}
                                        <span>{specs.topSpeed}</span>
                                        <p>{product.top_speed}</p>
                                      </div>
                                      <div className="vida-model-compare__popupspecs-item">
                                        {/* <i className="vida-model-compare__popupspecs-item-battery"></i> */}
                                        <span>{specs.chargeDuration}</span>
                                        <p>
                                          &#60;
                                          {product.charging_time}
                                        </p>
                                      </div>
                                      <div className="vida-model-compare__popupspecs-item">
                                        {/* <i className="vida-model-compare__popupspecs-item-speed"></i> */}
                                        <span>{specs.pickUp}</span>
                                        <p>{product.accelerator}</p>
                                      </div>
                                    </div>
                                    <div className="vida-model-compare__popupspecs-value">
                                      <div className="vida-model-compare__popupspecs-item">
                                        <span>{specs.ridingModes}</span>
                                        <p>{product.ridingModes}</p>
                                      </div>
                                    </div>
                                    <div className="vida-model-compare__popupspecs-value">
                                      <div className="vida-model-compare__popupspecs-item">
                                        <span>{specs.seatingType}</span>
                                        <p>{product.seatingType}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </Popup>
                  </div>
                )}
              </div>
            </div>
            <div className="vida-model-compare__specs-container">
              {productInfo &&
                productInfo.length > 0 &&
                productInfo.map((product, index) => {
                  return (
                    <div
                      key={index + product.productName}
                      className="vida-model-compare__specs-item"
                    >
                      <div
                        key={product.productName + index}
                        className="vida-model-compare__specs-product"
                      >
                        <div
                          className="vida-model-compare__media"
                          onMouseOver={(e) => {
                            product.isVideo && handleMouseOver(e);
                          }}
                          onMouseOut={(e) => {
                            product.isVideo && handleMouseOut(e);
                          }}
                        >
                          <div className="vida-model-compare__image">
                            <img
                              src={product.baseImg}
                              alt={product?.productName || "Product Image"}
                            />
                            {product.isVideo ? (
                              <video
                                muted
                                loop
                                id={"product-video-" + index}
                                src={product.hoverImg}
                              ></video>
                            ) : (
                              <img
                                className="hoverImg"
                                src={product.hoverImg}
                                alt={product?.productName || "Product Image"}
                              />
                            )}
                          </div>
                        </div>
                        <div className="vida-model-compare__specs-title">
                          <h3>{product.productName}</h3>
                          {product.effectivePrice && (
                            <div className="vida-model-compare__specs-price">
                              {currencyUtils.getCurrencyFormatValue(
                                `${
                                  product?.productSku === "V1PLASARCEL"
                                    ? product?.effectivePrice &&
                                      product?.effectivePrice >= 30000
                                      ? product?.effectivePrice - 30000
                                      : product?.effectivePrice
                                    : product?.effectivePrice
                                }`
                              )}
                              <span className="vida-model-compare__specs-price-tag">
                                {specs.priceTag}
                                {tooltipConfig.info && (
                                  <>
                                    <span
                                      className="notification__icon"
                                      data-tip={tooltipConfig.info}
                                      data-for={tooltipConfig.id}
                                    >
                                      <i className="icon-information-circle txt-color--orange"></i>
                                    </span>
                                    <ReactTooltip
                                      place={tooltipConfig.infoPosition}
                                      type="warning"
                                      effect="solid"
                                      id={tooltipConfig.id}
                                    />
                                  </>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="vida-model-compare__specs-value">
                          <div className="vida-model-compare__specs-item">
                            <i className="icon-lightning-bolt"></i>
                            {specs?.enableCertifiedRange ? (
                              <>
                                <p>{product?.certified_range}</p>
                                <span>{specs?.certifiedRange}</span>
                              </>
                            ) : (
                              <>
                                <p>{product?.range}</p>
                                <span>{specs?.range}</span>
                              </>
                            )}
                          </div>
                          <div className="vida-model-compare__specs-item">
                            <img
                              className=""
                              src={resourcePath + "images/png/speed-icon.png"}
                              alt="Speed Icon"
                            />
                            <p>{product.top_speed}</p>
                            <span>{specs.topSpeed}</span>
                          </div>
                          <div className="vida-model-compare__specs-item">
                            <i className="icon-battery"></i>
                            <p>&#60;{product.charging_time}</p>
                            <span>{specs.chargeDuration}</span>
                          </div>
                          <div className="vida-model-compare__specs-item">
                            <img
                              className=""
                              src={resourcePath + "images/png/speed-icon.png"}
                              alt="Speed Icon"
                            />
                            <p>{product.accelerator}</p>
                            <span>{specs.pickUp}</span>
                          </div>
                        </div>
                        <div className="vida-model-compare__footer">
                          {bookTestDrive ? (
                            <a
                              href={testDriveUrl}
                              onClick={(event) => handleTestRide(event)}
                              className="vida-model-compare__footer-test-drive"
                            >
                              {bookTestDrive}
                            </a>
                          ) : (
                            ""
                          )}
                          {downloadBrochure.url ? (
                            <a
                              href={downloadBrochure.url}
                              target="_blank"
                              className="vida-model-compare__footer-test-drive"
                              rel="noreferrer"
                              onClick={(event) => handleDownloadBrochure(event)}
                            >
                              {downloadBrochure.label}
                            </a>
                          ) : (
                            ""
                          )}
                          {configurationUrl && (
                            <a
                              href={configurationUrl}
                              className="vida-model-compare__footer-configure"
                              onClick={(event) => handleConfiguration(event)}
                            >
                              {configure}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
CompareModel.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    tagLine: PropTypes.string,
    selectedCityId: PropTypes.string,
    splitterChar: PropTypes.string,
    CompareLinkText: PropTypes.string,
    specs: PropTypes.shape({
      title: PropTypes.string,
      priceTag: PropTypes.string,
      range: PropTypes.string,
      topSpeed: PropTypes.string,
      chargeDuration: PropTypes.string,
      pickUp: PropTypes.string,
      ridingModes: PropTypes.string,
      seatingType: PropTypes.string,
      enableCertifiedRange: PropTypes.bool,
      certifiedRange: PropTypes.string
    }),
    tooltipConfig: PropTypes.shape({
      info: PropTypes.string,
      infoPosition: PropTypes.string,
      id: PropTypes.string
    }),
    selectedProduct: PropTypes.array,
    bookTestDrive: PropTypes.string,
    downloadBrochure: PropTypes.object,
    configure: PropTypes.string
  }),
  userProfileData: PropTypes.object,
  cityData: PropTypes.string
};
CompareModel.defaultProps = {
  config: {}
};

const mapStateToProps = ({ userProfileDataReducer, myScooterReducer }) => {
  return {
    userProfileData: {
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    cityData: myScooterReducer.cityData
  };
};
export default connect(mapStateToProps)(CompareModel);
