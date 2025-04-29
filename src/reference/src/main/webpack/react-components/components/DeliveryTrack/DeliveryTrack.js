import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DateField from "../form/DateField/DateField";
// import SelectField from "../form/SelectField/SelectField";
import { useForm } from "react-hook-form";
import RegistrationDetails from "../RegistrationDetails/RegistrationDetails";
import OwnerDetails from "../OwnerDetails/OwnerDetails";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import OrderCardDetails from "../UserOrders/OrderCardDetails/OrderCardDetails";
import { useUserOrders } from "../../hooks/userProfile/userProfileHooks";
import OrderSummary from "../OrderSummary/OrderSummary";
import CONSTANT from "../../../site/scripts/constant";
import { useScheduleDelivery } from "../../hooks/scheduleDelivery/scheduleDeliveryHooks";
import {
  useBookingDatesForTracking,
  useBookingTimeSlot
} from "../../hooks/testDrive/testDriveHooks";
import { resetBookingTimeSlotsDispatcher } from "../../store/testDrive/testDriveActions";
import Location from "../../../site/scripts/location";
import appUtils from "../../../site/scripts/utils/appUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Dropdown from "../form/Dropdown/Dropdown";
import { useBookingPaymentInfo } from "../../hooks/payment/paymentHooks";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { getUtmParams } from "../../../react-components/services/utmParams/utmParams";

