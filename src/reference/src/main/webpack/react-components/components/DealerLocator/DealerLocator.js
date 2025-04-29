import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Dropdown from "../form/Dropdown/Dropdown";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import DealerCard from "../DealerCard/DealerCard";
import {
  getCityListForDealers,
  getVidaCentreList
} from "../../../services/location.service";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import { getGoogleMapData } from "../../../services/location.service";

const DealerLocator = (props) => {
  const { userData, config } = props;
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const {
    title,
    highlightTitle,
    selectedTitle,
    selectedHighlightTitle,
    backgroundImg,
    mobileBackgroundImg,
    mobileNoDataText,
    mobileNoDataImage,
    cityField,
    stateField,
    mapIcon,
    phoneIcon,
    noDealerAvailableError,
    dealersLoadingMsg,
    defaultCity,
    mapConfigCity
  } = config;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    clearErrors
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const [showInfo, setShowInfo] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const experienceCenterIcon =
    appUtils.getConfig("resourcePath") + "images/svg/store-highlighted.svg";
  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateSearchList"),
    ...stateField
  };
  const [dataList, setDataList] = useState({});
  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("cityList"),
    ...cityField
  };

  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: "",
    isDisabled: false
  });
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: "",
    isDisabled: true
  });
  const [dealerList, setDealerList] = useState([]);

  const [listOfDealers, setListOfDealers] = useState([]);

  const [cityDropdownValue, setCityDropdownValue] = useState("");
  const [noDealersAvailable, setNoDealersAvailable] = useState(false);

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForDealers(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
    }
  };

  useEffect(() => {
    fetchCityList();
    const defaultMapData = {
      zoom: defaultCity.zoom,
      center: {
        lat: parseFloat(defaultCity.latitude),
        lng: parseFloat(defaultCity.longitude)
      },
      markers: []
    };
    setMapData(defaultMapData);
  }, []);

  useEffect(() => {
    const dealersListItems = [];
    if (dealerList && dealerList.length > 0) {
      dealerList.map((item) => {
        if (item.type === "Experience Center") {
          item.items.map((x) => {
            dealersListItems.push(
              <DealerCard dealer={x} mapIcon={mapIcon} phoneIcon={phoneIcon} />
            );
          });
        }
      });
    }
    if (cityDropdownValue && !dealerList.length) {
      setNoDealersAvailable(true);
    } else {
      setNoDealersAvailable(false);
    }

    setListOfDealers(dealersListItems);
  }, [dealerList]);

  const reloadGoogleMaps = async (markers, userCity) => {
    getGoogleMapData(userCity.city, userCity.state).then((response) => {
      const mapsConfig = {
        zoom: mapConfigCity.zoom,
        center: {
          lat: parseFloat(response.lat),
          lng: parseFloat(response.lng)
        }
      };

      mapsConfig["markers"] = markers;
      mapsConfig["googleNavigateLabel"] = mapConfigCity.googleNavigateLabel;
      setMapData(mapsConfig);
    });
  };

  const fetchCentreList = async (userCity) => {
    setSpinnerActionDispatcher(true);
    const responseDealers = await getVidaCentreList(userCity.city);
    setCityDropdownValue(userCity.value);
    setDealerList(responseDealers);
    setSpinnerActionDispatcher(false);
    if (responseDealers.length == 0) {
      reloadGoogleMaps([], userCity);
    }
  };

  const onChangeState = (name, value) => {
    const dataListOptions = dataList[value && value.toLowerCase()]
      ? dataList[value.toLowerCase()]?.map((item) => item)
      : [];
    if (value) {
      setCityFieldData({
        ...cityFieldData,
        isDisabled: false,
        value: "",
        options: [...cityFieldInfo.options, ...dataListOptions]
      });
    } else {
      setCityFieldData({
        ...cityFieldData,
        isDisabled: true,
        options: []
      });
      setListOfDealers([]);
      setNoDealersAvailable(null);
    }
  };

  const handleDropdownChange = async (name, value) => {
    setListOfDealers([]);
    setNoDealersAvailable(false);
    if (value !== "") {
      setValue("city", value);
      const userCity = cityList.find((city) => city.value === value);
      setSelectedLocation(userCity);
      fetchCentreList(userCity);
    }
  };
  useEffect(() => {
    const userCity = cityList.find((city) => city.city === userData.city);
    if (userCity) {
      setCityDropdownValue(userCity.value);
      setSelectedLocation(userCity);
      fetchCentreList(userCity);
    }
  }, [userData.city]);
  useEffect(() => {
    const dataList = {};
    cityList.map((item) => {
      if (item.state) {
        const key = item.state.toLowerCase();
        dataList[key] ? dataList[key].push(item) : (dataList[key] = [item]);
      }
    });
    setDataList(dataList);
    setStateFieldData({
      ...stateFieldData,
      options: [
        ...stateFieldInfo.options,
        ...Object.keys(dataList).map((item) => {
          return {
            value: item.toLowerCase(),
            label: item.charAt(0).toUpperCase() + item.toLowerCase().slice(1)
          };
        })
      ]
    });

    const updatedCities =
      dataList && Object.keys(dataList).length > 0
        ? dataList[
            userData.state.toLowerCase()
              ? userData.state.toLowerCase()
              : stateFieldData.value.toLowerCase()
          ]?.map((item) => {
            return {
              label: item.city,
              value: item.value
            };
          })
        : [];

    let userDataCity = "";
    const cityValue = dataList[
      userData.state.toLowerCase()
        ? userData.state.toLowerCase()
        : stateFieldData.value.toLowerCase()
    ]?.map((item) => {
      if (
        item.city.toLowerCase() == userData.city.toLowerCase() ||
        item.value.toLowerCase() === cityFieldData.value
      ) {
        userDataCity = item.value;
      }
    });
    setCityFieldData({
      ...cityFieldData,
      isDisabled: false,
      value: userDataCity,
      options: [
        ...cityFieldInfo.options,
        ...(updatedCities ? updatedCities : [])
      ]
    });
  }, [cityList]);
  useEffect(() => {
    if (
      userData &&
      userData.state &&
      Object.keys(dataList).indexOf(userData.state.toLowerCase()) !== -1
    ) {
      setStateFieldData({
        ...stateFieldData,
        value: userData.state.toLowerCase()
      });
      let userDataCity = "";
      const cityValue = dataList[userData.state.toLowerCase()].map((item) => {
        if (item.city.toLowerCase() == userData.city.toLowerCase()) {
          userDataCity = item.value;
        }
      });

      setCityFieldData({
        ...cityFieldData,
        isDisabled: false,
        value: userDataCity,
        options: [
          ...cityFieldInfo.options,
          ...dataList[userData.state.toLowerCase()].map((item) => {
            return {
              label: item.city,
              value: item.value
            };
          })
        ]
      });
    }
  }, [userData.state]);

  useEffect(() => {
    onChangeState("state", userData.state);
    const selectedCityAvailable = cityFieldData.options.find(
      (item) => item.value.indexOf(userData.city.toLowerCase()) !== -1
    );

    if (selectedCityAvailable) {
      setCityFieldData({
        ...cityFieldData,
        value: selectedCityAvailable.value
      });
    } else {
      setCityFieldData({
        ...cityFieldData,
        value: cityFieldData.value
      });
    }
  }, [stateFieldData]);

  useEffect(() => {
    if (dealerList.length > 0) {
      const markers = [];
      dealerList.map((item) => {
        if (item.type === "Experience Center") {
          item.items.map((x) => {
            const marker = {
              lat: parseFloat(x.latitude),
              lng: parseFloat(x.longitude),
              icon: experienceCenterIcon,
              details: {
                id: x.id,
                title: x.experienceCenterName,
                message: x.address,
                image: experienceCenterIcon
              }
            };
            markers.push(marker);
          });
        }
      });
      reloadGoogleMaps(markers, selectedLocation);
    }
  }, [dealerList]);

  return (
    <div
      className={`vida-dealer-locator vida-container ${
        listOfDealers.length > 0 ? "with-data" : ""
      }`}
      style={{ backgroundImage: `url(${mobileBackgroundImg})` }}
    >
      <div
        className={`vida-dealer-locator__locator ${
          listOfDealers.length > 0 ? "with-data" : ""
        }`}
      >
        <h1>
          {listOfDealers.length === 0 ? title : selectedTitle}
          <span className="text-orange ml-2">
            {listOfDealers.length === 0
              ? highlightTitle
              : selectedHighlightTitle}
          </span>
        </h1>

        <form
          className="vida-dealer-locator__locator-form"
          // onSubmit={handleSubmit(() => handleFormSubmit())}
        >
          <div className="vida-booking-details-dealers__pincode">
            <Dropdown
              name={stateFieldInfo.name}
              label={stateFieldInfo.label}
              options={
                stateFieldData.options.length > 0
                  ? stateFieldData.options
                  : stateFieldInfo.options
              }
              value={stateFieldData.value}
              setValue={setValue}
              onChangeHandler={onChangeState}
              errors={errors}
              validationRules={stateFieldInfo.validationRules}
              clearErrors={clearErrors}
              isAutocomplete={true}
              register={register}
              isSortAsc={true}
            />
          </div>

          <div className="vida-booking-details-dealers__pincode">
            <Dropdown
              name={cityFieldInfo.name}
              label={cityFieldInfo.label}
              options={
                cityFieldData.options.length > 0
                  ? cityFieldData.options
                  : cityFieldInfo.options
              }
              value={cityFieldData.value}
              setValue={setValue}
              onChangeHandler={handleDropdownChange}
              errors={errors}
              validationRules={cityFieldInfo.validationRules}
              clearErrors={clearErrors}
              isAutocomplete={true}
              register={register}
              isDisabled={cityFieldData.isDisabled}
              isSortAsc={true}
            />
          </div>
        </form>
        {getValues(cityFieldInfo.name) &&
          listOfDealers.length === 0 &&
          !noDealersAvailable && <p>{dealersLoadingMsg}</p>}
        {noDealersAvailable && (
          <p className="vida-booking-details-dealers__errors">
            {noDealerAvailableError}
          </p>
        )}
        {listOfDealers.length === 0 && (
          <div className="no-data-image-mobile">
            <img src={mobileNoDataImage}></img>
            <p>{mobileNoDataText}</p>
          </div>
        )}
      </div>
      <div className="vida-dealer-locator">
        <div className="vida-dealer-locator__data with-data">
          {listOfDealers.length > 0 && (
            <div className="form vida-booking-details-dealers__listofdealers">
              {listOfDealers &&
                listOfDealers.length > 0 &&
                listOfDealers.map((dealer) => {
                  return dealer;
                })}
            </div>
          )}
        </div>

        <div className="vida-dealer-locator__asset">
          {mapData && (
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
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userData: userProfileDataReducer
  };
};

DealerLocator.propTypes = {
  config: PropTypes.object,
  userData: PropTypes.object
};

export default connect(mapStateToProps)(DealerLocator);
