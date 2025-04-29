import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Dropdown from "../../form/Dropdown/Dropdown";
import DateField from "../../form/DateField/DateField";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import {
  useCheckAvailability,
  useBookLongTermSelfPickupTestDrive,
  useRescheduleLongTermTestDrive
} from "../../../hooks/testDrive/testDriveHooks";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import dateUtils from "../../../../site/scripts/utils/dateUtils";
import CONSTANT from "../../../../site/scripts/constant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const ScheduleSelfPickup = (props) => {
  const rentDurationDefaultOption = appUtils.getConfig(
    "rentDurationDefaultOption"
  );
  const modelDefaultOption = appUtils.getConfig("modelDefaultOption");
  const branchDefaultOption = appUtils.getConfig("branchDefaultOption");
  const timeDefaultOption = appUtils.getConfig("timeDefaultOption");
  const lttrTestDriveSummaryUrl = appUtils.getPageUrl(
    "lttrTestDriveSummaryUrl"
  );
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const {
    register,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
    clearErrors,
    control,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const {
    rentDurationField,
    modelVariantField,
    pickupDateFieldInfo,
    pickupLocationField,
    pickupTimeSlotField,
    payableAmount,
    rescheduleSubmitBtn,
    submitBtn
  } = props.config;

  const { selectedData, rentDurationList, modelVariantList, pickupDateList } =
    props;

  const [pickupLocationList, setPickupLocationList] = useState([]);
  const [pickupTimeSlotList, setpickupTimeSlotList] = useState([]);

  const [showPayableAmount, setShowPayableAmount] = useState(false);

  const [disableRentDuration, setDisableRentDuration] = useState(false);
  const [disableModelVariant, setDisableModelVariant] = useState(true);
  const [disablePickupLocation, setDisablePickupLocation] = useState(true);
  const [disablePickupDate, setDisablePickupDate] = useState(true);
  const [disablePickupTimeSlot, setDisablePickupTimeSlot] = useState(true);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);

  const checkAvailability = useCheckAvailability();
  const schedulePickup = useBookLongTermSelfPickupTestDrive(false);
  const updateSchedulePickup = useBookLongTermSelfPickupTestDrive(true);
  const reschedulePickup = useRescheduleLongTermTestDrive(true);

  const handleRentDurationDropdownChange = async (name, val) => {
    if (val) {
      setShowPayableAmount(true);
      setDisableModelVariant(false);
    } else {
      setShowPayableAmount(false);
      setValue("modelVarient", "");
      setDisableModelVariant(true);
      setValue("pickupDate", "");
      setDisablePickupDate(true);
      setValue("pickupLocation", "");
      setDisablePickupLocation(true);
      setValue("pickupTime", "");
      setDisablePickupTimeSlot(true);
    }
  };

  const handleModelVarientDropdownChange = (name, val) => {
    if (val) {
      setDisablePickupDate(false);
    } else {
      setValue("pickupDate", "");
      setDisablePickupDate(true);
      setValue("pickupLocation", "");
      setDisablePickupLocation(true);
      setValue("pickupTime", "");
      setDisablePickupTimeSlot(true);
    }
  };

  const handlePickupDateChange = async (val) => {
    if (val) {
      setSpinnerActionDispatcher(true);
      const response = await checkAvailability({
        variables: {
          startDate: dateUtils.formatSelectedDate(val),
          packageId: rentDurationList.find(
            (item) => item.value === getValues("rentDuration")
          ).packageId,
          skuId: modelVariantList.find(
            (item) => item.value === getValues("modelVarient")
          ).SkuId,
          cityId: parseInt(selectedData.cityId)
        }
      });

      if (
        response.data &&
        response.data.CheckAvailability &&
        response.data.CheckAvailability.statusCode === 200
      ) {
        const timeSlots =
          response.data.CheckAvailability.result[0].selfPickup.slot_info;
        const formattedTimeSlotList = timeSlots.map((slot, index) => {
          return {
            ...slot,
            label: slot.fromTime + " - " + slot.toTime,
            value: index.toString()
          };
        });
        setpickupTimeSlotList(formattedTimeSlotList);

        const locationList =
          response.data.CheckAvailability.result[0].selfPickup.location_data;
        const formattedLocationList = locationList.map((pickUpLocation) => {
          return {
            ...pickUpLocation,
            label: pickUpLocation.location_name,
            value: pickUpLocation.id.toString()
          };
        });
        setPickupLocationList(formattedLocationList);
        setDisablePickupTimeSlot(false);
        setDisablePickupLocation(false);

        if (
          selectedData.bookingId &&
          selectedData.rentalRecord.startDate ===
            dateUtils.formatSelectedDate(val)
        ) {
          setValue(
            "pickupLocation",
            selectedData.rentalRecord.locationId.toString()
          );
          setValue(
            "pickupTime",
            formattedTimeSlotList.find((slot) =>
              slot.label.startsWith(selectedData.rentalRecord.startTime)
            ).value
          );
        } else {
          setValue("pickupLocation", "");
          setValue("pickupTime", "");
        }
      } else {
        setValue("pickupLocation", "");
        setDisablePickupLocation(true);
        setValue("pickupTime", "");
        setDisablePickupTimeSlot(true);
      }
    } else {
      setValue("pickupLocation", "");
      setDisablePickupLocation(true);
      setValue("pickupTime", "");
      setDisablePickupTimeSlot(true);
    }
  };

  const handlePickupLocationDropdownChange = (name, val) => {
    console.log("branch changed");
    setValue("pickupLocation", val);
  };

  const handlePickupTimeChange = (name, val) => {
    if (val) {
      setDisableSubmitBtn(false);
    }
  };

  useEffect(() => {
    if (
      selectedData &&
      selectedData.bookingId &&
      selectedData.rentalRecord.modeOfPickup ==
        CONSTANT.LONG_TERM_MODE_OF_PICKUP.SELF_PICKUP
    ) {
      console.log(selectedData);

      setValue("rentDuration", selectedData.rentalRecord.packageId.toString());
      setValue("modelVarient", selectedData.rentalRecord.skuId);
      const date = selectedData.rentalRecord.startDate.split("-");
      setValue("pickupDate", date[2] + "/" + date[1] + "/" + date[0]);
      handlePickupDateChange(date[2] + "/" + date[1] + "/" + date[0]);

      if (selectedData.isReschedule) {
        setDisableRentDuration(true);
        setDisablePickupDate(false);
        setDisableSubmitBtn(false);
      } else {
        setDisableRentDuration(false);
        selectedData.rentalRecord.packageId.length > 0 &&
          setShowPayableAmount(true);
        setDisableModelVariant(false);
        setDisablePickupDate(false);
        setDisablePickupLocation(false);
        setDisablePickupTimeSlot(false);
        setDisableSubmitBtn(false);
      }
    }
  }, [selectedData && selectedData.bookingId, rentDurationList]);

  const handleFormSubmit = async (formData, event) => {
    setSpinnerActionDispatcher(true);
    const scheduledLocation = pickupLocationList.find(
      (pickUpLocation) =>
        pickUpLocation.id.toString() === formData.pickupLocation
    );
    const pickupRes =
      selectedData && selectedData.isReschedule && selectedData.bookingId
        ? await reschedulePickup({
            variables: {
              bookingId: selectedData.rentalRecord.bookingId,
              locationId: scheduledLocation.id,
              modeOfPickup: 2,
              startDate: dateUtils.formatSelectedDate(formData.pickupDate),
              startTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).fromTime,
              endTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).toTime,
              skuId: selectedData.rentalRecord.skuId,
              cityId: selectedData.cityId,
              address1: scheduledLocation.Address1,
              address2: scheduledLocation.Address2,
              zip: scheduledLocation.AddressZip,
              landmark: "",
              latitude: selectedData.rentalRecord.Latitude || "",
              longitude: selectedData.rentalRecord.Longitude || "",
              current_address:
                (scheduledLocation &&
                  scheduledLocation.Address1 +
                    ", " +
                    scheduledLocation.Address2 +
                    ", " +
                    scheduledLocation.AddressZip) ||
                ""
            }
          })
        : selectedData && !selectedData.isReschedule && selectedData.bookingId
        ? await updateSchedulePickup({
            variables: {
              bookingId:
                selectedData.bookingId &&
                selectedData.bookingId.length > 0 &&
                parseInt(selectedData.bookingId),
              startDate: dateUtils.formatSelectedDate(formData.pickupDate),
              packageId: rentDurationList.find(
                (item) => item.value === formData.rentDuration
              ).packageId,
              skuId: modelVariantList.find(
                (item) => item.value === formData.modelVarient
              ).SkuId,
              cityId: selectedData.cityId,
              startTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).fromTime,
              endTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).toTime,
              modeOfPickup: 2,
              locationId: scheduledLocation.id,
              cityName: selectedData.city,
              address1: scheduledLocation.Address1,
              address2: scheduledLocation.Address2,
              zip: scheduledLocation.AddressZip,
              landmark: "",
              latitude: (scheduledLocation && scheduledLocation.Latitude) || "",
              longitude:
                (scheduledLocation && scheduledLocation.Longitude) || "",
              current_address:
                (scheduledLocation &&
                  scheduledLocation.Address1 +
                    ", " +
                    scheduledLocation.Address2 +
                    ", " +
                    scheduledLocation.AddressZip) ||
                "",
              state: selectedData.state
            }
          })
        : await schedulePickup({
            variables: {
              startDate: dateUtils.formatSelectedDate(formData.pickupDate),
              packageId: rentDurationList.find(
                (item) => item.value === formData.rentDuration
              ).packageId,
              skuId: modelVariantList.find(
                (item) => item.value === formData.modelVarient
              ).SkuId,
              cityId: selectedData.cityId,
              startTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).fromTime,
              endTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).toTime,
              modeOfPickup: 2,
              locationId: scheduledLocation.id,
              cityName: selectedData.city,
              address1: scheduledLocation.Address1,
              address2: scheduledLocation.Address2,
              zip: scheduledLocation.AddressZip,
              landmark: "",
              latitude: (scheduledLocation && scheduledLocation.Latitude) || "",
              longitude:
                (scheduledLocation && scheduledLocation.Longitude) || "",
              current_address:
                (scheduledLocation &&
                  scheduledLocation.Address1 +
                    ", " +
                    scheduledLocation.Address2 +
                    ", " +
                    scheduledLocation.AddressZip) ||
                "",
              state: selectedData.state
            }
          });

    if (
      pickupRes.data &&
      pickupRes.data.ScheduleLongTermTestRide &&
      pickupRes.data.ScheduleLongTermTestRide.statusCode === 200
    ) {
      if (pickupRes.data.ScheduleLongTermTestRide.bookingId) {
        const encryptedParams = cryptoUtils.encrypt(
          `bookingId=${pickupRes.data.ScheduleLongTermTestRide.bookingId}`
        );
        if (isAnalyticsEnabled) {
          const customLink = {
            name: event.nativeEvent.submitter.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const ctaPageName = ":Schedule Self Pick-up";
          const additionalJourneyName = "Booking";
          analyticsUtils.trackCtaClick(
            customLink,
            ctaPageName,
            additionalJourneyName,
            function () {
              window.location.href = `${lttrTestDriveSummaryUrl}?${encryptedParams}`;
            }
          );
        } else {
          window.location.href = `${lttrTestDriveSummaryUrl}?${encryptedParams}`;
        }
      }
    }
    if (
      pickupRes.data &&
      pickupRes.data.rescheduleRide &&
      pickupRes.data.rescheduleRide.status_code === 200
    ) {
      const encryptedParams = cryptoUtils.encrypt(
        `bookingId=${selectedData.rentalRecord.bookingId}`
      );
      window.location.href = `${profileUrl}?${encryptedParams}`;
    }
  };

  return (
    <>
      <form
        className="form vida-pickup-centre"
        onSubmit={handleSubmit((formData, event) =>
          handleFormSubmit(formData, event)
        )}
      >
        <Dropdown
          name="rentDuration"
          label={rentDurationField.label}
          iconClass={`icon-calendar`}
          options={
            rentDurationList.length > 0
              ? [...rentDurationDefaultOption, ...rentDurationList]
              : rentDurationDefaultOption
          }
          value={getValues("rentDuration") || ""}
          setValue={setValue}
          onChangeHandler={handleRentDurationDropdownChange}
          errors={errors}
          validationRules={rentDurationField.validationRules}
          clearErrors={clearErrors}
          register={register}
          isDisabled={disableRentDuration}
        />

        <div className="vida-pickup-centre__model">
          <Dropdown
            name="modelVarient"
            label={modelVariantField.label}
            iconClass={`icon-scooter`}
            value={getValues("modelVarient") || ""}
            options={
              modelVariantList.length > 0
                ? [...modelDefaultOption, ...modelVariantList]
                : modelDefaultOption
            }
            setValue={setValue}
            onChangeHandler={handleModelVarientDropdownChange}
            errors={errors}
            validationRules={modelVariantField.validationRules}
            clearErrors={clearErrors}
            register={register}
            isDisabled={disableModelVariant}
          />
          {!getFieldState("modelVarient").error && (
            <span className="vida-pickup-centre__message">
              {modelVariantField.message}
            </span>
          )}
        </div>

        <DateField
          name="pickupDate"
          label={pickupDateFieldInfo.label}
          iconClass={`icon-calendar`}
          value={getValues("pickupDate") || ""}
          minDate={pickupDateList.length !== 0 ? pickupDateList[1].label : ""}
          maxDate={
            pickupDateList.length !== 0
              ? pickupDateList[pickupDateList.length - 1].label
              : ""
          }
          placeholder="DD/MM/YYYY"
          control={control}
          errors={errors}
          onChangeHandler={handlePickupDateChange}
          validationRules={pickupDateFieldInfo.validationRules}
          disabled={disablePickupDate}
        />

        <Dropdown
          name="pickupLocation"
          label={pickupLocationField.label}
          iconClass={`icon-building`}
          options={
            pickupLocationList.length > 0
              ? [...branchDefaultOption, ...pickupLocationList]
              : branchDefaultOption
          }
          value={getValues("pickupLocation") || ""}
          setValue={setValue}
          onChangeHandler={handlePickupLocationDropdownChange}
          errors={errors}
          validationRules={pickupLocationField.validationRules}
          clearErrors={clearErrors}
          register={register}
          isDisabled={disablePickupLocation}
        />

        <Dropdown
          name="pickupTime"
          label={pickupTimeSlotField.label}
          iconClass={`icon-clock`}
          options={
            pickupTimeSlotList.length > 0
              ? [...timeDefaultOption, ...pickupTimeSlotList]
              : timeDefaultOption
          }
          value={getValues("pickupTime") || ""}
          setValue={setValue}
          onChangeHandler={handlePickupTimeChange}
          errors={errors}
          validationRules={pickupTimeSlotField.validationRules}
          clearErrors={clearErrors}
          register={register}
          isDisabled={disablePickupTimeSlot}
        />

        {showPayableAmount && (
          <>
            <div className="vida-pickup-centre__amount">
              <span>{payableAmount.label}</span>
              <span>
                {currencyUtils.getCurrencyFormatValue(
                  rentDurationList.find(
                    (item) => item.value === getValues("rentDuration")
                  ).price
                )}
              </span>
            </div>
            <div>{payableAmount.message}</div>
          </>
        )}

        <button
          className="btn btn--primary btn--lg"
          disabled={disableSubmitBtn}
        >
          {selectedData && selectedData.isReschedule && selectedData.bookingId
            ? rescheduleSubmitBtn.label
            : submitBtn.label}
        </button>
      </form>
    </>
  );
};

ScheduleSelfPickup.propTypes = {
  config: PropTypes.object,
  selectedData: PropTypes.object,
  rentDurationList: PropTypes.array,
  modelVariantList: PropTypes.array,
  pickupDateList: PropTypes.array
};

export default ScheduleSelfPickup;
