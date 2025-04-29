import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Dropdown from "../../form/Dropdown/Dropdown";
import { getCityListForQuickTestDrive } from "../../../../services/location.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import DealerCard from "../../DealerCard/DealerCard";
import { getVidaCentreList } from "../../../../services/location.service";

const QuickDriveForm = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const {
    submitBookingFormData,
    userData,
    userDetails,
    nearByVidaCentreList,
    isLttr
  } = props;
  const {
    agreeTerms,
    bookingTitle,
    cityField,
    stateField,
    notificationField,
    nextBtn,
    genericConfig,
    mapIcon,
    phoneIcon
  } = props.config;
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [defaultStateValue, setDefaultStateValue] = useState("");
  const [dynamicError, setDynamicError] = useState("");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [listOfDealers, setListOfDealers] = useState();
  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const [constCityList, setConstCityList] = useState(defaultCityList);
  const defaultStateList = appUtils.getConfig("stateList");
  const [stateList, setStateList] = useState(defaultStateList);
  const [isBtnDisabled, setBtnDisabled] = useState(!isLoggedIn);
  const [cityIsDisabled, setCityIsDisabled] = useState(true);

  const cityFieldInfo = {
    name: "city",
    options: appUtils.getConfig("cityList"),
    ...cityField
  };

  const stateFieldInfo = {
    name: "state",
    options: appUtils.getConfig("stateList"),
    ...stateField
  };

  const [selectedCity, setSelectedCity] = useState("");

  const [testrideLocation, setTestrideLocation] = useState({});

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const customCheckBoxKeyPress = (event) => {
    const isEnter = event.which === 13;
    if (isEnter) {
      event.preventDefault();
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleOnSubscribeChange = () => {
    setIsSubscribed(!isSubscribed);
  };

  /* Function starts for Veriy Mobile OTP */
  const [agreeTermsSelected, setAgreeTermsSelected] = useState(true);
  const [showAgreeTermError, setShowAgreeTermError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);
  const [noDealerSelected, setNoDealerSelected] = useState(false);
  const [noDealersAvailable, setNoDealersAvailable] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState({});

  const handleDealerClick = (dealer) => {
    setSelectedDealer(dealer);
    setIsFormValid(dealer && dealer.id);
  };

  const fetchCentreList = async (userCity) => {
    setSpinnerActionDispatcher(true);
    const responseDealers = await getVidaCentreList(userCity.city);
    setSelectedCity(userCity.value);
    setSpinnerActionDispatcher(false);
  };

  useEffect(() => {
    if (isLttr) {
      const dealersList = [];
      setListOfDealers([]);
      const lttrAvailableCities = cityList.filter(
        (item) => item.state === testrideLocation.state
      );
      if (
        nearByVidaCentreList.length > 0 &&
        lttrAvailableCities.length > 0 &&
        lttrAvailableCities[0].state
      ) {
        nearByVidaCentreList.map((item) => {
          if (item.type === "Experience Center") {
            item.items.map((x) => {
              dealersList.push(
                <DealerCard
                  dealer={x}
                  mapIcon={mapIcon}
                  phoneIcon={phoneIcon}
                  handleDealerClick={(e) => handleDealerClick(x)}
                  selectedDealer={selectedDealer}
                  className={`vida-booking-details-dealers__dealer vida-booking-details-dealers__dealer${
                    selectedDealer.id === x.id ? "--active" : ""
                  }`}
                />
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
    }
  }, [nearByVidaCentreList, selectedDealer]);

  const handleFormSubmit = async (formData) => {
    if (isLoggedIn) {
      if (isLttr) {
        if (selectedDealer.id) {
          submitBookingFormData(
            testrideLocation,
            formData.subscribe,
            selectedDealer
          );
        } else {
          setNoDealerSelected(true);
        }
      } else {
        submitBookingFormData(testrideLocation, formData.subscribe);
      }
    }
  };

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForQuickTestDrive(
      defaultCountry,
      isLttr
    );
    setSpinnerActionDispatcher(true);
    if (cityListRes.length > 0 && isLoggedIn) {
      setCityList([...defaultCityList, ...cityListRes]);
      setConstCityList([...defaultCityList, ...cityListRes]);
      const lttrCities = [];
      cityListRes.forEach((item) => {
        const obj = {
          state: item.state,
          label: item.state,
          value: item.state,
          city: item.city
        };
        if (!lttrCities.some((item) => item.state === obj.state)) {
          lttrCities.push(obj);
        }
      });
      setStateList([...defaultStateList, ...lttrCities]);
    }
  };

  useEffect(() => {
    fetchCityList();
  }, []);

  useEffect(() => {
    if (userDetails.city && cityList.length > 1) {
      const userCity = cityList.find((city) => city.city === userDetails.city);

      setCityIsDisabled(false);
      if (userCity) {
        const userCities = cityList.filter(
          (city) => city.state === userCity.state
        );
        setCityList([...defaultCityList, ...userCities]);
        setDefaultCityValue(userCity.value);
        setDefaultStateValue(userCity.state);
        setTestrideLocation({
          city: userCity.city,
          state: userCity.state,
          country: defaultCountry
        });
      } else {
        if (!defaultStateValue) {
          setCityIsDisabled(true);
        }
      }
    } else if (cityList.length === 2) {
      setCityIsDisabled(false);
      setDefaultCityValue(cityList[1].value);
      setDefaultStateValue(cityList[1].state);
      setTestrideLocation({
        city: cityList[1].city,
        state: cityList[1].state,
        country: defaultCountry
      });
    }
  }, [userDetails.city]);

  const toggleTermsCheck = (event) => {
    setAgreeTermsSelected(event.target.checked);
    setIsFormValid(event.target.checked);
    setShowAgreeTermError(!event.target.checked);
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const content = document.getElementById(agreeTerms.id);
    setTermsContent(content.innerHTML);
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setAgreeTermsSelected(true);
    setShowAgreeTermError(false);
    setIsFormValid(true);
    closeTermsPopup();
  };

  useEffect(() => {
    userDetails.firstname && setValue("fname", userDetails.firstname);
    userDetails.lastname && setValue("lname", userDetails.lastname);
    userDetails.email && setValue("email", userDetails.email);
    userDetails.countrycode && setValue("code", userDetails.countrycode);
    userDetails.mobilenumber &&
      setValue("phoneNumber", userDetails.mobilenumber);
  }, [userDetails]);

  const handleDropdownChange = async (name, value) => {
    setListOfDealers(null);
    setNoDealersAvailable(false);
    if (value !== "" && name == "city") {
      const userCity = cityList.find((city) => city.value === value);
      setSelectedCity(userCity.city);
      setTestrideLocation({
        city: userCity.city,
        state: userCity.state,
        country: defaultCountry
      });
      fetchCentreList(userCity);
    } else if (name == "state") {
      if (value === "") {
        setCityList([...defaultCityList]);
        setValue("city", "");
        setSelectedCity("");
        setDefaultCityValue("");
        setCityIsDisabled(true);
        setDynamicError(genericConfig.cityStateSelection);
      } else {
        const userCities = constCityList.filter((city) => city.state === value);
        setCityList([...defaultCityList, ...userCities]);
        if (userCities.length == 1) {
          setDefaultCityValue(userCities[0].value);
          setValue("city", userCities[0].value);
          setCityIsDisabled(false);
          setSelectedCity(userCities[0].value);
          setDynamicError(null);
          setListOfDealers([]);
          fetchCentreList(userCities[0]);
          setTestrideLocation({
            city: userCities[0].city,
            state: userCities[0].state,
            country: defaultCountry
          });
        } else {
          setDefaultCityValue(defaultCityList[0].value);
          setValue("city", defaultCityList[0].value);
          setCityIsDisabled(false);
          setSelectedCity(defaultCityList[0].value);
          setDynamicError(null);
          setListOfDealers(null);
        }
      }
    }
  };

  useEffect(() => {
    if (userData.city) {
      fetchCentreList(userData);
    }
  }, [userData.city]);
  return (
    <>
      <h1 className="vida-quick-drive-form__title">{bookingTitle}</h1>
      <form
        className="form vida-quick-drive-form"
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <Dropdown
          name={stateFieldInfo.name}
          label={stateFieldInfo.label}
          options={stateList}
          value={defaultStateValue || ""}
          setValue={setValue}
          onChangeHandler={handleDropdownChange}
          errors={errors}
          validationRules={stateFieldInfo.validationRules}
          clearErrors={clearErrors}
          register={register}
          isSortAsc={true}
        />
        <Dropdown
          name={cityFieldInfo.name}
          label={cityFieldInfo.label}
          options={cityList}
          value={defaultCityValue || ""}
          setValue={setValue}
          onChangeHandler={handleDropdownChange}
          errors={errors}
          validationRules={cityFieldInfo.validationRules}
          clearErrors={clearErrors}
          register={register}
          isDisabled={cityIsDisabled}
          isSortAsc={true}
        />
        {!testrideLocation.state && !testrideLocation.city && (
          <p className="form__field-label">
            Test Ride is currently not available in {userData.state} and{" "}
            {userData.city}. Please select different state and city
          </p>
        )}
        {isLoggedIn && isLttr && (
          <div className="test-ride-dealers-container">
            <div className="vida-booking-details-dealers__listofdealers">
              {listOfDealers &&
                listOfDealers.length > 0 &&
                listOfDealers.map((dealer) => {
                  return dealer;
                })}
            </div>
            {(!listOfDealers?.length || noDealerSelected) && !dynamicError && (
              <div className="dealer-error-container">
                {listOfDealers?.length === 0 && !noDealersAvailable && (
                  <p>{genericConfig.dealersLoadingMsg}</p>
                )}
                {!listOfDealers?.length && noDealersAvailable && (
                  <p className="vida-booking-details-dealers__errors">
                    {genericConfig.noDealerAvailableError}
                  </p>
                )}

                {noDealerSelected && (
                  <p className="vida-booking-details-dealers__errors">
                    {genericConfig.nonDealerSelectedError}
                  </p>
                )}
              </div>
            )}
            {(!listOfDealers?.length || noDealerSelected) && dynamicError && (
              <div className="dealer-error-container">
                <p className="vida-booking-details-dealers__errors">
                  {dynamicError}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="form__group form__field-checkbox">
          <label className="form__field-label">
            {notificationField.label}
            <i className="icon-whatsapp"></i>
            <input
              tabIndex="0"
              type="checkbox"
              checked={isSubscribed}
              {...register("subscribe", {
                onChange: () => handleOnSubscribeChange()
              })}
            ></input>
            <span
              tabIndex="0"
              className="form__field-checkbox-mark"
              role="checkbox"
              aria-checked="false"
              onKeyPress={(e) => customCheckBoxKeyPress(e)}
            ></span>
          </label>
        </div>
        <div className="vida-quick-drive-form__notification-msg">
          {notificationField.message}
        </div>

        <div className="form__group form__field-checkbox vida-quick-drive-form__terms">
          <label className="vida-quick-drive-form__label vida-quick-drive-form__terms-label">
            {agreeTerms.agreeLabel}{" "}
            <input
              type="checkbox"
              name="agreeTerms"
              htmlFor="terms"
              checked={agreeTermsSelected}
              onChange={(event) => toggleTermsCheck(event)}
            ></input>
            <span className="form__field-checkbox-mark"></span>
          </label>
          <a
            href="#"
            rel="noreferrer noopener"
            onClick={(event) => handleTermsandConditions(event)}
          >
            {agreeTerms.terms.label}
          </a>
        </div>
        {showAgreeTermError && (
          <div className={`${showAgreeTermError ? "form__group--error" : ""}`}>
            <p className="form__field-message">
              {agreeTerms.validationRules.required.message}
            </p>
          </div>
        )}

        {!isBtnDisabled && (
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {nextBtn.label}
          </button>
        )}
      </form>

      {showTermsPopup && (
        <div className="vida-terms-conditions">
          <div className="vida-terms-conditions__container">
            <div className="vida-terms-conditions__body">
              <div className="vida-terms-conditions__body-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent
                  }}
                ></div>
              </div>
            </div>
            <div className="vida-terms-conditions__btn-wrap">
              <button
                className="btn btn--primary"
                role="button"
                onClick={() => handleAgreeTerms()}
              >
                {agreeTerms.btnLabel.agree}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {agreeTerms.btnLabel.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ userProfileDataReducer, testDriveReducer }) => {
  return {
    userData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      pincode: userProfileDataReducer.pincode,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    nearByVidaCentreList: testDriveReducer.nearByVidaCentreList
  };
};

QuickDriveForm.propTypes = {
  submitBookingFormData: PropTypes.func,
  userDetails: PropTypes.object,
  config: PropTypes.shape({
    agreeTerms: PropTypes.shape({
      agreeLabel: PropTypes.string,
      btnLabel: PropTypes.shape({
        agree: PropTypes.string,
        close: PropTypes.string
      }),
      id: PropTypes.string,
      terms: PropTypes.shape({
        actionUrl: PropTypes.string,
        label: PropTypes.string
      }),
      validationRules: PropTypes.shape({
        required: PropTypes.shape({
          message: PropTypes.string
        })
      })
    }),
    bookingTitle: PropTypes.string,
    cityField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    notificationField: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
    genericConfig: PropTypes.object,
    mapIcon: PropTypes.string,
    phoneIcon: PropTypes.string,
    nextBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    getNotifiedBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    otpConfig: PropTypes.object,
    genericConfig: PropTypes.object,
    mapIcon: PropTypes.string,
    phoneIcon: PropTypes.string
  }),
  userData: PropTypes.object,
  nearByVidaCentreList: PropTypes.array,
  customerExists: PropTypes.bool,
  isLttr: PropTypes.bool
};

QuickDriveForm.defaultProps = {
  config: {},
  userDetails: {},
  sfid: "",
  customerExists: false,
  isLttr: false
};

export default connect(mapStateToProps)(QuickDriveForm);
