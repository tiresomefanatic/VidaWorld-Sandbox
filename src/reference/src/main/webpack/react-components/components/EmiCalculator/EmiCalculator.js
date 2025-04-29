import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ScooterInfo from "../EmiScooterInfo/EmiScooterInfo";
import appUtils from "../../../site/scripts/utils/appUtils";
import { getCityListForDealers } from "../../../services/location.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useGetLoanDetails } from "../../hooks/emiCalculator/emiCalculatorHooks";
import { useGetAllProducts } from "../../../react-components/hooks/preBooking/preBookingHooks";
import Dropdown from "../form/Dropdown/Dropdown";
import { useForm } from "react-hook-form";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { getProductPricesData } from "../../services/productDetails/productDetailsService";
import Popup from "../Popup/Popup";
import PropTypes from "prop-types";
import Logger from "../../../services/logger.service";
import loginUtils from "../../../site/scripts/utils/loginUtils";

const EmiCalculator = (props) => {
  const {
    config: { genericConfig, cityField, scooterInfo },
    userProfileData = {}
  } = props;
  const loginUrl = appUtils.getPageUrl("loginUrl");
  const [scooterData, setScooterData] = useState(null);
  const [variantSelection, setVariantSelection] = useState(0);
  const [isActiveScooterModel, setActiveScooterModel] = useState();
  const [city, setCity] = useState();
  const getAllProductData = useGetAllProducts();
  const getLoanDetails = useGetLoanDetails();
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCityList = appUtils.getConfig("cityList");
  const [cityList, setCityList] = useState(defaultCityList);
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [loanDetailsLink, setLoanDetailsLink] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [priceList, setPriceList] = useState([]);
  const isLoggedIn = loginUtils.isSessionActive();
  const [isUserLoggedIn, setUserLoggedIn] = useState(isLoggedIn);
  const [isUpdatedCityState, setUpdatedCityState] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });
      if (allProductsData) {
        allProductsData.data.products.items =
          allProductsData.data.products.items.filter(function (item) {
            return item.variants.length > 0;
          });

        let cityStateId = scooterInfo.defaultCityState;

        if (isUserLoggedIn) {
          let isPriceNotAvailable = false;
          if (
            userProfileData.city &&
            userProfileData.state &&
            userProfileData.country
          ) {
            if (isUpdatedCityState !== "") {
              cityStateId = isUpdatedCityState;
              setUpdatedCityState("");
            } else {
              cityStateId =
                userProfileData.city +
                scooterInfo.splitterChar +
                userProfileData.state +
                scooterInfo.splitterChar +
                userProfileData.country;
            }

            allProductsData.data.products.items.map((model) => {
              model.variants.map((variant) => {
                priceList.map((item) => {
                  if (
                    item.city_state_id.toLowerCase() ===
                      cityStateId.toLowerCase() &&
                    item.variant_sku === variant.product.sku
                  ) {
                    isPriceNotAvailable = true;
                  }
                });
              });
            });

            if (!isPriceNotAvailable) {
              cityStateId = scooterInfo.defaultCityState;
            }
          } else {
            cityStateId = scooterInfo.defaultCityState;
          }
        } else if (isUpdatedCityState !== "") {
          cityStateId = isUpdatedCityState;
          setUpdatedCityState("");
        } else {
          cityStateId = scooterInfo.defaultCityState;
        }

        allProductsData.data.products.items.map((model) => {
          model.variants.map((variant) => {
            priceList.map((item) => {
              if (
                item.city_state_id.toLowerCase() ===
                  cityStateId.toLowerCase() &&
                item.variant_sku === variant.product.sku
              ) {
                variant.product["price"] = currencyUtils.getCurrencyFormatValue(
                  item?.effectivePrice
                );
                variant.product["city"] =
                  cityStateId && cityStateId.split(scooterInfo.splitterChar)[0];
              }
            });
          });
        });

        setScooterData(allProductsData.data);
        setVariantSelection(
          allProductsData.data?.products.items[0].variants[0].product.sf_id
        );
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };
  const updateOverridePrice = (city, state, country) => {
    setUpdatedCityState(
      city +
        scooterInfo.splitterChar +
        state +
        scooterInfo.splitterChar +
        country
    );
  };

  const handleActiveScooter = (productData) => {
    setActiveScooterModel(productData.sku);
  };

  const handleFormSubmit = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const loanDetails = await getLoanDetails({
        variables: {
          city: city,
          sf_itemsku_id: variantSelection,
          application_type: "LOAN"
        }
      });

      if (loanDetails.data.getEmiCalculators.status == 200) {
        setLoanDetailsLink(loanDetails.data.getEmiCalculators.application_link);
        setShowPopup(true);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };
  const handleDropdownChange = (name, value) => {
    const userCity = cityList.find((city) => city.value === value);
    updateOverridePrice(userCity.city, userCity.state, "INDIA");

    setCity(userCity.city);
    setDefaultCityValue(userCity.value);
  };

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForDealers(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList([...defaultCityList, ...cityListRes]);
    }
  };

  useEffect(() => {
    const userCity = cityList.find(
      (city) => city.city === userProfileData.city
    );
    if (userCity) {
      setDefaultCityValue(userCity.value);
      setCity(userCity.city);
    }
  }, [userProfileData.city]);

  useEffect(() => {
    if (isUpdatedCityState !== "") {
      getAllProductsData();
    }
  }, [isUpdatedCityState]);

  useEffect(() => {
    getProductPriceList();
  }, []);

  useEffect(() => {
    getAllProductsData();
    fetchCityList();
  }, [priceList, userProfileData.city]);

  return (
    <div className="vida-container">
      <div className="vida-pre-booking">
        <div className="vida-pre-booking__container vida-emi-calculator">
          <div className="vida-pre-booking__scooter-info">
            {scooterData?.products?.items
              ?.sort((variantX, variantY) =>
                variantX?.name?.toLowerCase() > variantY?.name?.toLowerCase()
                  ? 1
                  : -1
              )
              ?.map((product, index) => (
                <ScooterInfo
                  scooterInfoConfig={scooterInfo}
                  isImgLeftLayout={true}
                  productData={product}
                  key={index}
                  setVariantSelection={setVariantSelection}
                  activeScooterHandler={handleActiveScooter}
                  isActiveScooterModel={
                    isActiveScooterModel
                      ? product.sku == isActiveScooterModel
                        ? true
                        : false
                      : index == 0
                      ? true
                      : false
                  }
                ></ScooterInfo>
              ))}
            <p className="vida-emi-calculator--disclaimer">
              {genericConfig.disclaimer}
            </p>
          </div>
          <div className="vida-pre-booking__booking-details">
            <div className="vida-pre-booking__booking-details--fixed-container">
              <form onSubmit={handleSubmit(() => handleFormSubmit())}>
                <Dropdown
                  name={cityField.name}
                  label={cityField.label}
                  iconClass={`icon-location-marker`}
                  onChangeHandler={handleDropdownChange}
                  options={cityList}
                  value={defaultCityValue || ""}
                  setValue={setValue}
                  errors={errors}
                  validationRules={cityField.validationRules}
                  clearErrors={clearErrors}
                  register={register}
                  isDisabled={false}
                  isSortAsc={true}
                />
                <div className="vida-booking-details-dealers__btn-container">
                  <button
                    type="submit"
                    // onClick={handleFormSubmit}
                    className="btn btn--primary full-width"
                  >
                    {genericConfig.submitBtn}
                  </button>
                  <p className="vida-emi-calculator--disclaimer2">
                    {genericConfig.disclaimer2}{" "}
                    <a href={loginUrl}>{genericConfig.disclaimer2Btn}</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
          {showPopup && (
            <div className="vida-payment-new__payment-frame">
              <Popup handlePopupClose={() => setShowPopup(false)}>
                <div className="vida-payment-new__frame-container">
                  <iframe src={loanDetailsLink} allow="camera *;"></iframe>
                </div>
              </Popup>
            </div>
          )}
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

const mapDispatchToProps = (dispatch) => {
  return {
    setPreBookingUserInfo: (data) => {
      dispatch(setPreBookingUserDataAction(data));
    }
  };
};

EmiCalculator.propTypes = {
  config: PropTypes.object,
  userProfileData: PropTypes.object
};

EmiCalculator.defaultProps = {
  config: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(EmiCalculator);
