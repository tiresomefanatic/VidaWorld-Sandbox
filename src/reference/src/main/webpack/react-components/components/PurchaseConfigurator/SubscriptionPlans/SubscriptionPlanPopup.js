import React, { useEffect } from "react";
import PropTypes from "prop-types";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import { tns } from "tiny-slider/src/tiny-slider";

const SubscriptionPlanPopup = (props) => {
  const { cardData, selectedPlanHandler, selectedEntity, filterType } = props;

  const handleSelectedPlan = (package_id) => {
    selectedPlanHandler && selectedPlanHandler(package_id);
  };

  const subscriptionSlider = () =>
    tns({
      container: ".vida-subscription-plans__compare-cards",
      items: 1,
      slideBy: "page",
      mouseDrag: true,
      controls: false,
      gutter: 16,
      fixedWidth: 284,
      nav: true,
      navPosition: "bottom",
      edgePadding: 16,
      center: true,
      loop: false,
      responsive: {
        576: {
          items: 2,
          center: false
        },
        1024: {
          items: 3,
          nav: false,
          fixedWidth: 328,
          edgePadding: 32,
          gutter: 32
        }
      }
    });

  useEffect(() => {
    subscriptionSlider();
  }, []);

  return (
    <div className="vida-subscription-plans__compare-cards">
      {cardData.map((element) => {
        if (element.billing_term_unit === filterType) {
          return (
            <div key={element.name}>
              <div
                className={`vida-subscription-plans__card-item ${
                  selectedEntity === element.package_id ? "card-selected" : ""
                }`}
                onClick={() => handleSelectedPlan(element.package_id)}
              >
                <div className="vida-subscription-plans__card-item-wrapper">
                  <div className="vida-subscription-plans__card-item-title">
                    {element.name}
                  </div>
                  {element.description && (
                    <div className="vida-subscription-plans__card-item-desc">
                      {element.description}
                    </div>
                  )}
                </div>
                <ul className="vida-subscription-plans__card-item-list">
                  {element.items_data.map((element_item) => (
                    <li key={element_item.name}>
                      <i className="icon-check"></i>
                      <span>{element_item.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="vida-subscription-plans__card-item-cost">
                  <h2>
                    {currencyUtils.getCurrencyFormatValue(element.price)}{" "}
                  </h2>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

SubscriptionPlanPopup.propTypes = {
  cardData: PropTypes.array,
  selectedPlanHandler: PropTypes.func,
  selectedEntity: PropTypes.string,
  filterType: PropTypes.string
};

export default SubscriptionPlanPopup;
