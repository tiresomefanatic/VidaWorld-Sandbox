import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useUpdateOrder } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setPaymentDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../../site/scripts/constant";
import Popup from "../../Popup/Popup";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const Breakup = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const redirectionUrl = appUtils.getPageUrl("billingShippingUrl");
  const {
    title,
    summary,
    estimateLabel,
    agreeTerms,
    submitBtn,
    helpLink,
    insuranceWarning
  } = props.config;
  const {
    order,
    productData,
    aadhar,
    gst,
    payment,
    insurance,
    productId,
    subscriptionPlan,
    tradeIn,
    userLocation,
    myScooter
  } = props.cmpProps;
  const [agreeTermsSelected, setAgreeTermsSelected] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [finalPrice, setFinalPrice] = useState("");
  const [showInsuranceCheckPopup, setShowInsuranceCheckPopup] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsContent, setTermsContent] = useState(null);

  const handleSetPrice = () => {
    const basePrice = payment.basePrice,
      otherCharges = payment.otherCharges,
      addonsPrice = payment.addonsPrice,
      gstAmount =
        payment.gstAmount +
        insurance.insuranceGstAmount +
        Number(subscriptionPlan.tax_amount),
      configurePrice = payment.configurePrice,
      insuranceBase = insurance.insuranceBasePrice,
      fameSubsidyEligibleAmount =
        aadhar.aadharSelected && aadhar.aadharUsedForRegister
          ? aadhar.fameSubsidyEligibleAmount
          : 0,
      prebookingPricePaid = payment.prebookingPricePaid,
      exchangeAmount = parseFloat(tradeIn.exchange_amount),
      subscriptionPlanPrice = subscriptionPlan.price
        ? Number(subscriptionPlan.price)
        : 0;
    const calculatedPrice =
      basePrice +
      configurePrice +
      otherCharges +
      addonsPrice +
      gstAmount +
      insuranceBase -
      prebookingPricePaid -
      exchangeAmount -
      fameSubsidyEligibleAmount +
      subscriptionPlanPrice;
    setFinalPrice(calculatedPrice ? calculatedPrice : "");
    calculatedPrice &&
      setPaymentDataDispatcher({ finalPrice: calculatedPrice });
  };

  useEffect(() => {
    handleSetPrice();
  }, [
    order,
    productData,
    aadhar,
    gst,
    insurance,
    productId,
    subscriptionPlan,
    tradeIn
  ]);

  const updateOrder = useUpdateOrder();

  const triggerUpdateOrderAPI = async (event) => {
    setSpinnerActionDispatcher(true);
    const variables = {
      order_id: order.orderId,
      subscription_plan_id: subscriptionPlan.package_id,
      aadhar_selected: aadhar.aadharSelected,
      aadhar_number: aadhar.aadharSelected ? aadhar.aadharNumber : "",
      aadhar_used_for_register:
        aadhar.aadharSelected && aadhar.aadharUsedForRegister,
      gst_selected: gst.gstSelected,
      gst_number: gst.gstSelected ? gst.gstNumber : "",
      company_name: gst.gstSelected ? gst.companyName : "",
      company_email: gst.gstSelected ? gst.companyEmail : "",
      selected_payment: payment.paymentMethod,
      payment_method: "",
      insurer_id: insurance.insurerId,
      insurance_addons: insurance.insuranceAddons,
      cpa_opted: insurance.cpaOpted ? "Y" : "N",
      exchange_selected: tradeIn.tradeInSelected ? "Y" : "N",
      cpa_reason: !insurance.cpaOpted ? insurance.cpaNotOptedReason : ""
    };
    const updateOrderRes = await updateOrder({
      variables
    });
    if (
      updateOrderRes.data.updateSaleOrder &&
      updateOrderRes.data.updateSaleOrder.status_code === "200"
    ) {
      if (isAnalyticsEnabled) {
        const productDetails = {
            modelVariant: productData.name,
            modelColor: productData.color,
            productID: productId
          },
          bookingDetails = {
            bookingStatus: "Booking Complete",
            owenershipPlan: subscriptionPlan.name,
            owenershipPlanType: subscriptionPlan.billing_term_unit,
            aadharCardUsedStatus: aadhar.aadharSelected ? "Yes" : "No",
            gstNumber: gst.gstSelected ? "Yes" : "No",
            exchangeTwoWheeler: tradeIn.exchange_amount ? "Yes" : "No"
          },
          priceBreakup = {
            configurationPrice: payment.configurePrice,
            ownershipPlanPrice: parseInt(subscriptionPlan.price),
            insurancePrice: insurance.insuranceBasePrice,
            gstAmount: payment.gstAmount,
            fameSubsidy: aadhar.fameSubsidyEligibleAmount,
            otherCharges: payment.otherCharges,
            addOnsCharges: payment.addonsPrice,
            exchangeAmount: parseFloat(tradeIn.exchange_amount)
          },
          configuratorDetails = {
            accessorizeName:
              payment.configurePrice && myScooter.configuredAccessories.length
                ? myScooter.configuredAccessories
                    .toString()
                    .split(",")
                    .join("|")
                : ""
          },
          customLink = {
            name: event.nativeEvent.target.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
        analyticsUtils.trackBookingCheckout(
          userLocation,
          productDetails,
          bookingDetails,
          priceBreakup,
          configuratorDetails,
          customLink,
          function () {
            window.location.href = `${redirectionUrl}?${props.queryString}`;
          }
        );
      } else {
        window.location.href = `${redirectionUrl}?${props.queryString}`;
      }
    }
  };

  const handleUpdateOrder = (event) => {
    event.preventDefault();
    // if (
    //   aadhar.aadharSelected &&
    //   (aadhar.aadharNumber.trim().length > 12 ||
    //     aadhar.aadharNumber.trim().length < 12 ||
    //     aadhar.aadharNumber.trim().length <= 0 ||
    //     !aadhar.aadharUsedForRegister)
    // ) {
    //   props.showAadharError(true);
    //   return;
    // } else {
    //   props.showAadharError(false);
    // }

    if (aadhar.aadharSelected && !aadhar.aadharUsedForRegister) {
      props.showAadharError(true);
      return;
    } else {
      props.showAadharError(false);
    }

    if (
      gst.gstSelected &&
      (gst.gstNumber.trim().length <= 0 ||
        (gst.companyEmail.length > 0 &&
          !CONSTANT.EMAIL_REGEX.test(gst.companyEmail)))
    ) {
      props.showGSTError(true);
      return;
    } else {
      props.showGSTError(false);
    }
    if (payment.paymentMethod.trim().length <= 0) {
      return;
    }
    if (!agreeTermsSelected) {
      setIsFormValid(false);
      return;
    }

    if (
      insurance.insurerId === "" &&
      payment.paymentMethod !== CONSTANT.PAYMENT_METHOD.LEASE
    ) {
      setShowInsuranceCheckPopup(true);
      return;
    } else {
      setShowInsuranceCheckPopup(false);
      triggerUpdateOrderAPI(event);
    }
  };

  const handleInsuranceWarning = (event) => {
    setShowInsuranceCheckPopup(false);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Middle",
        type: "Button",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const handleChatBotEvent = (event) => {
    event.preventDefault();
    bootstrapChat && bootstrapChat();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.currentTarget.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
  };

  const toggleTermsCheck = () => {
    // isChecked !== null ? setChecked(isChecked) : setChecked(!checked);
    // if (isChecked !== null) {
    //   setAgreeTermsSelected(isChecked);
    //   setIsFormValid(isChecked);
    //   return;
    // }
    setAgreeTermsSelected(!agreeTermsSelected);
    setIsFormValid(!agreeTermsSelected);
    setChecked(!checked);
  };

  const handleTermsandConditions = (event) => {
    event.preventDefault();
    setShowTermsPopup(true);
    document.querySelector("html").classList.add("overflow-hidden");
    const termsContent = document.getElementById(agreeTerms.id);
    setTermsContent(termsContent.innerHTML);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: event.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackTermsCondition(customLink);
    }
  };

  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const handleAgreeTerms = () => {
    setAgreeTermsSelected(true);
    setChecked(true);
    setIsFormValid(true);
    closeTermsPopup();
  };
  return (
    <div className="vida-breakup__container">
      {showInsuranceCheckPopup && (
        <Popup handlePopupClose={() => setShowInsuranceCheckPopup(false)}>
          <div className="vida-breakup__insurance-popup">
            <p>{props.insuranceMessage.title}</p>
            <p>{props.insuranceMessage.description}</p>
            <h4>{insuranceWarning.message}</h4>
            <div className="vida-breakup__btn-container">
              <button
                className="btn btn--primary"
                onClick={(event) => {
                  setShowInsuranceCheckPopup(false);
                  triggerUpdateOrderAPI(event);
                }}
              >
                {insuranceWarning.yesBtn.label}
              </button>
              <button
                className="btn btn--secondary"
                onClick={(event) => {
                  handleInsuranceWarning(event);
                }}
              >
                {insuranceWarning.noBtn.label}
              </button>
            </div>
          </div>
        </Popup>
      )}
      <p className="vida-breakup__title">{title}</p>
      <div className="vida-breakup__details">
        <p className="vida-breakup__item">
          <span className="vida-breakup__name">{summary.basePriceLabel}</span>
          <span className="vida-breakup__value">
            {currencyUtils.getCurrencyFormatValue(payment.basePrice)}
          </span>
        </p>
        {payment.configurePrice !== 0 && (
          <p className="vida-breakup__item">
            <span className="vida-breakup__name">{summary.configureLabel}</span>
            <span className="vida-breakup__value">
              {currencyUtils.getCurrencyFormatValue(payment.configurePrice)}
            </span>
          </p>
        )}
        <p className="vida-breakup__item">
          <span className="vida-breakup__name">
            {summary.otherChargesLabel}
          </span>
          <span className="vida-breakup__value">
            {currencyUtils.getCurrencyFormatValue(payment.otherCharges)}
          </span>
        </p>
        <p className="vida-breakup__item">
          <span className="vida-breakup__name">{summary.addonsLabel}</span>
          <span className="vida-breakup__value">
            {currencyUtils.getCurrencyFormatValue(payment.addonsPrice)}
          </span>
        </p>
        {insurance && insurance.insurerName && (
          <p className="vida-breakup__item">
            <span className="vida-breakup__name">{insurance.insurerName}</span>
            <span className="vida-breakup__value">
              {currencyUtils.getCurrencyFormatValue(
                insurance.insuranceBasePrice
              )}
            </span>
          </p>
        )}

        {subscriptionPlan.name && (
          <p className="vida-breakup__item">
            <span className="vida-breakup__name">
              {subscriptionPlan.name} - {subscriptionPlan.billing_term_unit}
            </span>
            <span className="vida-breakup__value">
              {currencyUtils.getCurrencyFormatValue(subscriptionPlan.price)}
            </span>
          </p>
        )}

        <p className="vida-breakup__item">
          <span className="vida-breakup__name">{summary.gstLabel}</span>
          <span className="vida-breakup__value">
            {currencyUtils.getCurrencyFormatValue(
              payment.gstAmount +
                insurance.insuranceGstAmount +
                Number(subscriptionPlan.tax_amount)
            )}
          </span>
        </p>

        {aadhar && aadhar.aadharSelected && aadhar.aadharUsedForRegister && (
          <p className="vida-breakup__item">
            <span className="vida-breakup__name">{summary.subsidyLabel}</span>
            <span className="vida-breakup__value vida-breakup__value--deduct">
              ( -{" "}
              {currencyUtils.getCurrencyFormatValue(
                aadhar.fameSubsidyEligibleAmount
              )}
              )
            </span>
          </p>
        )}
        <p className="vida-breakup__item">
          <span className="vida-breakup__name">
            {summary.prebookingPricePaidLabel}
          </span>
          <span className="vida-breakup__value vida-breakup__value--deduct">
            ( -{" "}
            {currencyUtils.getCurrencyFormatValue(payment.prebookingPricePaid)})
          </span>
        </p>
        {tradeIn && tradeIn.tradeInSelected && (
          <p className="vida-breakup__item">
            <span className="vida-breakup__name">{summary.exchangeLabel}</span>
            <span className="vida-breakup__value vida-breakup__value--deduct">
              ( -{" "}
              {currencyUtils.getCurrencyFormatValue(tradeIn.exchange_amount)})
            </span>
          </p>
        )}
      </div>
      <div className="vida-breakup__summary">
        <div className="vida-breakup__summary-title">
          <span> {productData.name}</span>
          <span>{currencyUtils.getCurrencyFormatValue(finalPrice)}</span>
        </div>
        <div className="vida-breakup__estimate">{estimateLabel}</div>

        <div className={`${!checked ? "form__group--error" : ""}`}>
          <div className="form__group form__field-checkbox vida-breakup__terms">
            <label className="vida-user-access__label">
              {agreeTerms.agreeLabel}{" "}
              <input
                type="checkbox"
                name="agreeTerms"
                htmlFor="terms"
                checked={checked}
                onChange={(e) => toggleTermsCheck(e)}
              ></input>
              <span className="form__field-checkbox-mark"></span>
            </label>
            <a
              href="#"
              rel="noreferrer noopener"
              onClick={(event) => handleTermsandConditions(event)}
            >
              {agreeTerms.terms.label}
            </a>
          </div>
          {!checked && (
            <p className="form__field-message">
              {agreeTerms.validationRules.required.message}
            </p>
          )}
        </div>
      </div>

      <div className="vida-breakup__submit">
        <button
          type="button"
          className="btn btn--primary btn--full-width"
          onClick={(event) => handleUpdateOrder(event)}
          disabled={!isFormValid}
        >
          {submitBtn.label}
        </button>
      </div>

      <div className="vida-breakup__help-link">
        {helpLink.helpLabel}{" "}
        <a href="#" onClick={(event) => handleChatBotEvent(event)}>
          {helpLink.chatLabel}
        </a>
      </div>
      {showTermsPopup && (
        <div className="vida-terms-conditions">
          <div className="vida-terms-conditions__container">
            <div className="vida-terms-conditions__body">
              <div className="vida-terms-conditions__body-wrap">
                <div
                  dangerouslySetInnerHTML={{
                    __html: termsContent
                  }}
                ></div>
              </div>
            </div>
            <div className="vida-terms-conditions__btn-wrap">
              <button
                className="btn btn--primary"
                role="button"
                onClick={() => handleAgreeTerms()}
              >
                {agreeTerms.btnLabel.agree}
              </button>
              <button
                className="btn btn--secondary"
                role="button"
                onClick={() => closeTermsPopup()}
              >
                {agreeTerms.btnLabel.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Breakup.propTypes = {
  showAadharError: PropTypes.func,
  showGSTError: PropTypes.func,
  queryString: PropTypes.string,
  cmpProps: PropTypes.shape({
    order: PropTypes.object,
    productId: PropTypes.string,
    productData: PropTypes.object,
    aadhar: PropTypes.object,
    gst: PropTypes.object,
    payment: PropTypes.object,
    insurance: PropTypes.object,
    subscriptionPlan: PropTypes.object,
    tradeIn: PropTypes.object,
    userLocation: PropTypes.object,
    myScooter: PropTypes.object
  }),
  insuranceMessage: PropTypes.object,
  config: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.shape({
      basePriceLabel: PropTypes.string,
      otherChargesLabel: PropTypes.string,
      addonsLabel: PropTypes.string,
      configureLabel: PropTypes.string,
      gstLabel: PropTypes.string,
      subsidyLabel: PropTypes.string,
      prebookingPricePaidLabel: PropTypes.string,
      exchangeLabel: PropTypes.string
    }),
    estimateLabel: PropTypes.string,
    agreeTerms: PropTypes.any,
    submitBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    helpLink: PropTypes.object,
    insuranceWarning: PropTypes.object
  })
};

const mapStateToProps = ({
  purchaseConfigReducer,
  userProfileDataReducer,
  myScooterReducer
}) => {
  return {
    cmpProps: {
      order: purchaseConfigReducer.order,
      productId: purchaseConfigReducer.productId,
      productData: purchaseConfigReducer.productData,
      aadhar: purchaseConfigReducer.aadhar,
      gst: purchaseConfigReducer.gst,
      payment: purchaseConfigReducer.payment,
      insurance: purchaseConfigReducer.insurance,
      subscriptionPlan: purchaseConfigReducer.subscriptionPlan,
      tradeIn: purchaseConfigReducer.tradeIn,
      userLocation: {
        pincode: userProfileDataReducer.pincode,
        city: userProfileDataReducer.city,
        state: userProfileDataReducer.state,
        country: userProfileDataReducer.country
      },
      myScooter: {
        configuredAccessories: myScooterReducer.configuredAccessories
      }
    }
  };
};

export default connect(mapStateToProps)(Breakup);
