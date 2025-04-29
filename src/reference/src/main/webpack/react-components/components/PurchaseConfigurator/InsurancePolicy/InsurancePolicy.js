import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SelectPolicy, { EmptyPolicyPopup } from "../SelectPolicy/SelectPolicy";
import { connect } from "react-redux";
import {
  setSelectedPolicyDataDispatcher,
  setResetSelectedPolicyDataDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import { useInsuranceData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import Logger from "../../../../services/logger.service";

const InsurancePolicy = (props) => {
  const {
    title,
    description,
    addOnLabel,
    tenureLabel,
    nomineeInfo,
    selectPolicyBtn,
    warning,
    policySelection
  } = props.config;

  const { order, productData, insurance } = props.cmpProps;

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showSelectPolicy, setShowSelectPolicy] = useState(false);
  const [addonsList, setAddonsList] = useState([]);
  const [insurancePremiumList, setInsurancePremiumList] = useState([]);

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
                    amount: insuranceItem.amount
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
          }
          setShowSelectPolicy(isShowSelectPolicy);
        }
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

  const handleSelectPolicy = async (policyData) => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setSelectedPolicy(policyData);
    setShowSelectPolicy(false);
    setSelectedPolicyDataDispatcher(policyData);
  };

  const handleDeleteSelectedPolicy = () => {
    setSelectedPolicy(null);
    setResetSelectedPolicyDataDispatcher();
  };

  useEffect(() => {
    insurance &&
      insurance.insurerName &&
      insurance.insurerName.length > 0 &&
      setSelectedPolicy(insurance);
  }, [insurance]);

  return (
    <>
      <div className="vida-insurance-policy__container">
        <p className="vida-insurance-policy__title">{title}</p>
        <p className="vida-insurance-policy__description">{description}</p>
        {!selectedPolicy && (
          <>
            <div
              className="vida-insurance-policy__select-action"
              onClick={() =>
                handleShowSelectPolicyPopup(true, insurance.cpaOpted)
              }
            >
              {selectPolicyBtn.label}
            </div>
            <div className="vida-insurance-policy__warning">
              <section className="notification notification--warning-info">
                <div className="notification__container">
                  <div className="notification__title">
                    <span className="notification__icon">
                      <i className="icon-information-circle"></i>
                    </span>
                    <label className="notification__label">
                      {warning.title}
                    </label>
                  </div>
                  <p className="notification__description">
                    {warning.description}
                  </p>
                </div>
              </section>
            </div>
          </>
        )}
        {selectedPolicy && (
          <div className="vida-insurance-policy__details">
            <div className="vida-insurance-policy__header">
              <div className="vida-insurance-policy__title">
                <div className="vida-insurance-policy__logo">
                  <img
                    src={selectedPolicy.insuranceLogo}
                    alt={selectedPolicy.insurerName}
                  />
                </div>
                <div className="vida-insurance-policy__name">
                  You have succesfully opted for {selectedPolicy.insurerName}{" "}
                  Insurance
                </div>
              </div>
              <div className="vida-insurance-policy__actions">
                <i
                  className="icon-pencil-alt"
                  onClick={() =>
                    handleShowSelectPolicyPopup(true, insurance.cpaOpted)
                  }
                ></i>
                <i
                  className="icon-trash"
                  onClick={() => handleDeleteSelectedPolicy()}
                ></i>
              </div>
            </div>
            <div className="vida-insurance-policy__premium">
              <span>
                @{" "}
                {currencyUtils.getCurrencyFormatValue(
                  selectedPolicy.insuranceAmount
                )}{" "}
                {tenureLabel}
              </span>
            </div>
            {selectedPolicy.insuranceAddonsList &&
              selectedPolicy.insuranceAddonsList.length > 0 && (
                <div className="vida-insurance-policy__add-ons">
                  <span> {addOnLabel} </span>

                  {selectedPolicy.insuranceAddonsList.map((addOnItem) => {
                    return (
                      <p key={addOnItem.addonId}>
                        {addOnItem.parentName || addOnItem.name}
                      </p>
                    );
                  })}
                </div>
              )}

            {/* <div className="vida-insurance-policy__number">
              Your Policy no. is <span> AB12345643 </span>
            </div> */}
            <div className="vida-insurance-policy__nominee">{nomineeInfo}</div>
          </div>
        )}
      </div>
      {insurancePremiumList.length > 0 && showSelectPolicy && (
        <SelectPolicy
          config={policySelection}
          addonsList={addonsList}
          isCpaOpted={insurance.cpaOpted}
          insurancePremiumList={insurancePremiumList}
          handleShowSelectPolicyPopup={handleShowSelectPolicyPopup}
          handleSelectPolicy={handleSelectPolicy}
        />
      )}
      {(!insurancePremiumList || !insurancePremiumList.length) &&
        showSelectPolicy && (
          <EmptyPolicyPopup
            config={policySelection}
            handleShowSelectPolicyPopup={handleShowSelectPolicyPopup}
          />
        )}
    </>
  );
};

InsurancePolicy.propTypes = {
  cmpProps: PropTypes.object,
  config: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    addOnLabel: PropTypes.string,
    tenureLabel: PropTypes.string,
    nomineeInfo: PropTypes.string,
    selectPolicyBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    warning: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string
    }),
    policySelection: PropTypes.shape({
      title: PropTypes.string,
      logoURL: PropTypes.string,
      description: PropTypes.object,
      addOnLabel: PropTypes.string,
      addOnBtn: PropTypes.shape({
        label: PropTypes.string
      }),
      addPolicyBtn: PropTypes.shape({
        label: PropTypes.string
      })
    })
  })
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      order: purchaseConfigReducer.order,
      productData: purchaseConfigReducer.productData,
      insurance: purchaseConfigReducer.insurance
    }
  };
};

export default connect(mapStateToProps)(InsurancePolicy);
