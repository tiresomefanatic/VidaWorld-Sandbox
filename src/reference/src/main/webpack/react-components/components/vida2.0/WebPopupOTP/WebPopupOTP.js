import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// import { useGenerateOTP } from "../../../hooks/userAccess/userAccessHooks";

const WebPopupOTP = (props) => {
  const { otpConfig, showError, altDataPosition, isdisabled, isResend } = props;
  const { verifyBtn, otpFormPrimaryText, otpFormBoldText } = otpConfig;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputRefs = useRef(otp.map(() => React.createRef()));
  const verfyBtnRef = useRef(null);

  const showEmailverify = false;

  const otpLength = 5;

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

  useEffect(() => {
    if (isResend) {
      setOtp(new Array(6).fill(""));
    }
  }, [isResend]);

  return (
    <form className="form vida-otp">
      <div className="user-access-otp-primary-text">
        <p>{otpFormPrimaryText}</p>
      </div>
      <div className="user-access-otp-bold-text">
        <p>{otpFormBoldText}</p>
      </div>
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
                  disabled={isdisabled}
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
      </>

      <div className="vida-access-otp-btn-container">
        {(!showEmailverify || showEmailOtp) && (
          <button
            ref={verfyBtnRef}
            type="button"
            className="btn btn--primary btn--full-width vida-access-otp-btn"
            data-link-position={otpConfig?.dataPosition || altDataPosition}
            onClick={(e) => handleOTPSubmit(e)}
            disabled={!(otp.join("").length > otpLength)}
          >
            {verifyBtn.label}
          </button>
        )}
      </div>
    </form>
  );
};

WebPopupOTP.propTypes = {
  otpConfig: PropTypes.object,
  handleChangeOtpText: PropTypes.func,
  resendOtpHandler: PropTypes.func,
  isLogin: PropTypes.bool,
  showError: PropTypes.string,
  altDataPosition: PropTypes.string,
  verifyOTPHandler: PropTypes.func,
  isdisabled: PropTypes.bool,
  isResend: PropTypes.bool
};

export default WebPopupOTP;
