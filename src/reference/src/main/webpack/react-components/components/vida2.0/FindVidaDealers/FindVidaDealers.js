import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import {
  getCityListForDealers,
  getVidaCentreBranchList
} from "../../../../services/location.service";
import { getUserCityDetails } from "../../../services/locationFinder/locationFinderService";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

const FindVidaDealers = (props) => {
  const { config, userProfileData } = props;
  const [availableCityList, setAvailableCityList] = useState();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [sortedOptions, setSortedOptions] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dealersList, setDealersList] = useState([]);
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [defaultCity, setDefaultCity] = useState("NEW DELHI~DELHI~INDIA");
  const dataElement = document?.getElementById("tooltip-data");
  const isLoggedIn = loginUtils.isSessionActive();
  const cityInputField = document.getElementsByClassName(
    "dealer-city-search-input"
  )[0];
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // get available cities
  const getAvailableCityList = async () => {
    setSpinnerActionDispatcher(true);
    const availableCity = await getCityListForDealers(defaultCountry);
    if (availableCity) {
      setAvailableCityList(availableCity);
      setSpinnerActionDispatcher(false);
    }
  };
  const CustomTitleTag = config?.titleTag || "p";
  // get dealers list
  const getDealerList = async (value) => {
    if (cityInputField) {
      cityInputField.value = value?.city;
    }
    setErrorMsg("");
    if (value?.city?.length > 0) {
      setSpinnerActionDispatcher(true);
      const centreList = await getVidaCentreBranchList(value?.city);
      if (centreList && centreList.length > 0) {
        setDealersList(centreList);
        setSpinnerActionDispatcher(false);
      } else {
        setErrorMsg(config?.cityField?.validationRules?.noDealerErrorMsg);
        setSpinnerActionDispatcher(false);
      }
    } else {
      setErrorMsg(config?.cityField?.validationRules?.noValueErrorMsg);
    }
  };

  // get user location
  const getUserCityFromLocality = async (position) => {
    setSpinnerActionDispatcher(true);
    const getCityDetails = await getUserCityDetails(position);
    if (getCityDetails) {
      const getUserCityFromDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("locality")
        ).long_name;
      const getUserCityByLocation = getUserCityFromDetails.toUpperCase();
      getDealerList({ city: getUserCityByLocation });
      setLocationEnabled(true);
      // setSpinnerActionDispatcher(false);
    } else {
      setLocationEnabled(false);
      setSpinnerActionDispatcher(false);
    }
  };

  const showError = () => {
    alert(config?.locationErrorMsg);
  };

  const showPosition = async (position) => {
    setSpinnerActionDispatcher(true);
    await getUserCityFromLocality(position);
    // setSpinnerActionDispatcher(false);
  };

  const handleGetUserLocation = () => {
    setSpinnerActionDispatcher(true);
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

  const handleOptionSelect = (value) => {
    getDealerList(value);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getDealerList({
        city: userProfileData?.city,
        state: userProfileData?.state,
        country: userProfileData?.country
      });
    } else {
      if (defaultCity) {
        const defaultCityValue = defaultCity.split("~");
        getDealerList({
          city: defaultCityValue[0],
          state: defaultCityValue[1],
          country: defaultCityValue[2]
        });
      }
    }
  }, [availableCityList, userProfileData?.city]);

  useEffect(() => {
    const getDefaultCity = dataElement?.getAttribute("data-default-city");
    if (getDefaultCity) {
      setDefaultCity(getDefaultCity);
    }
  }, [dataElement]);

  useEffect(() => {
    getAvailableCityList();
  }, []);

  return (
    <div className="find-vida-dealers-wrapper vida-2-container">
      <div className="find-vida-dealers-container">
        <div className="vida-dealers-title-flex-container">
          <div className="vida-dealers-title-container">
            <p className="vida-dealers-primary-text">{config?.titlePreText}</p>
            <CustomTitleTag className="vida-dealers-bold-text">
              {config?.title}
            </CustomTitleTag>
          </div>
          <div className="vida-dealers-redirection-icon">
            <a
              href={config?.redirectionNavLink}
              target={config?.redirectionNewTab ? "_blank" : "_self"}
              rel="noreferrer"
            >
              <img
                src={config?.redirectionIcon}
                alt={config?.redirectionIconAltText}
                title={config?.redirectionIconTitle}
              ></img>
            </a>
          </div>
        </div>
        <div className="dealer-finder-search-container">
          <div
            className="dealer-location-find-icon"
            onClick={handleGetUserLocation}
          >
            {locationEnabled ? (
              <img
                src={config?.cityField?.icon}
                alt={config?.cityField?.locationIconAltText}
                title={config?.cityField?.locationIcon}
              ></img>
            ) : (
              <img
                src={config?.cityField?.secondIcon}
                alt={config?.cityField?.secondLocationIconAltText}
                title={config?.cityField?.secondLocationIcon}
              ></img>
            )}
          </div>
          <input
            className="dealer-city-search-input"
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
          <p className="dealer-finder-error-msg">{errorMsg}</p>
        </div>
        <div className="vida-dealers-content-container">
          <div className="vida-dealers-card-list">
            {dealersList?.map((item, index) => (
              <div className="vida-dealers-card-item" key={index}>
                {config?.dealersCardImgDesktop && (
                  <div className="vida-dealers-card-img">
                    <img
                      src={
                        isDesktop
                          ? config?.dealersCardImgDesktop
                          : config?.dealersCardImgMobile
                      }
                      alt={config?.dealersCardImgAltText}
                      title={config?.dealersCardImgTitle}
                    ></img>
                  </div>
                )}
                <div className="vida-dealers-details-container">
                  <div className="dealers-type">
                    <p className="dealers-type-text">
                      {item?.branchTypeCategory.toUpperCase()}
                    </p>
                  </div>
                  <div className="dealers-card-title">
                    <p className="dealers-card-title-text">{item?.label}</p>
                  </div>
                  <div className="dealers-card-address">
                    <p className="dealers-card-address-text">{item?.address}</p>
                  </div>
                  <div className="dealers-card-get-direction-cta">
                    <a
                      href={`https://maps.mapmyindia.com/@${item?.latitude},${item?.longitude}`}
                      target="_blank"
                      className="dealers-card-get-direction-cta-text"
                      rel="noreferrer"
                    >
                      {config?.getDirectionsCta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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

FindVidaDealers.propTypes = {
  config: PropTypes.shape({
    titlePreText: PropTypes.string,
    title: PropTypes.string,
    titleTag: PropTypes.string,
    redirectionIcon: PropTypes.string,
    redirectionIconTitle: PropTypes.string,
    redirectionIconAltText: PropTypes.string,
    redirectionNavLink: PropTypes.string,
    redirectionNewTab: PropTypes.bool,
    dealersCardImgDesktop: PropTypes.string,
    dealersCardImgMobile: PropTypes.string,
    dealersCardImgTitle: PropTypes.string,
    dealersCardImgAltText: PropTypes.string,
    getDirectionsCta: PropTypes.string,
    locationErrorMsg: PropTypes.string,
    cityField: PropTypes.objectOf(PropTypes.any)
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(FindVidaDealers);
