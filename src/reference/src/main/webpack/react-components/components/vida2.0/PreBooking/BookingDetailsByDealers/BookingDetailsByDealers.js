import React, { useEffect, useState, useRef } from "react";
import Logger from "../../../../../services/logger.service";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPreBookingUserDataAction } from "../../../../store/preBooking/preBookingActions";
import { useForm } from "react-hook-form";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
// import Dropdown from "../../forms/Dropdown/Dropdown";
import {
  getCityListForDealers,
  getVidaCentreList
} from "../../../../../services/location.service";
// import GoogleMaps from "../../GoogleMaps/GoogleMaps";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import MapMyIndia from "../../MapMyIndia/MapMyIndia";
import { getUserCityDetails } from "../../../../services/locationFinder/locationFinderService";
import { setUserFormDataAction } from "../../../../store/userAccess/userAccessActions";
import loginUtils from "../../../../../site/scripts/utils/loginUtils";

const BookingDetailsByDealers = (props) => {
  // const [isFormSubmitted, setFormSubmitted] = useState(false);

  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [sortedOptions, setSortedOptions] = useState();

  const [showOption, setShowOption] = useState(false);
  const [availableCityList, setAvailableCityList] = useState();
  const cityInputRef = useRef();

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForDealers(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
      setAvailableCityList(cityListRes);
    }
  };
  useEffect(() => {
    fetchCityList();
  }, []);

  // const getAvailableCityList = async () => {
  //   setSpinnerActionDispatcher(true);
  //   const availableCity = await getCityListForDealers(defaultCountry);
  //   if (availableCity) {
  //     setAvailableCityList(availableCity);
  //     setSpinnerActionDispatcher(false);
  //   }
  // };

  // useEffect(() => {
  //   getAvailableCityList();
  // }, []);

  const {
    personalDetails,
    userData,
    showSteps,
    genericConfig,
    dealersConfig,
    cityField,
    stateField,
    nearByVidaCentreList,
    showBookingSummaryFields,
    setPreBookingUserInfo,
    userProfileData,
    selectedPinCode,
    overrideInfo,
    updateOverridePrice,
    prebookingState,
    prebookingCity,
    getselectedstateValue,
    getSelectedCityValue,
    getDealersFound,
    showCityErrorText,
    showStateErrorText,
    branchId,
    isShowDealersList,
    selectedCityHandler,
    startAnalyticsHandler,
    setDealerCity,
    setUserStateAndCity,
    defaultCityFieldValue
  } = props;
  const { welcomeTitle, switchAccount, confirmLabel } = personalDetails;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    getValues,
    formState: { errors },
    clearErrors
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const isLoggedIn = loginUtils.isSessionActive();
  const [isOverridePopup, setOverridePopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [listOfDealers, setListOfDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [cityDropdownValue, setCityDropdownValue] = useState("");
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [noDealerSelected, setNoDealerSelected] = useState(false);
  const [noDealersAvailable, setNoDealersAvailable] = useState(false);
  const [selectedCityValue, setSelectedCityValue] = useState("");
  const [selectedStateValue, setSelectedStateValue] = useState("");
  const [responseDealers, setResponseDealers] = useState([]);
  const [isShowDealersListTab, setisShowDealersListTab] = useState(true);
  const [isShowMapTab, setisShowMapTab] = useState(false);
  const [isSlectedDealerIndex, setSlectedDealerIndex] = useState(0);
  const [isSelectedDealersLocation, setSelectedDealersLocation] = useState();
  const [mapData, setMapData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isDealersList, setDealersList] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isDealersListLength, setDealersListLength] = useState(0);
  const [isDealerLocationShownIndex, setDealerLocationShownIndex] = useState(0);
  const [isShowStateError, setShowStateError] = useState();
  const [searchInputValue, setSearchInputValue] = useState("");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [userCityName, setUserCityName] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState({});
  const [cityBranchList, setCityBranchList] = useState("");
  const [isMapUpdate, setMapUpdate] = useState(false);
  const cityInputField = document.getElementsByClassName(
    "booking-city-search-input"
  )[0];
  const [isUpdateDealersArray, setUpdateDealersArray] = useState(false);

  const icon = {
    experienceCenter:
      appUtils.getConfig("resourcePath") + "images/svg/store-highlighted.svg"
  };

  const [dealersListRandom, setDealersListRandom] = useState([]);

  const handleSortOptions = () => {
    let filterBySearch;
    if (searchInputValue.length > 0) {
      filterBySearch = availableCityList
        ?.filter((item) => {
          if (
            item?.city.toUpperCase().includes(searchInputValue.toUpperCase())
          ) {
            return item;
          }
        })
        .sort((a, b) => (a?.city > b?.city ? 1 : -1));
      setSortedOptions(filterBySearch);
    } else {
      filterBySearch = availableCityList.sort((a, b) =>
        a?.city > b?.city ? 1 : -1
      );
      setSortedOptions(filterBySearch);
    }
  };

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
    value: userData.state || "",
    isDisabled: false
  });
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: "",
    isDisabled: true
  });
  const handleDealerClick = (dealer, index) => {
    setSlectedDealerIndex(index === isSlectedDealerIndex ? -1 : index);
    setPreBookingUserInfo({
      pincode: dealer.postalCode,
      branchId: dealer.id,
      partnerId: dealer.accountpartnerId,
      city: selectedCityValue || cityFieldData.value,
      state: selectedStateValue,
      dealerName: dealer.experienceCenterName,
      dealerPhoneNumber: dealer.phonenumber,
      dealerAddress: dealer.address,
      type: dealer.type,
      latitude: dealer.latitude,
      longitude: dealer.longitude
    });
    setSelectedDealer(dealer.id);
    setMapUpdate(false);
    setSelectedDealersLocation(dealer);
  };

  const shuffleItems = (array) => {
    // Iterate through each object in the array
    const shuffledArray = array.map((obj) => {
      if (obj.type === "Experience Center") {
        // Shuffle the items array using Fisher-Yates algorithm
        for (let i = obj.items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [obj.items[i], obj.items[j]] = [obj.items[j], obj.items[i]];
        }
      }
      return obj;
    });
    return shuffledArray;
  };

  useEffect(() => {
    if (nearByVidaCentreList.length > 0) {
      setDealersListRandom(shuffleItems(nearByVidaCentreList));
    }
  }, [nearByVidaCentreList[0]?.items.length]);

  useEffect(() => {
    const dealersList = [];
    if (nearByVidaCentreList.length > 0) {
      nearByVidaCentreList.map((item) => {
        if (item.type === "Experience Center") {
          setDealersList(item?.items);
          setDealersListLength(item?.items?.length);
          // if (selectedDealer == "") {
          setSelectedDealer(item?.items[0]?.id);
          setSelectedDealersLocation(item?.items[0]);
          setPreBookingUserInfo({
            pincode: item?.items[0]?.postalCode,
            branchId: item?.items[0]?.id,
            partnerId: item?.items[0]?.accountpartnerId,
            city: selectedCityValue || cityFieldData.value,
            state: selectedStateValue,
            dealerName: item?.items[0]?.experienceCenterName,
            dealerPhoneNumber: item?.items[0]?.phonenumber,
            dealerAddress: item?.items[0]?.address,
            type: item?.items[0].type,
            latitude: item?.items[0].latitude,
            longitude: item?.items[0].longitude
          });
          // }
        }
      });
    }

    if (selectedCity && !nearByVidaCentreList[0]?.items.length) {
      setNoDealersAvailable(true);
      getDealersFound(true);
      console.log("no dealers available");
    } else {
      setNoDealersAvailable(false);
      getDealersFound(false);
    }

    setListOfDealers(dealersList);
  }, [
    nearByVidaCentreList[0]?.items.length,
    responseDealers
    // selectedDealer,
    // isUpdateDealersArray
  ]);

  // to locate the dealers location
  useEffect(() => {
    try {
      if (isSelectedDealersLocation) {
        const mapsConfig = {
          zoom: 12,
          center: {
            lat: parseFloat(isSelectedDealersLocation.latitude),
            lng: parseFloat(isSelectedDealersLocation.longitude)
          }
        };
        const markers = [];
        const marker = {
          lat: parseFloat(isSelectedDealersLocation.latitude),
          lng: parseFloat(isSelectedDealersLocation.longitude)
          // icon: icon[experienceCenter]
        };
        marker["details"] = {
          id: isSelectedDealersLocation.id,
          title: isSelectedDealersLocation.experienceCenterName,
          message: isSelectedDealersLocation.address
          // image: icon.experienceCenter
        };
        markers.push(marker);
        mapsConfig["markers"] = markers;
        setMapData(mapsConfig);
        isDealersList.map((item, index) => {
          if (item.id == isSelectedDealersLocation.id) {
            setDealerLocationShownIndex(index);
          }
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  }, [isSelectedDealersLocation]);

  const fetchCentreList = async (userCity) => {
    setSelectedCity("");
    setSpinnerActionDispatcher(true);
    const responseDealers = await getVidaCentreList(userCity.city);
    setResponseDealers(responseDealers);
    setSelectedCity(userCity.value);
    // setSpinnerActionDispatcher(false);
  };

  // const onChangeState = (name, value = "bike") => {
  //   setListOfDealers([]);
  //   setSelectedCityValue("");
  //   setNoDealersAvailable(false);
  //   getDealersFound(false);

  //   const dataListOptions = dataList[value?.toLowerCase()]
  //     ? dataList[value.toLowerCase()]?.map((item) => item)
  //     : [];
  //   if (value) {
  //     setSelectedStateValue(value);
  //     setCityFieldData({
  //       ...cityFieldData,
  //       isDisabled: false,
  //       options: [...cityFieldInfo.options, ...dataListOptions],
  //       value: ""
  //     });
  //   } else {
  //     setCityFieldData({
  //       ...cityFieldData,
  //       isDisabled: true,
  //       options: []
  //     });
  //     setListOfDealers([]);
  //   }
  //   getselectedstateValue(value);
  //   getSelectedCityValue("");
  // };

  // to change the tab content
  const isHandleTabContent = () => {
    setisShowDealersListTab(!isShowDealersListTab);
    setisShowMapTab(!isShowMapTab);
    setMapUpdate(true);
  };

  // to view the next dealer
  const isRightClick = (x) => {
    isDealersList.map((item, index) => {
      if (x.id == item.id) {
        return setSelectedDealersLocation(isDealersList[index + 1]);
      }
    });
  };

  // to view the previous dealer
  const isLeftClick = (x) => {
    isDealersList.map((item, index) => {
      if (x.id == item.id) {
        return setSelectedDealersLocation(isDealersList[index - 1]);
      }
    });
  };
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
      value: prebookingState ? prebookingState : stateFieldData.value,
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
            prebookingState
              ? prebookingState.toLowerCase()
              : stateFieldData.value.toLowerCase()
          ]?.map((item) => {
            return {
              label: item.city,
              value: item.value
            };
          })
        : [];

    setCityFieldData({
      ...cityFieldData,
      isDisabled: false,
      value: prebookingCity ? prebookingCity : cityFieldData.value,
      options: [
        ...cityFieldInfo.options,
        ...(updatedCities ? updatedCities : [])
      ]
    });
    getSelectedCityValue(cityFieldData.value);
  }, [cityList]);

  const handleFormSubmit = (override = false) => {
    if (!selectedDealer) {
      setNoDealerSelected(true);
    }
    // else if (!override && selectedPinCode !== userData.pincode) {
    //   setOverridePopup(true);
    // }
    else {
      showBookingSummaryFields(true);
    }
  };

  const getDealerList = async (cityName) => {
    if (cityInputField) {
      cityInputField.value = cityName;
    }
    setErrorMsg("");
    if (cityName.length > 0) {
      setSpinnerActionDispatcher(true);
      setDealerCity(false);
      const centreList = await getVidaCentreList(cityName);
      getSelectedCityValue(cityName);
      if (centreList) {
        setCityBranchList(cityName);
      }
      if (centreList[0]?.items?.length > 0) {
        setUpdateDealersArray(true);
        window.sessionStorage.setItem("selectedBookingCity", cityName);
      } else {
        setErrorMsg(cityField?.validationRules?.noDealerErrorMsg);
      }
      setDealerCity(true);
      setSpinnerActionDispatcher(false);
    } else {
      setErrorMsg(cityField?.validationRules?.noValueErrorMsg);
    }
  };

  const handleOnFocus = () => {
    setShowOption(true);
    handleSortOptions();
    startAnalyticsHandler && startAnalyticsHandler();
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
    if (searchInputValue.length > 0) {
      const matchCity = availableCityList?.filter((item) => {
        if (item?.city.toUpperCase() === searchInputValue.toUpperCase()) {
          return item;
        }
      });
      if (matchCity?.length < 1) {
        getSelectedCityValue(matchCity[0]?.city.toUpperCase());
        setErrorMsg(cityField?.validationRules?.noValueErrorMsg);
      } else {
        setErrorMsg("");
        setSelectedOptionValue(matchCity[0]);
        getDealerList(matchCity[0]?.city.toUpperCase());
        setUserStateAndCity({
          customer_city: matchCity[0]?.city,
          customer_state: matchCity[0]?.state,
          customer_country: "India"
        });
      }
    }
  };

  const handleOnKeyUp = () => {
    handleSortOptions();
  };

  useEffect(() => {
    if (showCityErrorText) {
      setErrorMsg("");
    }
  }, [showCityErrorText]);

  useEffect(() => {
    if (userProfileData?.city && defaultCityFieldValue?.length === 0) {
      const getLoggedInUserCity = userProfileData?.city;
      if (getLoggedInUserCity) {
        if (!cityInputField?.value) {
          getDealerList(getLoggedInUserCity);
        }
        if (cityInputField) {
          cityInputField.value = getLoggedInUserCity;

          if (cityInputField.value) {
            setSearchInputValue(cityInputField.value);
          }
        }
        // getSelectedCityValue(getLoggedInUserCity);
      }
      if (cityInputField && userProfileData?.city.length > 1) {
        setTimeout(() => {
          if (cityInputRef.current) {
            cityInputRef.current.value = userProfileData?.city;
            getDealerList(userProfileData?.city);
            setSearchInputValue(cityInputRef.current.value);
          }
        }, 500);
      }
    }
  }, [userProfileData?.city, defaultCityFieldValue]);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    setTimeout(() => {
      if (cityInputRef.current && defaultCityFieldValue?.length > 1) {
        cityInputRef.current.value = defaultCityFieldValue;
        setSearchInputValue(cityInputRef.current.value);
        getDealerList(defaultCityFieldValue);
      }
      setSpinnerActionDispatcher(false);
    }, 500);
  }, [defaultCityFieldValue]);

  const handleOptionSelect = (value, e) => {
    // setSearchValue(value?.city);
    setSearchInputValue(value.city);
    selectedCityHandler && selectedCityHandler(value);
    setSelectedOptionValue(value);
    setUserStateAndCity({
      customer_city: value.city,
      customer_state: value.state,
      customer_country: "India"
    });

    // setSelectedOptionValue(value);
    getDealerList(value?.city);
  };

  useEffect(() => {
    if (cityBranchList && selectedOptionValue.city) {
      selectedCityHandler && selectedCityHandler(selectedOptionValue);
    } else if (userProfileData.city.length > 0) {
      selectedCityHandler && selectedCityHandler(userProfileData);
    }
  }, [cityBranchList, cityInputField?.value]);

  // const cancelOverride = () => {
  //   setOverridePopup(false);
  // };

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
      getDealerList(getUserCityByLocation);
      setLocationEnabled(true);
      setSpinnerActionDispatcher(false);
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
    if (
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
      if (userData?.city) {
        getDealerList(userData?.city);
      }

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
    // onChangeState("state", userData.state);
    const selectedCityAvailable = cityFieldData.options.find(
      (item) =>
        item.value.indexOf(
          userData?.city ? userData?.city?.toLowerCase() : userData.city
        ) !== -1
    );
    if (selectedCityAvailable) {
      setCityFieldData({
        ...cityFieldData,
        value: selectedCityAvailable.value
      });
    } else {
      setCityFieldData({
        ...cityFieldData,
        value: prebookingCity ? prebookingCity : cityFieldData.value
      });
    }
    getSelectedCityValue(cityFieldData.value);
  }, [stateFieldData]);

  return (
    <>
      {!isShowDealersList && (
        <div className="dealership-finder-search-container">
          <div
            className="dealership-location-find-icon"
            onClick={handleGetUserLocation}
          >
            {locationEnabled ? (
              <img src={cityField?.icon} alt="location_find_icon1"></img>
            ) : (
              <img src={cityField?.secondIcon} alt="location_find_icon2"></img>
            )}
          </div>
          <input
            className="booking-city-search-input"
            placeholder={cityField?.placeholder}
            type="text"
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyUp={handleOnKeyUp}
            onChange={(e) => setSearchInputValue(e.target.value)}
            ref={cityInputRef}
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
          <p className="dealers-error-msg">{errorMsg}</p>
          {showCityErrorText && (
            <p className="dealers-error-msg">
              {cityField?.validationRules?.required?.message}
            </p>
          )}
        </div>
        // <form onSubmit={handleSubmit(() => handleFormSubmit())}>
        //   <div
        //     className={`vida-booking-details-dealers__pincode ${
        //       showStateErrorText ? "vida-error-box" : ""
        //     }`}
        //   >
        //     <Dropdown
        //       name={stateFieldInfo.name}
        //       label={stateFieldInfo.label}
        //       options={
        //         stateFieldData.options.length > 0
        //           ? stateFieldData.options
        //           : stateFieldInfo.options
        //       }
        //       value={stateFieldData.value.toLowerCase()}
        //       setValue={setValue}
        //       onChangeHandler={onChangeState}
        //       errors={errors}
        //       validationRules={stateFieldInfo.validationRules}
        //       clearErrors={clearErrors}
        //       isAutocomplete={true}
        //       register={register}
        //       isSortAsc={true}
        //     />
        //     {showStateErrorText && (
        //       <p className="dropdown-error-text">
        //         {stateField?.validationRules?.required?.message}
        //       </p>
        //     )}
        //   </div>

        //   <div
        //     className={`vida-booking-details-dealers__pincode ${
        //       showCityErrorText ? "vida-error-box" : ""
        //     }`}
        //   >
        //     <Dropdown
        //       name={cityFieldInfo.name}
        //       label={cityFieldInfo.label}.
        //       options={
        //         cityFieldData.options.length > 0
        //           ? cityFieldData.options
        //           : cityFieldInfo.options
        //       }
        //       value={cityFieldData.value}
        //       setValue={setValue}
        //       onChangeHandler={handleDropdownChange}
        //       errors={errors}
        //       validationRules={cityFieldInfo.validationRules}
        //       clearErrors={clearErrors}
        //       isAutocomplete={true}
        //       register={register}
        //       isSortAsc={true}
        //       // isDisabled={cityFieldData.isDisabled}
        //     />
        //     {showCityErrorText && (
        //       <p className="dropdown-error-text">
        //         {cityField?.validationRules?.required?.message}
        //       </p>
        //     )}
        //   </div>
        //   {noDealersAvailable && (
        //     <p className="dealers-error-text">
        //       {genericConfig?.noDealerAvailableError}
        //     </p>
        //   )}
        // </form>
      )}

      {/* {isShowDealersList && ( */}
      <div className={`${!isShowDealersList ? "d-none" : ""}`}>
        <div className="booking-dealers__tabs">
          <div
            className={`booking-dealers__tabs-header ${
              isShowDealersListTab ? "booking-dealers__tab-active" : ""
            }`}
            onClick={() => {
              isHandleTabContent();
            }}
          >
            <p className="booking-dealers__header-text">
              {dealersConfig?.listTabLabel}
            </p>
          </div>
          <div
            className={`booking-dealers__tabs-header ${
              isShowMapTab ? "booking-dealers__tab-active" : ""
            }`}
            onClick={() => {
              isHandleTabContent();
            }}
          >
            <p className="booking-dealers__header-text">
              {dealersConfig?.mapTabLabel}
            </p>
          </div>
        </div>
        <div className={`booking-dealers__tabs-content `}>
          {/* <div className="booking-dealers__tabs-content"> */}
          {/* {isShowDealersListTab && ( */}
          <>
            <div
              className={`booking-dealers__details ${
                !isShowDealersListTab ? "d-none" : ""
              }`}
            >
              <p className="booking-dealers__details-header">
                {dealersConfig?.centerNearByLabel}
              </p>
              {dealersListRandom
                ?.filter((item) => {
                  return item.type === "Experience Center";
                })
                ?.map((datas) => (
                  <div className="testRide-dealers__tabs-list" key={datas}>
                    {datas.items.map((x, index) => (
                      <div
                        key={x.id}
                        className={`booking-dealers__details-content ${
                          index === isSlectedDealerIndex
                            ? "booking-dealers__content-active"
                            : ""
                        }`}
                        onClick={(e) => handleDealerClick(x, index)}
                      >
                        <div className="dealers__name-distance">
                          <p className="dealers__center-name">
                            {x?.experienceCenterName}
                          </p>
                        </div>
                        <div className="dealers__ph-address">
                          <div className="dealers__ph">
                            <p className="dealers__ph-text">
                              {x?.phonenumber ? "+91" + x?.phonenumber : ""}
                            </p>
                          </div>
                          <div className="dealers__address">
                            <span className="dealers__address-text">
                              {x?.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
          {/* // )} */}
          <div className={`${!isShowMapTab ? "d-none" : ""}`}>
            {/* {isShowMapTab && ( */}
            <div className="map-container">
              {nearByVidaCentreList[0]?.items && (
                // <GoogleMaps
                //   setShowInfo={setShowInfo}
                //   showInfo={showInfo}
                //   config={mapData}
                //   disableIconClick={false}
                // ></GoogleMaps>
                <MapMyIndia
                  dealerDetails={nearByVidaCentreList[0]?.items}
                  isCityPage={false}
                  isTestRidePage={true}
                  isShowDirection={false}
                  selectedDealer={isSelectedDealersLocation}
                  setSelectedDealer={setSelectedDealersLocation}
                  isRenderMap={true}
                  userMapId={"bookingMap"}
                  isMapUpdate={isMapUpdate}
                />
              )}
              <div className="locate-dealers">
                <>
                  {isDealersList &&
                    isDealersList
                      .filter((item) => {
                        return item.id === mapData?.markers[0].details.id;
                      })
                      .map((x, index) => (
                        <div
                          key={x.id}
                          className={`booking-dealers__details-content`}
                        >
                          <div
                            className={`booking-dealers__left-arrow`}
                            onClick={(e) => {
                              isLeftClick(x);
                            }}
                          >
                            <img
                              src={
                                appUtils.getConfig("resourcePath") +
                                "images/svg/left-arrow.svg"
                              }
                            ></img>
                          </div>
                          <div className="locate-dealers__container">
                            <div className="dealers__name-distance">
                              <p className="dealers__center-name">
                                {x?.experienceCenterName}
                              </p>
                            </div>
                            <div className="dealers__ph-address">
                              <div className="dealers__ph">
                                <p className="dealers__ph-text">
                                  {x?.phonenumber ? "+91" + x?.phonenumber : ""}
                                </p>
                              </div>
                              <div className="dealers__address">
                                <span className="dealers__address-text">
                                  {x?.address}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`booking-dealers__right-arrow`}
                            onClick={(e) => {
                              isRightClick(x);
                            }}
                          >
                            <img
                              src={
                                appUtils.getConfig("resourcePath") +
                                "images/svg/right-arrow.svg"
                              }
                            ></img>
                          </div>
                        </div>
                      ))}
                </>
              </div>
            </div>
          </div>
          {/* // )} */}
        </div>
      </div>
      {/* // )} */}
    </>
  );
};

const mapStateToProps = ({
  userProfileDataReducer,
  testDriveReducer,
  preBookingReducer
}) => {
  return {
    userData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      pincode: userProfileDataReducer.pincode,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    userProfileData: userProfileDataReducer,
    nearByVidaCentreList: testDriveReducer.nearByVidaCentreList,
    selectedPinCode: preBookingReducer.pincode,
    prebookingState: preBookingReducer.state,
    prebookingCity: preBookingReducer.city,
    branchId: preBookingReducer.branchId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPreBookingUserInfo: (data) => {
      dispatch(setPreBookingUserDataAction(data));
    },
    setUserStateAndCity: (data) => {
      dispatch(setUserFormDataAction(data));
    }
  };
};

BookingDetailsByDealers.propTypes = {
  personalDetails: PropTypes.shape({
    welcomeTitle: PropTypes.string,
    message: PropTypes.string,
    changePincodeLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    switchAccount: PropTypes.shape({
      message: PropTypes.string,
      redirectionLabel: PropTypes.string
    }),
    checkAvailabilityBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notificationBtn: PropTypes.shape({
      label: PropTypes.string
    })
    // promotionBanner: PropTypes.string
  }),
  genericConfig: PropTypes.shape({
    stepLabel: PropTypes.string,
    nonDealerSelectedError: PropTypes.string,
    noDealerAvailableError: PropTypes.string,
    dealersLoadingMsg: PropTypes.string,
    locationErrorMsg: PropTypes.string
  }),
  dealersConfig: PropTypes.shape({
    listTabLabel: PropTypes.string,
    mapTabLabel: PropTypes.string,
    centerNearByLabel: PropTypes.string
  }),
  cityField: PropTypes.shape({
    icon: PropTypes.string,
    secondIcon: PropTypes.string,
    placeholder: PropTypes.string,
    validationRules: PropTypes.object
  }),
  stateField: PropTypes.shape({
    label: PropTypes.string,
    validationRules: PropTypes.object
  }),
  overrideInfo: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    overrideBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    cancelBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  getselectedstateValue: PropTypes.func,
  getSelectedCityValue: PropTypes.func,
  getDealersFound: PropTypes.func,
  showCityErrorText: PropTypes.bool,
  showStateErrorText: PropTypes.bool,
  setPreBookingUserInfo: PropTypes.func,
  showBookingSummaryFields: PropTypes.func,
  showSteps: PropTypes.number,
  userData: PropTypes.object,
  updateOverridePrice: PropTypes.func,
  nearByVidaCentreList: PropTypes.array,
  userProfileData: PropTypes.object,
  selectedPinCode: PropTypes.string,
  prebookingState: PropTypes.string,
  prebookingCity: PropTypes.string,
  branchId: PropTypes.string,
  isShowDealersList: PropTypes.bool,
  selectedCityHandler: PropTypes.func,
  setUserStateAndCity: PropTypes.func,
  startAnalyticsHandler: PropTypes.func,
  setDealerCity: PropTypes.func,
  defaultCityFieldValue: PropTypes.string
};

BookingDetailsByDealers.defaultProps = {
  personalDetails: {}
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingDetailsByDealers);
