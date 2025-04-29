import React, { useState } from "react";
import PropTypes from "prop-types";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";

const PaymentDetails = (props) => {
  const { paymentInfo, paymentInfoData } = props;
  const {
    title,
    transactionIdLabel,
    purchaseLoanLabel,
    paidOnLabel,
    receivedOnLabel
  } = paymentInfo;

  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  const handleBreakUpDetail = () => {
    setShowPaymentDetails(!showPaymentDetails);
  };
  return (
    paymentInfoData && (
      <div className="vida-payment-details">
        <div className="vida-payment-details__wrapper">
          <div className="vida-payment-details__title">
            <h3>{title}</h3>
            <i
              className={showPaymentDetails ? "icon-minus" : "icon-plus"}
              onClick={handleBreakUpDetail}
            />
          </div>
          {showPaymentDetails &&
            paymentInfoData.map((paymentInfoItem, index) => (
              <div className="vida-payment-details__info" key={index}>
                <div className="vida-payment-details__info__left">
                  {paymentInfoItem.paymentMode ? (
                    <div className="items">
                      <div className="items__label">{purchaseLoanLabel}</div>
                      <div className="items__value">
                        {paymentInfoItem.paymentMode}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {paymentInfoItem.payId ? (
                    <div className="items">
                      <div className="items__label">{transactionIdLabel}</div>
                      <div className="items__value">
                        {paymentInfoItem.payId}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="vida-payment-details__info__right">
                  {paymentInfoItem.amount ? (
                    <div className="items">
                      <div className="items__value">
                        {currencyUtils.getCurrencyFormatValue(
                          paymentInfoItem.amount
                        )}
                      </div>
                      <div className="items__label">
                        {paymentInfoItem.paymentType === "Payment Taken"
                          ? paidOnLabel
                          : receivedOnLabel}
                        {paymentInfoItem.paymentDate && (
                          <span className="items__info">on</span>
                        )}
                        {paymentInfoItem.paymentDate && (
                          <span className="items__info">
                            {paymentInfoItem.paymentDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  );
};

PaymentDetails.propTypes = {
  paymentInfo: PropTypes.shape({
    title: PropTypes.string,
    transactionIdLabel: PropTypes.string,
    purchaseLoanLabel: PropTypes.string,
    paidOnLabel: PropTypes.string,
    receivedOnLabel: PropTypes.string
  }),
  paymentInfoData: PropTypes.array
};

export default PaymentDetails;
