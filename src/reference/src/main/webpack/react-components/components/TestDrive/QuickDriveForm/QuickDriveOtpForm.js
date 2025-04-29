import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const QuickDriveOtpForm = (props) => {
  const { mobileOtpConfig, showError, name, otpFields, resend } = props;

  const [otpValue, setOtpValue] = useState(otpFields);
  const otpInputRefs = useRef(otpFields.map(() => React.createRef()));

  useEffect(() => {
    if (showError) {
      setOtpValue([...otpValue.map(() => "")]);
    }
  }, [showError]);

  useEffect(() => {
    if (!resend) {
      setOtpValue([...otpValue.map(() => "")]);
    }
  }, [resend]);

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
          setOtpValue(revisedOTP);
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
      setOtpValue([
        ...otpValue.map((d, idx) => {
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
    setOtpValue(revisedOTP);
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
          setOtpValue([...otp.code]);
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

  return (
    <>
      <div className="form__group">
        <label className="form__field-label">{mobileOtpConfig.otpLabel}</label>
        <div className="form__field-otp">
          {otpValue.map((data, index) => {
            return (
              <input
                name={name + index}
                className="form__field-input"
                key={index}
                type="number"
                maxLength="1"
                value={data}
                onPaste={(ev) => handlePaste(ev)}
                ref={otpInputRefs.current[index]}
                onChange={(e) => handleChangeEvent(e, index)}
                onFocus={(index) => onFocusEvent(index)}
                onInput={(e) => {
                  e.target.value = e.target.value.trim().slice(0, 1);
                }}
                onKeyDown={(e) => handleBackspace(e, index)}
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
  );
};

QuickDriveOtpForm.propTypes = {
  mobileOtpConfig: PropTypes.shape({
    otpLabel: PropTypes.string
  }),
  showError: PropTypes.string,
  name: PropTypes.string,
  otpFields: PropTypes.any,
  resend: PropTypes.bool
};

QuickDriveOtpForm.defaultProps = {
  config: {},
  name: ""
};

export default QuickDriveOtpForm;
