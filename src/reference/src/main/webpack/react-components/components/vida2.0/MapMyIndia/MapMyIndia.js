import React, { useEffect, useRef, useState } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { generateMmiToken } from "../../../../services/logger.service";
import DirectionPlugin from "./DirectionPlugin/DirectionPlugin";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";

const GetdistancePlugin = ({
  map,
  userLocation,
  dealerLocation,
  mapplsPluginObject
}) => {
  const getDistanceRef = useRef(null);

  useEffect(() => {
    if (userLocation) {
      if (map && getDistanceRef.current) {
        getDistanceRef.current.remove();
        mapplsClassObject.removeLayer({ map, layer: getDistanceRef.current });
      }

      function callback_method(data) {
        // console.log(data);
      }

      getDistanceRef.current = mapplsPluginObject.getDistance(
        {
          map: map,
          coordinates: userLocation.join(";") + ";" + dealerLocation.join(";"),
          eloc: ["mmi000", "123zrr"], // [userLocation.join(","), dealerLocation.join(",")],
          popupHtml: ["<h1>MMI</h1>”,”<h1>Agra</h1>"],
          html: ["1", "2"],
          icon: { url: "2.png", width: 30, height: 45 },
          source: "0;1",
          destinations: "2;3"
        },
        callback_method
      );

      return () => {
        if (map && getDistanceRef.current) {
          mapplsClassObject.removeLayer({ map, layer: getDistanceRef.current });
        }
      };
    }
  }, [userLocation]);
};

