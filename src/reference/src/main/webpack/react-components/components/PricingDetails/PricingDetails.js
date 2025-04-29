import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { setSubscriptionDataDispatcher } from "../../store/purchaseConfig/purchaseConfigActions";

const PricingDetails = (props) => {
  const {
    pricingConfig,
    payment,
    insurance,
    aadhar,
    productData,
    subscriptionPlan,
    tradeIn
  } = props;
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
    <div className="vida-pricing">
      <div className="vida-pricing__heading">
        <h3>{pricingConfig.title}</h3>
      </div>
      <div className="vida-pricing__content">
        <div className="vida-pricing__price-detail">
          <div className="vida-pricing__price-info">
            <label>{pricingConfig.basePriceLabel}</label>
            <span className="vida-pricing__price">
              {currencyUtils.getCurrencyFormatValue(payment.basePrice)}
            </span>
          </div>

          {payment.configurePrice !== 0 && (
            <div className="vida-pricing__price-info">
              <label>{pricingConfig.configureLabel}</label>
              <span className="vida-pricing__price">
                {currencyUtils.getCurrencyFormatValue(payment.configurePrice)}
              </span>
            </div>
          )}

          <div className="vida-pricing__price-info">
            <label>{pricingConfig.otherChargesLabel}</label>
            <span className="vida-pricing__price">
              {currencyUtils.getCurrencyFormatValue(payment.otherCharges)}
            </span>
          </div>

          <div className="vida-pricing__price-info">
            <label>{pricingConfig.addonsLabel}</label>
            <span className="vida-pricing__price">
              {currencyUtils.getCurrencyFormatValue(payment.addonsPrice)}
            </span>
          </div>

          {insurance.insuranceBasePrice !== 0 && (
            <div className="vida-pricing__price-info">
              <label>{insurance.insurerName}</label>
              <span className="vida-pricing__price">
                {currencyUtils.getCurrencyFormatValue(
                  insurance.insuranceBasePrice
                )}
              </span>
            </div>
          )}

          {subscriptionPlan.package_id && (
            <div className="vida-pricing__price-info">
              <label>{subscriptionPlan.name}</label>
              <span className="vida-pricing__price">
                {currencyUtils.getCurrencyFormatValue(subscriptionPlan.price)}
              </span>
            </div>
          )}

          {/* {payment.updatedOrderTax !== 0 && ( */}
          <div className="vida-pricing__price-info">
            <label>{pricingConfig.gstLabel}</label>
            <span className="vida-pricing__price">
              {currencyUtils.getCurrencyFormatValue(payment.updatedOrderTax)}
            </span>
          </div>
          {/* )} */}
          {aadhar && aadhar.aadharSelected && aadhar.aadharUsedForRegister && (
            <div className="vida-pricing__price-info">
              <label>{pricingConfig.subsidyLabel}</label>
              <span className="vida-pricing__price vida-pricing__price--deduct">
                (-{" "}
                {currencyUtils.getCurrencyFormatValue(aadhar.empsSubsidyAmount)}
                )
              </span>
            </div>
          )}
          {/* {payment.prebookingPricePaid !== 0 && ( */}
          <div className="vida-pricing__price-info">
            <label>{pricingConfig.prebookingPricePaidLabel}</label>
            <span className="vida-pricing__price vida-pricing__price--deduct">
              (-{" "}
              {currencyUtils.getCurrencyFormatValue(
                payment.prebookingPricePaid
              )}
              )
            </span>
          </div>
          {/* )} */}
          {tradeIn.exchange_amount > 0 && (
            <div className="vida-pricing__price-info">
              <label>{pricingConfig.exchangeLabel}</label>
              <span className="vida-pricing__price vida-pricing__price--deduct">
                ( -{" "}
                {currencyUtils.getCurrencyFormatValue(tradeIn.exchange_amount)})
              </span>
            </div>
          )}
        </div>
        <div className="vida-pricing__product">
          <p className="vida-pricing__product-heading">
            <span>{productData.name}</span>
            {payment.updatedOrderGrandTotal !== 0 && (
              <span>
                {currencyUtils.getCurrencyFormatValue(
                  payment.updatedOrderGrandTotal
                )}
              </span>
            )}
          </p>
          <label className="vida-pricing__message">
            {pricingConfig.deliveryMessage}
          </label>
        </div>
      </div>
    </div>
  );
};

PricingDetails.propTypes = {
  pricingConfig: PropTypes.shape({
    title: PropTypes.string,
    basePriceLabel: PropTypes.string,
    configureLabel: PropTypes.string,
    otherChargesLabel: PropTypes.string,
    addonsLabel: PropTypes.string,
    gstLabel: PropTypes.string,
    subsidyLabel: PropTypes.string,
    exchangeLabel: PropTypes.string,
    prebookingPricePaidLabel: PropTypes.string,
    deliveryMessage: PropTypes.string
  }),
  payment: PropTypes.object,
  insurance: PropTypes.object,
  gst: PropTypes.object,
  aadhar: PropTypes.object,
  productData: PropTypes.object,
  tradeIn: PropTypes.object,
  subscriptionPlan: PropTypes.object
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    payment: purchaseConfigReducer.payment,
    insurance: purchaseConfigReducer.insurance,
    gst: purchaseConfigReducer.gst,
    aadhar: purchaseConfigReducer.aadhar,
    productData: purchaseConfigReducer.productData,
    subscriptionPlan: purchaseConfigReducer.subscriptionPlan,
    tradeIn: purchaseConfigReducer.tradeIn
  };
};

export default connect(mapStateToProps)(PricingDetails);
