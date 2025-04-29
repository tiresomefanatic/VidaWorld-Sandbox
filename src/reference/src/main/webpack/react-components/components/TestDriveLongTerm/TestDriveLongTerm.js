import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import ScheduleSelfPickup from "./ScheduleSelfPickup/ScheduleSelfPickup";
import SchedulePickUpAtHome from "./SchedulePickUpAtHome/SchedulePickUpAtHome";
import { setMapLocationAction } from "../../store/testDrive/testDriveActions";
import { connect } from "react-redux";
import {
  getLongTermPackageList,
  getLongTermVehicleList,
  getPickupLocations
} from "../../../services/location.service";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import googleMapsUtils from "../../../site/scripts/utils/googleMapsUtils";
import CONSTANT from "../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useLongTermTestRideDetails } from "../../hooks/testDrive/testDriveSummary/testDriveSummaryHooks";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const TestDriveLongTerm = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();

  const { scheduleTitle, rescheduleTitle, locationOptionField } =
    props.config.schedulePickUp;
  const [pickupLocationDta, setPickupLocationDta] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isSelfPickup, setIsSelfPickup] = useState(true);

  const datesDefaultOption = appUtils.getConfig("datesDefaultOption");
  const [rentDurationList, setRentDurationList] = useState([]);
  const [modelVariantList, setModelVariantList] = useState([]);
  const [pickupDateList, setpickupDateList] = useState([]);
  const [mapData, setMapData] = useState(null);

  const [showSelfPickupForm, setShowSelfPickupForm] = useState(true);
  const [showAtHomeForm, setShowAtHomeForm] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const { selectedPlace, setMapLocation } = props;
  const [disableSelfPickupSelection, setDisableSelfPickupSelection] =
    useState(false);
  const [disableAtHomeSelection, setDisableAtHomeSelection] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [showInfo, setShowInfo] = useState(false);

  const getRentalDetail = useLongTermTestRideDetails();
  const loadData = async () => {
    const mapsConfig = {
      zoom: 12
    };
    const markers = [];
    pickupLocationDta.forEach((item, index) => {
      if (index === 0) {
        mapsConfig["center"] = {
          lat: item.Latitude,
          lng: item.Longitude
        };
      }
      const marker = {
        lat: item.Latitude,
        lng: item.Longitude,
        details: {
          id: item.id,
          title: item.location_name,
          message: item.Address1,
          image: appUtils.getConfig("resourcePath") + "images/png/vida-logo.png"
        }
      };
      markers.push(marker);
    });
    mapsConfig["markers"] = markers;
    setMapData(mapsConfig);
  };

  const reloadMap = (lat, lng) => {
    const mapsConfig = {
      zoom: 12,
      markers: []
    };
    if (lat && lng) {
      mapsConfig["center"] = {
        lat: lat,
        lng: lng
      };
      mapsConfig["fixedMarker"] = {
        lat: lat,
        lng: lng
      };
      setMapData(mapsConfig);
    } else {
      loadData();
    }
  };

  const handleMarkerPosition = async (latLng) => {
    if (selectedPlace !== CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE) {
      const mapLocation = await googleMapsUtils.getAddress({
        lat: latLng.lat,
        lng: latLng.lng
      });
      if (mapLocation) {
        const mapLocationObj = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: mapLocation.address,
          pincode: mapLocation.pincode
        };

        setMapLocation(mapLocationObj);
        setSelectedMapLocation(mapLocationObj);
      }
    }
  };

  const handleOnSiteChange = async (location) => {
    setIsSelfPickup(location == CONSTANT.LONG_TERM_MODE_OF_PICKUP.SELF_PICKUP);
    if (location == CONSTANT.LONG_TERM_MODE_OF_PICKUP.SELF_PICKUP) {
      setShowSelfPickupForm(true);
      setShowAtHomeForm(false);
      reloadMap();
    } else {
      setShowSelfPickupForm(false);
      setShowAtHomeForm(true);
      const currentPosition = await googleMapsUtils.getCurrentLocation();
      if (currentPosition && currentPosition.lat && currentPosition.lng) {
        const mapLocation = await googleMapsUtils.getAddress({
          lat: currentPosition.lat,
          lng: currentPosition.lng
        });

        if (mapLocation) {
          const mapLocationObj = {
            lat: currentPosition.lat,
            lng: currentPosition.lng,
            address: mapLocation.address,
            pincode: mapLocation.pincode
          };
          setMapLocation(mapLocationObj);
          setSelectedMapLocation(mapLocationObj);
        }
        reloadMap(currentPosition.lat, currentPosition.lng);
      }
    }
  };

  const getDateList = () => {
    const dateList = [];
    const date = new Date();
    const minDate = {
      label: date.toISOString().slice(0, 10),
      value: date.toISOString().slice(0, 10)
    };
    date.setDate(date.getDate() + CONSTANT.LONG_TERM_DATE_SELECTION_LIMIT);
    const maxDate = {
      label: date.toISOString().slice(0, 10),
      value: date.toISOString().slice(0, 10)
    };
    dateList.push(...datesDefaultOption, minDate, maxDate);
    setpickupDateList(dateList);
  };

  const fetchCentreList = async (data) => {
    setSpinnerActionDispatcher(true);
    const packages = await getLongTermPackageList(data.cityId);
    setRentDurationList(packages);
    const vehicles = await getLongTermVehicleList(data.cityId);
    setModelVariantList(vehicles);
    const pickupLocations = await getPickupLocations(data.city, data.state);
    setPickupLocationDta(pickupLocations);
    getDateList();
    setSelectedData(data);
  };

  const fetchLongTermTestDriveDetail = async (data) => {
    setSpinnerActionDispatcher(true);
    const response = await getRentalDetail({
      variables: {
        bookingId: data.bookingId
      }
    });
    if (
      response.data &&
      response.data.GetLongTermTestRideDataByID &&
      response.data.GetLongTermTestRideDataByID.statusCode === 200
    ) {
      data.city = response.data.GetLongTermTestRideDataByID.cityName;
      data.state = response.data.GetLongTermTestRideDataByID.state;
      data.cityId = response.data.GetLongTermTestRideDataByID.cityId;
      data.rentalRecord = response.data.GetLongTermTestRideDataByID;

      const isModeSelfPickup =
        response.data.GetLongTermTestRideDataByID.modeOfPickup ==
        CONSTANT.LONG_TERM_MODE_OF_PICKUP.SELF_PICKUP;

      setIsSelfPickup(isModeSelfPickup);

      if (isModeSelfPickup) {
        setShowSelfPickupForm(true);
        setShowAtHomeForm(false);
        if (data.isReschedule) {
          setIsSelfPickup(true);
          setDisableAtHomeSelection(true);
        }
      } else {
        setShowSelfPickupForm(false);
        setShowAtHomeForm(true);
        if (data.isReschedule) {
          setIsSelfPickup(false);
          setDisableSelfPickupSelection(true);
        }
      }
      const mapLocationObj = {
        lat: data.Latitude,
        lng: data.Latitude,
        address: data.currentAddress,
        pincode: data.pincode
      };
      setMapLocation(mapLocationObj);
      setSelectedMapLocation(mapLocationObj);
      fetchCentreList(data);
    }
  };
  useEffect(() => {
    if (pickupLocationDta && pickupLocationDta.length) {
      reloadMap();
    }
    if (
      selectedMapLocation &&
      selectedMapLocation.lat &&
      selectedMapLocation.lng
    ) {
      reloadMap(selectedMapLocation.lat, selectedMapLocation.lng);
    }
  }, [pickupLocationDta, selectedMapLocation]);

  useEffect(() => {
    const queryString = location.href.split("?")[1];
    if (queryString) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      const data = {
        bookingId: params.get("bookingId"),
        cityId: params.get("cityId"),
        city: params.get("city"),
        state: params.get("state"),
        country: params.get("country"),
        isReschedule: params.get("isReschedule") === "true"
      };

      if (params.has("bookingId")) {
        setSpinnerActionDispatcher(true);
        fetchLongTermTestDriveDetail(data);
      } else {
        fetchCentreList(data);
      }

      if (isAnalyticsEnabled) {
        const additionalPageName = ":Schedule Pick-up";
        const testDriveType = "Long Term Test Drive";
        analyticsUtils.trackTestdrivePageLoad(
          additionalPageName,
          testDriveType
        );
      }
    }
  }, []);

  return (
    <div className="vida-test-drive__container">
      <div className="vida-test-drive__asset">
        {mapData ? (
          <GoogleMaps
            config={mapData}
            markerPositionHandler={handleMarkerPosition}
            setShowInfo={setShowInfo}
            showInfo={showInfo}
          />
        ) : (
          <img src={props.config.backgroundImg} alt="Vida Test Drive" />
        )}
      </div>

      <div className="vida-test-drive__content">
        <div className="vida-schedule-pickup__title">
          {selectedData && selectedData.isReschedule && selectedData.bookingId
            ? rescheduleTitle
            : scheduleTitle}
        </div>
        <div className="vida-schedule-pickup__form">
          <label className="form__field-label">
            {locationOptionField.label}
          </label>

          <div className="form__group form__field-radio-group">
            <div
              className="form__field-radio"
              disabled={disableSelfPickupSelection}
            >
              <label className="form__field-label">
                {locationOptionField.optionOne}
                <input
                  type="radio"
                  name="site"
                  value={CONSTANT.LONG_TERM_MODE_OF_PICKUP.SELF_PICKUP}
                  checked={isSelfPickup}
                  disabled={disableSelfPickupSelection}
                  onChange={(e) => handleOnSiteChange(e.target.value)}
                />
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
            <div
              className="form__field-radio"
              disabled={disableAtHomeSelection}
            >
              <label className="form__field-label">
                {locationOptionField.optionTwo}
                <input
                  type="radio"
                  name="site"
                  value={CONSTANT.LONG_TERM_MODE_OF_PICKUP.HOME_DELIVERY}
                  onChange={(e) => handleOnSiteChange(e.target.value)}
                  checked={!isSelfPickup}
                  disabled={disableAtHomeSelection}
                />
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
          </div>

          {isLoggedIn && showSelfPickupForm && (
            <ScheduleSelfPickup
              config={props.config.schedulePickUp}
              selectedData={selectedData}
              rentDurationList={rentDurationList}
              modelVariantList={modelVariantList}
              pickupDateList={pickupDateList}
              mapData={mapData}
              markerPositionHandler={handleMarkerPosition}
            />
          )}

          {isLoggedIn && showAtHomeForm && (
            <SchedulePickUpAtHome
              config={props.config.schedulePickUp}
              selectedData={selectedData}
              rentDurationList={rentDurationList}
              modelVariantList={modelVariantList}
              pickupDateList={pickupDateList}
              mapData={mapData}
              reloadMap={reloadMap}
              markerPositionHandler={handleMarkerPosition}
              selectedLocation={selectedMapLocation}
              setSelectedMapLocation={setSelectedMapLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

TestDriveLongTerm.propTypes = {
  config: PropTypes.shape({
    backgroundImg: PropTypes.string,
    schedulePickUp: PropTypes.shape({
      scheduleTitle: PropTypes.string,
      rescheduleTitle: PropTypes.string,
      locationOptionField: PropTypes.object
    })
  }),
  setMapLocation: PropTypes.func,
  selectedPlace: PropTypes.string
};

TestDriveLongTerm.defaultProps = {};

const mapStateToProps = ({ testDriveReducer }) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(TestDriveLongTerm);
