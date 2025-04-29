import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import BuyVidaVariant from "../BuyVidaVariant/BuyVidaVariant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";

const ProductVariant = (props) => {
  const {
    dataPosition,
    productWithVariant,
    exShowRoomLabel,
    buyNowButtonLabel,
    learnMoreLabel,
    headerLabel,
    buyNowHeaderLabel,
    mobileBannerBackgroundImagePath,
    desktopBannerBackgroundImagePath,
    variant_specification_details,
    isVariantTwo,
    modelButtonLabel,
    modelButtonUrl
  } = props.config;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const [productVarientLength, setProductVarientLength] = useState(null);
  const [productList, setProductList] = useState([]);
  const [priceList, setPriceList] = useState();
  const [showHotspot, setShowHotspot] = useState(true);
  const dataElement = document?.getElementById("tooltip-data");
  const [defaultCity, setDefaultCity] = useState("NEW DELHI~DELHI~INDIA");
  const bikeTargetRefs = useRef([]);

  // Create an array of refs
  const createRef = (index) => {
    bikeTargetRefs.current[index] = React.createRef();
  };

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    if (result) {
      setPriceList(result);
    }
  };

  useEffect(() => {
    if (productWithVariant && productWithVariant[0]?.variantImageList) {
      productWithVariant[0]?.variantImageList.forEach((_, index) =>
        createRef(index)
      );
    }
  }, []);

  useEffect(() => {
    setProductVarientLength(productWithVariant[0].variantImageList.length);
    setProductList(productWithVariant[0].productVariantInfoList);
  }, []);

  useEffect(() => {
    getProductPriceList();
  }, []);

  useEffect(() => {
    const getDefaultCity = dataElement?.getAttribute("data-default-city");
    if (getDefaultCity) {
      setDefaultCity(getDefaultCity);
    }
  }, [dataElement]);

  useEffect(() => {
    const handleScroll = () => {
      const bike1 = document.querySelector(".bike-variant-hotspot__0");
      const bike2 = document.querySelector(".bike-variant-hotspot__1");
      const bike3 = document.querySelector(".bike-variant-hotspot__2");

      const target1 = document.querySelector(".bike-target-container0");
      const target2 = document.querySelector(".bike-target-container1");
      const target3 = document.querySelector(".bike-target-container2");

      const bikeTargetRef1 = bikeTargetRefs?.current?.[0]?.current?.offsetTop;
      const bikeTargetRef2 = bikeTargetRefs?.current?.[1]?.current?.offsetTop;
      const bikeTargetRef3 = bikeTargetRefs?.current?.[2]?.current?.offsetTop;
      const additionalHeight =
        window.innerWidth >= 1024 ? 20 : window.innerWidth >= 768 ? -50 : -130;
      const scrollPosition = window.scrollY;

      if (target1 && bike1) {
        setShowHotspot(false);
        // Calculate the maximum scroll allowed for each bike
        var maxScroll1 = bikeTargetRef1 - bike1.offsetHeight + additionalHeight;
        var scale = 1;
        // Adjust the position of bike1
        if (scrollPosition <= maxScroll1) {
          bike1.style.transform = `translateY(${scrollPosition}px)`;
          // bike1.style.scale = `${scale}`;
          window.innerWidth >= 1024
            ? (bike1.style.scale = scrollPosition === 0 ? 1.3 : 1)
            : "";
        } else {
          bike1.style.transform = `translateY(${maxScroll1}px)`;
          bike1.style.scale = `${scale}`;
        }
      }

      if (scrollPosition < 20) {
        setShowHotspot(true);
      }

      if (target2 && bike2) {
        const delayFactor = 0.8; // Adjust this value for the desired delay effect
        const speedFactor = 1.5;
        const delayedScrollPosition =
          scrollPosition * delayFactor * speedFactor;

        const maxScroll2 =
          bikeTargetRef2 - bike2.offsetHeight + additionalHeight;
        if (delayedScrollPosition <= maxScroll2) {
          bike2.style.transform = `translateY(${delayedScrollPosition}px)`;
          window.innerWidth >= 1024
            ? (bike2.style.scale = scrollPosition === 0 ? 1.3 : 1)
            : "";
        } else {
          bike2.style.transform = `translateY(${maxScroll2}px)`;
          bike2.style.scale = `${scale}`;
        }
      }

      if (target3 && bike3) {
        const delayFactor = 1; // Adjust this value for the desired delay effect
        const speedFactor = 2;
        const delayedScrollPosition =
          scrollPosition * delayFactor * speedFactor;

        const maxScroll3 =
          bikeTargetRef3 - bike3.offsetHeight + additionalHeight;
        if (delayedScrollPosition <= maxScroll3) {
          bike3.style.transform = `translateY(${delayedScrollPosition}px)`;
          window.innerWidth >= 1024
            ? (bike3.style.scale = scrollPosition === 0 ? 1.3 : 1)
            : "";
        } else {
          bike3.style.transform = `translateY(${maxScroll3}px)`;
          bike3.style.scale = `${scale}`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBikeClick = () => {
    const containerOffset1 = bikeTargetRefs?.current?.[0]?.current?.offsetTop;
    const containerOffset2 = bikeTargetRefs?.current?.[1]?.current?.offsetTop;
    const containerOffset3 = bikeTargetRefs?.current?.[2]?.current?.offsetTop;
    if (containerOffset3) {
      window.scrollTo({
        top: containerOffset1,
        behavior: "smooth"
      });
    } else if (containerOffset2) {
      window.scrollTo({
        top: containerOffset2,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({
        top: containerOffset1,
        behavior: "smooth"
      });
    }
  };

  const handleCompareVariant = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: event.target.innerText,
        ctaLocation: "Home"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div>
      {!isVariantTwo && (
        <div
          className={`product-varient__container ${
            productVarientLength < 3
              ? "product-varient__two-varient"
              : "product-varient__three-varient"
          }`}
        >
          <div
            className="product-varient__banner"
            style={{
              backgroundImage: `url(${
                isDesktop
                  ? desktopBannerBackgroundImagePath
                  : mobileBannerBackgroundImagePath
              })`
            }}
          >
            <div className="vida-2-container">
              <h1 className="product-varient__item-name">
                {productWithVariant[0].item_name || ""}
              </h1>
              <div
                className="product-varient__header"
                dangerouslySetInnerHTML={{
                  __html: headerLabel
                }}
              ></div>
              {!isDesktop && (
                <div className="product-varient__bike-container">
                  {productWithVariant[0].variantImageList
                    ?.sort((a, b) => (a.order > b.order ? 1 : -1))
                    .map((item, index) => (
                      <div
                        id={item.order}
                        className={`${
                          productVarientLength < 3
                            ? productVarientLength < 2
                              ? "product-varient__bike-two-varient single-varient"
                              : "product-varient__bike-two-varient"
                            : "product-varient__bike-three-varient"
                        }`}
                        key={item.sectionid + index}
                      >
                        <img
                          id={`bike-variant-hotspot__${index}`}
                          className={`bike-variant-hotspot__${index}`}
                          src={item.varinatMobileImage}
                          alt={item.altText}
                          title={item?.imageTitleVariant}
                          style={{ transition: `all 0.${20 - index * 5}s` }}
                        ></img>
                        <a
                          className="product-varient__anchor-button"
                          style={{ opacity: showHotspot ? 1 : 0 }}
                          href={`#${item.sectionid}`}
                        >
                          <img
                            onClick={handleBikeClick}
                            src={
                              appUtils.getConfig("resourcePath") +
                              "images/svg/anchorButton.svg"
                            }
                            alt="navigation button"
                          ></img>
                        </a>
                      </div>
                    ))}
                </div>
              )}
              {isDesktop && (
                <div
                  className={`product-varient-desktop__content ${
                    productVarientLength < 3
                      ? productVarientLength < 2
                        ? "product-varient__bike-two-varient single-varient"
                        : "product-varient__bike-two-varient"
                      : "product-varient__bike-three-varient"
                  }`}
                >
                  <div className="product-varient-desktop__bike-container">
                    {productWithVariant[0].variantImageList
                      ?.slice(0, 3)
                      .map((item, index) => (
                        <div
                          className={`bike-variant-hotspot__${index} ${
                            productWithVariant[0].variantImageList.length === 2
                              ? "product-varient-desktop__bike-two-varient"
                              : "product-varient-desktop__bike-three-varient"
                          }`}
                          key={item.sectionid + index}
                        >
                          <img
                            src={item.varinatDesktopImage}
                            alt={item.altText}
                            title={item?.imageTitleVariant}
                            style={{ transition: `all 0.${20 - index * 5}s` }}
                            loading="lazy"
                          ></img>
                        </div>
                      ))}
                  </div>
                  <div className="product-varient-desktop__detail-wrapper">
                    <div className="product-varient__bike-details-wrapper">
                      {variant_specification_details
                        ?.sort((a, b) => (a.order > b.order ? 1 : -1))
                        .map((item, index) => (
                          <div
                            className="product-varient__bike-details"
                            key={index}
                          >
                            <div className="product-varient__image-wrapper">
                              <img
                                src={item.specificationinIcon}
                                alt={item.specificationinIconAlt}
                              ></img>
                            </div>
                            <div className="product-varient__details">
                              <div className="product-varient__details-text-wrapper">
                                <p className="product-varient__details-text">
                                  {item.specificationLabel}
                                </p>
                              </div>
                              <div className="product-varient__details-specifications">
                                {item.specificationValue.length > 0 && (
                                  <p className="product-varient__spec-value">
                                    {item.specificationValue}
                                  </p>
                                )}
                                <p className="product-varient__spec-unit">
                                  {item.specificationUnit}
                                  {item.specificationLabel === "IDC Range" && (
                                    <span className="custom-span">*</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isDesktop && (
            <div className="product-varient__bike-details-wrapper">
              {variant_specification_details
                ?.sort((a, b) => (a.order > b.order ? 1 : -1))
                .map((item, index) => (
                  <div
                    className="product-varient__bike-details"
                    key={item.specificationLabel + index}
                  >
                    <div className="product-varient__image-wrapper">
                      <img
                        src={item.specificationinIconMobile}
                        alt={item.specificationinIconAlt}
                      ></img>
                    </div>
                    <div className="product-varient__details">
                      <div className="product-varient__details-text-wrapper">
                        <p className="product-varient__details-text">
                          {item.specificationLabel}
                        </p>
                      </div>
                      <div className="product-varient__details-specifications">
                        {item.specificationValue.length > 0 && (
                          <p className="product-varient__spec-value">
                            {item.specificationValue}
                          </p>
                        )}
                        <p className="product-varient__spec-unit">
                          {item.specificationUnit}
                          {item.specificationLabel === "IDC Range" && (
                            <span className="custom-span">*</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      <BuyVidaVariant
        dataPosition={dataPosition}
        ProductDetailData={productList}
        exShowRoomLabel={exShowRoomLabel}
        buyNowButtonLabel={buyNowButtonLabel}
        learnMoreLabel={learnMoreLabel}
        buyNowHeaderLabel={buyNowHeaderLabel}
        bikeTargetRefs={bikeTargetRefs}
        productVariantData={productWithVariant[0].variantImageList}
        priceListData={priceList}
        isVariantTwo={isVariantTwo}
        defaultCity={defaultCity}
      />
      {isVariantTwo && (
        <div className="product-varient__btn-container">
          <a
            className="product-varient__view-model-button"
            onClick={(e) => handleCompareVariant(e)}
            href={modelButtonUrl}
          >
            {modelButtonLabel}
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductVariant;

ProductVariant.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    productWithVariant: PropTypes.arrayOf(PropTypes.any),
    variant_specification_details: PropTypes.arrayOf(PropTypes.any),
    exShowRoomLabel: PropTypes.string,
    buyNowButtonLabel: PropTypes.string,
    isVariantTwo: PropTypes.bool,
    modelButtonLabel: PropTypes.string,
    modelButtonUrl: PropTypes.string,
    learnMoreLabel: PropTypes.string,
    headerLabel: PropTypes.string,
    buyNowHeaderLabel: PropTypes.string,
    mobileBannerBackgroundImagePath: PropTypes.string,
    desktopBannerBackgroundImagePath: PropTypes.string
  })
};
