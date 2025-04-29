import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import ScheduleAppointment from "./ScheduleAppointment/ScheduleAppointment";
import SuccessPage from "./SuccessPage/SuccessPage";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import { setTestDriveDataDispatcher } from "../../store/testDrive/testDriveActions";
import { setMapLocationAction } from "../../store/testDrive/testDriveActions";
import { getGoogleMapData } from "../../../services/location.service";
import googleMapsUtils from "../../../site/scripts/utils/googleMapsUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import CONSTANT from "../../../site/scripts/constant";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import {
  getVidaCentreList,
  getServiceablePincodesList
} from "../../../services/location.service";
import { getSelectedGroupItem } from "../../../site/scripts/helper";

const TestDriveShortTerm = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();

  const { backgroundImg, scheduleAppointment, successPage } = props.config;
  const {
    nearByVidaCentreList,
    selectedLocation,
    selectedPlace,
    setMapLocation
  } = props;
  const [testDriveId, setTestDriveId] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [selectedMapVidaCentre, setSelectedMapVidaCentre] = useState(null);
  const [isNonPageLoadAction, setIsNonPageLoadAction] = useState(false);

  const fetchCentreList = async (locationData) => {
    await getVidaCentreList(locationData.city);
    await getServiceablePincodesList(locationData);
    setSelectedLocationData(locationData);
  };

  useEffect(() => {
    const queryString = location.href.split("?")[1];
    if (queryString) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      setTestDriveId(params.get("id") ? params.get("id") : null);
      setIsOTPVerified(
        params.get("isOTPVerified")
          ? params.get("isOTPVerified") === "true"
          : false
      );
      const locationData = {
        city: params.get("city"),
        state: params.get("state"),
        country: params.get("country")
      };
      setTestDriveDataDispatcher({
        location: locationData
      });
      fetchCentreList(locationData);
    }
  }, []);

  const [showScheduleAppointment, setShowScheduleAppointment] =
    useState(isLoggedIn);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const [mapVisibility, setMapVisibility] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const getFirstVidaCentre = (vidaCentreId) => {
    let vidaCentre = null;
    if (nearByVidaCentreList.length > 0) {
      if (!vidaCentreId) {
        for (let i = 0; i < nearByVidaCentreList.length; i++) {
          if (nearByVidaCentreList[i].items.length > 0) {
            //  vidaCentre = nearByVidaCentreList[i].items[0];
            //break;
          }
        }
      } else {
        vidaCentre = getSelectedGroupItem(nearByVidaCentreList, vidaCentreId);
      }
    }

    if (vidaCentre && vidaCentre.items && vidaCentre.items.length > 0) {
      vidaCentre = vidaCentre.items[0];
    }

    return vidaCentre;
  };

  const getMarkers = (vidaCentre) => {
    const markers = [];
    nearByVidaCentreList.forEach((item) => {
      item.items.forEach((place) => {
        const marker = {
          lat: parseFloat(place.latitude),
          lng: parseFloat(place.longitude),
          details: {
            id: place.id,
            title: place.experienceCenterName,
            message: place.address,
            image:
              appUtils.getConfig("resourcePath") + "images/png/vida-logo.png"
          },
          selected: vidaCentre?.id === place.id
        };
        markers.push(marker);
      });
    });
    return markers;
  };

  const loadData = async (centreId) => {
    const mapsConfig = {
      zoom: 16
    };

    if (selectedLocation && selectedLocation.city && selectedLocation.state) {
      getGoogleMapData(selectedLocation.city, selectedLocation.state).then(
        (response) => {
          const firstVidaCentre = getFirstVidaCentre(centreId);
          mapsConfig["center"] =
            firstVidaCentre?.latitude && firstVidaCentre?.longitude
              ? {
                  lat: parseFloat(firstVidaCentre.latitude),
                  lng: parseFloat(firstVidaCentre.longitude)
                }
              : response;
          mapsConfig["markers"] = getMarkers(firstVidaCentre);

          setMapVisibility(true);
          setMapData(mapsConfig);
        }
      );
    }
  };

  const reloadMap = (lat, lng, centreId) => {
    if (lat && lng) {
      const mapsConfig = {
        zoom: 16
      };
      mapsConfig["center"] = {
        lat: lat,
        lng: lng
      };
      mapsConfig["fixedMarker"] = {
        lat: lat,
        lng: lng
      };
      setMapData(mapsConfig);
    } else if (centreId) {
      loadData(centreId);
    } else {
      loadData();
    }
  };

  const handleMarkerPosition = async (latLng) => {
    // if (selectedPlace === CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME) {
    //   const mapLocation = await googleMapsUtils.getAddress({
    //     lat: latLng.lat,
    //     lng: latLng.lng
    //   });
    //   if (mapLocation) {
    //     const mapLocationObj = {
    //       lat: latLng.lat,
    //       lng: latLng.lng,
    //       address: mapLocation.address,
    //       pincode: mapLocation.pincode
    //     };
    //     setMapLocation(mapLocationObj);
    //   }
    // }
  };

  const handleShowSuccessPage = (appointmentData) => {
    setMapVisibility(false);
    setShowScheduleAppointment(false);
    setShowSuccessPage(true);
    setAppointmentDetails(appointmentData);
  };

  const handleMapToVidaCentreSelection = (vidaCentreSelected) => {
    const selectedCentre = getSelectedGroupItem(
      nearByVidaCentreList,
      vidaCentreSelected.id
    );
    setSelectedMapVidaCentre(selectedCentre);
  };

  return (
    selectedLocationData && (
      <div className="vida-test-drive__container">
        <div
          className={
            showSuccessPage
              ? "vida-test-drive__asset vida-test-drive__asset--show"
              : "vida-test-drive__asset"
          }
        >
          {mapVisibility && mapData ? (
            <GoogleMaps
              config={mapData}
              onClickHandler={handleMapToVidaCentreSelection}
              markerPositionHandler={handleMarkerPosition}
              setShowInfo={setShowInfo}
              showInfo={isNonPageLoadAction && showInfo}
            />
          ) : (
            <img src={backgroundImg} alt="Vida Test Drive" />
          )}
        </div>

        <div className="vida-test-drive__content">
          {showScheduleAppointment && (
            <ScheduleAppointment
              config={scheduleAppointment}
              goToSuccessPage={handleShowSuccessPage}
              testDriveId={testDriveId}
              selectedLocationData={props.selectedLocation}
              isOTPVerified={isOTPVerified}
              selectedMapVidaCentre={selectedMapVidaCentre}
              reloadMap={reloadMap}
              /* For Mobile */
              mapData={mapData}
              markerPositionHandler={handleMarkerPosition}
              handleMapToVidaCentreSelection={handleMapToVidaCentreSelection}
              setIsNonPageLoadAction={setIsNonPageLoadAction}
              isNonPageLoadAction={isNonPageLoadAction}
            />
          )}

          {showSuccessPage && (
            <SuccessPage
              config={successPage}
              appointmentDetails={appointmentDetails}
              testDriveId={testDriveId}
            />
          )}
        </div>
      </div>
    )
  );
};

TestDriveShortTerm.propTypes = {
  config: PropTypes.shape({
    backgroundImg: PropTypes.string,
    scheduleAppointment: PropTypes.object,
    successPage: PropTypes.object
  }),
  nearByVidaCentreList: PropTypes.array,
  setMapLocation: PropTypes.func,
  selectedLocation: PropTypes.object,
  selectedPlace: PropTypes.string
};

TestDriveShortTerm.defaultProps = {
  config: {}
};

const mapStateToProps = ({ testDriveReducer }) => {
  return {
    nearByVidaCentreList: testDriveReducer.nearByVidaCentreList,
    selectedLocation: testDriveReducer.location,
    selectedPlace: testDriveReducer.place
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMapLocation: (mapLocation) => {
      dispatch(setMapLocationAction(mapLocation));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestDriveShortTerm);