const DeliveryTrack = (props) => {
  const {
    config,
    userOrderData,
    deliveryDateList,
    deliveryTimeSlotList,
    locationInfo,
    email
  } = props;
  const { deliveryTracker } = config;

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [isHomeAddress, setIsHomeAddress] = useState(false);
  const getUserOrders = useUserOrders();
  const getBookingDates = useBookingDatesForTracking();
  const getBookingTimeSlots = useBookingTimeSlot();
  const updateScheduleDelivery = useScheduleDelivery();
  const queryString = location.href.split("?")[1];
  const [filteredOrderData, setFilteredOrderData] = useState();
  const [experienceCenter, setExperienceCenter] = useState(null);
  const [deliveryDatesKey, setDeliveryDatesKey] = useState("experience_centre");
  const [processedDeliveryDateList, setProcessedDeliveryDateList] = useState(
    []
  );
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const trackerStatus = {
    step1: CONSTANT.TRACKER_STATUS.DRAFT,
    step2: CONSTANT.TRACKER_STATUS.REGISTRATION,
    step3: CONSTANT.TRACKER_STATUS.INSURANCE,
    step4: CONSTANT.TRACKER_STATUS.HSRP,
    step5: CONSTANT.TRACKER_STATUS.PDI,
    step6: CONSTANT.TRACKER_STATUS.DELIVERED
  };

  const [dateState, setDateState] = useState("");

  const backButtonHandler = () => {
    window.location.href = profileUrl;
  };

  const resetTimeField = () => {
    setValue("time", "");
    resetBookingTimeSlotsDispatcher();
  };

  const deliverySelectionHandler = (e) => {
    const selectedDelivery = e.target.innerText;
    setDateState("");
    resetTimeField();
    clearErrors("date");
    clearErrors("time");
    if (selectedDelivery && selectedDelivery.toLowerCase().includes("home")) {
      setIsHomeAddress(true);
      setProcessedDeliveryDateList(deliveryDateList["home_delivery"]);
    } else {
      setIsHomeAddress(false);
      setProcessedDeliveryDateList(deliveryDateList["experience_centre"]);
    }
  };

  const handleDateDropdownChange = async (name, id) => {
    const transType = isHomeAddress
      ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DELIVERY_AT_SITE
      : CONSTANT.TRANSACTION_TYPE.PRODUCT_DELIVERY;
    setSpinnerActionDispatcher(true);
    getBookingTimeSlots({
      variables: {
        transactionType: transType,
        branchId:
          filteredOrderData.deliveryBranchId || filteredOrderData.branchId,
        itemId: filteredOrderData.itemId,
        bookingDate: id
      }
    });
  };

  const formatDate = (date) => {
    date = date.split("/"); // 21/05/2022
    return date[2] + "-" + date[1] + "-" + date[0];
  };

  const handleDateChange = (dateValue) => {
    setDateState(dateValue);
    resetTimeField();
    handleDateDropdownChange("date", formatDate(dateValue));
  };

  const locationHandler = async (filterData) => {
    if (filterData && filterData.city) {
      const locationObj = new Location();
      await locationObj.getVidaCentreList(filterData.city);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  useEffect(() => {
    setDateState;
    if (filteredOrderData && filteredOrderData.home_delivery_opt_in) {
      setIsHomeAddress(filteredOrderData.home_delivery_opt_in);
    }
  }, [filteredOrderData]);

  useEffect(() => {
    if (deliveryDateList && deliveryDateList["experience_centre"]) {
      setProcessedDeliveryDateList(deliveryDateList["experience_centre"]);
    }
  }, [deliveryDateList]);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    if (
      userOrderData &&
      userOrderData.length &&
      queryString &&
      queryString.length
    ) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams(decryptedParams);
      // const params = new URLSearchParams(window.location.search);
      const selectedOrderId = params.get("orderId");
      if (selectedOrderId) {
        const filterData = userOrderData.filter(
          (item) => item.orderId == selectedOrderId
        );
        setFilteredOrderData(filterData[0]);

        locationHandler(filterData[0]);
        setSpinnerActionDispatcher(false);

        if (filterData && filterData.length) {
          setSpinnerActionDispatcher(true);
          getBookingDates({
            variables: {
              transactionType: CONSTANT.TRANSACTION_TYPE.PRODUCT_DELIVERY,
              branchId:
                filterData[0].deliveryBranchId || filterData[0].branchId,
              itemId: filterData[0].itemId,
              daysCount: "5"
            }
          });
        }
      }
    }
  }, [userOrderData]);

  useEffect(() => {
    if (locationInfo && locationInfo.length) {
      locationInfo.map((center) => {
        if (center.type === CONSTANT.CENTERLIST.EXPERIENCE_CENTER) {
          const nearByLocation = center.items.find((centerAddress) => {
            return centerAddress.id === filteredOrderData.branchId;
          });
          setExperienceCenter(nearByLocation);
        }
      });
    }
  }, [locationInfo]);

  const handleFormSubmit = async (formData, event) => {
    setSpinnerActionDispatcher(true);
    const params = getUtmParams();
    const scheduleDelivery = await updateScheduleDelivery({
      variables: {
        order_id: filteredOrderData.orderId ? filteredOrderData.orderId : "",
        delivery_order_id: filteredOrderData.deliveryOrderId
          ? filteredOrderData.deliveryOrderId
          : "",
        requestedDeliveryDate: formData.date ? formData.date : "",
        requestedDeliveryTimeSlotId: formData.time ? formData.time : "",
        atEC_c: !isHomeAddress,
        atHome_c: isHomeAddress,
        branch_id:
          filteredOrderData.deliveryBranchId || filteredOrderData.branchId,
        utm_params: params
      }
    });

    if (
      scheduleDelivery.data &&
      scheduleDelivery.data.scheduleDelivery.status
    ) {
      setDateState("");
      resetTimeField();
      showNotificationDispatcher({
        title: scheduleDelivery.data.scheduleDelivery.message,
        type:
          scheduleDelivery.data.scheduleDelivery.status === true
            ? CONSTANT.NOTIFICATION_TYPES.SUCCESS
            : CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
      getUserOrders();
      if (isAnalyticsEnabled) {
        const customLink = {
          name: event.nativeEvent.submitter.innerText,
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };

        const additionalPageName = `:${
          isHomeAddress
            ? deliveryTracker.deliveryPriority.onsite.label
            : deliveryTracker.deliveryPriority.experienceCenter.label
        }`;
        analyticsUtils.trackCtaClick(customLink, additionalPageName);
      }
    }
  };

  const bookingPaymentInfo = useBookingPaymentInfo();
  const handlePayment = async (bookingId) => {
    setSpinnerActionDispatcher(true);
    const paymentResult = await bookingPaymentInfo({
      variables: {
        order_id: bookingId,
        payment_mode: CONSTANT.PAYMENT_MODE.ONLINE,
        payment_type: CONSTANT.PAYMENT_TYPE.FAMESUBSIDY
      }
    });
    if (
      paymentResult &&
      paymentResult.data &&
      paymentResult.data.CreateSaleOrderPayment &&
      paymentResult.data.CreateSaleOrderPayment.payment_url
    ) {
      window.location.href =
        paymentResult.data.CreateSaleOrderPayment.payment_url;
    }
  };

  return (
    filteredOrderData &&
    Object.keys(filteredOrderData).length && (
      <div className="vida-container">
        <div className="vida-delivery-track">
          <div className="vida-delivery-track__headline">
            <div>
              <h2 className="vida-delivery-track__order-title-primary">
                <span
                  onClick={backButtonHandler}
                  className="icon-chevron vida-delivery-track__icon-btn-back"
                ></span>
                {config.title} {filteredOrderData.vehicleName}
              </h2>
            </div>
            <div className="vida-delivery-track__btn-back">
              <button
                onClick={backButtonHandler}
                className="btn btn--secondary"
              >
                {config.backBtn.label}
              </button>
            </div>
          </div>
          <div className="vida-delivery-track__line-break">
            <OrderCardDetails
              userOrderConfig={config}
              cardData={filteredOrderData}
              cardView={CONSTANT.ORDERS_VIEW.BOOKING}
              paymentHandler={handlePayment}
            />
          </div>
          <div className="vida-delivery-track__title">
            <h3>{deliveryTracker.title}</h3>
          </div>

          <div className="vida-delivery-track__wrapper">
            <div className="vida-delivery-track__wrapper--items">
              <div className="vida-delivery-track__wrapper--items--left">
                <div>
                  <span
                    className={`icon-check vida-delivery-track__status-icon ${
                      filteredOrderData.deliveryOrderStatus ==
                      trackerStatus.step1
                        ? "vida-delivery-track__status-active"
                        : ""
                    }`}
                  ></span>
                </div>
                <div
                  className={`vida-delivery-track__vertical-line ${
                    filteredOrderData.deliveryOrderStatus != trackerStatus.step1
                      ? ""
                      : "vida-delivery-track__vertical-line-inactive"
                  }`}
                ></div>
              </div>
              <div
                className={`vida-delivery-track__wrapper--items--right ${
                  filteredOrderData.deliveryOrderStatus == trackerStatus.step1
                    ? "vida-delivery-track__wrapper--items--right--active"
                    : ""
                }`}
              >
                <div className="">
                  <h4>{deliveryTracker.vehicleAllocation.label}</h4>
                </div>
                {filteredOrderData.orderDate && filteredOrderData.orderTotal ? (
                  <div className="vida-delivery-track__wrapper--sub-title">
                    on {filteredOrderData.orderDate} -{" "}
                    {currencyUtils.getCurrencyFormatValue(
                      filteredOrderData.orderTotal
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="vida-delivery-track__wrapper--items">
              <div className="vida-delivery-track__wrapper--items--left">
                <div>
                  <span
                    className={`icon-check vida-delivery-track__status-icon ${
                      filteredOrderData.deliveryOrderStatus == "" ||
                      filteredOrderData.deliveryOrderStatus ==
                        trackerStatus.step1
                        ? "vida-delivery-track__status-inactive"
                        : filteredOrderData.deliveryOrderStatus ==
                            trackerStatus.step2 ||
                          filteredOrderData.deliveryOrderStatus ==
                            trackerStatus.step3
                        ? "vida-delivery-track__status-active"
                        : ""
                    }`}
                  ></span>
                </div>
                <div
                  className={`vida-delivery-track__vertical-line ${
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step1 &&
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step2 &&
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step3
                      ? ""
                      : "vida-delivery-track__vertical-line-inactive"
                  }`}
                ></div>
              </div>
              <div
                className={`vida-delivery-track__wrapper--items--right ${
                  filteredOrderData.deliveryOrderStatus ==
                    trackerStatus.step2 ||
                  filteredOrderData.deliveryOrderStatus == trackerStatus.step3
                    ? "vida-delivery-track__wrapper--items--right--active"
                    : ""
                }`}
              >
                <div className="vida-delivery-track__wrapper__content-wrapper">
                  <div>
                    <div>{deliveryTracker.rtoProcess.label}</div>
                    <div className="vida-delivery-track__wrapper--sub-title">
                      {deliveryTracker.rtoProcess.msg}
                    </div>{" "}
                  </div>
                  {filteredOrderData.registrationNumber ? (
                    <div className="vida-delivery-track__wrapper__content">
                      <div className="vida-delivery-track__wrapper__content--value">
                        <h4>{filteredOrderData.registrationNumber}</h4>
                      </div>
                      <div className="vida-delivery-track__wrapper__content--label">
                        {config.RTODetails.registrationNumberLabel}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="vida-delivery-track__wrapper--items">
              <div className="vida-delivery-track__wrapper--items--left">
                <div>
                  <span
                    className={`icon-check vida-delivery-track__status-icon ${
                      filteredOrderData.deliveryOrderStatus == "" ||
                      filteredOrderData.deliveryOrderStatus ==
                        trackerStatus.step1 ||
                      filteredOrderData.deliveryOrderStatus ==
                        trackerStatus.step2 ||
                      filteredOrderData.deliveryOrderStatus ==
                        trackerStatus.step3
                        ? "vida-delivery-track__status-inactive"
                        : filteredOrderData.deliveryOrderStatus ==
                          trackerStatus.step4
                        ? "vida-delivery-track__status-active"
                        : ""
                    }`}
                  ></span>
                </div>
                <div
                  className={`vida-delivery-track__vertical-line ${
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step1 &&
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step2 &&
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step3 &&
                    filteredOrderData.deliveryOrderStatus !==
                      trackerStatus.step4
                      ? ""
                      : "vida-delivery-track__vertical-line-inactive"
                  }`}
                ></div>
              </div>
              <div
                className={`vida-delivery-track__wrapper--items--right ${
                  filteredOrderData.deliveryOrderStatus == trackerStatus.step4
                    ? "vida-delivery-track__wrapper--items--right--active"
                    : ""
                }`}
              >
                <div>{deliveryTracker.vehicleCustomisation.label}</div>
                <div className="vida-delivery-track__wrapper--sub-title">
                  {deliveryTracker.vehicleCustomisation.msg}
                </div>
              </div>
            </div>
            <div className="vida-delivery-track__wrapper--items">
              <div className="vida-delivery-track__wrapper--items--left">
                <div>
                  <span
                    className={`vida-delivery-track__status-icon ${
                      filteredOrderData.deliveryOrderStatus ==
                      trackerStatus.step5
                        ? "icon-truck vida-delivery-track__status-active"
                        : filteredOrderData.deliveryOrderStatus ==
                          trackerStatus.step6
                        ? "icon-check"
                        : "icon-check vida-delivery-track__status-inactive"
                    }`}
                  ></span>
                </div>
                <div
                  className={`vida-delivery-track__vertical-line ${
                    filteredOrderData.deliveryOrderStatus != trackerStatus.step6
                      ? "vida-delivery-track__vertical-line-inactive"
                      : ""
                  }`}
                ></div>
              </div>
              <div
                className={`vida-delivery-track__wrapper--items--right ${
                  filteredOrderData.deliveryOrderStatus == trackerStatus.step5
                    ? "vida-delivery-track__wrapper--items--right--active"
                    : ""
                }`}
              >
                <div>{deliveryTracker.readyForDelivery.label}</div>

                {filteredOrderData.readyForDeliveryOrderDate ? (
                  <div className="vida-delivery-track__wrapper--sub-title">
                    on {filteredOrderData.readyForDeliveryOrderDate}
                  </div>
                ) : filteredOrderData.scheduledDate ? (
                  <div className="vida-delivery-track__wrapper--sub-title">
                    on {filteredOrderData.scheduledDate}
                  </div>
                ) : (
                  ""
                )}
                {filteredOrderData.deliveryOrderStatus ==
                  trackerStatus.step5 && (
                  <div className="vida-delivery-track__wrapper__schedule-delivery">
                    <div>{deliveryTracker.deliveryPriority.title}</div>
                    <div className="vida-delivery-track__wrapper__delivery-selection">
                      {!filteredOrderData.home_delivery_opt_in && (
                        // <span
                        //   onClick={deliverySelectionHandler}
                        //   className={`${
                        //     isHomeAddress
                        //       ? "vida-delivery-track__wrapper__delivery-selection--inactive"
                        //       : "vida-delivery-track__wrapper__delivery-selection--active"
                        //   }`}
                        // >
                        //   {
                        //     deliveryTracker.deliveryPriority.experienceCenter
                        //       .label
                        //   }
                        // </span>
                        <span
                          onClick={deliverySelectionHandler}
                          className="vida-delivery-track__wrapper__delivery-selection--active"
                        >
                          {
                            deliveryTracker.deliveryPriority.experienceCenter
                              .label
                          }
                        </span>
                      )}
                      {filteredOrderData.home_delivery_opt_in && (
                        // <span
                        //   onClick={deliverySelectionHandler}
                        //   className={`${
                        //     isHomeAddress
                        //       ? "vida-delivery-track__wrapper__delivery-selection--active"
                        //       : "vida-delivery-track__wrapper__delivery-selection--inactive"
                        //   }`}
                        // >
                        //   {deliveryTracker.deliveryPriority.onsite.label}
                        // </span>
                        <span
                          onClick={deliverySelectionHandler}
                          className="vida-delivery-track__wrapper__delivery-selection--active"
                        >
                          {deliveryTracker.deliveryPriority.onsite.label}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="address-container">
                        {isHomeAddress ? (
                          <span className="address-container__title">
                            {
                              deliveryTracker.deliveryPriority.onsite
                                .addressLabel
                            }
                          </span>
                        ) : (
                          <span className="address-container__title">
                            {
                              deliveryTracker.deliveryPriority.experienceCenter
                                .addressLabel
                            }
                          </span>
                        )}
                        <div className="address-container__content">
                          {isHomeAddress
                            ? filteredOrderData.shippingAddress
                            : experienceCenter && experienceCenter.address}
                        </div>
                      </div>
                    </div>
                    <div>
                      <form
                        onSubmit={handleSubmit((formData, event) =>
                          handleFormSubmit(formData, event)
                        )}
                      >
                        <div className="vida-delivery-track__form-fields">
                          <DateField
                            label={
                              deliveryTracker.deliveryPriority.onsite.dateField
                                .label
                            }
                            iconClass={`icon-calendar`}
                            value={dateState}
                            minDate={
                              processedDeliveryDateList.length !== 0
                                ? processedDeliveryDateList[1].label
                                : ""
                            }
                            maxDate={
                              processedDeliveryDateList.length !== 0
                                ? processedDeliveryDateList[
                                    processedDeliveryDateList.length - 1
                                  ].label
                                : ""
                            }
                            name="date"
                            placeholder="DD/MM/YYYY"
                            onChangeHandler={handleDateChange}
                            validationRules={
                              deliveryTracker.deliveryPriority.onsite.dateField
                                .validationRules
                            }
                            control={control}
                            errors={errors}
                          />
                          <Dropdown
                            name="time"
                            label={
                              deliveryTracker.deliveryPriority.onsite.timeField
                                .label
                            }
                            iconClass={`icon-clock`}
                            options={
                              deliveryTimeSlotList &&
                              deliveryTimeSlotList.length
                                ? [
                                    {
                                      label: "Select Time",
                                      value: ""
                                    },
                                    ...deliveryTimeSlotList
                                  ]
                                : [
                                    {
                                      label: "Select Time",
                                      value: ""
                                    }
                                  ]
                            }
                            value={getValues("time") || ""}
                            setValue={setValue}
                            errors={errors}
                            validationRules={
                              deliveryTracker.deliveryPriority.onsite.timeField
                                .validationRules
                            }
                            clearErrors={clearErrors}
                            register={register}
                          />
                        </div>

                        <button className="btn btn--primary">
                          {
                            deliveryTracker.deliveryPriority.onsite
                              .scheduleDeliveyBtn.label
                          }
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="vida-delivery-track__wrapper--items">
              <div className="vida-delivery-track__wrapper--items--left">
                <div>
                  <span
                    className={`icon-check vida-delivery-track__status-icon ${
                      filteredOrderData.deliveryOrderStatus ==
                      trackerStatus.step6
                        ? ""
                        : "vida-delivery-track__status-inactive"
                    } `}
                  ></span>
                </div>
              </div>
              <div className="vida-delivery-track__wrapper--items--right">
                <div>{deliveryTracker.delivery.label}</div>
                <div className="vida-delivery-track__wrapper--sub-title">
                  {deliveryTracker.delivery.msg}
                </div>
              </div>
            </div>
          </div>
          <div>
            {" "}
            {filteredOrderData.registrationNumber && (
              <RegistrationDetails
                registrationDetails={config.RTODetails}
                registrationData={filteredOrderData}
              ></RegistrationDetails>
            )}
          </div>
          <div className="vida-delivery-track__comp">
            <div className="vida-delivery-track__comp--left">
              {filteredOrderData.paymentInformation &&
              filteredOrderData.paymentInformation.length ? (
                <PaymentDetails
                  paymentInfo={config.paymentInfo}
                  paymentInfoData={filteredOrderData.paymentInformation}
                ></PaymentDetails>
              ) : (
                ""
              )}
              <OwnerDetails
                customerDetails={config.customerDetails}
                customerInfo={filteredOrderData}
              ></OwnerDetails>
            </div>
            <div className="vida-delivery-track__comp--right">
              <OrderSummary
                orderSummaryConfig={config.orderSummary}
                cardData={filteredOrderData}
              ></OrderSummary>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
const mapStateToProps = ({
  userOrderReducer,
  testDriveReducer,
  userProfileDataReducer
}) => {
  return {
    userOrderData: userOrderReducer.userOrderData,
    deliveryDateList: testDriveReducer.bookingDateForDeliveryList,
    deliveryTimeSlotList: testDriveReducer.bookingTimeSlotList,
    locationInfo: testDriveReducer.nearByVidaCentreList,
    email: userProfileDataReducer.email
  };
};

DeliveryTrack.propTypes = {
  config: PropTypes.object,
  deliveryTracker: PropTypes.object,
  userOrderData: PropTypes.array,
  deliveryDateList: PropTypes.object,
  deliveryTimeSlotList: PropTypes.array,
  locationInfo: PropTypes.array,
  email: PropTypes.string
};

export default connect(mapStateToProps)(DeliveryTrack);
