import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Timer from "../Timer/Timer";
import { connect } from "react-redux";
import { useGenerateOTP } from "../../../hooks/userAccess/userAccessHooks";
import CONSTANT from "../../../../site/scripts/constant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { RSAUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

const OtpForm = (props) => {
  const {
    otpConfig,
    countryCode,
    numberOrEmail,
    mobileNumber,
    email,
    showEmailverify,
    showEmailOtp,
    cancelEmailVerification,
    sendEmailOtp,
    isLogin,
    showDisclaimer,
    genericConfig,
    showSteps,
    showError,
    activeTab,
    resendOtpHandler,
    handleChangeOtpText,
    altDataPosition
  } = props;
  const {
    timer,
    verifyBtn,
    emailVerifyBtns,
    emailVerifyMessage,
    otpFormPrimaryText,
    otpFormBoldText
  } = otpConfig;
  const [resend, setResend] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputRefs = useRef(otp.map(() => React.createRef()));
  const verfyBtnRef = useRef(null);
  const defaultCountryCode = appUtils.getConfig("defaultCountryCode");
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const otpLength = 5;
  useEffect(() => {
    if (showError || showEmailverify) {
      setOtp([...otp.map(() => "")]);
    }
  }, [showError, showEmailverify]);

  const handleChangeEvent = (e, index) => {
    let ignoreFocus = true;
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
      case "insertFromPaste":
        ignoreFocus = false;
        break;
      case "insertText":
        if (e.nativeEvent.data.length > 1) {
          ignoreFocus = false;
          const insertTextOTP = [...e.nativeEvent.data];
          let revisedOTP;
          if (insertTextOTP.length < 6) {
            revisedOTP = insertTextOTP.concat(
              new Array(6 - insertTextOTP.length).fill("")
            );
          } else {
            revisedOTP = [...e.nativeEvent.data];
          }
          setOtp(revisedOTP);
          otpInputRefs.current[insertTextOTP.length - 1].current.focus();
          break;
        } else {
          ignoreFocus = true;
        }
      default:
        if (index !== 5) {
          otpInputRefs.current[index + 1].current.focus();
        }
        break;
    }
    if (ignoreFocus) {
      setOtp([
        ...otp.map((d, idx) => {
          return idx === index ? e.target.value.trim() : d;
        })
      ]);
    }
  };

  const onFocusEvent = (index) => {
    for (let item = 1; item < index; item++) {
      const currentElement = otpInputRefs.current[item];
      if (!currentElement.value) {
        currentElement.current.focus();
        break;
      }
    }
  };

  const handlePaste = (ev) => {
    const clip = ev.clipboardData.getData("text");
    const pin = clip.replace(/\s/g, "");
    const ch = [...pin];
    let revisedOTP,
      focusIndex = 5;
    if (ch.length > 6) {
      revisedOTP = ch.splice(0, 6);
    } else if (ch.length < 6) {
      revisedOTP = ch.concat(new Array(6 - ch.length).fill(""));
      focusIndex = ch.length;
    } else {
      revisedOTP = [...ch];
    }
    setOtp(revisedOTP);
    otpInputRefs.current[focusIndex - 1].current.focus();
  };

  useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal
        })
        .then((otp) => {
          setOtp([...otp.code]);
          ac.abort();
        })
        .catch((err) => {
          ac.abort();
          console.log(err);
        });
    }
  }, []);

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

  //Generating OTP
  const generateOTP = useGenerateOTP(isLogin, showEmailverify);

  const resendOtp = async (e) => {
    e.preventDefault();
    let variables = {
      country_code: countryCode || defaultCountryCode
    };
    if (isLogin) {
      variables = {
        ...variables,
        ...{
          username: RSAUtils.encrypt(numberOrEmail || mobileNumber),
          is_login: isLogin
        }
      };
    } else {
      if (showEmailverify) {
        variables = {
          ...variables,
          ...{
            mobile_number: RSAUtils.encrypt(mobileNumber),
            email: RSAUtils.encrypt(email)
          }
        };
      } else {
        variables = {
          ...variables,
          ...{
            mobile_number: RSAUtils.encrypt(mobileNumber),
            email: RSAUtils.encrypt(email),
            is_login: isLogin
          }
        };
      }
    }
    if (props.handleChangeOtpText) {
      props.handleChangeOtpText();
    }
    props.resendOtpHandler && props.resendOtpHandler();
    setSpinnerActionDispatcher(true);
    if (altDataPosition.toLowerCase() !== "webpopup") {
      const loginResult = await generateOTP({
        variables
      });
      setSpinnerActionDispatcher(false);

      if (loginResult) {
        setResend(false);
        setOtp(new Array(6).fill(""));
        setResetTimer(!resetTimer);
      }
    }

    if (altDataPosition.toLowerCase() === "webpopup") {
      setResend(false);
      setOtp(new Array(6).fill(""));
      setResetTimer(!resetTimer);
    }

    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      if (isLogin) {
        analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
      } else {
        if (activeTab === 2) {
          // For prebooking and testdrive
          analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
        } else if (activeTab === 1) {
          analyticsUtils.trackSignupOTPClick(customLink);
        } else {
          analyticsUtils.trackLoginOTPClick(customLink);
        }
      }
    }
  };

  return (
    <form className="form vida-otp">
      {showSteps && (
        <div className="vida-otp__step">
          {genericConfig.stepLabel}
          <span>{showSteps}</span>
          <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
        </div>
      )}
      {/* <div className="vida-otp__title">
        <h1>
          {isLogin
            ? otpConfig.verifyOTPtitle
            : showEmailverify
            ? otpConfig.verifyEmailtitle
            : otpConfig.verifyMobileNumbertitle}
        </h1>
        <p>
          {showEmailverify && !showEmailOtp
            ? emailVerifyMessage.messageOne
            : otpConfig.message}
          {isLogin && (
            <span>
              {" "}
              {CONSTANT.NUMBER_REGEX.test(numberOrEmail) && countryCode}{" "}
              {numberOrEmail}
            </span>
          )}
          {!isLogin && !showEmailverify && (
            <span>
              {" "}
              {CONSTANT.NUMBER_REGEX.test(mobileNumber) && countryCode}{" "}
              {mobileNumber}
            </span>
          )}
          {!isLogin && showEmailverify && (
            <span>
              {" "}
              {email} . {!showEmailOtp && emailVerifyMessage.messageTwo}
            </span>
          )}
        </p>

        {(isLogin || (!isLogin && !showEmailverify)) && (
          <div>
            <a href="" onClick={changeNumber}>
              {otpConfig.changeNumberLabel}
            </a>
          </div>
        )}
      </div> */}

      <div className="user-access-otp-primary-text">
        <p>{otpFormPrimaryText}</p>
      </div>
      <div className="user-access-otp-bold-text">
        <p>{otpFormBoldText}</p>
      </div>

      {(!showEmailverify || showEmailOtp) && (
        <>
          <div className="form__group vida-otp-form-group">
            {/* <label className="form__field-label">{otpConfig.otpLabel}</label> */}
            <div className="form__field-otp">
              {otp.map((data, index) => {
                return (
                  <input
                    className="form__field-input otp-form__field-input"
                    key={index}
                    type="number"
                    maxLength="1"
                    value={data}
                    ref={otpInputRefs.current[index]}
                    onPaste={(ev) => handlePaste(ev)}
                    onChange={(e) => handleChangeEvent(e, index)}
                    onFocus={(index) => onFocusEvent(index)}
                    onInput={(e) =>
                      (e.target.value = e.target.value.trim().slice(0, 1))
                    }
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13 && index === 5) {
                        verfyBtnRef.current.click();
                      }
                    }}
                    placeholder="_"
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
                <p
                  className="form__field-message"
                  dangerouslySetInnerHTML={{
                    __html: showError
                  }}
                ></p>
              </div>
            )}
          </div>

          <div className="vida-otp__timer">
            <div className="user-access-timer-container">
              <a
                href="#"
                className="resend-text"
                data-link-position={otpConfig?.dataPosition || altDataPosition}
                onClick={resendOtp}
                disabled={!resend}
              >
                {otpConfig.resendLabel}
              </a>
              <Timer
                resendHandler={handleResend}
                timer={timer}
                resetTimer={resetTimer}
              ></Timer>
            </div>
            {(isLogin || (!isLogin && !showEmailverify)) && (
              <div>
                <a
                  className="change-number-text"
                  href=""
                  data-link-position={
                    otpConfig?.dataPosition || altDataPosition
                  }
                  onClick={changeNumber}
                >
                  {otpConfig.changeNumberLabel}
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {showDisclaimer && (
        <div className="vida-otp__disclaimer">
          <span className="vida-otp__disclaimer-label">
            {otpConfig.disclaimer.label}
          </span>
          <span className="vida-otp__disclaimer-msg">
            {otpConfig.disclaimer.message}
          </span>
        </div>
      )}

      <div className="vida-access-otp-btn-container">
        {(!showEmailverify || showEmailOtp) && (
          <button
            ref={verfyBtnRef}
            type="button"
            className="btn btn--primary btn--full-width vida-access-otp-btn"
            data-link-position={otpConfig?.dataPosition || altDataPosition}
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleOTPSubmit(e);
            }}
            disabled={!(otp.join("").length > otpLength)}
          >
            {verifyBtn.label}
          </button>
        )}

        {showEmailverify && !showEmailOtp && (
          <>
            <button
              type="button"
              className="btn btn--primary btn--full-width"
              onClick={(event) =>
                sendEmailOtp(
                  {
                    isLogin
                  },
                  event
                )
              }
            >
              {emailVerifyBtns.sendOTPLabel}
            </button>
            <a href="#" onClick={(e) => cancelEmailVerification(e)}>
              {emailVerifyBtns.cancelEmailVerifyLabel}
            </a>
          </>
        )}
      </div>
    </form>
  );
};

