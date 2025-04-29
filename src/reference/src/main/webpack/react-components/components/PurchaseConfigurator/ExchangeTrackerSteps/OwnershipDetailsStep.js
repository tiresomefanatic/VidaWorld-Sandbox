import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Dropdown from "../../form/Dropdown/Dropdown";
import DateField from "../../form/DateField/DateField";
import { DateObject } from "react-multi-date-picker";
import { setTradeInDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import InputField from "../../form/InputField/InputField";
import Popup from "../../Popup/Popup";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const getLastYears = (limit) => {
  const date = new Date();
  const year = date.getFullYear();
  const yearsList = new Array(Number(limit)).fill(year).map((item, idx) => ({
    label: String(item - idx),
    value: String(item - idx)
  }));

  return yearsList;
};
const MonthsList = () => {
  const MonthsList = new Array(12).fill(1).map((item, idx) => ({
    label: String(item + idx),
    value: String(item + idx)
  }));
  return MonthsList;
};

const getMaxDate = () => {
  const date = new DateObject();
  const { year, day } = date;
  const month = date.month.number;

  return `${year + 10}/${month}/${day}`;
};
const formatDate = (date) => {
  return date.split("/").reverse().join("/");
};
function OwnershipDetailsStep({
  ownershipDetails,
  cmpProps,
  actionBtns,
  handleStep,
  handleCloseMainPopup,
  handlePurchaseDateChange
}) {
  const {
    stepTitle,
    title,
    registrationNumberField,
    numberField,
    ownershipField,
    insuranceValidityField,
    manufactureYearField,
    manufactureMonthField,
    challanInfo,
    hypothecationInfo,
    manufacturePurchaseCheck
  } = ownershipDetails;
  const {
    register_number,
    number_of_owner,
    insurance_validity,
    ownership_type,
    year_mfg,
    challan_info,
    month_mfg,
    hypothecation_info
  } = cmpProps;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [challan, setChallan] = useState(challan_info);
  const [hypothecation, setHypothecation] = useState(hypothecation_info);
  const [dateState, setDateState] = useState(insurance_validity);
  const [dateValidation, setDateValidation] = useState(
    insuranceValidityField.validationRules
  );
  const [isManufDatesError, setIsManufDatesError] = useState(false);

  // getMaxDate();
  const [open, setOpen] = useState(false);
  const [manufactureYearData] = useState({
    options: manufactureYearField.limit
      ? [
          ...manufactureYearField.options,
          ...getLastYears(manufactureYearField.limit)
        ]
      : manufactureYearField.options,
    value: year_mfg || ""
  });
  const [manufactureYMonthData] = useState({
    options:
      [...manufactureMonthField.options, ...MonthsList()] ||
      manufactureMonthField.options,
    value: month_mfg || ""
  });
  useEffect(() => {
    register_number && setValue(registrationNumberField.name, register_number);
    number_of_owner && setValue(numberField.name, number_of_owner);
    insurance_validity &&
      setValue(insuranceValidityField.name, insurance_validity);
    ownership_type && setValue(ownershipField.name, ownership_type);
    year_mfg && setValue(manufactureYearField.name, year_mfg);
    month_mfg && setValue(manufactureMonthField.name, month_mfg);
    challan_info && setValue(challanInfo.name, challan_info);
    hypothecation_info && setValue(hypothecationInfo.name, hypothecation_info);

    const additionalPageName = `:${title}`;
    analyticsUtils.trackExchangePageLoad(additionalPageName);
  }, []);

  const handleDropdownChange = async (name, value) => {
    if (value !== "") {
      if (
        name === manufactureMonthField.name ||
        name === manufactureYearField.name
      ) {
        setIsManufDatesError(false);
      }

      if (name === insuranceValidityField.name) {
        setDateState(value);
      }
      setValue(name, value);
    }
  };
  const handleFormSubmit = async (formData, event) => {
    const isMfgDateOk = await handlePurchaseDateChange(
      formData.month_mfg,
      formData.year_mfg
    );
    if (!isMfgDateOk) {
      setIsManufDatesError(true);
    } else {
      const today = new DateObject();
      const todayDate = today.format();
      const selectedDate = formatDate(formData.insurance_validity);
      const selected = new Date(selectedDate);
      const current = new Date();
      if (todayDate !== selectedDate && selected < current) {
        setError(insuranceValidityField.name, { type: "required" });
        setValue(insuranceValidityField.name, "");
        setDateValidation(insuranceValidityField.invalidRules);
      } else {
        if (challan && hypothecation) {
          setTradeInDataDispatcher({
            ...formData
          });
          handleStep(3);
          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.nativeEvent.submitter.innerText,
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const additionalPageName = `:${title}`;
            analyticsUtils.trackHeroSureCTAEvent(
              customLink,
              additionalPageName
            );
          }
        } else {
          setOpen(true);
        }
      }
    }
  };
  const handleBack = () => {
    handleStep(1);
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

  const handleChallanInfo = (e) => {
    setChallan(e.target.checked);
  };

  const handleHypothecation = (e) => {
    setHypothecation(e.target.checked);
  };
  const handleDateChange = (dateValue) => {
    setDateState(dateValue);
    const today = new DateObject();
    const todayDate = today.format();
    const selectedDate = formatDate(dateValue);
    const selected = new Date(selectedDate);
    const current = new Date();
    if (todayDate !== selectedDate && selected < current) {
      setError(insuranceValidityField.name, { type: "required" });
      setValue(insuranceValidityField.name, "");
      setDateValidation(insuranceValidityField.invalidRules);
    } else {
      clearErrors(insuranceValidityField.name);
      handleDropdownChange(insuranceValidityField.name, dateValue);
    }
    // console.log(cdate.format("MM/YY"));
  };
  return (
    <div className="vida-exchange-tracker-steps__step-two">
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
            <InputField
              name={registrationNumberField.name}
              label={registrationNumberField.label}
              value={register_number}
              placeholder={registrationNumberField.placeholder}
              validationRules={registrationNumberField.validationRules}
              register={register}
              errors={errors}
              control={control}
              clearErrors={clearErrors}
              onChangeHandler={handleDropdownChange}
            />
            <Dropdown
              name={numberField.name}
              label={numberField.label}
              options={numberField.options}
              value={number_of_owner}
              onChangeHandler={handleDropdownChange}
              validationRules={numberField.validationRules}
              control={control}
              errors={errors}
              setValue={setValue}
              register={register}
              clearErrors={clearErrors}
            />
            <Dropdown
              name={ownershipField.name}
              label={ownershipField.label}
              options={ownershipField.options}
              value={ownership_type}
              onChangeHandler={handleDropdownChange}
              validationRules={ownershipField.validationRules}
              control={control}
              errors={errors}
              setValue={setValue}
              register={register}
              clearErrors={clearErrors}
            />
            <DateField
              name={insuranceValidityField.name}
              label={insuranceValidityField.label}
              iconClass={`icon-calendar`}
              placeholder="DD/MM/YYYY"
              maxDate={getMaxDate()}
              validationRules={dateValidation}
              control={control}
              errors={errors}
              value={dateState}
              onChangeHandler={handleDateChange}
              // onChangeHandler={handleDropdownChange}
            />

            <div className="vida-exchange-tracker-steps__state-wrapper vida-exchange-tracker-steps__state-wrapper-date">
              <Dropdown
                name={manufactureMonthField.name}
                label={manufactureMonthField.label}
                options={manufactureYMonthData.options}
                value={manufactureYMonthData.value}
                onChangeHandler={handleDropdownChange}
                validationRules={manufactureMonthField.validationRules}
                control={control}
                errors={
                  isManufDatesError
                    ? {
                        [manufactureMonthField.name]: {
                          type: "custom",
                          message: ""
                        }
                      }
                    : errors
                }
                setValue={setValue}
                register={register}
                clearErrors={clearErrors}
              />
              <Dropdown
                name={manufactureYearField.name}
                label=""
                options={manufactureYearData.options}
                value={manufactureYearData.value}
                onChangeHandler={handleDropdownChange}
                validationRules={manufactureYearField.validationRules}
                control={control}
                errors={
                  isManufDatesError
                    ? {
                        [manufactureYearField.name]: {
                          type: "custom",
                          message: manufacturePurchaseCheck?.message
                        }
                      }
                    : errors
                }
                setValue={setValue}
                register={register}
                clearErrors={clearErrors}
              />
            </div>
            <div className="vida-exchange-tracker-steps__checkbox_container">
              <div className="form__group form__group--error form__field-checkbox vida-exchange-tracker-steps__checkbox">
                <label className="form__field-label">
                  {challanInfo.label}
                  <input
                    type="checkbox"
                    defaultChecked
                    value={challan}
                    onClick={handleChallanInfo}
                  ></input>
                  <span className="form__field-checkbox-mark"></span>
                </label>
              </div>
              <div className="form__group form__group--error form__field-checkbox vida-exchange-tracker-steps__checkbox">
                <label className="form__field-label">
                  {hypothecationInfo.label}
                  <input
                    type="checkbox"
                    defaultChecked
                    value={hypothecation}
                    onClick={handleHypothecation}
                  ></input>
                  <span className="form__field-checkbox-mark"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="vida-exchange-tracker-steps__btn-container">
            <button
              className="btn btn--primary vida-exchange-tracker-steps__btn"
              onClick={handleSubmit}
            >
              {actionBtns.continueBtn.label}
            </button>
            <button
              type="button"
              className="btn btn--secondary vida-exchange-tracker-steps__btn"
              onClick={handleBack}
            >
              {actionBtns.backBtn.label}
            </button>
          </div>
        </form>
        {open && (
          <Popup handlePopupClose={() => setOpen(false)} mode="medium">
            <h3 className="vida-exchange-tracker-steps__popup-title">
              {challanInfo.confirmation.title}
            </h3>
            <p className="vida-exchange-tracker-steps__popup-desc">
              {challanInfo.confirmation.description}
            </p>
            <div className="vida-exchange-tracker-steps__popup-btn-wrapper">
              <button
                className="btn btn--primary"
                onClick={() => handleCloseMainPopup(true)}
              >
                {challanInfo.confirmation.okBtn.label}
              </button>
            </div>
          </Popup>
        )}
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

OwnershipDetailsStep.propTypes = {
  ownershipDetails: PropTypes.shape({
    stepTitle: PropTypes.string,
    title: PropTypes.string,
    registrationNumberField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    numberField: PropTypes.shape({
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
    ownershipField: PropTypes.shape({
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
    insuranceValidityField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object,
      invalidRules: PropTypes.object
    }),
    manufactureYearField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      limit: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    }),
    manufactureMonthField: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      )
    }),
    challanInfo: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      validationRules: PropTypes.object,
      confirmation: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        okBtn: PropTypes.shape({
          label: PropTypes.string
        })
      })
    }),
    hypothecationInfo: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      validationRules: PropTypes.object,
      confirmation: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        okBtn: PropTypes.shape({
          label: PropTypes.string
        })
      })
    }),
    manufacturePurchaseCheck: PropTypes.shape({
      message: PropTypes.string
    })
  }),
  actionBtns: PropTypes.shape({
    continueBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    backBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    acceptBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notInterestedBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  handleStep: PropTypes.func,
  cmpProps: PropTypes.object,
  handleCloseMainPopup: PropTypes.func,
  handlePurchaseDateChange: PropTypes.func
};
OwnershipDetailsStep.defaultProps = {
  cmpProps: {}
};
export default connect(mapStateToProps)(OwnershipDetailsStep);
