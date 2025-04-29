import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PaymentStatus from "../PaymentStatus/PaymentStatus";
import PropTypes from "prop-types";
import { useUpdatePaymentInfo } from "../../../hooks/payment/paymentHooks";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import CONSTANT from "../../../../site/scripts/constant";
import Cookies from "js-cookie";
import { useGetMyScooterDetails } from "../../../hooks/myScooter/myScooterHooks";
import { setUserStatusAction } from "../../../store/userAccess/userAccessActions";

const PreBookingPaymentStatus = (props) => {
  const { config, setUserStatus } = props;
  const isSessionActive = loginUtils.getSessionToken();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [pStatus, setPStatus] = useState(null);
  const [modelVariant, setModelVariant] = useState(null);
  // const [orderId, setOrderId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [modelColor, setModalColor] = useState(null);
  // const [modelSku, setModelSku] = useState(null);
  // const [CCAvenueStatus, setCCAvenueStatus] = useState(null);

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
        console.table("<<< Payment Result >>>", paymentResult);
        if (
          paymentResult &&
          paymentResult.data &&
          paymentResult.data.updatePayment
          // paymentResult.data.updatePayment.increment_order_id
        ) {
          const bookingId =
            paymentResult?.data?.updatePayment?.increment_order_id;
          window.sessionStorage.setItem("bookingId", bookingId);
          const { updatePayment } = paymentResult.data;
          const paymentStatus = updatePayment.payment_status;
          setPStatus(paymentStatus);
          setProductId(updatePayment?.productID);
          // setOrderId(updatePayment.increment_order_id);
          // setModelSku(updatePayment.modelSku);
          setModelVariant(updatePayment?.modelVariant);
          setModalColor(updatePayment?.modelVaahanColor);
          // updatePayment.ccavenue_status &&
          // setCCAvenueStatus(updatePayment.ccavenue_status.toLowerCase());

          if (
            updatePayment.customerToken &&
            (paymentStatus.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS ||
              paymentStatus.toLowerCase() ===
                CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING)
          ) {
            loginUtils.setSessionToken(updatePayment.customerToken);
            // const header = document.querySelector(".vida-header");
            // header && Header.enableUserAccessLinks(header);
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
              bookingStatus: "Pre Booking Complete"
            };
            const orderDetails = {
              paymentType: updatePayment.paymentType,
              paymentMethod: "",
              paymentStatus: updatePayment.orderStatus,
              PaymentMode: "online",
              orderValue: updatePayment.orderValue
                ? analyticsUtils.priceConversion(updatePayment.orderValue)
                : 0
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
              }
            }
            analyticsUtils.trackPreBookingComplete(
              location,
              productDetails,
              bookingDetails,
              orderDetails
            );
          }
        } else {
          // window.location.href = redirectUrl;
        }
      };
      getPaymentStatus();
    }
  }, []);
  return (
    pStatus && (
      <div>
        {pStatus.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS ||
        pStatus.toLowerCase() === CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING ? (
          <PaymentStatus
            config={config}
            isSuccess={true}
            variant={modelVariant}
            modelColor={modelColor}
            productID={productId}
          />
        ) : (
          <PaymentStatus
            config={config}
            isSuccess={false}
            variant={modelVariant}
            modelColor={modelColor}
            productID={productId}
          />
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

// comment this once AEM is integrated, preventing comp crash
// PreBookingPaymentStatus.defaultProps = {
//   config: {
//     bgImg: {
//       desktop: "",
//       mobile: ""
//     },
//     isFailure: false,
//     topBanner: {
//       textOne: "",
//       textTwo: "",
//       textThree: "",
//       topBannerBgImg: "",
//       leftBgImg: "",
//     },
//     payment: {
//       successImg: {
//         desktop: "",
//         mobile: ""
//       },
//       failureImg: {
//         desktop: "",
//         mobile: ""
//       },
//       successStatusText: "",
//       failureStatusText: "",
//       successPriceText: "",
//       failurePriceText: ""
//     },
//     proceedBanner: {
//       scootyIcon: "",
//       header: "",
//       showroomPrice: "",
//       paymentMethod: ""
//     },
//     cancelBanner: {
//       header: "",
//       cancelText: ""
//     },
//     retryButtonLabel: "",
//     navTab: true,
//     navLink: ""
//   }
// };

export default connect(null, mapDispatchToProps)(PreBookingPaymentStatus);
