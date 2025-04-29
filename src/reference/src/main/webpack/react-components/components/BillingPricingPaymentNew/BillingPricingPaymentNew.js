import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CONSTANT from "../../../site/scripts/constant";
import Location from "../../../site/scripts/location";
import appUtils from "../../../site/scripts/utils/appUtils";
import { setPaymentDataDispatcher } from "../../store/purchaseConfig/purchaseConfigActions";
import breakpoints from "../../../site/scripts/media-breakpoints";

const BillingPricingPaymentNew = (props) => {
  const {
    billingPricingConfig,
    paymentMode,
    setPaymentMode,
    billingAddresses,
    payment,
    branchId,
    location,
    scrollingTop
  } = props;
  const { fullPayment, loan, lease } = billingPricingConfig;
  const [nearByCentre, setNearByCentre] = useState(null);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const changeHandler = (e) => {
    if (isDesktop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (e.target.value === CONSTANT.PAYMENT_MODE.CASH) {
      const result = location.find(
        (item) => item.type === CONSTANT.CENTERLIST.EXPERIENCE_CENTER
      );

      if (result && result.items && result.items.length) {
        const nearByLocation = result.items.find(
          (item) => item.id === branchId
        );
        setNearByCentre(nearByLocation);
      }
      scrollingTop && scrollingTop();
    }
    setPaymentMode && setPaymentMode(e.target.value);
    setPaymentDataDispatcher({
      paymentMethod: e.target.value
    });
  };

  const locationHandler = async () => {
    const locationObj = new Location();
    await locationObj.getVidaCentreList(billingAddresses.city);
  };

  useEffect(() => {
    if (billingAddresses.city) {
      locationHandler();
    }
  }, [billingAddresses]);

  return (
    <div className="vida-payment-new">
      <div className="vida-payment-new__main-wrapper">
        <div className="vida-payment-new__container">
          <div className="vida-payment-new__online-new">
            <div className="form__group form__field-radio">
              <label className="form__field-label" htmlFor="online">
                {fullPayment.onlinePaymentLabel}
                <input
                  type="radio"
                  value={CONSTANT.PAYMENT_MODE.ONLINE}
                  name="paymentMode"
                  id="online"
                  checked={paymentMode === CONSTANT.PAYMENT_MODE.ONLINE}
                  onChange={changeHandler}
                />{" "}
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
          </div>
          <div className="vida-payment-new__cash-new">
            <div className="form__group form__field-radio">
              <label className="form__field-label" htmlFor="cash">
                {fullPayment.cashPaymentLabel}
                <input
                  type="radio"
                  value={CONSTANT.PAYMENT_MODE.CASH}
                  name="paymentMode"
                  id="cash"
                  checked={paymentMode === CONSTANT.PAYMENT_MODE.CASH}
                  onChange={changeHandler}
                />{" "}
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
            {paymentMode === CONSTANT.PAYMENT_MODE.CASH && (
              <div className="vida-payment-new__cash-wrapper">
                <div
                  className="vida-payment-new__near-by-center"
                  dangerouslySetInnerHTML={{
                    __html: fullPayment.cashInfo
                  }}
                ></div>

                {nearByCentre && (
                  <>
                    <div className="vida-payment-new__heading">
                      <span>{fullPayment.centerLabel}</span>
                    </div>
                    <div className="vida-payment-new__center-details">
                      <div className="vida-payment-new__center-name">
                        <span>{nearByCentre.experienceCenterName}</span>
                      </div>
                      <div className="vida-payment-new__center-address">
                        <p className="vida-payment-new__center-address-details">
                          {nearByCentre.address}
                        </p>
                        <p className="vida-payment-new__center-address-type">
                          <img
                            className="vida-payment-new__center-img"
                            src={
                              appUtils.getConfig("resourcePath") +
                              "images/svg/place-icon.svg"
                            }
                            alt="Place Icon"
                          />
                          <span>{nearByCentre.type}</span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="vida-payment-new__disclaimer">
                  <p>{fullPayment.disclaimer}</p>
                </div>
              </div>
            )}
          </div>
          <div className="vida-payment-new__cash-new">
            <div className="form__group form__field-radio">
              <label className="form__field-label" htmlFor="loan">
                {loan.title}
                <input
                  type="radio"
                  value={CONSTANT.PAYMENT_MODE.LOAN}
                  name="paymentMode"
                  id="loan"
                  checked={paymentMode === CONSTANT.PAYMENT_MODE.LOAN}
                  onChange={changeHandler}
                />{" "}
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer, testDriveReducer }) => {
  return {
    billingAddresses: purchaseConfigReducer.billingAddresses,
    payment: purchaseConfigReducer.payment,
    branchId: purchaseConfigReducer.branchId,
    location: testDriveReducer.nearByVidaCentreList
  };
};

BillingPricingPaymentNew.propTypes = {
  billingPricingConfig: PropTypes.shape({
    fullPayment: PropTypes.shape({
      title: PropTypes.string,
      onlinePaymentLabel: PropTypes.string,
      cashPaymentLabel: PropTypes.string,
      centerLabel: PropTypes.string,
      cashInfo: PropTypes.string,
      centerLabel: PropTypes.string,
      disclaimer: PropTypes.string
    }),
    loan: PropTypes.object,
    lease: PropTypes.object
  }),
  paymentMode: PropTypes.string,
  setPaymentMode: PropTypes.func,
  billingAddresses: PropTypes.object,
  payment: PropTypes.object,
  branchId: PropTypes.string,
  location: PropTypes.array,
  scrollingTop: PropTypes.func
};
export default connect(mapStateToProps)(BillingPricingPaymentNew);
