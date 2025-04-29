import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { tns } from "tiny-slider/src/tiny-slider";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import appUtils from "../../../site/scripts/utils/appUtils";

const SubsctiptionPlanInfoPopup = (props) => {
  const {
    cardData,
    filterType,
    planCardPopup,
    subscriptionSelectionHandler,
    billingTermUnit
  } = props;

  const { planCardPopupTitle, standardPlan } = planCardPopup;
  const imgPath = appUtils.getConfig("imgPath");

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
    <>
      <div className="vida-subscription-plans__wrapper">
        <div className="vida-subscription-plans__modal-title">
          {planCardPopupTitle}
        </div>
        <div className="vida-subscription-plans__subscription-selection">
          {billingTermUnit.map((name) => (
            <span
              key={name}
              onClick={() =>
                subscriptionSelectionHandler &&
                subscriptionSelectionHandler(name)
              }
              className={`vida-subscription-plans__subscription-selection${
                filterType === name ? "--active" : "--inactive"
              }`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className="vida-subscription-plans__standard-plan">
        <div className="vida-subscription-plans__standard-plan-details">
          <div className="vida-subscription-plans__standard-plan-title">
            {standardPlan.standardPlanLabel}
          </div>
          <div className="vida-subscription-plans__standard-plan-desc">
            {standardPlan.standardPlanDesc}
          </div>
        </div>
        <ul className="vida-subscription-plans__standard-plan-list">
          <li className="vida-subscription-plans__standard-plan-item">
            <div className="vida-subsctiption-plan-info__box-icon">
              <img src={`${imgPath}range-icon.png`} />
            </div>
            <div className="vida-subscription-plans__standard-plan-type">
              {standardPlan.chargerLabel}
            </div>
          </li>
          <li className="vida-subscription-plans__standard-plan-item">
            <div className="vida-subsctiption-plan-info__box-icon">
              <img src={`${imgPath}battery-icon.png`} />
            </div>
            <div className="vida-subscription-plans__standard-plan-type">
              {standardPlan.batteryLabel}
            </div>
          </li>
          <li className="vida-subscription-plans__standard-plan-item">
            <div className="vida-subsctiption-plan-info__box-icon">
              <img src={`${imgPath}scooter-icon.png`} />
            </div>
            <div className="vida-subscription-plans__standard-plan-type">
              {standardPlan.vehicleLabel}
            </div>
          </li>
        </ul>
      </div>
      <div className="vida-subscription-plans__compare-cards">
        {cardData.map((element) => {
          if (element.billing_term_unit === filterType) {
            return (
              <div key={element.name}>
                <div className={`vida-subscription-plans__card-item`}>
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
    </>
  );
};

SubsctiptionPlanInfoPopup.propTypes = {
  cardData: PropTypes.array,
  filterType: PropTypes.string,
  planCardPopup: PropTypes.object,
  subscriptionSelectionHandler: PropTypes.func,
  billingTermUnit: PropTypes.array
};

export default SubsctiptionPlanInfoPopup;
