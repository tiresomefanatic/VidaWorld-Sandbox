import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import productDetailsConfig from "../../../../site/scripts/product-details-config";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const VariantSwitcher = (props) => {
  const { userProfileData } = props;
  const {
    dataPosition,
    selectedProduct,
    buttonLabel,
    productDetailsTitle,
    titleTag,
    preTitleTag,
    title,
    preTitle,
    items,
    chargingTimeDesktopIcon,
    batteryDesktopIcon,
    batteryMobileIcon,
    rangeDesktopIcon,
    topSpeedDesktopIcon,
    chargingTimeMobileIcon,
    rangeMobileIcon,
    topSpeedMobileIcon,
    exShowroomLabel,
    preRemovableBatteryTitle,
    isShowDesignYourVidaBtn
  } = props.config;
  const [productDetailsList, setproductDetailsList] = useState([]);
  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [priceList, setPriceList] = useState([]);
  const dataElement = document?.getElementById("tooltip-data");
  const [tooltipData, setTooltipData] = useState("");
  const [cityData, setCityData] = useState("");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [defaultCity, setDefaultCity] = useState("NEW DELHI~DELHI~INDIA");
  const [tooltipIcon, setTooltipIcon] = useState("");
  const isLoggedIn = loginUtils.isSessionActive();
  const fallbackTooltipData =
    "*Price is inclusive of portable charger, FAME II subsidy and state government subsidy (Wherever applicable).";
  const animation = ["growup-animation", "growin-animation"];
  const rotateAnimation = [
    "rotate-img-left-animation",
    "rotate-img-right-animation"
  ];
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const CustomTitleTag = titleTag || "p";
  const CustomPreTitleTag = preTitleTag || "p";
  // intersection observer
  const {
    ref: variantSwitcherContainerRef,
    isVisible: variantSwitcherContainerVisible
  } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
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
  const getProductDetails = () => {
    const filterProuductDetailsList = [];
    items.map((data) => {
      if (
        selectedProduct?.some((product) => data.varSku === product?.productSku)
      ) {
        filterProuductDetailsList.push({
          productName: data.item_name,
          productImage: data.item_image,
          batteryCapacity: data.batteryCapacity,
          batteryCapacityUnit: data.batteryCapacityUnit,
          productDetails: data.productVariantInfoList[0],
          productVariants: data.productVariantInfoList
        });
      }
    });

    setproductDetailsList(filterProuductDetailsList);
  };

  const tabSwitchingHandler = (index) => {
    setCurrentIndex(index);
  };

  const getHours = (totalMinutes) => {
    return Math.floor(totalMinutes / 60);
  };

  const getMinutes = (totalMinutes) => {
    return totalMinutes % 60;
  };

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
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

  useEffect(() => {
    const getCityData = JSON.parse(
      window.sessionStorage.getItem("selectedCity")
    );
    if (getCityData && getCityData?.city !== "") {
      setCityData(getCityData);
      window.sessionStorage.removeItem("selectedCity");
    }
  }, []);

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
    <section
      className="variant-switcher"
      ref={variantSwitcherContainerRef}
      style={{ opacity: variantSwitcherContainerVisible ? 1 : 0 }}
    >
      <CustomPreTitleTag className="variant-switcher--subheading">
        {preTitle}
      </CustomPreTitleTag>
      <CustomTitleTag className="variant-switcher--heading">
        {title}
      </CustomTitleTag>

      <div className="variant-switcher--tab">
        <div className="variant-switcher--tab--wrapper">
          {productDetailsList.map((item, index) => (
            <>
              {index === currentIndex && (
                <div
                  className={`variant-switcher--tab--image ${
                    index == 0 ? "left" : "right"
                  }`}
                >
                  <img
                    src={`${selectedProduct[index]?.baseImg}`}
                    alt={`${selectedProduct[index]?.imageAltBase}`}
                    title={`${selectedProduct[index]?.imageTitleBase}`}
                  ></img>
                </div>
              )}
              <div
                className={`variant-switcher--tab-button ${
                  currentIndex == index ? "active" : ""
                } ${index == 0 ? "left" : "right"}`}
              >
                <div className="variant-switcher-content">
                  <p
                    className="variant-switcher-content--title"
                    onClick={() => tabSwitchingHandler(index)}
                  >
                    {item.productName}
                  </p>
                  <div className="variant-switcher-content--price">
                    Price{" "}
                    <span>
                      {getVariantPrice(
                        item?.productDetails?.variant_sku,
                        cityData && cityData?.city !== ""
                          ? `${cityData?.city}~${cityData?.state}~${defaultCountry}`
                          : isLoggedIn
                          ? `${userProfileData?.city}~${userProfileData?.state}~${userProfileData?.country}`
                          : defaultCity
                      )}
                    </span>
                    <span className="global-tooltip fill-white">
                      <img
                        src={
                          tooltipIcon ||
                          appUtils.getConfig("resourcePath") +
                            "images/svg/tooltip-icon.svg"
                        }
                        data-tip
                        data-for="switcherVariant"
                        alt="switcherVariant"
                      ></img>
                    </span>
                    <p className="variant-switcher-content--price--details">
                      {exShowroomLabel}
                    </p>
                  </div>
                </div>
              </div>
              <ReactTooltip id="switcherVariant" place="right" effect="solid">
                {tooltipData || fallbackTooltipData}
              </ReactTooltip>
            </>
          ))}
        </div>
        {productDetailsList.map((item, index) => (
          <>
            {index === currentIndex && (
              <div
                key={index + item?.productName}
                className="variant-switcher--tab--panel"
              >
                <div className="variant-switcher-desktop-panel-detail">
                  <div className="variant-switcher--tab--panel--detail justify-content-between">
                    <div className="varaint-switcher-battery-details">
                      <p className="variant-switcher--tab--panel--detail--subheading">
                        {preRemovableBatteryTitle}
                      </p>
                      <p className="variant-switcher--tab--panel--detail--title battery-count-title">
                        {productDetailsTitle?.battery}
                      </p>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {item?.batteryCapacity}{" "}
                        <span className="variant-switcher--tab--panel--detail--title kwh-unit">
                          {item?.batteryCapacityUnit}
                        </span>
                      </div>
                    </div>
                    <div className="battery-img">
                      <div className="battery-img--background"></div>
                      <div className="battery-img--wrapper">
                        <img
                          className={`${rotateAnimation[index]}`}
                          src={`${selectedProduct[index].batteryImg}`}
                          alt={`${selectedProduct[index]?.imageAltBattery}`}
                          title={`${selectedProduct[index]?.imageTitleBattery}`}
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div className="variant-switcher--tab--panel--detail justify-content-between">
                    <div>
                      <div className="variant-switcher--tab--panel--detail--title">
                        <img
                          src={
                            isDesktop ? batteryDesktopIcon : batteryMobileIcon
                          }
                        ></img>
                        <p>
                          <span className="variant-switcher--tab--panel--detail--value">
                            {productDetailsTitle?.batteryQuantity}
                          </span>
                          <span>{productDetailsTitle?.battery}</span>
                        </p>
                      </div>

                      <div className="variant-switcher--tab--panel--detail--value">
                        <span className="variant-switcher--tab--panel--detail--title">
                          {item?.batteryCapacity} {item?.batteryCapacityUnit}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="variant-switcher--tab--panel--detail--title">
                        <img
                          src={
                            isDesktop
                              ? chargingTimeDesktopIcon
                              : chargingTimeMobileIcon
                          }
                        ></img>
                        {productDetailsTitle.charging_time}
                      </div>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {!productDetailsTitle.enableFastChargingTime
                          ? getHours(
                              item?.productDetails?.variant_charging_time_value
                            )
                          : getHours(
                              item?.productDetails
                                ?.variant_fast_charging_time_value
                            )}
                        <span className="variant-switcher--tab--panel--detail--title">
                          h
                        </span>
                        <span className="variant-switcher--tab--panel--detail--value">
                          {" "}
                          {!productDetailsTitle.enableFastChargingTime
                            ? getMinutes(
                                item?.productDetails
                                  ?.variant_charging_time_value
                              )
                            : getMinutes(
                                item?.productDetails
                                  ?.variant_fast_charging_time_value
                              )}{" "}
                        </span>
                        <span className="variant-switcher--tab--panel--detail--title">
                          min
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="variant-switcher--tab--panel--detail--title">
                        <img
                          src={isDesktop ? rangeDesktopIcon : rangeMobileIcon}
                        ></img>

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
                          <span className="variant-switcher--tab--panel--detail--title">
                            {item.productDetails.variant_certified_range_unit
                              ? item.productDetails.variant_certified_range_unit
                              : `${item.productDetails.variant_certified_range_value}`.replace(
                                  /[0-9]/g,
                                  ""
                                )}
                          </span>
                        </div>
                      ) : (
                        <div className="variant-switcher--tab--panel--detail--value">
                          {item.productDetails.variant_range_value}{" "}
                          <span className="variant-switcher--tab--panel--detail--title">
                            {item.productDetails.variant_range_unit + "*"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="variant-switcher--tab--panel--detail--title">
                        <img
                          src={
                            isDesktop ? topSpeedDesktopIcon : topSpeedMobileIcon
                          }
                        ></img>
                        {productDetailsTitle.top_speed}
                      </div>
                      <div className="variant-switcher--tab--panel--detail--value">
                        {item.productDetails.variant_top_speed_value}
                        <span className="variant-switcher--tab--panel--detail--title">
                          {item.productDetails.variant_top_speed_unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="variant-switcher--tab--panel--detail">
                  <h3 className="variant-switcher--tab--panel--detail--title">
                    Available in {item.productVariants.length} colours{" "}
                  </h3>
                  <div
                    className={`variant-switcher--tab--panel--detail--colors-container ${animation[index]}`}
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
                <div className="variant-switcher--tab--panel--link">
                  <a
                    href={selectedProduct[index].labelLink}
                    data-link-position={dataPosition || "variantSwitcher"}
                    onClick={(e) => ctaTracking(e)}
                    target={
                      selectedProduct[index].isLabelNewtab ? "_blank" : "_self"
                    }
                    rel="noreferrer"
                  >
                    {selectedProduct[index].label}
                  </a>
                </div>
              </div>
            )}
          </>
        ))}

        {isShowDesignYourVidaBtn && (
          <div className="variant-switcher--tab--button">
            <button
              className="btn btn--tertiary-2 variant-switcher--tab--button"
              data-link-position={dataPosition || "variantSwitcher"}
              onClick={(e) => ctaTracking(e)}
              type="button"
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </section>
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

VariantSwitcher.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    selectedProduct: PropTypes.arrayOf(
      PropTypes.shape({
        productSku: PropTypes.string,
        baseImg: PropTypes.string,
        batteryImg: PropTypes.string,
        label: PropTypes.string,
        labelLink: PropTypes.string,
        isLabelNewtab: PropTypes.bool,
        imageAltBase: PropTypes.string,
        imageTitleBase: PropTypes.string,
        imageAltBattery: PropTypes.string,
        imageTitleBattery: PropTypes.string
      })
    ),
    productDetailsTitle: PropTypes.any,
    items: PropTypes.any,
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
    preTitle: PropTypes.string,
    titleTag: PropTypes.string,
    preTitleTag: PropTypes.string,
    chargingTimeDesktopIcon: PropTypes.string,
    batteryDesktopIcon: PropTypes.string,
    batteryMobileIcon: PropTypes.string,
    rangeDesktopIcon: PropTypes.string,
    topSpeedDesktopIcon: PropTypes.string,
    chargingTimeMobileIcon: PropTypes.string,
    rangeMobileIcon: PropTypes.string,
    topSpeedMobileIcon: PropTypes.string,
    exShowroomLabel: PropTypes.string,
    preRemovableBatteryTitle: PropTypes.string,
    isShowDesignYourVidaBtn: PropTypes.bool
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(VariantSwitcher);
