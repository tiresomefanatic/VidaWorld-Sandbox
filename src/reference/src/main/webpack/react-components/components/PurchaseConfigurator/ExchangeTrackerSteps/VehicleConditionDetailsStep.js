import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Dropdown from "../../form/Dropdown/Dropdown";
import { setTradeInDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import { useGetPriceByExchange } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const Checkbox = ({ id, type, name, handleClick, isChecked }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      onChange={handleClick}
      checked={isChecked}
    />
  );
};
Checkbox.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  handleClick: PropTypes.func,
  isChecked: PropTypes.bool
};
function VehicleConditionDetailsStep({
  vehicleConditionDetails,
  cmpProps,
  actionBtns,
  handleStep,
  handlePopupClose,
  tradeInSelected
}) {
  const {
    stepTitle,
    title,
    rateConditionDetails,
    distanceDetails,
    issuesListDetails,
    networkError,
    getQuoteWarning
  } = vehicleConditionDetails;
  const {
    rate_the_condition,
    kms_run,
    vehicle_make,
    vehicle_model,
    vehicle_type,
    vehicle_cc,
    purchase_date,
    purchase_city,
    purchase_state,
    register_number,
    number_of_owner,
    ownership_type,
    insurance_validity,
    remark,
    year_mfg,
    month_mfg,
    challan_info,
    hypothecation_info
  } = cmpProps;
  const getPriceByExchange = useGetPriceByExchange();

  const [errorMsg, setErrorMsg] = useState();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [isCheck, setIsCheck] = useState([]);

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    rate_the_condition &&
      setValue(rateConditionDetails.name, rate_the_condition);
    kms_run && setValue(distanceDetails.name, kms_run);
    if (remark) {
      const list = JSON.parse(remark);
      const issues = issuesListDetails
        .filter((item) => list.includes(item.value))
        .map((item) => item.value);
      setIsCheck(issues);
    }
    const additionalPageName = `:${title}`;
    analyticsUtils.trackExchangePageLoad(additionalPageName);
  }, []);

  const queryString = location.href.split("?")[1];
  const decryptedParams = cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);

  const handleDropdownChange = async (name, value) => {
    if (value !== "") {
      setValue(name, value);
    }
  };

  const handleFormSubmit = async (formData, event) => {
    setSpinnerActionDispatcher(true);
    try {
      const response = await getPriceByExchange({
        variables: {
          sf_order_id:
            params && params.get("orderId")
              ? params.get("orderId")
              : "SO22081031",
          vehicle_make,
          vehicle_model,
          vehicle_type,
          vehicle_cc,
          purchase_date,
          purchase_city,
          purchase_state,
          register_number,
          number_of_owner,
          ownership_type,
          insurance_validity,
          rate_the_condition: formData.rate_the_condition,
          kms_run: formData.kms_run,
          remark: isCheck.length > 0 ? JSON.stringify(isCheck) : "",
          year_mfg,
          month_mfg,
          challan_info,
          hypothecation_info
        }
      });
      if (response && response.data.getPriceByExchangeData.status === "200") {
        const { exchange_calculate_price } =
          response.data.getPriceByExchangeData;
        setTradeInDataDispatcher({
          ...formData,
          exchange_amount: exchange_calculate_price
        });
        handleStep(4);
        setSpinnerActionDispatcher(false);
        if (isAnalyticsEnabled) {
          const customLink = {
            name: event.nativeEvent.submitter.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const additionalPageName = `:${title}`;
          analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
        }
      } else if (response && response.data.getPriceByExchangeData.message) {
        setErrorMsg(response.data.getPriceByExchangeData);
        setTradeInDataDispatcher({
          ...cmpProps,
          popupError: true
        });
        handlePopupClose();
        setSpinnerActionDispatcher(false);
      } else {
        setTradeInDataDispatcher({
          ...cmpProps,
          popupError: true
        });
        setErrorMsg({ message: networkError });
        handlePopupClose();
        setSpinnerActionDispatcher(false);
      }
    } catch (error) {
      Logger.error(error);
      setTradeInDataDispatcher({
        ...cmpProps,
        popupError: true
      });
      setErrorMsg({ message: networkError });
      handlePopupClose();
      setSpinnerActionDispatcher(false);
    }
  };

  const handleBack = () => {
    handleStep(2);
    if (isAnalyticsEnabled) {
      const customLink = {
        name: "Back",
        position: "Bottom",
        type: "Button",
        clickType: "other"
      };
      const additionalPageName = `:${title}`;
      analyticsUtils.trackHeroSureCTAEvent(customLink, additionalPageName);
    }
  };
  return (
    <div className="vida-exchange-tracker-steps__step-three">
      <p>{stepTitle}</p>
      <h3 className="vida-exchange-tracker-steps__heading">{title}</h3>
      <div className="vida-exchange-tracker-steps__form-two-wrapper">
        <form
          className="vida-exchange-tracker-steps__form"
          onSubmit={handleSubmit((formData, event) =>
            handleFormSubmit(formData, event)
          )}
        >
          <div className="vida-exchange-tracker-steps__form-controls">
            <Dropdown
              name={rateConditionDetails.name}
              label={rateConditionDetails.label}
              options={rateConditionDetails.options}
              value={rate_the_condition}
              onChangeHandler={handleDropdownChange}
              validationRules={rateConditionDetails.validationRules}
              control={control}
              errors={errors}
              setValue={setValue}
              register={register}
              clearErrors={clearErrors}
            />

            <Dropdown
              name={distanceDetails.name}
              label={distanceDetails.label}
              options={distanceDetails.options}
              value={kms_run}
              onChangeHandler={handleDropdownChange}
              validationRules={distanceDetails.validationRules}
              control={control}
              errors={errors}
              setValue={setValue}
              register={register}
              clearErrors={clearErrors}
            />
            <div className="vida-exchange-tracker-steps__condition-wrapper">
              {issuesListDetails.map((issueList, idx) => (
                <div
                  className="form__group form__field-checkbox"
                  key={issueList.value}
                >
                  <label className="form__field-label">
                    {issueList.label}
                    <Checkbox
                      key={idx}
                      type="checkbox"
                      name={issueList.label}
                      id={issueList.value}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(issueList.value)}
                    />

                    <span className="form__field-checkbox-mark"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          {errorMsg && (
            <div className="form__group--error vida-exchange-tracker-steps__error-wrapper">
              <p className="form__field-message">{errorMsg.message}</p>
            </div>
          )}

          <div className="vida-exchange-tracker-steps__btn-container">
            {tradeInSelected && (
              <div className="vida-exchange-tracker-steps__quote-warning">
                {getQuoteWarning}
              </div>
            )}
            <button
              className="btn btn--primary vida-exchange-tracker-steps__btn"
              type="submit"
              onClick={handleSubmit}
            >
              {actionBtns.getQuoteBtn.label}
            </button>
            <button
              className="btn btn--secondary vida-exchange-tracker-steps__btn"
              type="button"
              onClick={handleBack}
            >
              {actionBtns.backBtn.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      ...purchaseConfigReducer.tradeIn
    }
  };
};

VehicleConditionDetailsStep.propTypes = {
  vehicleConditionDetails: PropTypes.shape({
    stepTitle: PropTypes.string,
    title: PropTypes.string,
    networkError: PropTypes.string,
    rateConditionDetails: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    distanceDetails: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      validationRules: PropTypes.object
    }),
    issuesListDetails: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    ),
    getQuoteWarning: PropTypes.string
  }),
  actionBtns: PropTypes.shape({
    continueBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    backBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    getQuoteBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notInterestedBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  handleStep: PropTypes.func,
  handlePopupClose: PropTypes.func,
  cmpProps: PropTypes.object,
  tradeInSelected: PropTypes.bool
};
VehicleConditionDetailsStep.defaultProps = {
  cmpProps: {}
};
export default connect(mapStateToProps)(VehicleConditionDetailsStep);
