import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Timer from "../Timer/Timer";
import { connect } from "react-redux";
import CONSTANT from "../../../site/scripts/constant";

const ProfileOtpForm = (props) => {
  const {
    mobileOtpConfig,
    code,
    mobileNumber,
    showError,
    resendOTPhandler,
    resetTimer
  } = props;
  const { timer, verifyBtn } = mobileOtpConfig;
  const [resend, setResend] = useState(false);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputRefs = useRef(otp.map(() => React.createRef()));
  const otpLength = 5;
  useEffect(() => {
    if (showError) {
      setOtp([...otp.map(() => "")]);
    }
  }, [showError]);
  const verfyBtnRef = useRef(null);

  const handleChangeEvent = (e, index) => {
    const inputType = e.nativeEvent.inputType;
    switch (inputType) {
      case "deleteContentBackward":
        if (index !== 0) {
          otpInputRefs.current[index - 1].current.focus();
        } else {
          otpInputRefs.current[index].current.blur();
        }
        break;
      case "deleteContentForward":
        otpInputRefs.current[index].current.focus();
        break;
      default:
        if (index !== 5) {
          otpInputRefs.current[index + 1].current.focus();
        }
        break;
    }

    setOtp([
      ...otp.map((d, idx) => {
        return idx === index ? e.target.value.trim() : d;
      })
    ]);
  };
  const onFocusEvent = (index) => {
    for (let item = 1; item < index; item++) {
      const currentElement = otpInputRefs.current[item];
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  };

  const handleBackspace = (e, index) => {
    // If the user clicks on Backspace, previous input box get focused
    if (index !== 0 && e.target.value === "" && e.keyCode === 8) {
      e.preventDefault();
      otpInputRefs.current[index - 1].current.focus();
    }
  };

  //On submitting OTP verify details
  const handleOTPSubmit = (e) => {
    e.preventDefault();
    props.verifyOTPHandler && props.verifyOTPHandler(e, otp.join(""));
  };

  // If use wants to change number
  const changeNumber = (e) => {
    e.preventDefault();
    props.changeNumberHandler && props.changeNumberHandler(e);
  };

  //Resend link in OTP form
  const handleResend = (isResend) => {
    setResend(isResend);
  };

  const resendOtp = (e) => {
    resendOTPhandler && resendOTPhandler(e);
  };

  useEffect(() => {
    setOtp(new Array(6).fill(""));
    setResend(false);
  }, [resetTimer]);

  return (
    <form className="form vida-otp">
      <div className="vida-otp__title">
        <h1>{mobileOtpConfig.verifyOTPtitle}</h1>
        <p>
          {mobileOtpConfig.message}
          <span>
            {" "}
            {CONSTANT.NUMBER_REGEX.test(mobileNumber) && code} {mobileNumber}
          </span>
        </p>

        <div>
          <a href="" onClick={changeNumber}>
            {mobileOtpConfig.changeNumberLabel}
          </a>
        </div>
      </div>

      <div className="form__group">
        <label className="form__field-label">{mobileOtpConfig.otpLabel}</label>
        <div className="form__field-otp">
          {otp.map((data, index) => {
            return (
              <input
                className="form__field-input"
                key={index}
                type="number"
                maxLength="1"
                value={data}
                ref={otpInputRefs.current[index]}
                onChange={(e) => handleChangeEvent(e, index)}
                onFocus={(index) => onFocusEvent(index)}
                onInput={(e) =>
                  (e.target.value = e.target.value.trim().slice(0, 1))
                }
                onKeyDown={(e) => handleBackspace(e, index)}
                onKeyUp={(e) => {
                  if (
                    e.keyCode === 13 &&
                    otp.join("").length === otpLength + 1
                  ) {
                    verfyBtnRef.current.click();
                  }
                }}
              ></input>
            );
          })}
        </div>
        {showError && (
          <div
            className={
              showError ? "form__group form__group--error" : "form__group"
            }
          >
            <p className="form__field-message">{showError}</p>
          </div>
        )}
      </div>

      <div className="vida-otp__timer">
        <Timer
          resendHandler={handleResend}
          timer={timer}
          resetTimer={resetTimer}
        ></Timer>
        <a
          href="#"
          className={`${resend ? "" : "disabled"}`}
          onClick={resendOtp}
        >
          {mobileOtpConfig.resendLabel}
        </a>
      </div>

      <div className="vida-otp__btn-container">
        <button
          type="button"
          className="btn btn--primary btn--full-width"
          onClick={handleOTPSubmit}
          ref={verfyBtnRef}
          disabled={!(otp.join("").length > otpLength)}
        >
          {verifyBtn.label}
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    code: userProfileDataReducer.code,
    email: userProfileDataReducer.email
  };
};

ProfileOtpForm.propTypes = {
  mobileOtpConfig: PropTypes.shape({
    verifyOTPtitle: PropTypes.string,
    message: PropTypes.string,
    emailVerifyMessage: PropTypes.object,
    changeNumberLabel: PropTypes.string,
    changeEmailLabel: PropTypes.string,
    otpLabel: PropTypes.string,
    resendLabel: PropTypes.string,
    timer: PropTypes.shape({
      minutes: PropTypes.number,
      seconds: PropTypes.number
    }),
    disclaimer: PropTypes.shape({
      label: PropTypes.string,
      message: PropTypes.string
    }),
    verifyBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  code: PropTypes.string,
  mobileNumber: PropTypes.string,
  email: PropTypes.string,
  verifyOTPHandler: PropTypes.func,
  changeNumberHandler: PropTypes.func,
  handleResend: PropTypes.bool,
  showError: PropTypes.string,
  resendOTPhandler: PropTypes.func,
  resetTimer: PropTypes.bool
};

ProfileOtpForm.defaultProps = {
  config: {},
  handleResend: true
};

export default connect(mapStateToProps)(ProfileOtpForm);
