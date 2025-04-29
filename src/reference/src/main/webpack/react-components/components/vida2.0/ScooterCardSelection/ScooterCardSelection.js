import React, { useEffect, useState } from "react";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useModelVariantList } from "../../../hooks/testDrive/testDriveHooks";
import { getCityListForDealers } from "../../../../services/location.service";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { getUserCityDetails } from "../../../services/locationFinder/locationFinderService";
import appUtils from "../../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { useGetAllProducts } from "../../../hooks/preBooking/preBookingHooks";
import Logger from "../../../../../webpack/services/logger.service";

const ScooterCardSelection = ({
  config,
  modelVariantList,
  userProfileData,
  emiCalculatorHandler,
  cityInputErrorMsg,
  isDealerAvailable
}) => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const defaultCityList = appUtils.getConfig("cityList");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [sortedOptions, setSortedOptions] = useState();
  const [availableCityList, setAvailableCityList] = useState();
  const [showOption, setShowOption] = useState(false);
  const [priceList, setPriceList] = useState([]);
  const [usesLocation, setUserLocation] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [storeSfId, setStoreSfId] = useState();
  const [variantSelection, setVariantSelection] = useState();
  const [allProducts, setAllProducts] = useState();
  const defaultCityValue = "NEW DELHI";
  const [v1ProPrice, setV1ProPrice] = useState("");
  const [v1plusPrice, setV1plusPrice] = useState("");
  const [cityFieldErrorMsg, setCityFieldErrorMsg] = useState("");

  const {
    title,
    secondTitle,
    showingCityLabel,
    scooterLabel,
    scooterBgImageMobile,
    scooterBgImageLeftDesktop,
    scooterBgImageRightDesktop,
    scooterBgImageAltText,
    scooterBgImageAltTitle,
    effectivePriceLabel,
    selectCityLabel,
    selectedCityIcon,
    selectCityIcon,
    selectCityAltText,
    selectCityAltTitle,
    bikeImgMobile,
    bikeImgDesktop,
    bikeImgAltText,
    bikeImgAltTitle,
    defaultCityState,
    genericConfig
  } = config;

  const isLoggedIn = loginUtils.isSessionActive();
  const [searchValue, setSearchValue] = useState("");
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const cityInputField =
    document.getElementsByClassName("city-finder-input")[0];
  const getModelVariantList = useModelVariantList();
  const getAllProductData = useGetAllProducts();
  const [cityValue, setCityValue] = useState();

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForDealers(defaultCountry);
    if (cityListRes) {
      setAvailableCityList(cityListRes);
    }
  };

  const getModelVariants = async () => {
    try {
      await getModelVariantList({
        variables: {
          type_id: "configurable"
        }
      });
    } catch (e) {
      console.error(e);
    }
  };
  const CustomTitleTag = config?.titleTag || "p";
  const CustomSubTitleTag = config?.subTitleTag || "p";
  const CustomPreTitleTag = config?.preTitleTag || "p";

  const getVariantPrice = (variantSku, defaultCity) => {
    let storeCity = defaultCityState;
    if (availableCityList) {
      for (const data of availableCityList) {
        if (data?.city.toLowerCase().includes(defaultCity.toLowerCase())) {
          storeCity = `${data?.city}~${data?.state}~${defaultCountry}`;
          break;
        }
      }
    }

    let price = 0;
    priceList.map((item) => {
      if (
        item.city_state_id.toLowerCase() === storeCity.toLowerCase() &&
        item.item_sf_id === variantSku
      ) {
        price = currencyUtils.getCurrencyFormatValue(item?.exShowRoomPrice, 0);
      }
    });
    return price;
  };

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });
      if (allProductsData) {
        setAllProducts(allProductsData?.data?.products.items);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    getModelVariants();
    fetchCityList();
    getProductPriceList();
    getAllProductsData();
  }, []);

  useEffect(() => {
    if (variantSelection) {
      if (emiCalculatorHandler) {
        emiCalculatorHandler(
          cityInputField.value.length > 0
            ? cityInputField.value
            : defaultCityValue,
          variantSelection
        );
      }
    }
  }, [variantSelection]);

  useEffect(() => {
    if (isLoggedIn) {
      const getLoggedInUserCity = userProfileData.city;
      if (getLoggedInUserCity) {
        cityInputField.value = getLoggedInUserCity;
        setSearchValue(getLoggedInUserCity);
      }
    }
  }, [userProfileData?.city]);

  useEffect(() => {
    if (allProducts && modelVariantList) {
      const defaultBikeVariant = allProducts.filter((item) => {
        if (item.sf_id === modelVariantList[0]?.sf_id) {
          return item;
        }
      });
      if (defaultBikeVariant) {
        setVariantSelection(defaultBikeVariant[0]?.variants[0]?.product.sf_id);
      }
    }
  }, [modelVariantList, allProducts]);

  const getPrice = (city) => {
    setV1plusPrice(getVariantPrice(modelVariantList[0]?.sf_id, city));
    setV1ProPrice(getVariantPrice(modelVariantList[1]?.sf_id, city));
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (userProfileData?.city && userProfileData?.city !== "") {
        getPrice(userProfileData?.city);
        setCityValue(userProfileData?.city);
      } else {
        setCityValue(defaultCityValue);
        getPrice(defaultCityValue);
      }
    } else {
      getPrice(defaultCityValue);
      setCityValue(defaultCityValue);
    }
  }, [modelVariantList, availableCityList, priceList]);

  const handleSortOptions = () => {
    const filterBySearch = availableCityList
      ?.filter((item) => {
        if (item?.city.toUpperCase().includes(searchValue.toUpperCase())) {
          return item;
        }
      })
      .sort((a, b) => (a?.city > b?.city ? 1 : -1));
    setSortedOptions(filterBySearch);
  };

  const handleOnFocus = () => {
    handleSortOptions();
    setShowOption(true);
  };

  const handleOnKeyUp = () => {
    handleSortOptions();
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };

  const handleOptionSelect = (value, e) => {
    cityInputField.value = value.city;
    setShowOption(false);
    if (emiCalculatorHandler) {
      getPrice(value.city);
      emiCalculatorHandler(value.city, variantSelection);
    }
  };

  const handleCardClick = (index, sfid) => {
    setSelectedCardIndex(index);
    setStoreSfId(sfid);
    if (allProducts) {
      const variantData = allProducts.filter((item) => {
        if (item.sf_id === sfid) {
          return item;
        }
      });
      setVariantSelection(variantData[0].variants[0].product.sf_id);
    }
  };

  // for getting user location
  const getUserCityFromLocality = async (position) => {
    setSpinnerActionDispatcher(true);
    const getCityDetails = await getUserCityDetails(position);
    if (getCityDetails) {
      const getUserCityFromDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("locality")
        ).long_name;
      const getUserCityByLocation = getUserCityFromDetails.toUpperCase();
      cityInputField.value = getUserCityByLocation;
      setUserLocation(getUserCityByLocation);
      setLocationEnabled(true);
      setSpinnerActionDispatcher(false);
      if (emiCalculatorHandler) {
        getPrice(getUserCityByLocation);
        emiCalculatorHandler(getUserCityByLocation, variantSelection);
      }
    } else {
      setLocationEnabled(false);
      setSpinnerActionDispatcher(false);
    }
  };

  const showError = () => {
    alert(genericConfig?.locationErrorMsg);
  };

  const showPosition = async (position) => {
    setSpinnerActionDispatcher(true);
    await getUserCityFromLocality(position);
    setSpinnerActionDispatcher(false);
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };

  useEffect(() => {
    if (searchValue && !v1plusPrice && !v1ProPrice) {
      setCityFieldErrorMsg(genericConfig?.noDealerErrorMsg);
    } else {
      setCityFieldErrorMsg("");
    }
  }, [searchValue, v1plusPrice, v1ProPrice]);

  useEffect(() => {
    setCityFieldErrorMsg(cityInputErrorMsg);
  }, [cityInputErrorMsg]);

  return (
    <div className="emi-savings-calculator-container">
      <div className="emi-savings-calculator-container__box-container">
        <div className="emi-calculator-wrapper">
          <div className="emi-calculator-wrapper__header-container">
            <CustomTitleTag className="title">{title}</CustomTitleTag>
          </div>
          <div className="emi-calculator-wrapper__select-city-container">
            <div className="emi-calculator-wrapper__select-city-container__second-title-container">
              <CustomSubTitleTag className="title">
                {secondTitle}
              </CustomSubTitleTag>
            </div>
            <div className="search-wrapper">
              <p className="showing-text">{showingCityLabel}</p>
              <div className="search-wrapper__find-city-search-container">
                <div className="icon-container" onClick={handleGetUserLocation}>
                  {locationEnabled ? (
                    <img
                      src={selectCityIcon}
                      alt={selectCityAltText}
                      title={selectCityAltTitle}
                    />
                  ) : (
                    <img
                      src={selectedCityIcon}
                      alt={selectCityAltText}
                      title={selectCityAltTitle}
                    />
                  )}
                </div>
                <input
                  type="text"
                  className="city-finder-input"
                  placeholder={selectCityLabel}
                  onFocus={handleOnFocus}
                  onKeyUp={handleOnKeyUp}
                  onBlur={handleOnBlur}
                  onChange={(e) => setSearchValue(e.target.value)}
                ></input>
                <div
                  className={
                    showOption
                      ? "city-option-container d-block"
                      : "city-option-container d-none"
                  }
                >
                  {sortedOptions?.map((item, index) => (
                    <div
                      className="city-option"
                      key={index}
                      onClick={() => handleOptionSelect(item)}
                    >
                      <p>{item.city}</p>
                    </div>
                  ))}
                </div>
                <p className="city-finder-message">{cityFieldErrorMsg}</p>
              </div>
            </div>
          </div>
          <div className="emi-calculator-wrapper__pick-your-scooter-container">
            <div className="text-container">
              <CustomPreTitleTag className="pick-scooter-text">
                {scooterLabel}
              </CustomPreTitleTag>
            </div>
            <div
              className={`scooter-card-container ${
                !isDealerAvailable ? "scooter-card-no-dealer" : ""
              }`}
            >
              {modelVariantList.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={`scooter-wrapper ${
                      index === selectedCardIndex ? "selected-card" : ""
                    }`}
                    onClick={() => handleCardClick(index, data?.sf_id)}
                  >
                    {/* <div className="left-bg-image-container">
                      <img
                        src={
                          isDesktop
                            ? scooterBgImageLeftDesktop
                            : scooterBgImageMobile
                        }
                        alt={scooterBgImageAltText}
                        title={scooterBgImageAltTitle}
                      />
                    </div> */}
                    <div
                      className={`details-container ${
                        index === selectedCardIndex ? "selected-card" : ""
                      }`}
                    >
                      <p
                        className={`bike-name-label ${
                          index === selectedCardIndex ? "selected-card" : ""
                        }`}
                      >
                        {data?.name}
                      </p>
                      <div className="effective-price-container">
                        <p
                          className={`effective-price ${
                            index === selectedCardIndex ? "selected-card" : ""
                          }`}
                        >
                          {/* {data.name.toLowerCase() === "v1 plus"
                            ? v1plusPrice
                            : v1ProPrice} */}
                          {getVariantPrice(data?.sf_id, cityValue)}
                        </p>
                        {/* <p
                          className={`effective-price-label ${
                            index === selectedCardIndex ? "selected-card" : ""
                          }`}
                        >
                          {effectivePriceLabel}
                        </p> */}
                      </div>
                    </div>
                    {/* <div className="image-container">
                      <img
                        src={isDesktop ? bikeImgDesktop : bikeImgMobile}
                        alt={bikeImgAltText}
                        title={bikeImgAltTitle}
                      />
                    </div>
                    <div className="right-bg-image-container">
                      <img
                        src={isDesktop ? scooterBgImageRightDesktop : ""}
                        alt={scooterBgImageAltText}
                        title={scooterBgImageAltTitle}
                      />
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ testDriveReducer, userProfileDataReducer }) => {
  return {
    modelVariantList: testDriveReducer.modelVariantList,
    userProfileData: userProfileDataReducer
  };
};

ScooterCardSelection.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    titleTag: PropTypes.string,
    subTitleTag: PropTypes.string,
    preTitleTag: PropTypes.string,
    secondTitle: PropTypes.string,
    showingCityLabel: PropTypes.string,
    selectCityLabel: PropTypes.string,
    selectCityIcon: PropTypes.string,
    selectCityAltText: PropTypes.string,
    selectCityAltTitle: PropTypes.string,
    selectedCityIcon: PropTypes.string,
    scooterLabel: PropTypes.string,
    scooterBgImageMobile: PropTypes.string,
    scooterBgImageLeftDesktop: PropTypes.string,
    scooterBgImageRightDesktop: PropTypes.string,
    scooterBgImageAltText: PropTypes.string,
    scooterBgImageAltTitle: PropTypes.string,
    effectivePriceLabel: PropTypes.string,
    bikeImgMobile: PropTypes.string,
    bikeImgDesktop: PropTypes.string,
    bikeImgAltText: PropTypes.string,
    bikeImgAltTitle: PropTypes.string,
    genericConfig: PropTypes.shape({
      locationErrorMsg: PropTypes.string,
      noDealerErrorMsg: PropTypes.string
    }),
    defaultCityState: PropTypes.string
  }),
  modelVariantList: PropTypes.array,
  userProfileData: PropTypes.object,
  emiCalculatorHandler: PropTypes.func,
  cityInputErrorMsg: PropTypes.string,
  isDealerAvailable: PropTypes.bool
};

export default connect(mapStateToProps)(ScooterCardSelection);
