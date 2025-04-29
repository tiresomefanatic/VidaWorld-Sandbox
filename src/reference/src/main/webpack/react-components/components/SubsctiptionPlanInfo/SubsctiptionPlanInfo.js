import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSubscriptionPlan } from "../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";
import CONSTANT from "../../../site/scripts/constant";
import Popup from "../Popup/Popup";
import SubsctiptionPlanInfoPopup from "./SubsctiptionPlanInfoPopup";
import appUtils from "../../../site/scripts/utils/appUtils";

const SubsctiptionPlanInfo = (props) => {
  const { config } = props;
  const { planCard, planCardPopup } = config;
  const { planCardTitle, planCardDesc, planCardLink } = planCard;

  const imgPath = appUtils.getConfig("imgPath");

  const [billingTermUnit, setBillingTermUnit] = useState(null);
  const [subscriptionPlanList, setSubscriptionPlanList] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [isComparePlan, setComparePlan] = useState(false);

  const getSubscriptionPlan = useSubscriptionPlan();
  const getSubscriptionPlanData = async () => {
    setSpinnerActionDispatcher(true);
    const subscriptionDataResult = await getSubscriptionPlan();
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
          setFilterType(billingUnits[0]);
        }
      } catch (error) {
        Logger.error(error.message);
      }
    }
  };

  useEffect(() => {
    getSubscriptionPlanData();
  }, []);

  const handleShowAllPlan = () => {
    setComparePlan(true);
    document.querySelector("html").classList.add("overflow-hidden");
  };

  const closeSubscriptionPopup = () => {
    setComparePlan(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleSubscriptionSelection = (subscriptionType) => {
    setFilterType(subscriptionType);
  };

  return (
    <>
      <section className="vida-subsctiption-plan-info">
        <div className="vida-subsctiption-plan-info__wrapper">
          <div className="vida-subsctiption-plan-info__box">
            <div className="vida-subsctiption-plan-info__box-icon">
              <img src={`${imgPath}subscription-plan-icon.png`} />
            </div>
            <div className="vida-subsctiption-plan-info__box-set">
              <div className="vida-subsctiption-plan-info__box-details">
                <div className="vida-subsctiption-plan-info__box-name">
                  {planCardTitle}
                </div>
                <div className="vida-subsctiption-plan-info__box-desc">
                  {planCardDesc}
                </div>
              </div>
              <span
                className="vida-subsctiption-plan-info__configure"
                onClick={handleShowAllPlan}
              >
                {planCardLink}
              </span>
            </div>
          </div>
        </div>

        {isComparePlan && (
          <Popup handlePopupClose={closeSubscriptionPopup}>
            <div className="vida-subscription-plans__modal">
              <SubsctiptionPlanInfoPopup
                cardData={subscriptionPlanList}
                filterType={filterType}
                planCardPopup={planCardPopup}
                billingTermUnit={billingTermUnit}
                subscriptionSelectionHandler={handleSubscriptionSelection}
              />
            </div>
          </Popup>
        )}
      </section>
    </>
  );
};

SubsctiptionPlanInfo.propTypes = {
  config: PropTypes.object
};

export default SubsctiptionPlanInfo;
