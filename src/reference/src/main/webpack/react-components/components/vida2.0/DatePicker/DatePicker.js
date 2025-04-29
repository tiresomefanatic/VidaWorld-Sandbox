import React, { useEffect, useState } from "react";
import Calendar from "short-react-calendar";
import appUtils from "../../../../site/scripts/utils/appUtils";
import PropTypes from "prop-types";

const DatePicker = ({ selectedDate, selectedTime }) => {
  const [defaultDate, setDate] = useState(new Date());
  const defaultTime = "10:00 AM - 06:00 PM";
  const [isslotActive, setSlotActive] = useState(true);

  const disableDates = ({ activeStartDate, date, view }) => {
    //Temp data for now. API need to be implemented later
    const a = date.getDay() % 2 === 0;
    // console.log(date.getDay(), a);
    return a;
  };

  useEffect(() => {
    selectedDate(defaultDate.toLocaleDateString("en-CA").toString());
    selectedTime(defaultTime);
  }, []);

  const timeSlotHandler = (event) => {
    selectedTime(event.target.value);
    setSlotActive(!isslotActive);
  };

  const changeHandler = (value) => {
    selectedDate(value.toLocaleDateString("en-CA").toString());
    setDate(value);
  };

  return (
    <>
      <div className="vida-date-picker">
        <h4 className="vida-availbility-msg">Available from 10AM to 6PM </h4>
        <div className="vida-calendar">
          <Calendar
            value={defaultDate}
            // calendarType="ISO 8601"
            oneWeekCalendar={true}
            next2={false}
            prev2={false}
            tileDisabled={disableDates}
            // onClick={changeHandler}
            onChange={changeHandler}
          />
        </div>
        <div className="vida-time-slot-container">
          <div className="vida-time-slot-header">
            <img
              src={`${appUtils.getConfig(
                "resourcePath"
              )}images/svg/chevron-left.svg`}
            />
            <p>Select Time</p>

            <img
              src={`${appUtils.getConfig(
                "resourcePath"
              )}images/svg/chevron-right.svg`}
            />
          </div>
          <div className="vida-time-slot-content">
            {/* need to loop the data from api */}
            <button
              className={`vida-time-slot ${
                isslotActive ? "vida-slot-active" : ""
              }`}
              onClick={timeSlotHandler}
              value={defaultTime}
            >
              {defaultTime}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatePicker;

DatePicker.propTypes = {
  onChangeHandler: PropTypes.func,
  selectedDate: PropTypes.func,
  selectedTime: PropTypes.func
};
