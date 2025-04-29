import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { getStoreDetails } from "../../../services/locationFinder/locationFinderService";
import Logger from "../../../../services/logger.service";
import CONSTANT from "../../../../site/scripts/constant";
import Dropdown from "../forms/Dropdown/Dropdown";
import { useForm } from "react-hook-form";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const LocationFinder = (props) => {
  const { config } = props;
  const [storeData, setStoreData] = useState(null);

  const [locationList, setLocationList] = useState([]);
  const [selectedLocationItem, setLocationItem] = useState(null);
  const [selectedLocation, setLocation] = useState(config.defaultLocationId);

  const [mapData, setMapData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [displayList, setDisplayList] = useState([]);
  const { register, setValue } = useForm({
    mode: "onSubmit"
  });

  /* Location config property ids and icon object keys should be equal */
  const icon = {
    chargingStations:
      appUtils.getConfig("resourcePath") + "images/svg/station-highlighted.svg",
    serviceCenter:
      appUtils.getConfig("resourcePath") + "images/svg/center-highlighted.svg",
    experienceCenter:
      appUtils.getConfig("resourcePath") + "images/svg/store-highlighted.svg",
    swappingStations:
      appUtils.getConfig("resourcePath") +
      "images/svg/swapping-station-highlighted.svg"
  };

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  /* Display Location Info based on store info */
  const displayLocationInfo = (locationObj) => {
    try {
      if (config.locations) {
        config.locations.forEach((item) => {
          if (locationObj.hasOwnProperty(item.id)) {
            item["count"] = locationObj[item.id].length;
          }
        });

        setDisplayList(config.locations);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  /* Get Location Data */
  const getLocations = async () => {
    try {
      const url = appUtils.getAPIUrl("storeDetailsUrl");
      const result = await getStoreDetails(url);
      if (result) {
        result && setStoreData(result);

        const locations = [];
        result.forEach((item) => {
          locations.push({
            id: item.id,
            label: [item.cityName, item.stateName].join(", "),
            value: item.id
          });

          if (item.id === config.defaultLocationId) {
            setLocationItem(item);
            config.locations && displayLocationInfo(item);
          }
        });
        setLocationList(locations);

        if (!config.defaultLocationId) {
          setLocationItem(result[0]);
          setLocation(result[0].id);
          config.locations && displayLocationInfo(result[0]);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  /* Get the selected Location */
  const getSelectedLocation = (value) => {
    return storeData.find((item) => item.id === value);
  };

  /* Handle the location dropdown change event */
  const handleLocationChange = (name, value) => {
    setLocation(value);
    const locationObj = getSelectedLocation(value);
    setLocationItem(locationObj);
    displayLocationInfo(locationObj);
    setShowInfo(false);
  };

  const addMapMarkers = (markerValue) => {
    const mapMarkers = [];

    if (
      config.mode === CONSTANT.CENTER.DEFAULT ||
      config.mode === CONSTANT.CENTER.CHARGING_STATION
    ) {
      const neededMarkers = config.locations.map((item) => item.id);

      if (neededMarkers && neededMarkers.includes(markerValue)) {
        selectedLocationItem[markerValue].forEach((item) => {
          if (item.latitude && item.longitude) {
            const marker = {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              icon: icon[markerValue]
            };

            if (markerValue === CONSTANT.CENTER.EXPERIENCE_CENTER) {
              marker["details"] = {
                id: item.id,
                title: item.experienceCenterName,
                message: item.address,
                image: icon.experienceCenter
              };
            } else if (markerValue === CONSTANT.CENTER.SERVICE_CENTER) {
              marker["details"] = {
                id: item.id,
                title: item.experienceCenterName,
                message: item.address,
                image: icon.serviceCenter
              };
            } else if (markerValue === CONSTANT.CENTER.CHARGING_STATION) {
              marker["details"] = {
                id: item.stationId,
                title: item.stationName,
                message: item.chargingStationAddress,
                image: icon.chargingStations
              };
            }
            mapMarkers.push(marker);
          }
        });
      }
      return mapMarkers;
    } else {
      selectedLocationItem[markerValue].forEach((item) => {
        if (item.latitude && item.longitude) {
          const marker = {
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
            icon: icon[markerValue]
          };
          if (markerValue === CONSTANT.CENTER.EXPERIENCE_CENTER) {
            marker["details"] = {
              id: item.id,
              title: item.experienceCenterName,
              message: item.address,
              image: icon.experienceCenter
            };
          } else if (markerValue === CONSTANT.CENTER.SERVICE_CENTER) {
            marker["details"] = {
              id: item.id,
              title: item.experienceCenterName,
              message: item.address,
              image: icon.serviceCenter
            };
          } else if (markerValue === CONSTANT.CENTER.CHARGING_STATION) {
            marker["details"] = {
              id: item.stationId,
              title: item.stationName,
              message: item.chargingStationAddress,
              image: icon.chargingStations
            };
          }
          mapMarkers.push(marker);
        }
      });
      return mapMarkers;
    }
  };

  /* Trigger when the location is changed */
  useEffect(() => {
    try {
      if (selectedLocationItem) {
        const mapsConfig = {
          zoom: 12,
          center: {
            lat: parseFloat(selectedLocationItem.latitde),
            lng: parseFloat(selectedLocationItem.longitude)
          }
        };

        const markers = [];

        switch (config.mode) {
          case CONSTANT.CENTER.DEFAULT:
            /* Marker added for Experience center */ if (
              selectedLocationItem.experienceCenter &&
              selectedLocationItem.experienceCenter.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.EXPERIENCE_CENTER));
            }

            /* Marker added for Service center */
            if (
              selectedLocationItem.serviceCenter &&
              selectedLocationItem.serviceCenter.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.SERVICE_CENTER));
            }

            /* Marker added for Charging station */
            if (
              selectedLocationItem.chargingStations &&
              selectedLocationItem.chargingStations.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.CHARGING_STATION));
            }

            break;
          case CONSTANT.CENTER.CHARGING_STATION:
            /* Marker added for Charging station */ if (
              selectedLocationItem.chargingStations &&
              selectedLocationItem.chargingStations.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.CHARGING_STATION));
            }

            break;
          case CONSTANT.CENTER.EXPERIENCE_CENTER:
            /* Marker added for Experience center */
            if (
              selectedLocationItem.experienceCenter &&
              selectedLocationItem.experienceCenter.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.EXPERIENCE_CENTER));
            }
            break;
          case CONSTANT.CENTER.SERVICE_CENTER:
            /* Marker added for Service center */
            if (
              selectedLocationItem.serviceCenter &&
              selectedLocationItem.serviceCenter.length
            ) {
              markers.push(...addMapMarkers(CONSTANT.CENTER.SERVICE_CENTER));
            }
            break;
        }

        mapsConfig["markers"] = markers;
        mapsConfig["googleNavigateLabel"] = config.googleNavigateLabel;
        setMapData(mapsConfig);
      }
    } catch (error) {
      Logger.error(error);
    }
  }, [selectedLocationItem]);

  /* Get the Location Data on load */
  useEffect(() => {
    getLocations();
  }, []);

  const defaultVariant = () => (
    <div className="vida-location-finder">
      <div className="vida-location-finder__field-selection">
        <Dropdown
          name="location"
          label=""
          iconClass={`icon-location-marker`}
          options={locationList}
          value={selectedLocation}
          setValue={setValue}
          onChangeHandler={handleLocationChange}
          register={register}
          isSortAsc={true}
        />
      </div>
      <div className="vida-location-finder__container">
        <div className="vida-location-finder__map-view">
          {mapData && (
            <GoogleMaps
              config={mapData}
              disableIconClick={true}
              setShowInfo={setShowInfo}
              showInfo={showInfo}
              selectedLocation={selectedLocation}
            />
          )}
        </div>
        <div className="vida-location-finder__center-details">
          <h3 className="vida-location-finder__title">{config.title}</h3>
          <h3 className="vida-location-finder__subtitle txt-color--solid-grey">
            {config.subtitle}
          </h3>
          <ul className="vida-location-finder__locations">
            {displayList.map((location) => (
              <li key={location.id} className="vida-location-finder__center">
                <img
                  src={icon[location.id]}
                  alt={location.label}
                  title={location.label}
                />
                <span className="h2 vida-location-finder__location-count">
                  {location.count}
                </span>
                <span className="h4 vida-location-finder__location-label">
                  {location.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const otherVariant = () => (
    <div className="vida-location-finder-centre">
      <div className="vida-location-finder-centre__center-details">
        <div className="vida-location-finder-centre__col">
          <div
            className="vida-location-finder-centre__form-title"
            dangerouslySetInnerHTML={{
              __html: config.title
            }}
          ></div>
          {config.mode === CONSTANT.CENTER.CHARGING_STATION && (
            <ul className="vida-location-finder-centre__locations">
              {displayList.map((location) => (
                <li
                  key={location.id}
                  className="vida-location-finder-centre__center"
                >
                  <img
                    src={icon[location.id]}
                    alt={location.label}
                    title={location.label}
                  />
                  <span className="h4 vida-location-finder-centre__location-label">
                    {location.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Dropdown
          name="location"
          label=""
          iconClass={`icon-location-marker`}
          options={locationList}
          value={selectedLocation}
          setValue={setValue}
          onChangeHandler={handleLocationChange}
          register={register}
          isSortAsc={true}
        />
      </div>
      <div className="vida-location-finder-centre__container">
        <div className="vida-location-finder-centre__map-view">
          {mapData && (
            /***Changed disableIconClick to false to enable the click for all devices ***/
            <GoogleMaps
              setShowInfo={setShowInfo}
              showInfo={showInfo}
              config={mapData}
              disableIconClick={false}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    storeData &&
    (config.mode === CONSTANT.CENTER.DEFAULT
      ? defaultVariant()
      : otherVariant())
  );
};

LocationFinder.propTypes = {
  config: PropTypes.object,
  cmpProps: PropTypes.object
};

LocationFinder.defaultProps = {};

export default LocationFinder;
