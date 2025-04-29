import React, { useState, useEffect } from "react";

import ScooterInfo from "../ScooterInfo/ScooterInfo";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useGetAllProducts } from "../../hooks/preBooking/preBookingHooks";

import currencyUtils from "../../../site/scripts/utils/currencyUtils";

import PropTypes from "prop-types";
import Logger from "../../../services/logger.service";

const ScooterVariants = (props) => {
  const {
    config: { genericConfig, scooterInfo },
    userProfileData = {}
  } = props;

  const [scooterData, setScooterData] = useState(null);
  const [isActiveScooterModel, setActiveScooterModel] = useState();
  const [variantSelection, setVariantSelection] = useState(0);
  const getAllProductData = useGetAllProducts();

  const [priceList, setPriceList] = useState([]);

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

        let cityStateId = scooterInfo?.defaultCityState;

        // if (isUserLoggedIn) {
        //   let isPriceNotAvailable = false;
        //   if (
        //     userProfileData.city &&
        //     userProfileData.state &&
        //     userProfileData.country
        //   ) {
        //     if (isUpdatedCityState !== "") {
        //       cityStateId = isUpdatedCityState;
        //       setUpdatedCityState("");
        //     } else {
        //       cityStateId =
        //         userProfileData.city +
        //         scooterInfo.splitterChar +
        //         userProfileData.state +
        //         scooterInfo.splitterChar +
        //         userProfileData.country;
        //     }

        //     allProductsData.data.products.items.map((model) => {
        //       model.variants.map((variant) => {
        //         priceList.map((item) => {
        //           if (
        //             item.city_state_id.toLowerCase() ===
        //               cityStateId.toLowerCase() &&
        //             item.variant_sku === variant.product.sku
        //           ) {
        //             isPriceNotAvailable = true;
        //           }
        //         });
        //       });
        //     });

        //     if (!isPriceNotAvailable) {
        //       cityStateId = scooterInfo.defaultCityState;
        //     }
        //   } else {
        //     cityStateId = scooterInfo.defaultCityState;
        //   }
        // } else if (isUpdatedCityState !== "") {
        //   cityStateId = isUpdatedCityState;
        //   setUpdatedCityState("");
        // } else {
        cityStateId = scooterInfo?.defaultCityState;
        // }

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

  const handleActiveScooter = (productData) => {
    setActiveScooterModel(productData.sku);
  };

  useEffect(() => {
    getAllProductsData();
  }, []);

  return (
    <div className="vida-container">
      <div className="vida-pre-booking">
        <div className="vida-pre-booking__container vida-scooter-variants">
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
                  isSimpleLayout={true}
                  setActiveVariantParent={() => false}
                ></ScooterInfo>
              ))}
            <p className="vida-scooter-variants--disclaimer">
              {genericConfig.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ScooterVariants.propTypes = {
  config: PropTypes.object,
  userProfileData: PropTypes.object
};

ScooterVariants.defaultProps = {
  config: {}
};

export default ScooterVariants;
