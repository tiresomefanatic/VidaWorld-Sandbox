import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import {
  useOptimizedGetOrderData,
  useUpdateOptimizedOrder,
  useUpdateAddressData
} from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { useBookingPartialPaymentInfo } from "../../../hooks/payment/paymentHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useForm } from "react-hook-form";
import NumberField from "../forms/NumberField/NumberField";
import DeliveryTracker from "../DeliveryTracker/DeliveryTracker";
import Drawer from "../Drawer/Drawer";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";
import CONSTANT from "../../../../site/scripts/constant";
import Cookies from "js-cookie";
import { useCancelOrder } from "../../../hooks/userProfile/userProfileHooks";
import { useLoanLeasePaymentInfo } from "../../../hooks/loanLeasePayment/loanLeasePaymentHooks";
import Banner from "../Purchase/Components/Banner";
import { FIELDNAMES } from "../Purchase/BillingShippingAddress/Constants";
import InputField from "../forms/InputField/InputField";
import Location from "../../../../site/scripts/location";
import { setAddressDataAction } from "../../../store/purchaseConfig/purchaseConfigActions";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const PaymentDetails = ({
  config,
  billingShippingConfig,
  orderData,
  orderDetails,
  ccPaymentUrl,
  userProfileInfo,
  optedBikeVariant,
  updateAddressData,
  serviceablePincodesList
}) => {
  const {
    shippingFormFields,
    billingFormFields,
    shippingSameAsBillingCheckboxLabel,
    billingSameAsShippingCheckboxLabel
  } = billingShippingConfig;
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  // use-state
  const [progessStatus, setProgressStatus] = useState("payment-in-progress");
  const [orderDetailsResult, setOrderDetailsResult] = useState("");
  const [orderPriceBreakup, setOrderPriceBreakup] = useState();
  const [showPaymentDetailsLandingPage, setShowPaymentDetailsLandingPage] =
    useState(true);
  const [showMakePaymentPopup, setShowMakePaymentPopup] = useState(true);
  const [showChoosePaymentPopup, setShowChoosePaymentPopup] = useState(false);
  const [showPartPaymentPopup, setShowPartPaymentPopup] = useState(false);
  const [isPaymentBtnDisabled, setIsPaymentBtnDisabled] = useState(true);
  const [isContinueToUploadBtnDisabled, setIsContinueToUploadBtnDisabled] =
    useState(true);
  const [offersPrice, setOffersPrice] = useState(0);
  const [showBillingAddressPopup, setShowBillingAddressPopup] = useState(false);
  const [showShippingAddressPopup, setShowShippingAddressPopup] =
    useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState();
  const [isSameAddress, setIsSameAddress] = useState();
  const [billingAddress, setBillingAddress] = useState(
    orderDetails.billingOrderAddress
  );
  const [shippingAddress, setShippingAddress] = useState(
    orderDetails.shippingOrderAddress
  );

  // hooks
  const opSalesOrderDetails = useOptimizedGetOrderData();
  const bookingPartialPaymentInfo = useBookingPartialPaymentInfo();
  const addAddressData = useUpdateAddressData();

  // getting id from props
  const orderId = orderData?.orderId;
  const opportunityId = orderData?.opportunityId;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const cancelUserOrder = useCancelOrder();
  const updateSaleOrder = useUpdateOptimizedOrder();
  const loanLeasePayment = useLoanLeasePaymentInfo();

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

  useEffect(() => {
    setBillingSameAsShipping(isSameAddress);
  }, [isSameAddress]);

  const ctaTracking = (e, eventName, linkPosition) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText?.split("\n")[0],
        ctaLocation: e.target.dataset.linkPosition || linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const ctaButtonTracking = (e, eventName, linkPosition) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: typeof e === "object" ? e.target.innerText : e,
        ctaLocation: linkPosition
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
        const shippingAddress =
          orderDetailsResult?.data?.OpGetSaleOrderDetails?.addresses?.filter(
            (item) =>
              item.address_type.toLowerCase() ===
              FIELDNAMES.shipping_address.toLowerCase()
          );
        setIsSameAddress(parseInt(shippingAddress[0].same_as_billing));
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

  const handleMakePayment = (e) => {
    if (e.target.checked) {
      setIsPaymentBtnDisabled(false);
    } else {
      setIsPaymentBtnDisabled(true);
    }
  };

  const handleShowChoosePayment = (e) => {
    setShowMakePaymentPopup(false);
    setShowPartPaymentPopup(false);
    setShowChoosePaymentPopup(true);
    if (isAnalyticsEnabled) {
      const location = {
        pinCode: orderDetailsResult?.addresses[0].pincode,
        city: orderDetailsResult?.addresses[0].city,
        state: orderDetailsResult?.addresses[0].state,
        country: "India"
      };
      const productDetails = {
        modelVariant: orderDetailsResult.product_data.name,
        modelColor: orderDetailsResult.product_data.color,
        productID: orderDetails.productId
      };
      analyticsUtils.trackBookingPaymentVida2(location, productDetails);
    }
  };

  const handleGoToPartPayment = async (e) => {
    if (!isDesktop) {
      setShowPaymentDetailsLandingPage(false);
    } else {
      setShowPaymentDetailsLandingPage(true);
    }
    const paymentType = CONSTANT.PAYMENT_METHOD.PARTIAL_PAYMENT;
    const address = {
      ...orderDetails.address,
      shipping_country: appUtils.getConfig("defaultCountry"),
      billing_country: appUtils.getConfig("defaultCountry")
    };
    orderDetails.address = address;
    orderDetails.selected_payment = paymentType;
    orderDetails.isPaymentUrlReceived = ccPaymentUrl ? true : false;
    setSpinnerActionDispatcher(true);
    const updateSaleOrderResult = await updateSaleOrder({
      variables: orderDetails
    });
    if (
      updateSaleOrderResult.data &&
      updateSaleOrderResult.data.opUpdateSaleOrder &&
      updateSaleOrderResult.data.opUpdateSaleOrder.status_code == "200"
    ) {
      const params = [
        "orderId=",
        orderId,
        "&opportunityId=",
        opportunityId
      ].join("");
      const encryptedParams = cryptoUtils.encrypt(params);
      ctaTracking(e, "ctaButtonClick", "Payment Details");
      setSpinnerActionDispatcher(false);
      window.location.href =
        appUtils.getPageUrl("partialPaymentUrl") + "?" + encryptedParams;
    }
  };

  const handleGoBackPartPayment = () => {
    setShowPartPaymentPopup(false);
    setShowPaymentDetailsLandingPage(true);
    setShowMakePaymentPopup(false);
    setShowChoosePaymentPopup(true);
  };

  const handlePartPaymentAmountFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const handleMakeFullPayment = async (e) => {
    if (ccPaymentUrl !== "") {
      ctaTracking(e, "ctaButtonClick", "Payment Details");
      const paymentType = CONSTANT.PAYMENT_METHOD.FULL_PAYMENT;
      const address = {
        ...orderDetails.address,
        shipping_country: appUtils.getConfig("defaultCountry"),
        billing_country: appUtils.getConfig("defaultCountry")
      };
      orderDetails.address = address;
      orderDetails.selected_payment = paymentType;
      orderDetails.isPaymentUrlReceived = ccPaymentUrl ? true : false;
      setSpinnerActionDispatcher(true);
      const updateSaleOrderResult = await updateSaleOrder({
        variables: orderDetails
      });
      if (
        updateSaleOrderResult.data &&
        updateSaleOrderResult.data.opUpdateSaleOrder &&
        updateSaleOrderResult.data.opUpdateSaleOrder.status_code == "200"
      ) {
        setSpinnerActionDispatcher(false);
        window.location.href = ccPaymentUrl;
      }
    } else {
      showNotificationDispatcher({
        title: config?.makePaymentFailErrorMsg,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
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
  };

  const handleConfirmCancel = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const cancelUserOrderData = await cancelUserOrder({
        variables: {
          sf_order_id: orderId,
          cancellationReason: "cancel booking"
        }
      });
      if (
        cancelUserOrderData &&
        cancelUserOrderData.data &&
        cancelUserOrderData.data.cancelSaleOrder
      ) {
        showNotificationDispatcher({
          title: cancelUserOrderData.data.cancelSaleOrder.message,
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
        window.location.href = profileUrl;
      } else {
        showNotificationDispatcher({
          title: cancelUserOrderData.data.cancelSaleOrder.message,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        setSpinnerActionDispatcher(false);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    if (orderId && opportunityId) {
      getSalesOrderDetails();
    } else {
      window.location.href = profileUrl;
    }
  }, [orderId]);

  const handleLoanApplication = async (e) => {
    ctaTracking(e, "ctaButtonClick", "Payment Details");
    const paymentType = CONSTANT.PAYMENT_METHOD.LOAN;
    orderDetails.paymentType = paymentType.toUpperCase();
    orderDetails.paymentMethod = paymentType;
    orderDetails.selected_payment = paymentType;
    const address = {
      ...orderDetails.address,
      shipping_country: appUtils.getConfig("defaultCountry"),
      billing_country: appUtils.getConfig("defaultCountry")
    };
    orderDetails.address = address;
    setSpinnerActionDispatcher(true);
    const updateSaleOrderResult = await updateSaleOrder({
      variables: orderDetails
    });

    if (
      updateSaleOrderResult.data &&
      updateSaleOrderResult.data.opUpdateSaleOrder &&
      updateSaleOrderResult.data.opUpdateSaleOrder.status_code == "200"
    ) {
      if (orderId) {
        setSpinnerActionDispatcher(true);
        const loanLeasePaymentResult = await loanLeasePayment({
          variables: {
            order_id: orderId,
            application_type: paymentType.toUpperCase()
          }
        });

        if (loanLeasePaymentResult) {
          const loanUrl =
            loanLeasePaymentResult.data.createLoanLeaseApplication
              .application_link;
          window.location.href = loanUrl;
        }
      }
    }
  };

  const inputValue = userProfileInfo?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  const updateSaleOrderHandler = async (billing_address, shipping_address) => {
    const address = {
      billing_address_landmark: billing_address.addressLandmark,
      billing_address_line1: billing_address.addressLine1,
      billing_address_line2: billing_address.addressLine2,
      billing_city: billing_address.city,
      billing_country: appUtils.getConfig("defaultCountry"),
      billing_pincode: billing_address.pincode,
      billing_state: billing_address.state,
      same_as_billing: billingSameAsShipping ? "1" : "0",
      shipping_address_landmark: shipping_address.addressLandmark,
      shipping_address_line1: shipping_address.addressLine1,
      shipping_address_line2: shipping_address.addressLine2,
      shipping_city: shipping_address.city,
      shipping_country: appUtils.getConfig("defaultCountry"),
      shipping_pincode: shipping_address.pincode,
      shipping_state: shipping_address.state
    };
    orderDetails.address = address;
    orderDetails.isPaymentUrlReceived = ccPaymentUrl ? true : false;
    setSpinnerActionDispatcher(true);
    const updateSaleOrderResult = await updateSaleOrder({
      variables: orderDetails
    });
    if (
      updateSaleOrderResult.data &&
      updateSaleOrderResult.data.opUpdateSaleOrder &&
      updateSaleOrderResult.data.opUpdateSaleOrder.status_code == "200"
    ) {
      getSalesOrderDetails();
    }
  };

  const getServiceablePincodeData = async () => {
    const locationObj = new Location();
    const selectedLocationData = {
      country: appUtils.getConfig("defaultCountry"),
      state: orderData?.address?.billing_state,
      city: orderData?.address?.billing_city
    };
    try {
      await locationObj.getServiceablePincodesList(selectedLocationData);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleEditAddress = (event, address) => {
    if (
      address.address_type.toLowerCase() ===
      FIELDNAMES.billing_address.toLowerCase()
    ) {
      if (address) {
        // billing fields prepopulation
        setValue(
          FIELDNAMES.billing_address_landmark,
          address?.address_landmark || ""
        );
        setValue(
          FIELDNAMES.billing_address_line1,
          address?.address_line1 || ""
        );
        setValue(
          FIELDNAMES.billing_address_line2,
          address?.address_line2 || ""
        );
        setValue(FIELDNAMES.billing_city, address?.city);
        setValue(FIELDNAMES.billing_state, address?.state);
        setValue(FIELDNAMES.billing_pincode, address?.pincode || "");

        setValue(
          FIELDNAMES.same_as_billing,
          address?.same_as_billing ? true : false
        );

        if (address?.billing_city && address?.billing_state) {
          getServiceablePincodeData();
        }
      }
      setShowBillingAddressPopup(true);
    } else {
      setShowShippingAddressPopup(true);
      if (address) {
        // shipping
        setValue(
          FIELDNAMES.shipping_address_landmark,
          address?.address_landmark || ""
        );
        setValue(
          FIELDNAMES.shipping_address_line1,
          address?.address_line1 || ""
        );
        setValue(
          FIELDNAMES.shipping_address_line2,
          address?.address_line2 || ""
        );
        setValue(FIELDNAMES.shipping_city, address?.city);
        setValue(FIELDNAMES.shipping_state, address?.state);
        setValue(FIELDNAMES.shipping_pincode, address?.pincode || "");
        setValue(
          FIELDNAMES.same_as_billing,
          address?.same_as_billing ? true : false
        );
      }
    }
  };

  const handlePincodeChange = (value, fieldname) => {
    if (fieldname) {
      if (
        value.length ===
        shippingFormFields.pincode.validationRules.maxLength.value
      ) {
        if (
          serviceablePincodesList &&
          serviceablePincodesList.serviceablePincodes &&
          serviceablePincodesList.serviceablePincodes.includes(
            parseInt(value.trim())
          )
        ) {
          clearErrors(fieldname);
        } else {
          setError(fieldname, {
            type: "custom",
            message:
              shippingFormFields?.pincode?.validationRules?.noCityMatchMsg
                .message
          });
        }
      } else if (
        value.length <
        shippingFormFields.pincode.validationRules.maxLength.value
      ) {
        setError(fieldname, {
          type: "custom",
          message: shippingFormFields?.pincode?.validationRules.required.message
        });
      } else if (value.length == 0) {
        setError(fieldname, {
          type: "custom",
          message: shippingFormFields?.pincode?.validationRules.required.message
        });
      } else {
        clearErrors(fieldname);
      }
    }
  };

  const handleInputChange = (fieldname, value) => {
    if (fieldname) {
      if (!CONSTANT.ADDRESS_REGEX.test(value)) {
        setError(fieldname, {
          type: "custom",
          message: shippingFormFields.addressLine1.specialCharacterErrorMsg
        });
      } else {
        clearErrors(fieldname);
      }
    } else {
      clearErrors(fieldname);
    }
  };

  const handleBillingSameAsShippingField = (event) => {
    setBillingSameAsShipping(event.target.checked);
  };

  const handleCancelBillingAddress = (e) => {
    ctaButtonTracking(e, "ctaButtonClick", "Billing Address Edit Screen");
    setBillingSameAsShipping(isSameAddress);
    setShowBillingAddressPopup(false);
  };

  const handleCancelShippingAddress = (e) => {
    ctaButtonTracking(e, "ctaButtonClick", "Shipping Address Edit Screen");
    setBillingSameAsShipping(isSameAddress);
    setShowShippingAddressPopup(false);
  };

  const handleConfirmBillingAddress = async (formData, event) => {
    let billingAddresses = {};
    let shippingAddresses = {};
    if (billingSameAsShipping) {
      billingAddresses = {
        addressLine1: formData[FIELDNAMES.billing_address_line1],
        addressLine2: formData[FIELDNAMES.billing_address_line2],
        addressLandmark: formData[FIELDNAMES.billing_address_landmark],
        pincode: formData[FIELDNAMES.billing_pincode],
        city: formData[FIELDNAMES.billing_city],
        state: formData[FIELDNAMES.billing_state],
        country: appUtils.getConfig("defaultCountry")
      };
      shippingAddresses = {
        ...billingAddresses,
        sameAsBilling: true
      };
    } else {
      billingAddresses = {
        addressLine1: formData[FIELDNAMES.billing_address_line1],
        addressLine2: formData[FIELDNAMES.billing_address_line2],
        addressLandmark: formData[FIELDNAMES.billing_address_landmark],
        pincode: formData[FIELDNAMES.billing_pincode],
        city: formData[FIELDNAMES.billing_city],
        state: formData[FIELDNAMES.billing_state],
        country: appUtils.getConfig("defaultCountry")
      };
      shippingAddresses = {
        addressLine1: orderDetails.address[FIELDNAMES.shipping_address_line1],
        addressLine2: orderDetails.address[FIELDNAMES.shipping_address_line2],
        addressLandmark:
          orderDetails.address[FIELDNAMES.shipping_address_landmark],
        pincode: orderDetails.address[FIELDNAMES.shipping_pincode],
        city: orderDetails.address[FIELDNAMES.shipping_city],
        state: orderDetails.address[FIELDNAMES.shipping_state],
        country: appUtils.getConfig("defaultCountry"),
        sameAsBilling: false
      };
    }
    setSpinnerActionDispatcher(true);
    updateAddressData({
      shippingAddresses,
      billingAddresses
    });

    setBillingAddress(billingAddresses);
    setShippingAddress(shippingAddresses);

    if (orderData.orderId) {
      const updateAddressRes = await addAddressData({
        variables: {
          sale_order_id: orderData?.orderId,
          billing_address_line1: billingAddresses?.addressLine1 || "",
          billing_address_line2: billingAddresses?.addressLine2 || "",
          billing_address_landmark: billingAddresses?.addressLandmark || "",
          billing_pincode: billingAddresses?.pincode || "",
          billing_city: billingAddresses?.city || "",
          billing_state: billingAddresses?.state || "",
          billing_country: appUtils.getConfig("defaultCountry"),
          shipping_address_line1: shippingAddresses?.addressLine1 || "",
          shipping_address_line2: shippingAddresses?.addressLine2 || "",
          shipping_address_landmark: shippingAddresses?.addressLandmark || "",
          shipping_pincode: shippingAddresses?.pincode || "",
          shipping_city: shippingAddresses?.city || "",
          shipping_state: shippingAddresses?.state || "",
          shipping_country: appUtils.getConfig("defaultCountry"),
          same_as_billing: shippingAddresses?.sameAsBilling ? "Y" : "N"
        }
      });

      if (updateAddressRes.data.UpdateSaleOrderAddress.status === "200") {
        ctaButtonTracking(
          config.confirmButtonText,
          "ctaButtonClick",
          "Billing Address Edit Screen"
        );
        setShowBillingAddressPopup(false);
        updateSaleOrderHandler(billingAddresses, shippingAddresses);
      }
    }
  };

  const handleConfirmShippingAddress = async (formData, event) => {
    let billingAddresses = {};
    let shippingAddresses = {};
    if (billingSameAsShipping) {
      shippingAddresses = {
        addressLine1: formData[FIELDNAMES.shipping_address_line1],
        addressLine2: formData[FIELDNAMES.shipping_address_line2],
        addressLandmark: formData[FIELDNAMES.shipping_address_landmark],
        pincode: formData[FIELDNAMES.shipping_pincode],
        city: formData[FIELDNAMES.shipping_city],
        state: formData[FIELDNAMES.shipping_state],
        country: appUtils.getConfig("defaultCountry"),
        sameAsBilling: true
      };
      billingAddresses = {
        ...shippingAddresses
      };
    } else {
      billingAddresses = {
        addressLine1: orderDetails.address[FIELDNAMES.billing_address_line1],
        addressLine2: orderDetails.address[FIELDNAMES.billing_address_line2],
        addressLandmark:
          orderDetails.address[FIELDNAMES.billing_address_landmark],
        pincode: orderDetails.address[FIELDNAMES.billing_pincode],
        city: orderDetails.address[FIELDNAMES.billing_city],
        state: orderDetails.address[FIELDNAMES.billing_state],
        country: appUtils.getConfig("defaultCountry")
      };
      shippingAddresses = {
        addressLine1: formData[FIELDNAMES.shipping_address_line1],
        addressLine2: formData[FIELDNAMES.shipping_address_line2],
        addressLandmark: formData[FIELDNAMES.shipping_address_landmark],
        pincode: formData[FIELDNAMES.shipping_pincode],
        city: formData[FIELDNAMES.shipping_city],
        state: formData[FIELDNAMES.shipping_state],
        country: appUtils.getConfig("defaultCountry"),
        sameAsBilling: false
      };
    }
    setSpinnerActionDispatcher(true);
    updateAddressData({
      shippingAddresses,
      billingAddresses
    });

    setBillingAddress(billingAddresses);
    setShippingAddress(shippingAddresses);

    if (orderData.orderId) {
      const updateAddressRes = await addAddressData({
        variables: {
          sale_order_id: orderData?.orderId,
          billing_address_line1: billingAddresses?.addressLine1 || "",
          billing_address_line2: billingAddresses?.addressLine2 || "",
          billing_address_landmark: billingAddresses?.addressLandmark || "",
          billing_pincode: billingAddresses?.pincode || "",
          billing_city: billingAddresses?.city || "",
          billing_state: billingAddresses?.state || "",
          billing_country: appUtils.getConfig("defaultCountry"),
          shipping_address_line1: shippingAddresses?.addressLine1 || "",
          shipping_address_line2: shippingAddresses?.addressLine2 || "",
          shipping_address_landmark: shippingAddresses?.addressLandmark || "",
          shipping_pincode: shippingAddresses?.pincode || "",
          shipping_city: shippingAddresses?.city || "",
          shipping_state: shippingAddresses?.state || "",
          shipping_country: appUtils.getConfig("defaultCountry"),
          same_as_billing: shippingAddresses?.sameAsBilling ? "Y" : "N"
        }
      });

      if (updateAddressRes.data.UpdateSaleOrderAddress.status === "200") {
        ctaButtonTracking(
          config.confirmButtonText,
          "ctaButtonClick",
          "Shipping Address Edit Screen"
        );
        setShowShippingAddressPopup(false);
        updateSaleOrderHandler(billingAddresses, shippingAddresses);
      }
    }
  };

  return (
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
              bannerBgImg={optedBikeVariant?.bgImg}
              bikeName={orderDetailsResult?.product_data?.name}
              onItsWayText={config?.onItsWayText}
              userName={userProfileInfo?.fname}
              bannerBikeImg={optedBikeVariant?.bikeImg}
              optedBikeVariant={optedBikeVariant}
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
                  <div className="address-header-block">
                    <p className="address-title-text">{item?.address_type}</p>
                    <div className="address-edit-icon">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/edit-black-icon.svg`}
                        alt="edit-icon"
                        onClick={(e) => handleEditAddress(e, item)}
                      />
                    </div>
                  </div>
                  <div className="address-info-container">
                    <p className="address-info">{`${item?.address_line1}, ${item?.address_line2}, ${item?.address_landmark}, ${item?.city}, ${item?.state}-${item?.pincode}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="payment-details-popup-container">
        {showMakePaymentPopup && (
          <Drawer>
            <div className="make-payment-popup-container">
              <div className="make-payment-popup-content-container">
                <div className="terms-and-conditions-container">
                  <input
                    className="terms-and-conditions-checkbox"
                    type="checkbox"
                    onChange={(e) => {
                      handleMakePayment(e);
                    }}
                  ></input>
                  <p className="terms-and-conditions-text">
                    {config?.agreeToText}{" "}
                    <span>
                      <a
                        className="bold-text"
                        href={config?.termsNavLink}
                        target={config?.termsNewTab ? "_blank" : "_self"}
                        rel="noreferrer"
                      >
                        {config?.termsAndConditionsText}
                      </a>
                    </span>
                  </p>
                </div>
                <div className="payment-info-container">
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
              </div>
              <div className="make-payment-popup-btn-container">
                <button
                  className="make-payment-btn"
                  type="button"
                  disabled={isPaymentBtnDisabled}
                  onClick={(e) => handleShowChoosePayment(e)}
                >
                  <p className="make-payment-btn-text">
                    {config?.makePaymentText}
                  </p>
                  <p className="make-payment-btn-description">
                    {config?.makePaymentDescriptionText}
                  </p>
                </button>
                {orderDetails?.order_type?.toLowerCase() !==
                  "quick purchase" && (
                  <button
                    className="cancel-order-btn"
                    type="button"
                    onClick={handleConfirmCancel}
                  >
                    {config?.cancelOrderText}
                  </button>
                )}
              </div>
            </div>
          </Drawer>
        )}
        {showChoosePaymentPopup && (
          <Drawer>
            <div className="choose-payment-popup-container">
              <div className="choose-payment-popup-title">
                <p className="choose-payment-popup-title-text">
                  {config?.chooseYourWayText}
                </p>
              </div>
              <div className="choose-payment-popup-btn-container">
                <button
                  className="full-payment-btn payment-btn"
                  type="button"
                  onClick={(e) => handleMakeFullPayment(e)}
                >
                  {config?.fullPaymentText}
                </button>
                <button
                  className="part-payment-btn payment-btn"
                  type="button"
                  onClick={(e) => handleGoToPartPayment(e)}
                >
                  {config?.partPaymentText}
                </button>
                {config?.loanCtaText && (
                  <button
                    className="loan-payment-btn payment-btn"
                    type="button"
                    onClick={(e) => handleLoanApplication(e)}
                  >
                    {config?.loanCtaText}
                  </button>
                )}
              </div>
            </div>
          </Drawer>
        )}
      </div>
      {showPartPaymentPopup && (
        <div className="part-payment-popup-container">
          <Drawer>
            <div className="part-payment-container">
              <div className="part-payment-left-container">
                <p className="part-payment-normal-title">
                  {config?.makePartPaymentNormalTitle}
                </p>
                <p className="part-payment-bold-title">
                  {config?.makePartPaymentBoldTitle}
                </p>
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
                      <p className="part-payment-card-payment">Card payement</p>
                    </div>
                  </div>
                )}
                {/* to be tested in dev env */}
                <div className="part-payment-pay-container mobile-view">
                  <p className="part-payment-pay-title">{`${config?.partPaymentText} 1`}</p>
                  <div className="part-payment-pay-btn-container">
                    {config?.partPaymentRandomAmounts?.map((item, index) => (
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
                  <form
                    onSubmit={handleSubmit((formData) =>
                      handlePartPaymentAmountFormSubmit(formData)
                    )}
                  >
                    <NumberField
                      name="partPaymentAmount"
                      label={config?.partPaymentAmountField?.label}
                      placeholder={config?.partPaymentAmountField?.placeholder}
                      validationRules={
                        config?.partPaymentAmountField?.validationRules
                      }
                      register={register}
                      errors={errors}
                      value={""}
                      maxLength={
                        config?.partPaymentAmountField?.validationRules
                          ?.maxLength?.value
                      }
                      isDisabled={false}
                      setValue={setValue}
                      onChangeHandler={(value) =>
                        handlePartPaymentAmountFieldChange(
                          "partPaymentAmount",
                          value
                        )
                      }
                    />
                    <p className="minimum-amount-text">
                      {config?.partPaymentMinimumAmountText}
                    </p>
                    <div className="pay-btn-container">
                      <button
                        className="back-btn"
                        onClick={handleGoBackPartPayment}
                      >
                        {config?.backBtnLabel}
                      </button>
                      <button className="pay-btn" type="submit">
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
                </div>
              </div>
              <div className="part-payment-right-container">
                <div className="part-payment-pay-container desktop-view">
                  <p className="part-payment-pay-title">{`${config?.partPaymentText} 1`}</p>
                  <div className="part-payment-pay-btn-container">
                    {config?.partPaymentRandomAmounts?.map((item, index) => (
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
                  <form
                    onSubmit={handleSubmit((formData) =>
                      handlePartPaymentAmountFormSubmit(formData)
                    )}
                  >
                    <NumberField
                      name="partPaymentAmount"
                      label={config?.partPaymentAmountField?.label}
                      placeholder={config?.partPaymentAmountField?.placeholder}
                      validationRules={
                        config?.partPaymentAmountField?.validationRules
                      }
                      register={register}
                      errors={errors}
                      value={""}
                      maxLength={
                        config?.partPaymentAmountField?.validationRules
                          ?.maxLength?.value
                      }
                      isDisabled={false}
                      setValue={setValue}
                      onChangeHandler={(value) =>
                        handlePartPaymentAmountFieldChange(
                          "partPaymentAmount",
                          value
                        )
                      }
                    />
                    <p className="minimum-amount-text">
                      {config?.partPaymentMinimumAmountText}
                    </p>
                    <div className="pay-btn-container">
                      <button
                        className="back-btn"
                        onClick={handleGoBackPartPayment}
                      >
                        {config?.backBtnLabel}
                      </button>
                      <button className="pay-btn" type="submit">
                        {config?.payBtnLabel}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="proceed-to-delivery-btn-container desktop-view">
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
      {showBillingAddressPopup && (
        <div className="edit-address-popup">
          <div className="edit-address-popup-content">
            <p className="edit-address-header">{FIELDNAMES.billing_address}</p>
            <div className="edit-address-form-container">
              <form
                id="billiing-address-form"
                className="billiing-address-form"
                // onSubmit={handleSubmit((formData) =>
                //   handleFormSubmit(formData)
                // )}
              >
                <InputField
                  name={FIELDNAMES.billing_address_line1}
                  label={billingFormFields?.addressLine1?.label}
                  placeholder={billingFormFields?.addressLine1?.placeholder}
                  register={register}
                  validationRules={
                    billingFormFields?.addressLine1?.validationRules
                  }
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.billing_address_line2}
                  label={billingFormFields?.addressLine2?.label}
                  placeholder={billingFormFields?.addressLine2?.placeholder}
                  validationRules={
                    billingFormFields?.addressLine2?.validationRules
                  }
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.billing_address_landmark}
                  label={billingFormFields?.landmark?.label}
                  placeholder={billingFormFields?.landmark?.placeholder}
                  validationRules={billingFormFields?.landmark?.validationRules}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                />

                <InputField
                  name={FIELDNAMES.billing_state}
                  label={billingFormFields?.state?.label}
                  placeholder={billingFormFields?.state?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  isDisabled={true}
                />
                <InputField
                  name={FIELDNAMES.billing_city}
                  label={billingFormFields?.city?.label}
                  placeholder={billingFormFields?.city?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  isDisabled={true}
                />

                <NumberField
                  name={FIELDNAMES.billing_pincode}
                  label={billingFormFields?.pincode?.label}
                  placeholder={billingFormFields?.pincode?.placeholder}
                  validationRules={billingFormFields?.pincode?.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={CONSTANT.RESTRICT_PINCODE}
                  value=""
                  setValue={setValue}
                  onChangeHandler={handlePincodeChange}
                  isDisabled={true}
                />
              </form>
            </div>
            <div className="divider"></div>
            <div className="edit-address-seperator">
              {/* <p className="edit-address-title">Billing Address</p> */}
              {/* <div className="billingSameAsShippingContainer">
                <label className="billingSameAsShippingContainer">
                  <input
                    type="checkbox"
                    id="billingSameAsShippingField"
                    onChange={handleBillingSameAsShippingField}
                    name="billingSameAsShippingField"
                    checked={billingSameAsShipping}
                    className="billingSameAsShippingFieldCheckbox"
                  />
                  {shippingSameAsBillingCheckboxLabel}
                </label>
              </div> */}
            </div>
            <div className="edit-address-form-actions">
              <button
                className="edit-address__cancel"
                onClick={(e) => handleCancelBillingAddress(e)}
              >
                {config.cancelButtonText}
              </button>
              <button
                className="edit-address__confirm"
                type="button"
                disabled={Object.keys(errors).length > 0}
                onClick={() => handleSubmit(handleConfirmBillingAddress)()}
              >
                {config.confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
      {showShippingAddressPopup && (
        <div className="edit-address-popup">
          <div className="edit-address-popup-content">
            <p className="edit-address-header">{FIELDNAMES.shipping_address}</p>
            <div className="edit-address-form-container">
              <form
                id="shipping-address-form"
                className="shipping-address-form"
                // onSubmit={handleSubmit((formData) =>
                //   handleFormSubmit(formData)
                // )}
              >
                <InputField
                  name={FIELDNAMES.shipping_address_line1}
                  label={shippingFormFields?.addressLine1?.label}
                  placeholder={shippingFormFields?.addressLine1?.placeholder}
                  register={register}
                  validationRules={
                    shippingFormFields?.addressLine1?.validationRules
                  }
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.shipping_address_line2}
                  label={shippingFormFields?.addressLine2?.label}
                  placeholder={shippingFormFields?.addressLine2?.placeholder}
                  validationRules={
                    shippingFormFields?.addressLine2?.validationRules
                  }
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.shipping_address_landmark}
                  label={shippingFormFields?.landmark?.label}
                  placeholder={shippingFormFields?.landmark?.placeholder}
                  validationRules={
                    shippingFormFields?.landmark?.validationRules
                  }
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                />

                <InputField
                  name={FIELDNAMES.shipping_state}
                  label={shippingFormFields?.state?.label}
                  placeholder={shippingFormFields?.state?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  isDisabled={true}
                />
                <InputField
                  name={FIELDNAMES.shipping_city}
                  label={shippingFormFields?.city?.label}
                  placeholder={shippingFormFields?.city?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  isDisabled={true}
                />

                <NumberField
                  name={FIELDNAMES.shipping_pincode}
                  label={shippingFormFields?.pincode?.label}
                  placeholder={shippingFormFields?.pincode?.placeholder}
                  validationRules={shippingFormFields?.pincode?.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={CONSTANT.RESTRICT_PINCODE}
                  value=""
                  setValue={setValue}
                  onChangeHandler={handlePincodeChange}
                  isDisabled={true}
                />
              </form>
            </div>
            <div className="divider"></div>
            <div className="edit-address-seperator">
              {/* <p className="edit-address-title">Billing Address</p> */}
              {/* <div className="billingSameAsShippingContainer">
                <label className="billingSameAsShippingContainer">
                  <input
                    type="checkbox"
                    id="billingSameAsShippingField"
                    onChange={handleBillingSameAsShippingField}
                    name="billingSameAsShippingField"
                    checked={billingSameAsShipping}
                    className="billingSameAsShippingFieldCheckbox"
                  />
                  {billingSameAsShippingCheckboxLabel}
                </label>
              </div> */}
            </div>
            <div className="edit-address-form-actions">
              <button
                className="edit-address__cancel"
                onClick={(e) => handleCancelShippingAddress(e)}
              >
                {config.cancelButtonText}
              </button>
              <button
                className="edit-address__confirm"
                type="button"
                disabled={Object.keys(errors).length > 0}
                onClick={() => handleSubmit(handleConfirmShippingAddress)()}
              >
                {config.confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({
  userProfileDataReducer,
  purchaseConfigReducer,
  testDriveReducer
}) => {
  return {
    userProfileInfo: {
      fname: userProfileDataReducer?.fname,
      lname: userProfileDataReducer?.lname
    },
    orderDetails: {
      order_id: purchaseConfigReducer?.order?.orderId,
      order_type: purchaseConfigReducer?.order?.orderType,
      subscription_plan_id: purchaseConfigReducer?.subscriptionPlan?.package_id,
      aadhar_selected: purchaseConfigReducer?.aadhar?.aadharSelected,
      aadhar_number: purchaseConfigReducer?.aadhar?.aadharNumber,
      aadhar_used_for_register:
        purchaseConfigReducer?.aadhar?.aadharUsedForRegister,
      gst_selected: purchaseConfigReducer?.gst?.gstSelected,
      gst_number: purchaseConfigReducer?.gst?.gstNumber,
      company_name: purchaseConfigReducer?.gst?.companyName,
      company_email: purchaseConfigReducer?.gst?.companyEmail,
      selected_payment: purchaseConfigReducer?.payment?.paymentMethod,
      payment_method: "online",
      insurer_id: purchaseConfigReducer?.insurance?.insurerId,
      insurance_addons: purchaseConfigReducer?.insurance?.insuranceAddons,
      cpa_opted: purchaseConfigReducer?.insurance?.cpaOpted,
      cpa_reason: purchaseConfigReducer?.insurance?.cpaNotOptedReason,
      paymentType: "ONLINE",
      buyBack: purchaseConfigReducer?.payment?.buybackOpted,
      exchange_selected: purchaseConfigReducer?.tradeIn?.tradeInSelected,
      customer_remarks: purchaseConfigReducer?.tradeIn?.remark,
      productId: purchaseConfigReducer?.productId,
      home_delivery_opt_in:
        purchaseConfigReducer?.homeDelivery?.homeDeliverySelected,
      isFirstEV: true,
      address: {
        billing_address_landmark:
          purchaseConfigReducer?.billingAddresses?.addressLandmark,
        billing_address_line1:
          purchaseConfigReducer?.billingAddresses?.addressLine1,
        billing_address_line2:
          purchaseConfigReducer?.billingAddresses?.addressLine2,
        billing_city: purchaseConfigReducer?.billingAddresses?.city,
        billing_pincode: purchaseConfigReducer?.billingAddresses?.pincode,
        billing_state: purchaseConfigReducer?.billingAddresses?.state,
        same_as_billing:
          purchaseConfigReducer?.shippingAddresses?.sameAsBilling,
        shipping_address_landmark:
          purchaseConfigReducer?.shippingAddresses?.addressLandmark,
        shipping_address_line1:
          purchaseConfigReducer?.shippingAddresses?.addressLine1,
        shipping_address_line2:
          purchaseConfigReducer?.shippingAddresses?.addressLine2,
        shipping_city: purchaseConfigReducer?.shippingAddresses?.city,
        shipping_pincode: purchaseConfigReducer?.shippingAddresses?.pincode,
        shipping_state: purchaseConfigReducer?.shippingAddresses?.state
      },
      shippingOrderAddress: purchaseConfigReducer.shippingAddresses,
      billingOrderAddress: purchaseConfigReducer.billingAddresses
    },
    serviceablePincodesList: testDriveReducer?.serviceablePincodesList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAddressData: (data) => {
      dispatch(setAddressDataAction(data));
    }
  };
};

PaymentDetails.propTypes = {
  config: PropTypes.shape({
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
    fameAmountText: PropTypes.string,
    totalPayableText: PropTypes.string,
    offersText: PropTypes.string,
    agreeToText: PropTypes.string,
    termsAndConditionsText: PropTypes.string,
    termsNavLink: PropTypes.string,
    termsNewTab: PropTypes.bool,
    makePaymentText: PropTypes.string,
    makePaymentDescriptionText: PropTypes.string,
    cancelOrderText: PropTypes.string,
    chooseYourWayText: PropTypes.string,
    fullPaymentText: PropTypes.string,
    partPaymentText: PropTypes.string,
    loanCtaText: PropTypes.string,
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
    confirmButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string
  }),
  billingShippingConfig: PropTypes.object,
  userProfileInfo: PropTypes.object,
  orderData: PropTypes.object,
  orderDetails: PropTypes.object,
  ccPaymentUrl: PropTypes.string,
  optedBikeVariant: PropTypes.object,
  updateAddressData: PropTypes.func,
  serviceablePincodesList: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetails);