const mapStateToProps = ({ userAccessReducer }) => {
  return {
    countryCode: userAccessReducer.countryCode,
    numberOrEmail: userAccessReducer.numberOrEmail,
    mobileNumber: userAccessReducer.mobileNumber,
    email: userAccessReducer.email
  };
};

OtpForm.propTypes = {
  otpConfig: PropTypes.shape({
    verifyOTPtitle: PropTypes.string,
    verifyMobileNumbertitle: PropTypes.string,
    verifyEmailtitle: PropTypes.string,
    message: PropTypes.string,
    emailVerifyMessage: PropTypes.object,
    changeNumberLabel: PropTypes.string,
    changeEmailLabel: PropTypes.string,
    otpLabel: PropTypes.string,
    resendLabel: PropTypes.string,
    dataPosition: PropTypes.string,
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
    }),
    emailVerifyBtns: PropTypes.object,
    otpFormPrimaryText: PropTypes.string,
    otpFormBoldText: PropTypes.string
  }),
  countryCode: PropTypes.string,
  numberOrEmail: PropTypes.string,
  mobileNumber: PropTypes.string,
  email: PropTypes.string,
  showEmailOtp: PropTypes.bool,
  showEmailverify: PropTypes.bool,
  cancelEmailVerification: PropTypes.func,
  sendEmailOtp: PropTypes.func,
  isLogin: PropTypes.bool,
  showDisclaimer: PropTypes.bool,
  verifyOTPHandler: PropTypes.func,
  changeNumberHandler: PropTypes.func,
  handleResend: PropTypes.bool,
  setUserInfo: PropTypes.func,
  setUserCheckInfo: PropTypes.func,
  genericConfig: PropTypes.object,
  showSteps: PropTypes.number,
  showError: PropTypes.string,
  activeTab: PropTypes.number,
  resendOtpHandler: PropTypes.func,
  altDataPosition: PropTypes.string,
  handleChangeOtpText: PropTypes.func
};

OtpForm.defaultProps = {
  config: {},
  showDisclaimer: false,
  handleResend: true,
  activeTab: 2
};

export default connect(mapStateToProps)(OtpForm);
