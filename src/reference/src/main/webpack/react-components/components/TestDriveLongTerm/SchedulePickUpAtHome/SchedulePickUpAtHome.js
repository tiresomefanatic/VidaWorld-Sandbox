import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Dropdown from "../../form/Dropdown/Dropdown";
import DateField from "../../form/DateField/DateField";
import InputField from "../../form/InputField/InputField";
import NumberField from "../../form/NumberField/NumberField";
import CONSTANT from "../../../../site/scripts/constant";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import AddressLookup from "../../AddressLookup/AddressLookup";
import { Wrapper } from "@googlemaps/react-wrapper";
import {
  useCheckAvailability,
  useBookLongTermAtHomeTestDrive,
  useRescheduleLongTermTestDrive
} from "../../../hooks/testDrive/testDriveHooks";
import { getServiceablePincodesList } from "../../../../services/location.service";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import dateUtils from "../../../../site/scripts/utils/dateUtils";

const SchedulePickUpAtHome = (props) => {
  const apiKey = appUtils.getConfig("googleAPIKey");
  const rentDurationDefaultOption = appUtils.getConfig(
    "rentDurationDefaultOption"
  );
  const modelDefaultOption = appUtils.getConfig("modelDefaultOption");
  const timeDefaultOption = appUtils.getConfig("timeDefaultOption");
  const lttrTestDriveSummaryUrl = appUtils.getPageUrl(
    "lttrTestDriveSummaryUrl"
  );
  const profileUrl = appUtils.getPageUrl("profileUrl");

  const {
    register,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
    clearErrors,
    setError,
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
    addressField,
    buildingField,
    landmarkField,
    pinCodeField,
    pickupTimeSlotField,
    payableAmount,
    rescheduleSubmitBtn,
    submitBtn
  } = props.config;

  const {
    selectedData,
    rentDurationList,
    modelVariantList,
    pickupDateList,
    reloadMap,
    selectedLocation,
    setSelectedMapLocation
  } = props;

  const [pickupTimeSlotList, setpickupTimeSlotList] = useState([]);
  const [showPayableAmount, setShowPayableAmount] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [disableRentDuration, setDisableRentDuration] = useState(false);
  const [disableModelVariant, setDisableModelVariant] = useState(true);
  const [disablePickupDate, setDisablePickupDate] = useState(true);
  const [disablePickupTimeSlot, setDisablePickupTimeSlot] = useState(true);
  const [disablePincode, setDisablePincode] = useState(true);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);

  const checkAvailability = useCheckAvailability();
  const schedulePickup = useBookLongTermAtHomeTestDrive(false);
  const updateSchedulePickup = useBookLongTermAtHomeTestDrive(true);
  const reschedulePickup = useRescheduleLongTermTestDrive(false);
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
      setValue("address", "");
      setValue("building", "");
      setValue("landmark", "");
      setValue("pincode", "");
      setDisablePincode(true);
      setValue("pickupTime", "");
      setDisablePickupTimeSlot(true);
    }
  };

  const handleModelVarientDropdownChange = (name, val) => {
    const selectedVariantValue = getValues(name);
    setSelectedVariant(selectedVariantValue);
    if (val) {
      setDisablePickupDate(false);
    } else {
      setValue("pickupDate", "");
      setDisablePickupDate(true);
      setValue("address", "");
      setValue("building", "");
      setValue("landmark", "");
      setValue("pincode", "");
      setDisablePincode(true);
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
          response.data.CheckAvailability.result[0].homeDelivery.slot_info;
        const formattedTimeSlotList = timeSlots.map((slot, index) => {
          return {
            ...slot,
            label: slot.fromTime + " - " + slot.toTime,
            value: index.toString()
          };
        });
        setpickupTimeSlotList(formattedTimeSlotList);
        setDisablePickupTimeSlot(false);

        if (selectedData.bookingId && selectedData?.isReschedule) {
          setDisablePincode(true);
        } else {
          setDisablePincode(false);
        }

        if (
          selectedData.bookingId &&
          selectedData.rentalRecord.startDate ===
            dateUtils.formatSelectedDate(val)
        ) {
          setValue(
            "pickupTime",
            formattedTimeSlotList.find((slot) =>
              slot.label.startsWith(selectedData.rentalRecord.startTime)
            ).value
          );
        } else {
          setValue("pickupTime", "");
        }
      } else {
        if (!selectedData?.isReschedule) {
          setValue("address", "");
          setValue("building", "");
          setValue("landmark", "");
          setValue("pincode", "");
          setDisablePincode(true);
          setValue("pickupTime", "");
          setDisablePickupTimeSlot(true);
        }
      }
    } else {
      setValue("address", "");
      setValue("building", "");
      setValue("landmark", "");
      setValue("pincode", "");
      setDisablePincode(true);
      setValue("pickupTime", "");
      setDisablePickupTimeSlot(true);
    }
  };

  const handleInputFieldChange = (name, value) => {
    setValue(name, value);
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const handlePickupTimeChange = (name, val) => {
    if (val) {
      setDisableSubmitBtn(false);
    }
  };

  const handlePincodeInputFieldChange = (name, value) => {
    const mapLocation = { ...selectedLocation };
    mapLocation.pincode = value;
    setSelectedMapLocation(mapLocation);
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const checkPincodeServiceability = (pincode) => {
    if (selectedData && pincode) {
      setSpinnerActionDispatcher(true);
      getServiceablePincodesList(selectedData).then((res) => {
        clearErrors("pincode");
        if (!res.allPincodes.includes(parseInt(pincode))) {
          setError("pincode", {
            type: "custom",
            message: pinCodeField.validationRules.custom.noBranchMsg
          });
        } else {
          clearErrors("pincode");
        }
      });
    }
  };
  useEffect(() => {
    if (selectedLocation && !selectedData?.isReschedule) {
      checkPincodeServiceability(selectedLocation.pincode);
      setValue("pincode", selectedLocation.pincode);
    }
  }, [selectedLocation, selectedData]);
  useEffect(() => {
    if (
      selectedData &&
      selectedData.bookingId &&
      selectedData.rentalRecord.modeOfPickup ==
        CONSTANT.LONG_TERM_MODE_OF_PICKUP.HOME_DELIVERY
    ) {
      setValue("rentDuration", selectedData.rentalRecord.packageId.toString());
      setValue("modelVarient", selectedData.rentalRecord.skuId);
      const date = selectedData.rentalRecord.startDate.split("-");
      setValue("pickupDate", date[2] + "/" + date[1] + "/" + date[0]);
      handlePickupDateChange(date[2] + "/" + date[1] + "/" + date[0]);
      setValue("address", selectedData.rentalRecord.address1);
      setValue("building", selectedData.rentalRecord.address2);
      setValue("landmark", selectedData.rentalRecord.landmark);
      setValue("pincode", selectedData.rentalRecord.zip);

      if (selectedData?.isReschedule) {
        setDisableRentDuration(true);
        setDisablePincode(true);
        setDisablePickupDate(false);
        setDisableSubmitBtn(false);
      } else {
        setDisableRentDuration(false);
        selectedData.rentalRecord.packageId.length > 0 &&
          setShowPayableAmount(true);
        setDisableModelVariant(false);
        setDisablePickupDate(false);
        checkPincodeServiceability(selectedData.rentalRecord.zip);
        setDisablePincode(false);
        setDisablePickupTimeSlot(false);
        setDisableSubmitBtn(false);
      }
    }
  }, [selectedData && selectedData.bookingId, rentDurationList]);

  const handleFormSubmit = async (formData) => {
    setSpinnerActionDispatcher(true);
    const pickupRes =
      selectedData && selectedData.bookingId && selectedData.isReschedule
        ? await reschedulePickup({
            variables: {
              bookingId: selectedData.rentalRecord.bookingId,
              modeOfPickup: 1,
              startDate: dateUtils.formatSelectedDate(formData.pickupDate),
              startTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).fromTime,
              endTime: pickupTimeSlotList.find(
                (slot) => slot.value === formData.pickupTime
              ).toTime,
              skuId: selectedData.rentalRecord.skuId,
              cityId: selectedData.cityId,
              address1: selectedData.rentalRecord.address1,
              address2: selectedData.rentalRecord.address2,
              zip: selectedData.rentalRecord.zip,
              landmark: selectedData.rentalRecord.landmark,
              latitude: selectedData.rentalRecord.Latitude || "",
              longitude: selectedData.rentalRecord.Longitude || "",
              current_address: ""
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
              modeOfPickup: 1,
              cityName: selectedData.city,
              address1: formData.address,
              address2: formData.building,
              zip: formData.pincode,
              landmark: formData.landmark,
              latitude: (selectedLocation && selectedLocation.lat) || "",
              longitude: (selectedLocation && selectedLocation.lng) || "",
              current_address:
                (selectedLocation && selectedLocation.address) || "",
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
              modeOfPickup: 1,
              cityName: selectedData.city,
              address1: formData.address,
              address2: formData.building,
              zip: formData.pincode,
              landmark: formData.landmark,
              latitude: (selectedLocation && selectedLocation.lat) || "",
              longitude: (selectedLocation && selectedLocation.lng) || "",
              current_address:
                (selectedLocation && selectedLocation.address) || "",
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
        window.location.href = `${lttrTestDriveSummaryUrl}?${encryptedParams}`;
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
        onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
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

        {selectedVariant && selectedLocation && selectedLocation.address && (
          <Wrapper apiKey={apiKey} libraries={["places"]}>
            <AddressLookup
              defaultLocation={selectedLocation}
              reloadMap={reloadMap}
            />
          </Wrapper>
        )}

        <InputField
          name="address"
          label={addressField.label}
          placeholder={addressField.placeholder}
          value=""
          validationRules={addressField.validationRules}
          register={register}
          isDisabled={disablePincode}
          onChangeHandler={handleInputFieldChange}
          errors={errors}
          setValue={setValue}
        />

        <InputField
          name="building"
          label={buildingField.label}
          placeholder={buildingField.placeholder}
          value=""
          validationRules={buildingField.validationRules}
          register={register}
          isDisabled={disablePincode}
          onChangeHandler={handleInputFieldChange}
          errors={errors}
          setValue={setValue}
        />

        <InputField
          name="landmark"
          label={landmarkField.label}
          placeholder={landmarkField.placeholder}
          value=""
          validationRules={landmarkField.validationRules}
          register={register}
          isDisabled={disablePincode}
          onChangeHandler={handleInputFieldChange}
          errors={errors}
          setValue={setValue}
        />

        <NumberField
          name="pincode"
          label={pinCodeField.label}
          placeholder={pinCodeField.placeholder}
          value={getValues("pincode") || ""}
          validationRules={pinCodeField.validationRules}
          register={register}
          errors={errors}
          onChangeHandler={(value) =>
            handlePincodeInputFieldChange("pincode", value)
          }
          isDisabled={disablePincode}
          maxLength={CONSTANT.RESTRICT_PINCODE}
          setValue={setValue}
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
          disabled={disableSubmitBtn || Object.keys(errors).length}
        >
          {selectedData && selectedData.bookingId && selectedData.isReschedule
            ? rescheduleSubmitBtn.label
            : submitBtn.label}
        </button>
      </form>
    </>
  );
};

SchedulePickUpAtHome.propTypes = {
  config: PropTypes.object,
  selectedData: PropTypes.object,
  selectedLocation: PropTypes.object,
  rentDurationList: PropTypes.array,
  modelVariantList: PropTypes.array,
  pickupDateList: PropTypes.array,
  reloadMap: PropTypes.func,
  setSelectedMapLocation: PropTypes.func
};

export default SchedulePickUpAtHome;
