import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import {
  getProductBranchesData,
  getProductPricesData
} from "../../../services/productDetails/productDetailsService";
import appUtils from "../../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import { useForm } from "react-hook-form";
import InputField from "../forms/InputField/InputField";
import CONSTANT from "../../../../site/scripts/constant";
import { updateNameToDisplay } from "../../../services/commonServices/commonServices";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";

const ModelVariantView = (props) => {
  const { config, userProfileData, scooterData, formConfig } = props;
  // const [openVisualizer, setOpenVisualizer] = useState(false);
  const [priceList, setPriceList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const bikeContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showWhatsIncluded, setShowWhatsIncluded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    scooterData?.products?.items[0]?.variants[0]?.attributes[0]?.label.toLowerCase() ||
      config?.colors[0]?.variants[0].color.toLowerCase() ||
      "red"
  );
  const [currentImage, setCurrentImage] = useState(0);
  const dataElement = document?.getElementById("tooltip-data");
  const [defaultCity, setDefaultCity] = useState("NEW DELHI~DELHI~INDIA");
  const [bikePrice, setBikePrice] = useState("");
  const [tooltipData, setTooltipData] = useState("");
  const [tooltipIcon, setTooltipIcon] = useState("");
  const [variantActiveIndex, setVariantActiveIndex] = useState(0);
  const [userName, setUserName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [variant, setVariant] = useState(scooterData?.products?.items[0]?.name);
  const [isLeftDisabled, setLeftDisabled] = useState(true);
  const [isRightDisabled, setRightDisabled] = useState(true);
  const CustomTitleTag = config?.titleTag || "div";
  const isLoggedIn = loginUtils.isSessionActive();
  const cityDropdown = document.getElementsByClassName(
    "model-variant-dropdown"
  )[0];
  const fallbackTooltipData =
    "*Price is inclusive of portable charger, FAME II subsidy and state government subsidy (Wherever applicable).";
  const totalImages = config.imagesPerDesign; // Change this based on the total number of bike images
  const { whatsIncludedContent, whatsIncludedLabel } = config.whatsIncluded;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches[0].pageX);
  };

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      let customLink = {};
      if (e.target.tagName == "FORM") {
        customLink = {
          ctaText: e.target.querySelector("button[type='submit']").innerText,
          ctaLocation: e.target.dataset.linkPosition
        };
      } else {
        customLink = {
          ctaText: e.target.innerText,
          ctaLocation: e.target.dataset.linkPosition
        };
      }
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  // const handleVisualizer = () => {
  //   setOpenVisualizer(!openVisualizer);
  // };

  const handleDragMove = (e) => {
    if (!isDragging) {
      return;
    }
    const x = e.pageX || e.touches[0].pageX;
    const differenceX = startX - x;
    const sensitivity = 10; // Adjust this value for sensitivity

    if (Math.abs(differenceX) > sensitivity) {
      if (differenceX > 0) {
        setCurrentImage((prevImage) => (prevImage + 1) % totalImages);
      } else {
        setCurrentImage((prevImage) =>
          prevImage === 0 ? totalImages - 1 : prevImage - 1
        );
      }
      setStartX(x);
    }
  };
  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleBuyNowClick = (e) => {
    ctaTracking(e);
    window.location.href = config?.buyNowButtonUrl + "?" + config.heading;
  };

  // To Capitalise first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const {
    register,
    setError,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const convert = (n) => {
    n = String(n);
    if (n.length == 1) {
      n = "0" + n;
    }
    return n;
  };

  const getProductPrice = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };
  const colorSwitcher = (color) => {
    setSelectedColor(color.toLowerCase());
  };
  const changeCity = (e) => {
    const obj = priceList.find(
      (branch) =>
        branch.city_state_id.toLowerCase() === e.target.value.toLowerCase() &&
        branch?.item_sku?.toLowerCase() === config.colors[0]?.sku?.toLowerCase()
    );
    setBikePrice(obj?.exShowRoomPrice || "");
  };
  const getProductBranch = async () => {
    const result = await getProductBranchesData();
    setBranchList(result);
  };
  const boxContainer = useRef();
  // const enableDisableBtn = () => {
  //   if (
  //     Math.trunc(
  //       boxContainer.current.firstElementChild.getBoundingClientRect().left
  //     ) == Math.trunc(boxContainer.current.getBoundingClientRect().left)
  //   ) {
  //     setLeftDisabled(true);
  //   } else {
  //     setLeftDisabled(false);
  //   }
  //   if (
  //     Math.trunc(
  //       boxContainer.current.lastElementChild.getBoundingClientRect().left +
  //         boxContainer.current.lastElementChild.getBoundingClientRect().width
  //     ) ==
  //     Math.trunc(
  //       boxContainer.current.getBoundingClientRect().left +
  //         boxContainer.current.getBoundingClientRect().width
  //     )
  //   ) {
  //     setRightDisabled(true);
  //   } else {
  //     setRightDisabled(false);
  //   }
  // };
  // const scrollLeft = () => {
  //   boxContainer.current.scrollBy({
  //     left: -boxContainer.current.firstElementChild.clientWidth, // Adjust scroll distance as needed
  //     behavior: "smooth"
  //   });
  //   setTimeout(() => {
  //     enableDisableBtn();
  //   }, "500");
  // };
  // const scrollRight = () => {
  //   boxContainer.current.scrollBy({
  //     left: boxContainer.current.firstElementChild.clientWidth, // Adjust scroll distance as needed
  //     behavior: "smooth"
  //   });
  //   setTimeout(() => {
  //     enableDisableBtn();
  //   }, "500");
  // };
  // useEffect(() => {
  //   enableDisableBtn();
  //   boxContainer.current.addEventListener("scroll", enableDisableBtn);
  // }, [isLeftDisabled, isRightDisabled]);

  useEffect(() => {
    if (scooterData) {
      // checking query params for redirect from design your vida to get selected scooter
      const queryString = location.href.split("?")[1];
      if (queryString) {
        const decryptedParams = cryptoUtils.decrypt(queryString);
        const params = new URLSearchParams("?" + decryptedParams);
        const productItemId = params.get("productItemId");
        const productItemSkuId = params.get("productItemSkuId");
        const variant = params.get("variant");
        const color = params.get("color");

        if (productItemId && productItemSkuId) {
          const variantIndex = scooterData.products.items.findIndex(
            (temp) => temp["sf_id"] === productItemId
          );
          setVariantActiveIndex(variantIndex);
          setVariant(variant);
          handleVariantClick(
            scooterData.products.items[variantIndex],
            variantIndex
          );
          let variantColorItemIndex = 0;
          variantColorItemIndex = scooterData.products.items[
            variantIndex
          ].variants.findIndex(
            (temp) => temp.product["sf_id"] === productItemSkuId
          );
          const savedColor =
            scooterData.products.items[variantIndex].variants[
              variantColorItemIndex
            ].attributes[0].label;
          colorSwitcher(savedColor);
        } else if (variant && color) {
          const variantIndex = scooterData.products.items.findIndex(
            (temp) => temp["name"] === variant
          );
          setVariantActiveIndex(variantIndex);
          setVariant(variant);
          handleVariantClick(
            scooterData.products.items[variantIndex],
            variantIndex
          );
          colorSwitcher(color);
        }
      }
    }
  }, [scooterData]);
  useEffect(() => {
    if (isLoggedIn) {
      setValue(
        "fname",
        updateNameToDisplay(userProfileData.fname, userProfileData.lname)
      );
    }
  }, []);
  useEffect(() => {
    if (userProfileData && cityDropdown) {
      if (isLoggedIn) {
        cityDropdown.value =
          `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`.toUpperCase();
      } else {
        cityDropdown.value = defaultCity;
      }
    }
  }, [cityDropdown, userProfileData]);

  useEffect(() => {
    getProductPrice();
    getProductBranch();
    if (priceList && priceList.length > 0) {
      changeCity({
        target: {
          value: isLoggedIn
            ? `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`
            : defaultCity
        }
      });
    }
  }, []);

  useEffect(() => {
    changeCity({
      target: {
        value: isLoggedIn
          ? `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`
          : defaultCity
      }
    });
  }, [priceList, userProfileData]);

  useEffect(() => {
    const tooltipDataAttribute = dataElement?.getAttribute("data-tooltip");
    const tooltipIconAttribute = dataElement?.getAttribute("data-tooltip-icon");
    const getDefaultCity = dataElement?.getAttribute("data-default-city");
    setTooltipData(tooltipDataAttribute || "");
    setTooltipIcon(tooltipIconAttribute || "");
    if (getDefaultCity) {
      setDefaultCity(getDefaultCity);
    }
  }, [dataElement]);

  return (
    <div
      className="model-variant-wrapper__flex vida-2-container"
      style={{
        backgroundImage: `url(${
          config?.variantTwo ? "" : config.backgroundImagePath
        })`
      }}
    >
      {!config?.variantTwo && <h1 className="heading">{config.heading}</h1>}
      {!config?.variantTwo && (
        <CustomTitleTag className="bold-heading">
          {config.description}
        </CustomTitleTag>
      )}
      {config?.variantTwo && (
        <div
          className={
            config?.variantTwo ? "design-vida-bold-heading" : "bold-heading"
          }
        >
          {config.description}
        </div>
      )}
      <div className={config?.variantTwo ? "design-vida-wrapper" : ""}>
        <form
          className="form-fields__name"
          data-link-position={config?.dataPosition || "designYourVida"}
          onSubmit={handleSubmit((formData, event) =>
            handleFormNameSubmit(formData, event)
          )}
        >
          <div
            className={config?.variantTwo ? "design-vida-right-wrapper" : ""}
          >
            {config?.variantTwo && (
              <div className="design-vida">
                <div className="design-vida__details">
                  <p className="design-vida__beginLabel">{config?.text1}</p>
                  <p className="design-vida__headerLabel">{config?.text2}</p>
                  <InputField
                    name="fname"
                    label={formConfig?.label}
                    placeholder={formConfig?.placeholder}
                    value=""
                    validationRules={formConfig?.validationRules}
                    register={register}
                    errors={errors}
                    checkNameFormat
                    onChangeHandler={handleInputChange}
                    // inputFocusHandler={handleStartTrackAnalytics}
                  />
                  <p className="dealer-finder-error-msg">{errorMsg}</p>
                  <p className="design-vida__header">{config?.buyNowLabel}</p>
                  <div className="design-vida-scooter__variant-buttons">
                    {/* // REMOVE this code and put product data*/}
                    {scooterData?.products?.items?.map((product, index) => (
                      <button
                        className={`design-vida-scooter__type-text ${
                          index === variantActiveIndex
                            ? "scooter__selected"
                            : "scooter__not-selected"
                        }`}
                        key={index}
                        type="button"
                        onClick={(e) => {
                          handleVariantClick(product, index);
                        }}
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div
              className={`model-variant-content-container ${
                config?.variantTwo ? "design-vida-model-variant-container" : ""
              }`}
            >
              <div
                className={`model-variant ${
                  config?.variantTwo ? "modal-varient-content-design-vida" : ""
                }`}
              >
                <div className="image-container">
                  <div className="image-group">
                    <div
                      ref={bikeContainerRef}
                      className="image"
                      onMouseDown={handleDragStart}
                      onMouseMove={handleDragMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchMove={handleDragMove}
                      onTouchEnd={handleDragEnd}
                    >
                      <img
                        className={`image1 ${
                          config?.variantTwo ? "image1-design-vida" : ""
                        }`}
                        alt={
                          config?.baseImgAlt ||
                          `An Image showcasing VIDA ${
                            config?.heading
                          } Electric Scooter - ${capitalizeFirstLetter(
                            selectedColor
                          )}`
                        }
                        title={
                          config?.baseImgTitle ||
                          `${capitalizeFirstLetter(selectedColor)} VIDA ${
                            config?.heading
                          } Electric Scooter`
                        }
                        draggable="false"
                        loading="lazy"
                        src={
                          isDesktop
                            ? `${
                                config.imageBasePath + "/" + selectedColor
                              }/${convert(currentImage + 1)}.${
                                config.imageExtension
                              }`
                            : `${
                                config.imageBasePathMobile + "/" + selectedColor
                              }/${convert(currentImage + 1)}.${
                                config.imageExtension
                              }`
                        }
                      />
                      <div
                        className={
                          config?.variantTwo
                            ? "design-vida-platform"
                            : "platform"
                        }
                      ></div>
                      {!config?.variantTwo && (
                        <div className="colors">
                          {config.colors[0]?.variants.map((obj, index) => (
                            <div
                              key={index + "variant"}
                              className={`${
                                obj.color?.toLowerCase() === "white"
                                  ? "border-black"
                                  : ""
                              } ${
                                selectedColor == obj.color?.toLowerCase()
                                  ? "selec"
                                  : ""
                              }`}
                              style={{
                                background: `${getProductColor[obj.color]}`
                              }}
                              onClick={() => colorSwitcher(obj.color)}
                            ></div>
                          ))}
                        </div>
                      )}

                      {!config?.variantTwo && (
                        <div className="visualizer-color-text-wrapper">
                          <div className="color-text">{config.colorChoice}</div>

                          {/* <div
                    className={`visualizer-icons-mobile ${
                      openVisualizer ? "open" : "open"
                    }`}
                  >
                    {openVisualizer && (
                      <div className="additional-icons-container">
                        {config.icons.map((icon, index) => (
                          <div key={index} className="icon-class">
                            <img
                              src={icon.url}
                              alt="visualizer-option-icon"
                              className="icon1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={`visualizer-icon icon-class ${
                        openVisualizer ? "open" : ""
                      }`}
                      onClick={handleVisualizer}
                    >
                      <img
                        src={
                          appUtils.getConfig("resourcePath") +
                          "images/svg/options-sharp.svg"
                        }
                        alt="visualizer-icon"
                        className="visualizer-icon"
                      />
                    </div>
                  </div> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {config?.variantTwo && (
                <div className="color-selection">
                  <p className="design-vida-scooter__header">
                    Choose your colour
                  </p>
                  <div className="colors" style={{ marginTop: 0 }}>
                    {scooterData?.products?.items[
                      variantActiveIndex
                    ]?.variants.map((obj, index) => (
                      <div
                        key={index + "color"}
                        className={`${
                          selectedColor ===
                          obj?.attributes[0]?.label?.toLowerCase()
                            ? "selected-outer-border"
                            : ""
                        }`}
                        style={{
                          borderColor: `${
                            obj?.attributes[0]?.label?.toLowerCase() === "white"
                              ? "black"
                              : getProductColor[obj?.attributes[0]?.label]
                          }`
                        }}
                      >
                        <div
                          key={index + "variant"}
                          className={`${
                            obj?.attributes[0]?.label?.toLowerCase() === "white"
                              ? "border-black"
                              : ""
                          } ${
                            selectedColor ==
                            obj?.attributes[0]?.label?.toLowerCase()
                              ? "selec"
                              : ""
                          }`}
                          style={{
                            background: `${
                              getProductColor[obj?.attributes[0]?.label]
                            }`
                          }}
                          onClick={() =>
                            colorSwitcher(obj?.attributes[0]?.label)
                          }
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!config?.variantTwo && (
                <div className="model">
                  <div className="box-flex-container">
                    <div className="left">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: config.text1
                        }}
                      ></p>
                      <select
                        onChange={changeCity}
                        className="model-variant-dropdown"
                        style={{
                          backgroundImage: `url(${appUtils.getConfig(
                            "resourcePath"
                          )}images/svg/chevron-down.svg)`
                        }}
                      >
                        <option>{config.cityDropdownPlaceholder}</option>
                        {branchList
                          ?.sort((a, b) => (a?.cityName > b?.cityName ? 1 : -1))
                          ?.map((branch, index) => (
                            <option
                              key={branch.id}
                              value={branch.id}
                              selected={index === 0}
                            >
                              {branch.cityName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="right">
                      <div className="price">
                        <p className="amount">
                          {
                            currencyUtils
                              .getCurrencyFormatValue(bikePrice)
                              .split(".")[0]
                          }
                          <span className="global-tooltip">
                            <img
                              src={
                                tooltipIcon ||
                                appUtils.getConfig("resourcePath") +
                                  "images/svg/tooltip-icon.svg"
                              }
                              data-tip
                              data-for="modelVariant"
                              alt="modelVariant"
                            ></img>
                          </span>
                        </p>
                        <p className="price-text">{config.text2}</p>
                      </div>
                      {!showWhatsIncluded && (
                        <div
                          className="toolbar"
                          onClick={() =>
                            setShowWhatsIncluded(!showWhatsIncluded)
                          }
                        >
                          {whatsIncludedLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {showWhatsIncluded && (
                    <div
                      onClick={() => setShowWhatsIncluded(!showWhatsIncluded)}
                      className="whats-included-container"
                    >
                      <p className="whats-included-container__header">
                        {whatsIncludedLabel}
                      </p>
                      {whatsIncludedContent.map((data, index) => {
                        return (
                          <li
                            className="whats-included-container__text"
                            key={index}
                          >
                            {data?.whatsIncludedData}
                          </li>
                        );
                      })}
                    </div>
                  )}
                  <div
                    data-link-position={
                      config?.dataPosition || "modelVariantView"
                    }
                    onClick={(e) => handleBuyNowClick(e)}
                    className="button"
                  >
                    {config.buyNowLabel}
                  </div>
                  <div className="model-box-container">
                    {/* <div className="model-box-scroll-btn-container">
                      <button
                        className={`scroll-btn left ${
                          isLeftDisabled ? "disabled" : ""
                        }`}
                        onClick={() => scrollLeft()}
                      ></button>
                      <button
                        className={`scroll-btn right ${
                          isRightDisabled ? "disabled" : ""
                        }`}
                        onClick={() => scrollRight()}
                      ></button>
                    </div> */}
                    <HorizontalScroll>
                      <div className="box-container" ref={boxContainer}>
                        {config.offerCardContent.length > 1 &&
                          config.offerCardContent?.map((item, index) => (
                            <p key={`${index + "abc"}`} className="box">
                              <img className="box1" src={item?.icon} />
                              <div className="box2">{item?.title}</div>
                            </p>
                          ))}
                      </div>
                    </HorizontalScroll>
                  </div>
                </div>
              )}
              <ReactTooltip id="modelVariant" place="left" effect="solid">
                {tooltipData || fallbackTooltipData}
              </ReactTooltip>
            </div>
            {config?.variantTwo && !isDesktop && (
              <div className="btn-container vida-design-next-btn-container">
                <button
                  type="submit"
                  className="btn btn--primary btn--full-width vida-design-next-btn"
                  // onClick={handleDesignVidaSubmit}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          {config?.variantTwo && isDesktop && (
            <div className="btn-container vida-design-next-btn-container">
              <button
                type="submit"
                className="btn btn--primary btn--full-width vida-design-next-btn"
                //onClick={handleDesignVidaSubmit}
              >
                Next
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    }
  };
};

ModelVariantView.propTypes = {
  config: PropTypes.shape({
    variantTwo: PropTypes.bool,
    dataPosition: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    titleTag: PropTypes.string,
    imagesPerDesign: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.any),
    colors: PropTypes.arrayOf(PropTypes.any),
    colorChoice: PropTypes.string,
    offerCardContent: PropTypes.arrayOf(PropTypes.any),
    cityList: PropTypes.arrayOf(PropTypes.string),
    text1: PropTypes.string,
    price: PropTypes.string,
    text2: PropTypes.string,
    whatsIncluded: PropTypes.shape({
      whatsIncludedContent: PropTypes.arrayOf(
        PropTypes.shape({
          whatsIncludedData: PropTypes.string
        })
      ),
      whatsIncludedLabel: PropTypes.string
    }),
    buyNowLabel: PropTypes.string,
    imageBasePath: PropTypes.string,
    backgroundImagePath: PropTypes.string,
    cityDropdownPlaceholder: PropTypes.string,
    visualizerIcon: PropTypes.string,
    buyNowButtonUrl: PropTypes.string,
    imageExtension: PropTypes.string,
    imageBasePathMobile: PropTypes.string,
    baseImgAlt: PropTypes.string,
    baseImgTitle: PropTypes.string
  }),
  userProfileData: PropTypes.object,
  handleDesignVidaClick: PropTypes.func,
  scooterData: PropTypes.object,
  formConfig: PropTypes.object
};

export default connect(mapStateToProps)(ModelVariantView);
