import React, { useState, useEffect } from "react";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";
import PaymentPending from "../PaymentPending/PaymentPending";
import PaymentFailure from "../PaymentFailure/PaymentFailure";
import { useUpdateBookingPaymentInfo } from "../../hooks/payment/paymentHooks";
import PropTypes from "prop-types";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import CONSTANT from "../../../site/scripts/constant";
import Logger from "../../../services/logger.service";

const BookingPaymentStatus = (props) => {
  const { config } = props;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const profileUrl = appUtils.getPageUrl("profileUrl");

  const [orderId, setOrderId] = useState(null);
  const [displayOrderId, setDisplayOrderId] = useState(null);
  const [modelSku, setModelSku] = useState(null);
  const [modelVariant, setModelVariant] = useState(null);
  const [status, setStatus] = useState(null);

  const [insuranceAvailability, setInsuranceAvailability] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [exchangeData, setExchangeData] = useState(false);
  const [outstandingAmount, setOutStandingAmount] = useState();
  const [isPartialPayMade, setPartialPayMade] = useState();

  const params = new URLSearchParams(window.location.search);
  const orderIdParam = params.has("orderId") ? params.get("orderId") : null;
  const paymentStatus = useUpdateBookingPaymentInfo(orderIdParam);

  useEffect(() => {
    const encryptedKey = params.has("encResp") && params.get("encResp");

    if (orderIdParam || encryptedKey) {
      const getPaymentStatus = async () => {
        let paymentResult = null;
        if (orderIdParam) {
          setSpinnerActionDispatcher(true);
          paymentResult = await paymentStatus({
            variables: {
              order_id: orderIdParam
            }
          });
        } else if (encryptedKey) {
          setSpinnerActionDispatcher(true);
          paymentResult = await paymentStatus({
            variables: {
              encrypted_response: encryptedKey
            }
          });
        } else {
          window.location.href = profileUrl;
        }

        if (
          paymentResult &&
          paymentResult.data &&
          paymentResult.data.updateSaleOrderPayment &&
          paymentResult.data.updateSaleOrderPayment.orderID
        ) {
          const { updateSaleOrderPayment } = paymentResult.data;

          setStatus(updateSaleOrderPayment.payment_status);
          setOrderId(updateSaleOrderPayment.orderID);
          setDisplayOrderId(updateSaleOrderPayment.order_id);
          setModelSku(updateSaleOrderPayment.modelSku);
          setModelVariant(updateSaleOrderPayment.modelVariant);
          //If famsubsidy is rejected and having outstanding amount then we are hide/show the NextSteps based on this flag
          setShowNextSteps(updateSaleOrderPayment.showNextSteps);
          setExchangeData(updateSaleOrderPayment.exchange_selected);
          setOutStandingAmount(
            updateSaleOrderPayment.updated_order_grand_total
          );
          setPartialPayMade(updateSaleOrderPayment.partial_payment_opt_in);

          if (
            updateSaleOrderPayment.insurance_id ||
            (updateSaleOrderPayment.insuranceDetail &&
              updateSaleOrderPayment.insuranceDetail.insuranceName)
          ) {
            setInsuranceAvailability(true);
          }

          if (isAnalyticsEnabled) {
            try {
              const location = {
                pinCode: updateSaleOrderPayment.pinCode,
                city: updateSaleOrderPayment.city,
                state: updateSaleOrderPayment.state,
                country: updateSaleOrderPayment.country
              };
              const productDetails = {
                modelVariant: updateSaleOrderPayment.modelVariant,
                modelColor: updateSaleOrderPayment.modelColor,
                productID: updateSaleOrderPayment.productID
              };
              const insuranceDetails = {
                companyName:
                  (updateSaleOrderPayment.insuranceDetail &&
                    updateSaleOrderPayment.insuranceDetail.insuranceName) ||
                  "",
                addOns:
                  (updateSaleOrderPayment.insuranceDetail &&
                    updateSaleOrderPayment.insuranceDetail.addons) ||
                  ""
              };
              const bookingDetails = {
                bookingID: updateSaleOrderPayment.order_id,
                bookingStatus:
                  updateSaleOrderPayment.payment_status.toLowerCase() ===
                  CONSTANT.PAYMENT_STATUS.SUCCESS
                    ? "Booking Completed"
                    : updateSaleOrderPayment.payment_status.toLowerCase() ===
                      CONSTANT.PAYMENT_STATUS.PAYMENT_PENDING
                    ? "Booking Pending"
                    : "Booking Failure",
                ownershipPlan:
                  updateSaleOrderPayment.ownershipPlan &&
                  updateSaleOrderPayment?.ownershipPlan?.split("-")[0]?.trim(),
                owenershipPlanType:
                  updateSaleOrderPayment.ownershipPlan &&
                  updateSaleOrderPayment?.ownershipPlan?.split("-")[1]?.trim(),
                aadharCardUsedStatus:
                  updateSaleOrderPayment.aadharCardUsedStatus ? "Yes" : "No",
                gstNumber:
                  updateSaleOrderPayment.gstNumber !== "" ? "Yes" : "No",
                exchangeTwoWheeler: updateSaleOrderPayment.exchange_amount
                  ? "Yes"
                  : "No"
              };
              const accessoriesList = [];
              const accessories =
                updateSaleOrderPayment.accessories &&
                updateSaleOrderPayment.accessories.length !== 0 &&
                updateSaleOrderPayment.accessories;
              accessories &&
                accessories.forEach((element) => {
                  if (element.itemType === "Accessory") {
                    accessoriesList.push(element.itemName);
                  }
                });
              const configuratorDetails = {
                accessorizeName:
                  accessoriesList && accessoriesList.length !== 0
                    ? accessoriesList.toString().split(",").join("|")
                    : ""
              };
              const order = {
                paymentType: updateSaleOrderPayment.paymentType || "",
                paymentMethod: updateSaleOrderPayment.paymentMethod,
                orderStatus: updateSaleOrderPayment.orderStatus,
                orderValue: updateSaleOrderPayment.orderValue
                  ? analyticsUtils.priceConversion(
                      updateSaleOrderPayment.orderValue
                    )
                  : 0,
                paymentOption: updateSaleOrderPayment.paymentOption,
                paymentMode: updateSaleOrderPayment.paymentMode || ""
              };
              // We are getting the pricebreakup in number format no need to convert these price amounts
              const priceBreakup = {
                configurationPrice:
                  updateSaleOrderPayment.configurationPrice || 0,
                owenershipPlanPrice:
                  updateSaleOrderPayment.owenershipPlanPrice || 0,
                insurancePrice: updateSaleOrderPayment.insurancePrice || 0,
                gstAmount: updateSaleOrderPayment.gstAmount || 0,
                fameIISubsidy: updateSaleOrderPayment.fameIISubsidy
                  ? analyticsUtils.priceConversion(
                      updateSaleOrderPayment.fameIISubsidy
                    )
                  : 0,
                empsIISubsidy: updateSaleOrderPayment.empsIISubsidy
                  ? analyticsUtils.priceConversion(
                      updateSaleOrderPayment.empsIISubsidy
                    )
                  : 0,
                otherCharges: updateSaleOrderPayment.otherCharges || 0,
                addOnsCharges: updateSaleOrderPayment.addonsCharges || 0,
                exchangeAmount: updateSaleOrderPayment.exchange_amount || 0
              };
              analyticsUtils.trackBookingComplete(
                location,
                productDetails,
                insuranceDetails,
                bookingDetails,
                order,
                priceBreakup,
                configuratorDetails
              );
            } catch (error) {
              Logger.error(error);
            }
          }
        } else {
          window.location.href = profileUrl;
        }
      };
      getPaymentStatus();
    } else {
      window.location.href = profileUrl;
    }
  }, []);

  return (
    status && (
      <div className="vida-container">
        {(status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS ||
          status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING) && (
          <PaymentSuccess
            config={
              showNextSteps
                ? config.paymentSuccess
                : config.outStandingPaymentSuccess
            }
            displayOrderId={displayOrderId}
            orderId={orderId}
            status={status}
            insuranceAvailability={insuranceAvailability}
            modelSku={modelSku}
            modelVariant={modelVariant}
            paymentView={
              showNextSteps
                ? CONSTANT.PURCHASE_VIEW.BOOKING
                : CONSTANT.PURCHASE_VIEW.OUTSTANDING
            }
            showNextSteps={showNextSteps}
            documentSection={config.documentSection}
            exchangeDataDetails={exchangeData}
            outstandingAmount={outstandingAmount}
            isPartialPayMade={isPartialPayMade}
          ></PaymentSuccess>
        )}
        {status.toLowerCase() === CONSTANT.PAYMENT_STATUS.PAYMENT_PENDING &&
          orderId &&
          displayOrderId && (
            <PaymentPending
              config={config.paymentPending}
              displayOrderId={displayOrderId}
              orderId={orderId}
              modelSku={modelSku}
              modelVariant={modelVariant}
              insuranceAvailability={insuranceAvailability}
              showNextSteps={showNextSteps}
              documentSection={config.documentSection}
              exchangeDataDetails={exchangeData}
              outstandingAmount={outstandingAmount}
              isPartialPayMade={isPartialPayMade}
            ></PaymentPending>
          )}
        {(status.toLowerCase() === CONSTANT.PAYMENT_STATUS.FAILURE ||
          status.toLowerCase() === CONSTANT.PAYMENT_STATUS.ABORTED) && (
          <PaymentFailure
            config={config.paymentFailure}
            modelSku={modelSku}
            modelVariant={modelVariant}
            paymentView={
              showNextSteps
                ? CONSTANT.PURCHASE_VIEW.BOOKING
                : CONSTANT.PURCHASE_VIEW.OUTSTANDING
            }
          ></PaymentFailure>
        )}
      </div>
    )
  );
};
BookingPaymentStatus.propTypes = {
  config: PropTypes.shape({
    paymentSuccess: PropTypes.object,
    paymentPending: PropTypes.object,
    paymentFailure: PropTypes.object,
    documentSection: PropTypes.object,
    outStandingPaymentSuccess: PropTypes.object
  })
};
export default BookingPaymentStatus;
