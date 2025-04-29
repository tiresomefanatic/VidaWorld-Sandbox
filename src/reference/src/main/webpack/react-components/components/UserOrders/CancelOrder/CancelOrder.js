import React, { useState } from "react";
import PropTypes from "prop-types";
import { useCancelOrder } from "../../../hooks/userProfile/userProfileHooks";
import { useForm } from "react-hook-form";
// import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
// import SelectField from "../../form/SelectField/SelectField";
import Logger from "../../../../services/logger.service";
import Dropdown from "../../form/Dropdown/Dropdown";

const CancelOrder = (props) => {
  const { cancelOrderConfig, cardData } = props;
  const [reason, setReason] = React.useState("Duplicate Order");
  // const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const cancelUserOrder = useCancelOrder();

  const {
    // control,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const [reasonOptionData] = useState({
    options: cancelOrderConfig.reasonOptions.options,
    value: ""
  });
  const handleDropDownChange = async (name, value) => {
    setReason(value);
  };

  const cancelSaleOrder = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const cancelUserOrderData = await cancelUserOrder({
        variables: {
          sf_order_id: cardData.orderId,
          cancellationReason: reason
        }
      });
      if (
        cancelUserOrderData &&
        cancelUserOrderData.data &&
        cancelUserOrderData.data.cancelSaleOrder
      ) {
        props.getAllOrders &&
          props.getAllOrders(
            cancelUserOrderData.data.cancelSaleOrder.status,
            cancelUserOrderData.data.cancelSaleOrder.message
          );
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  return (
    <div className="vida-cancel-order">
      <div className="vida-cancel-order__container">
        <form
          className="form vida-cancel-order__form"
          onSubmit={handleSubmit(() => cancelSaleOrder())}
        >
          <h3>{cancelOrderConfig.confirmLabel}</h3>
          <p>{cancelOrderConfig.refundInfo}</p>
          <label className="form__field-label">
            {cancelOrderConfig.helpLabel}
          </label>
          <div
            className={
              errors.reason ? "form__group form__group--error" : "form__group"
            }
          >
            {/* <SelectField
              name="OrderCancel"
              label={cancelOrderConfig.reasonField.label}
              options={reasonOptionData.options}
              value={reason}
              onChangeHandler={handleDropDownChange}
              validationRules={cancelOrderConfig.reasonOptions.validationRules}
              control={control}
              errors={errors}
            /> */}
            <Dropdown
              name="OrderCancel"
              label={cancelOrderConfig.reasonField.label}
              options={reasonOptionData.options}
              value={reason}
              setValue={setValue}
              onChangeHandler={handleDropDownChange}
              errors={errors}
              validationRules={cancelOrderConfig.reasonOptions.validationRules}
              register={register}
            />

            {errors.reason && errors.reason.type === "required" && (
              <>
                <p className="form__field-message">
                  {cancelOrderConfig.reasonField.validationRules.required &&
                    cancelOrderConfig.reasonField.validationRules.required
                      .message}
                </p>
              </>
            )}
          </div>
          <div className="vida-cancel-order__button-container">
            <button className="btn btn--primary">
              {cancelOrderConfig.cancelBtn.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CancelOrder.propTypes = {
  cancelOrderConfig: PropTypes.object,
  cardData: PropTypes.object,
  getAllOrders: PropTypes.func,
  handleCancelOrderClose: PropTypes.func,
  bookingStatus: PropTypes.string
};

CancelOrder.defaultProps = {
  cardData: {}
};

export default CancelOrder;