const mapIdArray = [];
const mapDataArray = [];
const mapRefArray = [];
let mapObjectCount = 0;
function MapMyIndia({
  dealerDetails,
  selectedDealer,
  isShowDirection,
  isCityPage,
  isTestRidePage,
  userMapId,
  isRenderMap,
  isDealerMapReady,
  isMapUpdate,
  isFastChargingPage,
  setSelectedDealer
}) {
  const styleMap = { height: "600px" };
  const [mmiToken, setMmiToken] = useState("");
  const [mapData, setMapData] = useState([]);
  const [mapId, setMapId] = useState("map");
  const mmiApiKey = appUtils.getConfig("mmiAPIKey");
  const mapplsClassObject = new mappls();
  const mapplsPluginObject = new mappls_plugin();

  let distance;
  let geoData;
  let mapProps;
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);

  var mapObject;

  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const loadObject = { map: true, plugins: ["direction", "getDistance"] };
  const mmiIcon = appUtils.getConfig("mmiIcons")
    ? JSON.parse(appUtils.getConfig("mmiIcons"))
    : {};
  const {
    experienceCentre,
    serviceCentre,
    authorizedDealer,
    chargingStation,
    blackMarker,
    orangeMarker
  } = mmiIcon;
  const mapArray = [];
  const formatMapData = (dealerData) => {
    let data = {};
    for (let index = 0; index < dealerData?.length; index++) {
      if (dealerData[index]) {
        let address = "";
        if (dealerData[index].address != undefined) {
          address = dealerData[index]?.address;
        }
        if (dealerData[index]?.chargingStationAddress != undefined) {
          address = dealerData[index]?.chargingStationAddress;
        }

        data = {
          type: "Feature",
          properties: {
            description: address,
            icon: isCityPage
              ? dealerData[index]?.branchTypeCategory === "Experience Center"
                ? experienceCentre
                : dealerData[index]?.branchTypeCategory === "Authorised Dealers"
                ? authorizedDealer
                : dealerData[index]?.type === "ServiceBranch"
                ? serviceCentre
                : ""
              : isTestRidePage
              ? blackMarker
              : chargingStation
          },
          id: dealerData[index]?.id,
          geometry: {
            type: "Point",
            coordinates:
              dealerData[index].latitude && dealerData[index].longitude
                ? [
                    parseFloat(dealerData[index].latitude),
                    parseFloat(dealerData[index].longitude)
                  ]
                : []
          }
        };
      }
      mapArray.push(data);
    }
    setMapData(mapArray);

    for (let i = 0; i < mapArray.length; i++) {
      const obj = {}; // Create a new object in each iteration
      obj[userMapId] = mapArray;
      // Check if an object with the same key already exists
      const existingIndex = mapDataArray.findIndex((item) =>
        item.hasOwnProperty(userMapId)
      );

      if (existingIndex !== -1) {
        // Replace the existing object with the new one
        mapDataArray[existingIndex] = obj;
      } else {
        // Push the new object to the array
        mapDataArray.push(obj);
      }
    }
    // const obj = {};
    // obj[userMapId] = mapArray;
    // mapDataArray.push(obj);
  };
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUserLatitude(position.coords.latitude);
        setUserLongitude(position.coords.longitude);
        // callback([latitude, longitude]);
      });
    }
  };

  const changeSelectedDealerMarker = () => {
    mapData.forEach((item) => {
      if (item?.id === selectedDealer?.id) {
        item.properties.icon = orangeMarker;
      } else {
        item.properties.icon = blackMarker;
      }
    });
  };

  const handleLocationClick = (lngLat) => {
    const clickedLocation = findClosestLocation(dealerDetails, lngLat);
    const checkIsSelected =
      selectedDealer?.latitude == clickedLocation?.latitude &&
      selectedDealer?.longitude == clickedLocation?.longitude;
    if (
      clickedLocation &&
      !checkIsSelected &&
      typeof setSelectedDealer === "function"
    ) {
      setSelectedDealer(clickedLocation);
    }
  };
  const updateMap = () => {
    if (selectedDealer && isTestRidePage) {
      changeSelectedDealerMarker();
    }

    geoData = {
      type: "FeatureCollection",
      features: mapData
    };
    const mapRefDataObj = mapIdArray.reduce((acc, key) => {
      if (acc) {
        return acc;
      } // If a match is already found, return it
      const foundObject = mapRefArray.find((obj) =>
        obj.hasOwnProperty(userMapId)
      );
      return foundObject ? foundObject[userMapId] : acc;
    }, null);
    mapRef.current = mapRefDataObj;
    if (geoData && mapRef.current) {
      mapplsClassObject.addGeoJson({
        map: mapRef.current,
        data: geoData,
        fitbounds: true,
        cType: 0
      });
      setSpinnerActionDispatcher(false);
    }
  };
  const renderMap = () => {
    setSpinnerActionDispatcher(true);
    if (selectedDealer && isTestRidePage) {
      changeSelectedDealerMarker();
    }

    geoData = {
      type: "FeatureCollection",
      features: mapData
    };

    if (geoData && mapRef.current) {
      mapplsClassObject.addGeoJson({
        map: mapRef.current,
        data: geoData,
        fitbounds: true,
        cType: 0
      });
      isShowDirection && setIsMapLoaded(true);
      setSpinnerActionDispatcher(false);
    }

    mapplsClassObject.initialize(mmiToken, loadObject, () => {
      setTimeout(() => {
        mapIdArray.forEach((mapEleId) => {
          if (document.getElementById(mapEleId)) {
            const mapDataObj = mapIdArray.reduce((acc, key) => {
              if (acc) {
                return acc;
              } // If a match is already found, return it
              const foundObject = mapDataArray.find((obj) =>
                obj.hasOwnProperty(mapEleId)
              );
              return foundObject ? foundObject[mapEleId] : acc;
            }, null);
            geoData = {
              type: "FeatureCollection",
              features: mapDataObj
            };
            mapObject = mapplsClassObject.Map({
              id: mapEleId,
              properties: {
                center: geoData.features[0]?.geometry.coordinates,
                traffic: false,
                zoom: 10,
                clickableIcons: true,
                fullscreenControl: false,
                maxZoom: 18,
                scrollwheel: false
              }
            });
            mapplsClassObject.setStyle("sublime-grey");
            mapRef.current = mapObject;
            const obj = {};
            obj[mapEleId] = mapObject;
            mapRefArray.push(obj);
            mapObject.on("load", () => {
              const mapObj = mapIdArray.reduce((acc, key) => {
                if (acc) {
                  return acc;
                } // If a match is already found, return it
                const foundObject = mapRefArray.find((obj) =>
                  obj.hasOwnProperty(mapIdArray[mapObjectCount])
                );
                return foundObject
                  ? foundObject[mapIdArray[mapObjectCount]]
                  : acc;
              }, null);
              mapObject = mapObj;
              const mapDataObj = mapIdArray.reduce((acc, key) => {
                if (acc) {
                  return acc;
                } // If a match is already found, return it
                const foundObject = mapDataArray.find((obj) =>
                  obj.hasOwnProperty(mapIdArray[mapObjectCount])
                );
                return foundObject
                  ? foundObject[mapIdArray[mapObjectCount]]
                  : acc;
              }, null);
              geoData = {
                type: "FeatureCollection",
                features: mapDataObj
              };
              mapplsClassObject.addGeoJson({
                map: mapObject,
                data: geoData,
                fitbounds: true,
                cType: 0
              });
              isShowDirection && setIsMapLoaded(true);
              setSpinnerActionDispatcher(false);
              mapObjectCount++;
            });

            mapObject.on("error", (error) => {
              setSpinnerActionDispatcher(false);
              showNotificationDispatcher({
                title: error,
                type: CONSTANT.NOTIFICATION_TYPES.ERROR,
                isVisible: true
              });
            });
          }
        });
      }, 100);
    });
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  };

  const getMmiToken = async () => {
    const mmiTokenValue = await generateMmiToken();
    if (mmiTokenValue) {
      setMmiToken(mmiTokenValue);
    }
  };

  useEffect(() => {
    getMmiToken();
    if (dealerDetails) {
      mapProps = {
        traffic: false,
        zoom: 15,
        geolocation: true,
        clickableIcons: true,
        fullscreenControl: false,
        maxZoom: 12,
        scrollWheel: false
      };
      getCurrentLocation();
      formatMapData(dealerDetails);
    }
  }, [dealerDetails]);

  useEffect(() => {
    if (dealerDetails) {
      if (mmiToken && isRenderMap) {
        if (document.querySelectorAll(".map-container").length > 1) {
          if (isCityPage) {
            if (isDealerMapReady) {
              setIsMapLoaded(false);
              renderMap();
            }
          }
        } else if (document.querySelectorAll(".map-container").length === 1) {
          if (isTestRidePage || isFastChargingPage || isCityPage) {
            setIsMapLoaded(false);
            renderMap();
          }
        }
        if (isMapUpdate) {
          updateMap();
        }
      }
    }
  }, [
    mmiToken,
    mapData,
    selectedDealer,
    isRenderMap,
    isDealerMapReady,
    isMapUpdate
  ]);

  useEffect(() => {
    if (userMapId) {
      setMapId(userMapId);
      if (!mapIdArray.includes(userMapId)) {
        mapIdArray.push(userMapId);
      }
    }
  }, [userMapId]);

  return (
    <div>
      <div id={mapId} className="mmi-map">
        {isMapLoaded && (
          <DirectionPlugin
            map={mapRef.current}
            userLatitude={userLatitude}
            userLongitude={userLongitude}
            dealerLatitude={selectedDealer.latitude}
            dealerLongitude={selectedDealer.longitude}
            dealerName={selectedDealer.experienceCenterName}
          />
        )}
        {isMapLoaded && (
          <GetdistancePlugin
            map={mapRef.current}
            userLocation={[userLatitude, userLongitude]}
            dealerLocation={[
              dealerDetails[0].latitude,
              dealerDetails[0].longitude
            ]}
            mapplsPluginObject={mapplsPluginObject}
          />
        )}
      </div>
    </div>
  );
}
export default MapMyIndia;

MapMyIndia.propTypes = {
  dealerDetails: PropTypes.array,
  selectedDealer: PropTypes.object,
  isShowDirection: PropTypes.bool,
  isCityPage: PropTypes.bool,
  isTestRidePage: PropTypes.bool,
  userMapId: PropTypes.string,
  isRenderMap: PropTypes.bool,
  setSelectedDealer: PropTypes.func,
  isDealerMapReady: PropTypes.bool,
  isMapUpdate: PropTypes.bool,
  isFastChargingPage: PropTypes.bool
};
