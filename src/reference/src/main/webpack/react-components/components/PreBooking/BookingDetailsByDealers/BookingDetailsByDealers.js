import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPreBookingUserDataAction } from "../../../store/preBooking/preBookingActions";
import { useForm } from "react-hook-form";
import { useUserData } from "../../../hooks/userProfile/userProfileHooks";
import Logout from "../../Logout/Logout";
import CONSTANT from "../../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Popup from "../../Popup/Popup";
import Dropdown from "../../form/Dropdown/Dropdown";
import appUtils from "../../../../site/scripts/utils/appUtils";
import {
  getCityListForDealers,
  getVidaCentreList
} from "../../../../services/location.service";
import { setUserFormDataActionDispatcher } from "../../../store/userAccess/userAccessActions";

const BookingDetailsByDealers = (props) => {
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForDealers(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
    }
  };
  useEffect(() => {
    fetchCityList();
  }, []);

  const getUserData = useUserData();
  useEffect(() => {
    //REF: Hide spinner for remaining API calls
    // setSpinnerActionDispatcher(true);
    getUserData();
  }, []);
  const {
    personalDetails,
    userData,
    showSteps,
    genericConfig,
    cityField,
    stateField,
    nearByVidaCentreList,
    showBookingSummaryFields,
    setPreBookingUserInfo,
    selectedPinCode,
    overrideInfo,
    updateOverridePrice,
    prebookingState,
    prebookingCity,
    branchId
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

  const [isOverridePopup, setOverridePopup] = useState(false);

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
  const handleDealerClick = (dealer) => {
    setPreBookingUserInfo({
      pincode: dealer.postalCode,
      branchId: dealer.id,
      partnerId: dealer.accountpartnerId,
      city: selectedCityValue || cityFieldData.value,
      state: selectedStateValue
    });
    setSelectedDealer(dealer.id);
  };
  useEffect(() => {
    const dealersList = [];
    if (nearByVidaCentreList.length > 0) {
      nearByVidaCentreList.map((item) => {
        if (item.type === "Experience Center") {
          item.items.map((x) => {
            dealersList.push(
              <div
                onClick={(e) => handleDealerClick(x)}
                key={x.id}
                className={`form vida-booking-details-dealers__dealer vida-booking-details-dealers__dealer${
                  selectedDealer === x.id || branchId === x.id ? "--active" : ""
                }`}
              >
                <p>{x.experienceCenterName}</p>
                <div>{x.address}</div>
              </div>
            );
          });
        }
      });
    }

    if (selectedCity && !nearByVidaCentreList.length) {
      setNoDealersAvailable(true);
    } else {
      setNoDealersAvailable(false);
    }

    setListOfDealers(dealersList);
  }, [nearByVidaCentreList.length, responseDealers, selectedDealer]);

  const fetchCentreList = async (userCity) => {
    setSelectedCity("");
    setSpinnerActionDispatcher(true);
    const responseDealers = await getVidaCentreList(userCity.city);
    setResponseDealers(responseDealers);
    setSelectedCity(userCity.value);

    setSpinnerActionDispatcher(false);
  };

  const onChangeState = (name, value) => {
    setListOfDealers([]);
    setSelectedCityValue("");
    setNoDealersAvailable(false);
    const dataListOptions = dataList[value.toLowerCase()]
      ? dataList[value.toLowerCase()]?.map((item) => item)
      : [];
    if (value) {
      setSelectedStateValue(value);
      setCityFieldData({
        ...cityFieldData,
        isDisabled: false,
        options: [...cityFieldInfo.options, ...dataListOptions],
        value: ""
      });
    } else {
      setCityFieldData({
        ...cityFieldData,
        isDisabled: true,
        options: []
      });
      setListOfDealers([]);
    }
  };

  const handleDropdownChange = async (name, value) => {
    if (selectedCityValue !== value) {
      //  setListOfDealers([]);
      //  setNoDealersAvailable(false);
    }
    if (value !== "") {
      setSelectedCityValue(value);
      const userCity = cityList.find((city) => city.value === value);
      updateOverridePrice(userCity.city, userCity.state, "INDIA");
      setUserFormDataActionDispatcher({
        customer_city: userCity.city ? userCity.city : ""
      });
      if (cityDropdownValue !== value) {
        setSelectedDealer("");
        setNoDealerSelected(false);
      }
      fetchCentreList(userCity);
    }
  };

  useEffect(() => {
    const userCity = cityList.find((city) => city.city === userData.city);
    if (userCity) {
      setDefaultCityValue(userCity.value);
      setCityDropdownValue(userCity.value);
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

  const cancelOverride = () => {
    setOverridePopup(false);
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
        value: prebookingCity ? prebookingCity : cityFieldData.value
      });
    }
  }, [stateFieldData]);
  return (
    <div className="form vida-booking-details-dealers__register">
      <div className="form vida-booking-details-dealers__step">
        <p>
          {genericConfig.stepLabel}
          <span>{showSteps}</span>
          <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
        </p>
      </div>
      <div>
        <h1 className="vida-booking-details-dealers__title">{welcomeTitle}</h1>
        <h2 className="vida-booking-details-dealers__user-name">
          {`${userData.fname} ${userData.lname}`}
        </h2>
      </div>
      <form onSubmit={handleSubmit(() => handleFormSubmit())}>
        <div className="vida-booking-details-dealers__pincode">
          <Dropdown
            name={stateFieldInfo.name}
            label={stateFieldInfo.label}
            options={
              stateFieldData.options.length > 0
                ? stateFieldData.options
                : stateFieldInfo.options
            }
            value={stateFieldData.value.toLowerCase()}
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
            isSortAsc={true}
            // isDisabled={cityFieldData.isDisabled}
          />
        </div>

        <div className="form vida-booking-details-dealers__listofdealers">
          {listOfDealers &&
            listOfDealers.length > 0 &&
            listOfDealers.map((dealer) => {
              return dealer;
            })}
        </div>

        {!!selectedCityValue &&
          getValues(cityFieldInfo.name) &&
          listOfDealers.length === 0 &&
          !noDealersAvailable && <p>{genericConfig.dealersLoadingMsg}</p>}

        {!!selectedCityValue && noDealersAvailable && (
          <p className="vida-booking-details-dealers__errors">
            {genericConfig.noDealerAvailableError}
          </p>
        )}

        {noDealerSelected && !selectedDealer && (
          <p className="vida-booking-details-dealers__errors">
            {genericConfig.nonDealerSelectedError}
          </p>
        )}

        <div className="vida-booking-details-dealers__btn-container">
          <button type="submit" className="btn btn--primary full-width">
            {confirmLabel}
          </button>
        </div>

        <div className="vida-booking-details-dealers__switch-account">
          <p>{switchAccount.message}</p>
          <Logout label={switchAccount.redirectionLabel} />
        </div>
      </form>
      {isOverridePopup && (
        <Popup handlePopupClose={cancelOverride}>
          <h3>{overrideInfo.title}</h3>
          <p>{overrideInfo.content}</p>
          <div>
            <button className="btn btn--secondary" onClick={cancelOverride}>
              {overrideInfo.cancelBtn.label}
            </button>
            <button
              className="btn btn--primary"
              onClick={() => handleFormSubmit(true)}
            >
              {overrideInfo.overrideBtn.label}
            </button>
          </div>
        </Popup>
      )}
    </div>
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
    dealersLoadingMsg: PropTypes.string
  }),
  cityField: PropTypes.shape({
    label: PropTypes.string,
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
  setPreBookingUserInfo: PropTypes.func,
  showBookingSummaryFields: PropTypes.func,
  showSteps: PropTypes.number,
  userData: PropTypes.object,
  updateOverridePrice: PropTypes.func,
  nearByVidaCentreList: PropTypes.array,
  selectedPinCode: PropTypes.string,
  prebookingState: PropTypes.string,
  prebookingCity: PropTypes.string,
  branchId: PropTypes.string
};

BookingDetailsByDealers.defaultProps = {
  personalDetails: {}
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingDetailsByDealers);
