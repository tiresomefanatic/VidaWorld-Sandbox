import React, { useEffect, useState } from "react";
import { useUserOrders } from "../../hooks/userProfile/userProfileHooks";
import {
  useCreateOrder,
  useGetStockAvailability
} from "../../hooks/purchaseConfig/purchaseConfigHooks";
import OrderCardDetails from "./OrderCardDetails/OrderCardDetails";
import CancelOrder from "./CancelOrder/CancelOrder";
import CancelPrebookingOrder from "./CancelOrder/CancelPrebookingOrder";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Popup from "../Popup/Popup";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import CONSTANT from "../../../site/scripts/constant";
import breakpoints from "../../../site/scripts/media-breakpoints";
import PurchaseTracker from "../PurchaseTracker/PurchaseTracker";
import OrderSummary from "../OrderSummary/OrderSummary";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import OwnerDetails from "../OwnerDetails/OwnerDetails";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import Logger from "../../../services/logger.service";
import {
  cryptoUtils,
  RSAUtils
} from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { useBookingPaymentInfo } from "../../hooks/payment/paymentHooks";
import {
  useLoanLeasePaymentInfo,
  useCancelLoanLeasePaymentInfo
} from "../../hooks/loanLeasePayment/loanLeasePaymentHooks";
import { setResetSelectedPolicyDataDispatcher } from "../../store/purchaseConfig/purchaseConfigActions";
import {
  useGenerateOTP,
  useVerifyOTP
} from "../../hooks/userAccess/userAccessHooks";
import VerifyEmail from "../VerifyEmail/VerifyEmail";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useCancelPayment } from "../../hooks/quickPurchase/quickPurchaseHook";

