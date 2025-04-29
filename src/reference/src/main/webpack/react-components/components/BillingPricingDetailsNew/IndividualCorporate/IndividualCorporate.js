import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setResetGSTDataDispatcher,
  setGstDataDispatcher,
  setResetIndividualAddressDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import CONSTANT from "../../../../site/scripts/constant";

const Individualcorporate = (props) => {
  const { setShowGstPopup, setCustomerType, CustomerType, gst, pricingConfig } =
    props;
  const [gstDataSelected, setGstDataSelected] = useState({});
  useEffect(() => {
    setGstDataSelected(gst);
    gst.gstSelected ? setCustomerType(CONSTANT.CUSTOMER_TYPES.CORPORATE) : null;
  }, []);

  function onChangeTypeCustomer(event) {
    setCustomerType(event.target.value);
    if (event.target.value === CONSTANT.CUSTOMER_TYPES.CORPORATE) {
      //setGstDataDispatcher(gstDataSelected);
      if (!gstDataSelected.gstSelected) {
        setShowGstPopup(true);
      }
    } else {
      setResetIndividualAddressDispatcher();
      setResetGSTDataDispatcher();
    }
  }

  return (
    <>
      <div className="vida-billing-individual-corporate__container">
        <div className="vida-billing-individual-corporate__container__wrapper">
          <div className="vida-billing-individual-corporate__container__wrapper--text">
            <label>{pricingConfig.gst.selectLabel}</label>
          </div>
          <div className="vida-billing-individual-corporate__container__wrapper--radioboxes">
            <div className="form__group form__field-radio">
              <label className="form__field-label" htmlFor="Individual">
                {pricingConfig.gst.individualLabel}
                <input
                  className="vida-billing-individual-corporate__container__wrapper--radiobox"
                  type="radio"
                  name="individual-corporate"
                  value="Individual"
                  id="Individual"
                  checked={CustomerType === CONSTANT.CUSTOMER_TYPES.INDIVIDUAL}
                  onChange={onChangeTypeCustomer}
                />
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
            <div className="form__group form__field-radio">
              <label className="form__field-label" htmlFor="Corporate">
                {pricingConfig.gst.corporateLabel}
                <input
                  className="vida-billing-individual-corporate__container__wrapper--radiobox"
                  type="radio"
                  name="individual-corporate"
                  value="Corporate"
                  id="Corporate"
                  checked={CustomerType === CONSTANT.CUSTOMER_TYPES.CORPORATE}
                  onChange={onChangeTypeCustomer}
                />
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    gst: purchaseConfigReducer.gst
  };
};

Individualcorporate.propTypes = {
  setShowGstPopup: PropTypes.func,
  setCustomerType: PropTypes.func,
  CustomerType: PropTypes.string,
  gst: PropTypes.object,
  pricingConfig: PropTypes.object
};

export default connect(mapStateToProps)(Individualcorporate);
