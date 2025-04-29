import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import CONSTANT from "../../../../site/scripts/constant";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";
import { useOrderInvoice } from "../../../hooks/userProfile/userProfileHooks";
import InvoiceDropdown from "./InvoiceDropdown/InvoiceDropdown";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const OrderCardDetails = (props) => {
  const {
    userOrderConfig,
    createOrderHandler,
    userEmail,
    uploadDocsHandler,
    trackDeliveryHandler,
    cardData,
    cardView,
    isPopUp,
    paymentHandler,
    loanLeaseOfferHandler,
    userPurchaseButtonShow,
    cancelLoanLeaseOfferHandler,
    partialPaymentHandler
  } = props;
  const { purchaseTracker, userOrder } = userOrderConfig;
  //Show message for Expected Delivery date
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isHeroEmployee, setIsHeroEmployee] = useState(false);
  const imgPath = appUtils.getConfig("imgPath");
  //needed for reference
  // const purchaseConfigUrl = appUtils.getPageUrl("purchaseConfigUrl");
  const purchaseConfigUrl = appUtils.getPageUrl("vidaPurchaseSummaryUrl");
  const aadharVerificationUrl = appUtils.getPageUrl("aadharVerificationUrl");
  const billingPricingNewUrl = appUtils.getPageUrl("billingPricingNewUrl");
  const elementRef = useRef();
  const elementCurrent = elementRef.current;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const cardDataOutStandingAmount = Number(cardData.outStandingAmount);
  const cardDataExchangeSelected =
    cardData.exchange_selected &&
    cardData.exchange_selected.toLowerCase() === "y";
  const cardDataExchangeCalculatePrice =
    cardData.exchange_calculate_price &&
    Number(cardData.exchange_calculate_price);

  const cardDataRemainingDownPayment = Number(cardData.remainingDownPayment);

  const orderInvoice = useOrderInvoice();
  const [isEligibleForCancel, setEligibleForCancel] = useState(
    cardData?.cancellationEligibilityFlag
  );
  const intervalRef = useRef(null);

  let cardDataLoanLeaseStatus = null,
    hidePurchaseButton = false,
    hideCancelButton = false;
  let cardDataLoanStatusChange = null;
  if (cardData.loanStatus || cardData.leaseStatus) {
    cardDataLoanLeaseStatus =
      (cardData.loanStatus.toLowerCase() === CONSTANT.LOANSTATUS.SANCTIONED &&
        CONSTANT.PAYMENT_METHOD.LOAN) ||
      (cardData.leaseStatus.toLowerCase() === CONSTANT.LEASESTATUS.COMPLETED &&
        CONSTANT.PAYMENT_METHOD.LEASE);
  }
  if (cardData.loanStatus) {
    cardDataLoanStatusChange =
      CONSTANT.PAYMENT_METHOD.LOAN &&
      (cardData.loanStatus.toLowerCase() ===
        CONSTANT.LOANSTATUS.APPLICATION_CREATED ||
        cardData.loanStatus.toLowerCase() === CONSTANT.LOANSTATUS.SANCTIONED ||
        cardData.loanStatus.toLowerCase() ===
          CONSTANT.LOANSTATUS.DOCUMENTS_APPROVAL_PENDING);
  }
  const allLoanStatus = [
    CONSTANT.LOANSTATUS.SANCTIONED,
    CONSTANT.LOANSTATUS.DOWNPAYMENT_MADE,
    CONSTANT.LOANSTATUS.INVOICE_GENERATED,
    CONSTANT.LOANSTATUS.DISBURSAL_REQUESTED,
    CONSTANT.LOANSTATUS.APPLICATION_DISBURSAL_PROCESSED
  ];
  const allLeaseStatus = [CONSTANT.LEASESTATUS.COMPLETED];
  if (cardData.loanStatus) {
    hidePurchaseButton = allLoanStatus.includes(
      cardData.loanStatus.toLowerCase()
    );
  } else if (cardData.leaseStatus) {
    hidePurchaseButton = allLeaseStatus.includes(
      cardData.leaseStatus.toLowerCase()
    );
    hideCancelButton = allLeaseStatus.includes(
      cardData.leaseStatus.toLowerCase()
    );
  }

  const compareTime = (apiDateTime) => {
    const hasReloaded = window.sessionStorage.getItem("pageReloaded");

    if (hasReloaded) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= apiDateTime) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          window.sessionStorage.removeItem("pageReloaded");
        }
        window.sessionStorage.setItem("pageReloaded", true);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!cardData.cancellationEligibilityFlag && cardData.status !== "Closed") {
      if (!cardData.cancellationEligibilityTime) {
        return;
      }

      const apiDateTime = new Date(
        cardData.cancellationEligibilityTime.replace(" ", "T")
      );
      compareTime(apiDateTime);

      // return () => {
      //   if (intervalRef.current) {
      //     clearInterval(intervalRef.current);
      //   }
      // };
    }
  }, [cardData.cancellationEligibilityFlag]);

  const formatTime = (timeLabel) => {
    const date = new Date(timeLabel);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    userEmail && userEmail.endsWith(userOrder.priorityEmailDomain)
      ? setIsHeroEmployee(true)
      : setIsHeroEmployee(false);
  }, [userEmail]);

  useEffect(() => {
    if (cardView === CONSTANT.ORDERS_VIEW.BOOKING && cardData.status) {
      //Triggers only for Booking flow and Delivery Track
      let cardDataStatus = cardData.status;
      if (
        cardData.cancellationReason &&
        cardData.cancellationReason !== "" &&
        cardDataStatus.toLowerCase() ===
          CONSTANT.PURCHASE_STATUS.CLOSED.toLowerCase()
      ) {
        cardDataStatus = CONSTANT.PURCHASE_STATUS.CANCELLED;
      }

      userOrder.orderStatusDetails.map((item) => {
        if (item.id === cardDataStatus) {
          //Set Status from AEM
          setStatus(item.status);
          if (
            cardDataStatus.toLowerCase() ===
            CONSTANT.PURCHASE_STATUS.DELIVERY.toLowerCase()
          ) {
            //Set Expected Delivery message from MAGENTO
            if (
              cardData.isFameSubsidyRejected &&
              cardDataOutStandingAmount > 0
            ) {
              setMessage(cardData.fameSubsidyRejectionReason || "---");
            } else {
              setMessage(cardData.scheduledDate || "---");
            }
          } else {
            //Set Expected Delivery message from AEM
            setMessage(item.message);
          }
        }
      });
    } else if (cardView === CONSTANT.ORDERS_VIEW.PREBOOKING) {
      //Triggers only for Prebooking
      setMessage(
        cardData.prebookingStatus === "Prebooking Confirmed"
          ? userOrder.delivery.info
          : "---"
      );
      setStatus(cardData.prebookingStatus);
    }
    if (hidePurchaseButton) {
      setStatus(userOrder.loanLeaseStatus);
    }
  }, []);

  useEffect(() => {
    if (
      cardView === CONSTANT.ORDERS_VIEW.BOOKING &&
      cardData.status &&
      cardData.status.toLowerCase() ===
        CONSTANT.PURCHASE_STATUS.DELIVERY.toLowerCase()
    ) {
      //Set Expected Delivery message from MAGENTO
      setMessage(cardData.scheduledDate || "---");
    }
  });

  const handlePayment = (bookingId, paymentType) => {
    paymentHandler && paymentHandler(bookingId, paymentType);
  };
  const handleUserManualNavigation = (url) => {
    window.location.href = url;
  };
  const handleLoanLeaseOffer = (bookingId, paymentType) => {
    loanLeaseOfferHandler && loanLeaseOfferHandler(bookingId, paymentType);
  };
  const handleCancelLoanLeaseOffer = (orderId, paymentType) => {
    cancelLoanLeaseOfferHandler &&
      cancelLoanLeaseOfferHandler(orderId, paymentType);
  };
  const handleUploadDocuments = (
    sfOrderInsuranceId,
    orderId,
    opportunityId
  ) => {
    uploadDocsHandler &&
      uploadDocsHandler(sfOrderInsuranceId, orderId, opportunityId);
  };

  const handleTrackDelivery = (event, orderId, cardData) => {
    trackDeliveryHandler && trackDeliveryHandler(event, orderId, cardData);
  };

  const handlePartialPayment = (orderId, opportunityId) => {
    partialPaymentHandler && partialPaymentHandler(orderId, opportunityId);
  };

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleDownloadInvoice = async (e, invoiceDocumentId, printName) => {
    try {
      setSpinnerActionDispatcher(true);
      const orderInvoiceData = await orderInvoice({
        variables: {
          document_id: invoiceDocumentId,
          printType: printName
        }
      });
      if (orderInvoiceData?.data?.GetInvoice?.pdf_data) {
        const linkSource = orderInvoiceData.data.GetInvoice.pdf_data;
        const downloadLink = document.createElement("a");
        const fileName = `${printName}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
    } catch (error) {
      Logger.error(error.message);
    }

    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Top",
        type: "Button",
        clickType: "download"
      };
      const productDetails = {
        modelVariant: cardData.vehicleName,
        modelColor: cardData.vehicleColor,
        productID: cardData.itemId
      };

      analyticsUtils.trackCtaClick(customLink);
      analyticsUtils.trackDownloadClick(productDetails, printName);
    }
  };

  const isPartialPayment = cardData.partial_payment_opt_in;

  return (
    <>
      <div className="vida-order-card-details">
        <div className="vida-card">
          <div className="vida-card__container">
            {cardData.eccentric_image_url ? (
              <div className="vida-card__image">
                <img
                  className="vida-card__product-image"
                  src={cardData.eccentric_image_url}
                  alt={cardData.productName}
                />
              </div>
            ) : (
              <div className="vida-card__image">
                <img
                  className="vida-card__product-image"
                  src={imgPath + cardData.productSku + ".png"}
                  alt={cardData.productName}
                />
              </div>
            )}
            <div className="vida-card__data">
              <div className="vida-card__product-data">
                <div className="vida-card__product-title">
                  {!isPopUp && <h3>{cardData.productName}</h3>}
                  <h4>
                    {userOrder.bookingIdLabel}: {cardData.bookingId}
                  </h4>
                </div>
                <div className="vida-card__product-schedule">
                  <p>{userOrder.totalLabel}</p>
                  <h3 className="total-price-head">
                    {cardView === CONSTANT.ORDERS_VIEW.PREBOOKING
                      ? currencyUtils.getCurrencyFormatValue(cardData.amount)
                      : currencyUtils.getCurrencyFormatValue(
                          cardData.orderTotal
                        )}
                  </h3>
                </div>
              </div>
              <div className="vida-card__booking-data">
                <div className="vida-card__booking-item">
                  <i className="icon-calendar"></i>
                  <label>{userOrder.dateLabel}</label>
                  <h4>{cardData.orderDate}</h4>
                </div>
                <div className="vida-card__booking-item">
                  <i className="icon-calendar"></i>
                  <label>{userOrder.delivery.label}</label>
                  <h4>{message}</h4>
                </div>
                <div className="vida-card__booking-item">
                  <i className="icon-status-online"></i>
                  <label>{userOrder.statusLabel}</label>
                  <h4>
                    {cardData.isFameSubsidyRejected &&
                    cardDataOutStandingAmount > 0
                      ? userOrder.fameSubsidyRejectedReason
                      : status}

                    {cardData.cancellationReason && (
                      <div className="txt-color--orange">
                        {cardData.cancellationReason}
                      </div>
                    )}

                    {cardData.isFameSubsidyRejected &&
                      cardDataOutStandingAmount > 0 && (
                        <div className="txt-color--orange">
                          {cardData.fameSubsidyRejectionReason}
                        </div>
                      )}
                  </h4>
                </div>
              </div>
              {cardDataExchangeSelected &&
                !cardData.exchange_approved &&
                cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT &&
                (cardData.isPreBookingCancelled === "" ||
                  (!hidePurchaseButton && cardDataRemainingDownPayment === 0) ||
                  cardDataOutStandingAmount === 0) &&
                userOrder.inventoryAvailable.value &&
                userPurchaseButtonShow && (
                  <div className="vida-card__data-info">
                    {userOrder.exchangeApprovedInfo}
                  </div>
                )}
              <div
                className={`vida-card__button-container ${
                  elementCurrent?.childNodes?.length > 3 && isDesktop
                    ? "button-container-wrap"
                    : ""
                }`}
                ref={elementRef}
              >
                {(cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT ||
                  cardData.isPreBookingCancelled === "") && (
                  <>
                    {/* {cardDataExchangeSelected &&
                      cardDataExchangeCalculatePrice > 0 &&
                      cardDataOutStandingAmount > 0 && (
                        <button
                          className="btn btn--primary"
                          onClick={() =>
                            handlePayment(
                              cardData.bookingId,
                              CONSTANT.PAYMENT_TYPE.EXCHANGE
                            )
                          }
                        >
                          {userOrder.paymentBtn.label}{" "}
                          {currencyUtils.getCurrencyFormatValue(
                            cardDataOutStandingAmount
                          )}
                        </button>
                      )} */}
                    {cardDataLoanLeaseStatus &&
                      cardDataRemainingDownPayment > 0 && (
                        <button
                          className="btn btn--primary"
                          onClick={() =>
                            handlePayment(
                              cardData.bookingId,
                              CONSTANT.PAYMENT_TYPE.DOWNPAYMENT
                            )
                          }
                        >
                          {userOrder.paymentBtn.label}{" "}
                          {currencyUtils.getCurrencyFormatValue(
                            cardDataRemainingDownPayment
                          )}
                        </button>
                      )}
                    {isPartialPayment && cardData.outStandingAmount > 0 && (
                      <button
                        className="btn btn--primary"
                        onClick={() =>
                          handlePartialPayment(
                            cardData.orderId,
                            cardData.opportunity_id
                          )
                        }
                      >
                        {userOrder.partialPaymentBtn.label}{" "}
                        {currencyUtils.getCurrencyFormatValue(
                          cardData.outStandingAmount || 0
                        )}
                      </button>
                    )}
                    {cardDataLoanStatusChange &&
                      cardData.selectedPayment.toLowerCase() ===
                        CONSTANT.PAYMENT_METHOD.LOAN && (
                        <button
                          className="btn btn--primary"
                          onClick={() =>
                            handleLoanLeaseOffer(
                              cardData.orderId,
                              cardData.selectedPayment
                            )
                          }
                        >
                          {cardData.selectedPayment.toLowerCase() ===
                          CONSTANT.PAYMENT_METHOD.LOAN
                            ? userOrder.statusBtn.loanLabel
                            : userOrder.statusBtn.leaseLabel}
                        </button>
                      )}
                    {cardDataLoanStatusChange &&
                      cardData.selectedPayment.toLowerCase() ===
                        CONSTANT.PAYMENT_METHOD.LOAN && (
                        <button
                          className="btn btn--secondary"
                          onClick={() =>
                            handleCancelLoanLeaseOffer(
                              cardData.orderId,
                              cardData.selectedPayment
                            )
                          }
                        >
                          {cardData.selectedPayment.toLowerCase() ===
                          CONSTANT.PAYMENT_METHOD.LOAN
                            ? userOrder.cancelLoanLeaseBtn.loanLabel
                            : userOrder.cancelLoanLeaseBtn.leaseLabel}
                        </button>
                      )}
                    {!cardDataLoanStatusChange &&
                      cardData.selectedPayment &&
                      cardDataRemainingDownPayment > 0 && (
                        <button
                          className="btn btn--secondary"
                          onClick={() =>
                            handleLoanLeaseOffer(
                              cardData.orderId,
                              cardData.selectedPayment
                            )
                          }
                        >
                          {cardData.selectedPayment.toLowerCase() ===
                          CONSTANT.PAYMENT_METHOD.LOAN
                            ? userOrder.viewLoanLabel
                            : userOrder.viewLeaseLabel}
                        </button>
                      )}
                    {(cardData.isPreBookingCancelled === "" ||
                      (!hidePurchaseButton &&
                        cardDataRemainingDownPayment === 0) ||
                      cardDataOutStandingAmount === 0) &&
                      userOrder.inventoryAvailable.value &&
                      userPurchaseButtonShow &&
                      !isPartialPayment && (
                        <button
                          className="btn btn--primary"
                          onClick={(e) =>
                            createOrderHandler(
                              e,
                              //userOrder.isAadharVerificationRequired
                              //  ? !cardData.aadhaar_verified
                              //    ? aadharVerificationUrl
                              //    : billingPricingNewUrl
                              // :
                              purchaseConfigUrl,
                              cardView,
                              cardData
                            )
                          }
                        >
                          {userOrder.purchaseBtn.label}
                        </button>
                      )}
                    {/* {isHeroEmployee ||
                    (cardDataLoanLeaseStatus && hideCancelButton) ||
                    cardData?.order_type?.toLowerCase() === "quick purchase" ? (
                      ""
                    ) : (
                      <a
                        className="btn btn--secondary"
                        onClick={() =>
                          props.cancelOrderHandler &&
                          props.cancelOrderHandler(cardData, cardView)
                        }
                      >
                        {userOrder.cancelBtn.label}
                      </a>
                    )} */}
                  </>
                )}

                {cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT &&
                  cardData.printName &&
                  userOrder.downloadSalesQuotationBtn.label && (
                    <button
                      className="btn btn--secondary"
                      onClick={(event) =>
                        handleDownloadInvoice(
                          event,
                          cardData.orderId,
                          cardData.printName
                        )
                      }
                    >
                      {userOrder.downloadSalesQuotationBtn.label}
                    </button>
                  )}
                {cardData.invoiceDocumentIds &&
                  cardData.invoiceDocumentIds.length > 0 && (
                    <>
                      <InvoiceDropdown
                        invoiceDocumentList={cardData.invoiceDocumentIds}
                        downloadInvoiceBtnLabel={
                          userOrder.downloadInvoiceBtn.label
                        }
                        downloadInvoice={handleDownloadInvoice}
                      />
                      <button
                        className="btn btn--primary"
                        onClick={() =>
                          handleUserManualNavigation(
                            purchaseTracker.userManualBtn.url
                          )
                        }
                      >
                        {purchaseTracker.userManualBtn.label}
                      </button>
                    </>
                  )}

                {((purchaseTracker &&
                  cardData.status === CONSTANT.PURCHASE_STATUS.FULFILMENT) ||
                  cardData.status === CONSTANT.PURCHASE_STATUS.BOOKED ||
                  cardData.status === CONSTANT.PURCHASE_STATUS.CV) &&
                  !parseInt(cardData.document_uploaded) && (
                    <>
                      <button
                        className="btn btn--primary"
                        onClick={() =>
                          handleUploadDocuments(
                            cardData.sfOrderInsuranceId,
                            cardData.orderId,
                            cardData.opportunity_id
                          )
                        }
                      >
                        {purchaseTracker.uploadBtn.label}
                      </button>
                    </>
                  )}

                {(cardData.status === CONSTANT.PURCHASE_STATUS.KYC_DONE ||
                  cardData.status === CONSTANT.PURCHASE_STATUS.DELIVERY) &&
                  cardDataOutStandingAmount === 0 &&
                  purchaseTracker && (
                    <button
                      className="btn btn--primary"
                      onClick={(event) =>
                        handleTrackDelivery(event, cardData.orderId, cardData)
                      }
                    >
                      {purchaseTracker.trackBtn.label}
                    </button>
                  )}

                {cardData.isFameSubsidyRejected &&
                  cardDataOutStandingAmount > 0 &&
                  cardData.status === CONSTANT.PURCHASE_STATUS.DELIVERY && (
                    <button
                      className="btn btn--primary"
                      onClick={() =>
                        handlePayment(
                          cardData.bookingId,
                          CONSTANT.PAYMENT_TYPE.FAMESUBSIDY
                        )
                      }
                    >
                      {userOrder.paymentBtn.label}{" "}
                      {currencyUtils.getCurrencyFormatValue(
                        cardDataOutStandingAmount
                      )}
                    </button>
                  )}

                {cardData.paymentInformation?.length > 0 &&
                  (cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT ||
                    cardData.status ===
                      CONSTANT.PURCHASE_STATUS.FULFILMENT) && (
                    <a
                      className={`cancel-button ${
                        isEligibleForCancel ? "" : "disable-button"
                      }`}
                      onClick={() =>
                        props.cancelOrderHandler &&
                        props.cancelOrderHandler(cardData, cardView)
                      }
                    >
                      {userOrder.cancelBtn.label}
                    </a>
                  )}
              </div>

              {(cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT ||
                cardData.isPreBookingCancelled === "") &&
                !userOrder.inventoryAvailable.value && (
                  <div className="vida-user-orders__warning">
                    <section className="notification notification--info">
                      <div className="notification__container">
                        <div className="notification__title">
                          <span className="notification__icon">
                            <i className="icon-information-circle"></i>
                          </span>
                          <label className="notification__label">
                            {userOrder.inventoryAvailable.message}
                          </label>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

              {cardData.paymentInformation?.length > 0 &&
                !isEligibleForCancel &&
                (cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT ||
                  cardData.status === CONSTANT.PURCHASE_STATUS.FULFILMENT) && (
                  <div className="cancel-info">
                    <div className="info-image-wrapper">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/red-info-icon.svg`}
                        alt="info-icon"
                      />
                    </div>
                    <p className="info-msg">
                      {userOrder.cancelInfoMsg}
                      <span>
                        {" " + formatTime(cardData.cancellationEligibilityTime)}
                      </span>
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

OrderCardDetails.propTypes = {
  userOrderConfig: PropTypes.object,
  cardData: PropTypes.object,
  cancelOrderHandler: PropTypes.func,
  createOrderHandler: PropTypes.func,
  uploadDocsHandler: PropTypes.func,
  trackDeliveryHandler: PropTypes.func,
  cardView: PropTypes.string,
  isPopUp: PropTypes.bool,
  userEmail: PropTypes.string,
  paymentHandler: PropTypes.func,
  loanLeaseOfferHandler: PropTypes.func,
  cancelLoanLeaseOfferHandler: PropTypes.func,
  userPurchaseButtonShow: PropTypes.bool,
  partialPaymentHandler: PropTypes.func
};

OrderCardDetails.defaultProps = {
  cardData: {}
};

export default OrderCardDetails;
