import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Timer = (props) => {
  const { timer, resetTimer } = props;
  const [seconds, setSeconds] = useState(timer.seconds);
  const [minutes, setMinutes] = useState(timer.minutes);

  let timerVal;

  //To increment seconds and minutes in timer
  const handleTimer = () => {
    let timeLeft = parseInt(timer.minutes) * 60 + parseInt(timer.seconds);

    timerVal = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerVal);
        props.resendHandler && props.resendHandler(true);
      } else {
        setMinutes(Math.floor(timeLeft / 60));
        setSeconds(Math.floor(timeLeft % 60));
      }
    }, 1000);
  };

  //resetting timer on resend button click
  useEffect(() => {
    setMinutes(timer.minutes);
    setSeconds(timer.seconds);
    handleTimer();
  }, [resetTimer]);

  return (
    <div className="timer">
      <span>{minutes < 10 ? "0" + minutes : minutes}:</span>
      <span>{seconds < 10 ? "0" + seconds : seconds}</span>
    </div>
  );
};

Timer.propTypes = {
  handleTimer: PropTypes.func,
  resendHandler: PropTypes.func,
  timer: PropTypes.shape({
    minutes: PropTypes.number,
    seconds: PropTypes.number
  }),
  resetTimer: PropTypes.bool
};

Timer.defaultProps = {
  timer: {
    minutes: 0,
    seconds: 0
  }
};
export default Timer;
