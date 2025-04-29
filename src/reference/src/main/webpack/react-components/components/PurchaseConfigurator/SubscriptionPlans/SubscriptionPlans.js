import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SubscriptionPlanSummary from "./SubscriptionPlanSummary";
import SubscriptionPlanPopup from "./SubscriptionPlanPopup";
import Popup from "../../Popup/Popup";
import { useSubscriptionPlan } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { useEffect } from "react";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { setSubscriptionDataAction } from "../../../store/purchaseConfig/purchaseConfigActions";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import CONSTANT from "../../../../site/scripts/constant";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const SubscriptionPlans = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [filterType, setFilterType] = useState("");
  const [isComparePlan, setComparePlan] = useState(false);
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [istotalPlans, setTotalPlans] = useState(0);
  const { cmpProps, config, setSubscriptionInfo } = props;
  const { subscriptionLabels } = config;
  const { order, subscriptionPlan } = cmpProps;
  const [billingTermUnit, setBillingTermUnit] = useState(null);
  const getSubscriptionPlan = useSubscriptionPlan();

  const getSubscriptionPlanData = async () => {
    setSpinnerActionDispatcher(true);

    const subscriptionDataResult = await getSubscriptionPlan({
      variables: {
        order_id: order.orderId
      }
    });
    if (subscriptionDataResult) {
      try {
        if (subscriptionDataResult.data.getSubscriptionPlan.items.length) {
          const subscriptionPlanItems =
            subscriptionDataResult.data.getSubscriptionPlan.items;

          const billingUnits = [
            ...new Set(
              subscriptionPlanItems.map(
                (billingTerm) => billingTerm.billing_term_unit
              )
            )
          ];

          setBillingTermUnit(billingUnits.sort().reverse());

          subscriptionPlanItems.sort((element_M, element_N) => {
            return parseInt(element_N.price) - parseInt(element_M.price);
          });

          const totalPlanCount = subscriptionPlanItems.filter(
            (item) => item.billing_term_unit === billingUnits[0]
          );
          setTotalPlans(totalPlanCount.length);

          const umbrellaPlanDetails = subscriptionPlanItems.find(
            (item) =>
              item.item_code ===
              CONSTANT.SUBSCRIPTION_ITEM_CODE.UMBRELLA_ITEM_CODE
          );

          if (umbrellaPlanDetails) {
            const umbrellaPlanIndex = subscriptionPlanItems.findIndex(
              (el) =>
                el.item_code ===
                CONSTANT.SUBSCRIPTION_ITEM_CODE.UMBRELLA_ITEM_CODE
            );
            subscriptionPlanItems.splice(umbrellaPlanIndex, 1);
            subscriptionPlanItems.unshift(umbrellaPlanDetails);
          }

          setSubscriptionPlanList(subscriptionPlanItems);

          const selectedPackageId =
            subscriptionPlan.package_id ||
            umbrellaPlanDetails?.package_id ||
            null;

          if (selectedPackageId) {
            const selectedPlan = subscriptionPlanItems.find(
              (item) => item.package_id === selectedPackageId
            );
            if (selectedPlan) {
              const subscriptionPlan = {
                name: selectedPlan.name,
                billing_term_unit: selectedPlan.billing_term_unit,
                package_id: selectedPlan.package_id,
                price: selectedPlan.price,
                tax_amount: selectedPlan.tax_amount,
                tax_percentage: selectedPlan.tax_percentage
              };
              setSubscriptionInfo(subscriptionPlan);
              setSelectedEntity(selectedPackageId);
              setFilterType(selectedPlan.billing_term_unit);
            } else {
              setFilterType(billingUnits[0]);
            }
          } else {
            setFilterType(billingUnits[0]);
          }
        }
      } catch (error) {
        Logger.error(error.message);
      }
    }
  };

  useEffect(() => {
    getSubscriptionPlanData();
  }, []);

  const handleResetPlan = (event) => {
    const subscriptionPlan = {
      name: "",
      billing_term_unit: "",
      package_id: "",
      price: 0,
      tax_amount: 0,
      tax_percentage: ""
    };
    setSubscriptionInfo(subscriptionPlan);
    setSelectedEntity("");
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Top",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const handleSubscriptionSelection = (subscriptionType) => {
    const totalPlanCount = subscriptionPlanList.filter(
      (item) => item.billing_term_unit === subscriptionType
    );
    setFilterType(subscriptionType);
    setTotalPlans(totalPlanCount.length);
  };

  const handleSubscriptonPlan = (package_id) => {
    setSubscriptionInfo(
      subscriptionPlanList.find((item) => item.package_id === package_id)
    );
    setSelectedEntity(package_id);
  };

  const handleShowAllPlan = (event) => {
    setComparePlan(true);
    document.querySelector("html").classList.add("overflow-hidden");
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Top",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const closeSubscriptionPopup = () => {
    setComparePlan(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };
  return (
    <>
      {subscriptionPlanList.length !== 0 && (
        <div className="vida-subscription-plans">
          <div className="vida-subscription-plans__container">
            {selectedEntity &&
              subscriptionPlanList.map((element) => {
                if (element.package_id === selectedEntity) {
                  return (
                    <h4
                      className="vida-subscription-plans__selected-record"
                      key={selectedEntity}
                    >
                      {element.name} -{" "}
                      {currencyUtils.getCurrencyFormatValue(element.price)}
                      <a onClick={(event) => handleResetPlan(event)}>
                        {subscriptionLabels.removePlan}
                      </a>
                    </h4>
                  );
                }
              })}
            <div className="vida-subscription-plans__wrapper">
              <div className="vida-subscription-plans__subscription-selection">
                {billingTermUnit.map((name) => (
                  <span
                    key={name}
                    onClick={() => handleSubscriptionSelection(name)}
                    className={`vida-subscription-plans__subscription-selection${
                      filterType === name ? "--active" : "--inactive"
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>

              {istotalPlans ? (
                <div className="vida-subscription-plans__links-block">
                  <a onClick={(event) => handleShowAllPlan(event)}>
                    {subscriptionLabels.comparePlan}
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>

            {subscriptionPlanList.map((cardData) => {
              if (
                cardData.item_code !==
                CONSTANT.SUBSCRIPTION_ITEM_CODE.BASE_ITEM_CODE
              ) {
                return (
                  <SubscriptionPlanSummary
                    cardData={cardData}
                    key={cardData.package_id}
                    filterType={filterType}
                    selectedPlanHandler={handleSubscriptonPlan}
                    selectedEntity={selectedEntity}
                  />
                );
              }
            })}
            {isComparePlan && (
              <Popup handlePopupClose={closeSubscriptionPopup}>
                <div className="vida-subscription-plans__modal">
                  <div className="vida-subscription-plans__modal-title">
                    {subscriptionLabels.subscriptionPlan} - {filterType}
                  </div>
                  <SubscriptionPlanPopup
                    cardData={subscriptionPlanList}
                    filterType={filterType}
                    selectedPlanHandler={handleSubscriptonPlan}
                    selectedEntity={selectedEntity}
                  />
                </div>
              </Popup>
            )}
          </div>
        </div>
      )}
    </>
  );
};

SubscriptionPlans.propTypes = {
  config: PropTypes.object,
  subscriptionLabels: PropTypes.object,
  cmpProps: PropTypes.shape({
    order: PropTypes.object,
    subscriptionPlan: PropTypes.object
  }),
  setSubscriptionInfo: PropTypes.any
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      order: purchaseConfigReducer.order,
      subscriptionPlan: purchaseConfigReducer.subscriptionPlan
    }
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSubscriptionInfo: (data) => {
      dispatch(setSubscriptionDataAction(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionPlans);
