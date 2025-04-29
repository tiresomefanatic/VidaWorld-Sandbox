import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useCancelPreBooking } from "../../../hooks/userProfile/userProfileHooks";
import { useForm } from "react-hook-form";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";
import { useGetMyScooterDetails } from "../../../hooks/myScooter/myScooterHooks";
const CancelPrebookingOrder = (props) => {
  const { cancelOrderConfig, cardData } = props;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const cancelBooking = useCancelPreBooking();
  let myScooterDetails = null;
  const getMyScooter = useGetMyScooterDetails();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const cancelPreBooking = async (formData) => {
    try {
      setSpinnerActionDispatcher(true);
      const cancelUserOrderData = await cancelBooking({
        variables: {
          increment_id: cardData.bookingId,
          reason: formData.reason
        }
      });
      myScooterDetails = await getMyScooter();

      if (
        cancelUserOrderData &&
        cancelUserOrderData.data &&
        cancelUserOrderData.data.cancelPayment &&
        cancelUserOrderData.data.cancelPayment.status === "200"
      ) {
        if (isAnalyticsEnabled) {
          const productDetails = {
            modelVariant: cardData.productName,
            modelColor: "",
            productID: cardData.itemId
          };
          const bookingDetails = {
            bookingID: cardData.bookingId,
            bookingStatus: "Pre-Booking Cancelled"
          };
          const cancellationDetail = {
            cancellatonReason: formData.reason,
            orderID: ""
          };
          const configuratorDetails = {
            accessorizeName: ""
          };

          const myScooterAllRecords =
            myScooterDetails?.data?.getAllEccentricConfiguration[0]
              ?.opportunity_lines?.records || [];

          if (myScooterAllRecords.length) {
            const accessoriesList = [];
            myScooterAllRecords.forEach((element) => {
              if (element.item_type === "Accessory") {
                accessoriesList.push(element.item_name);
              }
            });
            configuratorDetails.accessorizeName = accessoriesList
              .toString()
              .split(",")
              .join("|");
          }
          analyticsUtils.trackPreBookingCancel(
            productDetails,
            bookingDetails,
            cancellationDetail,
            configuratorDetails
          );
        }
        props.getAllOrders &&
          props.getAllOrders(
            cancelUserOrderData.data.cancelPayment.status,
            cancelUserOrderData.data.cancelPayment.message
          );
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    register("reason", {
      required: true
    });
  }, []);

  return (
    <div className="vida-cancel-prebooking-order">
      <div className="vida-cancel-prebooking-order__container">
        <form
          className="form vida-cancel-prebooking-order__form"
          onSubmit={handleSubmit((formData) => cancelPreBooking(formData))}
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
            <label className="form__field-label">
              {cancelOrderConfig.reasonField.label}
            </label>
            <textarea
              name="reason"
              className="form__field-textarea"
              placeholder={cancelOrderConfig.reasonField.placeholder}
              {...register("reason", {
                required: true
              })}
            ></textarea>
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
          <div className="vida-cancel-prebooking-order__button-container">
            <button className="btn btn--primary">
              {cancelOrderConfig.cancelBtn.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CancelPrebookingOrder.propTypes = {
  cancelOrderConfig: PropTypes.object,
  cardData: PropTypes.object,
  getAllOrders: PropTypes.func,
  handleCancelOrderClose: PropTypes.func
};

CancelPrebookingOrder.defaultProps = {
  cardData: {}
};

export default CancelPrebookingOrder;
