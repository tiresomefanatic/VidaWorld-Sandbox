import React, { useRef } from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import transition from "react-element-popper/animations/transition";
import opacity from "react-element-popper/animations/opacity";
import PropTypes from "prop-types";

const DateField = ({
  label,
  name,
  value,
  iconClass,
  control,
  errors,
  validationRules,
  hideYear,
  hideMonth,
  minDate,
  maxDate,
  placeholder,
  mainPosition,
  fixMainPosition,
  calendarPosition,
  disabled,
  onChangeHandler
}) => {
  const datePickerRef = useRef();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const changeHandler = (dateChanged) => {
    onChangeHandler && onChangeHandler(dateChanged);
  };

  return (
    <div
      className={`form__group form__group--datepicker ${
        errors[name] ? "form__group--error" : ""
      }`}
    >
      <label htmlFor={label} className="form__field-label">
        {label}
      </label>

      {iconClass && (
        <i className={`${iconClass}` + `${disabled ? " disabled" : ""}`}></i>
      )}

      <Controller
        control={control}
        name={name}
        value={value}
        rules={{ required: true }}
        render={({ field: { onChange, name } }) => {
          return (
            <DatePicker
              id={name}
              value={value ? value : ""}
              mainPosition="bottom"
              minDate={minDate}
              maxDate={maxDate}
              placeholder={placeholder}
              ref={datePickerRef}
              weekDays={weekDays}
              className="custom-date-picker"
              hideYear={hideYear}
              hideMonth={hideMonth}
              weekStartDayIndex={1}
              format="DD/MM/YYYY"
              disabled={disabled}
              editable={false}
              fixMainPosition={true}
              calendarPosition="bottom-center"
              onChange={(date) => {
                onChange(date && date.isValid ? date.format() : "");
                date && date.isValid ? changeHandler(date.format()) : "";
              }}
              animations={[
                opacity(),
                transition({
                  from: 40,
                  transition:
                    "all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)"
                })
              ]}
            />
          );
        }}
      />
      {errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules.required && validationRules.required.message}
          </p>
        </>
      )}
      {errors && errors[name] && errors[name].type === "custom" && (
        <>
          <p className="form__field-message">
            {errors && errors[name] && errors[name].message}
          </p>
        </>
      )}
    </div>
  );
};

DateField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  iconClass: PropTypes.string,
  hideYear: PropTypes.bool,
  hideMonth: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  mainPosition: PropTypes.string,
  fixMainPosition: PropTypes.bool,
  calendarPosition: PropTypes.string,
  control: PropTypes.any,
  placeholder: PropTypes.string,
  errors: PropTypes.shape({}),
  disabled: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  validationRules: PropTypes.shape({
    required: PropTypes.shape({
      message: PropTypes.string
    })
  })
};

DateField.defaultProps = {
  label: "",
  hideYear: false,
  hideMonth: false,
  value: "",
  minDate: "",
  fixMainPosition: true,
  calendarPosition: "bottom-center",
  maxDate: "",
  disabled: false
};

export default DateField;
