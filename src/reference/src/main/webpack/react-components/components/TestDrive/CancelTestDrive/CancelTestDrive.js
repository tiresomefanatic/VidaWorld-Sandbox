import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../../site/scripts/constant";
import { useCancelUserTestRide } from "../../../hooks/userProfile/userProfileHooks";
import { useForm } from "react-hook-form";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";

const CancelTestDrive = (props) => {
  const { cancelTestDriveConfig, cardData } = props;
  const [cancelReason, setCancelReason] = useState("Other");

  const imgPath = appUtils.getConfig("imgPath");

  const getCancelUserTestRide = useCancelUserTestRide();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const handleOnReasonChange = (e) => {
    setCancelReason(e.target.id);
    if (e.target.value === "Other") {
      register("remarks", {
        required: true
      });
    } else {
      unregister("remarks");
    }
  };

  const cancelTestDrive = async (formData) => {
    try {
      setSpinnerActionDispatcher(true);
      const cancelTestDriveData = await getCancelUserTestRide({
        variables: {
          SF_Booking_Id: cardData.Id,
          dmpl__Status__c: CONSTANT.TEST_RIDE_STATUS.CANCELLED,
          dmpl__CancellationReason__c: formData.reason,
          dmpl__Remarks__c: formData.remarks
        }
      });
      if (cancelTestDriveData) {
        if (isAnalyticsEnabled) {
          const location = {
            state: "",
            city: "",
            pinCode: cardData.dmpl__IsDemoOnsite__c
              ? cardData.dmpl__DemoAddress__c.split(",").pop().trim()
              : "",
            country: ""
          };
          const productDetails = {
            modelVariant: cardData.ItemName__c,
            modalColor: "",
            productID: cardData.dmpl__ItemId__c
          };
          const bookingDetails = {
            testDriveType: "Short Term Test Drive",
            testDriveLocation: cardData.dmpl__IsDemoOnsite__c
              ? "At Home"
              : "Nearby Vida Center",
            vidaCenter: cardData.dmpl__IsDemoOnsite__c
              ? ""
              : cardData.dmpl__DemoAddress__c,
            testDriveDate: cardData.dmpl__DemoDateTime__c.split("T")[0],
            testDriveTime: cardData.DemoStartAndEndTime__c,
            bookingID: cardData.Id,
            bookingStatus: "Test Drive Booking Cancelled",
            rentDuration: ""
          };
          const cancellation = {
            cancellationReason: cancelReason,
            cancellationComment: formData.remarks
          };
          analyticsUtils.trackTestRideCancel(
            location,
            productDetails,
            bookingDetails,
            cancellation
          );
        }

        props.getAllTestRides && props.getAllTestRides();
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    register("remarks", {
      required: true
    });
  }, []);

  return (
    <div className="vida-cancel-test-drive">
      <div className="vida-cancel-test-drive__container">
        <div className="vida-cancel-test-drive__image">
          <h2>{cardData.ItemName__c}</h2>
          <img
            className="vida-cancel-test-drive__product-image"
            src={imgPath + cardData.productSku + ".png"}
            alt={cardData.ItemName__c}
          />
        </div>
        <div className="vida-cancel-test-drive__form-container">
          <form
            className="form vida-cancel-test-drive__form"
            onSubmit={handleSubmit((formData) => cancelTestDrive(formData))}
          >
            <h2>{cancelTestDriveConfig.confirmLabel}</h2>
            <label className="form__field-label">
              {cancelTestDriveConfig.helpLabel}
            </label>
            <div className="form__group form__field-radio-group">
              {cancelTestDriveConfig.selection.map((item, index) => (
                <div className="form__field-radio" key={index}>
                  <label className="form__field-label">
                    {item.label}
                    <input
                      type="radio"
                      name="reason"
                      id={item.label}
                      value={item.value}
                      defaultChecked={item.value === "Other"}
                      {...register("reason", {
                        onChange: (e) => handleOnReasonChange(e)
                      })}
                    />
                    <span className="form__field-radio-mark"></span>
                  </label>
                </div>
              ))}
            </div>
            <div
              className={
                errors.remarks
                  ? "form__group form__group--error"
                  : "form__group"
              }
            >
              <label className="form__field-label">
                {cancelTestDriveConfig.reasonField.label}
              </label>
              <textarea
                name="remarks"
                className="form__field-textarea"
                placeholder={cancelTestDriveConfig.reasonField.placeholder}
                {...register("remarks")}
              ></textarea>
              {errors.remarks && errors.remarks.type === "required" && (
                <>
                  <p className="form__field-message">
                    {cancelTestDriveConfig.reasonField.validationRules
                      .required &&
                      cancelTestDriveConfig.reasonField.validationRules.required
                        .message}
                  </p>
                </>
              )}
            </div>
            <div className="vida-cancel-test-drive__button-container">
              <button className="btn btn--secondary btn--lg">
                {cancelTestDriveConfig.yesBtn.label}
              </button>
              <button
                className="btn btn--primary btn--lg"
                onClick={(e) => {
                  e.preventDefault(),
                    props.handleCancelTestDriveClose &&
                      props.handleCancelTestDriveClose();
                }}
              >
                {cancelTestDriveConfig.noBtn.label}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CancelTestDrive.propTypes = {
  cancelTestDriveConfig: PropTypes.object,
  cardData: PropTypes.object,
  getAllTestRides: PropTypes.func,
  handleCancelTestDriveClose: PropTypes.func
};

CancelTestDrive.defaultProps = {
  cardData: {}
};

export default CancelTestDrive;
