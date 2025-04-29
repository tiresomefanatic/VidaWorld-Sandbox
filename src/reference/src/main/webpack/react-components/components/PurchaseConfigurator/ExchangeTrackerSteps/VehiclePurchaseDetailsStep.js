import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getMasterBrandList } from "../../../services/exchangeTracker/exchangeTrackerService";
import Dropdown from "../../form/Dropdown/Dropdown";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Location from "../../../../site/scripts/location";
import { setTradeInDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const getLastYears = (limit) => {
  const date = new Date();
  const year = date.getFullYear();
  const yearsList = new Array(Number(limit)).fill(year).map((item, idx) => ({
    label: String(item - idx),
    value: String(item - idx)
  }));

  return yearsList;
};
const MonthsList = () => {
  const MonthsList = new Array(12).fill(1).map((item, idx) => ({
    label: String(item + idx),
    value: String(item + idx)
  }));
  return MonthsList;
};

const splitDate = (date, type) => {
  const [month, year] = date ? date.split("/") : [];
  return type ? month : year;
};
function VehiclePurchaseDetailsStep({
  vehiclePurchaseDetails,
  cmpProps,
  actionBtns,
  handleStep,
  setPurchaseMonth,
  setPurchaseYear,
  handleNotInterset,
  tradeInSelected
}) {
  const {
    stepTitle,
    title,
    vehicleMakeField,
    vehicleModelField,
    vehicleTypeField,
    ccField,
    purchaseMonthField,
    purchaseYearField,
    stateField,
    cityField
  } = vehiclePurchaseDetails;
  const {
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_cc,
    purchase_date,
    purchase_city,
    purchase_state
  } = cmpProps;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [brandList, setBrandList] = useState({
    options: [],
    value: ""
  });
  const [modelList, setModelList] = useState({
    options: [],
    value: "",
    isDisabled: true
  });
  const [typeList, setTypeList] = useState({
    options: [],
    value: "",
    isDisabled: true
  });

  const [ccFieldData, setCCFieldData] = useState({
    options: [],
    value: "",
    isDisabled: true
  });
  const [purchaseYearFieldData, setYearFieldData] = useState({
    options: purchaseYearField.limit
      ? [...purchaseYearField.options, ...getLastYears(purchaseYearField.limit)]
      : purchaseYearField.options,
    value: purchase_date ? splitDate(purchase_date, false) : ""
  });
  const [purchaseMonthFieldData, setMonthFieldData] = useState({
    options:
      [...purchaseMonthField.options, ...MonthsList()] ||
      purchaseMonthField.options,
    value: purchase_date ? splitDate(purchase_date, true) : ""
  });

  const [masterBrandList, setMasterBrandList] = useState([]);
  const [locationObj, setLocationObj] = useState(null);
  useEffect(() => {
    vehicle_make && setValue(vehicleMakeField.name, vehicle_make);
    vehicle_model && setValue(vehicleModelField.name, vehicle_model);
    vehicle_type && setValue(vehicleTypeField.name, vehicle_type);
    vehicle_type && setValue(ccField.name, vehicle_cc);
    if (purchase_date) {
      setValue(purchaseMonthField.name, splitDate(purchase_date, true));
      setValue(purchaseYearField.name, splitDate(purchase_date, false));
    }

    purchase_city && setValue(cityField.name, purchase_city);
    purchase_state && setValue(stateField.name, purchase_state);
    const additionalPageName = `:${title}`;
    analyticsUtils.trackExchangePageLoad(additionalPageName);
  }, []);
  const setVehicleDropdowns = (exchangeListData) => {
    setMasterBrandList(exchangeListData);
    const list = exchangeListData.map((item) => item);

    list.unshift({
      label: "Select Brand",
      value: ""
    });

    const cloneBrand = {
      ...brandList,
      options: list,
      value: vehicle_make !== "" ? vehicle_make : ""
    };
    setBrandList(cloneBrand);
    if (vehicle_make !== "" && vehicle_type !== "") {
      const cloneType = exchangeListData.find(
        (item) => item.value === vehicle_make
      );

      // const typeOptions = {}
      const cloneTypeList = {
        ...typeList,
        isDisabled: false,
        options: cloneType.brand_category,
        value: vehicle_type
      };
      setTypeList(cloneTypeList);
      const cloneList = cloneTypeList.options.find(
        (item) => item.value === vehicle_type
      );

      // const typeOptions = {}
      const cloneModel = {
        ...modelList,
        isDisabled: false,
        options: cloneList.brand_model.map((item) => ({
          label: item.label,
          value: item.label
        })),
        value: vehicle_model
      };
      const cloneCCOptions = cloneList.cc.map((item) => ({
        label: item.value,
        value: item.value
      }));
      const cloneCC = {
        ...ccFieldData,
        isDisabled: false,
        options: cloneCCOptions,
        value: vehicle_cc
      };
      cloneModel.options.unshift({
        label: "Select Model",
        value: ""
      });
      cloneCC.options.unshift({
        label: "Select CC",
        value: ""
      });
      setModelList(cloneModel);
      setCCFieldData(cloneCC);
    }
  };
  const getExchangeData = async () => {
    const exchangeListData = await getMasterBrandList();
    if (exchangeListData) {
      setVehicleDropdowns(exchangeListData);
    }
  };

  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: purchase_city || ""
  });

  const cityFieldInfo = {
    options: appUtils.getConfig("cityList")
  };
  const stateFieldInfo = {
    options: appUtils.getConfig("stateList")
  };
  const resetCityField = () => {
    setValue(cityField.name, "");
    setCityFieldData({
      options: [],
      value: "",
      isDisabled: true
    });
  };
  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: cmpProps.state || ""
  });

  const getStateList = async (countryId) => {
    /* Instantiate Location to render the Country, State and City */
    const obj = new Location();
    setLocationObj(obj);

    /* Fetch States based on Country ID */
    const stateList = await obj.getStates(countryId);
    const stateObj = stateList.find((o) => o.value === cmpProps.state);

    setStateFieldData({
      options: stateList
        ? [...stateFieldInfo.options, ...stateList]
        : [...stateFieldInfo.options],
      value: purchase_state !== "" ? purchase_state : ""
    });

    setCityFieldData({
      options: stateObj
        ? [...cityFieldInfo.options, ...stateObj.cities]
        : [...cityFieldInfo.options],
      value: purchase_city !== "" ? purchase_city : "",
      isDisabled: purchase_city !== "" ? false : true
    });

    // setSelectedCountry(countryId);
  };
  useEffect(() => {
    getExchangeData();
    if (defaultCountry) {
      getStateList(defaultCountry);
    }
  }, []);

  const resetPurchaseDropDowns = () => {
    setTypeList({
      options: [
        {
          label: "Select",
          value: ""
        }
      ],
      value: "",
      isDisabled: true
    });

    setModelList({
      options: [
        {
          label: "Select",
          value: ""
        }
      ],
      value: "",
      isDisabled: true
    });
    setCCFieldData({
      options: [
        {
          label: "Select",
          value: ""
        }
      ],
      value: "",
      isDisabled: true
    });

    setMonthFieldData({
      options:
        [...purchaseMonthField.options, ...MonthsList()] ||
        purchaseMonthField.options,
      value: ""
    });

    setYearFieldData({
      options: purchaseYearField.limit
        ? [
            ...purchaseYearField.options,
            ...getLastYears(purchaseYearField.limit)
          ]
        : purchaseYearField.options,
      value: ""
    });

    setStateFieldData({
      options:
        stateFieldData.options.length > 0
          ? stateFieldData.options
          : stateFieldInfo.options,
      value: "",
      isDisabled: true
    });

    resetCityField();
  };

  const handleExchangeNotInterested = (e) => {
    handleNotInterset(e, true);
  };

  const handleExchangeNotInterestedEnter = (e) => {
    if (e.keyCode === 13) {
      handleExchangeNotInterested(e);
    }
  };

  const handleDropdownChange = async (name, value) => {
    if (value !== "") {
      if (name === purchaseMonthField.name) {
        setPurchaseMonth(value);
      }

      if (name === purchaseYearField.name) {
        setPurchaseYear(value);
      }
      // cityField.name}
      if (name === vehicleMakeField.name) {
        resetPurchaseDropDowns();
        const cloneBrand = masterBrandList.find((item) => item.value === value);

        // const typeOptions = {}
        const list = {
          ...typeList,
          isDisabled: false,
          options: [...vehicleTypeField.options, ...cloneBrand.brand_category],
          value: ""
        };
        setTypeList(list);
        setValue(vehicleTypeField.name, "");
        setValue(vehicleModelField.name, "");
        setValue(ccField.name, "");
        // setTypeList((prev) => ({ ...prev, value: "" }));
      } else if (name === vehicleTypeField.name) {
        const cloneList = typeList.options.find((item) => item.value === value);

        // const typeOptions = {}
        const list = {
          ...modelList,
          isDisabled: false,
          options: cloneList.brand_model.map((item) => ({
            label: item.label,
            value: item.label
          })),
          value: ""
        };
        const cloneCCOptions = cloneList.cc.map((item) => ({
          label: item.value,
          value: item.value
        }));
        const cloneCC = {
          ...ccFieldData,
          isDisabled: false,
          options: cloneCCOptions,
          value: ""
        };
        list.options.unshift({
          label: "Select Model",
          value: ""
        });
        cloneCC.options.unshift({
          label: "Select CC",
          value: ""
        });
        setModelList(list);
        setCCFieldData(cloneCC);
        setValue(vehicleModelField.name, "");
        setValue(ccField.name, "");
      } else if (name === stateField.name) {
        resetCityField();

        const cities = await locationObj.getCities(defaultCountry, value);
        setCityFieldData({
          options: [...cityFieldInfo.options, ...cities],
          value: "",
          isDisabled: false
        });
        setValue(cityField.name, "");
      } else {
        setValue(name, value);
      }
      setValue(name, value);
    } else {
      if (name === stateField.name) {
        resetCityField();
      } else if (name === vehicleMakeField.name) {
        setValue(vehicleTypeField.name, "");
        setValue(vehicleModelField.name, "");
        setValue(ccField.name, "");
        resetField(ccField.name);
        setTypeList({
          options: [
            {
              label: "Select",
              value: ""
            }
          ],
          value: "",
          isDisabled: true
        });

        setModelList({
          options: [
            {
              label: "Select Model",
              value: ""
            }
          ],
          value: "",
          isDisabled: true
        });
        setCCFieldData({
          options: [
            {
              label: "Select CC",
              value: ""
            }
          ],
          value: "",
          isDisabled: true
        });
      }
    }
  };
  const handleFormSubmit = (formData, event) => {
    const purchaseDate =
      formData[purchaseMonthField.name] +
      "/" +
      formData[purchaseYearField.name];
    setTradeInDataDispatcher({
      ...formData,
      purchase_date: purchaseDate
    });
    handleStep(2);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.nativeEvent.submitter.innerText,
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = `:${title}`;
      analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
    }
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  return (
    <div className="vida-exchange-tracker-steps__wrapper">
      <p>{stepTitle}</p>
      <h3 className="vida-exchange-tracker-steps__heading">{title}</h3>
      <div className="vida-exchange-tracker-steps__form-one-wrapper">
        <form
          className="vida-exchange-tracker-steps__form"
          onSubmit={handleSubmit((formData, event) =>
            handleFormSubmit(formData, event)
          )}
        >
          <div className="vida-exchange-tracker-steps__form-controls">
            <Dropdown
              name={vehicleMakeField.name}
              label={vehicleMakeField.label}
              options={
                brandList.options.length > 0
                  ? brandList.options
                  : vehicleMakeField.options
              }
              value={brandList.value}
              onChangeHandler={handleDropdownChange}
              validationRules={vehicleMakeField.validationRules}
              control={control}
              errors={errors}
              setValue={setValue}
              register={register}
              clearErrors={clearErrors}
            />
            <Dropdown
              name={vehicleTypeField.name}
              label={vehicleTypeField.label}
              options={
                typeList.options.length > 0
                  ? typeList.options
                  : vehicleTypeField.options
              }
              value={typeList.value}
              onChangeHandler={handleDropdownChange}
              validationRules={vehicleTypeField.validationRules}
              setValue={setValue}
              control={control}
              errors={errors}
              register={register}
              clearErrors={clearErrors}
              isDisabled={typeList.isDisabled}
            />
            <Dropdown
              name={vehicleModelField.name}
              label={vehicleModelField.label}
              options={
                modelList.options.length > 0
                  ? modelList.options
                  : vehicleModelField.options
              }
              value={modelList.value}
              onChangeHandler={handleDropdownChange}
              validationRules={vehicleModelField.validationRules}
              control={control}
              setValue={setValue}
              errors={errors}
              register={register}
              clearErrors={clearErrors}
              isDisabled={modelList.isDisabled}
            />

            <Dropdown
              name={ccField.name}
              label={ccField.label}
              options={
                ccFieldData.options.length > 0
                  ? ccFieldData.options
                  : ccField.options
              }
              value={ccFieldData.value}
              onChangeHandler={handleDropdownChange}
              validationRules={ccField.validationRules}
              setValue={setValue}
              control={control}
              errors={errors}
              register={register}
              clearErrors={clearErrors}
              isDisabled={ccFieldData.isDisabled}
            />
            <div className="vida-exchange-tracker-steps__state-wrapper vida-exchange-tracker-steps__state-wrapper-date vida-exchange-tracker-steps__state-wrapper-purchase-date">
              <Dropdown
                name={purchaseMonthField.name}
                label={purchaseMonthField.label}
                options={purchaseMonthFieldData.options}
                value={purchaseMonthFieldData.value}
                onChangeHandler={handleDropdownChange}
                validationRules={purchaseMonthField.validationRules}
                control={control}
                errors={errors}
                setValue={setValue}
                register={register}
                clearErrors={clearErrors}
              />
              <Dropdown
                name={purchaseYearField.name}
                label=""
                options={purchaseYearFieldData.options}
                value={purchaseYearFieldData.value}
                onChangeHandler={handleDropdownChange}
                validationRules={purchaseYearField.validationRules}
                control={control}
                errors={errors}
                setValue={setValue}
                register={register}
                clearErrors={clearErrors}
              />
            </div>

            <div className="vida-exchange-tracker-steps__state-wrapper">
              <Dropdown
                name={stateField.name}
                label={stateField.label}
                iconClass={`icon-location-marker`}
                options={
                  stateFieldData.options.length > 0
                    ? stateFieldData.options
                    : stateFieldInfo.options
                }
                value={stateFieldData.value}
                setValue={setValue}
                onChangeHandler={handleDropdownChange}
                errors={errors}
                validationRules={stateField.validationRules}
                clearErrors={clearErrors}
                register={register}
                isSortAsc={true}
              />

              <Dropdown
                name={cityField.name}
                label={cityField.label}
                iconClass={`icon-location-marker`}
                onChangeHandler={handleDropdownChange}
                options={
                  cityFieldData.options.length > 0
                    ? cityFieldData.options
                    : cityFieldInfo.options
                }
                value={cityFieldData.value}
                setValue={setValue}
                errors={errors}
                validationRules={cityField.validationRules}
                clearErrors={clearErrors}
                register={register}
                isDisabled={cityFieldData.isDisabled}
                isSortAsc={true}
              />
            </div>
          </div>
          <div className="vida-exchange-tracker-steps__btn-container">
            <button
              className="btn btn--primary vida-exchange-tracker-steps__btn"
              onClick={handleSubmit}
              onKeyUp={handleEnter}
            >
              {actionBtns.continueBtn.label}
            </button>
            {tradeInSelected ? (
              <button
                className="btn btn--secondary vida-exchange-tracker-steps__btn"
                onClick={handleExchangeNotInterested}
                onKeyUp={handleExchangeNotInterestedEnter}
                type="button"
              >
                {actionBtns.removeExchange.label}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = ({ userProfileDataReducer, purchaseConfigReducer }) => {
  return {
    cmpProps: {
      country: userProfileDataReducer.country,
      state: userProfileDataReducer.state,
      city: userProfileDataReducer.city,
      ...purchaseConfigReducer.tradeIn
    }
  };
};

VehiclePurchaseDetailsStep.propTypes = {
  vehiclePurchaseDetails: PropTypes.shape({
    stepTitle: PropTypes.string,
    title: PropTypes.string,
    vehicleMakeField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    vehicleModelField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    vehicleTypeField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    ccField: PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    purchaseYearField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      limit: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    }),
    purchaseMonthField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    }),
    cityField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    })
  }),
  actionBtns: PropTypes.shape({
    continueBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    backBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    acceptBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notInterestedBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    removeExchange: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  handleStep: PropTypes.func,
  cmpProps: PropTypes.object,
  setPurchaseMonth: PropTypes.func,
  setPurchaseYear: PropTypes.func,
  handleNotInterset: PropTypes.func,
  tradeInSelected: PropTypes.bool
};
VehiclePurchaseDetailsStep.defaultProps = {
  cmpProps: {}
};
export default connect(mapStateToProps)(VehiclePurchaseDetailsStep);
