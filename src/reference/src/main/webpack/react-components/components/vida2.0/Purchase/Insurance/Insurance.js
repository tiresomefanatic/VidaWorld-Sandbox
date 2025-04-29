import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import breakpoints from "../../../../../site/scripts/media-breakpoints";
import currencyUtils from "../../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { useInsuranceData } from "../../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import Drawer from "../../Drawer/Drawer";
import { useForm } from "react-hook-form";
import Banner from "../Components/Banner";
import getFontSizes from "../../../../../site/scripts/utils/fontUtils";

const Insurance = ({
  config,
  orderId,
  opportunityId,
  sku,
  variantSku,
  handleSubmitOwnInsurance,
  handleSubmitBuyInsurance,
  order,
  productData,
  insuranceData,
  userProfileInfo,
  optedBikeVariant
}) => {
  const [showLeftContainer, setShowLeftContainer] = useState(true);
  const [showRightContainer, setShowRightContainer] = useState(true);
  const [showInsuranceLandingPage, setShowInsuranceLandingPage] =
    useState(true);
  const [showInsurancePlans, setShowInsurancePlans] = useState(false);
  const [showComparePlans, setShowComparePlans] = useState(false);
  const [showOwnInsurancePopup, setShowOwnInsurancePopup] = useState(false);
  const [proceedBtnDisabled, setProceedBtnDisabled] = useState(true);
  const [isActiveCard, setIsActiveCard] = useState();
  const [selectedInsuranceCard, setSelectedInsuranceCard] = useState();
  const [isSorting, setIsSorting] = useState(false);
  const ownInsuranceInputBox = document.getElementsByClassName(
    "own-insurance-checkbox"
  )[0];
  const addOnsInputBox = document.querySelectorAll(".choose-addons-checkbox");
  const cpaInputBox = document.querySelectorAll(".cpa-checkbox");
  const [insuranceDetails, setInsuranceDetails] = useState();
  const [cpaOpted, setCpaOpted] = useState(true);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const getInsuranceData = useInsuranceData();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const [selectedInsuranceAddOns, setSelectedInsuranceAddOns] = useState([]);
  const [selectedPremiumAmount, setSelectedPremiumAmount] = useState(0);
  const [selectedInsuranceAmount, setSelectedInsuranceAmount] = useState(0);
  const [showOption, setShowOption] = useState(false);
  const [showCPAOptoutPopUp, setShowCPAOptoutPopUp] = useState(false);
  const sortDropdownField = document.getElementsByClassName(
    "compare-plans-select-input"
  )[0];
  const [cpaReason, setCpaReason] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const ctaTracking = (e, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const handleGoToInsuranceInfo = () => {
    setShowInsuranceLandingPage(false);
    setShowInsurancePlans(true);
  };

  const updateAddonCheckBox = (selectCard) => {
    setSpinnerActionDispatcher(true);
    setTimeout(() => {
      const addOnsInputBox = document.querySelectorAll(
        ".choose-addons-checkbox"
      );
      addOnsInputBox.forEach((item) => {
        selectedInsuranceCard?.addOns.forEach((insurance) => {
          if (
            item?.dataset?.cpaid &&
            item?.dataset?.cpaid === selectedInsuranceCard?.insurancerId &&
            cpaOpted
          ) {
            item.checked = true;
          } else {
            if (item?.dataset?.addonid === insurance?.addonId) {
              item.checked = true;
            }
          }
        });
      });
      setSpinnerActionDispatcher(false);
    }, 1000);
  };

  const handleGoBackInsurancePlans = (e) => {
    ctaTracking(e, "ctaButtonClick", "Insurance");
    setShowComparePlans(false);
    setShowInsurancePlans(true);
    setShowLeftContainer(true);
    setShowRightContainer(true);
    updateAddonCheckBox(selectedInsuranceCard);
  };

  const handleGoBackLandingPage = (e) => {
    ctaTracking(e, "ctaButtonClick", "Insurance");
    setShowInsurancePlans(false);
    setShowInsuranceLandingPage(true);
  };

  const handleOpenOwnInsurancePopup = (e) => {
    setShowOwnInsurancePopup(true);
    ctaTracking(e, "ctaButtonClick", "Proceed - Own Insurance Screen");
  };

  const handleCloseOwnInsurancePopup = (e) => {
    ctaTracking(e, "ctaButtonClick", "Cancel - Own Insurance Screen");
    setShowOwnInsurancePopup(false);
    ownInsuranceInputBox.checked = false;
    setProceedBtnDisabled(true);
  };

  const handleCloseCpaOptPopup = (e) => {
    ctaTracking(e, "ctaButtonClick", "Cancel - CPA popup");
    setShowCPAOptoutPopUp(false);
    setCpaOpted(true);
  };

  const handleConfirmCpaOptPopup = (e) => {
    if (cpaReason.length > 0) {
      cpaInputBox.forEach((addOnItem) => {
        addOnItem.checked = false;
      });
      setCpaOpted(false);
      setShowCPAOptoutPopUp(false);
    }
    ctaTracking(e, "confirmCTAClick", `Confirm - ${cpaReason}`);
  };

  const handleOwnInsurance = (e) => {
    if (e.target.checked) {
      setProceedBtnDisabled(false);
    } else {
      setProceedBtnDisabled(true);
    }
  };

  const handleSortingOnPremium = (e) => {
    const sortValue = e.target.value;
    if (sortValue == 0) {
      setIsSorting(false);
    } else {
      setIsSorting(true);
    }
  };

  const getTotalPrice = (insurance) => {
    if (insurance) {
      const sum = parseFloat(insurance?.premium);
      let overallAddOns = 0;
      let selectedAddOns = 0;
      if (insurance?.addOns?.length > 0) {
        insurance?.addOns.forEach((item) => {
          overallAddOns += parseFloat(item?.amount);
        });
      }
      if (selectedInsuranceAddOns.length > 0) {
        selectedInsuranceAddOns.forEach(
          (item) => (selectedAddOns += parseFloat(item.amount))
        );
      }
      const addOnPrice = sum - (overallAddOns - selectedAddOns);
      setSelectedPremiumAmount(addOnPrice);
      setSelectedInsuranceAmount(addOnPrice);
    } else {
      setSelectedPremiumAmount(0);
      setSelectedInsuranceAmount(0);
    }
  };

  useEffect(() => {
    if (selectedPremiumAmount > 0) {
      setSelectedPremiumAmount(0);
    }
    getTotalPrice(selectedInsuranceCard);
  }, [selectedInsuranceAddOns.length, selectedInsuranceCard]);

  const handleSelectedInsuranceCard = (item) => {
    const tempArr = [];

    insuranceDetails?.addonsItems
      ?.filter((item1) =>
        item1?.insuranceName?.filter(
          (addonItem) => addonItem?.insurancerId === item?.insurancerId
        )
      )
      .map((indexItem) => {
        indexItem?.insuranceName
          ?.filter((item2) => item2?.insurancerId === item?.insurancerId)
          .map((items) => tempArr.push(items));
      });
    const addOnsFields = [];
    const iterationItem = item?.addOns ? item.addOns : tempArr;
    addOnsInputBox.forEach((items) => (items.checked = false));
    addOnsInputBox.forEach((items) => {
      iterationItem.forEach((addOnItem) => {
        if (
          items?.getAttribute("data-addonid") === addOnItem.addonId ||
          items?.getAttribute("data-cpaid") === item?.insurancerId
        ) {
          addOnsFields.push(items);
        }
      });
    });
    addOnsFields.forEach((item) => {
      if (item.getAttribute("data-cpaid") && cpaOpted) {
        item.checked = false;
      }
    });
    setSelectedInsuranceCard({
      ...item,
      addOns: [...tempArr]
    });
    if (item?.addOns) {
      setSelectedInsuranceAddOns(item?.addOns);
    } else {
      setSelectedInsuranceAddOns(tempArr);
    }
  };

  const handleInsurancePriceCalculation = (
    e,
    item,
    item1,
    item2,
    selectedInsuranceCard
  ) => {
    if (item2.addonId === "CPA") {
      if (!e.target.checked) {
        e.target.checked = true;
        setShowCPAOptoutPopUp(true);
      } else {
        setCpaOpted(true);
      }
    }
    const tempArr = selectedInsuranceAddOns;

    if (selectedInsuranceCard?.insurancerId === item2?.insurancerId) {
      if (e.target.checked) {
        if (tempArr.length > 0) {
          // check if it already exists
          setSelectedInsuranceAddOns([...tempArr, item2]);
        } else {
          // if object doesn't exists
          setSelectedInsuranceAddOns([...tempArr, item2]);
        }
      } else {
        if (tempArr.length > 0) {
          //filter out all other values except unselected
          const chosenAddons = tempArr.filter(
            (obj) => obj?.addonId !== item2?.addonId
          );
          setSelectedInsuranceAddOns(chosenAddons);
        }
      }
    }
  };

  const getInsuranceDetails = async () => {
    setSpinnerActionDispatcher(true);
    const addonParam = [
      "zerodepreciation",
      "rti",
      "batterycover",
      "motorengineprotection"
    ];
    const result = await getInsuranceData({
      variables: {
        opportunity_id: order?.opportunityId
          ? order?.opportunityId
          : opportunityId,
        order_id: order?.orderId ? order?.orderId : orderId,
        sf_itemsku_id: productData?.variantSku
          ? productData?.variantSku
          : variantSku,
        sf_item_id: productData?.sku ? productData?.sku : sku,
        addons: addonParam.toString(),
        cpa_opted: cpaOpted ? "Y" : "N"
      }
    });
    if (result && result?.data) {
      setInsuranceDetails(result?.data?.getQuotation?.items[0]);
      setSpinnerActionDispatcher(false);
    }
  };

  const handleOnFocus = () => {
    setShowOption(!showOption);
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };

  const handleOptionSelect = (item, index) => {
    sortDropdownField.value = item?.option;
    setShowOption(false);
    if (index == 0) {
      setIsSorting(false);
    } else {
      setIsSorting(true);
    }
  };

  //Need to club this two functions
  useEffect(() => {
    getInsuranceDetails();
  }, [cpaOpted]);

  useEffect(() => {
    getInsuranceDetails();
  }, []);

  const handleGoToComparePlans = (e) => {
    handleSelectedInsuranceCard(selectedInsuranceCard);
    ctaTracking(e, "ctaButtonClick", "Insurance");
    setShowInsurancePlans(false);
    setShowLeftContainer(false);
    setShowRightContainer(false);
    setShowComparePlans(true);
  };

  const handleToggleCard = (item) => {
    setIsActiveCard(item);
    handleSelectedInsuranceCard(item);
  };

  // default selection of the insurance card
  const handleUserInsuranceValue = (selectedInsurance) => {
    if (selectedInsurance || showInsuranceLandingPage) {
      const filteringById =
        selectedInsurance?.insurerId || selectedInsurance?.insurancerId;
      const defaultSelectedItem = insuranceDetails?.insurancePremium.filter(
        (item) => item?.insurancerId === filteringById
      );
      defaultSelectedItem[0].addOns =
        selectedInsurance?.insuranceAddonsList || selectedInsurance.addOns;
      handleToggleCard(defaultSelectedItem[0]);
      handleSelectedInsuranceCard(defaultSelectedItem[0]);
      // updateAddonCheckBox(defaultSelectedItem[0]);
    }
  };

  useEffect(() => {
    if (insuranceDetails) {
      if (insuranceData && insuranceData.insurerId !== "") {
        handleUserInsuranceValue(insuranceData);
        // if (!(cpaOpted === insuranceData?.cpaOpted)) {
        //   setCpaOpted(insuranceData?.cpaOpted);
        // }
      } else {
        if (selectedInsuranceCard) {
          handleUserInsuranceValue(selectedInsuranceCard);
        }
      }
    }
  }, [insuranceDetails, insuranceData]);

  useEffect(() => {
    if (selectedInsuranceCard) {
      updateAddonCheckBox(selectedInsuranceCard);
    }
  }, [showInsurancePlans, selectedInsuranceCard, isSorting]);

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  return (
    <div className="insurance-wrapper">
      <div className="insurance-container vida-2-container">
        {showLeftContainer && (
          <>
            <div className="insurance-left-container">
              <Banner
                bannerBgImg={optedBikeVariant?.bgImg}
                bikeName={productData?.name}
                onItsWayText={config?.onItsWayText}
                userName={userProfileInfo?.fname}
                bannerBikeImg={optedBikeVariant?.bikeImg}
                optedBikeVariant={optedBikeVariant}
              />
              {showInsuranceLandingPage && (
                <div className="insurance-left-title">
                  <p className="insurance-left-title-text">
                    {config?.insuranceLandingPageTitle}
                  </p>
                </div>
              )}
              {showInsurancePlans && (
                <div className="insurance-plans-left-title">
                  <p className="insurance-plans-left-title-text">
                    {config?.insurancePlansPageTitle}
                  </p>
                  <p className="insurance-plans-left-title-subtext">
                    {config?.insurancePlansPageSecondaryText}
                  </p>
                  <p
                    className="compare-plans-text"
                    onClick={(e) => handleGoToComparePlans(e)}
                  >
                    {config?.comparePlansCta}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {showRightContainer && (
          <div className="insurance-right-container">
            {showInsuranceLandingPage && (
              <div className="custom-insurance-plan-container">
                <div
                  className="best-selling-insurance-container"
                  onClick={handleGoToInsuranceInfo}
                >
                  <div className="best-selling-insurance-title-container">
                    <div className="best-selling-insurance-title">
                      <p className="best-selling-insurance-title-text">
                        {config?.bestSellingInsuranceTitle}
                      </p>
                    </div>
                    <div className="right-chevron-icon">
                      <img
                        src={config?.chevronRightIcon}
                        alt="right_chevron"
                      ></img>
                    </div>
                  </div>
                  <div className="best-selling-insurance-description-container">
                    {config?.bestSellingInsuranceDescription?.map(
                      (item, index) => (
                        <div
                          className="best-selling-insurance-description"
                          key={index}
                        >
                          <div className="tick-icon-container">
                            <img
                              className="tick-icon"
                              src={config?.tickIcon}
                              alt="tick_icon"
                            ></img>
                          </div>
                          <p className="best-selling-insurance-description-text">
                            {item?.descriptionText}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="best-selling-insurance-company-list">
                    {insuranceDetails?.insurancePremium
                      ?.slice(0, 3)
                      .map((item, index) => (
                        <div
                          className="best-selling-insurance-company-item"
                          key={index}
                        >
                          <div className="best-selling-insurance-company-logo-wrapper">
                            <img
                              className="best-selling-insurance-company-logo"
                              src={item?.logoPath}
                              alt="company_img"
                            ></img>
                          </div>
                        </div>
                      ))}
                    {insuranceDetails?.insurancePremium?.length - 3 > 0 ? (
                      <div className="best-selling-insurance-company-item">
                        <span>
                          + {insuranceDetails?.insurancePremium?.length - 3}{" "}
                          more
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="own-insurance-container">
                  <div className="own-insurance-flex-container">
                    <div className="own-insurance-checkbox-container">
                      <input
                        className="own-insurance-checkbox"
                        type="checkbox"
                        onChange={(e) => {
                          handleOwnInsurance(e);
                        }}
                      ></input>
                    </div>
                    <div className="own-insurance-content-container">
                      <div className="own-insurance-title">
                        <p className="own-insurance-title-text">
                          {config?.ownInsuranceTitle}
                        </p>
                      </div>
                      <div className="own-insurance-description-container">
                        <p className="own-insurance-description-text">
                          {config?.ownInsuranceDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    isDesktop
                      ? "custom-insurance-plan-popup-container vida-2-container"
                      : "custom-insurance-plan-popup-container"
                  }
                >
                  <div className="proceed-btn-container">
                    <button
                      className="proceed-btn"
                      type="button"
                      disabled={proceedBtnDisabled}
                      onClick={(e) => handleOpenOwnInsurancePopup(e)}
                    >
                      {config?.proceedBtnLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showInsurancePlans && (
              <div className="insurance-plans-container">
                <div className="compare-plans-dropdown-container">
                  <span className="showing-for-text">
                    {config?.showingForText}
                  </span>
                  <div className="compare-plans-select-container">
                    <div
                      className="compare-plans-select-icon"
                      onClick={handleOnFocus}
                    >
                      <img
                        src={
                          showOption
                            ? config?.sortDropdownField?.icon
                            : config?.sortDropdownField.downIcon
                        }
                        alt={config?.sortDropdownField?.iconAltText}
                        title={config?.sortDropdownField?.iconTitle}
                      ></img>
                    </div>
                    <input
                      className="compare-plans-select-input"
                      placeholder={config?.sortDropdownField?.placeholder}
                      type="text"
                      onFocus={handleOnFocus}
                      onBlur={handleOnBlur}
                    ></input>
                    <div
                      className={
                        showOption
                          ? "compare-plans-select-option-container d-block"
                          : "compare-plans-select-option-container d-none"
                      }
                    >
                      {config?.sortDropdownOptions?.map((item, index) => (
                        <div
                          className="compare-plans-select-option"
                          key={index}
                          onClick={() => handleOptionSelect(item, index)}
                        >
                          <p>{item?.option}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="insurance-plans-list">
                  {insuranceDetails?.insurancePremium
                    ?.sort((a, b) =>
                      isSorting
                        ? a?.premium > b?.premium
                          ? -1
                          : 1
                        : a?.premium > b?.premium
                        ? 1
                        : -1
                    )
                    ?.map((item, index) => (
                      <div
                        className={
                          isActiveCard?.insurancerId === item?.insurancerId
                            ? "insurance-plans-item active-card"
                            : "insurance-plans-item"
                        }
                        style={{
                          border: `${
                            selectedInsuranceCard?.insurancerId ===
                            item?.insurancerId
                              ? "1px solid #ff5310"
                              : ""
                          }`
                        }}
                        key={index}
                      >
                        <div
                          className="insurance-plans-title-flex-container"
                          onClick={() => handleToggleCard(item)}
                        >
                          <div className="insurance-plans-title-container">
                            <div className="insurance-company-logo">
                              <img
                                src={item?.logoPath}
                                alt="company_logo"
                              ></img>
                            </div>
                            <div className="insurance-company-name">
                              <p className="insurance-company-name-text">
                                {item?.name}
                              </p>
                            </div>
                          </div>
                          <div className="dropdown-chevron">
                            <img
                              src={config?.chevronDownIcon}
                              alt="dropdown_chevron"
                            ></img>
                          </div>
                        </div>
                        <div
                          className="insurance-plan-name-pt-container"
                          onClick={() => handleToggleCard(item)}
                        >
                          <div className="insurance-plan-name-flex-container">
                            <div className="insurance-plan-name">
                              <p className="insurance-plan-name-text">
                                {item?.name}
                              </p>
                            </div>
                            <div className="insurance-plan-amount-container">
                              <p className="insurance-plan-amount">
                                {currencyUtils.getCurrencyFormatValue(
                                  item?.grand_total,
                                  0
                                )}
                              </p>
                              <p className="insurance-plan-amount-subtext">
                                {config?.premiumPerYearText}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="insurance-plans-content-container">
                          <div className="insurance-plans-description">
                            <p className="insurance-plans-description-text">
                              {config?.insurancePlansDescriptionText}
                            </p>
                          </div>
                          <div className="insurance-plans-declared-value">
                            <p className="insurance-plans-declared-value-text">
                              {config?.insurancePlansDeclaredValueText}{" "}
                              {currencyUtils.getCurrencyFormatValue(
                                item?.basic_idv,
                                0
                              )}
                            </p>
                          </div>
                          <div className="choose-addons-plans">
                            <p className="choose-addons-text">
                              {config?.chooseYourAddonsText}
                            </p>
                          </div>
                          <div className="choose-addons-list">
                            <div className="choose-addons-item">
                              <div className="choose-addons-item-container">
                                <div className="choose-addons-name-container">
                                  <input
                                    className="choose-addons-checkbox cpa-checkbox"
                                    type="checkbox"
                                    data-cpaid={item?.insurancerId}
                                    onChange={(e) => {
                                      handleInsurancePriceCalculation(
                                        e,
                                        item,
                                        {},
                                        {
                                          addonId: "CPA",
                                          amount: item?.pa_owner_driver,
                                          insurancerId: item?.insurancerId
                                        },
                                        selectedInsuranceCard
                                      );
                                    }}
                                  ></input>

                                  {config?.addOnTooltipContent
                                    ?.filter(
                                      (item3) =>
                                        config?.cpaText.toLowerCase() ===
                                        item3?.id.toLowerCase()
                                    )
                                    ?.map((item3, index3) => (
                                      <p
                                        className="choose-addons-name-text"
                                        key={index3}
                                      >
                                        {config?.cpaText}

                                        <span className="global-tooltip">
                                          <img
                                            src={
                                              appUtils.getConfig(
                                                "resourcePath"
                                              ) + "images/svg/tooltip-icon.svg"
                                            }
                                            data-tip
                                            data-for={item3?.id}
                                            alt="tooltip_icon"
                                          ></img>
                                          <ReactTooltip
                                            id={item3?.id}
                                            place="top"
                                            effect="solid"
                                          >
                                            {item3?.content}
                                          </ReactTooltip>
                                        </span>
                                      </p>
                                    ))}
                                </div>
                                <div className="choose-addons-amount-container">
                                  <p className="choose-addons-amount-text">
                                    {`+${currencyUtils.getCurrencyFormatValue(
                                      item?.pa_owner_driver,
                                      0
                                    )}`}
                                  </p>
                                  <p className="choose-addons-amount-subtext">
                                    {config?.premiumPerYearText}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {insuranceDetails?.addonsItems
                              ?.filter((item1) =>
                                item1?.insuranceName?.filter(
                                  (item1) =>
                                    item1?.insurancerId === item?.insurancerId
                                )
                              )
                              ?.map((item1, index1) => (
                                <div
                                  className="choose-addons-item"
                                  key={index1}
                                >
                                  {item1?.insuranceName
                                    ?.filter(
                                      (item2) =>
                                        item2?.insurancerId ===
                                        item?.insurancerId
                                    )
                                    ?.map((item2, index2) => (
                                      <div
                                        className="choose-addons-item-container"
                                        key={index2}
                                      >
                                        <div className="choose-addons-name-container">
                                          <input
                                            className="choose-addons-checkbox"
                                            type="checkbox"
                                            data-addonid={item2.addonId}
                                            onChange={(e) => {
                                              handleInsurancePriceCalculation(
                                                e,
                                                item,
                                                item1,
                                                item2,
                                                selectedInsuranceCard
                                              );
                                            }}
                                          ></input>

                                          {config?.addOnTooltipContent
                                            ?.filter(
                                              (item4) =>
                                                item1?.name.toLowerCase() ===
                                                item4?.id.toLowerCase()
                                            )
                                            ?.map((item4, index4) => (
                                              <p
                                                className="choose-addons-name-text"
                                                key={index4}
                                              >
                                                {item1?.name}

                                                <span className="global-tooltip">
                                                  <img
                                                    src={
                                                      appUtils.getConfig(
                                                        "resourcePath"
                                                      ) +
                                                      "images/svg/tooltip-icon.svg"
                                                    }
                                                    data-tip
                                                    data-for={item4?.id}
                                                    alt="tooltip_icon"
                                                  ></img>
                                                  <ReactTooltip
                                                    id={item4?.id}
                                                    place="top"
                                                    effect="solid"
                                                  >
                                                    {item4?.content}
                                                  </ReactTooltip>
                                                </span>
                                              </p>
                                            ))}
                                        </div>
                                        <div className="choose-addons-amount-container">
                                          <p className="choose-addons-amount-text">
                                            {`+${currencyUtils.getCurrencyFormatValue(
                                              item2?.amount,
                                              0
                                            )}`}
                                          </p>

                                          <p className="choose-addons-amount-subtext">
                                            {config?.premiumPerYearText}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ))}
                          </div>
                          <div className="choose-addons-total-container">
                            <div className="choose-addons-total">
                              <p className="choose-addons-total-text">
                                {config?.totalText}
                              </p>
                            </div>
                            <div className="choose-addons-total-amount">
                              <p className="choose-addons-total-amount-text">
                                {currencyUtils.getCurrencyFormatValue(
                                  parseFloat(selectedPremiumAmount),
                                  0
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="choose-addons-btn-container">
                            <button
                              className={
                                selectedInsuranceCard?.insurancerId ===
                                item?.insurancerId
                                  ? "addons-select-btn selected-btn"
                                  : "addons-select-btn"
                              }
                              type="button"
                              onClick={() => handleSelectedInsuranceCard(item)}
                            >
                              {selectedInsuranceCard?.insurancerId ===
                              item?.insurancerId
                                ? config?.selectedBtnCta
                                : config?.selectBtnCta}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="insurance-plans-popup-container">
                  <Drawer>
                    <div className="insurance-plans-popup-content-container">
                      <div className="insurance-plans-details-container">
                        <div className="selected-insurance-plan-name">
                          <p className="selected-insurance-plan-name-text">
                            {selectedInsuranceCard?.name}
                          </p>
                        </div>
                        {selectedInsuranceCard?.name && (
                          <div className="selected-insurance-plan-amount">
                            <p className="selected-insurance-plan-amount-text">
                              {currencyUtils.getCurrencyFormatValue(
                                parseFloat(selectedInsuranceAmount),
                                0
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="insurance-plans-button-container">
                        <button
                          className="insurance-cancel-btn"
                          type="button"
                          onClick={(e) => handleGoBackLandingPage(e)}
                        >
                          {config?.cancelText}
                        </button>
                        <button
                          className="insurance-confirm-btn"
                          onClick={(e) => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            handleSubmitBuyInsurance(
                              selectedInsuranceCard,
                              selectedInsuranceAddOns,
                              selectedInsuranceAmount,
                              e
                            );
                          }}
                          type="button"
                        >
                          {config?.confirmText}
                        </button>
                      </div>
                    </div>
                  </Drawer>
                </div>
              </div>
            )}
          </div>
        )}
        {showComparePlans && (
          <div className="compare-plans-container">
            <div className="compare-plans-mobile-title">
              <p className="compare-plans-mobile-title-text">
                {config?.comparePlansMobileTitle}
              </p>
            </div>
            <div className="compare-plans-title">
              <p className="compare-plans-title-text">
                {isDesktop
                  ? config?.comparePlansSecondTitle
                  : config?.comparePlansFirstTitle}
              </p>
            </div>
            <div className="compare-plans-dropdown-container">
              <span className="showing-for-text">{config?.showingForText}</span>
              <div className="compare-plans-select-container">
                <div
                  className="compare-plans-select-icon"
                  onClick={handleOnFocus}
                >
                  <img
                    src={
                      showOption
                        ? config?.sortDropdownField?.icon
                        : config?.sortDropdownField.downIcon
                    }
                    alt={config?.sortDropdownField?.iconAltText}
                    title={config?.sortDropdownField?.iconTitle}
                  ></img>
                </div>
                <input
                  className="compare-plans-select-input"
                  placeholder={config?.sortDropdownField?.placeholder}
                  type="text"
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                ></input>
                <div
                  className={
                    showOption
                      ? "compare-plans-select-option-container d-block"
                      : "compare-plans-select-option-container d-none"
                  }
                >
                  {config?.sortDropdownOptions?.map((item, index) => (
                    <div
                      className="compare-plans-select-option"
                      key={index}
                      onClick={() => handleOptionSelect(item, index)}
                    >
                      <p>{item?.option}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="compare-plans-table-container">
              <table className="compare-plans-table">
                <tr className="compare-plans-table-title-row">
                  <th>{config?.financersText}</th>
                  <th>{config?.policyNameText}</th>
                  <th>{config?.premiumPerYearText}</th>
                  <th>{config?.addOnsText}</th>
                </tr>
                {insuranceDetails?.insurancePremium
                  ?.sort((a, b) =>
                    isSorting
                      ? a?.premium > b?.premium
                        ? -1
                        : 1
                      : a?.premium > b?.premium
                      ? 1
                      : -1
                  )
                  ?.map((item, index) => (
                    <tr className="compare-plans-table-content-row" key={index}>
                      <td>
                        <div className="insurance-company-logo">
                          <img src={item?.logoPath} alt="company_logo"></img>
                        </div>
                      </td>
                      <td className="insurance-policy-name">{item?.name}</td>
                      <td className="insurance-policy-amount">
                        {currencyUtils.getCurrencyFormatValue(item?.premium, 0)}
                      </td>
                      <td className="insurance-policy-addons">
                        <ul className="insurance-policy-addons-list">
                          {insuranceDetails?.addonsItems?.map((item, index) => (
                            <li
                              className="insurance-policy-addons-item"
                              key={index}
                            >
                              {item?.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
            <div
              className={
                isDesktop
                  ? "compare-plans-popup-container vida-2-container"
                  : "compare-plans-popup-container"
              }
            >
              <div className="back-btn-container">
                <button
                  className="back-btn"
                  type="button"
                  onClick={(e) => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    handleGoBackInsurancePlans(e);
                  }}
                >
                  {config?.backToInsurancePlanCtaLabel}
                </button>
              </div>
            </div>
          </div>
        )}
        {showOwnInsurancePopup && (
          <div className="own-insurance-popup-container">
            <div className="own-insurance-popup-content-container">
              <div className="own-insurance-popup-title">
                <p className="own-insurance-popup-title-text">
                  {config?.buyOwnInsuranceTitle}
                </p>
              </div>
              <div className="own-insurance-popup-description">
                <p className="own-insurance-popup-description-text">
                  {config?.buyOwnInsuranceDescription}
                </p>
              </div>
              <div className="own-insurance-popup-btn-container">
                <button
                  className="own-insurance-cancel-btn"
                  type="button"
                  onClick={(e) => handleCloseOwnInsurancePopup(e)}
                >
                  {config?.cancelText}
                </button>
                <button
                  className="own-insurance-confirm-btn"
                  onClick={(e) => handleSubmitOwnInsurance(e)}
                  type="button"
                >
                  {config?.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
        {showCPAOptoutPopUp && (
          <div className="cpa-opt-out-popup-container">
            <div className="cpa-opt-out-popup-content-container">
              <div className="cpa-opt-out-popup-title">
                <p className="cpa-opt-out-popup-title-text">
                  {config?.optOutCPATitle}
                </p>
              </div>
              <div className="cpa-opt-out-popup-description">
                <p className="cpa-opt-out-popup-description-text">
                  {config?.optOutCPADescription}
                </p>
                <div className="cpa-opt-out-form-container">
                  <p className="cpa-opt-out-form-title">
                    {config?.optOutCPAFormTitle}
                  </p>
                  <form
                  // onSubmit={handleSubmit((formData, event) =>
                  //   handleFormSubmit(formData, event)
                  // )}
                  >
                    {config?.optOutCPAFormOptions.map((item, index) => (
                      <div
                        className="opt-out-form-values-container"
                        key={item.id}
                      >
                        <input
                          className="opt-out-reason-checkbox"
                          type="radio"
                          id="opt-out-reason"
                          name="opt-out-reason"
                          onChange={() => setCpaReason(item.reason)}
                          // ref={cpaResonInputRef.current[index]}
                          value={item.reason}
                        ></input>
                        <p className="opt-out-form-values">{item.reason}</p>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
              <div className="cpa-opt-out-popup-btn-container">
                <button
                  className="cpa-opt-out-cancel-btn"
                  type="button"
                  onClick={(e) => handleCloseCpaOptPopup(e)}
                >
                  {config?.cancelText}
                </button>
                <button
                  className="cpa-opt-out-confirm-btn"
                  onClick={(e) => handleConfirmCpaOptPopup(e)}
                  type="button"
                >
                  {config?.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer, userProfileDataReducer }) => {
  return {
    order: purchaseConfigReducer.order,
    productData: purchaseConfigReducer.productData,
    insuranceData: purchaseConfigReducer.insurance,
    userProfileInfo: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname
    }
  };
};

Insurance.propTypes = {
  config: PropTypes.shape({
    bannerBgImg: PropTypes.string,
    onItsWayText: PropTypes.string,
    bannerBikeImg: PropTypes.string,
    insuranceLandingPageTitle: PropTypes.string,
    insurancePlansPageTitle: PropTypes.string,
    insurancePlansPageSecondaryText: PropTypes.string,
    comparePlansCta: PropTypes.string,
    bestSellingInsuranceTitle: PropTypes.string,
    chevronRightIcon: PropTypes.string,
    chevronDownIcon: PropTypes.string,
    tickIcon: PropTypes.string,
    bestSellingInsuranceDescription: PropTypes.arrayOf(PropTypes.any),
    additionalCoverageTitleText: PropTypes.string,
    additionalCoverageDescriptionText: PropTypes.string,
    additionalCoverageOptions: PropTypes.arrayOf(PropTypes.any),
    ownInsuranceTitle: PropTypes.string,
    ownInsuranceDescription: PropTypes.string,
    proceedBtnLabel: PropTypes.string,
    showingForText: PropTypes.string,
    sortDropdownOptions: PropTypes.arrayOf(PropTypes.any),
    sortDropdownField: PropTypes.objectOf(PropTypes.any),
    premiumPerYearText: PropTypes.string,
    insurancePlansDescriptionText: PropTypes.string,
    insurancePlansDeclaredValueText: PropTypes.string,
    chooseYourAddonsText: PropTypes.string,
    totalText: PropTypes.string,
    selectBtnCta: PropTypes.string,
    selectedBtnCta: PropTypes.string,
    comparePlansMobileTitle: PropTypes.string,
    comparePlansFirstTitle: PropTypes.string,
    comparePlansSecondTitle: PropTypes.string,
    financersText: PropTypes.string,
    policyNameText: PropTypes.string,
    addOnsText: PropTypes.string,
    backToInsurancePlanCtaLabel: PropTypes.string,
    cpaText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    buyOwnInsuranceTitle: PropTypes.string,
    buyOwnInsuranceDescription: PropTypes.string,
    addOnTooltipContent: PropTypes.arrayOf(PropTypes.any),
    optOutCPATitle: PropTypes.string,
    optOutCPADescription: PropTypes.string,
    optOutCPAFormTitle: PropTypes.string,
    optOutCPAFormOptions: PropTypes.array
  }),
  opportunityId: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  variantSku: PropTypes.string.isRequired,
  handleSubmitOwnInsurance: PropTypes.func.isRequired,
  handleSubmitBuyInsurance: PropTypes.func.isRequired,
  order: PropTypes.object,
  productData: PropTypes.object,
  userProfileInfo: PropTypes.object,
  insuranceData: PropTypes.object,
  optedBikeVariant: PropTypes.object
};

export default connect(mapStateToProps)(Insurance);
