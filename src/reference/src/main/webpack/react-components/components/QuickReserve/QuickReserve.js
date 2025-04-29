import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import QuickReserveForm from "./QuickReserveForm/QuickReserveForm";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import { useGetAllProducts } from "../../hooks/preBooking/preBookingHooks";
import { getProductPricesData } from "../../services/productDetails/productDetailsService";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { getCityListForQuickReserve } from "../../../services/location.service";
import { useQuickReservePayment } from "../../hooks/quickReserve/quickReserveHooks";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const QuickReserve = (props) => {
  const { config, selectedScooterData, userProfileData } = props;
  const defaultCityList = appUtils.getConfig("cityList");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [cityList, setCityList] = useState(defaultCityList);
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [activeVariant, setActiveVariant] = useState(0);
  const [handleVariantCalled, setHandleVariantCalled] = useState();
  const { scooterInfo } = config;

  const isLoggedIn = loginUtils.isSessionActive();
  const [scooterData, setScooterData] = useState(null);
  const [isActiveScooterModel, setActiveScooterModel] = useState(
    scooterData?.products?.items[0]?.sku || ""
  );
  const [priceList, setPriceList] = useState([]);
  const [isUserDataAvailable, setUserDataAvailable] = useState(false);
  const [isUpdatedCityState, setUpdatedCityState] = useState("");

  const getAllProductData = useGetAllProducts();

  const getProductPriceList = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  const getAllProductsData = async (selectedCityStateId) => {
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
        let cityStateId = "";
        if (isLoggedIn) {
          let isPriceNotAvailable = false;
          if (
            isUserDataAvailable &&
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
                config.scooterInfo.splitterChar +
                userProfileData.state +
                config.scooterInfo.splitterChar +
                userProfileData.country;
            }
            if (selectedCityStateId) {
              cityStateId = selectedCityStateId;
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
              cityStateId = config.scooterInfo.defaultCityState;
            }
          } else {
            cityStateId = config.scooterInfo.defaultCityState;
          }
        } else {
          if (selectedCityStateId) {
            cityStateId = selectedCityStateId;
          } else {
            cityStateId = config.scooterInfo.defaultCityState;
          }
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
                  cityStateId &&
                  cityStateId.split(config.scooterInfo.splitterChar)[0];
              }
            });
          });
        });
        setScooterData(allProductsData.data);
        setActiveScooterModel(allProductsData.data.products.items[0].sku);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleActiveScooter = (productData) => {
    setActiveScooterModel(productData.sku);
  };

  useEffect(() => {
    getProductPriceList();
  }, []);

  useEffect(() => {
    if (priceList.length > 0) {
      if (isLoggedIn && isUserDataAvailable) {
        getAllProductsData();
      } else {
        getAllProductsData();
      }
    }
  }, [priceList, isUserDataAvailable]);

  useEffect(() => {
    if (
      userProfileData.fname ||
      (userProfileData.city && userProfileData.state && userProfileData.country)
    ) {
      setUserDataAvailable(true);
    }
  }, [userProfileData]);

  const fetchCityList = async () => {
    setSpinnerActionDispatcher(true);
    const cityListRes = await getCityListForQuickReserve(defaultCountry);
    if (cityListRes.length > 0) {
      setCityList(
        cityListRes.length > 1
          ? [...defaultCityList, ...cityListRes]
          : cityListRes
      );
    }
  };
  useEffect(() => {
    fetchCityList();
  }, []);

  useEffect(() => {
    if (
      userProfileData.city &&
      userProfileData.city.length > 0 &&
      cityList.length > 1
    ) {
      const userCity = cityList.find(
        (city) => city.city === userProfileData.city
      );
      userCity && setDefaultCityValue(userCity.value);
    }
  }, [userProfileData.city, cityList.length]);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const payForQuickReserve = useQuickReservePayment();
  const handleFormSubmit = async (formData, event) => {
    setSpinnerActionDispatcher(true);
    const selectedCity = cityList.find((city) => city.value === formData.city);
    const data = {
      firstname: formData.fname,
      lastname: formData.lname,
      email: formData.email,
      mobile: formData.phoneNumber,
      city: selectedCity.city,
      state: selectedCity.state,
      pincode: "",
      skuId: selectedScooterData.selectedVariant.product.sf_id,
      itemId: selectedScooterData.sf_id
    };
    // const encryptedData = RSAUtils.encrypt(data);
    const quickReservePaymentRes = await payForQuickReserve({
      variables: {
        input: data
      }
    });
    if (quickReservePaymentRes?.data?.quickReserve?.payment_url) {
      if (isAnalyticsEnabled) {
        const location = {
          state: selectedCity.state,
          city: selectedCity.city,
          pinCode: "",
          country: defaultCountry
        };
        const startingPrice = selectedScooterData.selectedVariant.product.price;
        const productDetails = {
          modelVariant: selectedScooterData.name,
          modelColor: selectedScooterData.selectedVariant.attributes[0].label,
          productID: selectedScooterData.selectedVariant.product.sf_id,
          startingPrice: parseFloat(startingPrice.replace(/[₹\,]/g, ""))
        };
        const customLink = {
          name: event.nativeEvent.submitter.innerText,
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };
        analyticsUtils.trackQuickReserveInit(
          location,
          productDetails,
          customLink,
          function () {
            window.location.href =
              quickReservePaymentRes.data.quickReserve.payment_url;
          }
        );
      } else {
        window.location.href =
          quickReservePaymentRes.data.quickReserve.payment_url;
      }
    }
  };

  const handleCityDropdownChange = (name, value) => {
    if (value !== "") {
      const userCity = cityList.find((city) => city.value === value);
      const selectedCityStateId = (
        userCity.city +
        config.scooterInfo.splitterChar +
        userCity.state +
        config.scooterInfo.splitterChar +
        ((userProfileData && userProfileData.country) || defaultCountry)
      ).toUpperCase();
      getAllProductsData(selectedCityStateId);
    }
  };

  return (
    <div className="vida-container">
      <div className="vida-quick-reserve">
        <div className="vida-quick-reserve__container">
          <div className="vida-quick-reserve__scooter-info">
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
                  activeScooterHandler={handleActiveScooter}
                  key={index}
                  isActiveScooterModel={
                    product.sku == isActiveScooterModel ? true : false
                  }
                  defaultSelection={0}
                  selectedScooterData={isLoggedIn && selectedScooterData}
                  handleVariantCalled={handleVariantCalled}
                  setHandleVariantCalled={setHandleVariantCalled}
                  activeVariantParent={activeVariant}
                  setActiveVariantParent={setActiveVariant}
                ></ScooterInfo>
              ))}
          </div>
          <div className="vida-quick-reserve__quick-form">
            <QuickReserveForm
              config={config}
              cityList={cityList}
              userData={userProfileData}
              defaultCityValue={defaultCityValue}
              handleCityDropdownChange={handleCityDropdownChange}
              handleFormSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ scooterInfoReducer, userProfileDataReducer }) => {
  return {
    selectedScooterData: {
      name: scooterInfoReducer.name,
      sku: scooterInfoReducer.sku,
      sf_id: scooterInfoReducer.sf_id,
      variants: scooterInfoReducer.variants,
      selectedVariant: scooterInfoReducer.selectedVariant
    },
    userProfileData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      email: userProfileDataReducer.email,
      number: userProfileDataReducer.number,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    }
  };
};

QuickReserve.propTypes = {
  config: PropTypes.object,
  selectedScooterData: PropTypes.object,
  userProfileData: PropTypes.object
};

QuickReserve.defaultProps = {
  config: {}
};
export default connect(mapStateToProps)(QuickReserve);
