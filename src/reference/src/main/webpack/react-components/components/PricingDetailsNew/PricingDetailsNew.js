import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Popup from "../Popup/Popup";
import { connect } from "react-redux";
import SelectPolicyNew, {
  EmptyPolicyPopupNew
} from "./SelectPolicyNew/SelectPolicyNew";
import ExchangeTrackerStatus from "../PurchaseConfigurator/ExchangeTrackerStatus/ExchangeTrackerStatus";
import ExchangeTrackerSteps from "../PurchaseConfigurator/ExchangeTrackerSteps/ExchangeTrackerSteps";
import {
  clearTradeInDataDispatcher,
  setTradeInDataDispatcher,
  setUpdatedPolicyDataDispatcher
} from "../../store/purchaseConfig/purchaseConfigActions";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import {
  setSubscriptionDataDispatcher,
  setSelectedPolicyDataDispatcher,
  setResetSelectedPolicyDataDispatcher,
  setResetAddonDataDispatcher
} from "../../store/purchaseConfig/purchaseConfigActions";
import {
  useInsuranceData,
  useExchangeAgreed
} from "../../hooks/purchaseConfig/purchaseConfigHooks";
import Logger from "../../../services/logger.service";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import ReactTooltip from "react-tooltip";

const PricingDetailsNew = (props) => {
  const {
    pricingConfig,
    payment,
    insurance,
    aadhar,
    productData,
    subscriptionPlan,
    homeDelivery,
    tradeIn,
    policySelection,
    order,
    exchangePolicyDetails,
    showInsuranceCheckPopup,
    setShowInsuranceCheckPopup,
    callPaymentFunction,
    setSubsidyChecked,
    subsidyChecked,
    tradeInSelected,
    popupError,
    setExchangeSelected,
    showSubsidyCheckPopup,
    setShowSubsidyCheckPopup,
    setHasExchangeApprovedChanged,
    hasExchangeApprovedChanged
  } = props;
  const exchangeAgreed = useExchangeAgreed();
  const { exchangePolicy, tradeInPlan } = exchangePolicyDetails;
  const [showExchangeDetails, setShowExchangeDetails] = useState(false);
  const [notSelectedCovers, setNotSelectedCovers] = useState([]);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [errorPopup, setErrorPopup] = useState(false);

  const [oldInsurance, setOldInsurance] = useState(0);
  const [oldExchangeAmount, setOldExchangeAmount] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showSelectPolicy, setShowSelectPolicy] = useState(false);
  const [addonsList, setAddonsList] = useState([]);
  const [insurancePremiumList, setInsurancePremiumList] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [oldInsuranceAmt, setOldInsuranceAmt] = useState(0);
  const [isUserChagedSubsidy, setIsUserChangedSubsidy] = useState(false);
  const [showCoverCheckPopup, setShowCoverCheckPopup] = useState(false);
  const [hasCustomerChangedInsurance, setHasCustomerChangedInsurance] =
    useState("");
  const [hasExchangeChanged, setHasExchangeChanged] = useState(false);
  const [isAddonTriggered, setIsAddonTriggered] = useState(false);
  const [isAddonUpdated, setIsAddonUpdated] = useState(false);
  const [subsidyAmount, setSubsidyAmount] = useState(0);
  const [insuranceList, setInsuranceList] = useState([]);
  const [isAddPolicy, setIsAddPolicy] = useState(false);
  const [isUpdateAddon, setIsUpdateAddon] = useState(false);
  const [selectPolicyData, setSelectPolicyData] = useState();
  const notInitialRender = useRef(false);

  /********************************************************************
   ********************** Exchange Container Start********************
   ********************************************************************/
  // useEffect(() => {
  //   setSubsidyAmount(aadhar.fameSubsidyAmount);
  // }, [aadhar.fameSubsidyAmount]);

  useEffect(() => {
    setSubsidyAmount(aadhar.empsSubsidyAmount);
  }, [aadhar.empsSubsidyAmount]);

  useEffect(() => {
    if (homeDelivery.homeDeliverySelected) {
      setGrandTotal(
        grandTotal + (homeDelivery.amount + homeDelivery.tax_amount)
      );
    } else {
      setGrandTotal(
        grandTotal - (homeDelivery.amount + homeDelivery.tax_amount)
      );
    }
  }, [homeDelivery.homeDeliverySelected]);

  useEffect(() => {
    setGrandTotal(payment.updatedOrderGrandTotal);
  }, [payment.updatedOrderGrandTotal]);
  useEffect(() => {
    if (showCoverCheckPopup) {
      const addonItems =
        selectedPolicy && selectedPolicy.validAddons
          ? selectedPolicy.validAddons
          : addonsList;
      setNotSelectedCovers(addonItems.filter((data) => !data.selected));
    }
  }, [showCoverCheckPopup]);
  useEffect(() => {
    if (errorPopup) {
      setGrandTotal(Number(grandTotal) + Number(oldExchangeAmount));
    }
  }, [errorPopup]);

  // useEffect(() => {
  //   //if amount already selected then don't add or remove from total
  //   //if unchecked first time remove the fame subsidy amount not the eligible amount
  //   //if checked again then add eligible amount
  //   //if then unchecked again remove eligible amount
  //   if (isUserChagedSubsidy) {
  //     if (subsidyChecked) {
  //       const calculateSubsidyAmount = aadhar.fameSubsidyEligibleAmount;
  //       setGrandTotal(Number(grandTotal) - calculateSubsidyAmount);
  //       setSubsidyAmount(calculateSubsidyAmount);
  //     } else {
  //       // calculateSubsidyAmount = subsidyAmount;
  //       const subsidyAdded = subsidyAmount;
  //       setGrandTotal(Number(grandTotal) + Number(subsidyAdded));
  //       setSubsidyAmount(0);
  //     }
  //   }
  // }, [isUserChagedSubsidy, subsidyChecked]);
  useEffect(() => {
    //if amount already selected then don't add or remove from total
    //if unchecked first time remove the fame subsidy amount not the eligible amount
    //if checked again then add eligible amount
    //if then unchecked again remove eligible amount
    if (isUserChagedSubsidy) {
      if (subsidyChecked) {
        const calculateSubsidyAmount = aadhar.empsSubsidyEligibleAmount;
        setGrandTotal(Number(grandTotal) - calculateSubsidyAmount);
        setSubsidyAmount(calculateSubsidyAmount);
      } else {
        // calculateSubsidyAmount = subsidyAmount;
        const subsidyAdded = subsidyAmount;
        setGrandTotal(Number(grandTotal) + Number(subsidyAdded));
        setSubsidyAmount(0);
      }
    }
  }, [isUserChagedSubsidy, subsidyChecked]);

  useEffect(() => {
    if (hasExchangeChanged) {
      if (tradeIn.exchange_approved) {
        setGrandTotal(Number(grandTotal) + Number(oldExchangeAmount));
        setTradeInDataDispatcher({ exchange_approved: false });
      }
      setHasExchangeApprovedChanged(true);
      setHasExchangeChanged(false);
    }
  }, [hasExchangeChanged]);

  useEffect(() => {
    if (hasCustomerChangedInsurance) {
      if (
        (hasCustomerChangedInsurance === "update" ||
          hasCustomerChangedInsurance === "add") &&
        insurance.insuranceAmount > 0
      ) {
        setGrandTotal(
          Number(grandTotal) -
            Number(oldInsuranceAmt) +
            parseInt(insurance.insuranceAmount)
        );
      } else if (hasCustomerChangedInsurance === "delete") {
        setGrandTotal(Number(grandTotal) - parseInt(oldInsurance));
      }
      setOldInsuranceAmt(insurance.insuranceAmount);
      setHasCustomerChangedInsurance("");
    } else if (insurance.insuranceAmount) {
      setOldInsuranceAmt(insurance.insuranceAmount);
    }
  }, [hasCustomerChangedInsurance, insurance.insuranceAmount]);

  useEffect(() => {
    if (insurance.insuranceAddonsList) {
      setInsuranceList(insurance.insuranceAddonsList);
    }
  }, [insurance.insuranceAddonsList]);

  const handleClosePopup = (data) => {
    if (data) {
      clearTradeInDataDispatcher();
    }
    setShowExchangeDetails(false);
    if (!tradeInSelected) {
      setExchangeSelected(false);
    }
  };

  const handleError = () => {
    setTradeInDataDispatcher({
      popupError: false
    });
    setErrorPopup(false);
    handleClosePopup(true);
  };
  useEffect(() => {
    setErrorPopup(popupError);
  }, [popupError]);

  useEffect(() => {
    if (showExchangeDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [showExchangeDetails]);

  const handleExchageScooter = (isEdit = false) => {
    setOldExchangeAmount(tradeIn.exchange_amount);
    setShowExchangeDetails(true);
    if (isAnalyticsEnabled) {
      if (isEdit) {
        const customLink = {
          name: "Edit",
          position: "Bottom",
          type: "Icon",
          clickType: "other"
        };
        const additionalPageName = ":Edit";
        analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
      } else {
        analyticsUtils.trackExchangeStart();
      }
    }
  };

  const handleNotInterestedInExchange = () => {
    if (oldExchangeAmount > 0 && tradeIn.exchange_approved) {
      setGrandTotal(Number(grandTotal) + parseInt(tradeIn.exchange_amount));
    }
  };

  const handleAccept = async () => {
    setSpinnerActionDispatcher(true);
    exchangeAgreed({
      variables: {
        agreed_flag: "y",
        order_id: order.orderId
      }
    }).then((result) => {
      if (
        result.data &&
        result.data.ExchangeAgreed &&
        result.data.ExchangeAgreed.status == "200"
      ) {
        setShowExchangeDetails(false);
        setTradeInDataDispatcher({ tradeInSelected: true });
        setExchangeSelected(true);
        if (isAnalyticsEnabled) {
          analyticsUtils.trackExchangeCompleted();
        }
        setHasExchangeChanged(true);
      } else {
        setTradeInDataDispatcher({
          popupError: true
        });

        handleClosePopup();
        setShowExchangeDetails(false);
        setSpinnerActionDispatcher(false);
      }
    });
  };
  /********************************************************************
   ********************** Exchange Container End********************
   ********************************************************************/

  /********************************************************************
   ********************** Insurance Container Start********************
   ********************************************************************/
  const getInsuranceData = useInsuranceData();
  const handleShowSelectPolicyPopup = async (
    isShowSelectPolicy,
    isCpaOpted,
    selectedAddons
  ) => {
    try {
      if (isShowSelectPolicy) {
        const addonParam = [];
        if (selectedAddons) {
          selectedAddons.length > 0 &&
            selectedAddons.forEach((addon) =>
              addonParam.push(addon.name.toLowerCase().replaceAll(" ", ""))
            );
        } else {
          insurance.insuranceAddonsList.length > 0 &&
            insurance.insuranceAddonsList.forEach((addon) => {
              const addonName = addon.parentName || addon.name;
              addonParam.push(addonName.toLowerCase().replaceAll(" ", ""));
            });
        }

        document.querySelector("html").classList.add("overflow-hidden");
        setSpinnerActionDispatcher(true);

        const result = await getInsuranceData({
          variables: {
            opportunity_id: order.opportunityId,
            order_id: order.orderId,
            sf_itemsku_id: productData.variantSku,
            sf_item_id: productData.sku,
            addons: addonParam.toString(),
            cpa_opted: isCpaOpted ? "Y" : "N"
          }
        });
        const addonsListRes = result.data.getQuotation.items[0].addonsItems.map(
          (option) => {
            return {
              ...option,
              selected: false
            };
          }
        );

        const insuranceListRes =
          result.data.getQuotation.items[0].insurancePremium.map((item) => {
            const resultItem = {
              ...item,
              hasAddOns: false,
              validAddons: []
            };
            for (const option of addonsListRes) {
              for (const insuranceItem of option.insuranceName) {
                if (item.insurancerId === insuranceItem.insurancerId) {
                  resultItem.validAddons.push({
                    selected: false,
                    name: option.name,
                    addonId: insuranceItem.addonId,
                    amount: insuranceItem.amount,
                    tooltips: option.tooltips
                  });
                }
              }
            }
            return resultItem;
          });

        if (addonsListRes.length > 0 && insuranceListRes.length > 0) {
          const selectedAddOnList = [];
          if (selectedAddons) {
            selectedAddons.length > 0 &&
              selectedAddons.forEach((selectedAddOn) =>
                selectedAddOnList.push(selectedAddOn.name)
              );
          } else {
            insurance.insuranceAddonsList.length > 0 &&
              insurance.insuranceAddonsList.forEach((selectedAddOn) =>
                selectedAddOnList.push(
                  selectedAddOn.parentName || selectedAddOn.name
                )
              );
          }

          if (selectedAddOnList.length > 0) {
            const addOnOptionsList = [];
            const insuranceOptionsList = insuranceListRes;

            for (const option of addonsListRes) {
              addOnOptionsList.push({
                ...option,
                selected: selectedAddOnList.includes(option.name)
              });
            }

            for (const option of insuranceOptionsList) {
              for (const validAddon of option.validAddons) {
                validAddon.selected = selectedAddOnList.includes(
                  validAddon.name
                );
              }
              option.hasAddOns =
                option.validAddons.filter((addOn) => addOn.selected).length > 0;
            }

            setAddonsList(addOnOptionsList);
            setInsurancePremiumList(insuranceOptionsList);
          } else {
            setAddonsList(addonsListRes);
            setInsurancePremiumList(insuranceListRes);
            setResetAddonDataDispatcher();
          }
          setShowSelectPolicy(isShowSelectPolicy);
          if (selectedPolicy) {
            //when we click add/update cover - premium policy date update
            const selectedInsurancePremiumItem = insuranceListRes.find(
              (option) => option.insurancerId === selectedPolicy.insurerId
            );

            setUpdatedPolicyDataDispatcher(selectedInsurancePremiumItem);
          }
        }
        setHasCustomerChangedInsurance("update");
      } else {
        setShowSelectPolicy(isShowSelectPolicy);
        document.querySelector("html").classList.remove("overflow-hidden");
      }
    } catch (error) {
      setInsurancePremiumList([]);
      setShowSelectPolicy(true);
      Logger.error(error);
    }
  };

  const handleSelectPolicy = async (policyData, skipAddonCheck = false) => {
    setSelectPolicyData(policyData);
    let selectedAddons =
      policyData.validAddons || policyData.insuranceAddonsList;
    selectedAddons = selectedAddons.filter((data) => data.selected);
    if (selectedAddons.length < addonsList.length && !skipAddonCheck) {
      setShowCoverCheckPopup(true);
      setIsAddPolicy(true);
    } else {
      setSelectedPolicy(policyData);
      document.querySelector("html").classList.remove("overflow-hidden");
      setShowSelectPolicy(false);
      setSelectedPolicyDataDispatcher(policyData);
      setHasCustomerChangedInsurance("add");
    }
  };

  const handleDeleteSelectedPolicy = () => {
    setOldInsurance(insurance.insuranceAmount);
    setShowSelectPolicy(false);
    setShowInsuranceCheckPopup(true);
    //setSelectedPolicy(null);
    //setResetSelectedPolicyDataDispatcher();
    setHasCustomerChangedInsurance("delete");
  };

  const handleSubsidyChecked = (e) => {
    setSubsidyChecked(e.target.checked);
    setIsUserChangedSubsidy(true);
  };
  const handlePopupOkBtnClick = () => {
    ///when customer clicks on add policy
    //we check if addons are selected or not
    //if not all selected then we show popup
    //on popup ok we trigger addpolicy function

    //we need to know what had triggered the popup and save that trigger
    //then call he needed function after that
    setShowCoverCheckPopup(false);

    if (isAddPolicy) {
      handleSelectPolicy(selectPolicyData, true);
    } else {
      setIsAddonUpdated(isUpdateAddon);
      setIsAddonTriggered(true);
    }
  };

  useEffect(() => {
    insurance &&
      insurance.insurerName &&
      insurance.insurerName.length > 0 &&
      setSelectedPolicy(insurance);
  }, [insurance]);

  /********************************************************************
   ********************** Insurance Container End********************
   ********************************************************************/

  useEffect(() => {
    if (subscriptionPlan.package_id) {
      const planDetails = {
        name: subscriptionPlan.name,
        package_id: subscriptionPlan.package_id,
        price: subscriptionPlan.price,
        tax_amount: subscriptionPlan.tax_amount,
        tax_percentage: subscriptionPlan.tax_percentage
      };
      setSubscriptionDataDispatcher(planDetails);
    }
  }, [subscriptionPlan.package_id]);

  return (
    <div className="vida-pricing-new">
      <div className="vida-pricing-new__heading">
        <h3>{pricingConfig.title}</h3>
      </div>
      <div className="vida-pricing-new__content">
        <div className="vida-pricing-new__price-detail">
          <div className="vida-pricing-new__price-info">
            <label>{pricingConfig.basePrice.basePriceLabel}</label>
            <span className="vida-pricing-new__price">
              {currencyUtils.getCurrencyFormatValue(payment.basePrice)}
            </span>
          </div>
          {
            <div className="vida-pricing-new__price-info">
              <label>
                {pricingConfig.configure.configureLabel}
                {pricingConfig.configure.info && (
                  <>
                    <span
                      className="notification__icon"
                      data-tip={pricingConfig.configure.info}
                      data-for={pricingConfig.configure.id}
                    >
                      <i className="icon-information-circle"></i>
                    </span>
                    <ReactTooltip
                      place={pricingConfig.configure.infoPosition}
                      type="warning"
                      effect="solid"
                      id={pricingConfig.configure.id}
                    />
                  </>
                )}
              </label>

              <span className="vida-pricing-new__price">
                {currencyUtils.getCurrencyFormatValue(payment.configurePrice)}
              </span>
            </div>
          }
          {payment.otherCharges !== 0 && (
            <div className="vida-pricing-new__price-info">
              <label>
                {pricingConfig.otherCharges.otherChargesLabel}
                {pricingConfig.otherCharges.info && (
                  <>
                    <span
                      className="notification__icon"
                      data-tip={pricingConfig.otherCharges.info}
                      data-for={pricingConfig.otherCharges.id}
                    >
                      <i className="icon-information-circle"></i>
                    </span>
                    <ReactTooltip
                      place={pricingConfig.otherCharges.infoPosition}
                      type="warning"
                      effect="solid"
                      id={pricingConfig.otherCharges.id}
                    />
                  </>
                )}
              </label>
              <span className="vida-pricing-new__price">
                {currencyUtils.getCurrencyFormatValue(payment.otherCharges)}
              </span>
            </div>
          )}

          <div className="vida-pricing-new__price-info">
            <label>
              {pricingConfig.addOns.addonsLabel}
              {pricingConfig.addOns.info && (
                <>
                  <span
                    className="notification__icon"
                    data-tip={pricingConfig.addOns.info}
                    data-for={pricingConfig.addOns.id}
                  >
                    <i className="icon-information-circle"></i>
                  </span>
                  <ReactTooltip
                    place={pricingConfig.addOns.infoPosition}
                    type="warning"
                    effect="solid"
                    id={pricingConfig.addOns.id}
                  />
                </>
              )}
            </label>
            <span className="vida-pricing-new__price">
              {currencyUtils.getCurrencyFormatValue(payment.addonsPrice)}
            </span>
          </div>
          {insurance.insuranceAmount !== 0 && (
            <div className="vida-pricing-new__price-info">
              <label>
                {insurance.insurerName}
                <span
                  className="icon-pencil-alt"
                  onClick={() => {
                    handleShowSelectPolicyPopup(true, insurance.cpaOpted);
                  }}
                ></span>
              </label>
              <span className="vida-pricing-new__price">
                {currencyUtils.getCurrencyFormatValue(
                  insurance.insuranceBasePrice
                )}
              </span>
            </div>
          )}

          {subscriptionPlan.package_id && (
            <div className="vida-pricing-new__price-info">
              <label>{subscriptionPlan.name}</label>
              <span className="vida-pricing-new__price">
                {currencyUtils.getCurrencyFormatValue(subscriptionPlan.price)}
              </span>
            </div>
          )}

          {/* {payment.updatedOrderTax !== 0 && ( */}
          <div className="vida-pricing-new__price-info">
            <label>
              {pricingConfig.gst.gstLabel}
              <>
                <span
                  className="notification__icon"
                  data-tip={pricingConfig.gst.info}
                  data-for={pricingConfig.gst.id}
                >
                  <i className="icon-information-circle"></i>
                </span>
                <ReactTooltip
                  place={pricingConfig.gst.infoPosition}
                  type="warning"
                  effect="solid"
                  id={pricingConfig.gst.id}
                />
              </>
            </label>
            <span className="vida-pricing-new__price">
              {currencyUtils.getCurrencyFormatValue(
                homeDelivery.homeDeliverySelected && homeDelivery.amount
                  ? payment.gstAmount +
                      homeDelivery.tax_amount +
                      insurance.insuranceGstAmount
                  : payment.gstAmount + insurance.insuranceGstAmount
              )}
            </span>
          </div>
          {/* )} */}
          {homeDelivery.homeDeliverySelected && homeDelivery.amount != 0 && (
            <div className="vida-pricing-new__price-info">
              <label>{pricingConfig.homeDeliveryLabel}</label>
              <span className="vida-pricing-new__price ">
                {currencyUtils.getCurrencyFormatValue(homeDelivery.amount)}
              </span>
            </div>
          )}
          {/* {aadhar && aadhar.aadharSelected && aadhar.aadharUsedForRegister && ( */}
          {/* Removing Fame Subsidy as per Requirement on MAR 30 */}
          <div className="vida-pricing-new__price-info">
            <div className="vida-pricing-new__subsidy-checkbox form__group form__field-checkbox">
              <label className="vida-pricing-new__subsidy-label">
                <span className="vida-pricing-new__subsidy-heading">
                  {pricingConfig.subsidy.subsidyLabel}
                </span>
                {pricingConfig.subsidy.info && (
                  <>
                    <span
                      className="notification__icon"
                      data-tip={pricingConfig.subsidy.info}
                      data-for={pricingConfig.subsidy.id}
                    >
                      <i className="icon-information-circle"></i>
                    </span>
                    <ReactTooltip
                      place={pricingConfig.subsidy.infoPosition}
                      type="warning"
                      effect="solid"
                      id={pricingConfig.subsidy.id}
                    />
                  </>
                )}
                <input
                  type="checkbox"
                  // ref={setCheckboxRef}
                  checked={subsidyChecked}
                  onChange={(e) => handleSubsidyChecked(e)}
                />
                <span className="form__field-checkbox-mark"></span>
              </label>
            </div>
            <span className="vida-pricing-new__price vida-pricing-new__price--deduct">
              (- {currencyUtils.getCurrencyFormatValue(subsidyAmount)})
            </span>
          </div>
          {/* )} */}
          {/* {payment.prebookingPricePaid !== 0 && ( */}
          <div className="vida-pricing-new__price-info">
            <label>{pricingConfig.prebookingPricePaidLabel}</label>
            <span className="vida-pricing-new__price vida-pricing-new__price--deduct">
              (-{" "}
              {currencyUtils.getCurrencyFormatValue(
                payment.prebookingPricePaid
              )}
              )
            </span>
          </div>
          {tradeIn.exchange_amount > 0 && (
            <div className="vida-pricing-new__price-info">
              <label>
                {pricingConfig.exchange.exchangeLabel}
                <span
                  onClick={() => {
                    handleExchageScooter(true);
                  }}
                  className="icon-pencil-alt"
                ></span>
                {pricingConfig.exchange.info && (
                  <>
                    <span
                      className="notification__icon"
                      data-tip={pricingConfig.exchange.info}
                      data-for={pricingConfig.exchange.id}
                    >
                      <i className="icon-information-circle"></i>
                    </span>
                    <ReactTooltip
                      place={pricingConfig.exchange.infoPosition}
                      type="warning"
                      effect="solid"
                      id={pricingConfig.exchange.id}
                    />
                  </>
                )}
              </label>
              <span
                className={
                  "vida-pricing-new__price vida-pricing-new__price--deduct exchange" +
                  (tradeIn.exchange_approved && !hasExchangeApprovedChanged
                    ? "vida-pricing-new__price vida-pricing-new__price--deduct exchange-approved"
                    : "")
                }
              >
                ( -{" "}
                {currencyUtils.getCurrencyFormatValue(tradeIn.exchange_amount)})
              </span>
            </div>
          )}
          {insurance.insuranceBasePrice === 0 && (
            <a
              className="vida-pricing-new__popup-link"
              href="#"
              onClick={() => {
                handleShowSelectPolicyPopup(true, insurance.cpaOpted);
              }}
            >
              {pricingConfig.insurance.InsuranceLabel}
            </a>
          )}
          {tradeIn.exchange_amount === 0 && (
            <a
              className="vida-pricing-new__popup-link"
              href="#"
              onClick={() => {
                handleExchageScooter();
              }}
            >
              {pricingConfig.tradeIn.tradeinLabel}
            </a>
          )}
        </div>
        <div className="vida-pricing-new__product">
          <p className="vida-pricing-new__product-heading">
            <span>{productData.name}</span>
            {grandTotal !== 0 && (
              <span>{currencyUtils.getCurrencyFormatValue(grandTotal)}</span>
            )}
          </p>

          <label className="vida-pricing-new__final-price-message">
            {pricingConfig.priceMessage}
          </label>
        </div>

        {insurancePremiumList.length > 0 && showSelectPolicy && (
          <SelectPolicyNew
            config={policySelection}
            addonsList={addonsList}
            isCpaOpted={insurance.cpaOpted}
            insurancePremiumList={insurancePremiumList}
            handleShowSelectPolicyPopup={handleShowSelectPolicyPopup}
            selectedInsurerId={insurance.insurerId}
            handleSelectPolicy={handleSelectPolicy}
            handleDeleteSelectedPolicy={handleDeleteSelectedPolicy}
            insuranceAddonsList={insuranceList}
            setHasCustomerChangedInsurance={setHasCustomerChangedInsurance}
            setShowCoverCheckPopup={setShowCoverCheckPopup}
            isAddonTriggered={isAddonTriggered}
            setIsAddonTriggered={setIsAddonTriggered}
            isAddonUpdated={isAddonUpdated}
            setIsUpdateAddon={setIsUpdateAddon}
            setIsAddPolicy={setIsAddPolicy}
          />
        )}
        {(!insurancePremiumList || !insurancePremiumList.length) &&
          showSelectPolicy && (
            <EmptyPolicyPopupNew
              config={policySelection}
              handleShowSelectPolicyPopup={handleShowSelectPolicyPopup}
            />
          )}
      </div>

      {/* Reverted */}
      {/* {showNewExchangeDetails && (
        <Popup mode="full-screen" handlePopupClose={handleClosePopup}>
          <div className="vida-trade-in__container">
            <div className="vida-trade-in__header">
              <div>
                <span className="vida-trade-in__title">
                  {exchangePolicy.title}
                </span>
                <span className="vida-trade-in__description">
                  {exchangePolicy.description}
                </span>
              </div>
              <picture className="vida-trade-in__logo-lg">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <div className="vida-trade-in__header-mobile">
              <span className="vida-trade-in__description-mobile">
                {exchangePolicy.description}
              </span>

              <picture className="vida-trade-in__logo-lg-mobile">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <div>
              <ExchangeTrackerSteps
                vehiclePurchaseConfig={exchangePolicy}
                handlePopupClose={handleClosePopup}
                handleAccept={handleAccept}
                orderId={order.orderId}
                handleNotInterestedInExchange={handleNotInterestedInExchange}
                tradeInSelected={tradeInSelected}
              ></ExchangeTrackerSteps>
            </div>
          </div>
        </Popup>
      )} */}

      {showExchangeDetails && (
        <Popup mode="full-screen" handlePopupClose={handleClosePopup}>
          <div className="vida-trade-in__container">
            <div className="vida-trade-in__header">
              <div>
                <span className="vida-trade-in__title">
                  {exchangePolicy.title}
                </span>
                <span className="vida-trade-in__description">
                  {exchangePolicy.description}
                </span>
                <div className="vida-trade-in__info">{exchangePolicy.info}</div>
              </div>
              <picture className="vida-trade-in__logo-lg">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <div className="vida-trade-in__header-mobile">
              <span className="vida-trade-in__description-mobile">
                {exchangePolicy.description}
              </span>

              <picture className="vida-trade-in__logo-lg-mobile">
                <img
                  src={exchangePolicy.poweredByImg}
                  alt="powered by "
                  className="vida-trade-in__logo"
                />
              </picture>
            </div>
            <ExchangeTrackerStatus
              config={exchangePolicy}
            ></ExchangeTrackerStatus>
            <div>
              <ExchangeTrackerSteps
                vehiclePurchaseConfig={exchangePolicy}
                handlePopupClose={handleClosePopup}
                handleAccept={handleAccept}
                orderId={order.orderId}
                handleNotInterestedInExchange={handleNotInterestedInExchange}
                tradeInSelected={tradeInSelected}
                setHasExchangeApprovedChanged={setHasExchangeApprovedChanged}
              ></ExchangeTrackerSteps>
            </div>
          </div>
        </Popup>
      )}

      {errorPopup && (
        <div className="vida-pricing-new__popup-wrapper vida-pricing-new__exchangeerror-popup">
          <Popup handlePopupClose={handleError} mode="medium">
            <h3 className="vida-exchange-tracker-steps__popup-title">
              {tradeInPlan.confirmation.title}
            </h3>
            <p className="vida-exchange-tracker-steps__popup-desc">
              {tradeInPlan.confirmation.description}
            </p>
            <div className="vida-exchange-tracker-steps__popup-btn-wrapper">
              <button className="btn btn--primary" onClick={handleError}>
                {tradeInPlan.confirmation.okBtn.label}
              </button>
            </div>
          </Popup>
        </div>
      )}

      {showInsuranceCheckPopup && (
        <div className="vida-pricing-new__popup-wrapper vida-pricing-new__insurancecheck-popup">
          <Popup
            mode="medium"
            handlePopupClose={() => setShowInsuranceCheckPopup(false)}
          >
            <div className="vida-pricing-new__popup">
              <h4>{pricingConfig.insurance.warning.title}</h4>
              <p>{pricingConfig.insurance.warning.description}</p>

              <div className="vida-pricing-new__insure-btn-container">
                <button
                  className="btn btn--primary"
                  onClick={(event) => {
                    setSelectedPolicy(null);
                    setResetSelectedPolicyDataDispatcher();
                    setShowInsuranceCheckPopup(false);
                    callPaymentFunction && callPaymentFunction();
                  }}
                >
                  {pricingConfig.insurance.yesBtn.label}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={(event) => {
                    setShowInsuranceCheckPopup(false);
                    //setShowSelectPolicy(true);
                    handleShowSelectPolicyPopup(true, insurance.cpaOpted);
                  }}
                >
                  {pricingConfig.insurance.noBtn.label}
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
      {showCoverCheckPopup && (
        <div className="vida-pricing-new__popup-wrapper vida-pricing-new__insurancewarning-popup">
          <Popup
            mode="medium"
            handlePopupClose={() => setShowCoverCheckPopup(false)}
          >
            <div className="vida-pricing-new__popup">
              <h4>{pricingConfig.insurance.coverWarning.title}</h4>
              <p>{pricingConfig.insurance.coverWarning.description}</p>
              <ul className="vida-pricing-new__popup-list">
                {notSelectedCovers.map((item, index) => {
                  return (
                    <li key={index}>
                      {item.name} - {item.tooltips}
                    </li>
                  );
                })}
              </ul>
              <div className="vida-pricing-new__insure-btn-container">
                <button
                  className="btn btn--primary"
                  onClick={() => handlePopupOkBtnClick()}
                >
                  {pricingConfig.insurance.coverWarning.okBtnLabel}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={(event) => {
                    setShowCoverCheckPopup(false);
                  }}
                >
                  {pricingConfig.insurance.coverWarning.cancelBtn}
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
      {showSubsidyCheckPopup && (
        <div className="vida-pricing-new__popup-wrapper vida-pricing-new__subsidycheck-popup">
          <Popup
            mode="medium"
            handlePopupClose={() => setShowSubsidyCheckPopup(false)}
          >
            <div className="vida-pricing-new__popup">
              <h4>{pricingConfig.subsidy.warning.title}</h4>
              <p>{pricingConfig.subsidy.warning.description}</p>

              <div className="vida-pricing-new__insure-btn-container">
                <button
                  className="btn btn--primary"
                  onClick={(event) => {
                    setShowSubsidyCheckPopup(false);
                    callPaymentFunction && callPaymentFunction();
                  }}
                >
                  {pricingConfig.subsidy.yesBtn.label}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={(event) => {
                    setShowSubsidyCheckPopup(false);
                  }}
                >
                  {pricingConfig.subsidy.noBtn.label}
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
    </div>
  );
};

PricingDetailsNew.propTypes = {
  pricingConfig: PropTypes.shape({
    title: PropTypes.string,
    basePrice: PropTypes.object,
    configure: PropTypes.object,
    addOns: PropTypes.object,
    otherCharges: PropTypes.object,
    gst: PropTypes.object,
    exchange: PropTypes.object,
    prebookingPricePaidLabel: PropTypes.string,
    homeDeliveryLabel: PropTypes.string,
    deliveryMessage: PropTypes.string,
    priceMessage: PropTypes.string,
    insurance: PropTypes.object,
    subsidy: PropTypes.object,
    tradeIn: PropTypes.object,
    pricingConfig: PropTypes.object
  }),
  payment: PropTypes.object,
  insurance: PropTypes.object,
  gst: PropTypes.object,
  aadhar: PropTypes.object,
  order: PropTypes.object,
  productData: PropTypes.object,
  tradeIn: PropTypes.object,
  subscriptionPlan: PropTypes.object,
  homeDelivery: PropTypes.object,
  policySelection: PropTypes.object,
  exchangePolicyDetails: PropTypes.object,
  setShowInsuranceCheckPopup: PropTypes.func,
  showInsuranceCheckPopup: PropTypes.bool,
  callPaymentFunction: PropTypes.any,
  setSubsidyChecked: PropTypes.func,
  subsidyChecked: PropTypes.bool,
  tradeInSelected: PropTypes.bool,
  popupError: PropTypes.bool,
  setExchangeSelected: PropTypes.func,
  showSubsidyCheckPopup: PropTypes.bool,
  setShowSubsidyCheckPopup: PropTypes.func,
  homeDeliveryOpted: PropTypes.bool,
  setHasExchangeApprovedChanged: PropTypes.func,
  hasExchangeApprovedChanged: PropTypes.bool
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    payment: purchaseConfigReducer.payment,
    insurance: purchaseConfigReducer.insurance,
    gst: purchaseConfigReducer.gst,
    aadhar: purchaseConfigReducer.aadhar,
    productData: purchaseConfigReducer.productData,
    subscriptionPlan: purchaseConfigReducer.subscriptionPlan,
    homeDelivery: purchaseConfigReducer.homeDelivery,
    tradeIn: purchaseConfigReducer.tradeIn,
    order: purchaseConfigReducer.order
  };
};

export default connect(mapStateToProps)(PricingDetailsNew);
