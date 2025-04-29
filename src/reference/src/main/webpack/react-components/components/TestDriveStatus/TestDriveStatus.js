import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import StatusPage from "./StatusPage/StatusPage";
import CONSTANT from "../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useUpdatePaymentStatus } from "../../hooks/testDrive/testDriveStatus/testDriveStatusHooks";
import { useLongTermTestRideDetails } from "../../hooks/testDrive/testDriveSummary/testDriveSummaryHooks";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const TestDriveStatus = (props) => {
  const { successPage, failurePage, backgroundImg } = props.config;
  const params = new URLSearchParams(window.location.search);
  const setUpdatePaymentStatus = useUpdatePaymentStatus();
  const [bookingId, setBookingId] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const setLongTermTestRideDetails = useLongTermTestRideDetails();
  const [summaryData, setSummaryData] = useState(null);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  let analyticsData = {};

  const fetchTestDriveData = async (id) => {
    setSpinnerActionDispatcher(true);
    const testDriveRes = await setLongTermTestRideDetails({
      variables: {
        bookingId: id
      }
    });

    if (
      testDriveRes.data.GetLongTermTestRideDataByID &&
      testDriveRes.data.GetLongTermTestRideDataByID.statusCode === 200
    ) {
      setSummaryData(testDriveRes.data.GetLongTermTestRideDataByID);
      const testDriveResult = testDriveRes.data.GetLongTermTestRideDataByID;
      if (isAnalyticsEnabled) {
        const location = {
          state: testDriveResult.state,
          city: testDriveResult.cityName,
          pinCode: testDriveResult.zip,
          country: testDriveResult.country ? testDriveResult.country : ""
        };
        const productDetails = {
          modelVariant: testDriveResult.modelVariant
            ? testDriveResult.modelVariant
            : "",
          modalColor: "",
          productID: testDriveResult.skuId
        };
        const bookingDetails = {
          testDriveLocation: "Long Term Test Drive",
          vidaCenter: "",
          testDriveDate: testDriveResult.startDate,
          testDriveTime: `${testDriveResult.startTime} - ${testDriveResult.endTime}`,
          testDriveReceiveNotificationStatus: "",
          bookingID: analyticsData.bookingId,
          bookingStatus: "Test Drive Booking Completed"
        };
        const order = {
          paymentType: analyticsData.paymentType,
          paymentMethod: analyticsData.paymentMethod,
          orderStatus: analyticsData.orderStatus,
          orderValue: analyticsData.orderValue
        };
        analyticsUtils.trackTestDriveComplete(
          location,
          productDetails,
          bookingDetails,
          order
        );
      }
    }
  };

  const fetchPaymentStatus = async () => {
    setSpinnerActionDispatcher(true);
    const encryptedKey = params.has("encResp") && params.get("encResp");
    const paymentRes = await setUpdatePaymentStatus({
      variables: {
        encryptedResponse: encryptedKey
      }
    });

    if (paymentRes.data) {
      setBookingStatus(
        paymentRes.data.updateFreedoPayment.payment_status.toLowerCase()
      );
      setBookingId(paymentRes.data.updateFreedoPayment.booking_id);
      if (isAnalyticsEnabled) {
        const paymentResult = paymentRes.data.updateFreedoPayment;
        analyticsData = {
          paymentType: paymentResult.paymentType,
          paymentMethod: paymentResult.paymentMethod,
          orderStatus:
            paymentResult.payment_status.toLowerCase() === "success"
              ? "Completed"
              : paymentResult.payment_status,
          orderValue: paymentResult.orderValue
            ? parseFloat(paymentResult.orderValue)
            : 0,
          bookingId: paymentResult.booking_id
        };
      }

      if (paymentRes.data.updateFreedoPayment.booking_id) {
        fetchTestDriveData(paymentRes.data.updateFreedoPayment.booking_id);
      } else {
        window.location.href =
          appUtils.getPageUrl("profileUrl") +
          "?" +
          cryptoUtils.encrypt("?tabId=longTerm").toString();
      }
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  return (
    <>
      {bookingStatus && bookingId ? (
        <div className="vida-test-drive__container">
          <div className="vida-test-drive__asset vida-test-drive__asset--show">
            <img src={backgroundImg} alt="Vida Test Drive" />
          </div>
          <div className="vida-test-drive__content vida-test-drive__status">
            <StatusPage
              config={
                bookingStatus === CONSTANT.PAYMENT_STATUS.SUCCESS ||
                bookingStatus === CONSTANT.PAYMENT_STATUS.SUCCESS_PENDING
                  ? successPage
                  : failurePage
              }
              bookingId={bookingId}
              summaryData={summaryData}
              status={bookingStatus}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

TestDriveStatus.propTypes = {
  config: PropTypes.object
};

TestDriveStatus.defaultProps = {};

export default TestDriveStatus;
