import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { SCREENS } from "../Constants";
import { PURCHASE_STATE } from "../PurchaseSummary/Constants";
import currencyUtils from "../../../../../site/scripts/utils/currencyUtils";
import ReactTooltip from "react-tooltip";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";

const PRICE_BREAKUP_TO_SHOW = [
  "Periodic Maintenance",
  "Administrative and Incidental Charges",
  "RTO Charges",
  "Standard warranty",
  "Free Service Contract",
  "Portable Charger",
  "RTO CHARGES",
  "V1 PRO RTO CHARGES",
  "V1 PLUS RTO CHARGES",
  "V2 PRO RTO CHARGES",
  "V2 PLUS RTO CHARGES",
  "V2 LITE RTO CHARGES",
  "HYPOTHECATION CHARGES"
];

const SummaryDetails = (props) => {
  const {
    config,
    changeScreen,
    amountData,
    paymentDetails,
    totalAmount,
    totalGSTAmount,
    viewState,
    priceBreakUp,
    dealerName,
    productData,
    updateFame,
    fameApplied,
    showOfferPopup
  } = props;
  const {
    purchaseBookingAddOnContent: {
      subsidy,
      insurance,
      accessories,
      subscription,
      gst,
      offers
    }
  } = config;
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showChevronDown, setShowChevronDown] = useState(
    config.isShowChevronDownIcon
  );
  const [gstAmount, setGstAmount] = useState();
  const isReviewState = viewState === PURCHASE_STATE.REVIEW ? true : false;
  const [isFameSelected, setFameSelected] = useState(fameApplied);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const showAmountSplitUp = () => {
    setShowMoreDetails(!showMoreDetails);
    setShowChevronDown(!showChevronDown);
  };
  // useEffect(() => {
  //   if (paymentDetails.updatedOrderTax > 0) {
  //     setGstAmount(paymentDetails.updatedOrderTax);
  //   }
  // }, [paymentDetails.gstAmount]);

  // useEffect(() => {
  //   if (amountData.insurance.insuranceGst > 0) {
  //     setGstAmount(
  //       paymentDetails?.gstAmount + amountData.insurance.insuranceGst
  //     );
  //   }
  // }, [amountData.insurance]);

  const ctaTracking = (e, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const fameCtaTracking = (ctaText, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: ctaText,
        ctaLocation: ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  useEffect(() => {
    setFameSelected(fameApplied);
  }, [fameApplied]);

  const insuranceHandler = (e) => {
    if (e.target.innerText === "Add" || e.target.innerText === "0") {
      const event = { ...e };
      event.target.innerText = "Insurance - Apply";
      ctaTracking(event, "ctaButtonClick", "Insurance");
    }
    changeScreen(SCREENS.INSURANCE);
  };

  const fameSelectHandler = (e) => {
    setFameSelected(!isFameSelected);
    updateFame(!isFameSelected);
    if (e.target.innerText !== "Apply") {
      // const event = e;
      // event.target.innerText = "Applied";
      // ctaTracking(event, "ctaButtonClick", "EMPS");
    } else {
      fameCtaTracking("Subsidy-Apply", "ctaButtonClick", "Subsidy");
      // ctaTracking(event, "ctaButtonClick", "EMPS");
    }
  };

  const handleOffersHandler = (e) => {
    showOfferPopup(true);
    fameCtaTracking("Offers-Apply", "ctaButtonClick", "Offers");
  };

  return (
    <div className="purchase-summary-right-container">
      <div className="purchase-summary-right-content-container">
        <div className="purchase-delivery-info-container">
          <div className="delivering-from-info">
            <p className="delivery-info">
              {config.purchaseBookingDeliveryText}{" "}
              <span className="delivery-place">{dealerName}</span>
            </p>
          </div>
          <div className="delivery-payment-info">
            <p className="payable-text">{config.purchaseBookingPayableText}</p>
            <p className="payable-amount">
              {"₹" + Number(totalAmount).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="delivery-info-container">
          <div className="delivery-bike-info-container">
            <div className="delivery-bike-flex-container">
              <div className="delivery-bike-icon">
                <img
                  src={config.deliveryBikeIcon}
                  alt="delivery_bike_icon"
                ></img>
              </div>
              <div className="delivery-bike-model-info">
                <p className="delivery-bike-model-info-text">
                  {productData?.name}
                </p>
                <p className="delivery-bike-charges-text">
                  {config.deliveryChargesHandlingText}
                </p>
              </div>
            </div>
            <div className="delivery-model-flex-container">
              <div className="delivery-bike-model-amount">
                <p>
                  {"₹" + Number(paymentDetails?.basePrice)?.toLocaleString() ||
                    0}
                </p>
              </div>
              {showChevronDown ? (
                <div className="chevron-down-icon" onClick={showAmountSplitUp}>
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/png/chevron-down.png`}
                    alt="chevron_down_icon"
                  ></img>
                </div>
              ) : (
                <div className="chevron-down-icon" onClick={showAmountSplitUp}>
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/png/chevron-up.png`}
                    alt="chevron_down_icon"
                  ></img>
                </div>
              )}
            </div>
          </div>
          {showMoreDetails && (
            <div className="delivery-details-container">
              {priceBreakUp.length > 0 &&
                priceBreakUp
                  .filter(
                    (item, index) =>
                      // PRICE_BREAKUP_TO_SHOW.includes(item.line_name) &&
                      index !== 0 &&
                      parseFloat(item?.unit_price) > 0 &&
                      item.line_name.toLowerCase() !== "insurance"
                  )
                  .map((item) => (
                    <div
                      key={item.lineitem_id}
                      className="delivery-bike-info-container delivery-details-info-container"
                    >
                      <div className="delivery-bike-flex-container">
                        <div className="delivery-bike-icon">
                          <img
                            src={config.deliveryBikeIcon}
                            alt="delivery_bike_icon"
                          ></img>
                        </div>
                        <div className="delivery-bike-model-info">
                          <p className="delivery-bike-model-info-text">
                            {item.line_name}
                          </p>
                          <p className="delivery-bike-charges-text">
                            {item.item_subtype}
                          </p>
                        </div>
                      </div>
                      <div className="delivery-model-flex-container">
                        <div className="delivery-bike-model-amount">
                          <p>{Number(item.unit_price)?.toLocaleString()}</p>
                        </div>

                        <div className="chevron-down-icon">
                          <img
                            src={`${appUtils.getConfig(
                              "resourcePath"
                            )}images/svg/info-light.svg`}
                            alt="info_icon"
                          ></img>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <hr className="dashed-border"></hr>
        <div className={`delivery-add-on-container`}>
          {offers && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img src={offers?.addOnIcon} alt="delivery_add_on_icon"></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {offers?.addOnTitle}
                    {amountData?.offers?.value > 0 && (
                      <span className="global-tooltip">
                        <img
                          src={
                            appUtils.getConfig("resourcePath") +
                            "images/svg/tooltip-icon.svg"
                          }
                          data-tip
                          data-for={offers?.id}
                          alt="tooltip_icon"
                        ></img>
                        <ReactTooltip
                          id={offers?.id}
                          place="right"
                          effect="solid"
                        >
                          {offers?.tooltipText}
                        </ReactTooltip>{" "}
                      </span>
                    )}
                  </p>
                  <p className="delivery-add-on-info-sub-text"></p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container">
                <a
                  className={`delivery-add-on-btn ${
                    isReviewState ? "disable-links" : ""
                  }`}
                  onClick={(e) => handleOffersHandler(e)}
                >
                  {amountData?.offers?.applied
                    ? `- ${amountData?.offers?.value}`
                    : offers?.addOnBtnText}
                </a>
              </div>
            </div>
          )}
          {/* subsidy */}
          {subsidy && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img
                    src={subsidy?.addOnIcon}
                    alt="delivery_add_on_icon"
                  ></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {subsidy?.addOnTitle}
                    <span className="global-tooltip">
                      <img
                        src={
                          appUtils.getConfig("resourcePath") +
                          "images/svg/tooltip-icon.svg"
                        }
                        data-tip
                        data-for={subsidy?.id}
                        alt="tooltip_icon"
                      ></img>
                      <ReactTooltip
                        id={subsidy?.id}
                        place="right"
                        effect="solid"
                      >
                        {subsidy?.tooltipText}
                      </ReactTooltip>{" "}
                    </span>
                  </p>
                  <p className="delivery-add-on-info-sub-text">
                    {amountData?.subsidy?.applied
                      ? amountData?.subsidy?.description
                      : subsidy?.addOnSubText}
                  </p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container fame-checkbox">
                <a
                  className={`delivery-add-on-btn ${
                    isReviewState ? "disable-links" : ""
                  }`}
                  onClick={(e) => fameSelectHandler(e)}
                >
                  {isFameSelected
                    ? amountData?.subsidy.value > 0
                      ? `- ${amountData?.subsidy?.value}`
                      : subsidy?.addOnBtnText
                    : subsidy?.addOnBtnText}
                </a>
                {/* {!isReviewState && (
                  <label className="option-select" onClick={fameSelectHandler}>
                    {isFameSelected ? (
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/checkbox-selected.svg`}
                      />
                    ) : (
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/checkbox.svg`}
                      />
                    )}
                  </label>
                )} */}
                {/* <p
                  className={`delivery-add-on-btn ${
                    isReviewState ? "disable-links" : ""
                  }`}
                >
                  {isFameSelected ? `-${amountData.subsidy.value}` : 0}
                </p> */}
              </div>
            </div>
          )}
          {/* insurance */}
          {insurance && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img
                    src={insurance?.addOnIcon}
                    alt="delivery_add_on_icon"
                  ></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {insurance?.addOnTitle}
                  </p>
                  <p className="delivery-add-on-info-sub-text">
                    {amountData?.insurance?.applied
                      ? amountData?.insurance?.description
                      : insurance?.addOnSubText}
                  </p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container">
                <a
                  className={`delivery-add-on-btn ${
                    isReviewState ? "disable-links" : ""
                  }`}
                  onClick={(e) => insuranceHandler(e)}
                >
                  {amountData?.insurance?.applied
                    ? amountData?.insurance?.value > 0
                      ? `+ ${currencyUtils.getCurrencyFormatValue(
                          amountData?.insurance?.value,
                          0
                        )}`
                      : amountData?.insurance?.value
                    : insurance?.addOnBtnText}
                </a>
              </div>
            </div>
          )}
          {/* accessories */}
          {accessories && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img
                    src={accessories?.addOnIcon}
                    alt="delivery_add_on_icon"
                  ></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {accessories?.addOnTitle}
                  </p>
                  <p className="delivery-add-on-info-sub-text">
                    {amountData?.accessories?.applied
                      ? amountData?.accessories?.description
                      : accessories?.addOnSubText}
                  </p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container">
                <a
                  className={`delivery-add-on-btn ${
                    isReviewState ? "disable-links" : ""
                  }`}
                  onClick={() => changeScreen(SCREENS.ACCESSORIES)}
                >
                  {amountData?.accessories?.applied
                    ? amountData?.accessories?.value > 0
                      ? `+ ${amountData?.accessories?.value}`
                      : amountData?.accessories?.value
                    : accessories?.addOnBtnText}
                </a>
              </div>
            </div>
          )}
          {/* subscriptions */}
          {subscription && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img
                    src={subscription?.addOnIcon}
                    alt="delivery_add_on_icon"
                  ></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {subscription?.addOnTitle}
                  </p>
                  <p className="delivery-add-on-info-sub-text">
                    {amountData?.subscriptions?.applied
                      ? amountData?.subscriptions?.description
                      : subscription?.addOnSubText}
                  </p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container">
                <a
                  className={`delivery-add-on-btn ${
                    isReviewState || amountData?.subscriptions?.applied
                      ? "disable-links"
                      : ""
                  }`}
                  // onClick={() => changeScreen(SCREENS.SUBSCRIPTION)}
                >
                  {amountData?.subscriptions?.applied
                    ? amountData?.subscriptions?.value > 0
                      ? `+ ${amountData?.subscriptions?.value}`
                      : "Free"
                    : subscription?.addOnBtnText}
                </a>
              </div>
            </div>
          )}
          {gst && (
            <div className="delivery-add-on-content-container">
              <div className="delivery-add-on-title-container">
                <div className="delivery-add-on-icon">
                  <img src={gst?.addOnIcon} alt="delivery_add_on_icon"></img>
                </div>
                <div className="delivery-add-on-info">
                  <p className="delivery-add-on-info-title">
                    {gst?.addOnTitle}
                    <span className="global-tooltip">
                      <img
                        src={
                          appUtils.getConfig("resourcePath") +
                          "images/svg/tooltip-icon.svg"
                        }
                        data-tip
                        data-for={gst?.id}
                        alt="tooltip_icon"
                      ></img>
                      <ReactTooltip id={gst?.id} place="right" effect="solid">
                        {gst?.tooltipText}
                      </ReactTooltip>{" "}
                    </span>
                  </p>
                  <p className="delivery-add-on-info-sub-text">
                    {gst?.addOnSubText}
                  </p>
                </div>
              </div>
              <div className="delivery-add-on-btn-container">
                <p className="gst-value">
                  {currencyUtils.getCurrencyFormatValue(totalGSTAmount, 0)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;

SummaryDetails.propTypes = {
  config: PropTypes.object,
  changeScreen: PropTypes.func,
  productData: PropTypes.object,
  amountData: PropTypes.object,
  paymentDetails: PropTypes.object,
  totalAmount: PropTypes.number,
  totalGSTAmount: PropTypes.number,
  viewState: PropTypes.string,
  priceBreakUp: PropTypes.arrayOf(PropTypes.object),
  dealerName: PropTypes.string,
  updateFame: PropTypes.func,
  fameApplied: PropTypes.bool,
  showOfferPopup: PropTypes.func
};
