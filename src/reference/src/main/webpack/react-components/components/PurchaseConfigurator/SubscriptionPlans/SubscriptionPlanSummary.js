import React from "react";
import PropTypes from "prop-types";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const SubscriptionPlanSummary = (props) => {
  const { cardData, filterType, selectedPlanHandler, selectedEntity } = props;
  const handleSelectedPlan = (package_id) => {
    selectedPlanHandler && selectedPlanHandler(package_id);
  };
  return (
    <>
      {filterType === cardData.billing_term_unit && (
        <div
          className={`vida-subscription-plans__card ${
            selectedEntity === cardData.package_id ? "card-selected" : ""
          }`}
          onClick={() => handleSelectedPlan(cardData.package_id)}
        >
          <div className="vida-subscription-plans__card-block">
            <div className="vida-subscription-plans__card-plan">
              <h3>{cardData.name}</h3>
              <h3>{currencyUtils.getCurrencyFormatValue(cardData.price)}</h3>
            </div>
            <div className="vida-subscription-plans__card-desc">
              {cardData.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

SubscriptionPlanSummary.propTypes = {
  cardData: PropTypes.object,
  filterType: PropTypes.string,
  selectedPlanHandler: PropTypes.func,
  selectedEntity: PropTypes.string
};
export default SubscriptionPlanSummary;
