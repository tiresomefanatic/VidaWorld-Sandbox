import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useGetAllProducts } from "../../../../react-components/hooks/preBooking/preBookingHooks";
import Logger from "../../../../services/logger.service";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import ModelVariantView from "../ModelVariantView/ModelVariantView";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setUserStatusAction } from "../../../store/userAccess/userAccessActions";
import ReDirectionCards from "../ReDirectionCards/ReDirectionCards";
import {
  getBikeDetailsByString,
  getScooterDataByColorString
} from "../../../services/commonServices/commonServices";
import { RWebShare } from "react-web-share";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { setScooterInfoAction } from "../../../store/scooterInfo/scooterInfoActions";
import { useSaveMyDesign } from "../../../hooks/designYourVida/designYourVidaHooks";
import CONSTANT from "../../../../site/scripts/constant";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const DesignVida = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const [scooterData, setScooterData] = useState(null);
  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const [variantActiveIndex, setVariantActiveIndex] = useState(0);
  const [priceList, setPriceList] = useState([]);
  const [isUserDataAvailable, setUserDataAvailable] = useState(false);
  const [isActiveScooterModel, setActiveScooterModel] = useState();
  const [isVidaPriceDetailsPage, setIsVidaPriceDetailsPage] = useState(false);
  const [isVidaDesignVidaHomePage, setIsVidaDesignVidaHomePage] =
    useState(true);
  const [selectedScooterInfo, setSelectedScooterInfo] = useState("");
  const [selectedScooterURL, setSelectedScooterURL] = useState("");
  useState(true);
  const [optedBikeVariant, setOptedBikeVariant] = useState({});
  const [selectedScooterDetails, setSelectedScooterDetails] = useState({});
  const getAllProductData = useGetAllProducts();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [productItemId, setProductItemId] = useState("");
  const postSaveDesign = useSaveMyDesign();
  const [variant, setVariant] = useState("");
  const {
    config,
    userProfileData,
    userData,
    selectedScooterData,
    setScooterInfo
  } = props;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const inputValue = selectedScooterInfo?.formName?.split(" ")[0];
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  // Analytics code
  const ctaTracking = (e, eventName) => {
    if (isAnalyticsEnabled && e.target.dataset.isAnalytics) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const ctaTrackingShare = (e, eventName, btnLocationText) => {
    if (isAnalyticsEnabled) {
      const ctaLocationText = config?.dataPositionShare
        ? config.dataPositionShare
        : btnLocationText;
      const customLink = {
        ctaText: e,
        ctaLocation: ctaLocationText
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  // setting url param
  const getEncrpterUrl = () => {
    return [
      "color=",
      selectedScooterDetails?.product?.vaahan_color,
      "&variant=",
      selectedScooterInfo.variant,
      "&sku=",
      selectedScooterDetails?.product?.sku,
      "&name=",
      selectedScooterInfo?.formName,
      "&productItemId=",
      productItemId,
      "&productItemSkuId=",
      selectedScooterDetails?.product?.sf_id
    ].join("");
  };

  //redirecting to booking page on make it yours button submit
  const handleMakeYoursSubmit = async (e) => {
    ctaTracking(e, "ctaButtonClick");
    const redirectUrl = config.genericConfig.makeItYoursUrl;
    window.location.href = redirectUrl;
    // setIsVidaPriceDetailsPage(false);
    // setIsMakeItYoursPage(true);
  };

  // Redirecting to signin/signup page if user is not loged in / or regitered
  // if logged in then redirecting to booking page
  const handleSaveDesign = async (e) => {
    if (!isUserLoggedIn) {
      ctaTracking(e, "ctaButtonClick");
      const encryptParams = getEncrpterUrl();
      const encryptedParams = cryptoUtils.encrypt(encryptParams);
      window.location.href =
        config.genericConfig.loginUserLink +
        "?redirectURL=" +
        config.genericConfig.designYourVidaRedirectionUrl +
        "?" +
        encryptedParams;
    } else {
      setSpinnerActionDispatcher(true);
      ctaTracking(e, "ctaButtonClick");
      if (selectedScooterDetails) {
        const variables = {
          product_ItemId: productItemId,
          product_ItemSkuId: selectedScooterDetails?.product?.sf_id
        };
        const saveMyDesignDetails = await postSaveDesign({
          variables
        });
        if (
          saveMyDesignDetails?.data?.saveMyDesign?.status.toLowerCase() ===
          "success"
        ) {
          showNotificationDispatcher({
            title: saveMyDesignDetails?.data?.saveMyDesign?.message,
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
          setTimeout(() => {
            const redirectUrl =
              config.genericConfig.designYourVidaRedirectionUrl;
            window.location.href = redirectUrl;
          }, 1000);
        } else {
          showNotificationDispatcher({
            title: saveMyDesignDetails?.errors?.message,
            type: CONSTANT.NOTIFICATION_TYPES.ERROR,
            isVisible: true
          });
        }
      } else {
        setSpinnerActionDispatcher(false);
      }
    }
  };

  // fetinching the all products data on page load
  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });
      if (allProductsData) {
        allProductsData.data.products.items =
          allProductsData.data.products.items.filter(function (item) {
            return item.variants.length > 0;
          });
        let cityStateId = "";
        cityStateId = config.scooterInfo.defaultCityState;
        allProductsData?.data?.products?.items?.map((model) => {
          model?.variants?.map((variant) => {
            priceList?.map((item) => {
              if (
                item.city_state_id.toLowerCase() ===
                  cityStateId.toLowerCase() &&
                item.variant_sku === variant.product.sku
              ) {
                variant.product["price"] = currencyUtils.getCurrencyFormatValue(
                  item.effectivePrice
                );
                variant.product["city"] =
                  cityStateId &&
                  cityStateId.split(config.scooterInfo.splitterChar)[0];
              }
            });
          });
        });
        setScooterData(allProductsData.data);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  // finding the selected scooter info from the sccoter data
  const handleSelectedScooterData = async (info) => {
    const selectedVariantData =
      scooterData?.products?.items[info.variantActiveIndex];
    const selectedScooterColarData = await getScooterDataByColorString(
      info.selectedColor,
      selectedVariantData.variants
    );

    setProductItemId(
      scooterData?.products?.items[info.variantActiveIndex]?.sf_id
    );
    setSelectedScooterDetails(selectedScooterColarData);
    setActiveScooterModel(selectedScooterColarData?.product?.sku);
  };

  // handling submit for going to make it yours page
  const handleDesignVidaClick = (info) => {
    setSelectedScooterInfo(info);
    handleSelectedScooterData(info);
    setVariantActiveIndex(info.variantActiveIndex);
    setIsVidaDesignVidaHomePage(false);
    setIsVidaPriceDetailsPage(true);
    setVariant(info.variant);
  };

  // get the data related to the selected scooter variant/color
  const getSelectedScooterData = async () => {
    const globalVarName = selectedScooterInfo.variant
      .replace(" ", "")
      .toLowerCase();
    const bikeVariantDetails = //JSON.parse(
      config?.genericConfig?.bikeVariantDetails || "{}";
    //);
    const bikeVariants = bikeVariantDetails?.bikeVariants;

    // Find the variant object with matching variantName
    const matchingVariant = bikeVariants.find(
      (variant) =>
        variant.variantName.replace(" ", "").toLowerCase() === globalVarName
    );

    const bikeVariant = matchingVariant.variantDetails
      ? matchingVariant.variantDetails
      : [];

    const selectedBikeVariant = await getBikeDetailsByString(
      selectedScooterInfo.selectedColor,
      bikeVariant
    );
    setOptedBikeVariant(selectedBikeVariant);
  };

  const reApplySelectedScooter = async () => {
    const globalVarName = selectedScooterData.name
      .replace(" ", "")
      .toLowerCase();
    const bikeVariantDetails =
      config?.genericConfig?.bikeVariantDetails || "{}";
    const bikeVariants = bikeVariantDetails?.bikeVariants;

    // Find the variant object with matching variantName
    const matchingVariant = bikeVariants.find(
      (variant) =>
        variant.variantName.replace(" ", "").toLowerCase() === globalVarName
    );

    const bikeVariant = matchingVariant.variantDetails
      ? matchingVariant.variantDetails
      : [];

    const selectedBikeVariant = await getBikeDetailsByString(
      selectedScooterData?.selectedVariant?.product?.vaahan_color,
      bikeVariant
    );
    setOptedBikeVariant(selectedBikeVariant);
  };

  useEffect(() => {
    const encryptParams = [
      "color=",
      selectedScooterInfo.selectedColor,
      "&variant=",
      selectedScooterInfo.variant
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(encryptParams);
    setSelectedScooterURL(encryptedParams);
  }, [selectedScooterInfo]);

  useEffect(() => {
    if (selectedScooterDetails && selectedScooterDetails?.product) {
      const data = {
        name: scooterData?.products?.items[variantActiveIndex].name,
        sku: selectedScooterDetails?.product?.sku,
        sf_id: selectedScooterDetails?.product?.sf_id,
        variants: scooterData?.products?.items[variantActiveIndex],
        selectedVariant: selectedScooterDetails
      };
      setScooterInfo(data);
    }
  }, [selectedScooterDetails]);

  useEffect(() => {
    if (selectedScooterInfo && selectedScooterInfo !== "") {
      getSelectedScooterData();
    } else if (
      selectedScooterData &&
      selectedScooterData?.sku &&
      selectedScooterData?.sku !== ""
    ) {
      // might be needed for api integration
      // setIsVidaDesignVidaHomePage(false);
      // setIsVidaPriceDetailsPage(true);
      // reApplySelectedScooter();
      // console.log(selectedScooterData);
    }
  }, [selectedScooterInfo]);

  useEffect(() => {
    getProductPriceList();
  }, []);

  useEffect(() => {
    if (priceList?.length > 0) {
      if (isUserLoggedIn) {
        if (isUserDataAvailable) {
          getAllProductsData();
        }
      } else {
        getAllProductsData();
      }
    }
  }, [priceList, isUserDataAvailable]);

  useEffect(() => {
    if (
      userProfileData.fname ||
      (userProfileData.city && userProfileData.state && userProfileData.country)
    ) {
      setUserDataAvailable(true);
    }
  }, [userProfileData]);

  return (
    <div>
      <div className="buy-now-pre-booking-vida2__background">
        <img src={config.genericConfig.backgroundImg} loading="lazy" />
      </div>
      {isVidaDesignVidaHomePage && scooterData && (
        <div style={{ position: "relative" }}>
          <ModelVariantView
            config={config.modelVariantViewConfig}
            formConfig={config.firstNameField}
            userProfileData={userProfileData}
            handleDesignVidaClick={handleDesignVidaClick}
            scooterData={scooterData}
          ></ModelVariantView>
        </div>
      )}
      {isVidaPriceDetailsPage && (
        <div className="design-your-vida-price-details">
          <div className="design-your-vida-price-details__price-details">
            <div className="design-your-vida-price-details__right-side-wrapper">
              <div style={{ borderRadius: "8px", backgroundColor: "white" }}>
                <div
                  className="design-your-vida-price-details__top-banner"
                  style={{
                    backgroundImage: `url(${
                      optedBikeVariant?.bgImg ||
                      config?.genericConfig?.bannerBackgroundImg
                    })`
                  }}
                >
                  <div className="design-your-vida-price-details__user-details-wrapper">
                    <div
                      className="design-your-vida-price-details__user-details"
                      style={{
                        color:
                          optedBikeVariant?.textColor ||
                          config?.genericConfig?.textColor
                      }}
                    >
                      <p
                        className="design-your-vida-price-details__user-name"
                        style={{ fontSize: fontSize }}
                      >
                        {`${
                          selectedScooterInfo?.formName.split(" ")[0] ||
                          selectedScooterData?.buyerName
                        }'s`}
                      </p>
                      <p className="design-your-vida-price-details__bike-name">
                        {selectedScooterInfo.variant ||
                          config?.genericConfig?.subHeader}
                      </p>
                      <p className="design-your-vida-price-details__sub-text">
                        {optedBikeVariant?.color ||
                          config?.genericConfig?.subText}
                      </p>
                    </div>
                    <div className="design-your-vida-price-details__bike-image">
                      <img
                        src={
                          optedBikeVariant?.bikeImg ||
                          config?.genericConfig?.bannerBikeImg
                        }
                        alt={
                          config?.genericConfig?.bannerBikeImgAlt || "bike img"
                        }
                        title={config?.genericConfig?.bannerBikeImgTitle}
                        loading="lazy"
                      ></img>
                    </div>
                  </div>
                </div>
                <div className="design-your-vida-price-details__scooter-details">
                  {scooterData?.products?.items
                    .filter((item, index) => {
                      return index == variantActiveIndex;
                    })
                    .map((product, index) => (
                      <ScooterInfo
                        scooterInfoConfig={config.scooterInfo}
                        isSpecificationLayout={true}
                        genericConfig={config.genericConfig}
                        isImgLeftLayout={true}
                        productData={product}
                        key={index}
                        isActiveScooterModel={
                          isActiveScooterModel
                            ? product.sku == isActiveScooterModel
                              ? true
                              : false
                            : index == 0
                            ? true
                            : false
                        }
                        isOnStepThree={false}
                      ></ScooterInfo>
                    ))}
                </div>
                <div className="design-your-vida-price-details__bike-price">
                  <p className="design-your-vida-price-details__exshowroom-price">
                    {selectedScooterDetails?.product?.price}
                  </p>
                  <p className="design-your-vida-price-details__exshowroom-text">
                    {config?.scooterInfo?.priceType}
                  </p>
                </div>
              </div>
              <ReDirectionCards
                config={config.redirectioncard}
                isDesignVida={true}
              ></ReDirectionCards>
            </div>
            <div className="design-your-vida-price-details__left-side-wrapper">
              {isDesktop && (
                <div className="bold-heading">
                  {config.modelVariantViewConfig.description}
                </div>
              )}
              <div className="design-your-vida-price-details__btn-wrapper">
                <div className="btn-container design-your-vida-price-details__make-it-yours-btn-container">
                  <button
                    data-is-analytics={true}
                    className="btn--full-width design-your-vida-price-details__make-it-yours-btn-container__make-it-yours-btn"
                    onClick={handleMakeYoursSubmit}
                  >
                    {config?.genericConfig?.makeItBtnText}
                  </button>
                </div>
                <div
                  className="design-your-vida-price-details__variant-buttons"
                  data-link-position={config?.dataPosition || "shareMyDesign"}
                  onClick={(e) => ctaTracking(e, "ctaButtonClick")}
                >
                  <RWebShare
                    data={{
                      url: `${config?.genericConfig?.designVidaShareUrl}?${selectedScooterURL}`
                    }}
                  >
                    <button
                      className="design-your-vida-price-details__type-text design-your-vida-price-details__not-selected"
                      type="button"
                      data-link-position={
                        config?.dataPosition || "shareMyDesign"
                      }
                      data-is-analytics={true}
                    >
                      {config?.genericConfig?.shareBtnText}
                    </button>
                  </RWebShare>
                  <button
                    className="design-your-vida-price-details__type-text design-your-vida-price-details__not-selected"
                    data-link-position={config?.dataPosition || "saveMyDesign"}
                    data-is-analytics={true}
                    onClick={handleSaveDesign}
                  >
                    {config?.genericConfig?.saveDesignBtnText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({
  userAccessReducer,
  scooterInfoReducer,
  preBookingReducer,
  userProfileDataReducer
}) => {
  return {
    userData: {
      sfid: userAccessReducer.sfid,
      isLogin: userAccessReducer.isLogin,
      countryCode: userAccessReducer.countryCode,
      numberOrEmail: userAccessReducer.numberOrEmail,
      mobileNumber: userAccessReducer.mobileNumber,
      firstname: userAccessReducer.fname,
      lastname: userAccessReducer.lname,
      email: userAccessReducer.email,
      customerExists: userAccessReducer.customerExists,
      subscribe: preBookingReducer.subscribe,
      source: preBookingReducer.source,
      customerCity: userAccessReducer.customerCity,
      customerState: userAccessReducer.customerState,
      customerCountry: userAccessReducer.customerCountry,
      branchId: preBookingReducer.branchId,
      partnerId: preBookingReducer.partnerId,
      dealerName: preBookingReducer.dealerName,
      dealerPinCode: preBookingReducer.pincode,
      dealerPhoneNumber: preBookingReducer.dealerPhoneNumber,
      dealerAddress: preBookingReducer.dealerAddress
    },
    selectedScooterData: {
      name: scooterInfoReducer.name,
      sku: scooterInfoReducer.sku,
      sf_id: scooterInfoReducer.sf_id,
      variants: scooterInfoReducer.variants,
      selectedVariant: scooterInfoReducer.selectedVariant
    },
    userProfileData: {
      fname: userProfileDataReducer.fname,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country,
      email: userProfileDataReducer.email,
      number: userProfileDataReducer.number
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserStatus: (status) => {
      dispatch(setUserStatusAction(status));
    },
    setScooterInfo: (data) => {
      dispatch(setScooterInfoAction(data));
    }
  };
};

DesignVida.propTypes = {
  config: PropTypes.object,
  userProfileData: PropTypes.object,
  selectedScooterData: PropTypes.object,
  setScooterInfo: PropTypes.func,
  userData: PropTypes.shape({
    sfid: PropTypes.string,
    isLogin: PropTypes.bool,
    countryCode: PropTypes.string,
    numberOrEmail: PropTypes.string,
    mobileNumber: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    customerExists: PropTypes.bool,
    subscribe: PropTypes.bool,
    source: PropTypes.string,
    customerCountry: PropTypes.string,
    customerCity: PropTypes.string,
    customerState: PropTypes.string,
    branchId: PropTypes.string,
    partnerId: PropTypes.string,
    dealerName: PropTypes.string,
    dealerPinCode: PropTypes.string,
    dealerAddress: PropTypes.string,
    dealerPhoneNumber: PropTypes.string
  })
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignVida);
