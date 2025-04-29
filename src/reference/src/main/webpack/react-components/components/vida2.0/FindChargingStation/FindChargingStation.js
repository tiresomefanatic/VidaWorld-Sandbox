import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import {
  getStoreDetails,
  getUserCityDetails
} from "../../../services/locationFinder/locationFinderService";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import MapMyIndia from "../MapMyIndia/MapMyIndia";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const FindChargingStation = (props) => {
  const { config, userProfileData } = props;
  const [isOpened, setIsOpened] = useState(false);
  const [chargingStationList, setChargingStationList] = useState();
  const [sendChargingStation, setSendChargingStation] = useState();
  const [chargingStationCount, setChargingStationCount] = useState();
  const [isMapUpdate, setMapUpdate] = useState();
  const [cityFieldErrorMsg, setCityFieldErrorMsg] = useState("");
  const [showOption, setShowOption] = useState(false);
  const [sortedOptions, setSortedOptions] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const isLoggedIn = loginUtils.isSessionActive();
  const cityInputField = document.getElementsByClassName(
    "charging-station-city-search-input"
  )[0];

  const CustomTitleTag = config?.titleTag || "p";

  // intersection observer
  const {
    ref: findChargingStationContainerRef,
    isVisible: findChargingStationContainerVisible
  } = useIntersectionObserver();

  // fetching cities charging stations
  const getChargingStationList = async () => {
    setSpinnerActionDispatcher(true);
    const url = appUtils.getAPIUrl("storeDetailsUrl");
    const storeStationList = await getStoreDetails(url);
    if (storeStationList) {
      setChargingStationList(storeStationList);
      setSpinnerActionDispatcher(false);
    } else {
      setSpinnerActionDispatcher(false);
    }
  };

  // toggle accordian
  const handleToggleAccordian = () => {
    setIsOpened(!isOpened);
  };

  // cityfield input functionalities
  const handleSortOptions = () => {
    const filterBySearch = chargingStationList
      ?.filter((item) => {
        if (item?.cityName.toUpperCase().includes(searchValue.toUpperCase())) {
          return item;
        }
      })
      .sort((a, b) => (a?.cityName > b?.cityName ? 1 : -1));
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
    cityInputField.value = value;
    const availableCities = chargingStationList?.filter(
      (item) =>
        item?.cityName?.toLowerCase().trim() ===
        `${value?.toLowerCase().trim()}`
    );
    if (
      availableCities &&
      availableCities[0]?.atherChargingStations?.length > 0
    ) {
      setChargingStationCount(
        availableCities[0]?.chargingStations.length +
          availableCities[0]?.atherChargingStations?.length
      );
      const tempArray = [
        ...availableCities[0]?.chargingStations,
        ...availableCities[0]?.atherChargingStations
      ];
      setCityFieldErrorMsg("");
      setSendChargingStation(tempArray);
      setMapUpdate(true);
    } else if (
      availableCities &&
      availableCities[0]?.chargingStations.length > 0
    ) {
      setChargingStationCount(availableCities[0]?.chargingStations.length);
      setSendChargingStation(availableCities[0]?.chargingStations);
      setMapUpdate(true);
      setCityFieldErrorMsg("");
    } else {
      setCityFieldErrorMsg(config?.cityField?.validationRules?.notFoundMsg);
    }
  };

  // getting user location
  const getUserCityFromLocality = async (position) => {
    setSpinnerActionDispatcher(true);
    const getCityDetails = await getUserCityDetails(position);
    if (getCityDetails) {
      const getUserCityFromDetails =
        getCityDetails?.results[0]?.address_components?.find((component) =>
          component.types.includes("locality")
        ).long_name;
      const getUserCityByLocation = getUserCityFromDetails
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      handleOptionSelect(getUserCityByLocation);
      setLocationEnabled(true);
      setSpinnerActionDispatcher(false);
    } else {
      setLocationEnabled(false);
      setSpinnerActionDispatcher(false);
    }
  };
  const showError = (error) => {
    alert(config?.cityField?.validationRules?.locationErrorMsg);
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
    getChargingStationList();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userProfileData?.city) {
      // getting user-city and format it as according to api response value
      const userCity = userProfileData?.city
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      handleOptionSelect(userCity);
    } else {
      if (chargingStationList) {
        cityInputField.value = chargingStationList[0]?.cityName;
        if (chargingStationList[0]?.atherChargingStations?.length > 0) {
          setChargingStationCount(
            chargingStationList[0]?.chargingStations.length +
              chargingStationList[0]?.atherChargingStations?.length
          );
          const tempArray = [
            ...chargingStationList[0]?.chargingStations,
            ...chargingStationList[0]?.atherChargingStations
          ];

          setSendChargingStation(tempArray);
          setMapUpdate(true);
        } else if (chargingStationList[0]?.chargingStations?.length > 0) {
          setChargingStationCount(
            chargingStationList[0]?.chargingStations.length
          );
          setSendChargingStation(chargingStationList[0]?.chargingStations);
          setMapUpdate(true);
        } else {
          chargingStationList?.some((station) => {
            if (
              station?.atherChargingStations?.length > 0 ||
              station?.chargingStations?.length > 0
            ) {
              cityInputField.value = station?.cityName;
              station?.atherChargingStations?.length > 0
                ? setChargingStationCount(
                    station?.chargingStations?.length +
                      station?.atherChargingStations?.length
                  )
                : setChargingStationCount(station?.chargingStations.length);
              const tempArray = [
                ...station?.chargingStations,
                ...station?.atherChargingStations
              ];
              setSendChargingStation(tempArray);
              setMapUpdate(true);
              return true;
            }
            return false;
          });
        }
      }
    }
  }, [chargingStationList, userProfileData?.city]);

  return (
    <div className="vida-find-charging-station">
      <div className="find-charging-station-wrapper vida-2-container">
        <div
          className="find-charging-station-container"
          ref={findChargingStationContainerRef}
          style={{ opacity: findChargingStationContainerVisible ? 1 : 0 }}
        >
          <div className="find-charging-station-content-container">
            <div className="find-charging-station-title-container">
              <CustomTitleTag className="find-charging-station-title">
                {config?.title}
              </CustomTitleTag>
            </div>
            <div className="charging-station-info-container">
              <div className="charging-station-info-list">
                {config?.chargingInfoContent?.map((item, index) => (
                  <div className="charging-station-info-item" key={index}>
                    <div className="charging-station-info-icon">
                      <img src={item?.icon} alt="info_icon"></img>
                    </div>
                    <div className="charging-station-info-flex-container">
                      <div className="charging-station-info-title">
                        <p className="charging-station-info-title-text">
                          {item?.title}
                        </p>
                      </div>
                      <div className="charging-station-info-number">
                        <p className="charging-station-info-number-text">
                          {item?.number}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="charging-accordian-container">
            <div className="charging-accordian-title-container">
              <div className="charging-accordian-title-icon">
                <img
                  src={config?.accordianTitleIcon}
                  alt="accordian_title_icon"
                ></img>
              </div>
              <div className="charging-accordian-title-flex-container">
                <div className="charging-accordian-title">
                  <p className="charging-accordian-title-text">
                    {config?.accordianTitle}
                  </p>
                </div>
                <div className="charging-accordian-plus-minus-icon-container">
                  <div
                    className="charging-accordian-plus-minus-icon"
                    onClick={handleToggleAccordian}
                  >
                    <img
                      src={
                        isOpened
                          ? `${appUtils.getConfig(
                              "resourcePath"
                            )}images/svg/minus-icon.svg`
                          : `${appUtils.getConfig(
                              "resourcePath"
                            )}images/svg/add-icon.svg`
                      }
                      alt="accoridan_toggle_icon"
                    ></img>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                isOpened
                  ? "charging-accordian-content-container card-open"
                  : "charging-accordian-content-container"
              }
            >
              <div
                className={
                  config?.findChargingStationTitle ||
                  config?.findChargingStationDescription ||
                  config?.requestChargingStationBtnLabel
                    ? "charging-accordian-content-flex-container spacing"
                    : "charging-accordian-content-flex-container"
                }
              >
                <div className="charging-accordian-input-info-container">
                  <div className="charging-accordian-input-container">
                    <div className="charging-station-search-icon">
                      <img
                        src={config?.cityField?.searchIcon}
                        alt="search_icon"
                      ></img>
                    </div>
                    <div
                      className="charging-station-location-icon"
                      onClick={handleGetUserLocation}
                    >
                      {locationEnabled ? (
                        <img
                          src={config?.cityField?.locationIcon}
                          alt="location_icon1"
                        ></img>
                      ) : (
                        <img
                          src={config?.cityField?.secondLocationIcon}
                          alt="location_icon2"
                        ></img>
                      )}
                    </div>
                    <input
                      className="charging-station-city-search-input"
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
                          onClick={() => handleOptionSelect(item?.cityName)}
                        >
                          <p>{item?.cityName}</p>
                        </div>
                      ))}
                    </div>
                    <p className="charging-station-error-msg">
                      {cityFieldErrorMsg}
                    </p>
                  </div>
                  <div className="charging-accordian-stations-info-container">
                    <div className="charging-accordian-stations-info-list">
                      <div className="charging-accordian-stations-info-item">
                        <div className="charging-accordian-stations-info-icon">
                          <img
                            src={config?.chargingBatteryIcon}
                            alt="battery_icon"
                          ></img>
                        </div>
                        <div className="charging-accordian-stations-info-flex-container">
                          <div className="charging-accordian-stations-info-number">
                            <p className="charging-accordian-stations-info-number-text">
                              {chargingStationCount}
                            </p>
                          </div>
                          <div className="charging-accordian-stations-info-title">
                            <p className="charging-accordian-stations-info-title-text">
                              {config?.chargingStationsInfoText1}
                            </p>
                          </div>
                        </div>
                      </div>
                      {config?.isShowNearByCount && (
                        <div className="charging-accordian-stations-info-item">
                          <div className="charging-accordian-stations-info-icon">
                            <img
                              src={config?.chargingBatteryIcon}
                              alt="battery_icon"
                            ></img>
                          </div>
                          <div className="charging-accordian-stations-info-flex-container">
                            <div className="charging-accordian-stations-info-number">
                              <p className="charging-accordian-stations-info-number-text">
                                {chargingStationCount}
                              </p>
                            </div>
                            <div className="charging-accordian-stations-info-title">
                              <p className="charging-accordian-stations-info-title-text">
                                {config?.chargingStationsInfoText2}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="charging-accordian-stations-map-container map-container">
                  <MapMyIndia
                    dealerDetails={sendChargingStation}
                    isShowDirection={false}
                    isCityPage={false}
                    isTestRidePage={false}
                    isFastChargingPage={true}
                    userMapId={"chargingStationMap"}
                    isRenderMap={true}
                    isMapUpdate={isMapUpdate}
                  />
                </div>
              </div>
              {config?.findChargingStationTitle && (
                <div className="charging-accordian-find-stations-text-container">
                  <p className="charging-accordian-find-stations-text">
                    {config?.findChargingStationTitle}
                  </p>
                </div>
              )}
              {config?.findChargingStationDescription && (
                <div className="charging-accordian-find-stations-description-container">
                  <p className="charging-accordian-find-stations-description">
                    {config?.findChargingStationDescription}
                  </p>
                </div>
              )}
              {config?.requestChargingStationBtnLabel && (
                <div className="charging-accordian-request-station-btn-container">
                  <a
                    href={config?.requestChargingStationBtnNavLink}
                    target={
                      config?.requestChargingStationNewTab ? "_blank" : "_self"
                    }
                    className="charging-accordian-request-station-btn"
                    rel="noreferrer"
                  >
                    {config?.requestChargingStationBtnLabel}
                  </a>
                </div>
              )}
            </div>
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

FindChargingStation.propTypes = {
  config: PropTypes.shape({
    titleTag: PropTypes.string,
    title: PropTypes.string,
    chargingInfoContent: PropTypes.arrayOf(PropTypes.any),
    accordianTitle: PropTypes.string,
    accordianTitleIcon: PropTypes.string,
    chargingBatteryIcon: PropTypes.string,
    chargingStationsInfoText1: PropTypes.string,
    chargingStationsInfoText2: PropTypes.string,
    findChargingStationTitle: PropTypes.string,
    findChargingStationDescription: PropTypes.string,
    requestChargingStationBtnLabel: PropTypes.string,
    requestChargingStationBtnNavLink: PropTypes.string,
    requestChargingStationNewTab: PropTypes.bool,
    isShowNearByCount: PropTypes.bool,
    cityField: PropTypes.object
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(FindChargingStation);
