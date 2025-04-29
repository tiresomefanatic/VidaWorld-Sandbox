import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import {
  setPaymentDataDispatcher
  // setResetSelectedPolicyDataDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import { useAutovert } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import CONSTANT from "../../../../site/scripts/constant";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const PaymentOptions = (props) => {
  const { title, message, plans } = props.config;
  const { order, payment, aadhar } = props.cmpProps;
  const [hidePopUp, setHidePopup] = useState(true);
  const [autovertUrl, setAutovertUrl] = useState("");

  const handleClick = (e, id) => {
    document
      .querySelectorAll(".vida-payment-options__options")
      .forEach((a) => a.classList.remove("vida-payment-options__selected"));
    e.target
      .closest(".vida-payment-options__options")
      .classList.add("vida-payment-options__selected");
    const selectedPayment = {
      paymentMethod: id,
      loan: {
        status: id === CONSTANT.PAYMENT_METHOD.LOAN,
        amount: "0"
      }
      // ,
      // lease: {
      //   status: id === CONSTANT.PAYMENT_METHOD.LEASE,
      //   amount: "0"
      // }
    };
    // id === CONSTANT.PAYMENT_METHOD.LEASE &&
    //   setResetSelectedPolicyDataDispatcher();
    setPaymentDataDispatcher(selectedPayment);
  };
  const getAutovertData = useAutovert();
  const handleOpenPopUp = async (planId) => {
    const autovertRes = await getAutovertData({
      variables: {
        order_id: order.orderId,
        application_type: planId.toUpperCase()
      }
    });

    if (autovertRes.data.getAutoVertOffers.status === "200") {
      setAutovertUrl(autovertRes.data.getAutoVertOffers.application_link);
      setHidePopup(false);
    }
  };

  useEffect(() => {
    const planId = payment.paymentMethod;
    if (
      payment.paymentMethod.length > 0 &&
      payment.paymentMethod !== CONSTANT.PAYMENT_METHOD.FULL_PAYMENT
    ) {
      document
        .getElementById(planId)
        .classList.add("vida-payment-options__selected");
    } else {
      document
        .querySelector("#fullPayment")
        .classList.add("vida-payment-options__selected");
      setPaymentDataDispatcher({
        paymentMethod: CONSTANT.PAYMENT_METHOD.FULL_PAYMENT
      });
    }
  }, []);

  return (
    <div className="vida-payment-options">
      {hidePopUp ? (
        <div>
          <div className="vida-payment-options__title-wrapper">
            <h3>{title}</h3>
            <span>{message}</span>
          </div>
          <div className="vida-payment-options__container">
            {plans.map((plan) => (
              <div
                className={
                  plan.id === payment.paymentMethod
                    ? "vida-payment-options__options vida-payment-options__selected"
                    : "vida-payment-options__options"
                }
                id={plan.id}
                key={plan.id}
                onClick={(e) => handleClick(e, plan.id)}
              >
                <div className="vida-payment-options__title">
                  <h3>{plan.title}</h3>
                  {aadhar.aadharSelected && plan.message && (
                    <p>{plan.message}</p>
                  )}
                </div>

                {plan.details && plan.details.subText && (
                  <div className="vida-payment-options__subtext-container">
                    <div className="vida-payment-options__subtext">
                      <span>
                        {currencyUtils.getCurrencyFormatValue(
                          payment.finalPrice
                        )}
                      </span>
                      <label>{plan.details.subText}</label>
                    </div>
                  </div>
                )}

                {plan.details && plan.details.label && (
                  <div className="vida-payment-options__link">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenPopUp(plan.id);
                      }}
                    >
                      {plan.details.label}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Popup mode="large" handlePopupClose={() => setHidePopup(true)}>
          <div className="vida-payment-options__popup">
            {autovertUrl.length > 0 && (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={autovertUrl}
              />
            )}
          </div>
        </Popup>
      )}
    </div>
  );
};
PaymentOptions.propTypes = {
  cmpProps: PropTypes.object,
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    plans: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string,
        details: PropTypes.shape({
          subText: PropTypes.string,
          label: PropTypes.string,
          actionUrl: PropTypes.string
        })
      })
    )
  })
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      order: purchaseConfigReducer.order,
      payment: purchaseConfigReducer.payment,
      aadhar: purchaseConfigReducer.aadhar
    }
  };
};

export default connect(mapStateToProps)(PaymentOptions);
