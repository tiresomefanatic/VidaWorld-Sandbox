import React, { useState, useRef, useEffect } from "react";
import Logger from "../../../services/logger.service";

const OtpFormTest = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const otpInputRefs = useRef(otp.map(() => React.createRef()));

  const [otp2, setOtp2] = useState(new Array(4).fill(""));
  const otpInputRefs2 = useRef(otp2.map(() => React.createRef()));
  useEffect(() => {
    setOtp([...otp.map(() => "")]);
    setOtp2([...otp2.map(() => "")]);
  }, []);

  // Input field validation
  const isInputValid = (value) => {
    return value >= 0 && value <= 9;
  };

  //Validation for OTP input
  const handleKeyUp = (e, index) => {
    if (isInputValid(String.fromCharCode(e.keyCode).trim())) {
      if (
        e.keyCode === 8 ||
        e.key === "Backspace" ||
        e.keyCode === 46 ||
        e.key === "Delete" ||
        e.keyCode === 32 ||
        e.key === "Spacebar"
      ) {
        otpInputRefs.current[index].current.focus();
      } else if (index >= otpInputRefs.current.length - 1) {
        otpInputRefs.current[index].current.focus();
      } else {
        otpInputRefs.current[index + 1].current.focus();
      }
    }

    if (
      e.keyCode === 8 ||
      e.key === "Backspace" ||
      e.keyCode === 46 ||
      e.key === "Delete"
    ) {
      if (index > 0 && index <= otpInputRefs.current.length - 1) {
        otpInputRefs.current[index - 1].current.focus();
      } else {
        otpInputRefs.current[index].current.focus();
      }
    }
  };

  //
  const handleOTPChange = (el, index) => {
    try {
      if (isNaN(el.value)) {
        return false;
      }
      if (isInputValid(el.value)) {
        setOtp([...otp.map((d, idx) => (idx === index ? el.value.trim() : d))]);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const Type1 = () => (
    <div className="form__group">
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
              onKeyUp={(e) => handleKeyUp(e, index)}
              onTouchEnd={(e) => handleKeyUp(e, index)}
              onChange={(e) => handleOTPChange(e.target, index)}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
            ></input>
          );
        })}
      </div>
    </div>
  );

  const onChangeEvent = (event, index) => {
    const eventCode = event.which || event.keyCode;
    if (index !== 3) {
      otpInputRefs2.current[index + 1].current.focus();
    } else {
      otpInputRefs2.current[index].current.blur();
    }
    if (eventCode === 8 && index !== 1) {
      otpInputRefs2.current[index - 1].current.focus();
    }
    setOtp2([
      ...otp2.map((d, idx) => {
        return idx === index ? event.target.value.trim() : d;
      })
    ]);
  };

  const onFocusEvent = (index) => {
    for (let item = 1; item < index; item++) {
      const currentElement = otpInputRefs2.current[item];
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  };

  const Type2 = () => (
    <div className="form__group">
      <div className="form__field-otp">
        {otp2.map((numVal, index) => {
          return (
            <input
              className="form__field-input"
              key={index}
              type="number"
              maxLength="1"
              value={numVal}
              ref={otpInputRefs2.current[index]}
              onChange={(e) => onChangeEvent(e, index)}
              onFocus={(index) => onFocusEvent(index)}
            ></input>
          );
        })}
      </div>
    </div>
  );

  return (
    <form className="form vida-otp">
      <div className="vida-otp__title">
        <h1>Type-1</h1>
      </div>
      {Type1()}

      <div className="vida-otp__title">
        <h1>Type-2</h1>
      </div>
      {Type2()}
    </form>
  );
};

export default OtpFormTest;
