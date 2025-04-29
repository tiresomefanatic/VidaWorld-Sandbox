import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { useOptimizedGetOrderData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { useBookingPartialPaymentInfo } from "../../../hooks/payment/paymentHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useForm } from "react-hook-form";
import NumberField from "../forms/NumberField/NumberField";
import DeliveryTracker from "../DeliveryTracker/DeliveryTracker";
import Drawer from "../Drawer/Drawer";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import CONSTANT from "../../../../site/scripts/constant";
import Cookies from "js-cookie";
import dateUtils from "../../../../site/scripts/utils/dateUtils";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";
import Banner from "../Purchase/Components/Banner";
import { useCancelPayment } from "../../../hooks/quickPurchase/quickPurchaseHook";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const PartialPayment = ({
  config,
  orderData,
  userProfileInfo,
  productData
}) => {
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const ordersUrl = appUtils.getPageUrl("ordersUrl");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  // use-state
  const [progessStatus, setProgressStatus] = useState("payment-in-progress");
  const [orderDetailsResult, setOrderDetailsResult] = useState("");
  const [orderPriceBreakup, setOrderPriceBreakup] = useState();
  const [showPaymentDetailsLandingPage, setShowPaymentDetailsLandingPage] =
    useState(true);
  const [showPartPaymentPopup, setShowPartPaymentPopup] = useState(true);
  const [isPaymentBtnDisabled, setIsPaymentBtnDisabled] = useState(true);
  const [isContinueToUploadBtnDisabled, setIsContinueToUploadBtnDisabled] =
    useState(true);

  const [showMinimumText, setShowMinimumText] = useState(true);

  // hooks
  const opSalesOrderDetails = useOptimizedGetOrderData();
  const bookingPartialPaymentInfo = useBookingPartialPaymentInfo();
  const useCancelOrder = useCancelPayment();

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const queryString = window.location.href.split("?")[1];
  const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);
  const orderId = params && params.get("orderId");
  const opportunityId = params && params.get("opportunityId");

  const [paymentInfo, setPaymentInfo] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [randomAmounts, setRandomAmounts] = useState([]);
  const amountInputRef = useRef();
  const [finalAmountValue, setFinalAmountValue] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const bikeVariantDetail =
    typeof config?.bikeVariantDetails == "string"
      ? JSON.parse(config?.bikeVariantDetails || "{}")
      : config?.bikeVariantDetails;
  const [activeVariant, setActiveVariant] = useState();
  const [offersPrice, setOffersPrice] = useState(0);
  const [showCancelOrderPopup, setCancelOrderPopup] = useState(false);
  const [isDisableButton, setDiasbleButton] = useState(true);
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const [eligibleCancelButton, setEligibleCancelButton] = useState(false);

  useEffect(() => {
    setDeliveryDate(dateUtils.calcDeliveryDate());
  }, []);

  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const backgroundImage = isDesktop
    ? config.partPaymentBgDesktop
    : config.partPaymentBgMobile;

  useEffect(() => {
    const paymentInformation = window.sessionStorage.getItem("partPayDetails");
    const isCancelButton =
      window.sessionStorage.getItem("eligibleForCancellation") === "true";
    setEligibleCancelButton(isCancelButton);
    if (paymentInformation) {
      const getPaymentInfo = JSON.parse(paymentInformation);
      if (getPaymentInfo) {
        if (parseFloat(getPaymentInfo[0].amount) < parseFloat("10000")) {
          getPaymentInfo.shift();
          setPaymentInfo(getPaymentInfo);
        } else {
          setPaymentInfo(getPaymentInfo);
        }
      }
    }
    // window.sessionStorage.removeItem("partPayDetails");
  }, []);

  const ctaTracking = (e, eventName, linkPosition) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: typeof e === "object" ? e.target.innerText : e,
        ctaLocation:
          typeof e === "object" ? e.target.dataset.linkPosition : linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const getSalesOrderDetails = async () => {
    setSpinnerActionDispatcher(true);
    if (orderId && opportunityId) {
      const orderDetailsResult = await opSalesOrderDetails({
        variables: {
          order_id: orderId,
          opportunity_id: opportunityId
        }
      });
      if (
        orderDetailsResult &&
        orderDetailsResult?.data &&
        orderDetailsResult?.data?.OpGetSaleOrderDetails
      ) {
        setOrderDetailsResult(orderDetailsResult?.data?.OpGetSaleOrderDetails);
        setOrderPriceBreakup(
          orderDetailsResult?.data?.OpGetSaleOrderDetails?.sale_order_line
        );
        if (
          orderDetailsResult?.data?.OpGetSaleOrderDetails?.discount_data
            ?.length > 0
        ) {
          let discountPrice = 0;
          orderDetailsResult?.data?.OpGetSaleOrderDetails?.discount_data.map(
            (item) => (discountPrice += parseInt(item.discount_amount))
          );
          setOffersPrice(discountPrice);
        }
        setSpinnerActionDispatcher(false);
        Cookies.set(CONSTANT.COOKIE_OPPORTUNITY_ID, opportunityId);
      } else {
        setSpinnerActionDispatcher(false);
      }
    } else {
      window.location.href = profileUrl;
    }
  };

  const getScooterColor = async () => {
    const selectedVariant = bikeVariantDetail?.bikeVariants?.filter(
      (item) =>
        item?.variantName?.toLowerCase() === productData?.name?.toLowerCase()
    );
    const bikeVariant = selectedVariant[0]?.variantDetails
      ? selectedVariant[0]?.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(
      productData?.vaahan_color,
      bikeVariant
    );
    setActiveVariant(selectedBikeVariant);
  };

  useEffect(() => {
    getScooterColor();
  }, [productData]);

  const handleGoBackPartPayment = () => {
    setCancelOrderPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    if (isAnalyticsEnabled) {
      const eventName = "ctaButtonClick";
      const linkDetails = {
        ctaText: "Cancel Order",
        ctaLocation: "Partial Payment"
      };
      const productDetails = {
        modelVariant: orderDetailsResult?.product_data.variant_name,
        modelColor: orderDetailsResult?.product_data.vaahan_color,
        productID: orderDetailsResult?.sf_item_id
      };
      analyticsUtils.trackCustomButtonClickV2(
        eventName,
        linkDetails,
        productDetails
      );
      // analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
    }
  };

  const handlePartPaymentAmountFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const handlePartPaymentAmountFormSubmit = async (formData) => {
    setSpinnerActionDispatcher(true);
    if (
      parseFloat(formData?.partPaymentAmount) >
      parseFloat(orderDetailsResult?.updated_order_grand_total)
    ) {
      setError("partPaymentAmount", {
        type: "custom",
        message:
          config?.partPaymentAmountField?.validationRules?.required?.message
      });
      setShowMinimumText(false);
      setSpinnerActionDispatcher(false);
    } else {
      const partialPaymentResult = await bookingPartialPaymentInfo({
        variables: {
          order_id: orderDetailsResult?.order_increment_id,
          payment_mode: "online",
          payment_type: "PARTIAL",
          partial_amount: parseFloat(formData?.partPaymentAmount)
        }
      });
      if (partialPaymentResult?.data?.CreateSaleOrderPayment?.payment_url) {
        window.sessionStorage.removeItem("partPayDetails");
        window.sessionStorage.removeItem("eligibleForCancellation");
        ctaTracking("Pay", "ctaButtonClick", "Partial Payment");
        window.location.href =
          partialPaymentResult?.data?.CreateSaleOrderPayment?.payment_url;
      } else {
        showNotificationDispatcher({
          title: partialPaymentResult?.errors?.message,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        setSpinnerActionDispatcher(false);
      }
    }
  };

  const handleCustomPaymentAmount = (amount) => {
    setValue("partPaymentAmount", amount);
    if (typeof amount === "number") {
      amount = amount.toString();
    }
    if (paymentInfo?.length + 1 < config?.allowedPartPayment) {
      setPriceInput(amount);
    }
  };

  useEffect(() => {
    if (!isDesktop) {
      setShowPaymentDetailsLandingPage(false);
    } else {
      setShowPaymentDetailsLandingPage(true);
    }
  }, []);

  useEffect(() => {
    if (orderId && opportunityId) {
      getSalesOrderDetails();
    } else {
      if (window.sessionStorage.getItem("partPayDetails")) {
        window.sessionStorage.removeItem("partPayDetails");
      }
      window.location.href = profileUrl;
    }
  }, [orderId]);

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  useEffect(() => {
    const newAmountsArray = [...(config?.partPaymentRandomAmounts || [])];

    if (config?.partPaymentRandomAmounts.length > 2) {
      if (orderDetailsResult?.updated_order_grand_total) {
        newAmountsArray.push(orderDetailsResult?.updated_order_grand_total);
        if (newAmountsArray.length > 3) {
          newAmountsArray.splice(2, 1);
        }
      }
    } else {
      if (orderDetailsResult?.updated_order_grand_total) {
        newAmountsArray.push(orderDetailsResult?.updated_order_grand_total);
      }
    }
    setRandomAmounts(newAmountsArray);
  }, [
    config?.partPaymentRandomAmounts,
    orderDetailsResult?.updated_order_grand_total
  ]);

  useEffect(() => {
    if (
      amountInputRef.current &&
      orderDetailsResult?.updated_order_grand_total
    ) {
      if (paymentInfo?.length + 1 === config?.allowedPartPayment) {
        setFinalAmountValue(
          parseInt(orderDetailsResult?.updated_order_grand_total)
        );
        setValue(
          "partPaymentAmount",
          parseInt(orderDetailsResult?.updated_order_grand_total)
        );
      }
    }
  }, [amountInputRef.current, orderDetailsResult?.updated_order_grand_total]);

  const handleCancelSubmit = async (formData, event) => {
    const variables = {
      payment_id: paymentInfo.map((paymentItem) => paymentItem.payId),
      reason: getValues("cancellationReason")
    };

    setSpinnerActionDispatcher(true);
    const cancelOrder = await useCancelOrder({ variables });
    if (
      cancelOrder &&
      cancelOrder.data.cancelPartialPayment[0]?.status === "200"
    ) {
      setCancelOrderPopup(false);
      document.querySelector("html").classList.remove("overflow-hidden");
      setSpinnerActionDispatcher(false);
      showNotificationDispatcher({
        title: cancelOrder.data.cancelPartialPayment[0]?.message,
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
      if (isAnalyticsEnabled) {
        const eventName = "confirmCancelOrder";
        const customLink = {
          ctaText: event.target.innerText,
          ctaLocation: "Order Card"
        };
        const location = {
          pinCode: orderDetailsResult?.addresses[0].pincode,
          city: orderDetailsResult?.addresses[0].city,
          state: orderDetailsResult?.addresses[0].state,
          country: defaultCountry
        };
        const productDetails = {
          modelVariant: orderDetailsResult?.product_data.variant_name,
          modelColor: orderDetailsResult?.product_data.vaahan_color,
          productID: orderDetailsResult?.sf_item_id
        };
        const insuranceDetails = {
          insurarName: orderDetailsResult.insurer_name,
          addOns: orderDetailsResult.insurance_addons
        };
        const bookingDetails = {
          bookingID: orderDetailsResult.order_increment_id,
          bookingStatus: "DRAFT",
          aadharCardUsedStatus: parseInt(orderDetailsResult.aadhar_selected)
            ? "YES"
            : "NO",
          gstNumber: ""
        };
        const orderDetails = {
          paymentType: "",
          paymentMethod: orderDetailsResult.payment_method,
          orderStatus: "DRAFT",
          orderValue: orderDetailsResult.updated_order_grand_total,
          paymentOption: orderDetailsResult.selected_payment
        };
        const priceBreakup = {
          insurancePrice: orderDetailsResult.insurance_amount,
          gstAmount: orderDetailsResult.updated_order_tax,
          otherCharges: orderDetailsResult.other_charges,
          addOnsCharges: orderDetailsResult.addons_price,
          govtSubsidy: orderDetailsResult.govt_subsidy_amount,
          offerPrice:
            orderDetailsResult.discount_data.length > 1
              ? orderDetailsResult.discount_data[0].net_benefit_tocustomer
              : 0
        };
        analyticsUtils.trackCancelOrderComplete(
          eventName,
          customLink,
          location,
          productDetails,
          insuranceDetails,
          bookingDetails,
          orderDetails,
          priceBreakup
        );
      }
      setTimeout(() => {
        showNotificationDispatcher({
          title: "You will be redirected to Orders page",
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
      }, 1000);
      setTimeout(() => {
        if (window.sessionStorage.getItem("partPayDetails")) {
          window.sessionStorage.removeItem("partPayDetails");
        }
        window.location.href = ordersUrl;
      }, 4000);
    } else {
      document.querySelector("html").classList.remove("overflow-hidden");
      setCancelOrderPopup(false);
      setSpinnerActionDispatcher(false);
      showNotificationDispatcher({
        title: cancelOrder.data.cancelPartialPayment[0]?.message,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
  };

  const handlecancelOrderReason = (formData) => {
    if (formData.length > 1) {
      setDiasbleButton(false);
    } else {
      setDiasbleButton(true);
    }
  };

  const handleCloseCancelPopup = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setCancelOrderPopup(false);
  };

  return (
    <div
      className="vida-part-payment-container"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* <img
        className="part-payment-bg-img"
        src={
          isDesktop ? config.partPaymentBgDesktop : config.partPaymentBgMobile
        }
        alt="cancel_booking_bg"
      ></img> */}
      <div className="payment-details-wrapper">
        <div className="payment-details-container vida-2-container">
          {showPaymentDetailsLandingPage && (
            <div className="payment-details-left-container">
              <p className="payment-details-normal-title">
                {config?.paymentDetailsNormalTitle}
              </p>
              <p className="payment-details-bold-title">
                {config?.paymentDetailsBoldTitle}
              </p>
              <Banner
                bannerBgImg={activeVariant?.bgImg}
                bikeName={orderDetailsResult?.product_data?.name}
                onItsWayText={config?.onItsWayText}
                userName={userProfileInfo?.fname}
                bannerBikeImg={activeVariant?.bikeImg}
                optedBikeVariant={activeVariant}
              />
              <div className="payment-details-delivery-tracker-container">
                <DeliveryTracker
                  config={config?.deliveryTrackerContent}
                  progressStatus={progessStatus}
                />
              </div>
            </div>
          )}
          {showPaymentDetailsLandingPage && (
            <div className="payment-details-right-container">
              <p className="payment-details-right-title">
                {config?.orderDetailsText}
              </p>
              <div className="item-details-container">
                <div className="item-details-title">
                  <p className="item-details-title-text">
                    {config?.itemDetailsText}
                  </p>
                </div>
                <div className="item-details-info">
                  <div className="item-details-bike-info">
                    <p className="bike-name">
                      {orderDetailsResult?.product_data?.name}
                    </p>
                    <p className="bike-color">
                      {orderDetailsResult?.product_data?.vaahan_color}
                    </p>
                  </div>
                  <p className="bike-price">
                    {currencyUtils.getCurrencyFormatValue(
                      orderDetailsResult?.base_price,
                      0
                    )}
                  </p>
                </div>
                <div className="order-price-breakup-list">
                  {orderPriceBreakup
                    ?.filter(
                      (item) =>
                        parseFloat(item?.unit_price) > 0 &&
                        item?.item_subtype !== "" &&
                        item?.item_subtype.toLowerCase() !== "insurance" &&
                        item?.line_name.toLowerCase() !== "effective price"
                    )
                    ?.map((item, index) => (
                      <div className="order-price-breakup-item" key={index}>
                        <p className="order-item-name">{item?.line_name}</p>
                        <p className="order-item-amount">
                          {currencyUtils.getCurrencyFormatValue(
                            item?.unit_price,
                            0
                          )}
                        </p>
                      </div>
                    ))}
                </div>
                {parseInt(orderDetailsResult.insurance_amount) > 0 ? (
                  <div className="order-price-breakup-item">
                    <p className="order-item-name">{config.insuranceText}</p>
                    <p className="order-item-amount">
                      {`+ ${currencyUtils.getCurrencyFormatValue(
                        orderDetailsResult?.insurance_base_price,
                        0
                      )}`}
                    </p>
                  </div>
                ) : (
                  <div className="order-price-breakup-item">
                    <p className="order-item-name">{config.insuranceText}</p>
                    <p className="order-item-amount">
                      {`${currencyUtils.getCurrencyFormatValue(0)}`}
                    </p>
                  </div>
                )}
                {orderDetailsResult.discount_data?.length > 0 && (
                  <div className="order-price-breakup-item offers">
                    <p className="order-item-name">{config?.offersText}</p>
                    <p className="order-item-amount">
                      {" "}
                      {` - ${currencyUtils.getCurrencyFormatValue(
                        offersPrice,
                        0
                      )}`}
                    </p>
                  </div>
                )}
                {parseInt(orderDetailsResult.govt_subsidy_amount) > 0 && (
                  <div className="order-price-breakup-item">
                    {/* will be changed later */}
                    <p className="order-item-name">{config?.fameAmountText}</p>
                    <p className="order-item-amount">
                      {`- ${currencyUtils.getCurrencyFormatValue(
                        orderDetailsResult?.govt_subsidy_amount,
                        0
                      )}`}
                    </p>
                  </div>
                )}
                {parseInt(orderDetailsResult?.prebooking_price_paid) > 0 && (
                  <div className="order-price-breakup-item">
                    <p className="order-item-name">
                      {config?.prebookingPriceText}
                    </p>
                    <p className="order-item-amount">
                      {`- ${currencyUtils.getCurrencyFormatValue(
                        orderDetailsResult?.prebooking_price_paid,
                        0
                      )}`}
                    </p>
                  </div>
                )}
                {parseInt(orderDetailsResult?.updated_order_tax) > 0 && (
                  <div className="order-price-breakup-item tax-amount">
                    <p className="order-item-name">{config?.gstAmountText}</p>
                    <p className="order-item-amount">
                      {currencyUtils.getCurrencyFormatValue(
                        orderDetailsResult?.updated_order_tax,
                        0
                      )}
                    </p>
                  </div>
                )}
                <div className="order-price-breakup-item total-amount">
                  <p className="order-item-name">{config?.totalPayableText}</p>
                  <p className="order-item-amount">
                    {currencyUtils.getCurrencyFormatValue(
                      orderDetailsResult?.updated_order_grand_total,
                      0
                    )}
                  </p>
                </div>
              </div>
              <div className="address-detail-container">
                {orderDetailsResult?.addresses?.map((item, index) => (
                  <div className="address-detail-content-container" key={index}>
                    <p className="address-title-text">{item?.address_type}</p>
                    <div className="address-info-container">
                      <p className="address-info">{`${item?.address_line1}, ${item?.address_line2}, ${item?.address_landmark}, ${item?.city}, ${item?.state}-${item?.pincode}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {showPartPaymentPopup && (
          <div className="part-payment-popup-container">
            <Drawer>
              <div className="part-payment-container">
                <div className="part-payment-left-container">
                  <p className="part-payment-normal-title">
                    {paymentInfo?.length + 1 < config?.allowedPartPayment
                      ? config?.makePartPaymentNormalTitle
                      : config?.makeRemainingPaymentNormalTitle}
                  </p>
                  <p className="part-payment-bold-title">
                    {paymentInfo?.length + 1 < config?.allowedPartPayment
                      ? config?.makePartPaymentBoldTitle
                      : config?.makeRemainingPaymentBoldTitle}
                  </p>

                  <p className="part-payment-helper-text">
                    {config?.partPayHelperText}
                  </p>
                  {paymentInfo?.length + 1 < config?.allowedPartPayment && (
                    <div className="part-payment-transaction-text-container">
                      <p className="part-payment-transaction-header">
                        {config?.partPayTransactionHeader}
                      </p>
                      <p className="part-payment-transaction-text">
                        {config?.partPayTransactionText}
                      </p>
                    </div>
                  )}
                  {/* to be tested in dev env */}
                  {orderDetailsResult?.paymentMode === "partialpayment" && (
                    <div className="part-payment-paid-amount-card-container">
                      <div className="part-payment-card-first-container">
                        <p className="part-payment-card-title-text">
                          {config?.partPaymentText}
                        </p>
                        <p className="part-payment-card-amount">
                          {orderDetailsResult?.updated_order_grand_total}
                        </p>
                      </div>
                      <div className="part-payment-card-second-container">
                        <p className="part-payment-card-date-text">
                          12 Oct 2023 at 2:20 PM
                        </p>
                        <p className="part-payment-card-payment">
                          Card payement
                        </p>
                      </div>
                    </div>
                  )}
                  {paymentInfo?.length > 0 ? (
                    <div className="part-payment-details-list-container">
                      {paymentInfo?.map((paymentItem, index) => (
                        <div className="part-payment-list-item" key={index}>
                          <div className="payment-list-header">
                            <div className="payment-title">
                              <img
                                src={
                                  appUtils.getConfig("resourcePath") +
                                  "images/png/success-icon.png"
                                }
                              />
                              <div className="payment-header-title">
                                <p className="payment-confirmation">
                                  {config?.paymentReceivedText}
                                </p>
                                <p className="payment-type-text">{`${
                                  config?.partPaymentText
                                } ${index + 1}`}</p>
                              </div>
                            </div>
                            <div className="payment-amount-title">
                              {currencyUtils.getCurrencyFormatValue(
                                parseFloat(paymentItem.amount),
                                0
                              )}
                            </div>
                          </div>
                          <div className="payment-information-wrapper">
                            <p>{paymentItem.paymentDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="part-payment-spacing-container"></div>
                  )}
                  {/* to be tested in dev env */}
                  <div className="part-payment-pay-container mobile-view">
                    <p className="part-payment-pay-title">
                      {paymentInfo?.length === 0
                        ? `${config?.partPaymentText} ${
                            paymentInfo?.length > 0
                              ? paymentInfo?.length + 1
                              : 1
                          }`
                        : config?.balancePaymentHeader}
                    </p>
                    {paymentInfo?.length + 1 < config?.allowedPartPayment ? (
                      <div className="part-payment-pay-btn-container">
                        {randomAmounts?.map((item, index) => (
                          <button
                            className="price-btn"
                            type="button"
                            onClick={() => {
                              handleCustomPaymentAmount(parseFloat(item));
                            }}
                            key={index}
                          >
                            {currencyUtils.getCurrencyFormatValue(
                              parseFloat(item),
                              0
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                    <form
                      onSubmit={handleSubmit((formData) =>
                        handlePartPaymentAmountFormSubmit(formData)
                      )}
                      ref={amountInputRef}
                    >
                      <NumberField
                        name="partPaymentAmount"
                        label={config?.partPaymentAmountField?.label}
                        placeholder={
                          config?.partPaymentAmountField?.placeholder
                        }
                        validationRules={
                          config?.partPaymentAmountField?.validationRules
                        }
                        register={register}
                        errors={errors}
                        value={
                          finalAmountValue &&
                          paymentInfo?.length + 1 >= config?.allowedPartPayment
                            ? finalAmountValue
                            : priceInput
                            ? priceInput
                            : ""
                        }
                        setPriceInput={setPriceInput}
                        maxLength={
                          config?.partPaymentAmountField?.validationRules
                            ?.maxLength?.value
                        }
                        isDisabled={finalAmountValue ? true : false}
                        setValue={setValue}
                        onChangeHandler={(value) =>
                          handlePartPaymentAmountFieldChange(
                            "partPaymentAmount",
                            value
                          )
                        }
                      />
                      {showMinimumText &&
                        paymentInfo?.length + 1 <
                          config?.allowedPartPayment && (
                          <p className="minimum-amount-text">
                            {config?.partPaymentMinimumAmountText}
                          </p>
                        )}
                      <div className={`pay-btn-container`}>
                        <button
                          className="pay-btn"
                          type="submit"
                          // onClick={(e) =>
                          //   ctaTracking(e, "ctaButtonClick", "Partial Payment")
                          // }
                        >
                          {config?.payBtnLabel}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="total-payable-info">
                    <p className="total-payable-text">
                      {config?.totalPayableText}
                    </p>
                    <p className="total-payable-amount">
                      {currencyUtils.getCurrencyFormatValue(
                        orderDetailsResult?.updated_order_grand_total,
                        0
                      )}
                    </p>
                  </div>
                  <div className="disclaimer-banner">
                    <p className="disclaimer-text">
                      {config?.partPaymentDisclaimerBannerText}
                      {" " + deliveryDate}
                    </p>
                  </div>
                  <div className="proceed-to-delivery-btn-container mobile-view">
                    <button
                      className="proceed-to-delivery-btn"
                      type="button"
                      disabled={isContinueToUploadBtnDisabled}
                    >
                      {config?.continueToUploadDocumentsText}
                    </button>
                    {paymentInfo?.length + 1 < config?.allowedPartPayment ? (
                      ""
                    ) : (
                      <button
                        className="back-btn"
                        onClick={handleGoBackPartPayment}
                        disabled={!eligibleCancelButton}
                      >
                        {config?.backBtnLabel}
                      </button>
                    )}
                  </div>
                </div>
                <div className="part-payment-right-container">
                  <div className="part-payment-pay-container desktop-view">
                    <p className="part-payment-pay-title">
                      {paymentInfo?.length === 0
                        ? `${config?.partPaymentText} ${
                            paymentInfo?.length > 0
                              ? paymentInfo?.length + 1
                              : 1
                          }`
                        : config?.balancePaymentHeader}
                    </p>
                    {paymentInfo?.length + 1 < config?.allowedPartPayment ? (
                      <div className="part-payment-pay-btn-container">
                        {randomAmounts?.map((item, index) => (
                          <button
                            className="price-btn"
                            type="button"
                            onClick={() => {
                              handleCustomPaymentAmount(parseFloat(item));
                            }}
                            key={index}
                          >
                            {currencyUtils.getCurrencyFormatValue(
                              parseFloat(item),
                              0
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                    <form
                      onSubmit={handleSubmit((formData) =>
                        handlePartPaymentAmountFormSubmit(formData)
                      )}
                      ref={amountInputRef}
                    >
                      <NumberField
                        name="partPaymentAmount"
                        label={config?.partPaymentAmountField?.label}
                        placeholder={
                          config?.partPaymentAmountField?.placeholder
                        }
                        validationRules={
                          config?.partPaymentAmountField?.validationRules
                        }
                        register={register}
                        errors={errors}
                        value={
                          finalAmountValue &&
                          paymentInfo?.length + 1 >= config?.allowedPartPayment
                            ? finalAmountValue
                            : priceInput
                            ? priceInput
                            : ""
                        }
                        setPriceInput={setPriceInput}
                        maxLength={
                          config?.partPaymentAmountField?.validationRules
                            ?.maxLength?.value
                        }
                        isDisabled={finalAmountValue ? true : false}
                        setValue={setValue}
                        onChangeHandler={(value) =>
                          handlePartPaymentAmountFieldChange(
                            "partPaymentAmount",
                            value
                          )
                        }
                      />
                      {showMinimumText &&
                        paymentInfo?.length + 1 <
                          config?.allowedPartPayment && (
                          <p className="minimum-amount-text">
                            {config?.partPaymentMinimumAmountText}
                          </p>
                        )}
                      <div className={`pay-btn-container`}>
                        <button
                          className="pay-btn"
                          type="submit"
                          // onClick={(e) =>
                          //   ctaTracking(e, "ctaButtonClick", "Partial Payment")
                          // }
                        >
                          {config?.payBtnLabel}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="proceed-to-delivery-btn-container desktop-view">
                    {paymentInfo?.length + 1 < config?.allowedPartPayment ? (
                      ""
                    ) : (
                      <button
                        className="back-btn"
                        onClick={handleGoBackPartPayment}
                        disabled={!eligibleCancelButton}
                      >
                        {config?.backBtnLabel}
                      </button>
                    )}
                    <button
                      className="proceed-to-delivery-btn"
                      type="button"
                      disabled={isContinueToUploadBtnDisabled}
                    >
                      {config?.continueToUploadDocumentsText}
                    </button>
                  </div>
                </div>
              </div>
            </Drawer>
          </div>
        )}

        {showCancelOrderPopup && (
          <div className="cancel-order-popup">
            <div className="cancel-order-popup-content">
              <p className="cancel-order-header">
                {config?.cancelOrderConfig.confirmLabel}
              </p>
              <button
                className="popup-close-btn"
                onClick={handleCloseCancelPopup}
              >
                <i className="icon-x"></i>
              </button>
              <p className="cancel-order-description">
                {config?.cancelOrderConfig.refundInfo}
              </p>
              <div className="cancel-order-form">
                <form
                  onSubmit={handleSubmit((formData, event) =>
                    handleCancelSubmit(formData, event)
                  )}
                >
                  <textarea
                    name="cancellationReason"
                    className="text-area-input"
                    placeholder={
                      config?.cancelOrderConfig.reasonField.placeholder
                    }
                    {...register("cancellationReason", { required: true })}
                    onChange={(e, cardData) =>
                      handlecancelOrderReason(e.target.value, cardData)
                    }
                  />
                  <button
                    className="cancel-order-submit-button"
                    disabled={isDisableButton}
                    type="submit"
                  >
                    {config?.cancelOrderConfig.cancelBtn.label}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer, purchaseConfigReducer }) => {
  return {
    userProfileInfo: {
      fname: userProfileDataReducer?.fname,
      lname: userProfileDataReducer?.lname
    },
    productData: purchaseConfigReducer.productData
  };
};

PartialPayment.propTypes = {
  config: PropTypes.shape({
    partPaymentBgDesktop: PropTypes.string,
    partPaymentBgMobile: PropTypes.string,
    paymentDetailsNormalTitle: PropTypes.string,
    paymentDetailsBoldTitle: PropTypes.string,
    bannerBgImg: PropTypes.string,
    onItsWayText: PropTypes.string,
    bannerBikeImg: PropTypes.string,
    deliveryTrackerContent: PropTypes.object,
    orderDetailsText: PropTypes.string,
    itemDetailsText: PropTypes.string,
    prebookingPriceText: PropTypes.string,
    gstAmountText: PropTypes.string,
    totalPayableText: PropTypes.string,
    chooseYourWayText: PropTypes.string,
    partPaymentText: PropTypes.string,
    makePartPaymentNormalTitle: PropTypes.string,
    makePartPaymentBoldTitle: PropTypes.string,
    partPaymentMinimumAmountText: PropTypes.string,
    payBtnLabel: PropTypes.string,
    backBtnLabel: PropTypes.string,
    partPaymentDisclaimerBannerText: PropTypes.string,
    continueToUploadDocumentsText: PropTypes.string,
    partPaymentAmountField: PropTypes.object,
    makePaymentFailErrorMsg: PropTypes.string,
    termsNavLink: PropTypes.string,
    termsNewTab: PropTypes.bool,
    partPaymentRandomAmounts: PropTypes.arrayOf(PropTypes.any),
    insuranceText: PropTypes.string,
    offersText: PropTypes.string,
    partPayHelperText: PropTypes.string,
    partPayTransactionHeader: PropTypes.string,
    partPayTransactionText: PropTypes.string,
    balancePaymentHeader: PropTypes.string,
    allowedPartPayment: PropTypes.number,
    paymentReceivedText: PropTypes.string,
    fameAmountText: PropTypes.string,
    bikeVariantDetails: PropTypes.object,
    makeRemainingPaymentBoldTitle: PropTypes.string,
    makeRemainingPaymentNormalTitle: PropTypes.string,
    cancelOrderConfig: PropTypes.object
  }),
  userProfileInfo: PropTypes.object,
  orderData: PropTypes.object,
  productData: PropTypes.object
};

export default connect(mapStateToProps)(PartialPayment);
