import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import breakpoints from "../../../site/scripts/media-breakpoints";
import Dropdown from "../form/Dropdown/Dropdown";
import { useForm } from "react-hook-form";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  getProductPricesData,
  getProductBranchesData
} from "../../services/productDetails/productDetailsService";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import DOMPurify from "dompurify";
import { setHomepageCityDispatcher } from "../../store/myScooter/myScooterActions";

const PriceBreakup = (props) => {
  const isLoggedIn = loginUtils.isSessionActive();
  const [isShowDetailedBreakup, setShowDetailedBreakup] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [priceBreakupItems, setPriceBreakupItems] = useState([]);
  const [modalOptions, setModalOptions] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedModal, setSelectedModal] = useState("");
  const [branchList, setBranchList] = useState([]);
  const imgPath = appUtils.getConfig("imgPath");
  const [priceList, setPriceList] = useState([]);
  const { config, userProfileData, cityData } = props;
  const {
    mainBreakupText,
    showroomText,
    chargerText,
    fameSubsidyText,
    stateSubsidyText,
    breakupLinksText,
    defaultCityId,
    splitterChar,
    defaultVariantSkus
  } = config;

  const isDesktopView = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  useEffect(() => {
    setSelectedCity(cityData);
  }, [cityData]);

  const getProductPrice = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };
  const getProductBranch = async () => {
    const result = await getProductBranchesData();
    setBranchList(result);
    const cityStateList = result.map((item) => {
      return item["id"];
    });
    if (cityStateList.includes(defaultCityId)) {
      setSelectedCity(defaultCityId);
    } else {
      setSelectedCity(cityStateList[0]);
    }

    const cityNameList = result.map((item) => {
      return item["cityName"];
    });
    if (cityNameList.includes(defaultCityId)) {
      setSelectedCityName(defaultCityId);
    } else {
      setSelectedCityName(cityNameList[0]);
    }
  };

  const onChangeCity = (cityStateId) => {
    let dupCityStateId = cityStateId;
    const selectedBranch = branchList.filter((item) => item.id === cityStateId);
    if (selectedBranch.length > 0) {
      setSelectedCityName(selectedBranch[0].cityName);
    } else {
      if (branchList.length > 0) {
        const defaultBranch = branchList.filter(
          (item) => item.id === defaultCityId
        );
        dupCityStateId = defaultCityId;
        setSelectedCityName(defaultBranch[0].cityName);
      } else {
        dupCityStateId = defaultCityId;
      }
    }
    setSelectedCity(dupCityStateId);
    setHomepageCityDispatcher({
      cityData: dupCityStateId
    });
  };

  useEffect(() => {
    if (isLoggedIn && userProfileData.city) {
      const selectedCityStateId = (
        userProfileData.city +
        splitterChar +
        userProfileData.state +
        splitterChar +
        userProfileData.country
      ).toUpperCase();
      onChangeCity(selectedCityStateId);
    } else {
      onChangeCity(defaultCityId);
    }
  }, [userProfileData.city]);

  useEffect(() => {
    getProductPrice();
    getProductBranch();
  }, []);

  useEffect(() => {
    const result = priceList.filter((priceItem) => {
      return defaultVariantSkus.some(
        (sku) =>
          priceItem.variant_sku === sku &&
          priceItem.city_state_id === selectedCity
      );
    });
    result.sort((a, b) => {
      return (
        defaultVariantSkus.indexOf(a.variant_sku) -
        defaultVariantSkus.indexOf(b.variant_sku)
      );
    });

    setResultData(result);
    const modalOptions = [];
    result &&
      result.map((item) => {
        modalOptions.push({ label: item.item_name, value: item.variant_sku });
      });
    setModalOptions(modalOptions);

    let breakupItems = [];
    if (isDesktopView) {
      setPriceBreakupItems(result);
    } else {
      breakupItems = result.filter(
        (item) => item.variant_sku === modalOptions[0].value
      );
      setPriceBreakupItems(breakupItems);
    }
  }, [priceList, selectedCity]);

  const handleToggleBreakups = (event) => {
    event.preventDefault();
    setShowDetailedBreakup(!isShowDetailedBreakup);
  };

  const handleModalChange = (name, value) => {
    setSelectedModal(value);
    const breakupItems = [];
    breakupItems.push(resultData.find((item) => item.variant_sku === value));
    setPriceBreakupItems(breakupItems);
  };
  const { register, setValue } = useForm({
    mode: "onSubmit"
  });
  const sanitizedData = (data) => ({
    __html: DOMPurify.sanitize(data)
  });
  return (
    <div
      className={`vida-price-breakup-details ${
        !isDesktopView ? "vida-price-breakup-details-mobile" : ""
      }`}
    >
      <div className="vida-price-breakup-details__wrapper">
        <div className="vida-price-breakup-details__table">
          <div className="vida-price-breakup-details__table-header">
            <div className="vida-price-breakup-details__table-header-row">
              <div className="vida-price-breakup-details__table-header-title vida-price-breakup-details__first-column">
                {branchList && branchList.length && (
                  <Dropdown
                    name="priceLocation"
                    label={mainBreakupText.priceLocationText}
                    iconClass={`icon-location-marker`}
                    options={branchList}
                    value={selectedCity}
                    setValue={setValue}
                    onChangeHandler={(name, value) => onChangeCity(value)}
                    register={register}
                    isSortAsc={true}
                  />
                )}
              </div>

              {isDesktopView
                ? priceBreakupItems &&
                  priceBreakupItems.length &&
                  priceBreakupItems.map((item, index) => {
                    return (
                      <div
                        className="vida-price-breakup-details__table-header-title"
                        key={"header-title" + index}
                      >
                        {item.item_name || ""}
                      </div>
                    );
                  })
                : modalOptions &&
                  modalOptions.length && (
                    <Dropdown
                      name="Variant"
                      label="Variant"
                      key=""
                      options={modalOptions}
                      value={selectedModal}
                      setValue={setValue}
                      onChangeHandler={(name, value) =>
                        handleModalChange(name, value)
                      }
                      register={register}
                    />
                  )}
            </div>
          </div>

          <div className="vida-price-breakup-details__table-body">
            {isShowDetailedBreakup && (
              <>
                {/* EX-SHOWROOM */}
                <div className="vida-price-breakup-details__table-body-row">
                  <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                    <h2>{showroomText.heading}</h2>
                    <p
                      dangerouslySetInnerHTML={sanitizedData(
                        showroomText.description
                      )}
                    ></p>
                  </div>
                  {priceBreakupItems &&
                    priceBreakupItems.length &&
                    priceBreakupItems.map((item, index) => {
                      return (
                        <div
                          className="vida-price-breakup-details__table-body-price"
                          key={"price-breakup-details" + index}
                        >
                          {currencyUtils.getCurrencyFormatValue(
                            item.exShowRoomPrice
                          ) || ""}
                        </div>
                      );
                    })}
                </div>

                {/* CHARGER */}
                {chargerText.heading && (
                  <div className="vida-price-breakup-details__table-body-row">
                    <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                      <h2>{chargerText.heading}</h2>
                      <p
                        dangerouslySetInnerHTML={sanitizedData(
                          chargerText.description
                        )}
                      ></p>
                    </div>
                    {priceBreakupItems &&
                      priceBreakupItems.length &&
                      priceBreakupItems.map((item, index) => {
                        return (
                          <div
                            className="vida-price-breakup-details__table-body-price"
                            key={"breakup-details" + index}
                          >
                            {currencyUtils.getCurrencyFormatValue(
                              item.portablechargerPrice
                            ) || ""}
                          </div>
                        );
                      })}
                  </div>
                )}

                <div className="vida-price-breakup-details__subsidy">
                  {/* FAME SUBSIDY */}
                  {fameSubsidyText.heading && (
                    <div className="vida-price-breakup-details__table-body-row">
                      <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                        <h2>{fameSubsidyText.heading}</h2>
                        <p
                          dangerouslySetInnerHTML={sanitizedData(
                            fameSubsidyText.description
                          )}
                        ></p>
                      </div>
                      {priceBreakupItems &&
                        priceBreakupItems.length &&
                        priceBreakupItems.map((item, index) => {
                          return (
                            <div
                              className="vida-price-breakup-details__table-body-price"
                              key={"details__subsidy" + index}
                            >
                              {currencyUtils.getCurrencyFormatValue(
                                item.fame2IncentivePrice
                              ) || ""}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* STATE SUBSIDY */}
                  {isDesktopView && (
                    <div className="vida-price-breakup-details__table-body-row">
                      <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                        <h2>{stateSubsidyText.heading}</h2>
                        <p
                          dangerouslySetInnerHTML={sanitizedData(
                            stateSubsidyText.description
                          )}
                        ></p>
                      </div>
                      {priceBreakupItems &&
                        priceBreakupItems.length &&
                        priceBreakupItems.map((item, index) => {
                          return (
                            <div
                              className="vida-price-breakup-details__table-body-price"
                              key={"state_subsidy" + index}
                            >
                              {currencyUtils.getCurrencyFormatValue(
                                item.stateSubsidyPrice
                              ) || ""}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </>
            )}
            {/* MAIN BREAKUP */}
            <div className="vida-price-breakup-details__table-body-row">
              <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                <h2>{mainBreakupText.heading}</h2>
                <p
                  dangerouslySetInnerHTML={sanitizedData(
                    mainBreakupText.description
                  )}
                ></p>
              </div>
              {priceBreakupItems &&
                priceBreakupItems.length &&
                priceBreakupItems.map((item, index) => {
                  return (
                    <div
                      className="vida-price-breakup-details__table-body-price vida-price-breakup-details__main-price"
                      key={"main_breakup" + index}
                    >
                      {currencyUtils.getCurrencyFormatValue(
                        item?.effectivePrice
                      ) || ""}
                    </div>
                  );
                })}
            </div>

            {/* NOTE */}
            <div className="vida-price-breakup-details__table-body-row">
              <div className="vida-price-breakup-details__table-body-labels vida-price-breakup-details__first-column">
                <p
                  dangerouslySetInnerHTML={sanitizedData(
                    mainBreakupText.gstText
                  )}
                ></p>
              </div>

              {/* STATE SUBSIDY MOBILE */}
              {!isDesktopView && (
                <section className="notification notification--info subsidy--notification">
                  <div className="notification__container">
                    <div className="notification__title">
                      <span className="notification__icon">
                        <i className="icon-information-circle"></i>
                      </span>
                      <h2 className="notification__label">
                        {stateSubsidyText.potentialNotification}
                      </h2>
                    </div>
                    <div className="notification__description">
                      {stateSubsidyText.description}
                      <p
                        dangerouslySetInnerHTML={sanitizedData(
                          stateSubsidyText.description
                        )}
                      ></p>
                      {priceBreakupItems &&
                        priceBreakupItems.length &&
                        priceBreakupItems.map((item, index) => {
                          return (
                            <div key={"body-price" + index}>
                              <div className="vida-price-breakup-details__table-body-price vida-price-breakup-details__table-body-subsidy-price">
                                {currencyUtils.getCurrencyFormatValue(
                                  item.stateSubsidyPrice
                                ) || ""}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </section>
              )}
              <div className="vida-price-breakup-details__link">
                {isShowDetailedBreakup ? (
                  <>
                    {breakupLinksText.viewBreakup ? (
                      <a
                        href="#"
                        rel="noreferrer"
                        onClick={(event) => handleToggleBreakups(event)}
                      >
                        {breakupLinksText.hideBreakup}
                        <img src={`${imgPath}/up-icon.png`} />
                      </a>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    {breakupLinksText.viewBreakup ? (
                      <a
                        href="#"
                        rel="noreferrer"
                        onClick={(event) => handleToggleBreakups(event)}
                      >
                        {breakupLinksText.viewBreakup}
                        <img src={`${imgPath}/down-icon.png`} />
                      </a>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PriceBreakup.propTypes = {
  config: PropTypes.any,
  userProfileData: PropTypes.object,
  cityData: PropTypes.string
};
PriceBreakup.defaultProps = {
  config: {}
};
const mapStateToProps = ({ userProfileDataReducer, myScooterReducer }) => {
  return {
    userProfileData: {
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    cityData: myScooterReducer.cityData
  };
};
export default connect(mapStateToProps)(PriceBreakup);
