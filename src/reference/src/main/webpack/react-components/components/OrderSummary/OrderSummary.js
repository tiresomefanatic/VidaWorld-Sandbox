import React, { useState } from "react";
import PropTypes from "prop-types";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";

const OrderSummary = (props) => {
  const { orderSummaryConfig, cardData } = props;
  const {
    title,
    basePriceLabel,
    homeDeliveryLabel,
    otherChargesLabel,
    addonsLabel,
    gstLabel,
    offersLabel,
    subsidyLabel,
    // prebookingPricePaidLabel,
    exchangeLabel,
    insuranceLabel,
    orderTotalLabel,
    configureLabel
  } = orderSummaryConfig;
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const handleBreakUpDetail = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  const calculateOffers = (cardData) => {
    if (cardData) {
      let offerPrice = 0;
      cardData.discount_data.map(
        (item) => (offerPrice += parseInt(item.discount_amount))
      );
      return currencyUtils.getCurrencyFormatValue(offerPrice);
    }
  };

  return (
    <div className="vida-order-summary">
      <div className="vida-order-summary__summary-title">
        <h1 className="vida-order-summary__title">{title}</h1>
        <i
          className={showOrderSummary ? "icon-minus" : "icon-plus"}
          onClick={handleBreakUpDetail}
        />
      </div>
      <div className="vida-order-summary__seperator" />
      {showOrderSummary && (
        <div className="vida-order-summary__breakup">
          <div className="vida-order-summary__breakup-info">
            <p className="vida-order-summary__breakup-label">
              {basePriceLabel}
            </p>
            <p className="vida-order-summary__breakup-value">
              {currencyUtils.getCurrencyFormatValue(cardData.basePrice)}
            </p>
          </div>
          {cardData.configure_price &&
            parseInt(cardData.configure_price) !== 0 && (
              <div className="vida-order-summary__breakup-info">
                <p className="vida-order-summary__breakup-label">
                  {configureLabel}
                </p>
                <p className="vida-order-summary__breakup-value">
                  {currencyUtils.getCurrencyFormatValue(
                    cardData.configure_price
                  )}
                </p>
              </div>
            )}
          <div className="vida-order-summary__breakup-info">
            <p className="vida-order-summary__breakup-label">
              {otherChargesLabel}
            </p>
            <p className="vida-order-summary__breakup-value">
              {currencyUtils.getCurrencyFormatValue(cardData.other_charges)}
            </p>
          </div>
          <div className="vida-order-summary__breakup-info">
            <p className="vida-order-summary__breakup-label">{addonsLabel}</p>
            <p className="vida-order-summary__breakup-value">
              {currencyUtils.getCurrencyFormatValue(cardData.addons_price)}
            </p>
          </div>
          {cardData.home_delivery_opt_in && cardData.home_delivery_amount > 0 && (
            <div className="vida-order-summary__breakup-info">
              <p className="vida-order-summary__breakup-label">
                {homeDeliveryLabel}
              </p>
              <p className="vida-order-summary__breakup-value">
                {currencyUtils.getCurrencyFormatValue(
                  cardData.home_delivery_amount
                )}
              </p>
            </div>
          )}
          {cardData.subscription_plan_id && (
            <div className="vida-order-summary__breakup-info">
              <p className="vida-order-summary__breakup-label">
                {cardData.subscription_plan_name}
              </p>
              <p className="vida-order-summary__breakup-value">
                {currencyUtils.getCurrencyFormatValue(
                  cardData.subscription_plan_amount
                )}
              </p>
            </div>
          )}
          {cardData.insurance_base_price &&
            parseInt(cardData.insurance_base_price) !== 0 && (
              <div className="vida-order-summary__breakup-info">
                <p className="vida-order-summary__breakup-label">
                  {insuranceLabel}
                </p>
                <p className="vida-order-summary__breakup-value">
                  {currencyUtils.getCurrencyFormatValue(
                    cardData.insurance_base_price
                  )}
                </p>
              </div>
            )}
          <div className="vida-order-summary__breakup-info">
            <p className="vida-order-summary__breakup-label">{gstLabel}</p>
            <p className="vida-order-summary__breakup-value">
              {currencyUtils.getCurrencyFormatValue(cardData.gst)}
            </p>
          </div>
          {cardData.emps_subsidy_amount &&
            parseInt(cardData.emps_subsidy_amount) !== 0 && (
              <div className="vida-order-summary__breakup-info">
                <p className="vida-order-summary__breakup-label">
                  {subsidyLabel}
                </p>
                <p className="vida-order-summary__breakup-value vida-order-summary__fame-subsidy">
                  (-{" "}
                  {currencyUtils.getCurrencyFormatValue(
                    cardData.emps_subsidy_amount
                  )}
                  )
                </p>
              </div>
            )}
          {cardData.discount_data.length > 0 && (
            <div className="vida-order-summary__breakup-info">
              <p className="vida-order-summary__breakup-label">{offersLabel}</p>
              <p className="vida-order-summary__breakup-value vida-order-summary__offers">
                (- {calculateOffers(cardData)})
              </p>
            </div>
          )}
          {/* {cardData.reservePrice && parseInt(cardData.reservePrice) !== 0 && (
            <div className="vida-order-summary__breakup-info">
              <p className="vida-order-summary__breakup-label">
                {prebookingPricePaidLabel}
              </p>
              <p className="vida-order-summary__breakup-value vida-order-summary__breakup-deduct">
                (- {currencyUtils.getCurrencyFormatValue(cardData.reservePrice)}
                )
              </p>
            </div>
          )} */}
          {/* {cardData.exchange_selected && (
            <div className="vida-order-summary__breakup-info">
              <p className="vida-order-summary__breakup-label">
                {exchangeLabel}
              </p>
              <p
                className={`vida-order-summary__breakup-value vida-order-summary__breakup-deduct ${
                  cardData.exchange_selected && cardData.exchange_approved
                    ? "exchange-approved"
                    : ""
                }`}
              >
                (-{" "}
                {currencyUtils.getCurrencyFormatValue(cardData.exchange_amount)}
                )
              </p>
            </div>
          )} */}
        </div>
      )}
      <div className="vida-order-summary__seperator" />
      <div className="vida-order-summary__total">
        <h2 className="vida-order-summary__total-title">{orderTotalLabel}</h2>
        <h2 className="vida-order-summary__total-value">
          {currencyUtils.getCurrencyFormatValue(cardData.orderTotal)}
        </h2>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  orderSummaryConfig: PropTypes.shape({
    title: PropTypes.string,
    basePriceLabel: PropTypes.string,
    homeDeliveryLabel: PropTypes.string,
    otherChargesLabel: PropTypes.string,
    addonsLabel: PropTypes.string,
    subsidyLabel: PropTypes.string,
    gstLabel: PropTypes.string,
    offersLabel: PropTypes.string,
    // prebookingPricePaidLabel: PropTypes.string,
    exchangeLabel: PropTypes.string,
    insuranceLabel: PropTypes.string,
    orderTotalLabel: PropTypes.string,
    configureLabel: PropTypes.string
  }),
  cardData: PropTypes.object
};
OrderSummary.defaultProps = {
  orderSummaryConfig: {}
};

export default OrderSummary;
