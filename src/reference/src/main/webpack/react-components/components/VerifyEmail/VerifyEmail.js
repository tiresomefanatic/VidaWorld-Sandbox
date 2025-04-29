import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const VerifyEmail = (props) => {
  const { config, verifyEmailHandler, email } = props;
  const { otpLabel, otpTitle, otpDescription, verifyBtn } = config;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpInputRefs = useRef(otp.map(() => React.createRef()));
  const otpLength = 5;
  const verfyBtnRef = useRef(null);

  const handleChangeEvent = (e, index) => {
    const inputType = e.nativeEvent.inputType;
    let ignoreFocus = true;
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
    verifyEmailHandler && verifyEmailHandler(e, otp.join(""));
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
      window.addEventListener("DOMContentLoaded", (e) => {
        const ac = new AbortController();
        navigator.credentials
          .get({
            otp: { transport: ["sms"] },
            signal: ac.signal
          })
          .then((otp) => {
            setOtp([...otp.code]);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } else {
      console.log("OTPCredentials disabled");
    }
  }, []);

  return (
    <form className="form vida-otp">
      <div className="vida-otp__title">
        <h1>{otpTitle}</h1>
        <p>
          {otpDescription} <span>{email}</span>
        </p>
      </div>

      <div className="form__group">
        <label className="form__field-label">{otpLabel}</label>
        <div className="form__field-otp">
          {otp.map((data, index) => {
            return (
              <input
                className="form__field-input"
                key={index}
                type="number"
                maxLength="1"
                value={data}
                onPaste={(ev) => handlePaste(ev)}
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
      </div>

      <div className="vida-otp__btn-container">
        <button
          type="button"
          ref={verfyBtnRef}
          className="btn btn--primary btn--action"
          onClick={handleOTPSubmit}
          disabled={!(otp.join("").length > otpLength)}
        >
          {verifyBtn.label}
        </button>
      </div>
    </form>
  );
};

VerifyEmail.propTypes = {
  config: PropTypes.shape({
    otpLabel: PropTypes.string,
    otpTitle: PropTypes.string,
    otpDescription: PropTypes.string,
    verifyBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  verifyEmailHandler: PropTypes.func,
  email: PropTypes.string
};

export default VerifyEmail;
