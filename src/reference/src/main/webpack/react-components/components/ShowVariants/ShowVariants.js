import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import Popup from "../Popup/Popup";
import Logger from "../../../services/logger.service";
import { useGetAllProducts } from "../../hooks/preBooking/preBookingHooks";
import { getProductPricesData } from "../../services/productDetails/productDetailsService";
import appUtils from "../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { getCityListForQuickReserve } from "../../../services/location.service";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { useChangeVariant } from "../../hooks/preBooking/preBookingHooks";

const ShowVariants = (props) => {
  const {
    scooterInfo,
    setIsOpenConfigurePopup,
    userProfileData,
    selectedScooterData,
    isopenConfigurePopup,
    productDataDetails,
    orderId
  } = props;

  const defaultCityList = appUtils.getConfig("cityList");
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [scooterData, setScooterData] = useState(null);
  const [defaultCityValue, setDefaultCityValue] = useState("");
  const [handleVariantCalled, setHandleVariantCalled] = useState();
  const [isUpdatedCityState, setUpdatedCityState] = useState("");

  const [activeScooterModel, setActiveScooterModel] = useState("");
  const [activeVariant, setActiveVariant] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [isUserDataAvailable, setUserDataAvailable] = useState(false);
  const [cityList, setCityList] = useState(defaultCityList);
  const isLoggedIn = loginUtils.isSessionActive();
  const getAllProductData = useGetAllProducts();
  const changeVariant = useChangeVariant();
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
                scooterInfo.splitterChar +
                userProfileData.state +
                scooterInfo.splitterChar +
                userProfileData.country;
            }
            if (selectedCityStateId) {
              cityStateId = selectedCityStateId;
            }
            allProductsData.data.products.items.map((model) => {
              model.variants.map((variant) => {
                priceList.map((item) => {
                  if (
                    item?.city_state_id?.toLowerCase() ===
                      cityStateId?.toLowerCase() &&
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
        } else {
          if (selectedCityStateId) {
            cityStateId = selectedCityStateId;
          } else {
            cityStateId = scooterInfo.defaultCityState;
          }
        }
        allProductsData.data.products.items.map((model) => {
          model.variants.map((variant) => {
            priceList.map((item) => {
              if (
                item?.city_state_id?.toLowerCase() ===
                  cityStateId?.toLowerCase() &&
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
        const selectedItemIndex = scooterData?.products?.items?.findIndex(
          (item) => item.sku === productDataDetails.sku
        );
        setActiveScooterModel(
          allProductsData.data.products.items[selectedItemIndex]
        );
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleActiveScooter = (productData) => {
    setActiveScooterModel(productData);
  };

  const handleChangeVariant = async (e) => {
    e.preventDefault();
    setSpinnerActionDispatcher(true);
    const changeVariantResult = await changeVariant({
      variables: {
        sf_order_id: orderId,
        sf_item_id: activeScooterModel?.sf_id,
        sf_itemsku_id:
          activeScooterModel.variants[activeVariant]?.product?.sf_id
      }
    });
    if (
      changeVariantResult.data &&
      changeVariantResult.data.changeProductVariant &&
      changeVariantResult.data.changeProductVariant.status === "200"
    ) {
      setIsOpenConfigurePopup(false);
      location.reload();
    }
  };

  useEffect(() => {
    getProductPriceList();
  }, []);
  useEffect(() => {
    const selectedItemIndex = scooterData?.products?.items?.findIndex(
      (item) => item.sku === productDataDetails.sku
    );
    setActiveScooterModel(scooterData?.products?.items[selectedItemIndex]);
    setActiveVariant(
      scooterData?.products?.items[selectedItemIndex]?.variants.findIndex(
        (data) => data.product.sku === productDataDetails.variantSku
      )
    );
    if (selectedItemIndex) {
      const sortedScooterData = scooterData;
      sortedScooterData?.products?.items.unshift(
        sortedScooterData?.products?.items.splice(selectedItemIndex, 1)[0]
      );
      setScooterData(sortedScooterData);
    }
  }, [scooterData, productDataDetails]);
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
  return (
    isopenConfigurePopup && (
      <div className="vida-pricing-new vida-pricing-new__select-variant">
        <Popup
          mode="large"
          handlePopupClose={() => {
            setIsOpenConfigurePopup(false);
          }}
        >
          <div className="vida-pricing-new__select-variant-container">
            <h2>{scooterInfo.title}</h2>
            <div className="vida-select-variant">
              <div className="vida-select-variant__container">
                <div className="vida-select-variant__scooter-info">
                  {scooterData?.products?.items
                    ?.sort((variantX, variantY) =>
                      variantX?.name?.toLowerCase() >
                      variantY?.name?.toLowerCase()
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
                          product.sku == activeScooterModel.sku ? true : false
                        }
                        defaultSelection={0}
                        selectedScooterData={isLoggedIn && selectedScooterData}
                        handleVariantCalled={handleVariantCalled}
                        setHandleVariantCalled={setHandleVariantCalled}
                        activeVariantParent={activeVariant}
                        setActiveVariantParent={setActiveVariant}
                        handleChangeVariant={handleChangeVariant}
                      ></ScooterInfo>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    )
  );
};

ShowVariants.propTypes = {};

const mapStateToProps = ({
  scooterInfoReducer,
  userProfileDataReducer,
  purchaseConfigReducer
}) => {
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
    },
    productDataDetails: purchaseConfigReducer.productData
  };
};
ShowVariants.propTypes = {
  scooterInfo: PropTypes.object,
  selectedScooterData: PropTypes.object,
  userProfileData: PropTypes.object,
  setIsOpenConfigurePopup: PropTypes.func,
  isopenConfigurePopup: PropTypes.bool,
  productDataDetails: PropTypes.object,
  orderId: PropTypes.string
};

ShowVariants.defaultProps = {
  scooterInfo: {}
};
export default connect(mapStateToProps)(ShowVariants);
