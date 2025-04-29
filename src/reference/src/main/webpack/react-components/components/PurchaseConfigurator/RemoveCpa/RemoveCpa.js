import React from "react";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import { useForm } from "react-hook-form";
import { setCpaOptedDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";

const RemoveCpa = (props) => {
  const {
    config,
    addonsList,
    handleShowSelectPolicyPopup,
    handleCloseRemoveCpaPopup
  } = props;
  const { register, handleSubmit } = useForm({
    mode: "onSubmit"
  });

  const handleFormSubmit = (formData) => {
    const selectedAddons = addonsList.filter((option) => option.selected);
    setCpaOptedDataDispatcher({
      cpaOpted: false,
      cpaNotOptedReason: formData.reason
    });
    handleShowSelectPolicyPopup(true, false, selectedAddons);
    handleCloseRemoveCpaPopup();
  };
  return (
    <div className="vida-remove-cpa__popup-wrapper">
      <Popup mode="medium" handlePopupClose={handleCloseRemoveCpaPopup}>
        <div className="vida-remove-cpa">
          <div className="vida-remove-cpa__title">{config.title}</div>
          <div className="vida-remove-cpa__description">
            {config.description}
          </div>
          <div className="vida-remove-cpa__message">{config.message}</div>

          <form
            className="vida-remove-cpa__reason"
            onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
          >
            <div className="form__group form__field-radio-group">
              {config.options.map((item, index) => (
                <div className="form__field-radio" key={index}>
                  <label className="form__field-label">
                    {item.label}
                    <input
                      type="radio"
                      name="reason"
                      id={item.label}
                      value={item.value}
                      defaultChecked={index === 0}
                      {...register("reason")}
                    />
                    <span className="form__field-radio-mark"></span>
                  </label>
                </div>
              ))}
            </div>
            <div className="vida-remove-cpa__action">
              <button className="btn btn--primary">{config.actionLabel}</button>
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

RemoveCpa.propTypes = {
  config: PropTypes.any,
  addonsList: PropTypes.array,
  handleShowSelectPolicyPopup: PropTypes.func,
  handleCloseRemoveCpaPopup: PropTypes.func
};

export default RemoveCpa;
