import React, { useEffect } from "react";
import PropTypes from "prop-types";
import BillingShippingDetails from "./BillingShippingDetails/BillingShippingDetails";
import DeliveryStatus from "../DeliveryStatus/DeliveryStatus";
import { useGetOrderData } from "../../../react-components/hooks/purchaseConfig/purchaseConfigHooks";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { connect } from "react-redux";

const DeliveryDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { config, cmpProps } = props;
  const { billingAddressDetail, payment } = cmpProps;
  const formId = "billing-shipping-form";
  const getOrderData = useGetOrderData();
  const currentStatus = 2;

  const queryString = location.href.split("?")[1];
  const purchaseConfigUrl = appUtils.getPageUrl("purchaseConfigUrl");
  const redirectionBackUrl = `${purchaseConfigUrl}?${queryString}`;

  const orderDataDetails = async () => {
    if (queryString) {
      const decryptedParams = cryptoUtils.decrypt(queryString);
      const params = new URLSearchParams("?" + decryptedParams);
      if (params && params.get("orderId") && params.get("opportunityId")) {
        setSpinnerActionDispatcher(true);

        getOrderData({
          variables: {
            order_id: params.get("orderId"),
            opportunity_id: params.get("opportunityId")
          }
        });
      }
    } else {
      window.location.href = appUtils.getPageUrl("profileUrl");
    }
  };

  const handleRedirection = () => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Back",
        position: "Bottom",
        type: "Icon",
        clickType: "other"
      };
      const additionalPageName = ":Billing & shipping details";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          if (redirectionBackUrl) {
            window.location.href = redirectionBackUrl;
          }
        }
      );
    } else if (redirectionBackUrl) {
      window.location.href = redirectionBackUrl;
    }
  };

  useEffect(() => {
    orderDataDetails();
  }, []);

  return (
    <div className="vida-delivery-details bg-color--smoke-white">
      <div className="vida-container">
        <div className="vida-delivery-details__wrapper">
          <div className="vida-delivery-details__billing">
            <BillingShippingDetails
              queryString={queryString}
              billingDetails={config.billingShippingConfig}
              formId={formId}
            ></BillingShippingDetails>
          </div>
          {billingAddressDetail.pincode && (
            <div className="vida-delivery-details__shipping">
              <DeliveryStatus
                deliveryStatusConfig={config.deliveryStatusConfig}
                formId={formId}
                currentStatus={currentStatus}
                paymentMethod={payment.paymentMethod}
                triggerAction="updateDetails"
                redirectionHandler={handleRedirection}
              ></DeliveryStatus>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      billingAddressDetail: purchaseConfigReducer.billingAddresses,
      payment: purchaseConfigReducer.payment
    }
  };
};

DeliveryDetails.propTypes = {
  config: PropTypes.object,
  cmpProps: PropTypes.shape({
    billingAddressDetail: PropTypes.object,
    payment: PropTypes.object
  })
};

DeliveryDetails.defaultProps = {
  config: {},
  cmpProps: {}
};
export default connect(mapStateToProps)(DeliveryDetails);
