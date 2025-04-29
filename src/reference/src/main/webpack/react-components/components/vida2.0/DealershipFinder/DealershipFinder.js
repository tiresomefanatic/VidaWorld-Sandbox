import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import {
  getCityListForDealers,
  getVidaCentreBranchList
} from "../../../../services/location.service";
import { getUserCityDetails } from "../../../services/locationFinder/locationFinderService";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const DealershipFinder = (props) => {
  const { config, userProfileData } = props;
  const [availableCityList, setAvailableCityList] = useState();
  const [showOption, setShowOption] = useState(false);
  const [sortedOptions, setSortedOptions] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const cityInputField = document.getElementsByClassName(
    "dealership-city-search-input"
  )[0];
  const defaultCountry = appUtils.getConfig("defaultCountry");

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e, text) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: text || e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition,
        ctaLink:
          e?.target?.href || e?.target?.closest("a")?.getAttribute("href")
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const getAvailableCityList = async () => {
    setSpinnerActionDispatcher(true);
    const availableCity = await getCityListForDealers(defaultCountry);
    if (availableCity) {
      setAvailableCityList(availableCity);
      setSpinnerActionDispatcher(false);
    }
  };

  const getDealerList = async (value) => {
    cityInputField.value = value?.city;
    setErrorMsg("");
    if (value?.city?.length > 0) {
      setSpinnerActionDispatcher(true);
      const centreList = await getVidaCentreBranchList(value?.city);
      if (centreList.length > 0) {
        window.sessionStorage.setItem("selectedCity", JSON.stringify(value));
        let redirectionUrl;
        if (config?.redirectionUrl) {
          const city = value?.city.includes(" ")
            ? value?.city.replace(" ", "-").toLowerCase()
            : value?.city.toLowerCase();
          const index = config?.redirectionUrl.indexOf(".html");
          redirectionUrl =
            config?.redirectionUrl.slice(0, index) + "/" + city + ".html";
        } else {
          const city = value?.city.includes(" ")
            ? value?.city.replace(" ", "-").toLowerCase()
            : value?.city.toLowerCase();
          const url = appUtils.getPageUrl("vidaCityPageUrl");
          const index = url.indexOf(".html");
          redirectionUrl =
            url.slice(0, index) +
            "/" +
            city?.charAt(0).toUpperCase() +
            city?.slice(1) +
            ".html";
        }
        window.location.href = redirectionUrl;
        setSpinnerActionDispatcher(false);
      } else {
        setErrorMsg(config?.cityField?.validationRules?.noDealerErrorMsg);
        setSpinnerActionDispatcher(false);
      }
    } else {
      setErrorMsg(config?.cityField?.validationRules?.noValueErrorMsg);
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
      setLocationEnabled(true);
      setSpinnerActionDispatcher(false);
    } else {
      setLocationEnabled(false);
      setSpinnerActionDispatcher(false);
    }
  };

  const showError = () => {
    alert(config?.geoLocationErrorMsg);
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
    setShowOption(true);
    handleSortOptions();
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };

  const handleOnKeyUp = () => {
    handleSortOptions();
  };

  const handleOptionSelect = (value, e, text) => {
    ctaTracking(e, text);
    getDealerList(value);
  };

  useEffect(() => {
    const getLoggedInUserCity = userProfileData.city;
    if (getLoggedInUserCity) {
      cityInputField.value = getLoggedInUserCity;
    }
  }, [userProfileData.city]);

  useEffect(() => {
    getAvailableCityList();
  }, []);

  const CustomTitleTag = config?.titleTag || "p";

  return (
    <div className="dealership-finder-wrapper vida-2-container">
      <img
        className="dealership-finder-bg-img"
        src={
          isDesktop
            ? config?.dealershipFinderBgDesktop
            : config?.dealershipFinderBgMobile
            ? config?.dealershipFinderBgMobile
            : config?.dealershipFinderBgDesktop
        }
        alt="dealership_finder_bg_img"
        loading="lazy"
      ></img>
      <div className="dealership-finder-container">
        <div className="dealership-finder-content-container">
          {isDesktop && (
            <div className="dealership-finder-normal-title">
              <CustomTitleTag className="dealership-finder-normal-title-text">
                {config?.titleText}
              </CustomTitleTag>
            </div>
          )}
          <div className="dealership-finder-title">
            <h2>{config?.dealershipFinderTitle}</h2>
          </div>
          <div className="dealership-finder-first-flex-container">
            <div className="dealership-finder-second-flex-container">
              <div className="dealership-finder-search-container">
                <div
                  className="dealership-location-find-icon"
                  onClick={handleGetUserLocation}
                >
                  {locationEnabled ? (
                    <img
                      src={config?.cityField?.icon}
                      alt={config?.cityField?.locationInfoFirstIconAltText}
                      title={config?.cityField?.locationInfoFirstIconTitle}
                    ></img>
                  ) : (
                    <img
                      src={config?.cityField?.secondIcon}
                      alt={config?.cityField?.locationInfoSecondIconAltText}
                      title={config?.cityField?.locationInfoSecondIconTitle}
                    ></img>
                  )}
                </div>
                <input
                  className="dealership-city-search-input"
                  placeholder={config?.cityField?.placeholder}
                  type="text"
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  onKeyUp={handleOnKeyUp}
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
                <p className="dealership-finder-error-msg">{errorMsg}</p>
              </div>
              <div className="dealership-finder-city-container">
                <div className="dealership-finder-city-title">
                  <p>{config?.popularCitiesText}</p>
                </div>
                <div className="dealership-finder-cities-wrapper">
                  <div className="dealership-finder-cities-container">
                    <div className="dealership-finder-cities-list">
                      {config?.popularCitiesList?.map((item, index) => {
                        const cityId = item?.id.split("~");
                        return (
                          <a
                            className="dealership-city-nav-link"
                            onClick={(e) =>
                              handleOptionSelect(
                                {
                                  city: cityId[0] ? cityId[0] : "",
                                  state: cityId[1] ? cityId[1] : ""
                                },
                                e,
                                item?.cityName
                              )
                            }
                            key={index}
                            rel="noreferrer"
                            data-link-position={
                              config?.dataPosition || "dealershipFinder"
                            }
                          >
                            <div className="dealership-finder-cities-item">
                              <div className="dealership-finder-city-icon">
                                <img
                                  src={item?.cityIcon}
                                  alt="dealership_finder_city_icon"
                                ></img>
                              </div>
                              <div className="dealership-finder-city-name">
                                <p>{item?.cityName}</p>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileData: userProfileDataReducer
  };
};

DealershipFinder.propTypes = {
  config: PropTypes.shape({
    popularCitiesList: PropTypes.arrayOf(PropTypes.any),
    cityField: PropTypes.object,
    titleText: PropTypes.string,
    titleTag: PropTypes.string,
    dealershipFinderTitle: PropTypes.string,
    popularCitiesText: PropTypes.string,
    dealershipFinderBgMobile: PropTypes.string,
    dealershipFinderBgDesktop: PropTypes.string,
    geoLocationErrorMsg: PropTypes.string,
    redirectionUrl: PropTypes.string,
    dataPosition: PropTypes.string
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(DealershipFinder);
