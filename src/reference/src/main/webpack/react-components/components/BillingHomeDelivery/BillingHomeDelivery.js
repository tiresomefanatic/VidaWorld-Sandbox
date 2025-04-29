import React, { useState } from "react";
import PropTypes from "prop-types";
import { setHomeDeliveryDataDispatcher } from "../../store/purchaseConfig/purchaseConfigActions";

const BillingHomeDelivery = (props) => {
  const {
    checkBoxLabel,
    isHomeDeliveryChecked,
    homeDeliverySubtext
    //setHandleHomeDelivery
  } = props;

  const [checked, setChecked] = useState(isHomeDeliveryChecked);

  const handleHomeDeliveryChange = (e) => {
    if (e.target.checked) {
      setHomeDeliveryDataDispatcher && setHomeDeliveryDataDispatcher(true);
      setChecked(true);
    } else {
      setHomeDeliveryDataDispatcher && setHomeDeliveryDataDispatcher(false);
      setChecked(false);
    }
  };

  return (
    <>
      <div className="vida-billing-home-delivery__container">
        <div className="vida-billing-home-delivery__wrapper">
          <div className="vida-billing-home-delivery__checkbox form__group form__field-checkbox">
            <label className="vida-user-access__label">
              <span className="vida-billing-home-delivery__heading">
                {checkBoxLabel}
              </span>
              <input
                type="checkbox"
                defaultChecked={isHomeDeliveryChecked}
                ///checked={isHomeDeliveryChecked}
                // ref={setCheckboxRef}
                onChange={(e) => handleHomeDeliveryChange(e)}
              />
              <span className="form__field-checkbox-mark"></span>
            </label>
          </div>
          <div className="vida-billing-home-delivery__subtext">
            <label className="form__field-label">{homeDeliverySubtext}</label>
          </div>
        </div>
      </div>
    </>
  );
};

BillingHomeDelivery.propTypes = {
  checkBoxLabel: PropTypes.string,
  homeDeliverySubtext: PropTypes.string,
  isHomeDeliveryChecked: PropTypes.bool,
  setHandleHomeDelivery: PropTypes.func
};
export default BillingHomeDelivery;
