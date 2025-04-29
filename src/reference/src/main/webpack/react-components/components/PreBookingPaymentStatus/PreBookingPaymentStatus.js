import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PaymentFailure from "../PaymentFailure/PaymentFailure";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";
import PropTypes from "prop-types";
import { useUpdatePaymentInfo } from "../../hooks/payment/paymentHooks";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import CONSTANT from "../../../site/scripts/constant";
import Cookies from "js-cookie";
import { useGetMyScooterDetails } from "../../hooks/myScooter/myScooterHooks";
import Header from "../../../components/header/header";
import { setUserStatusAction } from "../../store/userAccess/userAccessActions";

const PreBookingPaymentStatus = (props) => {
  const { config, setUserStatus } = props;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const isSessionActive = loginUtils.getSessionToken();
  const redirectUrl = isSessionActive
    ? appUtils.getPageUrl("profileUrl")
    : appUtils.getPageUrl("loginUrl");

  const [orderId, setOrderId] = useState(null);
  const [modelSku, setModelSku] = useState(null);
  const [modelVariant, setModelVariant] = useState(null);
  const [status, setStatus] = useState(null);
  const [CCAvenueStatus, setCCAvenueStatus] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const paymentStatus = useUpdatePaymentInfo();
  const getMyScooter = useGetMyScooterDetails();

  useEffect(() => {
    const encryptedKey = params.has("encResp") && params.get("encResp");
    if (encryptedKey) {
      const getPaymentStatus = async () => {
        setSpinnerActionDispatcher(true);

        const paymentResult = await paymentStatus({
          variables: {
            encrypted_response: encryptedKey
          }
        });
        setSpinnerActionDispatcher(false);
        if (
          paymentResult &&
          paymentResult.data &&
          paymentResult.data.updatePayment &&
          paymentResult.data.updatePayment.increment_order_id
        ) {
          const { updatePayment } = paymentResult.data;
          const paymentStatus = updatePayment.payment_status;
          setStatus(paymentStatus);
          setOrderId(updatePayment.increment_order_id);
          setModelSku(updatePayment.modelSku);
          setModelVariant(updatePayment.modelVariant);
          updatePayment.ccavenue_status &&
            setCCAvenueStatus(updatePayment.ccavenue_status.toLowerCase());

          if (
            updatePayment.customerToken &&
            (paymentStatus.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS ||
              paymentStatus.toLowerCase() ===
                CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING)
          ) {
            loginUtils.setSessionToken(updatePayment.customerToken);
            const header = document.querySelector(".vida-header");
            header && Header.enableUserAccessLinks(header);
            // Push the user status "true" to the Reducer
            setUserStatus({
              isUserLoggedIn: true
            });
          }

          Cookies.set(
            CONSTANT.COOKIE_OPPORTUNITY_ID,
            updatePayment.opportunity_id,
            {
              expires: appUtils.getConfig("tokenExpirtyInDays"),
              secure: true,
              sameSite: "strict"
            }
          );

          if (isAnalyticsEnabled) {
            const location = {
              state: updatePayment.state,
              city: updatePayment.city,
              pinCode: updatePayment.pinCode,
              country: updatePayment.country
            };
            const productDetails = {
              modelVariant: updatePayment.modelVariant,
              modelColor: updatePayment.modelColor,
              productID: updatePayment.productID
            };
            const bookingDetails = {
              bookingID: updatePayment.increment_order_id,
              bookingStatus: "Pre-Booking Completed"
            };
            const order = {
              paymentType: updatePayment.paymentType,
              paymentMethod: "",
              orderStatus: updatePayment.orderStatus,
              orderID: updatePayment.orderID,
              orderValue: updatePayment.orderValue
                ? analyticsUtils.priceConversion(updatePayment.orderValue)
                : 0
            };
            const configuratorDetails = {
              accessorizeName: ""
            };

            if (isSessionActive) {
              setSpinnerActionDispatcher(true);
              const myScooterDetails = await getMyScooter();
              setSpinnerActionDispatcher(false);
              const myScooterAllRecords =
                myScooterDetails?.data?.getAllEccentricConfiguration[0]
                  ?.opportunity_lines?.records || [];

              if (myScooterAllRecords.length) {
                const accessoriesList = [];
                myScooterAllRecords.forEach((element) => {
                  if (element.item_type === "Accessory") {
                    accessoriesList.push(element.item_name);
                  }
                });
                configuratorDetails.accessorizeName = accessoriesList
                  .toString()
                  .split(",")
                  .join("|");
              }
            }
            analyticsUtils.trackPreBookingComplete(
              location,
              productDetails,
              bookingDetails,
              order,
              configuratorDetails
            );
          }
        } else {
          window.location.href = redirectUrl;
        }
      };
      getPaymentStatus();
    } else {
      window.location.href = redirectUrl;
    }
  }, []);
  return (
    status && (
      <div className="vida-container">
        {status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS ||
        status.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING ? (
          <PaymentSuccess
            config={config.paymentSuccess}
            orderId={orderId}
            status={status}
            modelVariant={modelVariant}
            modelSku={modelSku}
            paymentView={CONSTANT.PURCHASE_VIEW.PREBOOKING}
          ></PaymentSuccess>
        ) : (
          <PaymentFailure
            config={config.paymentFailure}
            modelSku={modelSku}
            CCAvenueStatus={CCAvenueStatus}
            paymentView={CONSTANT.PURCHASE_VIEW.PREBOOKING}
          ></PaymentFailure>
        )}
      </div>
    )
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserStatus: (status) => {
      dispatch(setUserStatusAction(status));
    }
  };
};

PreBookingPaymentStatus.propTypes = {
  config: PropTypes.object,
  setUserStatus: PropTypes.func
};

PreBookingPaymentStatus.defaultProps = {
  config: {}
};

export default connect(null, mapDispatchToProps)(PreBookingPaymentStatus);
