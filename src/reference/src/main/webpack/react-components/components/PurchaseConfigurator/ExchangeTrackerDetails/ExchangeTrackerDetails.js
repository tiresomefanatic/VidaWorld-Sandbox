import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const ExchangeTrackerDetails = (props) => {
  const { exchangeOfferConfig, handleEdit, handleDelete, cmpProps } = props;
  const {
    vehicle_make,
    vehicle_model,
    vehicle_cc,
    purchase_city,
    year_mfg,
    exchange_amount
  } = cmpProps;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  useEffect(() => {
    if (isAnalyticsEnabled) {
      const additionalPageName = ":Confirmation";
      analyticsUtils.trackExchangePageLoad(additionalPageName);
    }
  }, []);
  return (
    <div className="vida-exchange-tracker-steps__final-step">
      <div className="vida-exchange-tracker-steps__header">
        <span className="vida-exchange-tracker-steps__title">
          {`${vehicle_make} ${vehicle_model} ${vehicle_cc}`}
        </span>
        {!handleDelete && (
          <span
            onClick={handleEdit}
            className="vida-exchange-tracker-steps__details-edit"
          >
            <i className="icon-pencil-alt"></i>
          </span>
        )}
        {handleDelete && (
          <p className="vida-exchange-tracker-steps__header-actions">
            <span
              className="vida-exchange-tracker-steps__icon-edit"
              onClick={handleEdit}
            >
              <i className="icon-pencil-alt"></i>
            </span>

            <span
              className="vida-exchange-tracker-steps__icon-edit"
              onClick={handleDelete}
            >
              <i className="icon-trash"></i>
            </span>
          </p>
        )}
      </div>
      <p className="vida-exchange-tracker-steps__para vida-exchange-tracker-steps__place">
        {`${exchangeOfferConfig.exchangeOfferDetails.message} ${year_mfg} at ${purchase_city}`}
      </p>
      <p className="vida-exchange-tracker-steps__para vida-exchange-tracker-steps__amount-desc">
        {exchangeOfferConfig.exchangeOfferDetails.priceText}
      </p>
      <span className="txt-color--orange">
        {currencyUtils.getCurrencyFormatValue(
          exchange_amount ? exchange_amount : 0
        )}
      </span>
      <p
        className="vida-exchange-tracker-steps__para"
        dangerouslySetInnerHTML={{
          __html: exchangeOfferConfig.exchangeOfferDetails.details
        }}
      ></p>
    </div>
  );
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      ...purchaseConfigReducer.tradeIn
    }
  };
};
ExchangeTrackerDetails.propTypes = {
  exchangeOfferConfig: PropTypes.shape({
    exchangeOfferDetails: PropTypes.shape({
      message: PropTypes.string,
      priceText: PropTypes.string,
      details: PropTypes.string
    })
  }),
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  cmpProps: PropTypes.object
};
ExchangeTrackerDetails.defaultProps = {
  cmpProps: {}
};
export default connect(mapStateToProps)(ExchangeTrackerDetails);