const UserOrders = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const {
    userOrderConfig,
    cancelOrderConfig,
    cancelPrebookingOrderConfig,
    userPreBookingData,
    userPurchaseButtonShow,
    userPurchaseNoOrders,
    userOrderData,
    email_verified,
    fname,
    lname,
    code,
    number,
    email,
    isLogin,
    sfid
  } = props;

  const { userOrder } = userOrderConfig;
  const { noRecordFound, loadingOrdersTitle } = userOrder;
  const preBookingUrl = appUtils.getPageUrl("preBookingUrl");

  const [cancelOrderData, setCancelOrderData] = useState({});
  const [isCancelOrder, setIsCancelOrder] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const getUserOrders = useUserOrders();
  const getCreateOrder = useCreateOrder();
  const getStockAvailability = useGetStockAvailability();
  const useCancelOrder = useCancelPayment();

  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedCardItem, setSelectedCardItem] = useState({});
  const [bookingStatus, setBookingStatus] = useState("");

  const loanLeasePayment = useLoanLeasePaymentInfo();
  const cancelLoanLeasePayment = useCancelLoanLeasePaymentInfo();
  const [showLoanLeasePopup, setShowLoanLeasePopup] = useState(false);
  const [loanLeasePaymentUrl, setLoanLeasePaymentUrl] = useState();
  const [showCancelOrderPopup, setShowCancelOrderPopup] = useState(false);

  const [trackDeliveryOrderId, setTrackDeliveryOrderId] = useState(null);
  const [cancelDetails, setCancelDetails] = useState({});
  const [isDisableButton, setDiasbleButton] = useState(true);

  const profileUrl = appUtils.getPageUrl("profileUrl");
  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getUserOrders();
    setIsDesktop(
      window.matchMedia(breakpoints.mediaExpression.desktop).matches
    );
  }, []);

  let openPreOrder = [],
    closePreOrder = [];
  const [allOrders, setAllOrders] = useState([]);
  useEffect(() => {
    if (userPreBookingData && userPreBookingData.length > 0) {
      openPreOrder = userPreBookingData
        .map((mapItem) => {
          return { ...mapItem, sortingType: CONSTANT.ORDERS_VIEW.PREBOOKING };
        })
        .filter(
          (orderItem) =>
            orderItem.prebookingStatus === CONSTANT.PREBOOKING_STATUS.CONFIRMED
        );
      closePreOrder = userPreBookingData
        .map((mapItem) => {
          return { ...mapItem, sortingType: CONSTANT.ORDERS_VIEW.PREBOOKING };
        })
        .filter(
          (orderItem) =>
            orderItem.prebookingStatus === CONSTANT.PREBOOKING_STATUS.CANCELLED
        );
      setAllOrders([...openPreOrder, ...closePreOrder]);
    }
  }, [userPreBookingData]);

  useEffect(() => {
    if (userOrderData && userOrderData.length > 0) {
      const openUserOrder = userOrderData
        .map((mapItem) => {
          return { ...mapItem, sortingType: CONSTANT.ORDERS_VIEW.BOOKING };
        })
        .filter(
          (orderItem) => orderItem.status !== CONSTANT.PURCHASE_STATUS.CLOSED
        );
      const closeUserOrder = userOrderData
        .map((mapItem) => {
          return { ...mapItem, sortingType: CONSTANT.ORDERS_VIEW.BOOKING };
        })
        .filter(
          (orderItem) => orderItem.status === CONSTANT.PURCHASE_STATUS.CLOSED
        );
      setAllOrders([
        ...openUserOrder,
        ...closeUserOrder,
        ...openPreOrder,
        ...closePreOrder
      ]);
    }
  }, [userOrderData]);

  const reloadUserPreBooking = (status, message) => {
    // TODO: Need to update the proper success status code
    showNotificationDispatcher({
      title: message,
      type:
        status === "400"
          ? CONSTANT.NOTIFICATION_TYPES.ERROR
          : CONSTANT.NOTIFICATION_TYPES.SUCCESS,
      isVisible: true
    });

    if (status !== "400") {
      setSpinnerActionDispatcher(true);
      //getUserOrders();
      window.location.reload();
    }

    setIsCancelOrder(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleCancelOrder = async (cancelOrderData, status) => {
    document.querySelector("html").classList.add("overflow-hidden");
    setCancelOrderData(cancelOrderData);
    setIsCancelOrder(true);
    setBookingStatus(status);
    if (isAnalyticsEnabled) {
      // const customLink = {
      //   name: "Cancel Order",
      //   position: "Middle",
      //   type: "Button",
      //   clickType: "other"
      // };
      // analyticsUtils.trackCtaClick(customLink);
      const linkDetails = {
        ctaText: "Cancel Order",
        ctaLocation: "Order Card"
      };
      const productDetails = {
        modelVariant: cancelOrderData.vehicleName,
        modelColor: cancelOrderData.vehicleColor,
        productID: cancelOrderData.itemId
      };
      const eventName = "ctaButtonClick";
      analyticsUtils.trackCustomButtonClickV2(
        eventName,
        linkDetails,
        productDetails
      );
      // analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
    }
  };

  const handleCreateOrder = async (e, redirectionUrl, status, cardData) => {
    const bookingId = cardData.bookingId,
      opportunityID = cardData.opportunity_id;
    setResetSelectedPolicyDataDispatcher;
    setSpinnerActionDispatcher(true);
    const getStock = await getStockAvailability({
      variables: {
        order_id:
          status != CONSTANT.ORDERS_VIEW.PREBOOKING ? cardData.orderId : "",
        booking_id: status === CONSTANT.ORDERS_VIEW.PREBOOKING ? bookingId : ""
      }
    });

    if (getStock.data.GetStockAvailabilityCheck.code === "200") {
      if (status === CONSTANT.ORDERS_VIEW.PREBOOKING) {
        const createOrderRes = await getCreateOrder({
          variables: {
            order_increment_id: bookingId
          }
        });

        if (createOrderRes.data.CreateSaleOrder.status_code === "200") {
          const response = createOrderRes.data.CreateSaleOrder;
          if (response && response.order_id && response.opportunity_id) {
            const params = [
              "orderId=",
              response.order_id,
              "&opportunityId=",
              response.opportunity_id
            ].join("");
            const encryptedParams = cryptoUtils.encrypt(params);
            if (isAnalyticsEnabled) {
              const customLink = {
                name: e.target.innerText,
                position: "Middle",
                type: "Button",
                clickType: "other"
              };
              const location = {
                pinCode: "",
                city: "",
                state: "",
                country: ""
              };
              const productDetails = {
                modelVariant: cardData.productName,
                modelColor: "",
                productID: cardData.itemId
              };
              const additionalPageName = ":Pre-Booking My Orders";
              const additionalJourneyName = "";
              analyticsUtils.trackCustomButtonClick(
                customLink,
                location,
                productDetails,
                additionalPageName,
                additionalJourneyName,
                function () {
                  window.location.href = redirectionUrl + "?" + encryptedParams;
                }
              );
            } else {
              window.location.href = redirectionUrl + "?" + encryptedParams;
            }
          }
        }
      }
      if (status === CONSTANT.ORDERS_VIEW.BOOKING) {
        const params = [
          "orderId=",
          bookingId,
          "&opportunityId=",
          opportunityID
        ].join("");
        const encryptedParams = cryptoUtils.encrypt(params);
        if (isAnalyticsEnabled) {
          const customLink = {
            name: e.target.innerText,
            position: "Middle",
            type: "Button",
            clickType: "other"
          };
          const location = {
            pinCode: cardData.pincode,
            city: cardData.city,
            state: cardData.state,
            country: cardData.country
          };
          const productDetails = {
            modelVariant: cardData.vehicleName,
            modelColor: cardData.vehicleColor,
            productID: cardData.itemId
          };
          const additionalPageName = ":Booking My Orders";
          const additionalJourneyName = "";
          analyticsUtils.trackBookingVida2Start(productDetails);
          analyticsUtils.trackCustomButtonClick(
            customLink,
            location,
            productDetails,
            additionalPageName,
            additionalJourneyName,
            function () {
              window.location.href = redirectionUrl + "?" + encryptedParams;
            }
          );
        } else {
          window.location.href = redirectionUrl + "?" + encryptedParams;
        }
      }
    }
  };

  const handleUploadDocuments = (
    sfOrderInsuranceId,
    orderId,
    opportunityId
  ) => {
    let params;
    let insuranceAvailability = false;
    if (sfOrderInsuranceId && sfOrderInsuranceId.length > 0) {
      insuranceAvailability = true;
      params = `orderId=${orderId}&opportunityId=${opportunityId}&insuranceAvailability=${insuranceAvailability}`;
    } else {
      params = `orderId=${orderId}&opportunityId=${opportunityId}&insuranceAvailability=${insuranceAvailability}`;
    }
    const encryptedParams = cryptoUtils.encrypt(params);
    const redirectionUrl = insuranceAvailability
      ? `${appUtils.getPageUrl("nomineeDetailsUrl")}?${encryptedParams}`
      : `${appUtils.getPageUrl("uploadDocumentsUrl")}?${encryptedParams}`;
    if (redirectionUrl) {
      if (isAnalyticsEnabled) {
        const customLink = {
          name: "Upload Documents",
          position: "Order Card",
          type: "Button",
          clickType: "other"
        };
        const additionalPageName = ":Orders";
        const additionalJourneyName = "";
        const linkDetails = {
          ctaText: "Upload Documents",
          ctaLocation: "Order Card"
        };
        analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
        if (window.sessionStorage.getItem("pageReloaded")) {
          window.sessionStorage.removeItem("pageReloaded");
        }
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            window.location.href = redirectionUrl;
          }
        );
      } else {
        window.location.href = redirectionUrl;
      }
    }
  };

  /* Function starts for Veriy Email OTP */
  const [isVerifyEmailPopup, setShowtVerifyEmail] = useState(false);

  const generateVerifyEmailOTP = useGenerateOTP(false, true);
  const handleShowVerifyEmail = async (event) => {
    const variables = {
      country_code: code,
      mobile_number: RSAUtils.encrypt(number),
      email: RSAUtils.encrypt(email)
    };

    try {
      setSpinnerActionDispatcher(true);
      const loginResult = await generateVerifyEmailOTP({
        variables
      });

      if (loginResult) {
        try {
          if (loginResult.data.SendOtp.status_code === 200) {
            setShowtVerifyEmail(true);
            if (isAnalyticsEnabled) {
              const customLink = {
                name: event.target.innerText,
                position: "Top",
                type: "Link",
                clickType: "other"
              };
              analyticsUtils.trackCtaClick(customLink);
            }
          }
        } catch (error) {
          Logger.error(error);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const verifyOTP = useVerifyOTP(isLogin);
  const handleVerifyEmail = async (event, otp) => {
    const variables = {
      SF_ID: sfid,
      otp: RSAUtils.encrypt(otp),
      country_code: code ? code : "+91",
      fname,
      lname,
      mobile_number: RSAUtils.encrypt(number),
      email: RSAUtils.encrypt(email)
    };

    try {
      setSpinnerActionDispatcher(true);
      const otpResult = await verifyOTP({
        variables
      });

      if (otpResult && otpResult.data) {
        if (otpResult.data.VerifyOtp.status_code === 200) {
          showNotificationDispatcher({
            title: otpResult.data.VerifyOtp.message,
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
          setShowtVerifyEmail(false);

          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.target.innerText,
              position: "Middle",
              type: "Button",
              clickType: "other"
            };
            analyticsUtils.trackCtaClick(customLink);
          }

          const params = `orderId=${trackDeliveryOrderId}`;
          const encryptedParams = cryptoUtils.encrypt(params);
          const deliveryTrackerUrl = `${appUtils.getPageUrl(
            "deliveryTrackerUrl"
          )}?${encryptedParams}`;
          if (deliveryTrackerUrl) {
            window.location.href = deliveryTrackerUrl;
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  /* Function ends for Veriy Email OTP */

  const handleTrackDelivery = (event, orderId, cardData) => {
    setTrackDeliveryOrderId(orderId);
    if (email_verified) {
      const params = `orderId=${orderId}`;
      const encryptedParams = cryptoUtils.encrypt(params);
      const deliveryTrackerUrl = `${appUtils.getPageUrl(
        "deliveryTrackerUrl"
      )}?${encryptedParams}`;
      if (deliveryTrackerUrl) {
        if (isAnalyticsEnabled) {
          const customLink = {
            name: "Track Delivery",
            position: "Middle",
            type: "Button",
            clickType: "other"
          };
          const additionalPageName = ":Orders";
          const additionalJourneyName = "";
          const linkDetails = {
            ctaText: "Track Delivery",
            ctaLocation: "Order Card"
          };
          window.sessionStorage.setItem("Variant", cardData.vehicleName);
          window.sessionStorage.setItem("orderDate", cardData.orderDate);
          analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
          analyticsUtils.trackCtaClick(
            customLink,
            additionalPageName,
            additionalJourneyName,
            function () {
              window.location.href = deliveryTrackerUrl;
            }
          );
        } else {
          window.location.href = deliveryTrackerUrl;
        }
      }
    } else {
      handleShowVerifyEmail(event);
    }
  };

  const closeCancelOrder = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setIsCancelOrder(false);
  };
  const BackOrder = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setShowDetails(null);
  };

  const handleViewDetails = (e, cardItem) => {
    e.preventDefault();
    setShowDetails(cardItem.orderId);
    setSelectedCardItem(cardItem);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      const linkDetails = {
        ctaText: "View more Details",
        ctaLocation: "Order Card"
      };
      analyticsUtils.trackCtaClick(customLink);
      analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
    }
  };

  window.addEventListener("resize", function () {
    setIsDesktop(
      window.matchMedia(breakpoints.mediaExpression.desktop).matches
    );
  });

  const bookingPaymentInfo = useBookingPaymentInfo();
  const handlePayment = async (bookingId, paymentType) => {
    setSpinnerActionDispatcher(true);
    const paymentResult = await bookingPaymentInfo({
      variables: {
        order_id: bookingId,
        payment_mode: CONSTANT.PAYMENT_MODE.ONLINE,
        payment_type: paymentType
      }
    });
    if (
      paymentResult &&
      paymentResult.data &&
      paymentResult.data.CreateSaleOrderPayment &&
      paymentResult.data.CreateSaleOrderPayment.payment_url
    ) {
      if (isAnalyticsEnabled) {
        const customLink = {
          name: "Make Payment",
          position: "Middle",
          type: "Button",
          clickType: "other"
        };
        const additionalPageName = ":Orders";
        const additionalJourneyName = "";
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            window.location.href =
              paymentResult.data.CreateSaleOrderPayment.payment_url;
          }
        );
      } else {
        window.location.href =
          paymentResult.data.CreateSaleOrderPayment.payment_url;
      }
    }
  };

  const handleLoanLeaseOffer = async (orderId, paymentMethod) => {
    setSpinnerActionDispatcher(true);
    const loanLeasePaymentResult = await loanLeasePayment({
      variables: {
        order_id: orderId,
        application_type: paymentMethod.toUpperCase()
      }
    });
    if (loanLeasePaymentResult && loanLeasePaymentResult.data) {
      const url =
        loanLeasePaymentResult.data.createLoanLeaseApplication.application_link;

      if (url) {
        setShowLoanLeasePopup(true);
        setLoanLeasePaymentUrl(url);
        if (isAnalyticsEnabled) {
          const customLink = {
            name: paymentMethod,
            position: "Middle",
            type: "Button",
            clickType: "other"
          };
          const additionalPageName = ":Orders";
          const linkDetails = {
            ctaText: "Loan Status",
            ctaLocation: "Order Card"
          };
          analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
          analyticsUtils.trackCtaClick(customLink, additionalPageName);
        }
      }
    }
  };

  const handleCancelLoanLeaseOffer = async (orderId, paymentMethod) => {
    setCancelDetails({ orderId: orderId, paymentMethod: paymentMethod });
    setShowCancelOrderPopup(true);
    const customLink = {
      ctaText: "Cancel Loan",
      ctaLocation: "Order Card"
    };
    analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
  };
  console.log(
    "===appUtils.getPageUrl(partialPaymentUrl)",
    appUtils.getPageUrl("partialPaymentUrl")
  );
  const handlePartialPayment = async (orderId, opportunityId) => {
    const params = ["orderId=", orderId, "&opportunityId=", opportunityId].join(
      ""
    );
    const paymentInformation = userOrderData.filter(
      (item) => item.orderId === orderId
    );
    window.sessionStorage.setItem(
      "partPayDetails",
      JSON.stringify(paymentInformation[0].paymentInformation)
    );
    window.sessionStorage.setItem(
      "eligibleForCancellation",
      paymentInformation[0].cancellationEligibilityFlag
    );
    const encryptedParams = cryptoUtils.encrypt(params);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Partial Payment",
        position: "Order Card",
        type: "Button",
        clickType: "other"
      };
      const location = {
        state: "",
        city: "",
        pinCode: "",
        country: ""
      };
      const productDetails = {
        modelVariant: "",
        modelColor: "",
        productID: "",
        startingPrice: ""
      };
      const additionalPageName = ":Partial Payment";
      const additionalJourneyName = "Partial Payment";
      const linkDetails = {
        ctaText: "Partial Payment",
        ctaLocation: "order Card"
      };
      if (window.sessionStorage.getItem("pageReloaded")) {
        window.sessionStorage.removeItem("pageReloaded");
      }
      analyticsUtils.trackCTAClicksVida2(linkDetails, "ctaButtonClick");
      analyticsUtils.trackCustomButtonClick(
        customLink,
        location,
        productDetails,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href =
            appUtils.getPageUrl("partialPaymentUrl") + "?" + encryptedParams;
        }
      );
    } else {
      window.location.href =
        appUtils.getPageUrl("partialPaymentUrl") + "?" + encryptedParams;
    }
  };

  const ctaTracking = (e, eventName, linkPosition) => {
    const customLink = {
      ctaText: e,
      ctaLocation: linkPosition
    };
    analyticsUtils.trackCTAClicksVida2(customLink, eventName);
  };

  const handleCancelDetails = async () => {
    ctaTracking("Yes - Cancel Loan", "ctaButtonClick", "Cancel Loan Popup");
    setShowCancelOrderPopup(false);
    setSpinnerActionDispatcher(true);
    const cancelLoanLeasePaymentResult = await cancelLoanLeasePayment({
      variables: {
        order_id: cancelDetails.orderId,
        application_type: cancelDetails.paymentMethod.toUpperCase()
      }
    });
    if (
      cancelLoanLeasePaymentResult &&
      cancelLoanLeasePaymentResult.data &&
      cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication &&
      cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication.status ===
        "200"
    ) {
      showNotificationDispatcher(
        {
          title:
            cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication
              .response,
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        },
        () => (window.location.href = profileUrl)
      );
    } else if (
      cancelLoanLeasePaymentResult &&
      cancelLoanLeasePaymentResult.data &&
      cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication &&
      cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication.status ===
        "400"
    ) {
      showNotificationDispatcher({
        title:
          cancelLoanLeasePaymentResult.data.cancelLoanLeaseApplication.response
            .response || "An error has occured",
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
  };

  const handleBookNow = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = ":Orders";
      const additionalJourneyName = "";

      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = preBookingUrl;
        }
      );
    } else {
      window.location.href = preBookingUrl;
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const handlecancelOrderReason = (formData) => {
    if (formData.length > 1) {
      setDiasbleButton(false);
    } else {
      setDiasbleButton(true);
    }
  };

  const handleCancelSubmit = async (formData, event) => {
    const variables = {
      payment_id: cancelOrderData.paymentInformation.map(
        (payment) => payment.payId
      ),
      reason: getValues("cancellationReason")
    };
    setSpinnerActionDispatcher(true);
    const cancelOrder = await useCancelOrder({ variables });
    if (
      cancelOrder &&
      cancelOrder.data.cancelPartialPayment[0]?.status === "200"
    ) {
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
          pinCode: cancelOrderData.pincode,
          city: cancelOrderData.city,
          state: cancelOrderData.state,
          country: cancelOrderData.country
        };
        const productDetails = {
          modelVariant: cancelOrderData.vehicleName,
          modelColor: cancelOrderData.vehicleColor,
          productID: cancelOrderData.itemId
        };
        const insuranceDetails = {
          insurarName: "",
          addOns: ""
        };
        const bookingDetails = {
          bookingID: cancelOrderData.bookingId,
          bookingStatus: cancelOrderData.status,
          aadharCardUsedStatus: parseInt(cancelOrderData.aadhar_verified)
            ? "YES"
            : "NO",
          gstNumber: ""
        };
        const orderDetails = {
          paymentType: "",
          paymentMethod: "",
          orderStatus: cancelOrderData.status,
          orderValue: cancelOrderData.orderTotal,
          paymentOption: cancelOrderData.selectedPayment
        };
        const priceBreakup = {
          insurancePrice: cancelOrderData.insurance_base_price,
          gstAmount: cancelOrderData.gst,
          otherCharges: cancelOrderData.other_charges,
          addOnsCharges: cancelOrderData.addons_price,
          govtSubsidy: cancelOrderData.govt_subsidy_amount,
          offerPrice:
            cancelOrderData.discount_data.length > 1
              ? cancelOrderData.discount_data[0].net_benefit_tocustomer
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
      setIsCancelOrder(false);
      document.querySelector("html").classList.remove("overflow-hidden");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setSpinnerActionDispatcher(false);
      showNotificationDispatcher({
        title: cancelOrder.data.cancelPartialPayment[0]?.message,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
      setIsCancelOrder(false);
      document.querySelector("html").classList.remove("overflow-hidden");
    }
  };

  const handleCloseCancelPopup = () => {
    setIsCancelOrder(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };
  return (
    <>
      <div className="vida-user-orders">
        <div className="vida-user-orders__type">
          {(userPreBookingData && userPreBookingData.length > 0) ||
          (userOrderData && userOrderData.length > 0) ? (
            <h2 className="vida-user-orders__type-title">
              {userOrderConfig.userOrder.title}
            </h2>
          ) : userPurchaseNoOrders ? (
            <div className="vida-user-orders__no-record">
              <h3>{noRecordFound.title}</h3>
              {noRecordFound.description && (
                <h4>{noRecordFound.description}</h4>
              )}
              <button
                className="btn btn--primary btn--lg"
                onClick={(event) => handleBookNow(event)}
              >
                {noRecordFound.btnLabel}
              </button>
            </div>
          ) : (
            <div className="vida-user-orders__no-record">
              <h3>{loadingOrdersTitle}</h3>
            </div>
          )}

          {/* BOOKING */}
          {allOrders && allOrders.length > 0 && (
            <>
              {isDesktop ? (
                <>
                  {allOrders.map((cardItem, index) => (
                    <div className="vida-user-orders__my-order" key={index}>
                      <OrderCardDetails
                        userOrderConfig={userOrderConfig}
                        cardData={cardItem}
                        cardView={cardItem.sortingType}
                        cancelOrderHandler={handleCancelOrder}
                        createOrderHandler={handleCreateOrder}
                        paymentHandler={handlePayment}
                        uploadDocsHandler={handleUploadDocuments}
                        trackDeliveryHandler={handleTrackDelivery}
                        loanLeaseOfferHandler={handleLoanLeaseOffer}
                        userPurchaseButtonShow={userPurchaseButtonShow}
                        userEmail={email}
                        cancelLoanLeaseOfferHandler={handleCancelLoanLeaseOffer}
                        partialPaymentHandler={handlePartialPayment}
                      />
                      {cardItem.sortingType !==
                        CONSTANT.ORDERS_VIEW.PREBOOKING && (
                        <>
                          <div className="vida-user-orders__show-details">
                            {showDetails !== cardItem.orderId && (
                              <a
                                href=""
                                onClick={(e) => handleViewDetails(e, cardItem)}
                              >
                                {userOrderConfig.userOrder.viewDetailLabel}
                              </a>
                            )}
                          </div>
                          {showDetails === cardItem.orderId && (
                            <>
                              {!cardItem.cancellationReason && (
                                <PurchaseTracker
                                  userOrderConfig={userOrderConfig}
                                  createOrderHandler={handleCreateOrder}
                                  bookingStatus={CONSTANT.ORDERS_VIEW.BOOKING}
                                  cardData={cardItem}
                                  uploadDocsHandler={handleUploadDocuments}
                                  trackDeliveryHandler={handleTrackDelivery}
                                  paymentHandler={handlePayment}
                                  loanLeaseOfferHandler={handleLoanLeaseOffer}
                                  userPurchaseButtonShow={
                                    userPurchaseButtonShow
                                  }
                                  partialPaymentHandler={handlePartialPayment}
                                ></PurchaseTracker>
                              )}

                              <div className="vida-user-orders__user-order-summary">
                                <div className="vida-user-orders__payment-owner">
                                  <PaymentDetails
                                    paymentInfo={userOrderConfig.paymentInfo}
                                    paymentInfoData={
                                      cardItem.paymentInformation
                                    }
                                    orderStatus={cardItem.status}
                                  ></PaymentDetails>
                                  <OwnerDetails
                                    customerDetails={
                                      userOrderConfig.customerDetails
                                    }
                                    customerInfo={cardItem}
                                  ></OwnerDetails>
                                </div>
                                <div className="vida-user-orders__orders-details">
                                  <OrderSummary
                                    orderSummaryConfig={
                                      userOrderConfig.orderSummary
                                    }
                                    cardData={cardItem}
                                  ></OrderSummary>
                                </div>
                              </div>
                              <div className="vida-user-orders__show-details">
                                <a
                                  href=""
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowDetails(null);
                                  }}
                                >
                                  {
                                    userOrderConfig.userOrder
                                      .viewLessDetailLabel
                                  }
                                </a>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {allOrders.map((cardItem, index) => (
                    <div className="vida-user-orders__my-order" key={index}>
                      <OrderCardDetails
                        userOrderConfig={userOrderConfig}
                        cardData={cardItem}
                        cardView={cardItem.sortingType}
                        cancelOrderHandler={handleCancelOrder}
                        createOrderHandler={handleCreateOrder}
                        uploadDocsHandler={handleUploadDocuments}
                        trackDeliveryHandler={handleTrackDelivery}
                        paymentHandler={handlePayment}
                        loanLeaseOfferHandler={handleLoanLeaseOffer}
                        cancelLoanLeaseOfferHandler={handleCancelLoanLeaseOffer}
                        userEmail={email}
                        userPurchaseButtonShow={userPurchaseButtonShow}
                        partialPaymentHandler={handlePartialPayment}
                      />
                      {cardItem.sortingType !==
                        CONSTANT.ORDERS_VIEW.PREBOOKING && (
                        <>
                          <div className="vida-user-orders__show-details">
                            {showDetails !== cardItem.orderId && (
                              <a
                                href=""
                                onClick={(e) => handleViewDetails(e, cardItem)}
                              >
                                {userOrderConfig.userOrder.viewDetailLabel}
                              </a>
                            )}
                          </div>
                          {showDetails === cardItem.orderId && (
                            <Popup>
                              <div className="vida-user-orders__popup-handle">
                                <button
                                  className="vida-user-orders__back-btn"
                                  onClick={BackOrder}
                                >
                                  <i className="icon-chevron"></i>
                                </button>
                                <h3>{selectedCardItem.productName}</h3>
                              </div>
                              <OrderCardDetails
                                userOrderConfig={userOrderConfig}
                                cardData={selectedCardItem}
                                cardView={CONSTANT.ORDERS_VIEW.BOOKING}
                                cancelOrderHandler={handleCancelOrder}
                                createOrderHandler={handleCreateOrder}
                                isPopUp={true}
                                uploadDocsHandler={handleUploadDocuments}
                                trackDeliveryHandler={handleTrackDelivery}
                                paymentHandler={handlePayment}
                                loanLeaseOfferHandler={handleLoanLeaseOffer}
                                userEmail={email}
                                cancelLoanLeaseOfferHandler={
                                  handleCancelLoanLeaseOffer
                                }
                                userPurchaseButtonShow={userPurchaseButtonShow}
                                partialPaymentHandler={handlePartialPayment}
                              />

                              {!cardItem.cancellationReason && (
                                <PurchaseTracker
                                  userOrderConfig={userOrderConfig}
                                  createOrderHandler={handleCreateOrder}
                                  bookingStatus={CONSTANT.ORDERS_VIEW.BOOKING}
                                  cardData={cardItem}
                                  uploadDocsHandler={handleUploadDocuments}
                                  trackDeliveryHandler={handleTrackDelivery}
                                  paymentHandler={handlePayment}
                                  loanLeaseOfferHandler={handleLoanLeaseOffer}
                                  userPurchaseButtonShow={
                                    userPurchaseButtonShow
                                  }
                                  partialPaymentHandler={handlePartialPayment}
                                ></PurchaseTracker>
                              )}

                              <div className="vida-container">
                                <PaymentDetails
                                  paymentInfo={userOrderConfig.paymentInfo}
                                  paymentInfoData={
                                    selectedCardItem.paymentInformation
                                  }
                                ></PaymentDetails>
                                <OwnerDetails
                                  customerDetails={
                                    userOrderConfig.customerDetails
                                  }
                                  customerInfo={selectedCardItem}
                                ></OwnerDetails>
                                <OrderSummary
                                  orderSummaryConfig={
                                    userOrderConfig.orderSummary
                                  }
                                  cardData={selectedCardItem}
                                ></OrderSummary>
                                <br />
                              </div>
                            </Popup>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {isVerifyEmailPopup && email && (
          <div className="vida-profile-details__verify-email-popup">
            <Popup handlePopupClose={() => setShowtVerifyEmail(false)}>
              <VerifyEmail
                config={userOrderConfig.userOrder.emailOtpConfig}
                verifyEmailHandler={handleVerifyEmail}
                email={email}
              />
            </Popup>
          </div>
        )}
      </div>
      {isCancelOrder && bookingStatus === CONSTANT.ORDERS_VIEW.BOOKING && (
        // <Popup handlePopupClose={() => closeCancelOrder()}>
        //   <CancelOrder
        //     cancelOrderConfig={cancelOrderConfig}
        //     cardData={cancelOrderData}
        //     getAllOrders={reloadUserPreBooking}
        //     handleCancelOrderClose={() => closeCancelOrder()}
        //     bookingStatus={bookingStatus}
        //   />
        // </Popup>
        <div className="cancel-order-popup">
          <div className="cancel-order-popup-content">
            <p className="cancel-order-header">
              {cancelOrderConfig.confirmLabel}
            </p>
            <button
              className="popup-close-btn"
              onClick={handleCloseCancelPopup}
            >
              <i className="icon-x"></i>
            </button>
            <p className="cancel-order-description">
              {cancelOrderConfig.refundInfo}
            </p>
            <div className="cancel-order-form">
              <form
                onSubmit={handleSubmit((form, cardData) =>
                  handleCancelSubmit(form, cardData)
                )}
              >
                <textarea
                  name="cancellationReason"
                  className="text-area-input"
                  placeholder={cancelOrderConfig.reasonField.placeholder}
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
                  {cancelOrderConfig.cancelBtn.label}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {isCancelOrder && bookingStatus === CONSTANT.ORDERS_VIEW.PREBOOKING && (
        <Popup handlePopupClose={() => closeCancelOrder()}>
          <CancelPrebookingOrder
            cancelOrderConfig={cancelPrebookingOrderConfig}
            cardData={cancelOrderData}
            getAllOrders={reloadUserPreBooking}
            handleCancelOrderClose={() => closeCancelOrder()}
          />
        </Popup>
      )}

      {showLoanLeasePopup && (
        <div className="vida-order-card-details__payment-frame">
          <Popup
            mode="full-screen"
            handlePopupClose={() => setShowLoanLeasePopup(false)}
          >
            <div className="vida-payment__frame-container">
              <iframe src={loanLeasePaymentUrl}></iframe>
            </div>
          </Popup>
        </div>
      )}
      {showCancelOrderPopup && (
        <div className="vida-user-orders__cancel-loan">
          <Popup
            mode="small"
            handlePopupClose={() => {
              setShowCancelOrderPopup(false);
            }}
          >
            <div className="vida-user-orders__cancel-loan-popup">
              <h4>{userOrderConfig.cancelOrderPopup.title}</h4>
              <p>{userOrderConfig.cancelOrderPopup.description}</p>

              <div className="vida-user-orders__cancel-loan-btn-container">
                <button
                  className="btn btn--primary"
                  onClick={(event) => {
                    handleCancelDetails();
                  }}
                >
                  {userOrderConfig.cancelOrderPopup.yesBtnLabel}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={(event) => {
                    ctaTracking(
                      "No - Cancel Loan",
                      "ctaButtonClick",
                      "Cancel Loan Popup"
                    );
                    setShowCancelOrderPopup(false);
                  }}
                >
                  {userOrderConfig.cancelOrderPopup.noBtnLabel}
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({
  userOrderReducer,
  userProfileDataReducer,
  userAccessReducer
}) => {
  return {
    userPreBookingData: userOrderReducer.userPreBookingData,
    userOrderData: userOrderReducer.userOrderData,
    userPurchaseButtonShow: userOrderReducer.userPurchaseButtonShow,
    userPurchaseNoOrders: userOrderReducer.userPurchaseNoOrders,
    email_verified: userProfileDataReducer.email_verified,
    fname: userProfileDataReducer.fname,
    lname: userProfileDataReducer.lname,
    code: userProfileDataReducer.code,
    number: userProfileDataReducer.number,
    email: userProfileDataReducer.email,
    isLogin: userAccessReducer.isLogin,
    sfid: userAccessReducer.sfid
  };
};

UserOrders.propTypes = {
  userOrderConfig: PropTypes.object,
  cancelOrderConfig: PropTypes.object,
  cancelPrebookingOrderConfig: PropTypes.object,
  userPreBookingData: PropTypes.array,
  userOrderData: PropTypes.array,
  userPurchaseButtonShow: PropTypes.bool,
  userPurchaseNoOrders: PropTypes.bool,
  email_verified: PropTypes.bool,
  fname: PropTypes.string,
  lname: PropTypes.string,
  code: PropTypes.string,
  number: PropTypes.string,
  email: PropTypes.string,
  isLogin: PropTypes.bool,
  sfid: PropTypes.string
};

export default connect(mapStateToProps)(UserOrders);
