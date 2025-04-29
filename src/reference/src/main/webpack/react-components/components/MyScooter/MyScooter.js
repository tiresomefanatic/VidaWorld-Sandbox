import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../site/scripts/utils/appUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useGetMyScooterDetails } from "../../hooks/myScooter/myScooterHooks";
import {
  useCreateOrder,
  useGetAadharVerified
} from "../../hooks/purchaseConfig/purchaseConfigHooks";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const myScooter = (props) => {
  const {
    config,
    configuredAmount,
    configuredOrderId,
    configuredImageUrl,
    configuredOpportunityId,
    configuredScooterName,
    configuredDate,
    isOrderCreated,
    isPrebooked,
    configuredBookingId
  } = props;
  const { title, configLabels, noRecordFound, btnLabels, showOldPurchasePage } =
    config;

  const [purchaseConfigUrl, setPurchaseConfigUrl] = useState(
    appUtils.getPageUrl("purchaseConfigUrl")
  );

  const preBookingUrl = appUtils.getPageUrl("preBookingUrl");
  const configurationUrl = appUtils.getPageUrl("configurationUrl");

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const getMyScooter = useGetMyScooterDetails();

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getMyScooter();
  }, []);
  //aadhar verified logic
  const [isVerifyCheckDone, setVerifyCheckDone] = useState(false);
  const getAadharVerified = useGetAadharVerified(setVerifyCheckDone);
  useEffect(() => {
    if (isOrderCreated) {
      // const aadharVerified =
      getAadharVerified({
        variables: {
          opportunity_id: `${configuredOpportunityId}`
        }
      });
    }
  }, [configuredOpportunityId, isOrderCreated]);

  //if aadhar verified then redirect to summary else aadhar if not to be shown old page
  useEffect(() => {
    if (!showOldPurchasePage) {
      if (isVerifyCheckDone) {
        setPurchaseConfigUrl(appUtils.getPageUrl("billingPricingNewUrl"));
      } else {
        setPurchaseConfigUrl(appUtils.getPageUrl("aadharVerificationUrl"));
      }
    }
  }, [isVerifyCheckDone, showOldPurchasePage]);

  const getCreateOrder = useCreateOrder();
  const additionalPageName = ":My Scooter";
  const additionalJourneyName = "";

  const handlePurchaseScooter = async () => {
    setSpinnerActionDispatcher(true);

    const customLink = {
      name: "Purchase",
      position: "Middle",
      type: "Button",
      clickType: "other"
    };

    if (isPrebooked) {
      // Redirection to Purchaseconfig page, if isPrebooked = true &&  isOrderCreated = false / null
      const createOrderRes = await getCreateOrder({
        variables: {
          order_increment_id: configuredBookingId
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
            analyticsUtils.trackCtaClick(
              customLink,
              additionalPageName,
              additionalJourneyName,
              function () {
                window.location.href =
                  purchaseConfigUrl + "?" + encryptedParams;
              }
            );
          } else {
            window.location.href = purchaseConfigUrl + "?" + encryptedParams;
          }
        }
      }
    } else if (isOrderCreated) {
      // Redirection to Purchaseconfig page, if isPrebooked = true &&  isOrderCreated = true
      const params = [
        "orderId=",
        configuredOrderId,
        "&opportunityId=",
        configuredOpportunityId
      ].join("");
      const encryptedParams = cryptoUtils.encrypt(params);

      if (isAnalyticsEnabled) {
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            window.location.href = purchaseConfigUrl + "?" + encryptedParams;
          }
        );
      } else {
        window.location.href = purchaseConfigUrl + "?" + encryptedParams;
      }
    } else {
      // Redirection to Prbooking page, if isPrebooked && isOrderCreated = false/null
      if (isAnalyticsEnabled) {
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
    }
  };

  const handleConfigScooter = () => {
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Build your own",
        position: "Middle",
        type: "Button",
        clickType: "other"
      };

      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = configurationUrl;
        }
      );
    } else {
      window.location.href = configurationUrl;
    }
  };

  return (
    <div className="vida-my-scooter">
      {configuredScooterName ? (
        <>
          <h2 className="vida-my-scooter__title">{title}</h2>
          <div className="vida-card">
            <div className="vida-card__container">
              <div className="vida-card__image">
                <img src={configuredImageUrl} />
              </div>
              <div className="vida-card__product-data">
                <div className="vida-card__scooter-desc">
                  <h3>{configuredScooterName}</h3>
                  <h4>
                    {configLabels.dateLabel} - {configuredDate}
                  </h4>
                </div>
                <div className="vida-card__scooter-desc">
                  <h4>{configLabels.totalLabel}</h4>
                  <h3>
                    {currencyUtils.getCurrencyFormatValue(configuredAmount)}
                  </h3>
                </div>
              </div>
              <div className="vida-card__scooter-footer">
                <button
                  className="btn btn--secondary"
                  onClick={() => handlePurchaseScooter()}
                >
                  {btnLabels.purchaseBtn}
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleConfigScooter}
                >
                  {btnLabels.continueBtn}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="vida-my-scooter__no-record">
          <h3>{noRecordFound.title}</h3>
          {noRecordFound.description && <h4>{noRecordFound.description}</h4>}
          <button
            className="btn btn--primary btn--lg"
            onClick={handleConfigScooter}
          >
            {noRecordFound.buildYourOwnBtn}
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ myScooterReducer }) => {
  return {
    configuredAmount: myScooterReducer.configuredAmount,
    configuredOrderId: myScooterReducer.configuredOrderId,
    configuredOpportunityId: myScooterReducer.configuredOpportunityId,
    configuredImageUrl: myScooterReducer.configuredImageUrl,
    configuredScooterName: myScooterReducer.configuredScooterName,
    configuredDate: myScooterReducer.configuredDate,
    isOrderCreated: myScooterReducer.isOrderCreated,
    isPrebooked: myScooterReducer.isPrebooked,
    configuredBookingId: myScooterReducer.configuredBookingId
  };
};

myScooter.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    showOldPurchasePage: PropTypes.bool
  })
};

myScooter.defaultProps = {
  config: {}
};
export default connect(mapStateToProps)(myScooter);
