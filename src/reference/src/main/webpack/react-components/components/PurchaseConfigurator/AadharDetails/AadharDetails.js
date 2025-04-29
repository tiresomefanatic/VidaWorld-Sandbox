import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setAadharDataDispatcher,
  setUncheckAaadharSelectDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const AadharDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { aadharData, aadharConfig, onShowPopup } = props;
  const { title, noBtn, yesBtn, cardDetails, infoBox, validationRules } =
    aadharConfig;
  const aadharCheckbox = useRef();
  const aadharNotSelectedBtn = useRef();
  const [error, setError] = useState();

  // const [aadharField, setAadharField] =
  //   aadharData.aadharNumber && aadharData.aadharNumber !== ""
  //     ? useState(aadharData.aadharNumber.split(/(.{4})/).filter((O) => O))
  //     : useState(new Array(3).fill(""));
  // const [aadharOnload, setAadharOnload] = useState(true);
  // const aadharInputRefs = useRef(aadharField.map(() => React.createRef()));

  // const onFocusEvent = (index) => {
  //   for (let item = 1; item < index; item++) {
  //     const currentElement = aadharInputRefs.current[item];
  //     if (!currentElement.value) {
  //       currentElement.focus();
  //       break;
  //     }
  //   }
  // };

  // const handleBackspace = (e, index) => {
  //   // If the user clicks on Backspace, previous input box get focused
  //   if (index !== 0 && e.target.value === "" && e.keyCode === 8) {
  //     e.preventDefault();
  //     aadharInputRefs.current[index - 1].current.focus();
  //   }
  // };

  const handleRadioBtn = (val) => {
    if (val === "yes") {
      setAadharDataDispatcher({ aadharSelected: false });
    } else {
      setAadharDataDispatcher({ aadharSelected: true });
    }
  };
  const handleShowFame = (e) => {
    e.preventDefault();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Middle",
        type: "Link",
        clickType: "other"
      };
      analyticsUtils.trackCtaClick(customLink);
    }
    onShowPopup && onShowPopup(true);
  };

  const handleAadharCheckbox = (checked) => {
    if (checked) {
      setError("");
    }
    // setAadharDataDispatcher({
    //   aadharUsedForRegister: checked
    // });
    aadharNotSelectedBtn.current.checked = true;
    setAadharDataDispatcher({
      aadharSelected: false,
      aadharUsedForRegister: false
    });
  };

  const handleAadhar = (isFocus) => {
    // const aadharNo = aadharField.join("");
    const aadharCheckboxValue = aadharCheckbox.current.checked;

    // if (aadharNo.length == 0) {
    //   isFocus && aadharInputRefs.current[0].current.focus();
    //   setError(validationRules.required.message);
    // } else if (aadharNo.length < 12) {
    //   isFocus && aadharInputRefs.current[0].current.focus();
    //   setError(validationRules.minLength.message);
    // } else if (aadharNo.length > 12) {
    //   isFocus && aadharInputRefs.current[0].current.focus();
    //   setError(validationRules.maxLength.message);
    // } else if (aadharNo.length === 12 && !aadharCheckboxValue) {
    //   aadharCheckbox.current.focus();
    //   setError(validationRules.checkField.message);
    // }

    if (!aadharCheckboxValue) {
      aadharCheckbox.current.focus();
      setError(validationRules.checkField.message);
    } else {
      setError("");
    }
    // setAadharDataDispatcher({
    //   aadharNumber: aadharField.join("")
    // });
    props.handleAadharError(false);
  };

  // const handleChangeEvent = (e, index) => {
  //   e.target.value = e.target.value.replace(/[^0-9]/g, "");
  //   const inputType = e.nativeEvent.inputType;
  //   if (e.target.value.length == 4) {
  //     switch (inputType) {
  //       case "deleteContentBackward":
  //         if (index !== 0) {
  //           aadharInputRefs.current[index - 1].current.focus();
  //         } else {
  //           aadharInputRefs.current[index].current.blur();
  //         }
  //         break;
  //       case "deleteContentForward":
  //         aadharInputRefs.current[index].current.focus();
  //         break;
  //       default:
  //         if (index !== 2) {
  //           aadharInputRefs.current[index + 1].current.focus();
  //         } else {
  //           aadharInputRefs.current[index].current.blur();
  //         }
  //         break;
  //     }
  //   }

  //   setAadharField([
  //     ...aadharField.map((d, idx) => {
  //       return idx === index ? e.target.value.trim() : d;
  //     })
  //   ]);
  // };

  // useEffect(() => {
  //   if (!aadharOnload) {
  //     aadharCheckbox.current && handleAadhar(false);
  //   } else {
  //     setAadharOnload(false);
  //   }
  // }, [aadharField]);

  useEffect(() => {
    props.showAadharError && handleAadhar(true);
  }, [props.showAadharError]);

  return (
    <div className="vida-aadhar-details">
      <h1 className="vida-aadhar-details__title">{title}</h1>
      <div
        className="form__group form__field-radio-btn-group vida-aadhar-details__radio-btn"
        onClick={(e) => handleRadioBtn(e.target.value)}
      >
        <div className={"form__field-radio-btn"}>
          <label className="form__field-label">
            {noBtn.label}
            <input
              type="radio"
              name="aadhardetails"
              value="no"
              defaultChecked={aadharData.aadharSelected}
              onClick={() => {
                setAadharDataDispatcher({
                  aadharSelected: true,
                  aadharUsedForRegister: aadharCheckbox.current.checked
                });
              }}
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
        <div className="form__field-radio-btn">
          <label className="form__field-label">
            {yesBtn.label}
            <input
              type="radio"
              name="aadhardetails"
              value="yes"
              ref={aadharNotSelectedBtn}
              defaultChecked={!aadharData.aadharSelected}
              onClick={() =>
                setAadharDataDispatcher({
                  aadharSelected: false,
                  aadharUsedForRegister: false
                })
              }
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
      </div>
      {aadharData.aadharSelected ? (
        <div className="vida-aadhar-details__subsidy-fields">
          <div className="vida-aadhar-details__card-details">
            {/* <h4 className="vida-aadhar-details__card-label">
              {cardDetails.label}
            </h4> */}
            <a
              className="vida-aadhar-details__learn-more"
              href=""
              onClick={(e) => {
                handleShowFame(e);
              }}
            >
              {cardDetails.subsidy.label}
            </a>
          </div>
          {/* <div
            className={`form__group vida-aadhar-details__aadhar-input ${
              error && error.length > 0 && aadharField.join("").length !== 12
                ? "form__group--error"
                : ""
            }`}
          >
            <label className="form__field-label" htmlFor="aadharNumberfield">
              {cardDetails.aadharNumberfield.label}
            </label>
            <div className="form__field-aadhar">
              {aadharField.map((data, index) => {
                return (
                  <input
                    className="form__field-input"
                    key={index}
                    type="text"
                    maxLength="4"
                    value={data}
                    ref={aadharInputRefs.current[index]}
                    onWheel={(e) => e.target.blur()}
                    min="0"
                    placeholder={cardDetails.aadharNumberfield.placeholder}
                    onChange={(e) => handleChangeEvent(e, index)}
                    onFocus={(index) => onFocusEvent(index)}
                    onInput={(e) =>
                      (e.target.value = e.target.value.trim().slice(0, 4))
                    }
                    onKeyDown={(e) => handleBackspace(e, index)}
                  ></input>
                );
              })}
            </div>
          </div>
           */}
          <div className="form__group form__field-checkbox vida-aadhar-details__check-field">
            <label className="form__field-label">
              <span
                dangerouslySetInnerHTML={{
                  __html: cardDetails.checkField.label
                }}
              ></span>
              <input
                type="checkbox"
                defaultChecked={true}
                ref={aadharCheckbox}
                onClick={(e) => {
                  handleAadharCheckbox(e.target.checked);
                }}
              ></input>
              <span
                className={`form__field-checkbox-mark ${
                  props.showAadharError && !aadharCheckbox.current.checked
                    ? "vida-aadhar-details__checkbox-mark-error "
                    : ""
                }`}
              ></span>
            </label>
          </div>
          <div className="vida-aadhar-details__error-log">{error}</div>
        </div>
      ) : (
        <div className="vida-aadhar-details__info">
          <section className="notification notification--info">
            <div className="notification__container">
              <div className="notification__title">
                <span className="notification__icon">
                  <i className="icon-information-circle"></i>
                </span>
                <label className="notification__label">{infoBox.title}</label>
              </div>
              <p className="notification__description">
                {currencyUtils.getCurrencyFormatValue(
                  props.cmpProps.aadhar.fameSubsidyEligibleAmount
                )}{" "}
                {infoBox.description}
                <a
                  href=""
                  onClick={(e) => {
                    handleShowFame(e);
                  }}
                >
                  {cardDetails.subsidy.label}
                </a>
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

AadharDetails.propTypes = {
  showAadharError: PropTypes.bool,
  handleAadharError: PropTypes.func,
  aadharData: PropTypes.object,
  cmpProps: PropTypes.object,
  aadharConfig: PropTypes.shape({
    title: PropTypes.string,
    yesBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    noBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    validationRules: PropTypes.object,
    infoBox: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string
    }),
    cardDetails: PropTypes.shape({
      label: PropTypes.string,
      subsidy: PropTypes.shape({
        label: PropTypes.string
      }),
      aadharNumberfield: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string
      }),
      checkField: PropTypes.shape({
        label: PropTypes.string
      })
    })
  }),
  onShowPopup: PropTypes.func
};
AadharDetails.defaultProps = {
  aadharConfig: {}
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      aadhar: purchaseConfigReducer.aadhar
    }
  };
};
export default connect(mapStateToProps)(AadharDetails);
