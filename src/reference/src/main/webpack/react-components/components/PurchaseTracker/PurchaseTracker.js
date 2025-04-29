import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import CONSTANT from "../../../site/scripts/constant";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";

const PurchaseTracker = (props) => {
  const [showTrackerDetails, setShowTrackerDetails] = useState(true);
  const {
    userOrderConfig,
    cardData,
    bookingStatus,
    createOrderHandler,
    uploadDocsHandler,
    trackDeliveryHandler,
    paymentHandler,
    loanLeaseOfferHandler,
    userPurchaseButtonShow,
    partialPaymentHandler
  } = props;

  const { purchaseTracker, userOrder } = userOrderConfig;
  const {
    title,
    orderStatusConfig,
    uploadBtn,
    trackBtn,
    fameSubsidyRejectedReason
  } = purchaseTracker;
  let currentStatus = CONSTANT.CURRENT_STATUS.PREBOOKED;

  const [orderStatusSteps, setOrderStatusSteps] = useState(orderStatusConfig);

  // const purchaseConfigUrl = appUtils.getPageUrl("purchaseConfigUrl");
  const purchaseConfigUrl = appUtils.getPageUrl("vidaPurchaseSummaryUrl");
  const aadharVerificationUrl = appUtils.getPageUrl("vidaPurchaseSummaryUrl"); //added for Click purchase in Purchase Tracker
  const billingPricingNewUrl = appUtils.getPageUrl("billingPricingNewUrl");

  const cardDataOutStandingAmount = Number(cardData.outStandingAmount);
  const cardDataExchangeSelected = cardData.exchange_selected;
  const cardDataExchangeCalculatePrice =
    cardData.exchange_calculate_price &&
    Number(cardData.exchange_calculate_price);

  const isPartialPayment = cardData.partial_payment_opt_in;

  const cardDataRemainingDownPayment = Number(cardData.remainingDownPayment);
  let cardDataLoanLeaseStatus = null,
    hidePurchaseButton = false;
  if (cardData.loanStatus || cardData.leaseStatus) {
    cardDataLoanLeaseStatus =
      (cardData.loanStatus.toLowerCase() === CONSTANT.LOANSTATUS.SANCTIONED &&
        CONSTANT.PAYMENT_METHOD.LOAN) ||
      (cardData.leaseStatus.toLowerCase() === CONSTANT.LOANSTATUS.SANCTIONED &&
        CONSTANT.PAYMENT_METHOD.LEASE);
  }

  const allLoanStatus = [
    CONSTANT.LOANSTATUS.SANCTIONED,
    CONSTANT.LOANSTATUS.DOWNPAYMENT_MADE,
    CONSTANT.LOANSTATUS.APPLICATION_CANCELLED,
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
  }

  if (cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT) {
    currentStatus = CONSTANT.CURRENT_STATUS.PURCHASE_PENDING;
  } else if (
    cardData.status === CONSTANT.PURCHASE_STATUS.BOOKED ||
    cardData.status === CONSTANT.PURCHASE_STATUS.CV ||
    cardData.status === CONSTANT.PURCHASE_STATUS.FULFILMENT
  ) {
    currentStatus = CONSTANT.CURRENT_STATUS.SCOOTER_PURCHASED;
  } else if (
    cardData.status === CONSTANT.PURCHASE_STATUS.INVOICING ||
    cardData.status === CONSTANT.PURCHASE_STATUS.KYC_DONE
  ) {
    currentStatus = CONSTANT.CURRENT_STATUS.SCOOTER_RESERVED;
  } else if (
    cardData.status === CONSTANT.PURCHASE_STATUS.CLOSED ||
    cardData.status === CONSTANT.PURCHASE_STATUS.DELIVERY
  ) {
    currentStatus = CONSTANT.CURRENT_STATUS.SCOOTER_DELIVEREY;
  } else {
    currentStatus = CONSTANT.CURRENT_STATUS.PREBOOKED;
  }

  const handleTrackerDetail = () => {
    setShowTrackerDetails(!showTrackerDetails);
  };

  const handlePayment = (bookingId, paymentType) => {
    paymentHandler && paymentHandler(bookingId, paymentType);
  };

  const handleLoanLeaseOffer = (bookingId, paymentType) => {
    loanLeaseOfferHandler && loanLeaseOfferHandler(bookingId, paymentType);
  };

  const handlePartialPayment = (orderId, opportunityId) => {
    partialPaymentHandler && partialPaymentHandler(orderId, opportunityId);
  };

  useEffect(() => {
    if (parseFloat(cardData.reservePrice) <= 0) {
      const updatedOrderStatusSteps = [...orderStatusConfig];
      updatedOrderStatusSteps.shift();
      setOrderStatusSteps(updatedOrderStatusSteps);
    }
  }, [cardData.reservePrice]);

  return (
    <div className="vida-purchase-tracker">
      <div className="vida-purchase-tracker__title">
        <h1 className="vida-purchase-tracker__head">{title}</h1>
        <i
          className={showTrackerDetails ? "icon-minus" : "icon-plus"}
          onClick={handleTrackerDetail}
        />
      </div>
      {showTrackerDetails && (
        <nav className="vida-purchase-tracker__stepper">
          {orderStatusSteps.map((e) => {
            return (
              <ul key={e.id} className="vida-purchase-tracker__wrapper">
                <li>
                  <div className="vida-purchase-tracker__steps">
                    <div className="vida-purchase-tracker__iconDiv">
                      {e.id < currentStatus && (
                        <i className="icon-check-circle"></i>
                      )}
                      {e.id === currentStatus && (
                        <>
                          {currentStatus ===
                            CONSTANT.CURRENT_STATUS.PURCHASE_PENDING && (
                            <i className="icon-wallet vida-purchase-tracker__status-icons"></i>
                          )}
                          {currentStatus ===
                            CONSTANT.CURRENT_STATUS.SCOOTER_PURCHASED && (
                            <i className="icon-document-add vida-purchase-tracker__status-icons"></i>
                          )}
                          {currentStatus ===
                            CONSTANT.CURRENT_STATUS.SCOOTER_RESERVED && (
                            <i className="icon-document-add vida-purchase-tracker__status-icons"></i>
                          )}
                          {currentStatus ===
                            CONSTANT.CURRENT_STATUS.SCOOTER_DELIVEREY && (
                            <i className="icon-scooter vida-purchase-tracker__status-icons"></i>
                          )}
                        </>
                      )}
                      {e.id > currentStatus && (
                        <span className="vida-purchase-tracker__stepper-next"></span>
                      )}
                    </div>
                    <div
                      className={
                        e.id === currentStatus
                          ? "vida-purchase-tracker__info-active"
                          : "vida-purchase-tracker__info"
                      }
                    >
                      <h3>
                        {cardData.isFameSubsidyRejected
                          ? fameSubsidyRejectedReason
                          : e.label}
                      </h3>
                      {cardData.status === CONSTANT.PURCHASE_STATUS.DRAFT &&
                      e.id === currentStatus ? (
                        <>
                          {/* {cardDataExchangeSelected &&
                            cardDataExchangeCalculatePrice > 0 &&
                            cardDataOutStandingAmount > 0 && (
                              <button
                                className="btn btn--secondary"
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

                          {isPartialPayment && cardData.outStandingAmount > 0 && (
                            <button
                              className="btn btn--primary btn--partial-payment"
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

                          {cardDataLoanLeaseStatus &&
                            cardDataRemainingDownPayment > 0 && (
                              <button
                                className="btn btn--secondary"
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

                          {cardData.selectedPayment &&
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

                          {((!isPartialPayment &&
                            !hidePurchaseButton &&
                            cardDataRemainingDownPayment === 0) ||
                            cardDataOutStandingAmount <= 0) &&
                            userOrder.inventoryAvailable.value &&
                            userPurchaseButtonShow && (
                              <button
                                className="btn btn--secondary"
                                onClick={(e) =>
                                  createOrderHandler(
                                    e,
                                    userOrder.isAadharVerificationRequired
                                      ? !cardData.aadhaar_verified
                                        ? aadharVerificationUrl
                                        : billingPricingNewUrl
                                      : purchaseConfigUrl,
                                    bookingStatus,
                                    cardData
                                  )
                                }
                              >
                                {userOrder.purchaseBtn.label}
                              </button>
                            )}
                        </>
                      ) : (
                        <>
                          {e.id === 0 && (
                            <p className="vida-purchase-tracker__status-message">{`on ${
                              cardData.reserveDate
                            } for ${currencyUtils.getCurrencyFormatValue(
                              cardData.reservePrice
                            )}`}</p>
                          )}
                          {e.id === 1 && (
                            <p className="vida-purchase-tracker__status-message">{`on ${
                              cardData.orderDate
                            } for ${currencyUtils.getCurrencyFormatValue(
                              cardData.orderTotal
                            )}`}</p>
                          )}

                          {e.id === 3 &&
                            cardData.status ===
                              CONSTANT.PURCHASE_STATUS.DELIVERY && (
                              <p className="vida-purchase-tracker__status-message">{`on ${cardData.orderDate}`}</p>
                            )}

                          {e.id === 4 &&
                            (cardData.status ===
                              CONSTANT.PURCHASE_STATUS.KYC_DONE ||
                              cardData.status ===
                                CONSTANT.PURCHASE_STATUS.INVOICING) && (
                              <p className="vida-purchase-tracker__status-message">
                                {userOrder.preDeliveryMessage}
                              </p>
                            )}
                          {e.id === 4 &&
                            cardDataOutStandingAmount <= 0 &&
                            cardData.status ===
                              CONSTANT.PURCHASE_STATUS.DELIVERY && (
                              <p className="vida-purchase-tracker__status-message">
                                {userOrder.postDeliveryMessage}
                              </p>
                            )}
                        </>
                      )}
                    </div>
                    {e.id === currentStatus && (
                      <div className="vida-purchase-tracker__status-action">
                        {(cardData.status === CONSTANT.PURCHASE_STATUS.BOOKED ||
                          cardData.status === CONSTANT.PURCHASE_STATUS.CV ||
                          cardData.status ===
                            CONSTANT.PURCHASE_STATUS.FULFILMENT) && (
                          <button
                            className="btn btn--secondary"
                            onClick={() =>
                              uploadDocsHandler(
                                cardData.sfOrderInsuranceId,
                                cardData.orderId,
                                cardData.opportunity_id
                              )
                            }
                            type="button"
                          >
                            {uploadBtn.label}
                          </button>
                        )}

                        {cardData.status ===
                          CONSTANT.PURCHASE_STATUS.KYC_DONE && (
                          <button
                            className="btn btn--secondary"
                            onClick={(event) =>
                              trackDeliveryHandler(event, cardData.orderId)
                            }
                          >
                            {trackBtn.label}
                          </button>
                        )}

                        {cardData.isFameSubsidyRejected &&
                        cardDataOutStandingAmount > 0
                          ? cardData.status ===
                              CONSTANT.PURCHASE_STATUS.DELIVERY && (
                              <button
                                className="btn btn--secondary"
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
                            )
                          : cardData.status ===
                              CONSTANT.PURCHASE_STATUS.DELIVERY && (
                              <button
                                className="btn btn--secondary"
                                onClick={(event) =>
                                  trackDeliveryHandler(event, cardData.orderId)
                                }
                              >
                                {trackBtn.label}
                              </button>
                            )}
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            );
          })}
        </nav>
      )}
    </div>
  );
};

PurchaseTracker.propTypes = {
  userOrderConfig: PropTypes.object,
  cardData: PropTypes.object,
  createOrderHandler: PropTypes.func,
  trackDeliveryHandler: PropTypes.func,
  uploadDocsHandler: PropTypes.func,
  bookingStatus: PropTypes.string,
  paymentHandler: PropTypes.func,
  loanLeaseOfferHandler: PropTypes.func,
  userPurchaseButtonShow: PropTypes.bool,
  partialPaymentHandler: PropTypes.func
};
PurchaseTracker.defaultProps = {
  userOrderConfig: {}
};
export default PurchaseTracker;
